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
                collision: 'flipfit'
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

    var _util_ = function (tourID, selectors) {
        if ( Zenwork.Tour[tourID] !== undefined ) {
            return false;
        }
        $.each(selectors, function (index, selector) {
            var $this = $(selector);
            if ( $this.length > 0 && $this.is(':visible') && $this.data('uiTour') === undefined ) {
                $this.tour({id: selector});
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

    //subscribe for channels on 'Dashboard' section
        //#1, id: todayBlockLoad
        Core.Mediator.sub('todayBlockLoad', function () {
            _util_('todayBlockLoad', Array.prototype.slice.call(arguments));
        });
        //#2
        Core.Mediator.sub('dashboardStartAddFirstTask', function () {
            _dismiss_('todayBlockLoad');
        });
        //#3, id: dashboardViewAddedFirstTask
        Core.Mediator.sub('dashboardViewAddedFirstTask', function () {
            _util_('dashboardViewAddedFirstTask', Array.prototype.slice.call(arguments));
        });
        Core.Mediator.sub('beforeCloseStreamPopup', function () {
            _dismiss_('dashboardViewAddedFirstTask');
        });
        //#4, id: dashboardListView
        Core.Mediator.sub('dashboardListView', function () {
            _util_('dashboardListView', Array.prototype.slice.call(arguments));
        });
        Core.Mediator.sub('afterCloseStreamPopup', function () {
            Core.Mediator.pub('dashboardListView', '#todayTaskListJScrollPane');
        });
        Core.Mediator.sub('beforeShowStreamPopup', function () {
            _dismiss_('todayBlockLoad');
            _dismiss_('dashboardListView');
            _dismiss_('startWorkingTask');
            _dismiss_('finishTask');
        });
        //#5, id: startWorkingTask
        Core.Mediator.sub('startWorkingTask', function () {
            _util_('startWorkingTask', Array.prototype.slice.call(arguments));
        });
        Core.Mediator.sub('afterClickStartWorking', function () {
            _dismiss_('startWorkingTask');
        });
        //#6, id: finishTask
        Core.Mediator.sub('finishTask', function () {
            _util_('finishTask', Array.prototype.slice.call(arguments));
        });
        Core.Mediator.sub('afterClickFinishTask', function () {
            _dismiss_('finishTask');
        });

    //subscribe for channels on 'Task Planner' section
        //#1, id: selectPlan
        Core.Mediator.sub('selectPlan', function () {
            _util_('selectPlan', Array.prototype.slice.call(arguments));
        });
        Core.Mediator.sub('afterClickSelectionList', function () {
            _dismiss_('selectPlan');
        });
        //#2, id: createFirstPlan
        Core.Mediator.sub('createFirstPlan', function () {
            _util_('createFirstPlan', Array.prototype.slice.call(arguments));
        });
        Core.Mediator.sub('afterClickCreatePlan', function () {
            _dismiss_('selectPlan');
            _dismiss_('createFirstPlan');
        });
        Core.Mediator.sub('afterSelectList', function () {
            _dismiss_('createFirstPlan');
            _dismiss_('createFirstTask');
        });
        //#3: id: createFirstTask
        Core.Mediator.sub('createFirstTask', function () {
            _util_('createFirstTask', Array.prototype.slice.call(arguments));
        });
        //#3: id: firstTaskCreated
        Core.Mediator.sub('firstTaskCreated', function () {
            _dismiss_('selectPlan');
            _dismiss_('createFirstPlan');
            _dismiss_('createFirstTask');
            var seq = Array.prototype.slice.call(arguments);
            _util_('firstTaskCreatedViewDetails', [seq[0]]);

            $(seq[0]).on('dismiss.tour', function (e) {
                _util_('firstTaskCreatedExploreTaskAction', [seq[1]]);
            });
            $(seq[1]).on('dismiss.tour', function (e) {
                _util_('firstTaskCreatedReorder', [seq[2]]);
            });
            $(seq[2]).on('dismiss.tour', function (e) {
                _util_('firstTaskCreatedTimeline', [seq[3]]);
            });
            $(seq[3]).on('dismiss.tour', function (e) {
                _dismiss_('firstTaskCreatedTimeline');
            });
        });
        Core.Mediator.sub('beforeStreamDetailsOpen', function () {
            _dismiss_('firstTaskCreatedViewDetails');
        });
})(jQuery);