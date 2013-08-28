var ROOT_URL;
jQuery(document).ready(function () {
    window.focus();
    ROOT_URL = jQuery("#root_url").val();

    if ( jQuery("#helper_container").length > 0 ) {
        jQuery("#helper_container").appendTo("body");
    }

    //Tab in 'ProjectHomepage'
    if ( jQuery("ul.ProjectTab").length > 0 ) {
        jQuery("ul.ProjectTab > li > a").bind("click", function (e) {
            jQuery(".ProjectTabContent").addClass("Hidden");
            jQuery(this).parent().parent().find("> li.ActiveTab").removeClass("ActiveTab");
            jQuery(this).parent().addClass("ActiveTab");
            jQuery(jQuery(this).attr("href")).removeClass("Hidden");

            handle_extra_work(jQuery(this).attr("href"));
        });
        if ( jQuery(".MiniEditor").length == 0 ) {
            setTimeout(function () { active_tab_by_hash(); }, 1);
        }
    }

    //Project report
    jQuery('a.DelReportLnk').live('click', function (e) {
        var is_confirm = confirm("This action can not be undone ! Are you sure ?");
        if ( !is_confirm ) { return false; }
        var report_item = jQuery(this).parent();
        report_item.addClass("AjaxLoading");
        jQuery.ajax({
            type: 'post',
            url: jQuery(this).attr('href'),
            success: function (data, textStatus, jqXHR) {
                if ( data == 1 ) {
                    report_item.fadeOut("medium", function () {
                        report_item.remove();
                    })
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                report_item.removeClass("AjaxLoading");
            }
        });
        return false;
    });

	if (jQuery(".Calendar").length > 0) {
        jQuery(".Calendar").datepicker({
            changeMonth: true,
            changeYear: true,
            showOn: "both",
            showAnim: "fadeIn",
            buttonText: "Pick a date",
            buttonImage: ROOT_URL+"/widgets/jquery-datepicker/images/calendar.gif",
            buttonImageOnly: true,
            dateFormat: "dd/mm/yy",
            beforeShowDay: no_weekend_or_holidays,
            onSelect: function (date_text, inst) {
                if ( jQuery(this).attr("id") == "start_date" ) {
                    jQuery("#end_date").datepicker("option", {
                        minDate: date_text
                    })
                }
            }
        });
	}

    //Create | Edit Project
    //validate form: create new project
	if ( jQuery("#create_project_submit").length > 0 ) {
        jQuery("#create_project_submit").bind("click", function (e) {
            var is_valid = false;
            validate_empty_fields("#partner_list, #product_list, #categories_list, #name, #start_date, #end_date", {
                success: function () {
                    jQuery("#start_date_val").val( new Date(jQuery("#start_date").datepicker("getDate")).setHours(8)/1000 );
                    jQuery("#end_date_val").val( new Date(jQuery("#end_date").datepicker("getDate")).setHours(17)/1000 );
                    jQuery("#WOMem option").each(function(){
                        jQuery(this)[0].selected = true;
                    });
                    jQuery("#teamMem option").each(function(){
                        jQuery(this)[0].selected = true;
                    });
                    is_valid = true;
                },
                failed: function (/*Array: #id*/error_fields, /*Array: #id*/validated_fields) {
                    handle_fields_status(/*Array: #id*/error_fields, /*Array: #id*/validated_fields);
                }
            });
            return is_valid;
        });
    }
    //add|remove member to|from project
	if ( jQuery("select.SelectMember").length > 0 ) {
		var countMen = 0;
        jQuery("select.SelectMember").each(function () {
            var self = jQuery(this);
            jQuery("select.SelectMember").change(function(){
                if(self.val() != 0){
                    var username = self.find("> option[value='"+self.val()+"']").html();
                    var userRole = jQuery(".ProjectRole").eq(0).clone().removeClass("ProjectRole").attr({
                        name: 'data[mem_role][]'
                    }).removeClass("Hidden");
                    countMen = jQuery("#projectMem > tbody > tr").length +1;
                    var _html = jQuery('<tr><td class="Center">'+countMen+'<input class="UserId" type="hidden" name="data[mem_id][]" value="'+self.val()+'" /></td><td class="UserName">'+username+'</td><td class="Position"></td><td><a href="#" title="Remove" class="RemoveIcon ActionBtn">Remove</a></td></tr>');
                    _html.find(".Position").append(userRole);
                    jQuery("#projectMem > tbody").append(_html);
                    self.find(" > option[value='"+self.val()+"']").remove();
                    countMen++;
                }
            });
            jQuery(".RemoveIcon").live('click',function(){
                var removeUserId = jQuery(this).parent().parent().find("input.UserId").val();
                var removeUserName = jQuery(this).parent().parent().find(".UserName").html();
                var removeOption = jQuery('<option value="'+removeUserId+'">'+removeUserName+'</option>');
                self.append(removeOption);
                jQuery(this).parent().parent().remove();
                return false;
            });
        });
	}
    //add new client to project (non-WO members)
    if ( jQuery("#add_new_client").length > 0 ) {
        jQuery("#add_new_client").bind("click", function () {
            OverlaysManager.get_overlays().addClass("AppOverlays").addClass("NoLoading");
            OverlaysManager.show_overlays();
            jQuery("#new_client_dialog").addClass('CommonDialogTop').show();
            return false;
        });
    }
    //validate form: create new client
	if ( jQuery("#confirm_add_client").length > 0 ) {
        jQuery("#confirm_add_client").bind("click", function (e) {
            validate_empty_fields("#client_name, #client_fullname, #client_id, #client_gender", {
                success: function () {
                    //check whether match a-z, A-Z, 0-9, allow spacing at end => for easy input, ignore user missed input
                    var reg = new RegExp("^[a-zA-Z][a-zA-Z0-9]*\\s*$", "g");
                    if ( !reg.test(jQuery("#client_name").val()) ) {
                        handle_fields_status(/*Array: #id*/["#client_name"], /*Array: #id*/[]);
                        jQuery("#username_constraint").removeClass("MsgInput").addClass("ErrorInput");
                    }
                    else {
                        jQuery("#username_constraint").addClass("MsgInput").removeClass("ErrorInput");
                        jQuery("#dialog_form_loading").removeClass("Hidden");
                        var post_data = {};
                        jQuery("input[name='data[\'Client\']'], select[name='data[\'Client\']']").map(function (index, item) {
                            post_data[jQuery(item).attr("id")] = item.value;
                        });
                        jQuery.ajax({
                            type: "POST",
                            url: ROOT_URL+"/projects/add_new_client"+(jQuery("#project_id").length > 0 ? "/"+jQuery("#project_id").val() : ""),
                            dataType: "text",
                            data: post_data,
                            success: function (data, textStatus, jqXHR) {
                                jQuery("#dialog_form_loading").addClass("Hidden");
                                if ( data > 0 ) {
                                    //add new client to <select>
                                    jQuery("select#project_member").append('<option value="'+data+'">'+jQuery("#client_name").val().trim()+'</option>');
                                    //clear form and close box
                                    clear_add_client_form();
                                    //success message
                                    jQuery("#add_client_msg").css({
                                        opacity: 0
                                    }).removeClass("Hidden").fadeTo("normal", 1);
                                    setTimeout(function () {
                                        jQuery("#add_client_msg").fadeTo("normal", 0);
                                    }, 2000);
                                }
                                else {
                                    if ( data == 0 ) {
                                        alert("Do not have permission !");
                                    }
                                    else if ( data == -1 ) {
                                        jQuery("#client_name_error").removeClass("Hidden").text("Account domain already exist !");
                                    }
                                }
                            },
                            error: function (jqXHR, textStatus, errorThrown) {}
                        });
                    }
                },
                failed: function (/*Array: #id*/error_fields, /*Array: #id*/validated_fields) {
                    handle_fields_status(/*Array: #id*/error_fields, /*Array: #id*/validated_fields);
                }
            });
            return false;
        });
    }
    jQuery(".CancelBtn").bind("click", function () {
        //clear form
        clear_add_client_form();
        //close is done in 'dialog.js'
    });

    //hide all project on first time arrived, toggle when click: 'Project Management System' index page
    jQuery(".ToggleLnk").bind("click", function (e) {
        jQuery(this).toggleClass("Expanded");
        jQuery(jQuery(this).attr("href")).toggleClass("Hidden");
        return false;
    });
    if ( (/\/direction:[asc|desc]|\/page:\d/).test(window.location) ) { //detect sort in cakephp: project's index page
        jQuery(".ToggleLnk").trigger("click");
    }

    //start project appraisal in 'Project Homepage'
    jQuery("a.StartPPA").bind("click", function (e) {
        var is_confirm = false;
        var msg = "Confirm start Project Appraisals !\n"+
                          "\n+ Time for All members(excluded PM) do appraisals is 4 days (included non-working days) count from now !\n"+
                          "\n+ Time for PM do appraisals is 7 days (included non-working days) count from now !\n"+
                          "\n+ Time for All members review & accept appraisals is 3 days (included non-working days) after !\n";
        is_confirm = confirm(msg);
        return is_confirm;
    });

	//map_partners
	map_partners("partner_list","product_list","map_selector");
});

function active_tab_by_hash () {
    if ( window.location.hash != '' ) {
        jQuery("ul.ProjectTab > li > a[href="+window.location.hash+"]").trigger("click");
    }
    else {
        jQuery("ul.ProjectTab > li > a:first").trigger("click");
    }
}
var tinyMCE_editor_loaded = 0;
function tinyMCE_init_callback (ed) {
    tinyMCE_editor_loaded++;
    if ( tinyMCE_editor_loaded == jQuery(".MiniEditor").length ) {
        active_tab_by_hash();
    }
}
function tinyMCE_before_init (ed) {}
function handle_extra_work (/*String*/tab_id) {
    switch (tab_id) {
        case '#organization':
            var total_width = 0;
            jQuery("ul.VertOrgTree > li").each(function () {
                total_width += jQuery(this).outerWidth(true); //including margin, border, padding
            });
            jQuery("ul.VertOrgTree").css({
                width: total_width
            });
            if ( jQuery("ul.VertOrgTree > li").length == 1 ) {
                jQuery("ul.VertOrgTree > li").eq(0).removeClass("FirstGroup").removeClass("LastGroup");
            }
            break;
        default:
            break;
    }
}
function clear_add_client_form () {
    //clear form | state
    jQuery("input[name='data[\'Client\']'], select[name='data[\'Client\']']").val("");
    jQuery("#client_name_error").addClass("Hidden").text("");
    jQuery("#dialog_form_loading").addClass("Hidden");
    jQuery("#new_client_dialog").find("label.LabelError").removeClass("LabelError");
    jQuery("#new_client_dialog").find(".FieldError").removeClass("FieldError");
    jQuery("#username_constraint").addClass("MsgInput").removeClass("ErrorInput");
    //hide box
    jQuery("#new_client_dialog").hide();
    OverlaysManager.hide_overlays();
    OverlaysManager.get_overlays().removeClass("NoLoading")
}
function map_partners(partner_selector_id, product_selector_id, map_selector_id){
	partner_selector_id = partner_selector_id != undefined ? partner_selector_id : "";
	product_selector_id = product_selector_id != undefined ? product_selector_id : "";
	map_selector_id = map_selector_id != undefined ? map_selector_id : "";
	if((partner_selector_id != "" && jQuery("#"+partner_selector_id).length > 0) && (product_selector_id != "" && jQuery("#"+product_selector_id).length > 0) && (map_selector_id != "" && jQuery("#"+map_selector_id).length > 0)) {
		jQuery("#"+product_selector_id).bind("change", function(){
			var cur_product = jQuery(this).val();
			var cur_map_selector = jQuery("#" + map_selector_id).find(" > option[value='"+cur_product+"']").html();
			jQuery("#"+partner_selector_id).find(" > option[value='"+cur_map_selector+"']").attr("selected","selected")
		});
	}else {
		return false;
	}
}

/* String */
String.prototype.trim = function () {
    return this.replace(/^\s*/, "").replace(/\s*$/, "");
}