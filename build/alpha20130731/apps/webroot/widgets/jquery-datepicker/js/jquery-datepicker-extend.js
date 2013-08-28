$.datepicker._base_updateDatepicker = $.datepicker._updateDatepicker;
$.datepicker._updateDatepicker = function(inst) {
    $.datepicker._base_updateDatepicker(inst);

    /* add callback after datepicker is updated by 'gaumup' */
    var afterUpdateCallback = $.datepicker._get(inst, 'afterUpdate');
    if ( afterUpdateCallback != undefined ) { afterUpdateCallback(inst.input, $.datepicker); }
    /* end. */
}
