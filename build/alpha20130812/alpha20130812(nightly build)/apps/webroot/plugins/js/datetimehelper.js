//datepicker helper
function no_weekend_or_holidays (date) {
    var tmp_arr = [];
    tmp_arr[0] =  !date.isHoliday();
    tmp_arr[1] = "";
    tmp_arr[2] = date.isHoliday() ? "Non working day !" : "";
    return tmp_arr;
}
function get_week_range (/*Date*/date) {
    var day_in_millisecond = 3600*1000*24;
    var day_num = date.getDay();
    var start_date_milli = date.valueOf() - (day_num - (day_num == 0 ? -6 : 1) )*day_in_millisecond;
    var end_date_milli = date.valueOf() + (6 - (day_num == 0 ? 6 : (day_num-1) ) )*day_in_millisecond;
    return {
        start: new Date(start_date_milli),
        end: new Date(end_date_milli)
    }
}
function get_month_range (/*Date*/date) {
    var day_in_millisecond = 3600*1000*24;
    var current_month = date.getMonth(); //0-11
    var last_day = date;
    var day_num = date.getDate(); //return day in month 1-31
    while ( last_day.getMonth() == current_month ) {
        last_day = new Date(last_day.valueOf() + day_in_millisecond);
    }
    /* when false in 'while', last_day is on the 1st day of the next month
     * == at 0:00 of the last day of that month
     */
    var start_date_milli = date.valueOf() - (day_num-1)*day_in_millisecond;
    return {
        start: new Date(start_date_milli),
        end: last_day
    }
}
function get_day_offset (/*String: dd/mm/yyyy*/fromdate, offset) {
    var date = fromdate.split("/");
    var day = date[0];
    var month = date[1];
    var year = date[2];
    var date_obj = new Date(new Date(month+"/"+day+"/"+year).valueOf()+offset*3600*24*1000);
    return date_obj;
}
function get_day_from_ddmmyyy (/*String: dd/mm/yyyy*/input_date, /*String: Optional, default is splash '/'*/delimiter) {
    delimiter = delimiter != undefined ? delimiter : "/";
    var date = input_date.split(delimiter);
    var day = date[0];
    var month = date[1];
    var year = date[2];
    return new Date(month+"/"+day+"/"+year);
}
function get_weekends_in_month (/*Date*/date) {
    var day_in_millisecond = 3600*1000*24;
    var current_month = date.getMonth(); //0-11
    var weekends = 0;
    while ( date.getMonth() == current_month ) { //still in current month
        if ( date.isHoliday() ) { weekends++; }
        date = new Date(date.valueOf()+day_in_millisecond);
    }
    return weekends;
}
function get_holidays_in_range (/*Date*/date_01, /*Date*/date_02) {
    var day_in_millisecond = 3600*1000*24;
    var weekends = 0;
    while ( date_01.isLessThan(date_02) ) {
        if ( date_01.isHoliday() ) { weekends++; }
        date_01 = new Date(date_01.valueOf()+day_in_millisecond);
    }
    if ( date_02.isHoliday() ) { weekends++; }
    return weekends;
}
function get_days_in_range (/*Date*/date_01, /*Date*/date_02) {
    return Math.abs(date_02.valueOf() - date_01.valueOf())/(3600*1000*24) + 1;
}

//extends class Date
var HOLIDAYS = []
var EXCEPTION_HOLIDAYS = []
Date.prototype.isHoliday = function () {
    var is_holiday = this.getDay() == 0 || this.getDay() == 6; //is weekend
    //holidays
    for ( var i in HOLIDAYS ) {
        var holiday = new Date(HOLIDAYS[i]);
        if ( this.getDate() == holiday.getDate()
            && this.getMonth() == holiday.getMonth()
            && this.getFullYear() == holiday.getFullYear()
        ) {
            is_holiday = true;
            break;
        }
    }
    //exception holidays
    for ( var i in EXCEPTION_HOLIDAYS ) {
        var holiday = new Date(EXCEPTION_HOLIDAYS[i]);
        if ( this.getDate() == holiday.getDate()
            && this.getMonth() == holiday.getMonth()
            && this.getFullYear() == holiday.getFullYear()
        ) {
            is_holiday = false;
            break;
        }
    }
    return is_holiday;
}
Date.prototype.isToday = function () {
    var current_day = new Date( Number( jQuery("#server_time").val() ) );
    return ( this.getDate() == current_day.getDate() )
                && ( this.getMonth() == current_day.getMonth() )
                && ( this.getFullYear() == current_day.getFullYear() );
}
Date.prototype.getDayName = function () {
    switch ( this.getDay() ) {
        case 0:
            return "Sunday";
        case 1:
            return "Monday";
        case 2:
            return "Tuesday";
        case 3:
            return "Wednesday";
        case 4:
            return "Thursday";
        case 5:
            return "Friday";
        case 6:
            return "Saturday";
    }
}
Date.prototype.isLessThan = function (date) {
    //return true if this < date
    return this.valueOf() < date.valueOf();
}
Date.prototype.isLessThanOrEqual = function (date) {
    //return true if this <= date
    return this.valueOf() <= date.valueOf();
}
Date.prototype.isEqual = function (date) {
    //return true if this == date
    return this.valueOf() == date.valueOf();
}
Date.prototype.to_ddmmyyyy = function () {
    return (this.getDate() < 10 ? "0":"") + this.getDate() + "/"
                + (this.getMonth() < 9 ? "0":"") + (this.getMonth()+1) + "/"
                + this.getFullYear();
}
Date.prototype.to_hhmm_ddmmyyyy = function () {
    return (this.getHours() < 10 ? "0":"") + this.getHours() + ":"
                + (this.getMinutes() < 10 ? "0":"") + this.getMinutes() + " "
                + this.getDayName() + ", "
                + (this.getDate() < 10 ? "0":"") + this.getDate() + "/"
                + (this.getMonth() < 10 ? "0":"") + (this.getMonth()+1) + "/" + this.getFullYear();
}