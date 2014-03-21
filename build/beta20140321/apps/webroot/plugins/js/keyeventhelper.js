KeyEventHelper = new function () { //Singleton
    var is_ctrl_hold = false;
    var is_alt_hold = false;
    var is_shift_hold = false;

    jQuery(document).bind("keydown", function (e) {
        switch ( e.which ) {
            case 17: //Ctrl
                is_ctrl_hold = true;
                break;
            case 18: //Alt
                is_alt_hold = true;
                break;
            case 16: //Shift
                is_shift_hold = true;
                break;
        }
    });
    jQuery(document).bind("keyup", function (e) {
        switch ( e.which ) {
            case 17: //Ctrl
                is_ctrl_hold = false;
                break;
            case 18: //Alt
                is_alt_hold = false;
                break;
            case 16: //Shift
                is_shift_hold = false;
                break;
        }
    });

    this.isCtrlHold = function () { return is_ctrl_hold; }
    this.isAltHold = function () { return is_alt_hold; }
    this.isShiftHold = function () { return is_shift_hold; }
}