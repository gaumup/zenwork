//validation form
function validate_empty_fields (/*String: contains fields' id*/fields_id, /*Object*/opt) {
    clear();
    var is_validated = true;
    var error_list = [];
    var validated_list = [];
    var ids = fields_id.replace(/\s/g, "").toString().split(",");
    for ( var i = 0 ; i < ids.length ; i++ ) {
        if ( jQuery(ids[i]).val() == "" || jQuery(ids[i]).val() == null ) {
            is_validated = false;
            error_list.push(ids[i]);
        }
        else { validated_list.push(ids[i]); }
    }
    if ( is_validated ) { opt.success(); }
    else {
        opt.failed(error_list, validated_list);
    }
}
function handle_fields_status (/*Array: #id*/error_fields, /*Array: #id*/validated_fields) {
    for ( var i =  0 ; i < error_fields.length ; i++ ) {
        jQuery(error_fields[i]).addClass("FieldError");
        jQuery(error_fields[i]).prev().addClass("LabelError");
    }
    for ( var i =  0 ; i < validated_fields.length ; i++ ) {
        jQuery(validated_fields[i]).removeClass("FieldError");
        jQuery(validated_fields[i]).prev().removeClass("LabelError");
    }
}
function clear () {
    jQuery(".LabelError").removeClass("LabelError");
    jQuery(".FieldError").removeClass("FieldError");
}