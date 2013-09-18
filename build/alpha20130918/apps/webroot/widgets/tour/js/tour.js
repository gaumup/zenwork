Zenwork = typeof(Zenwork) == 'undefined' ? {} : Zenwork;
Zenwork.Tour = [];

(function($) {
    $.widget('ui.tour', {
        widgetFullName: 'tour',
        widgetEventPrefix: 'tour',

        options: {
            cssClass: {
                block: 'TourGuideBlock',
                closeBtn: 'TourGuideCloseBtn',
                LT: 'TourLT',
                LB: 'TourLB',
                RT: 'TourRT',
                RB: 'TourRB',
                LC: 'TourLC',
                RC: 'TourRC',
                CC: 'TourCC',
                CT: 'TourCT',
                CB: 'TourCB'
            },
            pos: {
                my: 'left top',
                at: 'left bottom',
                within: window,
                collision: 'none'
            }
        },

        //constructor
        _create: function () {
            var self = this;
            var element = this.element;
            var opts = this.options;
            var tourBlock = this.tourBlock = $('.'+opts.cssClass.block+'[rel="'+opts.id+'"]');
            if ( tourBlock.length == 0 ) {
                return false;
            }

            var tourBlockData = tourBlock.data();
            var ajustment = tourBlockData.tourAjust.split(' ');
            var myPosition = tourBlockData.tourMy.split(' ');
            myPosition[0] += (ajustment[0] >= 0 ? '+'+ajustment[0] : ajustment[0]);
            myPosition[1] += (ajustment[1] >= 0 ? '+'+ajustment[1] : ajustment[1]);
            myPosition = myPosition.join(' ');
            var pos = $.extend(true, opts.pos, {
                my: myPosition,
                at: tourBlockData.tourAt,
                of: element
            });
            tourBlock.removeClass('Hidden').position(pos);

            //add position class
            switch (tourBlockData.tourMy) {
                case 'left top':
                    tourBlock.addClass(opts.cssClass.LT);
                    break;
                case 'left bottom':
                    tourBlock.addClass(opts.cssClass.LB);
                    break;
                case 'right top':
                    tourBlock.addClass(opts.cssClass.RT);
                    break;
                case 'right bottom':
                    tourBlock.addClass(opts.cssClass.RB);
                    break;
                case 'left center':
                    tourBlock.addClass(opts.cssClass.LC);
                    break;
                case 'right center':
                    tourBlock.addClass(opts.cssClass.RC);
                    break;
                case 'center top':
                    tourBlock.addClass(opts.cssClass.CT);
                    break;
                case 'center bottom':
                    tourBlock.addClass(opts.cssClass.CB);
                    break;
                case 'center center':
                    tourBlock.addClass(opts.cssClass.CC);
                    break;
            }

            //bind close event
            tourBlock.on('click', '.'+opts.cssClass.closeBtn, function (e) {
                self._dismiss(true);
                self.element.trigger('dismiss.tour', e);
                return false;
            });

            //bind event on tourBlock
            tourBlock.on('click', function (e) {
                e.stopPropagation();
            });
        },

        //public methods
        dismiss: function (isAjax) {
            this._dismiss(isAjax);
        },
        show: function () {
            this._show();
        },

        //private methods
        _dismiss: function (isAjax) {
            this.tourBlock.addClass('Hidden');
            isAjax = isAjax === undefined ? false : isAjax;
            if ( isAjax ) {
                this.tourBlock.remove();
                $.Widget.prototype.destroy.call(this);

                $.ajax({
                    type: 'POST',
                    url: Zenwork.Root+'/app/dismissHelp',
                    contentType: 'json',
                    dataType: 'json',
                    data: JSON.stringify({
                        name: this.tourBlock.data('serverId'),
                        scope: this.tourBlock.data('scope')
                    })
                });
            }
        },
        _show: function () {
            this.tourBlock.removeClass('Hidden').position(this.options.pos);
        }
    });

    //version
    $.extend($.ui.tour, {
        version: '1.0'
    });
})(jQuery);
   
jQuery(document).ready(function () {
    var _util_ = function (tourID, selectors) {
        $.each(selectors, function (index, selector) {
            var $this = $(selector);
            if ( $this.length > 0 && $this.is(':visible') ) {
                if ( $this.data('uiTour') === undefined ) {
                    $this.tour({id: selector});
                }
                else {
                    $this.tour('show');
                }
            }
        });
        Zenwork.Tour[tourID] = selectors.join(',');
    }
    var _dismiss_ = function (tourName) {
        if ( Zenwork.Tour[tourName] !== undefined ) {
            $(Zenwork.Tour[tourName]).each(function () {
                var $this = $(this);
                if ( $this.data('uiTour') !== undefined ) {
                    $this.tour('dismiss');
                }
            });
        }
    }

    //subscribe for channels on 'App'
    if ( Core.Mediator !== undefined ) {
        Core.Mediator.sub('startUpTourDismiss.App', function () {
            if ( Zenwork.Dashboard !== undefined ) {
                if ( $('#zwAddNewTaskText').is(':visible') ) {
                    Zenwork.Dashboard.pub('todayBlockLoad.Help.Dashboard', '#zwAddNewTaskText', '#zwAddNewTaskCompact', '#myTaskStatisticChartBlock');
                }
                else {
                    Zenwork.Dashboard.pub('todayBlockLoad.Help.Dashboard', '#zwAddNewTaskCompact', '#myTaskStatisticChartBlock', '#todayTaskListJScrollPane');
                }
            }

            if ( Zenwork.Planner !== undefined ) {
                Zenwork.Planner.pub('selectPlan.Help.Planner', '#streamListSelection');
                Zenwork.Planner.pub('createFirstPlan.Help.Planner', '#createNewStreamList');
                Zenwork.Planner.pub('createFirstTask.Help.Planner', '#addGanttTimelineTrigger');
            }
        });
    }

    //subscribe for channels on 'Dashboard' section
    if ( Zenwork.Dashboard !== undefined ) {
        //#1, id: todayBlockLoad
        Zenwork.Dashboard.sub('todayBlockLoad.Help.Dashboard', function () {
            if ( $('#zwStartUpTour:visible').length == 0 ) {
                _util_('todayBlockLoad.Help.Dashboard', Array.prototype.slice.call(arguments));
            }
        });
        //#2
        Zenwork.Dashboard.sub('dashboardStartAddFirstTask.Help.Dashboard', function () {
            _dismiss_('todayBlockLoad.Help.Dashboard');
        });
        //#3, id: dashboardViewAddedFirstTask
        Zenwork.Dashboard.sub('dashboardViewAddedFirstTask.Help.Dashboard', function () {
            _util_('dashboardViewAddedFirstTask.Help.Dashboard', Array.prototype.slice.call(arguments));
        });
        //#4, id: dashboardListView
        Zenwork.Dashboard.sub('dashboardListView.Help.Dashboard', function () {
            _util_('dashboardListView.Help.Dashboard', Array.prototype.slice.call(arguments));
        });
        //#5, id: startWorkingTask
        Zenwork.Dashboard.sub('startWorkingTask.Help.Dashboard', function () {
            var selector = Array.prototype.slice.call(arguments);
            if ( $(selector[0]).length > 0 && $(selector[0]).is(':visible') ) {
                _util_('startWorkingTask.Help.Dashboard', selector);
            }
            else {
               Zenwork.Dashboard.pub('finishTask.Help.Dashboard', '.StreamTimelineBlockCompletion:first'); 
            }
        });
        Zenwork.Dashboard.sub('afterClickStartWorking.Help.Dashboard', function () {
            _dismiss_('startWorkingTask.Help.Dashboard');
        });
        //#6, id: finishTask
        Zenwork.Dashboard.sub('finishTask.Help.Dashboard', function () {
            _util_('finishTask.Help.Dashboard', Array.prototype.slice.call(arguments));
        });
        Zenwork.Dashboard.sub('afterClickFinishTask.Help.Dashboard', function () {
            _dismiss_('finishTask.Help.Dashboard');
        });
        Zenwork.Dashboard.sub('teamSelectionFirstTime.Help.Dashboard', function () {
            _util_('teamSelectionFirstTime.Help.Dashboard', Array.prototype.slice.call(arguments));
        });
        Zenwork.Dashboard.sub('createFirstTeam.Help.Dashboard', function () {
            _util_('createFirstTeam.Help.Dashboard', Array.prototype.slice.call(arguments));
        });
        Zenwork.Dashboard.sub('teamSelectedFirstTime.Help.Dashboard', function () {
            _dismiss_('teamSelectionFirstTime.Help.Dashboard');
        });
        Zenwork.Dashboard.sub('firstTeamCreating.Help.Dashboard', function () {
            _dismiss_('createFirstTeam.Help.Dashboard');
            _dismiss_('teamSelectionFirstTime.Help.Dashboard');
        });


        //popup event subscribe
        Zenwork.Dashboard.sub('beforeCloseStreamPopup.StreamPopup', function () {
            _dismiss_('dashboardViewAddedFirstTask.Help.Dashboard');
            _dismiss_('startWorkingTask.Help.Dashboard');
            _dismiss_('finishTask.Help.Dashboard');
        });
        Zenwork.Dashboard.sub('afterCloseStreamPopup.StreamPopup', function () {
            Zenwork.Dashboard.pub('dashboardListView.Help.Dashboard', '#todayTaskListJScrollPane');
        });
        Zenwork.Dashboard.sub('beforeShowPopup.Popup', function () {
            _dismiss_('todayBlockLoad.Help.Dashboard');
            _dismiss_('dashboardListView.Help.Dashboard');
            _dismiss_('startWorkingTask.Help.Dashboard');
            _dismiss_('finishTask.Help.Dashboard');
        });
    }

    //subscribe for channels on 'Task Planner' section
    if ( Zenwork.Planner !== undefined ) {
        //#1, id: selectPlan
        Zenwork.Planner.sub('selectPlan.Help.Planner', function () {
            if ( $('#zwStartUpTour:visible').length == 0 ) {
                _util_('selectPlan.Help.Planner', Array.prototype.slice.call(arguments));
            }
        });
        Zenwork.Planner.sub('afterClickSelectionList.Help.Planner', function () {
            _dismiss_('selectPlan.Help.Planner');
        });
        //#2, id: createFirstPlan
        Zenwork.Planner.sub('createFirstPlan.Help.Planner', function () {
            if ( $('#zwStartUpTour:visible').length == 0 ) {
                _util_('createFirstPlan.Help.Planner', Array.prototype.slice.call(arguments));
            }
        });
        Zenwork.Planner.sub('afterClickCreatePlan.Help.Planner', function () {
            _dismiss_('selectPlan.Help.Planner');
            _dismiss_('createFirstPlan.Help.Planner');
        });
        Zenwork.Planner.sub('afterSelectList.Help.Planner', function () {
            _dismiss_('createFirstPlan.Help.Planner');
            _dismiss_('createFirstTask.Help.Planner');
        });
        //#3: id: createFirstTask
        Zenwork.Planner.sub('createFirstTask.Help.Planner', function () {
            if ( $('#zwStartUpTour:visible').length == 0 ) {
                _util_('createFirstTask.Help.Planner', Array.prototype.slice.call(arguments));
            }
        });
        //#3: id: firstTaskCreated
        Zenwork.Planner.sub('firstTaskCreated.Help.Planner', function () {
            _dismiss_('selectPlan.Help.Planner');
            _dismiss_('createFirstPlan.Help.Planner');
            _dismiss_('createFirstTask.Help.Planner');
            var seq = Array.prototype.slice.call(arguments);
            _util_('firstTaskCreatedViewDetails.Help.Planner', [seq[0]]);

            $(seq[0]).on('dismiss.tour', function (e) {
                _util_('firstTaskCreatedExploreTaskAction.Help.Planner', [seq[1]]);
            });
            $(seq[1]).on('dismiss.tour', function (e) {
                _util_('firstTaskCreatedReorder.Help.Planner', [seq[2]]);
            });
            $(seq[2]).on('dismiss.tour', function (e) {
                _util_('firstTaskCreatedTimeline.Help.Planner', [seq[3]]);
            });
            $(seq[3]).on('dismiss.tour', function (e) {
                _dismiss_('firstTaskCreatedTimeline.Help.Planner');
            });
        });
        Zenwork.Planner.sub('beforeStreamDetailsOpen.Help.Planner', function () {
            _dismiss_('firstTaskCreatedViewDetails.Help.Planner');
        });
    }
});