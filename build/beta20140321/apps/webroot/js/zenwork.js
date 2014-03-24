var Zenwork = {}; //global namespace
//alias
var ZW = Zenwork;

jQuery(document).ready(function () {
    (function ($) {
        //root
        Zenwork.Root = $('#rootUrl').val();
        Zenwork.Now = new Date(Number($('#serverTime').val()));

        //global search
        var _search_ = function (keyword) {
            if ( keyword == '' ) { 
                alert('Please enter keyword');
                return false;
            }
            var pos = {
                my: 'center top',
                at: 'center top+60',
                of: window
            };
            Zenwork.Popup.preProcess(pos, true);
            $.ajax({
                url: Zenwork.Root+'/app/search/'+keyword,
                type: 'POST',
                dataType: 'text',
                success: function (response, textStatus, jqXHR) {
                    Zenwork.Popup.show(response, pos);
                    Zenwork.Plugins.jScrollPane.call($('#searchResultContent'), {verticalGutter: 0});
                    $('#zwGlobalSearchAlt').on('keyup', function (e) {
                        $('#zwGlobalSearch').val(this.value);
                        if ( e.which == 13 ) { //enter
                            _search_(this.value.trim());
                        }
                        return false;
                    });
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if ( textStatus !== 'abort' ) {
                        alert('Really sorry for this, network error! Please try again!');
                    }
                },
                complete: function (jqXHR, textStatus) {}
            });
        }
        $('#zwGlobalSearch').on('keyup', function (e) {
            if ( e.which == 13 ) { //enter
                _search_(this.value.trim());
            }
            return false;
        });

        //auth
        Zenwork.Auth = {};
        Zenwork.Auth.User = {};
        Zenwork.Auth.User.id = String($('#loggedInUserID').val());

        //plugins container
        Zenwork.Plugins = {
            split: function (val) {
                return val.split(/,\s*/);
            },
            extractLast: function (term) {
                return Zenwork.Plugins.split(term).pop();
            },
            autocomplete: function (autocompleteInput, autocompleteSelect, options) {
                autocompleteSelect = autocompleteSelect == undefined ? null : autocompleteSelect;
                var options = options || {};
                options.isMultiple = options.isMultiple || false;
                options.remoteDatasource = options.remoteDatasource || '';
                var selectMenu = false;
                var dataSource;
                var cache = {};
                autocompleteInput
                    .autocomplete($.extend(true, {}, options.autocomplete, {
                        autoFocus: true,
                        source: function (request, response) {
                            if ( options.remoteDatasource != '') {
                                dataSource = options.remoteDatasource;
                                var term = Zenwork.Plugins.extractLast(request.term);
                                if ( term in cache ) {
                                    _response(cache[term], request, response);
                                    return;
                                }

                                $.getJSON(dataSource, {
                                    term: Zenwork.Plugins.extractLast(request.term)
                                }, function (data, status, xhr) {
                                    _response(data, request, response);
                                    cache[term] = data;
                                });
                            }
                            else {
                                dataSource = [];
                                if ( autocompleteSelect != null && autocompleteSelect.length > 0 ) {
                                    autocompleteSelect.find('> option').each(function(index) {
                                        var $this = $(this);
                                        if( !$this.attr('disabled') && $this.attr('value') != 0  ) {
                                            dataSource.push({
                                                label: $this.text(),
                                                value: $this.val(),
                                                className: $this.attr('class')
                                            });
                                        }
                                    });
                                }
                                _response(dataSource, request, response);
                            }
                        },
                        select: function (event, ui) {
                            //start update <select> value
                            if ( autocompleteSelect != null ) {
                                if ( !options.isMultiple ) {
                                    autocompleteSelect.find('> option').removeAttr('selected');
                                }
                                autocompleteSelect.find('> option').each(function () {
                                    var $this = $(this);
                                    if ($this.val() == ui.item.value) {
                                        $this.attr('selected', 'selected');
                                        return false;
                                    }
                                });
                            }
                            //map data to sync <select>
                            if ( options.mapDataSelect != undefined
                                && options.mapAutocompleteSelect != undefined
                                && options.mapAutocompleteInput != undefined
                            ) {
                                var mapSelectDataId = 0;
                                var mapSelectData = '';
                                options.mapDataSelect.find('> option').each(function() {
                                    var $this = $(this);
                                    if ( $this.attr('value') == autocompleteSelect.val() ) {
                                        mapSelectDataId = $this.text();
                                    }
                                });
                                options.mapAutocompleteSelect.find('> option').removeAttr('selected');
                                options.mapAutocompleteSelect.find("> option").each(function() {
                                    var $this = $(this);
                                    if ($this.attr('value') == mapSelectDataId) {
                                        $this.attr('selected', 'selected');
                                        mapSelectData = $this.text();
                                        return false;
                                    }
                                });
                                if ( mapSelectData != '' ) {
                                    options.mapAutocompleteInput.val(mapSelectData);
                                    options.mapAutocompleteInput.attr({
                                        disabled: 'disabled'
                                    });
                                }
                            }
                            selectMenu = true;
                            //end update <select> value

                            if ( options.isMultiple ) {
                                var terms = Zenwork.Plugins.split(this.value);
                                //remove the current input
                                terms.pop();
                                //add the selected item
                                terms.push(ui.item.value);
                                //add placeholder to get the comma-and-space at the end
                                terms.push('');
                                this.value = terms.join(', ');
                                return false;
                            }
                            this.value = ui.item.label;
                            return false; //return false prevent autocomplete auto set value of input = ui.item.value
                        },
                        position: {
                            my: 'left top',
                            at: 'left bottom',
                            of: autocompleteInput,
                            collision: 'flip',
                            within: window
                        },
                        search: function (event, ui) {
                            if ( options.isMultiple ) {
                                //custom minLength
                                var term = Zenwork.Plugins.extractLast(this.value);
                                if ( term.length < 2 ) {
                                    return false;
                                }
                            }
                        },
                        focus: function () {
                            if ( options.isMultiple ) {
                                //prevent value inserted on focus
                                return false;
                            }
                        }
                    }))
                    .bind('blur', function() {
                        if ( autocompleteSelect!== null && $(this).val() !=  autocompleteSelect.find('> option[selected="selected"]').text() ) {
                            autocompleteSelect.find("> option").removeAttr("selected");
                            if ( options.mapDataSelect != undefined
                                && options.mapAutocompleteSelect != undefined
                                && options.mapAutocompleteInput != undefined
                            ) {
                                options.mapAutocompleteSelect.find("> option").removeAttr("selected");
                                options.mapAutocompleteInput.removeAttr('disabled');
                                options.mapAutocompleteInput.val('');
                                $('#dTeam')
                                    .removeAttr('disabled')
                                   .parent().removeClass('StreamBlockDisabled');
                            }
                        } else {
                            selectMenu = false;
                        }
                    })
                    .bind('click', function() {
                        if ( autocompleteInput.autocomplete('option', 'minLength') == 0 ) {
                            autocompleteInput.autocomplete('search', '');
                        }
                    });
                var autocompleteInputData = autocompleteInput.data('uiAutocomplete');
                autocompleteInputData._renderItem = function(ul, item) {
                    return $('<li class="AutocompleteItem" data-id="'+item.value+'">')
                        .append('<a class="'+(item.className !== undefined ? item.className : '')+'">' + item.label.replace(
                            new RegExp(
                                '(?![^&;]+;)(?!<[^<>]*)(' +
                                $.ui.autocomplete.escapeRegex(Zenwork.Plugins.extractLast(autocompleteInput.val())) +
                                ')(?![^<>]*>)(?![^&;]+;)', 'gi'
                            ), '<strong class="SearchTerm">$1</strong>') + '</a>')
                        .appendTo(ul);
                };
                autocompleteInputData.getCache = function () {
                    return cache;
                }

                autocompleteInput.autocomplete('widget').on('click', function (e) {
                    e.stopPropagation();
                });

                var _response = function (data, request, response) {
                    if ( data.constructor == Array ) {
                        var term = options.isMultiple ? Zenwork.Plugins.extractLast(request.term) : request.term;
                        //IMPORTANT: 'data' must be an Array if using '$.ui.autocomplete.filter'
                        response($.ui.autocomplete.filter(data, term));
                    }
                    else {
                        response(data);
                    }
                }
            },
            jScrollPane: function (opts) {
                var $this = $(this);
                $this.jScrollPane($.extend({
                    showArrows: false,
                    verticalGutter: 0,
                    mouseWheelSpeed: 20,
                    autoReinitialise: true,
                    autoReinitialiseDelay: 500
                }, opts));
                var api = $this.data('jsp');
                var throttleTimeout;
                $(window).bind('resize', function () {
                    if ($.browser.msie) {
                        // IE fires multiple resize events while you are dragging the browser window which
                        // causes it to crash if you try to update the scrollpane on every one. So we need
                        // to throttle it to fire a maximum of once every 50 milliseconds...
                        if (!throttleTimeout) {
                            throttleTimeout = setTimeout(function() {
                                api.reinitialise();
                                throttleTimeout = null;
                            }, 50);
                        }
                    } else {
                        api.reinitialise();
                    }
                });
                
                $this.bind('jsp-scroll-y', function(e, scrollPositionY, isAtTop, isAtBottom) {
                    Zenwork.Plugins.Tip.hideTip();
                });

                return api;
            },
            tagit: function (sid) { //usage: .call(input, sid)
                var $this = $(this);
                var tagInput = $this.tagit({
                    allowSpaces: true,
                    caseSensitive: false,
                    placeholderText: $(this).attr('placeholder'),
                    afterTagAdded: function (e, ui) {
                        if ( ui.duringInitialization ) { return false; }
                        if ( sid !== undefined ) {
                            Zenwork.Notifier.notify('Updating...');
                            $.ajax({
                                type: 'POST',
                                url: Zenwork.Root+'/streams/tag/'+sid,
                                dataType: 'json',
                                contentType: 'json',
                                data: JSON.stringify({
                                    name: ui.tagLabel.toLowerCase()
                                }),
                                success: function (data, textStatus, jqXHR) {
                                    if ( data == 404 ) {
                                        Zenwork.Notifier.off();
                                        return Zenwork.Exception._404();
                                    }
                                    Zenwork.Notifier.notify('Tag "'+ui.tagLabel.toLowerCase()+'" saved!', 1);
                                    $this.trigger('afterTagAdded.tagit', ui.tagLabel.toLowerCase());
                                },
                                error: function (jqXHR, textStatus, errorThrown) {
                                    if ( textStatus !== 'abort' ) {
                                        alert('Really sorry for this, network error! Please try again!');
                                    }
                                }
                            });
                        }
                    },
                    afterTagRemoved: function (e, ui) {
                        if ( sid !== undefined ) {
                            Zenwork.Notifier.notify('Updating...');
                            $.ajax({
                                type: 'POST',
                                url: Zenwork.Root+'/streams/untag/'+sid,
                                dataType: 'json',
                                contentType: 'json',
                                data: JSON.stringify({
                                    name: ui.tagLabel.toLowerCase()
                                }),
                                success: function (data, textStatus, jqXHR) {
                                    if ( data == 404 ) {
                                        Zenwork.Notifier.off();
                                        return Zenwork.Exception._404();
                                    }
                                    Zenwork.Notifier.notify('Tag "'+ui.tagLabel.toLowerCase()+'" removed!', 1);
                                    $this.trigger('afterTagRemoved.tagit', ui.tagLabel.toLowerCase());
                                },
                                error: function (jqXHR, textStatus, errorThrown) {
                                    if ( textStatus !== 'abort' ) {
                                        alert('Really sorry for this, network error! Please try again!');
                                    }
                                }
                            });
                        }
                    },
                    onTagExists: function (e, ui) {
                        $(ui.existingTag).animate({
                            backgroundColor: '#F6FBC9'
                        }, 100, function () {
                            $(ui.existingTag).animate({
                                backgroundColor: '#F8F8F8'
                            });
                        });
                    }
                });
            },
            listSelection: function (input, streamData) {
                var lcache = {};
                //stream list selection
                input
                    .autocomplete({
                        autoFocus: true,
                        source: function (request, response) {
                            if ( request.term in lcache ) {
                                response(lcache[request.term], request, response);
                                return;
                            }

                            dataSource = Zenwork.Root+'/slist/searchByUserList';
                            $.getJSON(dataSource, {
                                term: request.term
                            }, function (data, status, xhr) {
                                if ( data.constructor !== Array ) {
                                    var tmp = [];
                                    $.each(data, function (key, value) {
                                        tmp.push({
                                            label: value,
                                            value: key
                                        });
                                    });
                                    data = tmp;
                                }
                                response($.ui.autocomplete.filter(data, request.term));
                                lcache[request.term] = data;
                            });
                        },
                        focus: function (e, ui) {
                            return false; //return false prevent autocomplete auto set value of input = ui.item.value
                        },
                        select: function (e, ui) {
                            var list = $('#belongsToList');
                            if ( list.attr('data-lid') === ui.item.value ) {
                                Zenwork.Notifier.notify('This is already belongs to list "'+ui.item.label+'"', 2);
                            }
                            else {
                                var currentListName = list.text();
                                $.ajax({
                                    type: 'post',
                                    url: Zenwork.Root+'/streams/moveStream/'+streamData.slmid+'/'+ui.item.value,
                                    dataType: 'json',
                                    success: function (data, textStatus, jqXHR) {
                                        //delete old entry
                                        Zenwork.Model.addBuffer({
                                            id: streamData.slmid
                                        }, 'Stream_list_map', Zenwork.Model.D);

                                        //add log
                                        Zenwork.Model.addBuffer({
                                            sid: streamData.id,
                                            uid: Zenwork.Auth.User.id,
                                            action: 'move this task from list "'+currentListName+'" to list "'+ui.item.label+'"'
                                        }, 'Stream_log', Zenwork.Model.CU);

                                        //flush data
                                        Zenwork.Model.flush(function () {
                                            streamData.slmid = data.id;
                                            Zenwork.Notifier.notify('Updated', 2);
                                        });

                                        input.trigger('update.listSelection', e);
                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        if ( textStatus !== 'abort' ) {
                                            alert('Really sorry for this, network error! Please try again!');
                                        }
                                    },
                                    complete: function (jqXHR, textStatus) {}
                                });

                                var label = ui.item.label.shorten(20);
                                list.html('<a target="_blank" href="'+Zenwork.Root+'/planner#!'+ui.item.value+'" title="">'+label+'</a>').attr({
                                    'data-lid': ui.item.value,
                                    'title': ui.item.label
                                });
                            }

                            this.value = '';
                            return false; //return false prevent autocomplete auto set value of input = ui.item.value
                        },
                        position: {
                            my: 'left top',
                            at: 'left bottom',
                            of: input,
                            collision: 'flip',
                            within: window
                        }
                    })
                    .on('blur', function (e) {
                        this.value = '';
                    })
                    .data('uiAutocomplete')._renderItem = function(ul, item) {
                        return $('<li>').append(
                            '<a>'+
                            item.label.replace(
                                new RegExp(
                                    '(?![^&;]+;)(?!<[^<>]*)(' +
                                    $.ui.autocomplete.escapeRegex(this.term) +
                                    ')(?![^<>]*>)(?![^&;]+;)', 'gi'
                                ),
                                '<strong class="SearchTerm">$1</strong>'
                            ) +
                            '</a>'
                        ).appendTo(ul);
                    };
                input.autocomplete('widget').on('click', function (e) {
                    $(this).menu('resetMouseHandled');
                    e.stopPropagation();
                });
            },
            shareStream: {
                openPopup: function (postUrl, streamData) {
                    Zenwork.Popup.preProcess({
                        my: 'center top',
                        at: 'center top+60',
                        of: window
                    }, true);
                    $.ajax({
                        type: 'POST',
                        url: postUrl,
                        dataType: 'html', //receive from server
                        contentType: 'json', //send to server
                        data: JSON.stringify({
                            slmid: streamData.slmid
                        }), //receive from server
                        success: function (data, textStatus, jqXHR) {
                            Zenwork.Popup.show(data);

                            //enable autoresize on textarea
                            Zenwork.Popup.wrapper.find('.AutoResizeTextbox').autoresize({
                                container: 'tmpContainer',
                                buffer: 1,
                                animate: false,
                                resizeOnStart: true,
                                onresize: function () {}
                            });
                            
                            //init sharing
                            var sharedEmailsInput = $('#sharedEmails');
                            Zenwork.Plugins.autocomplete(sharedEmailsInput, null, {
                                isMultiple: true,
                                remoteDatasource: Zenwork.Root+'/auth/searchEmail'
                            });
                            sharedEmailsInput.focus();
                            $('#shareToBtn').bind('click', function (e) {
                                var target = $(e.target);
                                if ( target.hasClass('CommonBtnDisabled') ) { return false; }
                                var sharedEmails = sharedEmailsInput.val().replace(/\s+/g, '').replace(/,$/g, '');
                                if ( sharedEmails === '' ) {
                                    sharedEmailsInput.focus();
                                    $('#invalidEmailsError')
                                        .removeClass('Hidden')
                                        .find('p:first').html('Please enter at least 1 email to share!');
                                }
                                else { //start sharing by emails
                                    target.addClass('Pending CommonBtnDisabled');
                                    $('#invalidEmailsError')
                                        .addClass('Hidden')
                                        .find('p:first').empty();

                                    Zenwork.Plugins.shareStream.start(
                                        target.attr('href'),
                                        sharedEmails,
                                        $('#sharedMessage').val(),
                                        shareUrlInput.val(),
                                        function () {
                                            target.removeClass('Pending CommonBtnDisabled');
                                        }
                                    );
                                }
                                return false;
                            });
                            //clipboard
                            var shareUrlInput = $('#sharedUrl');
                            var clipboard = new Zenwork.Clipboard(shareUrlInput);
                            clipboard.on('complete', function (client, args) {
                                shareUrlInput.select();
                                Zenwork.Notifier.notify('Text copied into clipboard!', 5);
                            });
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            if ( textStatus !== 'abort' ) {
                                alert('Really sorry for this, network error! Please try again!');
                            }
                        }
                    });
                },
                start: function (postUrl, emails, message, shareUrl, callback) {
                    $.ajax({
                        type: 'POST',
                        url: postUrl,
                        dataType: 'json', //receive from server
                        contentType: 'json', //send to server
                        data: JSON.stringify({
                            recipients: emails,
                            message: message,
                            url: shareUrl
                        }), //receive from server
                        success: function (data, textStatus, jqXHR) {
                            if ( callback !== undefined ) { callback(); }
                            Zenwork.Notifier.notify('Shared succesfully', 4);
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            if ( textStatus !== 'abort' ) {
                                alert('Really sorry for this, network error! Please try again!');
                            }
                        }
                    });
                }
            }
        }

        //enable live preview image when hover on element which has defined class
        Zenwork.Preview.bind({
            on: '.ZWPreview' //selector
        });
        
        //clipboard
        if ( ZeroClipboard !== undefined ) {
            Zenwork.Clipboard = ZeroClipboard;
            Zenwork.Clipboard.setDefaults({
                moviePath: Zenwork.Root+'/widgets/zeroclipboard/swf/zeroclipboard.swf'
            });
        }

        //notifier
        Zenwork.Notifier = new function () {
            var self = this;

            var notifier = $('#notifier');
            var timer;

            this.notify = function (text, delay) {
                this.off();

                $('#'+notifier.data('contentId')).html(text);
                notifier.removeClass('Hidden').show();
                if ( delay > 0 ) {
                    timer = setTimeout(function () {
                        notifier.fadeOut('medium', function () {
                            notifier.removeClass('Hidden');
                        });
                    }, delay*1000);
                }
            }

            this.off = function () {
                if ( timer !== undefined ) {
                    clearTimeout(timer);
                }
                notifier.stop().addClass('Hidden').hide().css({
                    opacity: 1
                });
                $('#'+notifier.data('contentId')).empty();
            }

            $('.DismissNotifier').on('click', function (e) {
                self.off();
                return false;
            });
        }

        //overlays
        Zenwork.Overlays = new function () {
            var self = this;
            var overlays = $('#overlays');

            this.observer;
            this.EVENT = {
                CLOSE: 'close'
            }

            overlays.on('click', function (e) {
                if ( self.observer !== undefined ) {
                    self.observer.trigger(self.EVENT.CLOSE);
                }
                return false;
            });

            this.show = function (within, extraClass) {
                overlays.addClass(extraClass).removeClass('Hidden')
                if ( within !== undefined ) {
                    within.append(
                        overlays.css({
                            height: within.height()
                        })
                    );
                }
                else {
                    overlays.css({
                        height: $(document).height()
                    });
                }
            }
            this.hide = function () {
                overlays.removeAttr('class').addClass('Hidden').appendTo('body');
            }
            this.getOverlays = function () { return overlays; }
        }

        //init global popup control
        Zenwork.Popup.init();

        //dialog, depend on Zenwork.Dialog
        Zenwork.Dialog.init();
        Zenwork.Dialog.container = window;
        if ( $.ui.datepicker != undefined ) {
            Zenwork.TimelineDialog = new function () { //Timeline dialog(Singleton)
                var self = this;
                var timelineDialog = $('#timelineDialog');
                //init timeline picker dialog
                var timelineDialogStartTimeCalendar = $('#timelineDialogStartTimeCalendar');
                var timelineDialogEndTimeCalendar = $('#timelineDialogEndTimeCalendar');
                var timelineDialogStartTime = $('#timelineDialogStartTime');
                var timelineDialogEndTime = $('#timelineDialogEndTime');
                var remoteTarget;
                
                this.EVENT = {
                    SELECT: 'select.timelineDialog',
                    UPDATE: 'update.timelineDialog',
                    CLOSE: 'close.timelineDialog'
                }
                this.updateTimelineDialog = function (start, end) {
                    if ( start !== undefined && start !== null && start !== '' ) {
                        var startDate = new Date(start);
                        timelineDialogStartTimeCalendar.datepicker('setDate', startDate);
                        timelineDialogEndTimeCalendar.datepicker('option', 'minDate', startDate);
                        //input
                        timelineDialogStartTime.val(startDate.toString('dd-MMM-yyyy'));
                    }
                    if ( end !== undefined && end !== null && end !== '' ) {
                        var endDate = new Date(end-1); //-1s to get 23:59:59
                        timelineDialogEndTimeCalendar.datepicker('setDate', endDate);
                        //input
                        timelineDialogEndTime.val(endDate.toString('dd-MMM-yyyy'));
                    }
                }
                this.getDialog = function () { return timelineDialog; }
                this.show = function (e, target, _remoteTarget_) {
                    remoteTarget = _remoteTarget_ || target;
                    timelineDialog
                        .data('observer', remoteTarget)
                        .removeClass('Hidden')
                        .position({
                            my: 'left top+3',
                            at: 'left bottom',
                            of: remoteTarget,
                            within: Zenwork.Dialog.container,
                            collision: 'flipfit'
                        });
                }

                //constructor
                $('#confirmChangeTimelineDialog').on('click', function (e) {
                    var startDate = new Date(timelineDialogStartTimeCalendar.datepicker('getDate'));
                    var endDate = new Date(timelineDialogEndTimeCalendar.datepicker('getDate'));
                    remoteTarget.trigger(self.EVENT.UPDATE, [startDate, endDate.setHours(23, 59, 59)]);
                    Zenwork.Dialog.close(timelineDialog);
                    return false;
                });
                $('.TimelineDialogCalendarPicker').datepicker({
                    constrainInput: true,
                    dateFormat: 'dd-M-yy',
                    dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
                    firstDay: 1,
                    showOtherMonths: true,
                    selectOtherMonths: true,
                    changeMonth: true,
                    changeYear: true,
                    onSelect: function (dateStr, inst) {
                        if ( inst.id == 'timelineDialogStartTimeCalendar' ) {
                            timelineDialogStartTime.val(dateStr);
                            if ( new Date(timelineDialogEndTimeCalendar.datepicker('getDate')).valueOf()
                                < new Date(dateStr).valueOf() 
                            ) {
                                timelineDialogEndTime.val(dateStr);
                            }
                            timelineDialogEndTimeCalendar.datepicker('option', 'minDate', dateStr);
                        }
                        else if ( inst.id == 'timelineDialogEndTimeCalendar' ) {
                            timelineDialogEndTime.val(dateStr);
                        }
                        remoteTarget.trigger(self.EVENT.SELECT, [inst.id, dateStr]);
                    }
                });
                Zenwork.Dialog.add(timelineDialog.data('ui', this));
            };
        }
        if ( $.ui.autocomplete != undefined ) {
            Zenwork.AssigneeDialog = new function () { //Assignee dialog(Singleton)
                var self = this;
                var onTimeline = null;
                var assigneeDialog = $('#assigneeDialog');
                var assigneeList = $('#assigneeList');
                var assigneeDialogSelect = $('#assigneeDialogSelect');
                var remoteTarget;
                var tmpWorkload = '';

                var _util_ = function (data) {
                    /*
                     * data {
                     *     id: value, //user id == Users_timeline.uid
                     *     username: value,
                     *     email: value
                     *     avatar: value
                     *     Users_timeline: { 
                     *         effort: value
                     *         id: value
                     *     }
                     * }
                     */
                    var isCreator = String(onTimeline.data('creatorID')) === Zenwork.Auth.User.id;
                    var isOwner = String(data.id) === Zenwork.Auth.User.id;
                    assigneeList.append(
                        '<li>'+
                        '    <label for="assigneeDialog'+data.id+'">'+data.username+'</label>'+
                        ( isCreator || isOwner
                            ? '<input data-qtip-my="bottom center" data-qtip-at="top center" data-uid="'+data.id+'" type="number" id="assigneeDialog'+data.id+'" class="TextInput AssigneeDialogWorkload QTip" title="Click to edit then enter or click oustside to update" value="'+data.Users_timeline.effort+'" />'
                            : '<input disabled="disabled" type="text" class="TextInput AssigneeDialogWorkload" title="" value="'+data.Users_timeline.effort+'" />'
                        )+
                        '    <span>wdays</span>'+
                        ( isCreator
                            ? '    <a href="'+data.id+'" title="Unassign" class="AssigneeDialogUnassignBtn">Unassign</a>'
                            : ''
                        )+
                        '    <a href="'+data.id+'" '+(isOwner ? 'title="Toggle completed"' : '')+' class="AssigneeDialogCompletionBtn '+(data.Users_timeline.completed > 2 ? 'AssigneeDialogCompletedBtn' : '')+' '+(isOwner ? '' : 'AssigneeDialogCompletionBtnDisabled')+'">Toggle completed</a>'+
                        '</li>'
                    );
                }
                var _updateView_ = function () {
                    assigneeDialog
                        .data('observer', remoteTarget)
                        .position({
                            my: 'left top+3',
                            at: 'left bottom',
                            of: remoteTarget,
                            within: Zenwork.Dialog.container,
                            collision: 'flipfit'
                        });
                }
                
                this.EVENT = {
                    ASSIGN: 'assign.assigneeDialog',
                    UNASSIGN: 'unassign.assigneeDialog',
                    UPDATE: 'update.assigneeDialog',
                    TOGGLE_COMPLETION: 'toggleCompletion.assigneeDialog'
                }
                this.show = function (e, target, _remoteTarget_) {
                    remoteTarget = _remoteTarget_ || target;
                    onTimeline = target;
                    assigneeList.empty();
                    assigneeDialog.removeClass('Hidden');
                    if ( onTimeline.data('User') !== undefined ) {
                        $.each(onTimeline.data('User'), function () {
                            _util_(this);
                        });
                    }
                    _updateView_();
                    assigneeDialogSelect.removeClass('Hidden').focus();
                }

                //constructor
                var cache = {}; //use for auto-suggest box
                var _response = function (data, request, response) {
                    response($.ui.autocomplete.filter(data, request.term));
                }
                var _split = function (val) {
                    return val.split(/,\s*/);
                }
                var _extractLast = function (term) {
                    return _split(term).pop();
                }
                var _addAssignee = function (e, uid, callback) {
                    var onTimelineData = onTimeline.data();
                    var effort = Math.round((onTimelineData.end - onTimelineData.start)/86400);
                    Zenwork.Notifier.notify('Updating...');
                    $.ajax({
                        type: 'POST',
                        url: Zenwork.Root+'/app/assignUserTimeline/'+uid+'/'+onTimelineData.id+'/'+effort,
                        dataType: 'json', //receive from server
                        success: function (data, textStatus, jqXHR) {
                            //data return: 0(error), number(exists, return 'uid'), object(new added)
                            if ( data == 0 ) {
                                //error
                            }
                            else if ( typeof(data) === 'object' ) {
                                if ( onTimelineData.User === undefined ) {
                                    onTimelineData.User = [data];
                                }
                                else {
                                    onTimelineData.User.push(data);
                                }
                                callback(data);
                                remoteTarget.trigger(self.EVENT.ASSIGN, data);
                            }
                            else { //number(exists, return 'uid')
                                Zenwork.Notifier.notify('Already assign to this people', 2);
                                assigneeDialogSelect.val('').focus();
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            if ( textStatus !== 'abort' ) {
                                alert('Really sorry for this, network error! Please try again!');
                            }
                        }
                    }); 
                }
                var _unassign = function (e, uid, callback) {
                    var onTimelineData = onTimeline.data();
                    Zenwork.Notifier.notify('Updating...');
                    $.ajax({
                        type: 'POST',
                        url: Zenwork.Root+'/app/unassignUserTimeline/'+uid+'/'+onTimelineData.id,
                        dataType: 'json', //receive from server
                        success: function (data, textStatus, jqXHR) {
                            //return unassign uid if success, false otherwise
                            if ( data ) {
                                /*
                                 * onTimelineData.User = [{
                                 *     id: value, //user id
                                 *     username: value,
                                 *     email: value
                                 *     avatar: value
                                 *     Users_timeline: { 
                                 *         effort: value
                                 *         id: value
                                 *     }
                                 * }, {}, ...]
                                 */
                                $.each(onTimelineData.User, function (index, value) {
                                    if ( value.id == data ) {
                                        onTimelineData.User.splice(index, 1);
                                        Zenwork.Notifier.notify('Updated');
                                        return false; //break
                                    }
                                });
                                callback(data);
                                var assigneeListLength = assigneeList.find('li').length;
                                remoteTarget.trigger(self.EVENT.UNASSIGN, [
                                    data,
                                    assigneeListLength > 0 && (assigneeList.find('.AssigneeDialogCompletedBtn').length
                                    === assigneeListLength)
                                ]);
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            if ( textStatus !== 'abort' ) {
                                alert('Really sorry for this, network error! Please try again!');
                            }
                        }
                    }); 
                }
                var _updateEffort = function (e, uid, effort, callback) {
                    var onTimelineData = onTimeline.data();
                    Zenwork.Notifier.notify('Updating...');
                    $.ajax({
                        type: 'POST',
                        url: Zenwork.Root+'/app/updateUserTimelineEffort/'+uid+'/'+onTimelineData.id+'/'+effort,
                        dataType: 'json', //receive from server
                        success: function (data, textStatus, jqXHR) {
                            //return effort value if success, false otherwise
                            if ( data ) {
                                /*
                                 * onTimelineData.User = [{
                                 *     id: value, //user id
                                 *     username: value,
                                 *     email: value
                                 *     avatar: value
                                 *     Users_timeline: { 
                                 *         effort: value
                                 *         id: value
                                 *     }
                                 * }, {}, ...]
                                 */
                                $.each(onTimelineData.User, function (index, value) {
                                    if ( value.id == uid ) {
                                        onTimelineData.User[index].Users_timeline.effort = data;
                                        return false; //break
                                    }
                                });
                                callback(data);
                                remoteTarget.trigger(self.EVENT.UPDATE, [uid, data]);
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            if ( textStatus !== 'abort' ) {
                                alert('Really sorry for this, network error! Please try again!');
                            }
                        }
                    }); 
                }
                var _toggleCompletion = function (e, uid, completed, effort, callback) {
                    Zenwork.Notifier.notify('Updating...');
                    $.ajax({
                        type: 'POST',
                        url: Zenwork.Root+'/app/updateUserTimelineCompletion/'+uid+'/'+onTimeline.data('id')+'/'+completed,
                        dataType: 'json', //receive from server
                        success: function (data, textStatus, jqXHR) {
                            //return true if success, false otherwise
                            if ( data ) {
                                Zenwork.Notifier.notify('Updated', 0.5);
                                /*
                                 * onTimelineData.User = [{
                                 *     id: value, //user id
                                 *     username: value,
                                 *     email: value
                                 *     avatar: value
                                 *     Users_timeline: { 
                                 *         effort: value
                                 *         id: value
                                 *     }
                                 * }, {}, ...]
                                 */
                                $.each(onTimelineData.User, function (index, value) {
                                    if ( value.id == uid ) {
                                        value.Users_timeline.completed = completed;
                                        return false; //break
                                    }
                                });
                                remoteTarget.trigger(self.EVENT.TOGGLE_COMPLETION, [
                                    uid,
                                    completed,
                                    assigneeList.find('.AssigneeDialogCompletedBtn').length
                                    === assigneeList.find('li').length
                                ]);
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            if ( textStatus !== 'abort' ) {
                                alert('Really sorry for this, network error! Please try again!');
                            }
                        }
                    }); 
                }
                assigneeDialogSelect.autocomplete({
                    autoFocus: true,
                    source: function (request, response) {
                        dataSource = Zenwork.Root+'/auth/searchByUsernameOrEmail';
                        var term = _extractLast(request.term);
                        if ( term in cache ) {
                            _response(cache[term], request, response);
                            return;
                        }

                        $.getJSON(dataSource, {
                            term: _extractLast(request.term)
                        }, function (data, status, xhr) {
                            if ( data.constructor !== Array ) {
                                var tmp = [];
                                $.each(data, function (key, value) {
                                    tmp.push({
                                        label: value,
                                        value: key
                                    });
                                });
                                data = tmp;
                            }
                            _response(data, request, response);
                            cache[term] = data;
                        });
                    },
                    focus: function (e, ui) {
                        return false; //return false prevent autocomplete auto set value of input = ui.item.value
                    },
                    select: function (e, ui) {
                        var self = this;
                        _addAssignee(e, ui.item.value, function (data) {
                            if ( typeof(data) === 'object' ) {
                                _util_(data);
                                assigneeDialog.removeClass('Hidden');
                                _updateView_();
                                assigneeDialogSelect.focus();
                                Zenwork.Notifier.notify('Assigned to '+data.username, 1);
                            }
                            else if ( typeof(data) === 'number' ) {
                                $('[data-uid="'+data+'"]').focus();
                            }
                            self.value = '';
                        });
                        this.value = '';
                        return false; //return false prevent autocomplete auto set value of input = ui.item.value
                    },
                    position: {
                        collision: 'flip'
                    }
                });
                assigneeDialogSelect.data('uiAutocomplete')._renderItem = function(ul, item) {
                    return $('<li>').append(
                        '<a class="'+(item.className === undefined ? '' : item.className )+'">'+
                        item.label.replace(
                            new RegExp(
                                '(?![^&;]+;)(?!<[^<>]*)(' +
                                $.ui.autocomplete.escapeRegex(_extractLast(assigneeDialogSelect.val())) +
                                ')(?![^<>]*>)(?![^&;]+;)', 'gi'
                            ),
                            '<strong class="SearchTerm">$1</strong>'
                        ) +
                        '</a>'
                    ).appendTo(ul);
                };
                assigneeDialogSelect.autocomplete('widget').on('click mousedown', function (e) {
                    e.stopPropagation();
                });
                assigneeDialog.on('click', '.AssigneeDialogCompletionBtn', function (e) { //toggle completion
                    var target = $(e.currentTarget);
                    if ( target.hasClass('AssigneeDialogCompletionBtnDisabled') ) { return false; }
                    var completed = target.hasClass('AssigneeDialogCompletedBtn') ? 2 : 3;
                    target.toggleClass('AssigneeDialogCompletedBtn');
                    _toggleCompletion(e, target.attr('href'), completed);
                    target.blur();
                    return false;
                });
                assigneeDialog.on('click', '.AssigneeDialogUnassignBtn', function (e) { //unassign
                    var target = $(e.currentTarget);
                    var parent = target.parent();
                    Zenwork.Window.confirm(
                        'Unassign '+parent.find('label').eq(0).text()+'?',
                        function () { //confirmed
                            _unassign(e, target.attr('href'), function () {
                                parent.remove();
                                _updateView_();
                            });
                        }, 
                        function () { //not confirmed
                            return false;
                        }
                    );
                    target.blur();
                    return false;
                });
                assigneeDialog.on('focus', '.AssigneeDialogWorkload', function (e) {
                     tmpWorkload = parseFloat(e.currentTarget.value);
                });
                assigneeDialog.on('blur', '.AssigneeDialogWorkload', function (e) {
                    if ( tmpWorkload === '' ) { return false; }
                    var target = $(e.currentTarget);
                    var newWorkload = parseFloat(target.val()); //parseFloat('') -> 'NaN'
                    if ( newWorkload === 'NaN'
                        || (tmpWorkload !== '' && newWorkload === tmpWorkload)
                    ) { //no change
                        target.val(tmpWorkload);
                        tmpWorkload = '';
                        return false;
                    }
                    target.val(newWorkload);
                    _updateEffort(e, target.data('uid'), newWorkload, function () {
                        Zenwork.Notifier.notify('Updated working days', 1);
                    });
                });
                assigneeDialog.on('keyup', '.AssigneeDialogWorkload', function (e) {
                    if ( e.which == 13 ) { //enter
                        $(e.currentTarget).blur();
                    }
                });
                assigneeDialog.on('keydown', '.AssigneeDialogWorkload', function (e) {
                    if ( (e.which >= 48 && e.which <= 57) //0-9
                        || (e.which >= 96 && e.which <= 105) //Numlock 0-9
                        || e.which == 8 /* backspace */
                        || e.which == 9 /* tab */
                        || e.which == 46 /* delete */
                        || e.which == 37 /* arrow left */
                        || e.which == 39 /* arrow right */
                        || e.which == 16 /* shift */
                        || e.which == 17 /* ctrl */
                        || e.which == 18 /* alt */
                        || e.which == 35 /* end */
                        || e.which == 36 /* home */
                        || e.which == 116 /* F5 */
                        || ((e.which == 110 || e.which == 190) && e.currentTarget.value.search(/\./g) === -1 ) 
                        /* . -> allow only 1 dot, warning, dot in normal keyboard and dot when 'Numlock ON' */
                    ) {
                        return true;
                    }
                    return false;
                });
                assigneeDialogSelect.autocomplete('widget').on('click', function (e) {
                    $(this).menu('resetMouseHandled');
                    e.stopPropagation();
                });
                Zenwork.Dialog.add(assigneeDialog.data('ui', this));
            }
        }
        Zenwork.TagDialog = new function () {
            var tagDialog = $('#tagDialog');
            var tagInput = $('#tagDialogInput');
            var _show = function (target) {
                var stream = $(target.attr('href'));
                var streamData = stream.data();
                var streamApi = $('#'+streamData.ui);
                tagInput.val(streamData.tag);
                if ( tagInput.data('uiTagit') !== undefined ) { 
                    tagInput.data('uiTagit').tagList.remove();
                    tagInput.tagit('destroy');
                }
                Zenwork.Plugins.tagit.call(tagInput, target.data('sid'));
                setTimeout(function () {
                    tagInput.data('uiTagit').tagInput.focus();
                }, 1);
                tagInput
                    .off('.tagit')
                    .on('afterTagAdded.tagit', function (e, label) {
                        _updatePosition(target);
                        streamApi.stream('updateStreamTag', e, stream, true, label);
                    })
                    .on('afterTagRemoved.tagit', function (e, label) {
                        _updatePosition(target);
                        streamApi.stream('updateStreamTag', e, stream, false, label);
                    });

                tagDialog.removeClass('Hidden').data('observer', target);
                _updatePosition(target);
            }
            var _updatePosition = function (target) {
                tagDialog
                    .position({
                        my: 'left bottom',
                        at: 'right-10 top+10',
                        of: target,
                        within: window,
                        collision: 'flipfit'
                    });
            }
            
            Zenwork.Dialog.add(tagDialog.data('ui', this));
            return {
                show: _show
            }
        }
        
        //browser screen
        Zenwork.Screen = {
            fullscreen: function () {
                var el = document.documentElement;
                //for newer Webkit and Firefox
                var rfs = el.requestFullScreen
                        || el.webkitRequestFullScreen
                        || el.mozRequestFullScreen
                        || el.msRequestFullScreen;
                if ( rfs !== undefined && rfs ) {
                    rfs.call(el);
                } 
                else if( window.ActiveXObject !== undefined ) {
                  //for Internet Explorer
                  var wscript = new ActiveXObject('WScript.Shell');
                  if ( wscript != null ) {
                     wscript.SendKeys('{F11}');
                  }
                }
            }
        }

        //window alert, confirm, prompt
        Zenwork.Window = {
            windowScrolling: true,
            alert: function (message) {
                alert(message);
            },
            confirm: function (message, callback, reject) {
                var isConfirmed = confirm(message);
                if ( isConfirmed ) {
                    if ( callback !== undefined ) { callback(); }
                }
                else {
                    if ( reject !== undefined ) { reject(); }
                }
            },
            prompt: function (question, callback) {
                var inputValue = prompt(question);
                if ( callback !== undefined ) { callback(inputValue); }
            },
            toggleWindowScrolling: function (enable) {
                this.windowScrolling = enable;
            }
        }

        //user profile box on top left
        $('#accountSettingLnk').bind('mouseover', function (e) {
            $('#accountSettingBoxContainer').removeClass('Hidden');
            $(this).addClass('Hover');
            e.stopPropagation();
        });
        $(document).bind('mouseover', function (e) {
            $('#accountSettingBoxContainer').addClass('Hidden');
            $('#accountSettingLnk').removeClass('Hover');
            e.stopPropagation();
        });
        $('#accountSettingBoxContainer').bind('mouseover', function (e) {
            $('#accountSettingLnk').addClass('Hover');
            e.stopPropagation();
        });

        //layout scripts
        var _resizeLayout_ = function () {
            var windowHeight = $(window).height();

            $('#sideBar').css({
                height: windowHeight
            }).removeClass('Invisible');

            $('#outer').css({
                height: $('#outer').height() < windowHeight ? windowHeight : 'auto'
            });
        }
        _resizeLayout_();
        $(window).on('resize', function (e) {
            _resizeLayout_();
        });

        //scroll to top button
        $.scrollUp({
            scrollName: 'zwScrollUp', // Element ID
            topDistance: '300', // Distance from top before showing element (px)
            topSpeed: 300, // Speed back to top (ms)
            animation: 'fade', // Fade, slide, none
            animationInSpeed: 200, // Animation in speed (ms)
            animationOutSpeed: 200, // Animation out speed (ms)
            activeOverlay: false // Set CSS color to display scrollUp active point, e.g '#00FFFF'
        });

        //helpers
        $('.ZWContainer').appendTo('body');
        
        $(window).bind('mousewheel', function (e) {
            if ( !Zenwork.Window.windowScrolling ) { e.preventDefault(); }
        });

        //Zenwork start-up tour
        var tourBlock = $('#zwStartUpTour').data('backgroundPosX', 0);
        if ( tourBlock.length > 0 ) {
            Zenwork.Overlays.show();
        }
        var tourList = $('#zwHelpTour');
        var tourListWidth = tourList.width();
        var _util_ = function (element, direction) {
            if ( element.length == 0 ) { return false; }

            var newBgPosX = tourBlock.data('backgroundPosX')+(direction*100);
            tourBlock.animate({
                backgroundPositionX: newBgPosX
            }, {
                duration: 800,
                complete: function () {
                    tourBlock.data('backgroundPosX', newBgPosX)
                }
            });

            var title = element.find('.ZWHelpTourTitle');
            var description = element.find('.ZWHelpTourDescription');
            var extras = element.find('.ZWHelpTourExtras');

            title.animate({
                marginLeft: (direction < 0 ? '+=' : '-=')+tourListWidth
            }, {
                duration: 800,
                easing: 'easeInBack'
            });
            description.animate({
                marginLeft: (direction < 0 ? '+=' : '-=')+tourListWidth
            }, {
                duration: 900,
                easing: 'easeInBack'
            });
            setTimeout(function () {
                extras.animate({
                    marginLeft: (direction < 0 ? '+=' : '-=')+tourListWidth
                }, {
                    duration: 500,
                    complete: function () {
                       element.toggleClass('Active', !element.hasClass('Active')) ;
                       $('.ZWHelpTourControl').removeClass('ZWHelpTourControlPending');
                    }
                });
            }, 500);
        }
        $('.ZWHelpTourControl').on('click', function (e) {
            var $this = $(this);
            if ( $this.hasClass('CommonBtnDisabled') || $this.hasClass('ZWHelpTourControlPending') ) {
                return false;
            }
            $('.ZWHelpTourControl').addClass('ZWHelpTourControlPending');

            var dir = 1;
            if ( $this.hasClass('ZWHelpTourControlNext') ) {
                dir = 1;
            }
            else if ( $this.hasClass('ZWHelpTourControlPrev') ) {
                dir = -1;
            }

            var currentActive = tourList.find('li.Active');
            _util_(currentActive, dir);
            var pending = dir < 0 ? currentActive.prev() : currentActive.next();
            _util_(pending, dir);
            var nextPending = dir < 0 ? pending.prev() : pending.next();
            $('.CommonBtnDisabled').removeClass('CommonBtnDisabled');
            if ( pending.length > 0 && nextPending.length == 0 ) {
                $this.addClass('CommonBtnDisabled');
            }

            if ( dir < 0 ) {
                $('.ZWHelpTourControlPrev').attr('title', nextPending.length == 0 ? 'No slide' : 'Previous slide: <strong>'+nextPending.data('slide')+'</strong>');
                $('.ZWHelpTourControlNext').attr('title', 'Next slide: '+currentActive.data('slide'));
            }
            else {
                $('.ZWHelpTourControlPrev').attr('title', 'Previous slide: '+currentActive.data('slide'));
                $('.ZWHelpTourControlNext').attr('title', nextPending.length == 0 ? 'No more slide' : 'Next slide: <strong>'+nextPending.data('slide')+'</strong>');
            }

            return false;
        });
        $('.ZWHelpTourControlDismiss').on('click', function (e) {
            tourBlock.animate({
                top: '+=50px'
            }, {
                duration: 300,
                complete: function () {
                    tourBlock.animate({
                        top: '-=1000px'
                    }, {
                        duration: 300,
                        complete: function () {
                            Zenwork.Overlays.hide(true);
                            tourBlock.addClass('Hidden');
                            Core.Mediator.pub('startUpTourDismiss.App');
                        }
                    });
                }
            });

            $.ajax({
                type: 'POST',
                url: Zenwork.Root+'/app/dismissHelp',
                contentType: 'json',
                dataType: 'json',
                data: JSON.stringify({
                    name: 'alphaVersionFirstLogin',
                    scope: 'app'
                })
            });
                
            return false;
        });
    })(jQuery);
});

//Chart configuration
Zenwork.Chart = {
    Line: {
        defaults: {
            //Boolean - If we show the scale above the chart data            
            scaleOverlay: false,
            
            //Boolean - If we want to override with a hard coded scale
            scaleOverride: false,
            
            //** Required if scaleOverride is true **
            //Number - The number of steps in a hard coded scale
            scaleSteps: null,
            //Number - The value jump in the hard coded scale
            scaleStepWidth: null,
            //Number - The scale starting value
            scaleStartValue: null,

            //String - Colour of the scale line    
            scaleLineColor: 'rgba(219, 219, 219, 1)',
            
            //Number - Pixel width of the scale line    
            scaleLineWidth: 1,

            //Boolean - Whether to show labels on the scale    
            scaleShowLabels: true,
            
            //Interpolated JS string - can access value
            scaleLabel: '<%=value%>',
            
            //String - Scale label font declaration for the scale label
            scaleFontFamily: '"Trebuchet MS"',
            
            //Number - Scale label font size in pixels    
            scaleFontSize: 12,
            
            //String - Scale label font weight style    
            scaleFontStyle: 'normal',
            
            //String - Scale label font colour    
            scaleFontColor: '#444',    
            
            ///Boolean - Whether grid lines are shown across the chart
            scaleShowGridLines: true,
            
            //String - Colour of the grid lines
            scaleGridLineColor: 'rgba(219, 219, 219, 1)',
            
            //Number - Width of the grid lines
            scaleGridLineWidth: 1,    
            
            //Boolean - Whether the line is curved between points
            bezierCurve: true,
            
            //Boolean - Whether to show a dot for each point
            pointDot: true,

            //Boolean - Whether to show value on each point
            pointValue: false,
            
            //Number - Radius of each point dot in pixels
            pointDotRadius: 4,
            
            //Number - Pixel width of point dot stroke
            pointDotStrokeWidth: 1,
            
            //Boolean - Whether to show a stroke for datasets
            datasetStroke: true,
            
            //Number - Pixel width of dataset stroke
            datasetStrokeWidth: 2,
            
            //Boolean - Whether to fill the dataset with a colour
            datasetFill: true,
            
            //Boolean - Whether to animate the chart
            animation: true,

            //Number - Number of animation steps
            animationSteps: 30,
            
            //String - Animation easing effect
            animationEasing: 'easeOutQuart',

            //Function - Fires when the animation is complete
            onAnimationComplete: null
        }
    },
    Bar: {
        defaults: {
            //Boolean - If we show the scale above the chart data            
            scaleOverlay : false,
            
            //Boolean - If we want to override with a hard coded scale
            scaleOverride : false,
            
            //** Required if scaleOverride is true **
            //Number - The number of steps in a hard coded scale
            scaleSteps : null,
            //Number - The value jump in the hard coded scale
            scaleStepWidth : null,
            //Number - The scale starting value
            scaleStartValue : null,

            //String - Colour of the scale line    
            scaleLineColor : 'rgba(0,0,0,.1)',
            
            //Number - Pixel width of the scale line    
            scaleLineWidth : 1,

            //Boolean - Whether to show labels on the scale    
            scaleShowLabels : false,
            
            //Interpolated JS string - can access value
            scaleLabel : '<%=value%>',
            
            //String - Scale label font declaration for the scale label
            scaleFontFamily : '"Trebuchet MS"',
            
            //Number - Scale label font size in pixels    
            scaleFontSize : 12,
            
            //String - Scale label font weight style    
            scaleFontStyle : 'normal',
            
            //String - Scale label font colour    
            scaleFontColor : '#666',    
            
            ///Boolean - Whether grid lines are shown across the chart
            scaleShowGridLines : true,
            
            //String - Colour of the grid lines
            scaleGridLineColor : 'rgba(0,0,0,.05)',
            
            //Number - Width of the grid lines
            scaleGridLineWidth : 1,    

            //Boolean - If there is a stroke on each bar    
            barShowStroke : true,
            
            //Number - Pixel width of the bar stroke    
            barStrokeWidth : 2,
            
            //Number - Spacing between each of the X value sets
            barValueSpacing : 5,
            
            //Number - Spacing between data sets within X values
            barDatasetSpacing : 1,
            
            //Boolean - Whether to animate the chart
            animation : true,

            //Number - Number of animation steps
            animationSteps : 60,
            
            //String - Animation easing effect
            animationEasing : 'easeOutQuart',

            //Function - Fires when the animation is complete
            onAnimationComplete : null
        }
    },

    Control: {
        installTo: function (element, datasets) {
            element.off('.zenworkchart')
            var elementData = element.data();
            elementData.active = [];

            element.on('click.zenworkchart', 'li', function () {
                var $this = $(this);
                var key = $this.data('key');
                var _datasets = {};

                if ( $this.hasClass('ZWChartLegendActive') ) {
                    $this.removeClass('ZWChartLegendActive');
                    //show all if only 1 active and click on that legend
                    if ( elementData.active.length == 1 ) {
                        element.find('li').removeClass('ZWChartLegendInvisible');
                        _datasets = datasets; //show all
                    }
                    else {
                        $this.addClass('ZWChartLegendInvisible');
                        for ( var i = 0; i < elementData.active.length; i++ ) {
                            if ( elementData.active[i] == key ) { continue; }
                            _datasets[elementData.active[i]] = datasets[elementData.active[i]];
                        }
                    }
                    elementData.active.splice(elementData.active.indexOf(key), 1);
                }
                else { //click others
                    element.find('li').addClass('ZWChartLegendInvisible');
                    $this.addClass('ZWChartLegendActive').removeClass('ZWChartLegendInvisible');
                    
                    _datasets[key] = datasets[key];

                    var _selector_ = [];
                    if ( elementData.active.length > 0 ) {
                        for ( var i = 0; i < elementData.active.length; i++ ) {
                            _datasets[elementData.active[i]] = datasets[elementData.active[i]];
                            _selector_.push('li[data-key="'+elementData.active[i]+'"]');
                        }
                        element.find(_selector_.join()).addClass('ZWChartLegendActive').removeClass('ZWChartLegendInvisible');
                    }

                    elementData.active.push(key);
                }
                element.trigger('update.zenworkchart', _datasets);
            });
        }
    }
}

//List is collection of streams
Zenwork.List = {
    EVENT: {
        CREATE: 'create',
        UPDATE: 'update',
        DELETE: 'delete'
    },
    active: 0,
    hookAction: {},
    hook: function (when, listener, action) {
        this.hookAction[when][listener] = action;
    },
    buttons: {
        create: $('<div/>'),
        edit: $('<div/>')
    },
    onListener: null,
    toggleEditing: function (editable) {
        this.buttons.edit.toggleClass('CommonBtnDisabled', !editable);
    },
    init: function () {
        this.hookAction[this.EVENT.CREATE] = [];
        this.hookAction[this.EVENT.UPDATE] = [];
        this.hookAction[this.EVENT.DELETE] = [];
    
        //buttons
        var createNewStreamListBtn = this.buttons.create = $('#createNewStreamList');
        var editSelectedStreamListBtn = this.buttons.edit = $('#editSelectedStreamList');
        var manageUserListBtn = $('#manageUserList');
        var pos = {
            my: 'center top',
            at: 'center top+60',
            of: window
        };
        
        //create, edit, delete stream list document
        var _CUStreamList_ = function (CU) {
            var postUrl = Zenwork.Root+'/slist/cu';
            var ajaxGetData = {};
            if ( CU === Zenwork.List.EVENT.UPDATE ) {
                ajaxGetData.id = Zenwork.List.active;
            }
            Zenwork.Popup.preProcess(pos, true);
            $.ajax({
                type: 'POST',
                url: postUrl,
                dataType: 'html', //receive from server
                contentType: 'json',
                data: JSON.stringify(ajaxGetData),
                success: function (data, textStatus, jqXHR) {
                    Zenwork.Popup.show(data);
                    
                    //init autoresize textarea
                    Zenwork.Popup.wrapper.find('.AutoResizeTextbox').autoresize({
                        container: 'tmpContainer',
                        buffer: 1,
                        animate: false,
                        resizeOnStart: true,
                        onresize: function () {}
                    });

                    var newPlanNameField = $('#newPlanName').focus();
                    var newPlanDescriptionField = $('#newPlanDescription');
                    var newPlanBelongsToField = $('#newPlanBelongsTo');
                    
                    //validate form and submit
                    $('#submitPlanFormBtn').on('click', function (e) {
                        var $target = $(e.currentTarget).addClass('Pending');
                        //validate
                        if ( newPlanNameField.val() === '' ) {
                            $target.removeClass('Pending');
                            newPlanNameField.addClass('Error').focus();
                            newPlanNameField.parent().find('.ErrorBox').removeClass('Hidden');
                            return false;
                        }
                        else {
                            newPlanNameField.removeClass('Error');
                            newPlanNameField.parent().find('.ErrorBox').addClass('Hidden');
                        }

                        //submit
                        var ajaxPostData = {
                            name: newPlanNameField.val(),
                            description: newPlanDescriptionField.val()
                        };
                        if ( CU === Zenwork.List.EVENT.UPDATE ) {
                            ajaxPostData.id = Zenwork.List.active;
                        }
                        $.ajax({
                            type: 'POST',
                            url: postUrl,
                            dataType: 'json', //receive from server
                            contentType: 'json', //send to server
                            data: JSON.stringify(ajaxPostData),
                            success: function (data, textStatus, jqXHR) {
                                var newDOM = '<li class="Active"><a href="'+data.id+'">'+data.name+'</a></li>';
                                if ( CU === Zenwork.List.EVENT.CREATE ) {
                                    $('#streamListSelection li.Active').removeClass('Active');
                                    $('#streamListSelection').append(newDOM);
                                }
                                else if ( CU === Zenwork.List.EVENT.UPDATE ) {
                                    $('#streamListSelection li.Active').replaceWith(newDOM);
                                }

                                if ( CU === Zenwork.List.EVENT.CREATE ) {
                                    Zenwork.Popup.close(true);
                                    
                                    if ( Zenwork.List.hookAction[CU] !== undefined && Zenwork.List.hookAction[CU] !== null ) {
                                        Zenwork.List.hookAction[CU][Zenwork.List.onListener](data);
                                    }
                                }
                                else if ( CU === Zenwork.List.EVENT.UPDATE ) {
                                    Zenwork.Popup.close(true);
                                    Zenwork.Notifier.notify('Updated', 1);
                                }
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                if ( textStatus !== 'abort' ) {
                                    alert('Really sorry for this, network error! Please try again!');
                                }
                            }
                        });
                        return false;
                    });

                    if ( Zenwork.List.active != 1 ) {
                        //delete
                        $('#deletePlanFormBtn').on('click', function (e) {
                            var $target = $(e.currentTarget).addClass('Pending');
                            Zenwork.Window.confirm('Sure? All tasks in this plan will be deleted.\nIt can not be undone',
                                function () {
                                   $.ajax({
                                        type: 'POST',
                                        url: Zenwork.Root+'/slist/remove/'+Zenwork.List.active,
                                        dataType: 'json', //receive from server
                                        success: function (data, textStatus, jqXHR) {
                                            $target.removeClass('Pending');

                                            $('#streamListSelection li.Active').remove();
                                            
                                            Zenwork.List.active = 0;
                                            editSelectedStreamListBtn.addClass('CommonBtnDisabled');
                                            if ( Zenwork.List.hookAction[Zenwork.List.EVENT.DELETE] !== undefined && Zenwork.List.hookAction[Zenwork.List.EVENT.DELETE] !== null ) {
                                                Zenwork.List.hookAction[Zenwork.List.EVENT.DELETE][Zenwork.List.onListener](data);
                                            }

                                            Zenwork.Popup.close(true);
                                        },
                                        error: function (jqXHR, textStatus, errorThrown) {
                                            if ( textStatus !== 'abort' ) {
                                                alert('Really sorry for this, network error! Please try again!');
                                            }
                                        }
                                    }); 
                                },
                                function () {
                                    $target.removeClass('Pending');
                                }
                            );
                            return false;
                        });
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if ( textStatus !== 'abort' ) {
                        alert('Really sorry for this, network error! Please try again!');
                    }
                }
            });
        }
        createNewStreamListBtn.on('click', function (e) {
            Zenwork.Planner.pub('afterClickCreatePlan.Help.Planner');

            _CUStreamList_(Zenwork.List.EVENT.CREATE);
            return false;
        });
        editSelectedStreamListBtn.on('click', function (e) {
            if ( editSelectedStreamListBtn.hasClass('CommonBtnDisabled') ) { return false;  }
            _CUStreamList_(Zenwork.List.EVENT.UPDATE);
            return false;
        });

        var _manageUserList_ = function (CU) {
            var postUrl = Zenwork.Root+'/slist/manageUserList/'+Zenwork.List.active;
            Zenwork.Popup.preProcess(pos, true);
            $.ajax({
                type: 'POST',
                url: postUrl,
                dataType: 'html', //receive from server
                success: function (data, textStatus, jqXHR) {
                    Zenwork.Popup.show(data);

                    if ( Zenwork.List.active != 1 ) {
                        //init auto suggest email
                        var invitedEmails = $('#invitedEmails').focus();
                        Zenwork.Plugins.autocomplete(invitedEmails, null, {
                            isMultiple: true,
                            remoteDatasource: Zenwork.Root+'/auth/searchEmail',
                            autocomplete: {
                                minLength: 0
                            }
                        });
                        
                        //init autoresize textarea
                        Zenwork.Popup.wrapper.find('.AutoResizeTextbox').autoresize({
                            container: 'tmpContainer',
                            buffer: 1,
                            animate: false,
                            resizeOnStart: true,
                            onresize: function () {}
                        });

                        //send invitation button
                        $('#sendListInvitation').on('click', function (e) {
                            if ( !$(e.currenttarget).hasClass('Pending') ) {
                                _sendInvitation_(e);
                            }
                            return false;
                        });

                        //remove user button
                        $('#listInvitedPeople').on('click', '.RemoveUserList', function (e) {
                            if ( confirm('Sure?') ) {
                                var target = $(e.currentTarget) ;
                                _removeUserList_(target.attr('href'));
                                $(target.attr('rel')).remove();
                            }
                            return false;
                        });

                        Zenwork.Plugins.jScrollPane.call($('#listInvitedPeople').parent(), {verticalGutter: 0});
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if ( textStatus !== 'abort' ) {
                        alert('Really sorry for this, network error! Please try again!');
                    }
                }
            });
        }
        var _sendInvitation_ = function (e) {
            var target = $(e.target).addClass('Pending');
            var invitedEmails = $('#invitedEmails');
            var invitedMessage = $('#invitedMessage');
            var invalidInvitedEmailsError = $('#invalidInvitedEmailsError');
            invitedEmails.attr('disabled', 'disabled');
            invitedMessage.attr('disabled', 'disabled');
            if ( invitedEmails.val() == '' ) {
                invitedEmails.addClass('Error').removeAttr('disabled').focus();
                invitedMessage.removeAttr('disabled');
                invalidInvitedEmailsError
                    .removeClass('Hidden')
                    .find('p:first').html('<strong>Email can not be blank</strong>');
                $(invitedEmails, invitedMessage).removeAttr('disabled');
                target.removeClass('Pending');
                return false;
            }
            invitedEmails.removeClass('Error');

            //post data
            $.ajax({
                type: 'POST',
                dataType: 'json', //receive from server
                contentType: 'json', //send to server
                url: target.attr('href'),
                data: JSON.stringify({
                    recipients: invitedEmails.val(),
                    message: invitedMessage.val()
                }),
                success: function (data, textStatus, jqXHR) {
                    var msg = '';
                    if ( data.valid !== '' ) {
                        //append
                        $.each(data.invited, function () {
                            $('#listInvitedPeople').append(
                                '<li id="invited'+this.User.id+'" class="QTip" title="Participant" data-qtip-my="right center" data-qtip-at="left center">'+
                                '    <img onerror="this.src=\''+Zenwork.Root+'/images/default-avatar.png\'" src="'+Zenwork.Root+(this.User.avatar ? '/upload_files/'+this.User.avatar : '/images/default-avatar.png')+'" alt="'+this.User.username+'">'+
                                '    <span>'+this.User.username+'</span>'+
                                '    <a class="QTip RemoveUserList" href="'+this.User.id+'" rel="#invited'+this.User.id+'" title="Remove '+this.User.username+' from this plan">Remove '+this.User.username+' from this plan</a>'+
                                '</li>'
                            );
                        });

                        msg += 'Invitation have been sent';
                        invitedEmails.removeClass('Error').val(data.valid);
                        if ( data.invalid !== '' ) {
                            msg += ' but contains some errors'
                            invitedEmails.addClass('Error').focus();
                            invalidInvitedEmailsError
                                .removeClass('Hidden')
                                .find('p:first').html('<strong>Invalid emails: </strong>'+data.invalid);
                        }
                        Zenwork.Notifier.notify(msg, 2);
                        invitedEmails.val('');
                    }
                    else {
                        invitedEmails.addClass('Error').focus();
                        invalidInvitedEmailsError
                            .removeClass('Hidden')
                            .find('p:first').html('<strong>Invalid emails: </strong>'+data.invalid);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if ( textStatus !== 'abort' ) {
                        alert('Really sorry for this, network error! Please try again!');
                    }
                },
                complete: function (jqXHR, textStatus) {
                    invitedEmails.removeAttr('disabled');
                    invitedMessage.removeAttr('disabled');
                    target.removeClass('Pending');
                }
            });
        }
        var _removeUserList_ = function (uid) {
            $.ajax({
                type: 'POST',
                url: Zenwork.Root+'/slist/removeUserList/'+uid+'/'+Zenwork.List.active,
                dataType: 'json', //receive from server
                success: function (data, textStatus, jqXHR) {
                    Zenwork.Notifier.notify('Removed', 1);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if ( textStatus !== 'abort' ) {
                        alert('Really sorry for this, network error! Please try again!');
                    }
                }
            });
        }
        manageUserListBtn.on('click', function (e) {
            _manageUserList_();
            return false;
        });
    }
};

//popup
Zenwork.Popup = {
    options: {
        wrapperID: '#zwDialog',
        contentID: '#zwDialogContent'
    },
    isInit: false,
    wrapper: null,
    content: null,
    init: function (opts) {
        if ( this.isInit ) { return this; }

        opts = $.extend(true, this.options, opts);
        this.wrapper = $(opts.wrapperID);
        this.content = $(opts.contentID);
        var self = this;
        $(document).on('click mousedown', opts.wrapperID, function (e) {
            e.stopPropagation();
        });
        $(document).on('click', function (e) {
            if (e.which == 3) { e.stopPropagation(); }
            else {
                self.close.call(self, true);
            }
        });

        this.wrapper.on('mouseenter', function (e) {
            Zenwork.Window.toggleWindowScrolling(false);
        });
        this.wrapper.on('mouseleave', function (e) {
            Zenwork.Window.toggleWindowScrolling(true);
        });
        this.wrapper.on('click', '.ZWDialogCloseBtn', function (e) {
            self.close.call(self, true);
            e.preventDefault();
        });
        this.wrapper.on(Zenwork.Overlays.EVENT.CLOSE, function (e) {
            self.close(true);
        });

        this.isInit = true;
    },
    close: function (animate) {
        var self = this;
        var _close_ = function () {
            this.wrapper.addClass('Hidden');
            this.content.empty();
            $('#tmpContainer').empty();
            Zenwork.Overlays.hide();
        }
        
        if ( !this.wrapper.hasClass('Hidden') ) {
            if ( animate ) {
                this.wrapper.animate({
                    top: -1000
                }, 'medium', function () {
                    _close_.call(self);
                });
            }
            else {
                _close_.call(this);
            }
        }
    },
    preProcess: function (/*object {}*/pos, showOverlays) {
        Core.Mediator.pub('beforeShowPopup.Popup');

        this.content.empty();
        this.wrapper
            .addClass('Pending')
            .removeClass('Hidden')
            .position(pos);
        var showOverlays = showOverlays || false;
        if ( showOverlays ) {
            Zenwork.Overlays.show();
            Zenwork.Overlays.observer = this.wrapper;
        }
    },
    show: function (data, /*object {}*/pos) {
        this.wrapper.removeClass('Pending');
        if ( data !== undefined ) {
            this.content.html(data);
        }
        if ( pos != undefined ) {
            this.wrapper.position(pos);
        }
        else {
            this.wrapper
                .css({
                    left: '50%'
                })
                .animate({
                    top: '+='+50
                }, 'medium');
        }
    },
    getTitle: function () {
        return $('#streamDialogTitle');
    }
}
Zenwork.StreamPopup = $.extend(true, {}, Zenwork.Popup, {
    _super: Zenwork.Popup,
    options: {
        wrapperID: '#streamDialog',
        contentID: '#streamDialogContent'
    },
    isInit: false,
    EVENT: {
        VIEW_COMMENT: 'viewComment',
        VIEW_ATTACHMENT: 'viewAttachment'
    },
    observer: null,
    aside: null,
    init: function () {
        if ( this.isInit ) { return this; }
        if ( !this._super.isInit ) { this._super.init.call(this); }
        
        var self = this;
        this.aside = $('#streamDialogAside');
        this.wrapper.on('click', '.StreamDialogViewComment', function (e) {
            self.tab.find('.Active').removeClass('Active');
            $(e.currentTarget).parent().addClass('Active');
            if ( self.observer !== null ) {
                self.observer.trigger(self.EVENT.VIEW_COMMENT);
            }
            return false;
        });
        this.wrapper.on('click', '.StreamDialogViewAttachment', function (e) {
            self.tab.find('.Active').removeClass('Active');
            $(e.currentTarget).parent().addClass('Active');
            if ( self.observer !== null ) {
                self.observer.trigger(self.EVENT.VIEW_ATTACHMENT);
            }
            return false;
        });
        this.wrapper.on('click', '.StreamDialogShare', function (e) {
            var $this = $(this);
            var $thisData = $this.data();
            Zenwork.Plugins.shareStream.openPopup($this.attr('href'), $('#'+$thisData.streamPrefix+'s'+$thisData.sid).data());
            return false;
        });
        this.wrapper.on('click', '.StreamDialogFollow', function (e) {
            var $this = $(this);
            var followText = $this.find('em').eq(0);
            var counter = $this.find('.StreamDialogFollowCounter').eq(0);
            var followed = $this.attr('data-followed');
            var countFollower = parseInt(counter.text());
            if ( followed == 'true' ) {
                $this.attr('data-followed', 'false');
                countFollower--;
                counter.text(countFollower).attr('title', countFollower+' people followed this task');
                followText.text('Follow');
            }
            else {
                $this.attr('data-followed', 'true');
                countFollower++;
                counter.text(countFollower).attr('title', 'You '+(countFollower == 1 ? '' : 'and '+(countFollower-1)+' others ')+'followed this');
                followText.text('Unfollow');
            }

            $.ajax({
                type: 'POST',
                url: Zenwork.Root+'/streams/'+(followed == 'true' ? 'unfollow' : 'follow')+'/'+$this.data('sid'),
                dataType: 'json', //receive from server
                success: function (data, textStatus, jqXHR) {
                    Zenwork.Notifier.notify('You have '+(followed == 'true' ? 'unfollowed' : 'followed')+' this task', 4);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if ( textStatus !== 'abort' ) {
                        alert('Really sorry for this, network error! Please try again!');
                    }
                }
            });
            return false;
        });

        this.isInit = true;
    },
    close: function () {
        if ( !this.wrapper.hasClass('Hidden') ) {
            Core.Mediator.pub('beforeCloseStreamPopup.StreamPopup');
            this._super.close.call(this);
            this.observer = null;
            Core.Mediator.pub('afterCloseStreamPopup.StreamPopup');
        }
    },
    preAsideProcess: function () {
        this.aside.empty();
        this.wrapper.addClass('Pending');
    },
    show: function (data, /*object {}*/pos) {
        this.wrapper.removeClass('Pending');

        if ( data !== undefined ) {
            this.content.html(data.content);
        }

        this.aside.html(data.aside);
        this.tab = $('#streamDialogTab');

        if ( pos != undefined ) {
            this.wrapper.position(pos);
        }
    },
    updateCommentView: function (value) {
        var commentView = this.tab.find('.StreamDialogViewComment span').eq(0);
        commentView.text(Number(commentView.text())+value);
    },
    updateAttachmentView: function (value) {
        var attachmentView = this.tab.find('.StreamDialogViewAttachment span').eq(0);
        attachmentView.text(Number(attachmentView.text())+value);
    }
});

//control dialogs(Singleton)
Zenwork.Dialog = {
    //members
    dialogs: $([]),
    container: $([]),

    //methods
    _close: function (dialog) {
        if ( dialog.is(':visible') ) {
            dialog.addClass('Hidden').find('input:focus').blur();
            try {
                var dialogData = dialog.data();
                dialogData.observer
                    .removeClass('ZWDialogBtnActive')
                    .trigger(dialogData.ui.EVENT.CLOSE);
                dialogData.removeData('observer');
            } catch (err) {}
        } 
    },
    add: function (dialog, _options_) {
        this.options = $.extend(this.options, _options_);
        this.dialogs = this.dialogs.add(dialog);
        dialog.on('click mousedown', function (e) {
            e.stopPropagation();            
        });
    },
    close: function (dialog) {
        var self = this;
        if ( dialog !== undefined ) {
            self._close(dialog);
        }
        else {
            this.dialogs.each(function () {
                self._close($(this));
            });
        }
    },

    //constructor
    init: function () {
        var self = this;
        $('.ZWContextDialog .ZWDialogCloseBtn').on('click', function (e) {
            self.close();
            return false;
        });
        $(document).on('mousedown', function (e) {
            self.close();
        });
    }
}

Zenwork.Exception = {
    MESSAGE: {
        '404': 'This task is not exist anymore. No further actions can be performed'
    },
    _404: function () {
        Zenwork.Window.alert(this.MESSAGE['404']);
        return false;
    }
}

/**
 * Model class
 */
Zenwork.Model = {
    ajax: null,
    CU: 'CU', //create | update action on server
    D: 'D', //delete action on server
    model: {},
    buffer: [],
    liveTimer: [],
    livePipe: [],
    createModel: function (name, filter) {
        if ( this.model[name] !== undefined ) {
            alert('Model '+name+' already exist, please check or use other name!');
            return false;
        }
        this.model[name] = filter;
        return true;
    },
    flush: function (callback) { //tip: always flush data on action trigger, eg. onclick event
        if ( this.buffer.length == 0 ) { return; }
        //console.log(this.buffer);this.clearBuffer();return;
        Zenwork.Notifier.notify('Saving...');
        var self = this;
        this.ajax = $.ajax({
            type: 'POST',
            url: Zenwork.Root+'/app/cud',
            dataType: 'json',
            contentType: 'json',
            data: JSON.stringify(this.buffer),
            success: function (response, textStatus, jqXHR) {
                Zenwork.Notifier.notify('Saved', 2);
                $.each(self.buffer, function (index, buffer) {
                    if ( buffer.callback !== undefined && response[index].data !== undefined ) {
                        buffer.callback(response[index].data);
                    }
                });

                self.clearBuffer();

                if ( callback != undefined ) { callback(response); }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if ( textStatus !== 'abort' ) {
                    alert('Really sorry for this, network error! Please try again!');
                }
            },
            complete: function (jqXHR, textStatus) {}
        });
    },
    cancel: function () {
        if ( this.ajax !== null ) {
            this.ajax.abort();
        }
    },
    addBuffer: function (dataSource, modelName, action, callback) {
        if ( this.model[modelName] === undefined ) {
            //throw: alert('Model '+modelName+' is not exist, please create first');
            alert('Model '+modelName+' is not exist, please create first');
            return false;
        }
        this.buffer.push({
            action: action,
            model: modelName,
            data: this.model[modelName](dataSource),
            callback: callback
        });
        return this.buffer.length - 1;
    },
    updateBuffer: function (index, dataSource, modelName, action) {
        this.buffer[index] = $.extend(this.buffer[index], {
            action: action,
            model: modelName,
            data: this.model[modelName](dataSource)
        });
    },
    clearBuffer: function () {
        this.buffer = [];
    },
    liveUpdate: function (dataSource, modelName, action, clientID) {
        var self = this;
        if ( self.model[modelName] === undefined ) {
            //throw: alert('Model '+modelName+' is not exist, please create first');
            return false;
        }
        if ( self.liveTimer[clientID] !== undefined ) {
            clearTimeout(self.liveTimer[clientID]);
        }
        if ( self.livePipe[clientID] !== undefined ) {
            self.livePipe[clientID].abort();
        }
        var delay = 300; //in ms
        Zenwork.Notifier.notify('Updating...');
        self.liveTimer[clientID] = setTimeout(function () {
            self.livePipe[clientID] = $.ajax({
                type: 'POST',
                url: Zenwork.Root+'/app/cud',
                dataType: 'json',
                contentType: 'json',
                data: JSON.stringify([{
                    action: action,
                    model: modelName,
                    data: self.model[modelName](dataSource)
                }]),
                success: function (data, textStatus, jqXHR) {
                    Zenwork.Notifier.notify('Updated', 1);
                    delete self.liveTimer[clientID];
                    delete self.livePipe[clientID];
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if ( textStatus !== 'abort' ) {
                        alert('Really sorry for this, network error! Please try again!');
                    }
                },
                complete: function (jqXHR, textStatus) {}
            });
        }, delay);
    },
    disable: function () {
        this.disabled = true;
    },
    enable: function () {
        this.disabled = false;
    },
    checkExist: function (model, id, callback) {
        $.ajax({ //check if timeline exist
            type: 'POST',
            url: Zenwork.Root+'/app/check/'+model+'/'+id,
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {
                if ( !data ) {
                    Zenwork.Exception._404();
                }
                if ( callback !== undefined ) { callback(data); }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if ( textStatus !== 'abort' ) {
                    alert('Really sorry for this, network error! Please try again!');
                }
            },
            complete: function (jqXHR, textStatus) {}
        }); 
    }
}
Zenwork.Model.createModel('Stream_log', function (data) {
    return { 'Stream_log': $.extend({}, data) };
});

//override window.alert|confirm|prompt
/*
(function (_) {
    _.alert = function () {
        //log
    }
    _.confirm = function () {
        return true;
    }
    _.prompt = function () {
        //log
    }
})(window);
*/

/**
 * Debug class, use only for development stage only
 */
Zenwork.Debug = {
    timer: null,
    
    //call stack trace
    stack: new function () {
        // Domain Public by Eric Wendelin http://eriwen.com/ (2008)
        //                  Luke Smith http://lucassmith.name/ (2008)
        //                  Loic Dachary <loic@dachary.org> (2008)
        //                  Johan Euphrosine <proppy@aminche.com> (2008)
        //                  Oyvind Sean Kinsey http://kinsey.no/blog (2010)
        //                  Victor Homyakov <victor-homyakov@users.sourceforge.net> (2010)

        /**
         * Main function giving a function stack trace with a forced or passed in Error
         *
         * @cfg {Error} e The error to create a stacktrace from (optional)
         * @cfg {Boolean} guess If we should try to resolve the names of anonymous functions
         * @return {Array} of Strings with functions, lines, files, and arguments where possible
         */
        function printStackTrace(options) {
            options = options || {guess: true};
            var ex = options.e || null, guess = !!options.guess;
            var p = new printStackTrace.implementation(), result = p.run(ex);
            return (guess) ? p.guessAnonymousFunctions(result) : result;
        }

        if (typeof module !== "undefined" && module.exports) {
            module.exports = printStackTrace;
        }

        printStackTrace.implementation = function() {};

        printStackTrace.implementation.prototype = {
            /**
             * @param {Error} ex The error to create a stacktrace from (optional)
             * @param {String} mode Forced mode (optional, mostly for unit tests)
             */
            run: function(ex, mode) {
                ex = ex || this.createException();
                // examine exception properties w/o debugger
                //for (var prop in ex) {alert("Ex['" + prop + "']=" + ex[prop]);}
                mode = mode || this.mode(ex);
                if (mode === 'other') {
                    return this.other(arguments.callee);
                } else {
                    return this[mode](ex);
                }
            },

            createException: function() {
                try {
                    this.undef();
                } catch (e) {
                    return e;
                }
            },

            /**
             * Mode could differ for different exception, e.g.
             * exceptions in Chrome may or may not have arguments or stack.
             *
             * @return {String} mode of operation for the exception
             */
            mode: function(e) {
                if (e['arguments'] && e.stack) {
                    return 'chrome';
                } else if (e.stack && e.sourceURL) {
                    return 'safari';
                } else if (e.stack && e.number) {
                    return 'ie';
                } else if (typeof e.message === 'string' && typeof window !== 'undefined' && window.opera) {
                    // e.message.indexOf("Backtrace:") > -1 -> opera
                    // !e.stacktrace -> opera
                    if (!e.stacktrace) {
                        return 'opera9'; // use e.message
                    }
                    // 'opera#sourceloc' in e -> opera9, opera10a
                    if (e.message.indexOf('\n') > -1 && e.message.split('\n').length > e.stacktrace.split('\n').length) {
                        return 'opera9'; // use e.message
                    }
                    // e.stacktrace && !e.stack -> opera10a
                    if (!e.stack) {
                        return 'opera10a'; // use e.stacktrace
                    }
                    // e.stacktrace && e.stack -> opera10b
                    if (e.stacktrace.indexOf("called from line") < 0) {
                        return 'opera10b'; // use e.stacktrace, format differs from 'opera10a'
                    }
                    // e.stacktrace && e.stack -> opera11
                    return 'opera11'; // use e.stacktrace, format differs from 'opera10a', 'opera10b'
                } else if (e.stack) {
                    return 'firefox';
                }
                return 'other';
            },

            /**
             * Given a context, function name, and callback function, overwrite it so that it calls
             * printStackTrace() first with a callback and then runs the rest of the body.
             *
             * @param {Object} context of execution (e.g. window)
             * @param {String} functionName to instrument
             * @param {Function} function to call with a stack trace on invocation
             */
            instrumentFunction: function(context, functionName, callback) {
                context = context || window;
                var original = context[functionName];
                context[functionName] = function instrumented() {
                    callback.call(this, printStackTrace().slice(4));
                    return context[functionName]._instrumented.apply(this, arguments);
                };
                context[functionName]._instrumented = original;
            },

            /**
             * Given a context and function name of a function that has been
             * instrumented, revert the function to it's original (non-instrumented)
             * state.
             *
             * @param {Object} context of execution (e.g. window)
             * @param {String} functionName to de-instrument
             */
            deinstrumentFunction: function(context, functionName) {
                if (context[functionName].constructor === Function &&
                        context[functionName]._instrumented &&
                        context[functionName]._instrumented.constructor === Function) {
                    context[functionName] = context[functionName]._instrumented;
                }
            },

            /**
             * Given an Error object, return a formatted Array based on Chrome's stack string.
             *
             * @param e - Error object to inspect
             * @return Array<String> of function calls, files and line numbers
             */
            chrome: function(e) {
                var stack = (e.stack + '\n').replace(/^\S[^\(]+?[\n$]/gm, '').
                  replace(/^\s+(at eval )?at\s+/gm, '').
                  replace(/^([^\(]+?)([\n$])/gm, '{anonymous}()@$1$2').
                  replace(/^Object.<anonymous>\s*\(([^\)]+)\)/gm, '{anonymous}()@$1').split('\n');
                stack.pop();
                return stack;
            },

            /**
             * Given an Error object, return a formatted Array based on Safari's stack string.
             *
             * @param e - Error object to inspect
             * @return Array<String> of function calls, files and line numbers
             */
            safari: function(e) {
                return e.stack.replace(/\[native code\]\n/m, '')
                    .replace(/^(?=\w+Error\:).*$\n/m, '')
                    .replace(/^@/gm, '{anonymous}()@')
                    .split('\n');
            },

            /**
             * Given an Error object, return a formatted Array based on IE's stack string.
             *
             * @param e - Error object to inspect
             * @return Array<String> of function calls, files and line numbers
             */
            ie: function(e) {
                var lineRE = /^.*at (\w+) \(([^\)]+)\)$/gm;
                return e.stack.replace(/at Anonymous function /gm, '{anonymous}()@')
                    .replace(/^(?=\w+Error\:).*$\n/m, '')
                    .replace(lineRE, '$1@$2')
                    .split('\n');
            },

            /**
             * Given an Error object, return a formatted Array based on Firefox's stack string.
             *
             * @param e - Error object to inspect
             * @return Array<String> of function calls, files and line numbers
             */
            firefox: function(e) {
                return e.stack.replace(/(?:\n@:0)?\s+$/m, '').replace(/^[\(@]/gm, '{anonymous}()@').split('\n');
            },

            opera11: function(e) {
                var ANON = '{anonymous}', lineRE = /^.*line (\d+), column (\d+)(?: in (.+))? in (\S+):$/;
                var lines = e.stacktrace.split('\n'), result = [];

                for (var i = 0, len = lines.length; i < len; i += 2) {
                    var match = lineRE.exec(lines[i]);
                    if (match) {
                        var location = match[4] + ':' + match[1] + ':' + match[2];
                        var fnName = match[3] || "global code";
                        fnName = fnName.replace(/<anonymous function: (\S+)>/, "$1").replace(/<anonymous function>/, ANON);
                        result.push(fnName + '@' + location + ' -- ' + lines[i + 1].replace(/^\s+/, ''));
                    }
                }

                return result;
            },

            opera10b: function(e) {
                // "<anonymous function: run>([arguments not available])@file://localhost/G:/js/stacktrace.js:27\n" +
                // "printStackTrace([arguments not available])@file://localhost/G:/js/stacktrace.js:18\n" +
                // "@file://localhost/G:/js/test/functional/testcase1.html:15"
                var lineRE = /^(.*)@(.+):(\d+)$/;
                var lines = e.stacktrace.split('\n'), result = [];

                for (var i = 0, len = lines.length; i < len; i++) {
                    var match = lineRE.exec(lines[i]);
                    if (match) {
                        var fnName = match[1]? (match[1] + '()') : "global code";
                        result.push(fnName + '@' + match[2] + ':' + match[3]);
                    }
                }

                return result;
            },

            /**
             * Given an Error object, return a formatted Array based on Opera 10's stacktrace string.
             *
             * @param e - Error object to inspect
             * @return Array<String> of function calls, files and line numbers
             */
            opera10a: function(e) {
                // "  Line 27 of linked script file://localhost/G:/js/stacktrace.js\n"
                // "  Line 11 of inline#1 script in file://localhost/G:/js/test/functional/testcase1.html: In function foo\n"
                var ANON = '{anonymous}', lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
                var lines = e.stacktrace.split('\n'), result = [];

                for (var i = 0, len = lines.length; i < len; i += 2) {
                    var match = lineRE.exec(lines[i]);
                    if (match) {
                        var fnName = match[3] || ANON;
                        result.push(fnName + '()@' + match[2] + ':' + match[1] + ' -- ' + lines[i + 1].replace(/^\s+/, ''));
                    }
                }

                return result;
            },

            // Opera 7.x-9.2x only!
            opera9: function(e) {
                // "  Line 43 of linked script file://localhost/G:/js/stacktrace.js\n"
                // "  Line 7 of inline#1 script in file://localhost/G:/js/test/functional/testcase1.html\n"
                var ANON = '{anonymous}', lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
                var lines = e.message.split('\n'), result = [];

                for (var i = 2, len = lines.length; i < len; i += 2) {
                    var match = lineRE.exec(lines[i]);
                    if (match) {
                        result.push(ANON + '()@' + match[2] + ':' + match[1] + ' -- ' + lines[i + 1].replace(/^\s+/, ''));
                    }
                }

                return result;
            },

            // Safari 5-, IE 9-, and others
            other: function(curr) {
                var ANON = '{anonymous}', fnRE = /function\s*([\w\-$]+)?\s*\(/i, stack = [], fn, args, maxStackSize = 10;
                while (curr && curr['arguments'] && stack.length < maxStackSize) {
                    fn = fnRE.test(curr.toString()) ? RegExp.$1 || ANON : ANON;
                    args = Array.prototype.slice.call(curr['arguments'] || []);
                    stack[stack.length] = fn + '(' + this.stringifyArguments(args) + ')';
                    curr = curr.caller;
                }
                return stack;
            },

            /**
             * Given arguments array as a String, subsituting type names for non-string types.
             *
             * @param {Arguments} args
             * @return {Array} of Strings with stringified arguments
             */
            stringifyArguments: function(args) {
                var result = [];
                var slice = Array.prototype.slice;
                for (var i = 0; i < args.length; ++i) {
                    var arg = args[i];
                    if (arg === undefined) {
                        result[i] = 'undefined';
                    } else if (arg === null) {
                        result[i] = 'null';
                    } else if (arg.constructor) {
                        if (arg.constructor === Array) {
                            if (arg.length < 3) {
                                result[i] = '[' + this.stringifyArguments(arg) + ']';
                            } else {
                                result[i] = '[' + this.stringifyArguments(slice.call(arg, 0, 1)) + '...' + this.stringifyArguments(slice.call(arg, -1)) + ']';
                            }
                        } else if (arg.constructor === Object) {
                            result[i] = '#object';
                        } else if (arg.constructor === Function) {
                            result[i] = '#function';
                        } else if (arg.constructor === String) {
                            result[i] = '"' + arg + '"';
                        } else if (arg.constructor === Number) {
                            result[i] = arg;
                        }
                    }
                }
                return result.join(',');
            },

            sourceCache: {},

            /**
             * @return the text from a given URL
             */
            ajax: function(url) {
                var req = this.createXMLHTTPObject();
                if (req) {
                    try {
                        req.open('GET', url, false);
                        //req.overrideMimeType('text/plain');
                        //req.overrideMimeType('text/javascript');
                        req.send(null);
                        //return req.status == 200 ? req.responseText : '';
                        return req.responseText;
                    } catch (e) {
                    }
                }
                return '';
            },

            /**
             * Try XHR methods in order and store XHR factory.
             *
             * @return <Function> XHR function or equivalent
             */
            createXMLHTTPObject: function() {
                var xmlhttp, XMLHttpFactories = [
                    function() {
                        return new XMLHttpRequest();
                    }, function() {
                        return new ActiveXObject('Msxml2.XMLHTTP');
                    }, function() {
                        return new ActiveXObject('Msxml3.XMLHTTP');
                    }, function() {
                        return new ActiveXObject('Microsoft.XMLHTTP');
                    }
                ];
                for (var i = 0; i < XMLHttpFactories.length; i++) {
                    try {
                        xmlhttp = XMLHttpFactories[i]();
                        // Use memoization to cache the factory
                        this.createXMLHTTPObject = XMLHttpFactories[i];
                        return xmlhttp;
                    } catch (e) {
                    }
                }
            },

            /**
             * Given a URL, check if it is in the same domain (so we can get the source
             * via Ajax).
             *
             * @param url <String> source url
             * @return False if we need a cross-domain request
             */
            isSameDomain: function(url) {
                return typeof location !== "undefined" && url.indexOf(location.hostname) !== -1; // location may not be defined, e.g. when running from nodejs.
            },

            /**
             * Get source code from given URL if in the same domain.
             *
             * @param url <String> JS source URL
             * @return <Array> Array of source code lines
             */
            getSource: function(url) {
                // TODO reuse source from script tags?
                if (!(url in this.sourceCache)) {
                    this.sourceCache[url] = this.ajax(url).split('\n');
                }
                return this.sourceCache[url];
            },

            guessAnonymousFunctions: function(stack) {
                for (var i = 0; i < stack.length; ++i) {
                    var reStack = /\{anonymous\}\(.*\)@(.*)/,
                        reRef = /^(.*?)(?::(\d+))(?::(\d+))?(?: -- .+)?$/,
                        frame = stack[i], ref = reStack.exec(frame);

                    if (ref) {
                        var m = reRef.exec(ref[1]);
                        if (m) { // If falsey, we did not get any file/line information
                            var file = m[1], lineno = m[2], charno = m[3] || 0;
                            if (file && this.isSameDomain(file) && lineno) {
                                var functionName = this.guessAnonymousFunction(file, lineno, charno);
                                stack[i] = frame.replace('{anonymous}', functionName);
                            }
                        }
                    }
                }
                return stack;
            },

            guessAnonymousFunction: function(url, lineNo, charNo) {
                var ret;
                try {
                    ret = this.findFunctionName(this.getSource(url), lineNo);
                } catch (e) {
                    ret = 'getSource failed with url: ' + url + ', exception: ' + e.toString();
                }
                return ret;
            },

            findFunctionName: function(source, lineNo) {
                // FIXME findFunctionName fails for compressed source
                // (more than one function on the same line)
                // function {name}({args}) m[1]=name m[2]=args
                var reFunctionDeclaration = /function\s+([^(]*?)\s*\(([^)]*)\)/;
                // {name} = function ({args}) TODO args capture
                // /['"]?([0-9A-Za-z_]+)['"]?\s*[:=]\s*function(?:[^(]*)/
                var reFunctionExpression = /['"]?([$_A-Za-z][$_A-Za-z0-9]*)['"]?\s*[:=]\s*function\b/;
                // {name} = eval()
                var reFunctionEvaluation = /['"]?([$_A-Za-z][$_A-Za-z0-9]*)['"]?\s*[:=]\s*(?:eval|new Function)\b/;
                // Walk backwards in the source lines until we find
                // the line which matches one of the patterns above
                var code = "", line, maxLines = Math.min(lineNo, 20), m, commentPos;
                for (var i = 0; i < maxLines; ++i) {
                    // lineNo is 1-based, source[] is 0-based
                    line = source[lineNo - i - 1];
                    commentPos = line.indexOf('//');
                    if (commentPos >= 0) {
                        line = line.substr(0, commentPos);
                    }
                    // TODO check other types of comments? Commented code may lead to false positive
                    if (line) {
                        code = line + code;
                        m = reFunctionExpression.exec(code);
                        if (m && m[1]) {
                            return m[1];
                        }
                        m = reFunctionDeclaration.exec(code);
                        if (m && m[1]) {
                            //return m[1] + "(" + (m[2] || "") + ")";
                            return m[1];
                        }
                        m = reFunctionEvaluation.exec(code);
                        if (m && m[1]) {
                            return m[1];
                        }
                    }
                }
                return '(?)';
            }
        };
    
    
        return {
            trace: function () {
                console.log(printStackTrace({}));
            }
        }
    },

    startStopwtach: function () {
        this.timer = new Date();
    },
    
    //track time
    endStopwtach: function () {
        Zenwork.Notifier.notify('Loaded in '+((new Date() - this.timer)/1000)+'s', 2);
    }
}
