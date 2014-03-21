/* jQuery calendar by gaumup(ukhome@gmail.com) */
/**
 * @use:
 *  - create a calendar grid which can be scaled by day/week/month/year
 * @depends:
 *	- jQuery core
 *	- jQuery widget
 *	- mousewheel
 *	- Core
 * @change log:
 *  - v1.0: initial
 */

//make sure DOM are ready
(function($) {
	$.widget('ui.calendar', {
        widgetFullName: 'calendar',
        widgetEventPrefix: 'calendar',

        //private member
            EVENT: {
                SCROLLX: 'scrollX',
                SCROLLY: 'scrollY'
            },
            PREFIX: {
                DAY_BLOCK: 'db',
                MONTH_BLOCK: 'mb'
            },
            TIME_LENGTH: { //in milliseconds
                DAY: 86400000
            },
            selectedCol: $('<div></div>'),
            selectedColBoxModel: {},
            todayCol: null,
            containerOffset: {},

        //options
            options: {
                TEXT: {
                    MONTH: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    DAY: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
                },
                outer: jQuery('#ganttApp'),
                container: $('#gantTimelineContainer'),
                monthRow: $('#ganttCalendarMonthRow'),
                dayRow: $('#ganttCalendarDayRow'),
                fakeScroll: $('#ganttCalendarFakeScroll'),
                clip: $('#gantTimelineClip'),
                content: $('#ganttTimelineList'),
                unitSize: 20,
                cssClass: {
                    calendarGrid: 'GanttCalendarGrid',
                    calendarLimitLine: 'CalendarLimitLine',
                    dayBlock: 'GanttCalendarDayBlock',
                    monthBlock: 'GanttCalendarMonthBlock',
                    todayBlock: 'GanttCalendarTodayBlock',
                    todayCol: 'GanttCalendarTodayCol',
                    holidayBlock: 'GanttCalendarHolidayBlock',
                    holidayCol: 'GanttCalendarHolidayCol',
                    selectingBlock: 'ui-selecting', //depends on jquery selectable
                    selectedBlock: 'ui-selected', //depends on jquery selectable
                    selectedCol: 'GanttCalendarSelectedCol'
                },
                workingHours: {
                    morning: [8, 12],
                    evening: [13, 17]
                },
                timeBefore: 0,
                timeAfter: 0
            },

        //constructor
            _create: function () {
                var self = this;
                var opts = this.options;
                var element = this.element;

                //create calendar DOM
                this._createCalendar();
                var _containerOffset = opts.container.offset();
                this.containerOffset.left = Math.round(_containerOffset.left);
                this.containerOffset.top = Math.round(_containerOffset.top);

                this.limitBefore = $('#calendarLimitLineLeft');
                if ( this.limitBefore.length == 0 ) {
                    this.limitBefore = $('<div class="'+opts.cssClass.calendarLimitLine+'" id="calendarLimitLineLeft"></div>');
                }
                opts.container.append(this.limitBefore);
                this.limitBefore.css({
                    left: opts.unitSize*2*opts.timeBefore,
                    height: opts.container.outerHeight()
                });

                this.limitAfter = $('#calendarLimitLineRight');
                if ( this.limitAfter.length == 0 ) {
                    this.limitAfter = $('<div class="'+opts.cssClass.calendarLimitLine+'" id="calendarLimitLineRight"></div>');
                }
                opts.container.append(this.limitAfter);
                this.limitAfter.css({
                    left: element.outerWidth() - opts.unitSize*2*opts.timeAfter,
                    height: opts.container.outerHeight()
                });

                //create today highlight column
                var todayBlock = $('.'+opts.cssClass.todayBlock).eq(0);
                if ( todayBlock.length > 0 ) {
                    this.todayCol = $('<div class="'+opts.cssClass.todayCol+'"></div>');
                    //must add class & append before getting box-model
                    opts.clip.append(this.todayCol);
                    var todayColBoxModel = $.getBoxModel(this.todayCol);
                    this.todayCol.css({
                        left: todayBlock.position().left
                            - todayColBoxModel.borderLeft,
                        width: todayBlock.width()
                            - todayColBoxModel.borderLeft
                            - todayColBoxModel.borderRight
                            - todayColBoxModel.paddingLeft
                            - todayColBoxModel.paddingRight
                    });
                }

                //create holiday highlight column
                var holidayBlocks = $('.'+opts.cssClass.holidayBlock);
                if ( holidayBlocks.length > 0 ) {
                    var holidayCol = $('<div></div>').addClass(opts.cssClass.holidayCol);
                    var holidayColBoxModel = null;
                    holidayBlocks.each(function () {
                        var holidayBlock = $(this);
                        //must add class & append before getting box-model
                        var $holidayCol = holidayCol.clone();
                        opts.clip.append($holidayCol);
                        if ( holidayColBoxModel == null ) { holidayColBoxModel = $.getBoxModel($holidayCol); }
                        $holidayCol.css({
                            left: holidayBlock.position().left
                                - holidayColBoxModel.borderLeft,
                            width: holidayBlock.width()
                                - holidayColBoxModel.borderLeft
                                - holidayColBoxModel.borderRight
                                - holidayColBoxModel.paddingLeft
                                - holidayColBoxModel.paddingRight
                        });
                    });
                }

                //extend fn
                opts.dayRow.extend({
                    getFirstDay: function () {
                        return this.find('th:first');
                    },
                    getLastDay: function () {
                        return this.find('th:last');
                    }
                });

                //create selected highlight column, append to clip, depends on jquery selectable
                opts.clip.append(this.selectedCol.addClass(opts.cssClass.selectedCol+' Hidden'));
                opts.dayRow.selectable({
                    filter: 'th',
                    start: function (e, ui) {
                        self._clearSelectedCol();
                        self.selectedCol.removeClass('Hidden').css({
                            height: self._getTimelineGridHeight()
                        });
                        self.selectedColBoxModel = $.getBoxModel(self.selectedCol);
                    },
                    selecting: function(e, ui) {
                        self._handleSelectingCol();
                    },
                    unselecting: function (e, ui) {
                        self._handleSelectingCol();
                    },
                    stop: function(e, ui) {}
                });
                opts.dayRow.on('mousedown.calendar', function (e) {
                    e.stopPropagation();
                });
                opts.clip.on('mousedown.calendar', function (e) {
                    self._clearSelectedCol();
                    return false;
                });

                //trigger scroll-x event
                opts.container.on('scroll.calendar', function (e) {
                    self._trigger(self.EVENT.SCROLLX, e, opts.container.scrollLeft());
                });

                this._ajustCalendarHeight();
                this._ajustCalendarWidth();
            },

        //destructor
            _destroy: function () {
                //destroy add-ons
                this.options.dayRow.selectable('destroy').removeData();
                //clear event
                $(window).off('.calendar');
                this.options.dayRow.off('.calendar');
                this.options.clip.off('.calendar');
                this.options.container.off('.calendar');
                //clear DOM
                this.options.monthRow.empty();
                this.options.dayRow.empty();
                this.options.content.empty().nextAll().remove();
            },

        //public method
            ajustCalendarSize: function (axis/*both|x|y*/) {
                axis = axis || 'both';
                //always ajust height before width
                if ( axis === 'both' || axis === 'y' ) {
                    this._ajustCalendarHeight();
                }
                if ( axis === 'both' || axis === 'x' ) {
                    this._ajustCalendarWidth();
                }
            },
            addColumn: function (position, type, number) {
                this._addColumn(position, type, number);
            },
            getClipSize: function () {
                return {
                    width: this.options.container.width(),
                    height: this.options.container.height()
                }
            },
            getTodayPosition: function () {
                return this.todayCol == null ? 0 : this.todayCol.position().left;
            },
            getDayPosition: function (date) {
                var offset = 0;
                if ( date.getHours() >= 12 ) {
                    offset = this.options.unitSize;
                }
                var dayBlock = $('#'+this.PREFIX.DAY_BLOCK+date.setHours(0, 0, 0, 0).valueOf());
                return offset +
                    (dayBlock.length > 0
                        ? dayBlock.position().left
                        : (date-this.options.dayRow.find('th').eq(0).data('date'))*this.options.unitSize*2/(24*3600*1000)
                    );
            },
            getDateFromPosition: function (pos) {
                var dayBlockPos = pos/(this.options.unitSize*2);
                return dayBlockPos > 0
                    ? this.options.dayRow.find('th').eq(dayBlockPos).data('date')
                        + (dayBlockPos%1)*(24*3600*1000)
                    : this.options.dayRow.find('th').eq(0).data('date')
                        + dayBlockPos*(24*3600*1000);
            },
            getDayValue: function (position, width) {  //TODO: working time should be fully customized
                //43200000 = 0.5 day in millisecond
                var tmp1 = position/this.options.unitSize;
                var startHour = tmp1%2 == 0
                    ? this.options.workingHours.morning[0]
                    : this.options.workingHours.evening[0];

                var tmp2 = width/this.options.unitSize;
                var endHour = (tmp1+tmp2)%2 == 0
                    ? this.options.workingHours.evening[1]
                    : this.options.workingHours.morning[1];

                var startDate = this.options.startTime.valueOf() + tmp1*43200000;
                var endDate = startDate + tmp2*43200000;
                return {
                    start: Math.round(startDate/1000), //ms -> s
                    end: Math.round(endDate/1000) - 1 //ms -> s
                }
            },
            getGridUnitSize: function () { return this.options.unitSize; },
            getScrollX: function () {
                return $.getScrollX(this.options.container);
            },
            getScrollY: function () {
                return $.getScrollY(this.options.fakeScroll);
            },
            scrollToTop: function () {
                $.scrollY(this.options.fakeScroll.removeClass('Hidden'), 0);
            },
            scrollToBottom: function () {
                $.scrollY(this.options.fakeScroll.removeClass('Hidden'), 1000000000);
                //trick: using very large number to scroll to bottom
            },
            scrollTo: function (x, y) {
                $.scrollX(this.options.container, x);
                $.scrollY(this.options.fakeScroll.removeClass('Hidden'), y);
            },
            scrollX: function (x) {
                $.scrollX(this.options.container, x);
            },
            scrollY: function (y) {
                $.scrollY(this.options.fakeScroll.removeClass('Hidden'), y);
            },

        //private methods
            _ajustCalendarHeight: function () {
                var opts = this.options;
                var element = this.element;
                var $window = $(window);
                var $outer = this.options.outer;

                //ajust container height
                opts.container.css({
                    height: $window.height()
                        - this.containerOffset.top
                        - opts.container.next().outerHeight()
                });

                //ajust clip height
                opts.clip.css({
                    height: opts.container.innerHeight()
                        - element.find('> thead').eq(0).outerHeight()
                        - Core.SCROLLBAR_SIZE
                });
                if ( opts.syncClip != undefined ) {
                    opts.syncClip.css({
                        height: opts.clip.height()
                    });
                }

                var highlightColHeight = this._getTimelineGridHeight();
                this.selectedCol.css({
                    height: highlightColHeight
                });
                if ( this.todayCol != null ) {
                    this.todayCol.css({
                        height: highlightColHeight
                    });
                }
                $('.'+opts.cssClass.holidayCol).css({
                    height: highlightColHeight
                });

                $('.'+opts.cssClass.calendarLimitLine).css({
                    height: element.outerHeight()
                });
            },
            _ajustCalendarWidth: function () {
                var prevAllWidth = 0;
                this.options.container.css({
                    width: 0 //little trick to solve vertical scrollbar appears during resize
                });
                this.options.container.prevAll().each(function () {
                    prevAllWidth += $(this).outerWidth();
                });
                var containerWidth = this.options.outer.width() - prevAllWidth;
                this.options.container.css({
                    width: containerWidth
                });

                //add columns if needed
                if ( containerWidth > this.element.width() ) {
                    this._addColumn(
                        'after', 
                        'day', 
                        Math.ceil((containerWidth - this.element.width())/(this.options.unitSize*2))
                    );
                }
            },
            _addColumn: function (position, type, number) {
                var opts = this.options;
                var element = this.element;
                //add 'number' columns of 'type' at 'position'
                //eg: add 3 columns of 'day' at 'after'
                //eg: add 3 columns of 'month' at 'before'
                //eg: add 1 columns of 'year' at 'after'
                switch (type) {
                    case 'day':
                        var wrapper = element.find('> tbody > tr > td');
                        var totalDaysCurrent = Number(wrapper.attr('colspan'));
                        var totalDays = totalDaysCurrent + number;
                        element
                            element.css({
                                width: '+='+number*opts.unitSize*2
                            })
                            wrapper.attr('colspan', totalDays);
                        //add column: Refactoring some day :(
                        if ( position === 'after' ) {
                            var lastColumn = opts.dayRow.getLastDay();
                            var lastDate =  new Date(lastColumn.data('date'));
                            var lastDateMonth = lastDate.getMonth();
                            var lastDateMonthBlock = $('#'+this.PREFIX.MONTH_BLOCK+lastDateMonth+lastDate.getFullYear());
                            var monthLength = Number(lastDateMonthBlock.attr('colspan'));
                            for ( var i = totalDaysCurrent ; i < totalDays ; i++ ) {
                                var day = new Date(opts.startTime.valueOf() + i*this.TIME_LENGTH.DAY);
                                var year = day.getFullYear();
                                if ( day.getMonth() == lastDateMonth ) { //day in exist month
                                    monthLength += 1;

                                    if ( day.getDate() == Date.getDaysInMonth(year, day.getMonth()) || i == totalDays-1 ) {
                                        lastDateMonthBlock
                                            .attr('colspan', monthLength)
                                            .find('span').css({
                                                width: opts.unitSize*2*monthLength-1
                                            });
                                    }

                                    //create day block
                                    this._util_.createDayBlock.call(this, day, lastDateMonth, year);
                                }
                                else {
                                    var month;
                                    if ( month === undefined ) {
                                        month = day.getMonth();
                                        monthLength = 1;
                                    }
                                    
                                    if ( month == day.getMonth() && i < totalDays-1 ) {
                                        monthLength += 1;
                                    }
                                    else {
                                        var monthText = opts.TEXT.MONTH[month];
                                        var monthBlock = $('<th id="'+this.PREFIX.MONTH_BLOCK+month+year+'" class="'+opts.cssClass.monthBlock+'" colspan="'+monthLength+'"><span style="width:'+(opts.unitSize*2*monthLength-1)+'px;">'+monthText+'&nbsp;'+(new Date(day.valueOf() - this.TIME_LENGTH.DAY).getFullYear())+'</span></th>');
                                        opts.monthRow.append(monthBlock);
                                        //reset
                                        month = day.getMonth();
                                        monthLength = 1;
                                    }

                                    //create day block
                                    this._util_.createDayBlock.call(this, day, month, year);
                                }
                            }
                        }
                        else if ( position === 'before' ) {
                            var firstColumn = opts.dayRow.getFirstDay();
                            var firstDate =  new Date(firstColumn.data('date'));
                            var firstDateMonth = firstDate.getMonth();
                            var firstDateMonthBlock = $('#'+this.PREFIX.MONTH_BLOCK+firstDateMonth+firstDate.getFullYear())
                            var monthLength = Number(firstDateMonthBlock.attr('colspan'));
                            for ( var i = 1 ; i < (number+1) ; i++ ) {
                                var day = new Date(opts.startTime.valueOf() - i*this.TIME_LENGTH.DAY);
                                var year = day.getFullYear();
                                
                                if ( day.getMonth() == firstDateMonth ) { //day in exist month
                                    monthLength += 1;

                                    if ( day.getDate() == 1 || i == number ) {
                                        $('#'+this.PREFIX.MONTH_BLOCK+firstDateMonth+year)
                                            .attr('colspan', monthLength)
                                            .find('span').css({
                                                width: opts.unitSize*2*monthLength-1
                                            });
                                    }

                                    //create day block
                                    this._util_.createDayBlock.call(this, day, firstDateMonth, year, true);
                                }
                                else {
                                    var month;
                                    if ( month === undefined ) {
                                        month = day.getMonth();
                                        monthLength = 1;
                                    }
                                    
                                    if ( month == day.getMonth() && i < number ) {
                                        monthLength += 1;
                                    }
                                    else {
                                        var monthText = opts.TEXT.MONTH[month];
                                        var monthBlock = $('<th id="'+this.PREFIX.MONTH_BLOCK+month+year+'" class="'+opts.cssClass.monthBlock+'" colspan="'+monthLength+'"><span style="width:'+(opts.unitSize*2*monthLength-1)+'px;">'+monthText+'&nbsp;'+(new Date(day.valueOf() - this.TIME_LENGTH.DAY).getFullYear())+'</span></th>');
                                        opts.monthRow.prepend(monthBlock);
                                        //reset
                                        month = day.getMonth();
                                        monthLength = 1;
                                    }

                                    //create day block
                                    this._util_.createDayBlock.call(this, day, month, year, true);
                                }
                            }
                            opts.startTime = new Date(opts.startTime.valueOf() - number*this.TIME_LENGTH.DAY);

                            //set limit line before
                            this.limitBefore.css({
                                left: '+='+number*opts.unitSize*2,
                            });
                            
                            //move today column
                            if ( this.todayCol != null ) {
                                this.todayCol.css({
                                    left: '+='+number*opts.unitSize*2
                                });
                            }
                        }
                        break;
                    case 'month':
                        //TODO
                        break;
                    case 'year':
                        //TODO
                        break;
                }

                //create holiday highlight column
                $('.'+opts.cssClass.holidayCol).remove();
                var holidayBlocks = $('.'+opts.cssClass.holidayBlock);
                if ( holidayBlocks.length > 0 ) {
                    var holidayCol = $('<div></div>').addClass(opts.cssClass.holidayCol);
                    var holidayColBoxModel = null;
                    var timelineGridHeight = this._getTimelineGridHeight();
                    holidayBlocks.each(function () {
                        var holidayBlock = $(this);
                        //must add class & append before getting box-model
                        var $holidayCol = holidayCol.clone();
                        opts.clip.append($holidayCol);
                        if ( holidayColBoxModel == null ) { holidayColBoxModel = $.getBoxModel($holidayCol); }
                        $holidayCol.css({
                            left: holidayBlock.position().left
                                - holidayColBoxModel.borderLeft,
                            width: holidayBlock.width()
                                - holidayColBoxModel.borderLeft
                                - holidayColBoxModel.borderRight
                                - holidayColBoxModel.paddingLeft
                                - holidayColBoxModel.paddingRight,
                            height: timelineGridHeight
                                - holidayColBoxModel.paddingTop
                                - holidayColBoxModel.paddingBottom,
                        });
                    });
                }
            },
            _clearSelectedCol: function () {
                this.selectedCol.addClass('Hidden');
                this.element.find('.'+this.options.cssClass.selectedBlock).removeClass(this.options.cssClass.selectedBlock);
            },
            _createCalendar: function () {
                var opts = this.options;
                var element = this.element;

                var totalDays = Math.ceil((opts.endTime.add({days: opts.timeAfter}) - opts.startTime.add({days: -opts.timeBefore}))/this.TIME_LENGTH.DAY);
                element.addClass(opts.cssClass.calendarGrid).css({
                    width: totalDays*opts.unitSize*2
                });
                //set tbody > tr > td colspan
                element.find('> tbody > tr > td').attr('colspan', totalDays);

                var month = new Date(opts.startTime.valueOf()).getMonth();
                var monthLength = 0;
                for ( var i = 0 ; i < totalDays ; i++ ) {
                    var day = new Date(opts.startTime.valueOf() + i*this.TIME_LENGTH.DAY);
                    var year = day.getFullYear();

                    //create day block
                    this._util_.createDayBlock.call(this, day, month, year);

                    monthLength++;
                    if ( day.getDate() == Date.getDaysInMonth(day.getFullYear(), day.getMonth()) || i == totalDays -1 ) {
                        var monthText = opts.TEXT.MONTH[month];
                        var monthBlock = $('<th id="'+this.PREFIX.MONTH_BLOCK+month+year+'" class="'+opts.cssClass.monthBlock+'" colspan="'+monthLength+'"><span style="width:'+(opts.unitSize*2*monthLength-1)+'px;">'+monthText+'&nbsp;'+(new Date(day.valueOf() - this.TIME_LENGTH.DAY).getFullYear())+'</span></th>');
                        opts.monthRow.append(monthBlock);
                        //reset
                        month = month < 11 ? month+1 : 0;
                        monthLength = 0;
                    }
                }
            },
            _getTimelineGridHeight: function () {
                var height = this.options.clip.outerHeight();
                if ( height < this.options.content.outerHeight() ) {
                    height = this.options.content.outerHeight();
                }
                return height;
            },
            _handleSelectingCol: function () {
                var selectingCol = $('.'+this.options.cssClass.selectingBlock);
                var startCol = selectingCol.first();
                var endCol = selectingCol.last();
                if ( startCol.length == 0 ) { return false; }
                var startEdge = startCol.position().left;
                var endEdge = endCol.position().left;
                var offset = 0;
                if ( startEdge < endEdge ) {
                    offset = endEdge - startEdge + endCol.outerWidth();
                }
                else {
                    offset = startEdge - endEdge + startCol.outerWidth();
                    startEdge = endEdge;
                }
                this.selectedCol.css({
                    left: startEdge - this.selectedColBoxModel.borderLeft,
                    width: offset
                        - this.selectedColBoxModel.borderLeft
                        - this.selectedColBoxModel.borderRight
                        - this.selectedColBoxModel.paddingLeft
                        - this.selectedColBoxModel.paddingRight
                });
            },

            //utilities function
            _util_: {
                createDayBlock: function (day, month, year, atFront) {
                    atFront = atFront === undefined ? false : atFront;
                    var opts = this.options;
                    var dayText = day.getDate();
                    var dateInMilliSeconds = new Date(year, month, dayText, 0, 0, 0, 0).valueOf();
                    var dayBlock = $('<th id="'+this.PREFIX.DAY_BLOCK+(dateInMilliSeconds)+'" class="'+opts.cssClass.dayBlock+'"><span style="width:'+(opts.unitSize*2-1)+'px;"><em>'+opts.TEXT.DAY[day.getDay()]+'</em><br />'+dayText+'</span></th>');
                    dayBlock.data('date', dateInMilliSeconds);
                    if ( atFront ) {
                        opts.dayRow.prepend(dayBlock);
                    }
                    else {
                        opts.dayRow.append(dayBlock);
                    }
                    if ( day.isToday() ) { dayBlock.addClass(opts.cssClass.todayBlock); }
                    if ( day.isHoliday() ) { dayBlock.addClass(opts.cssClass.holidayBlock); }
                }
            }
    });

    //version
    $.extend($.ui.calendar, {
        version: '1.0'
    });
})(jQuery);

//extend JavaScript Date object
Date.prototype.isToday = function () {
    //server time in 'ms'
    var currentDay = new Date(Number(document.getElementById('serverTime').value));
    return this.getDate() == currentDay.getDate()
        && this.getMonth() == currentDay.getMonth()
        && this.getFullYear() == currentDay.getFullYear();
}
Date.prototype.isHoliday = function () {
    return this.getDay() == 0 || this.getDay() == 6; //is weekend
}
Date.prototype.diff = function (date, by/*month | week | day | hour*/) {
    var postfix = 1;
    var ltTime = this; //lt = less than
    var gtTime = date; //gt = greater than
    if ( this.valueOf() > date.valueOf() ) {
        postfix = -1;
        ltTime = date;
        gtTime = this;
    }
    var diffValue = (gtTime - ltTime)/(24*3600*1000);
    switch (by) {
        case 'day':
            return postfix*(Math.floor(diffValue) + (diffValue%1 <= 0.5 ? 0.5 : 1));
            break;
    }
}
