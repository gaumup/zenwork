//main class
/*@Depends:
 *	jquery.core.js
 *	jquery.widget.js
 *	jquery.datepicker.js
 *	jquery.autocomplete.js
 */
//make sure DOM are ready

(function($) {
	jQuery.widget("ui.smartgrid", {
        widgetEventPrefix: "smartgrid", //default get widget name
    //options
        options: {
        },
        defaults: {
            min_row_height: 16
        },

    //constructor
        _create: function () {
            this._MIN_SIZE = 20;
            this._live_input = jQuery('<input type="text" class="LiveEdit Hidden" spellcheck="false" />');
            this._live_textarea = jQuery('<textarea class="LiveEdit Hidden" spellcheck="false"></textarea>');
            this._tooltip = jQuery(
                '<div class="CommonTooltip Hidden">'+
                '    <div class="CommonTooltipContainer">'+
                '        <a href="#" title="Close" class="CloseTooltip">Close</a>'+
                '        <p class="ContentContainer"></p>'+
                '        <label><input type="checkbox" class="DisableTooltip" />&nbsp;Do not show again</label>'+
                '    </div>'+
                '    <div class="CommonTooltipBottom"></div>'+
                '</div>'
            );
            this._edit_type = '';
            this._cell_control_active = false;
            this._LIVE_EDIT_TYPE = {
                NODE_TEXT: "edit_node_text",
                NODE_NUMBER: "edit_node_number",
                NODE_INT: "edit_node_int",
                NODE_DATE: "edit_node_date",
                NODE_SELECT: "edit_node_select",
                NODE_VOID: "edit_node_readonly"
            };
            this._selected_header_col = null;
            this._selected_helper = null;
            this._relative_offset = {left: 0, top: 0};
            this._is_resizable = false;
            this._select_data = [];

            var self = this;
            var element = this.element;
            var opts = this.options = jQuery.extend({}, this.options, this.defaults);

            //traverse rows
            if ( element.find("> tbody > tr").length >= 1 && element.find("> tbody > tr > td").length > 1 ) {
                element.find("> tbody > tr").not(".Group").each(function (index) {
                    //index rows
                    jQuery(this).find("> td:first").text(index+1);
                    //set row height
                    var max_height = opts.min_row_height;
                    jQuery(this).find("td").each(function () {
                        var textarea = jQuery(this).find("textarea.SmartCell");
                        if ( textarea.length == 0 || textarea.val() == "" ) { return true; }  //continue
                        var tmp_height = self._get_textarea_height(textarea);
                        if ( max_height < tmp_height ) {
                            max_height = tmp_height;
                        }
                    });
                    jQuery(this).find("> td textarea.SmartCell").css({
                        height: max_height
                    });
                });
            }

            element.find("span.SelectCell").each(function () {
                var col_index = jQuery(this).parent().prevAll("td").length;
                if ( self._select_data["data_"+element.attr("id")+"_"+col_index] != undefined ) { return true; } //continue
                var select = element.find("> thead > tr > th").eq(col_index).find("select");
                self._select_data["data_"+element.attr("id")+"_"+col_index] = [];
                select.find("> option").each(function () {
                    self._select_data["data_"+element.attr("id")+"_"+col_index].push({
                        label: jQuery(this).text(),
                        value: jQuery(this).val()
                    });
                });
            });

            this._relative_offset.left = element.offset().left;
            this._relative_offset.top = element.offset().top;

            jQuery(document).bind("keydown", function (e) {
                if ( !self.options.disabled && self.element.hasClass("GridActive") ) {
                    var helper;
                    if ( self._edit_type == self._LIVE_EDIT_TYPE.NODE_TEXT ) {
                        helper = self._live_textarea;
                    }
                    else {
                        helper = self._live_input;
                    }

                    //only allow 'Arrow keys', 'Enter', 'Tab'
                    if ( helper.parent().hasClass("ReadOnlyCell") ) {
                        var is_allow_key = false;
                        if ( e.which == 9 || e.which == 39 || e.which == 37 || e.which == 13 || e.which == 40 || e.which == 38 || e.which == 27 ) {
                            is_allow_key = true;
                        }
                        if ( !is_allow_key ) { return; }
                    }
                    var allow_focus = true;
                    switch ( self._edit_type ) { //allow in input char
                        case self._LIVE_EDIT_TYPE.NODE_NUMBER:
                            if ( !self._is_number(e) ) { allow_focus = false; }
                            break;
                        case self._LIVE_EDIT_TYPE.NODE_INT:
                            if ( !self._is_int(e) ) { allow_focus = false; };
                            break;
                    }
                    if ( e.which == 113 ) { //exception for F2
                        allow_focus = true;
                    }

                    if ( !helper.hasClass("Hidden")
                        && e.which != 46 && e.which != 9 && e.which != 13
                        && e.which != 38 && e.which != 40
                        && e.which != 37 && e.which != 39
                        && e.which != 17 && e.which != 27 && e.which != 116
                        && !e.shiftKey && !e.ctrlKey
                    ) {
                        //all keys except 'delete 46', 'tab 9', 'enter 13', 'up 38', 'down 40', 'left 37', 'right 39', 'ctrl 17', 'escape 27', 'F5 116'
                        if ( allow_focus ) {
                            helper.filter(':not(:focus)').focus();
                        }
                    }
                    if ( e.which == 46 ) { //Delete
                        helper.filter(':not(:focus)').val("");
                        helper.filter(':not(:focus)').parent().find("textarea.SmartCell").eq(0).val("");
                        helper.filter(':not(:focus)').parent().find("input[type='hidden']").eq(0).val("");
                        self._update_data(e, true, []);
                    }
                    if ( (!e.shiftKey && e.which == 9) || e.which == 39 ) { //Tab || Right
                        e.preventDefault();
                        if ( !helper.hasClass("Hidden")  ) {
                            self._focus_next_cell(helper.parent().find("> textarea.SmartCell"));
                        }
                    }
                    if ( (e.shiftKey && e.which == 9) || e.which == 37 ) { //Shift+Tab || Left
                        e.preventDefault();
                        if ( !helper.hasClass("Hidden")  ) {
                            self._focus_prev_cell(helper.parent().find("> textarea.SmartCell"));
                        }
                    }
                    if ( e.which == 13 || e.which == 40 ) { //Enter key || Down
                        e.preventDefault();
                        if ( jQuery(".RowSelected").nextAll("tr").length > 0 ) {
                            jQuery(".RowSelected").next().find("> td:first").trigger("click", ["down"]);
                        }
                        if ( !helper.hasClass("Hidden")  ) {
                            self._focus_next_row_cell(helper.parent().find("> textarea.SmartCell"));
                        }
                    }
                    if ( e.which == 38 ) { //Up
                        e.preventDefault();
                        if ( jQuery(".RowSelected").prevAll("tr").length > 0 ) {
                            jQuery(".RowSelected").prev().find("> td:first").trigger("click", ["up"]);
                        }
                        if ( !helper.hasClass("Hidden")  ) {
                            self._focus_prev_row_cell(helper.parent().find("> textarea.SmartCell"));
                        }
                    }
                    if ( e.which == 27 ) { //Escape
                        if ( !helper.hasClass("Hidden") && helper.filter(":focus").length == 0 ) {
                            self._clear_cell_selection();
                        }
                    }
                }
            });
			jQuery(document).bind("mousedown", function (e) {
                if ( !self.options.disabled &&
                    (self._live_input.filter(":focus").length > 0
                    || self._live_textarea.filter(":focus").length > 0)
                ) {
                    var is_update = true;
                    switch ( self._edit_type ) {
                        case self._LIVE_EDIT_TYPE.NODE_DATE:
                        case self._LIVE_EDIT_TYPE.NODE_SELECT:
                            is_update = false;
                            break;
                        default:
                            is_update = true;
                            break
                    }
                    self._update_data(e, is_update, []);
                }
            });

            //common tooltip
            this._tooltip.appendTo("body");
            this._tooltip.find("a.CloseTooltip").bind("click", function () {
                self._hide_tooltip();
                return false;
            });

            //input.LiveEdit
            this._live_input.appendTo("body");
            this._live_input.bind("click mousedown", function (e) {
                e.stopPropagation();
            });
            this._live_input.bind("keydown", function (e) {
                if ( self.options.disabled ) { return false; }
                if ( e.which == 13 ) { //Enter key
                    var ext_params = [];
                    ext_params["focus_next_row_cell"] = true;
                    if ( self._edit_type != self._LIVE_EDIT_TYPE.NODE_SELECT
                        && self._edit_type != self._LIVE_EDIT_TYPE.NODE_DATE ) {
                        self._update_data(e, true, ext_params);
                    }
                    e.preventDefault();
                }
                if ( e.which == 27 ) { //Escape key
                    if ( self._edit_type == self._LIVE_EDIT_TYPE.NODE_DATE ) {
                        self._live_input.blur();
                        self._cell_control_active = false;
                    }
                    else {
                        self._update_data(e, false, []);
                    }
                }
                switch ( self._edit_type ) { //allow in input char
                    case self._LIVE_EDIT_TYPE.NODE_TEXT:
                        break;
                    case self._LIVE_EDIT_TYPE.NODE_NUMBER:
                        if ( !self._is_number(e) ) { return false; }
                        break;
                    case self._LIVE_EDIT_TYPE.NODE_INT:
                        if ( !self._is_int(e) ) { return false; };
                        break;
                }
                e.stopPropagation();
            });
            this._live_input.bind("focus", function (e) {
                var $this = jQuery(this);
                var $parent = $this.parent();
                if ( self.options.disabled ) { return false; }
                if ( $this.parent().find("> textarea.SmartCell").parent().hasClass("ReadOnlyCell") ) {
                    $this.select().attr("readonly", "readonly");
                    return false;
                }
                $this
                    .removeAttr("readonly")
                    .val($parent.find("> textarea.SmartCell").val())
                    .select();
                //add autocomplete control
                if ( $parent.hasClass('SelectCell') ) {
                    var col_index = $parent.parent().prevAll("td").length;
                    var datasource = self._select_data["data_"+element.attr("id")+"_"+col_index]
                    if ( $this.data('autocomplete') == undefined ) {
                        self._create_select_control($this, datasource);
                    }
                    else {
                        self._update_select_control($this, datasource);
                        $this.autocomplete('enable');
                    }
                    $this
                        .autocomplete("option", "minLength", 0)
                        //store original value as 'this.term = input.val()' (#ref 'autocomplete.js' line 285)
                        .autocomplete("search", "");
                }
                //add datepicker control
                else if ( $parent.hasClass('DateCell') ) {
                    self._create_datepicker_control($this);
                    $this.datepicker('show');
                }
                else {
                    self._cell_control_active = true;
                }
                self._live_input.addClass("Change");
                e.stopPropagation();
            });

            //textarea.LiveEdit
            this._live_textarea.appendTo("body");
            this._live_textarea.bind("click mousedown", function (e) {
                e.stopPropagation();
            });
            this._live_textarea.bind("keydown", function (e) {
                if ( self.options.disabled ) { return false; }
                if ( e.ctrlKey && e.which == 13 ) { //Ctrl+Enter key
                    var ext_params = [];
                    ext_params["focus_next_row_cell"] = true;
                    if ( self._edit_type != self._LIVE_EDIT_TYPE.NODE_SELECT
                        && self._edit_type != self._LIVE_EDIT_TYPE.NODE_DATE ) {
                        self._update_data(e, true, ext_params);
                    }
                    e.preventDefault();
                }
                if ( e.which == 27 ) { //Escape key
                    self._live_textarea.blur();
                    self._update_data(e, false, []);
                }
                e.stopPropagation();
            });
            this._live_textarea.bind("focus", function (e) {
                self._live_textarea.addClass("Change");
            });

            //bind event to text cell
            jQuery("textarea.SmartCell").live("focus", function (e) {
                if ( self.options.disabled ) { return false; }
                jQuery(this).blur();
            });
            element.find("span.TextCell").live("click", function (e) {
                if ( self.options.disabled ) { return false; }
                self._highlight_cell(e, jQuery(this), self._LIVE_EDIT_TYPE.NODE_TEXT);
                e.stopPropagation();
            });
            //bind event to number cell
            element.find("span.NumberCell").live("click", function (e) {
                if ( self.options.disabled ) { return false; }
                self._highlight_cell(e, jQuery(this), self._LIVE_EDIT_TYPE.NODE_NUMBER);
                e.stopPropagation();
            });
            //bind event to integer cell
            element.find("span.IntegerCell").live("click", function (e) {
                if ( self.options.disabled ) { return false; }
                self._highlight_cell(e, jQuery(this), self._LIVE_EDIT_TYPE.NODE_INT);
                e.stopPropagation();
            });
            //bind event to date cell
            element.find("span.DateCell").live("click", function (e) {
                if ( self.options.disabled ) { return false; }
                self._highlight_cell(e, jQuery(this), self._LIVE_EDIT_TYPE.NODE_DATE);
                e.stopPropagation();
            });
            //bind event to select cell
            element.find("span.SelectCell").live("click", function (e) {
                if ( self.options.disabled ) { return false; }
                self._highlight_cell(e, jQuery(this), self._LIVE_EDIT_TYPE.NODE_SELECT);
                e.stopPropagation();
            });
            //bind event to select cell
            element.find("span.ReadOnlyCell").live("click", function (e) {
                if ( self.options.disabled ) { return false; }
                self._highlight_cell(e, jQuery(this), self._LIVE_EDIT_TYPE.NODE_VOID);
                e.stopPropagation();
            });

            //bind resize control to <th>
            element.find("> thead > tr > th").each(function (index) {
                jQuery(this).css({
                    width: jQuery(this).width()
                });
            });
            element.find("> thead > tr > th").each(function (index) {
                var header_col = jQuery(this);
                var resize_helper = jQuery('<a href="#" title="Drag to resize column" class="ResizeBar"></a>');
                element.parent().append(resize_helper);
                if ( header_col.hasClass("LastCol") ) {
                    resize_helper.css({
                        width: resize_helper.width()/2
                    });
                }
                resize_helper
                    .css({
                        top: 0,
                        left: parseFloat(header_col.position().left + header_col.outerWidth()
                                - (header_col.hasClass("LastCol") ? resize_helper.width() : resize_helper.width()/2)
                                + element.parent().scrollLeft())
                    })
                    .addClass("ResizeBarDefault")
                    .bind("mousedown", function (e) {
                        if ( self.options.disabled ) { return false; }
                        self._clear_cell_selection();
                        self._selected_helper = resize_helper;
                        self._selected_header_col = header_col;
                        resize_helper.addClass("ResizeBarDown");
                        self._selected_helper
                            .removeClass("ResizeBarDefault")
                            .css({
                                height: element.parent().parent().outerHeight()
                            });
                        self._is_resizable = true;
                        return false;
                    })
                    .bind("update", function (e) { //custom event
                        if ( self.options.disabled ) { return false; }
                        resize_helper.css({
                            left: parseInt(header_col.position().left + header_col.outerWidth()
                                    - (header_col.hasClass("LastCol") ? resize_helper.width() : resize_helper.width()/2)
                                    + element.parent().scrollLeft())
                        });
                    });
            });
            jQuery(".ResizeBar").live("click", function (e) {
                if ( self.options.disabled ) { return false; }
                e.preventDefault();
            });

            //bind event to each row
            element.find("td.RowSelection").live("click", function (e, params) {
                if ( self.options.disabled ) { return false; }
                jQuery(".RowSelected").removeClass("RowSelected");
                jQuery(this).parent().addClass("RowSelected");

                /*use for key navigation*/
                if ( params == "down" ) {
                    if ( jQuery(this).parent().position().top >= element.parent().outerHeight() ) {
                        element.parent().scrollTop(element.parent().scrollTop()+jQuery(this).outerHeight());
                    }
                }
                else if ( params == "up" ) {
                    if ( jQuery(this).parent().position().top <= 0 ) {
                        var tmp = jQuery(this).parent().prevAll("tr").length == 0 ? 0 : element.parent().scrollTop()-jQuery(this).outerHeight();
                        element.parent().scrollTop(tmp);
                    }
                }
            });

            //binding event to document
            jQuery(document).bind("mousemove", function (e) {
                if ( self.options.disabled ) { return false; }
                if ( self._is_resizable ) {
                    self._selected_helper.css({
                        left: parseInt((e.pageX - self._relative_offset.left) - self._selected_helper.width()/2 + element.parent().scrollLeft())
                    });
                }
            });
            jQuery(document).bind("mouseup", function (e) {
                if ( self.options.disabled ) { return false; }
                if ( self._is_resizable ) {
                    self._stop_resize_column(e);
                }
            });
            jQuery(window).bind("resize", function (e) {
                if ( self.options.disabled ) { return false; }
                self._update_resize_helper();
                self._clear_cell_selection();
            });
            this._update_resize_helper();
        },

    //private methods
        _create_datepicker_control: function (/*jQuery*/input) {
            if ( this._cell_control_active ) { return; }
            var self = this;
            self._cell_control_active = true;
            var params = [/*Boolean update: default false*/false, /*ext_params:[]*/[]];
            input.datepicker({
                changeMonth: true,
                changeYear: true,
                dateFormat: "dd/mm/yy",
                showAnim: "fadeIn",
                beforeShowDay: no_weekend_or_holidays,
                onSelect: function (date_text, inst) { //triggered after 'blur' on 'input'
                    var ext_params = [];
                    ext_params["focus_next_row_cell"] = true;
                    self._update_data(null, true, ext_params);
                },
                onClose: function (date_text, inst) {
                    input.datepicker("destroy");
                }
            });
            input.datepicker("widget").bind("mousedown", function (e) {
                e.stopPropagation();
            });
        },
        _create_select_control: function (/*jQuery*/input, /*Array[Object{label, value}]*/data_source) {
            if ( this._cell_control_active ) { return; }
            var self = this;
            self._cell_control_active = true;
            var trigger_blur_input = false;
            input.autocomplete({
                source: function (request, response) {
                    var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
                    response(jQuery.map(data_source, function (item, index) {
                        var text = item.label;
                        if ( item.value && (!request.term || matcher.test(text)) ) {
                            return {
                                search: $.ui.autocomplete.escapeRegex(request.term),
                                label: text,
                                value: text,
                                option: this
                            }
                        }
                    }));
                },
                autoFocus: true,
                minLength: 1,
                delay: 0,
                position: {
                    my: "left top",
                    at: "left bottom",
                    collision: "flip"
                },
                search: function (e) {},
                select: function (e, ui) { //trigger when select an 'item' in the 'menu' -> cause 'close' right after then
                },
                close: function (e, ui) {
                    //trigger when the 'autocomplete menu' go hidden
                    //because
                    //    'select an item in menu'
                    //    'click outside'
                    //    'enter' | 'escape' when menu is already shown
                    //    'typing does not match any item' -> 'e.originalEvent' == undefined
                    if ( e.originalEvent != undefined ) {
                        var is_update = (e.originalEvent.type == "blur"/*Click outside*/ || e.originalEvent.which == 27/*Escape*/ ? false : true);
                        var ext_params = [];
                        ext_params["focus_next_row_cell"] = is_update;
                        self._update_data(e, is_update, ext_params);
                    }
                    else {
                        trigger_blur_input = true;
                    }
                },
                change: function (e, ui) { //trigger when input is blurred
                    //blur in autocomplete goes after blur binded in input
                    //so ignore this blur, use blur in input instead by trigger in 'close' event
                    //only use this in case 'typing does not match any item' then 'enter'
                    if ( trigger_blur_input ) {
                        self._update_data(e, false, []);
                    }
                },
                create: function () {
                    try {
                        input.autocomplete("widget").bind("mousedown", function (e) {
                            e.stopPropagation();
                        });
                    } catch (err) {}
                }
            });
            input.data('autocomplete')._renderItem = function(ul, item) {
                return jQuery('<li>')
                    .data('item.autocomplete', item)
                    .append('<a>' + item.label.replace(
                                    new RegExp(
                                        "(?![^&;]+;)(?!<[^<>]*)(" +
                                        $.ui.autocomplete.escapeRegex(item.search) +
                                        ")(?![^<>]*>)(?![^&;]+;)", "gi"
                                    ), "<strong class='SearchTerm'>$1</strong>" ) + '</a>')
                    .appendTo(ul);
            };
            input.autocomplete('widget').bind("mousedown", function (e) {
                e.stopPropagation();
            });
        },
        _update_select_control: function (/*jQuery*/input, /*Array[Object{label, value}]*/data_source) {
            input.autocomplete('option', {
                source: function (request, response) {
                    var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
                    response(jQuery.map(data_source, function (item, index) {
                        var text = item.label;
                        if ( item.value && (!request.term || matcher.test(text)) ) {
                            return {
                                search: $.ui.autocomplete.escapeRegex(request.term),
                                label: text,
                                value: text,
                                option: this
                            }
                        }
                    }));
                }
            });
        },
        _clone_row: function () {
            var self = this;
            var new_row = this.element.find("> tbody > tr").not(".Group").eq(0).clone().removeClass("RowSelected");
            var new_row_index = this.element.find("> tbody > tr").length;
            if ( (new_row_index+1)%2 == 0 ) {
                new_row.removeClass("OddRow");
                new_row.addClass("EvenRow");
            }
            new_row.find("> td").each(function (index) {
                if ( jQuery(this).find("> span.SmartCellContainer > textarea.SmartCell").length == 0 ) {
                    jQuery(this).empty();
                    return true; //continue
                }
                else {
                    var cell_input = jQuery(this).find("> span.SmartCellContainer > textarea.SmartCell");
                    var name = cell_input.attr("id").replace(/{row_index}/, new_row_index).toString();
                    cell_input.val("").attr("name", name).removeAttr("id").css({
                        height: self.options.min_row_height
                    });

                    var hidden_input = jQuery(this).find("> span.SmartCellContainer > input[type='hidden']");
                    if ( hidden_input.length == 0 ) { return true; }
                    var hidden_name = hidden_input.attr("id").replace(/{row_index}/, new_row_index).toString();
                    hidden_input.val("").attr("name", hidden_name).removeAttr("id");
                }
            });
            return new_row;
        },
        _clear_cell_selection: function () {
            this._clear_live_input();
            this._clear_live_textarea();
            this._hide_tooltip();
            this.element.removeClass("GridActive");
        },
        _clear_live_input: function () {
            this._live_input
                .appendTo("body")
                .val("")
                .addClass("Hidden")
                .removeAttr("style");
        },
        _clear_live_textarea: function () {
            this._live_textarea
                .appendTo("body")
                .val("")
                .addClass("Hidden")
                .removeAttr("style");
        },
        _focus_prev_cell: function (/*jQuery*/cell_input) {
            var td = cell_input.parent().parent();
            var td_index = td.prevAll("td").length;
            if ( td.length == 0 ) { return false; }
            var next_cell_input = td.prev("td").find("> span.SmartCellContainer > textarea.SmartCell");
            next_cell_input.trigger("click");
            return true;
        },
        _focus_next_cell: function (/*jQuery*/cell_input) {
            var td = cell_input.parent().parent();
            var td_index = td.prevAll("td").length;
            if ( td.length == td.parent().find("> td").length-1 ) { return false; }
            var next_cell_input = td.next("td").find("> span.SmartCellContainer > textarea.SmartCell");
            next_cell_input.trigger("click");
            return true;
        },
        _focus_prev_row_cell: function (/*jQuery*/cell_input) {
            var td = cell_input.parent().parent();
            var td_index = td.prevAll("td").length;
            var tr_index = td.parent().prevAll("tr").length;
            if ( tr_index == 0 ) { return false; }
            var next_row_cell = this.element.find("> tbody > tr").eq(tr_index-1).find("> td").eq(td_index).find("textarea.SmartCell");
            next_row_cell.trigger("click");
            return true;
        },
        _focus_next_row_cell: function (/*jQuery*/cell_input) {
            var td = cell_input.parent().parent();
            var td_index = td.prevAll("td").length;
            var tr_index = td.parent().prevAll("tr").length;
            if ( tr_index == this.element.find("> tbody > tr").length-1 ) { return false; }
            var next_row_cell = this.element.find("> tbody > tr").eq(tr_index+1).find("> td").eq(td_index).find("textarea.SmartCell");
            next_row_cell.trigger("click");
            return true;
        },
        _get_textarea_height: function (textarea) {
            textarea.height(0).scrollTop(10000);
			return textarea.scrollTop();
        },
        //return the max height of 'textarea.SmartCell' of each row
        _get_max_row_height: function (/*jQuery: tr*/row) {
            var self = this;
            var max_height = 0;
            row.find("> td > span.SmartCellContainer > textarea.SmartCell").each(function () {
                if ( jQuery(this).parent().find(".LiveEdit").length > 0 ) { return true; }
                var textarea_height = self._get_textarea_height(jQuery(this));
                if ( max_height < textarea_height ) {
                    max_height = textarea_height;
                }
            });
            return max_height;
        },
        _insert_new_row: function () {
            var self = this;
            var element = this.element;
            if ( !self._live_input.hasClass("Hidden") || !self._live_textarea.hasClass("Hidden") ) {
                self._cell_control_active = false;
                self._clear_cell_selection();
            }
            var new_row = self._clone_row();
			element.find("> tbody").append(new_row);
            self._update_resize_helper();
        },
        _is_number: function (evt) {
            var charCode = (evt.which) ? evt.which : event.keyCode;
            return ( charCode >= 48 && charCode <=57 ) || ( charCode >= 96 && charCode <= 105 )
                || charCode == 8 || charCode == 35 || charCode == 36 || charCode == 37
                || charCode == 39 || charCode == 16 || charCode == 46
                || charCode == 190 || charCode == 110; /*dot in main keyboard(190) and in numpad keyboard(110)*/
        },
        _is_int: function (evt) {
            var charCode = (evt.which) ? evt.which : event.keyCode;
            return ( charCode >= 48 && charCode <=57 ) || ( charCode >= 96 && charCode <= 105 )
                || charCode == 8 || charCode == 35 || charCode == 36 || charCode == 37
                || charCode == 39 || charCode == 16 || charCode == 46;
        },
        _highlight_cell: function (e, /*jQuery*/cell_container, /*String*/type) {
            var self = this;
            if ( (!self._live_input.hasClass("Hidden")
                && self._live_input.hasClass("Change"))
                || (!self._live_textarea.hasClass("Hidden")
                && self._live_textarea.hasClass("Change"))
            ) { //update current before leaving and focusing on other cell
                self._update_data(e, true, []);
            }
            self._hide_tooltip();
            if ( type == self._LIVE_EDIT_TYPE.NODE_TEXT ) {
                self._clear_live_input();
                helper = self._live_textarea;
                self._show_tooltip("Multi-line mode<br />Press <strong>Ctrl+Enter</strong> to confirm", cell_container);
            }
            else {
                self._clear_live_textarea();
                helper = self._live_input;
            }
            jQuery(".GridActive").removeClass("GridActive");
            this.element.addClass("GridActive");
            jQuery(".RowSelected").removeClass("RowSelected");
            cell_container.parent().parent().addClass("RowSelected");
            cell_container.append(helper);
            var w = cell_container.outerWidth()
                        - parseFloat(helper.css("paddingLeft"))
                        - parseFloat(helper.css("paddingRight"))
                        - parseFloat(helper.css("borderLeftWidth"))
                        - parseFloat(helper.css("borderRightWidth"));
            var h = cell_container.outerHeight()
                        - parseFloat(helper.css("paddingTop"))
                        - parseFloat(helper.css("paddingBottom"))
                        - parseFloat(helper.css("borderTopWidth"))
                        - parseFloat(helper.css("borderBottomWidth"));
            helper
                .removeClass("Hidden")
                .css({
                     width: w,
                     height: h
                })
                .val(cell_container.find("> textarea.SmartCell").eq(0).val());
            if ( type == self._LIVE_EDIT_TYPE.NODE_TEXT ) {
                if ( !this._live_textarea.hasClass("AutoResize") ) {
                    this._live_textarea.addClass("AutoResize").autoresize({
                        animate: false,
                        buffer: 0,
                        minRows: 1,
                        onresize: function () {
                            var new_height = self._live_textarea.height();
                            //span->td->tr
                            var current_row = self._live_textarea.parent().parent().parent();
                            var current_max_height = self._get_max_row_height(current_row);
                            //check new_height against row max-height
                            if ( new_height > current_max_height ) {
                                self._live_textarea.parent().parent().parent().find("textarea.SmartCell").css({
                                    height: new_height
                                });
                            }
                            else {
                                self._live_textarea.css({
                                    height: current_max_height
                                });
                                self._live_textarea.parent().parent().parent().find("textarea.SmartCell").css({
                                    height: current_max_height
                                });
                            }
                            self._live_textarea.css({
                                width: self._live_textarea.parent().outerWidth()
                                            - parseFloat(self._live_textarea.css("paddingLeft"))
                                            - parseFloat(self._live_textarea.css("paddingRight"))
                                            - parseFloat(self._live_textarea.css("borderLeftWidth"))
                                            - parseFloat(self._live_textarea.css("borderRightWidth"))
                            });
                        }
                    });
                }
            }
            self._edit_type = type;
        },
        _hide_tooltip: function () {
            this._tooltip
                .addClass("Hidden")
                .find(".ContentContainer").empty();
        },
        _show_tooltip: function (/*String*/content, /*jQuery: optional*/relative_element) {
            if ( this._tooltip.find("input.DisableTooltip").attr("checked") == "checked" ) { return; }
            this._tooltip
                .removeClass("Hidden")
                .find(".ContentContainer").html(content).end()
                .position({
                    of: relative_element == undefined ? "body" : relative_element,
                    my: "center bottom",
                    at: "right top",
                    offset: "-6px 2px",
                    collision: "flip"
                });
        },
        _stop_resize_column: function (/*Event*/e) { //main function to manipulate table column's
            var self = this;
            var element = this.element;
            self._is_resizable = false;
            if ( e != undefined && self._selected_helper != undefined ) {
                self._selected_helper.removeClass("ResizeBarDown");
                self._selected_helper.addClass("ResizeBarDefault");
            }
            if ( e != undefined && self._selected_header_col != undefined ) {
                var offset_width = (e.pageX - self._relative_offset.left) - ( self._selected_header_col.position().left + self._selected_header_col.outerWidth() );
                if ( self._selected_header_col.width() + offset_width < self._MIN_SIZE ) {
                    offset_width = self._MIN_SIZE - self._selected_header_col.width();
                }
                self._selected_header_col.css({
                    width: self._selected_header_col.width() + offset_width
                });
                self._selected_helper.css({
                    left: parseInt(self._selected_header_col.position().left + self._selected_header_col.width()
                        - self._selected_helper.width()/2
                        + element.parent().scrollLeft() )
                });
                element.css({
                    width: element.width() + offset_width
                });
            }
            //update selected_helper position for all column
            if ( jQuery(".ResizeBar").length > 0 ) { jQuery(".ResizeBar").trigger("update"); }
        },
        _update_resize_helper: function () {
            //update selected_helper position for all column
            if ( jQuery(".ResizeBar").length > 0 ) { jQuery(".ResizeBar").trigger("update"); }
        },
        _update_data: function (e, update, /*Array[optional]*/ext_params) {
            var self = this;
            this._cell_control_active = false;
            update = update || false;
            if ( !update ) {
                self._live_input.attr("readonly", "readonly"); //to prevent keydown action binded in autocomplete.js
                self._live_input.val(self._live_input.parent().find("> textarea.SmartCell").val());
            }

            ext_params = (ext_params != undefined) ? ext_params : [];
            var params = [];
            switch ( self._edit_type ) {
                case self._LIVE_EDIT_TYPE.NODE_TEXT:
                    break;
                case self._LIVE_EDIT_TYPE.NODE_DATE:
                    self._live_input.datepicker('widget').dequeue();
                    self._live_input.datepicker('destroy');
                    break;
                case self._LIVE_EDIT_TYPE.NODE_SELECT:
                    var valid = false;
                    var matcher = new RegExp("^"+$.ui.autocomplete.escapeRegex(self._live_input.val())+"$", "i");
                    var col_index = self._live_input.parent().parent().prevAll("td").length;
                    var col_row = self._live_input;
                    jQuery.map(self._select_data["data_"+self.element.attr("id")+"_"+col_index], function(item, index) {
                        if ( item.label.match(matcher) ) {
                            col_row.parent().find("> input[type='hidden']").val(item.value);
                            valid = true;
                            return false; //break 'jQuery.map'
                        }
                    });
                    //!valid == as it didn't match anything
                    if ( !valid ) {
                        update = false;
                    }
                    self._live_input.autocomplete("disable");
                    break;
                case self._LIVE_EDIT_TYPE.NODE_NUMBER:
                    //float number: eg. 0, 5, 6.78, 0.58, 56... (positive number only)
                    var reg = new RegExp("(^\\d?(\\.\\d)\\d*$)|(^[1-9]\\d*$)|(^0$)", "g");
                    if ( !reg.test(self._live_input.val()) && self._live_input.val() != "" ) { //allow empty
                        update = false;
                    }
                    break;
                case self._LIVE_EDIT_TYPE.NODE_INT:
                    //non zero prefix integer: eg. 0, 1, 34, 67...
                    var reg = new RegExp("(^[1-9][0-9]*)|(^0$)", "g");
                    if ( !reg.test(self._live_input.val()) && self._live_input.val() != "" ) { //allow empty
                        update = false;
                    }
                    break;
                case self._LIVE_EDIT_TYPE.NODE_VOID:
                    return;
                    break;
            }

            if ( self._edit_type != self._LIVE_EDIT_TYPE.NODE_TEXT && self._live_input.hasClass("Hidden") ) { return false; }
            if ( self._edit_type == self._LIVE_EDIT_TYPE.NODE_TEXT && self._live_textarea.hasClass("Hidden") ) { return false; }

            var helper;
            if ( self._edit_type == self._LIVE_EDIT_TYPE.NODE_TEXT ) {
                helper = self._live_textarea;
            }
            else {
                helper = self._live_input;
            }
            helper.removeClass("Change").blur();

            if ( update ) { //callback
                helper.parent().find("> textarea.SmartCell")
                    .val(helper.val())
                    .attr("title", helper.val());
                helper.blur();
                var change_cell = helper.parent().parent();
                if ( ext_params["focus_next_row_cell"] != undefined && ext_params["focus_next_row_cell"] == true ) {
                    self._focus_next_row_cell(helper.parent().find("> textarea.SmartCell"));
                } //when press enter while focusing 'live_input'
                self._trigger("change", e, change_cell);
            }
            else {
                self._live_input.val(helper.parent().find("> textarea.SmartCell").val());
            }
        },

    //public method
        add_new_row: function () {
            this._insert_new_row();
        }
    });

    //version
    jQuery.extend($.ui.smartgrid, {
        version: "1.0"
    });
})(jQuery);