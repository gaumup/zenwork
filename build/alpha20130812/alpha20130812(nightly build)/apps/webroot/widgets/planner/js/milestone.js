/* jQuery milestone by gaumup(ukhome@gmail.com) */
/**
 * @use:
 *  - create movable milestone in gantt chart component
 * @depends:
 *	- jQuery core
 *	- jQuery widget
 *  - resizable.js
 *  - timeline.js
 * @change log:
 *  - v1.0:
 *      + can only move milestone along x-axis
 */

//make sure DOM are ready
(function($) {
	$.widget('ui.milestone', $.ui.timeline, {
        widgetFullName: 'milestone',
        widgetEventPrefix: 'milestone',

        /*
         * milestone data(as same as timeline)
         * {
         *    id
         *    start
         *    end
         *    aStart
         *    aEnd
         *    completed
         *    streamID
         * }
         * note: always start === end === aStart === aEnd
         */

        //private member

        //options
            options: {
                cssClass: $.extend({}, $.ui.timeline.prototype.options.cssClass, {
                    select: 'GanttMilestoneSelect'
                }),
                edgeSensitive: 0
            },

        //constructor
            _create: function () {
                var opts = this.options;

                //check condition to allow inherit class can override 'timelineInnerDOM'
                if ( this.widgetName == 'milestone' ) { //if init by 'milestone' constructor
                    //do anything with 'this.timelineInnerDOM'
                }
                this._super();
            },

        //destructor
            _destroy: function () {}

        //public method

        //private methods
    });

    //version
    $.extend($.ui.milestone, {
        version: '1.0'
    });
})(jQuery);