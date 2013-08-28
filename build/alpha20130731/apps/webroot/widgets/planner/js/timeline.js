/* jQuery timeline by gaumup(ukhome@gmail.com) */
/**
 * @use:
 *  - create resizable/movable timeline bar in gantt chart component
 * @depends:
 *	- jQuery core
 *	- jQuery widget
 *  - resizable.js
 *  - Core
 * @change log:
 *  - v1.0:
 *      + can only move/resize timeline bar along x-axis
 */

//make sure DOM are ready
(function($) {
	$.widget('ui.timeline', $.ui.resizable, {
        widgetFullName: 'timeline',
        widgetEventPrefix: 'timeline',

        /*
         * timeline data
         * {
         *    id
         *    start
         *    end
         *    aStart
         *    aEnd
         *    completed
         *    streamID
         * }
         */

        //private member
            EVENT: $.extend({}, $.ui.resizable.prototype.EVENT, {
                COMPLETED: 'completed',
                UNCOMPLETED: 'uncompleted',
                CANCEL: 'cancel',
                DELETED: 'deleted',
                START_CREATE_RELATIONSHIP: 'startCreateRelationship',
                ON_CREATE_RELATIONSHIP: 'onCreateRelationship',
                STOP_CREATE_RELATIONSHIP: 'stopCreateRelationship',
                EDIT_TIMELINE: 'editTimeline',
                UPDATED: 'updated'
            }),
            container: null,
            containerModel: {},
            isCreateRelationship: false,
            isConnectingRelationship: false,
            timelineInnerDOM: '',

        //options
            options: {
                id: '',
                cssClass: {
                    connectingRelationship: 'GanttTimelineBarRelConnecting',
                    relationshipPoint: 'GanttTimelineBarRelPoint',
                    relationshipPointHover: 'GanttTimelineBarRelPointHover',
                    relationshipPointLeft: 'GanttTimelineBarRelPointLeft',
                    relationshipPointRight: 'GanttTimelineBarRelPointRight',
                    relationshipPointSelected: 'GanttTimelineBarRelPointSelected',
                    relationshipPointHint: 'GanttTimelineBarRelPointHint',
                    timelineBarHelper: 'GanttTimelineBarHelper',
                    timelineBarDecoration: 'GanttTimelineBarDecoration',
                    timelineBtn: 'GanttTimelineBtn',
                    timelineBtnDisabled: 'GanttTimelineBtnDisabled',
                    timelineDelRelationshipBtn: 'GanttTimelineDelRelationshipBtn',
                    timelineDeleteBtn: 'GanttTimelineDeleteBtn',
                    timelineAssignBtn: 'GanttTimelineAssignBtn',
                    timelineCalendarBtn: 'GanttTimelineCalendarBtn',
                    timelineCompletionBtn: 'GanttTimelineCompletionBtn',
                    timelineCompletedBtn: 'GanttTimelineCompletedBtn',
                    timelineGroupActionBtn: 'GanttTimelineGroupActionBtn',
                    timelineGroupActionBtnDisabled: 'GanttTimelineGroupActionBtnDisabled',
                    timelineGroupActionBtnCreator: 'GanttTimelineGroupActionBtnCreator'
                },
                //callback
                createRelationship: function (e, ui) {
                    //console.log('Create relationship');
                },
                cancel: function (e, ui) {
                    //console.log('Cancel');
                },
                start: function (e, ui) {
                    //console.log('Start');
                },
                stop: function (e, ui) {
                    //console.log('Stop');
                },
                moving: function (e, ui) {
                    //console.log('Moving');
                },
                moved: function (e, ui) {
                    //console.log('Moved: '+ui.lastDelta);
                },
                resizing: function (e, ui) {
                    //console.log('Resizing');
                },
                resized: function (e, ui) {
                    //console.log('Resized: '+ui.lastDelta);
                },
                isCompleted: false,
                useModel: 'Timeline'
            },

        //constructor
            _create: function () {
                //prepare timeline element before init 'resizable'
                var self = this;
                var opts = this.options;
                var element = this.element;

                var timelineData = element.data();
                var isCreator = String(timelineData.creatorID) === Zenwork.Auth.User.id 
                    || opts.isStreamCreator
                    || Zenwork.Planner.creatorID === Zenwork.Auth.User.id;
                var isOwner = false;
                if ( !isCreator ) { //logged in user is not creator
                    $.each(timelineData.User, function () { //check assignee
                        if ( String(this.id) === Zenwork.Auth.User.id ) {
                            isOwner = true;
                            return false; //break;
                        }
                    });
                }
                if ( !isCreator && !isOwner ) {
                    opts.disabled = true;
                    element.addClass(opts.cssClass.disabled);
                }

                this.container = element.parent();
                this.containerModel = $.getBoxPosition(this.container);

                //check condition to allow inherit class can override 'timelineInnerDOM'
                if ( this.widgetName == 'timeline' ) { //if init by 'timeline' constructor
                    this.timelineInnerDOM = String(
                        '<div class="'+opts.cssClass.timelineBarDecoration+'"></div>'
                    );
                }
                //prepare DOM
                var assigneeStr = this._util_.getAssigneeStr(timelineData.User);
                this.timelineInnerDOM += String(
                    '<div class="'+opts.cssClass.timelineBarHelper+'"></div>'+

                    '<a href="#'+opts.clientID+'" class="'+(isCreator ? 'QTip' : '')+' '+opts.cssClass.timelineBtn+' '+opts.cssClass.timelineCompletionBtn+' '+(isCreator ? '' : opts.cssClass.timelineBtnDisabled)+'" '+(isCreator ? 'title="Toggle timeline completion"' : '')+'>Toggle timeline completion</a>'+

                    ( isCreator
                        ? (
                            '<a data-tid="'+opts.id+'" href="#" class="QTip '+opts.cssClass.relationshipPoint+' '+opts.cssClass.relationshipPointLeft+'" title="Drag to create relationship">Drag to create relationship</a>'+
                            '<a data-tid="'+opts.id+'" href="#" class="QTip '+opts.cssClass.relationshipPoint+' '+opts.cssClass.relationshipPointRight+'" title="Drag to create relationship">Drag to create relationship</a>'
                        ) : ''
                    )+

                    '<div class="'+opts.cssClass.timelineGroupActionBtn+' '+(isCreator || isOwner ? '' : opts.cssClass.timelineGroupActionBtnDisabled)+' '+(isCreator ? opts.cssClass.timelineGroupActionBtnCreator : '')+'">'+
                    '    <div class="Wrapper">'+
                    ( isCreator || isOwner
                        ? (
                            '<a href="#'+opts.clientID+'" class="QTip '+opts.cssClass.timelineBtn+' '+opts.cssClass.timelineAssignBtn+'" title="'+assigneeStr+'">'+assigneeStr+'</a>'+
                            '<a href="#'+opts.clientID+'" class="QTip '+opts.cssClass.timelineBtn+' '+opts.cssClass.timelineCalendarBtn+'" title="Edit timeline">Edit timeline</a>'
                        ) : ''
                    )+

                    ( isCreator
                        ? (
                            '<a href="#'+opts.clientID+'" class="QTip '+opts.cssClass.timelineBtn+' '+opts.cssClass.timelineDelRelationshipBtn+'" title="Delete relationship">Delete relationship</a>'+
                            '<a href="#'+opts.clientID+'" class="QTip '+opts.cssClass.timelineBtn+' '+opts.cssClass.timelineDeleteBtn+'" title="Delete this timeline">Delete this timeline</a>'
                        ) : ''
                    )+

                    '    </div>'+
                    '</div>'
                );
                element.html(this.timelineInnerDOM);

                //store element properties
                element.data('id', opts.id);
                element.data('clientID', opts.clientID);
                element.data('left', opts.left);
                element.data('width', opts.width == 0 ? opts.gridModel.unitSize : opts.width);
                element.data('parentID', opts.parentID);
                element.data('completed', opts.isCompleted);
                if ( opts.isCompleted == 1 ) {
                    element.find('.'+opts.cssClass.timelineCompletionBtn).addClass(this.options.cssClass.timelineCompletedBtn);
                }
                element.bind('mouseup.timeline', function (e) {
                    self._trigger(self.EVENT.CANCEL, e, this);
                });

                //bind event to timeline action button: completion, delete, assign, edit
                element.find('.'+opts.cssClass.timelineBtn)
                    .bind('mousedown.timeline', function (e) {
                        return false;
                    })
                    .bind('click.timeline', function (e) {
                        Zenwork.Plugins.Tip.hide();
                        Zenwork.Dialog.close();
                        var $this = $(this);
                        if ( $this.hasClass(opts.cssClass.timelineBtnDisabled) ) { return false; }

                        Zenwork.Model.checkExist('Timeline', $($this.attr('href')).data('id'), function (exists) {
                            if ( exists ) {
                                if ( $this.hasClass(opts.cssClass.timelineDeleteBtn) ) { //delete
                                    self._deleteTimeline(e);
                                }
                                else if ( $this.hasClass(opts.cssClass.timelineAssignBtn) ) { //assign
                                    Zenwork.AssigneeDialog.show(e, element);
                                }
                                else if ( $this.hasClass(opts.cssClass.timelineCalendarBtn) ) { //edit start/end
                                    Zenwork.TimelineDialog.show(e, element);
                                    self._trigger(self.EVENT.EDIT_TIMELINE, e, element);
                                }
                                else if ( $this.hasClass(opts.cssClass.timelineCompletionBtn) ) { //completion
                                    if ( !$this.hasClass(opts.cssClass.timelineCompletedBtn) ) {
                                        self._markTimelineAsCompleted($this, element, e);
                                    }
                                    else {
                                        self._markTimelineAsUnCompleted($this, element, e);
                                    }
                                }
                                else if ( $this.hasClass(opts.cssClass.timelineDelRelationshipBtn) ) { //relationship
                                    //get predecessor
                                    var pre = [];
                                    var preData = element.data('predecessor');
                                    if ( preData !== undefined ) {
                                        $.each(preData, function () {
                                            if ( this.length > 0 ) {
                                                pre = pre.concat(this);
                                            }
                                        });
                                    }

                                    //get successor
                                    var relationshipTable = Zenwork.Planner.app.planner('getRelationshipTable');
                                    var succ = relationshipTable[element.data('clientID')];
                                    succ = succ || [];

                                    Zenwork.Planner.RelationshipDialog.show(e, element, pre, succ);
                                }
                            }
                            else {
                                $($this.attr('href')).remove();
                            }
                        });
                        return false;
                    });

                //bind event to relationship point
                element.find('.'+opts.cssClass.relationshipPoint)
                    .bind('mousedown.timeline', function (e) {
                        var $this = $(e.currentTarget);
                        if ( e.which == 3 ) { return false; }
                        $this.addClass(opts.cssClass.relationshipPointSelected);
                        self.isCreateRelationship = true;
                        self._trigger(self.EVENT.START_CREATE_RELATIONSHIP, e, self);
                        e.preventDefault();
                    })
                    .bind('mouseup.timeline', function (e) {
                        if ( e.which == 3 ) { return false; }
                        self.isCreateRelationship = false;
                        var relationshipPointSelected = element.find('.'+opts.cssClass.relationshipPointSelected);
                        if ( relationshipPointSelected.length > 0 ) {
                            relationshipPointSelected.removeClass(opts.cssClass.relationshipPointSelected);
                            self._trigger(self.EVENT.STOP_CREATE_RELATIONSHIP, e, self);
                            e.stopPropagation();
                        }
                    })
                    .bind('mouseenter.timeline', function (e) {
                        var relationshipPoint = $('.'+opts.cssClass.relationshipPointSelected);
                        if ( relationshipPoint.length > 0 && !relationshipPoint.is(this) ) {
                            $(this)
                                .addClass(opts.cssClass.connectingRelationship)
                                .addClass(opts.cssClass.relationshipPointHover);
                        }
                        e.preventDefault();
                    })
                    .bind('mouseleave.timeline', function (e) {
                        $(this)
                            .removeClass(opts.cssClass.connectingRelationship)
                            .removeClass(opts.cssClass.relationshipPointHover);
                        e.preventDefault();
                    });

                //bind event to group action button
                element.find('.'+opts.cssClass.timelineGroupActionBtn).bind('mousedown', function (e) {
                    Zenwork.Plugins.Tip.hide();
                    Zenwork.Dialog.close();
                    return false;
                });

                //bind update event on timeline dialog
                element.on(Zenwork.TimelineDialog.EVENT.UPDATE, function (e, start, end) {
                    self._trigger(self.EVENT.UPDATED, e, [element, start, end]);
                });

                //bind update event on assignee dialog
                element.on(Zenwork.AssigneeDialog.EVENT.ASSIGN, function (e, assigneeData) {
                    self._markTimelineAsUnCompleted(element.find('.'+opts.cssClass.timelineCompletionBtn), element, e, false);

                    var assigneeStr = self._util_.getAssigneeStr(element.data('User'));
                    element.find('.'+opts.cssClass.timelineAssignBtn)
                        .attr('title', assigneeStr)
                        .text(assigneeStr);
                });
                element.on(Zenwork.AssigneeDialog.EVENT.UNASSIGN, function (e, uid, allCompleted) {
                    if ( allCompleted ) {
                        self._markTimelineAsCompleted(element.find('.'+opts.cssClass.timelineCompletionBtn), element, e, false);
                    }

                    var assigneeData = element.data('User');
                    var assigneeStr = self._util_.getAssigneeStr(assigneeData);
                    element.find('.'+opts.cssClass.timelineAssignBtn)
                        .attr('title', assigneeStr)
                        .text(assigneeStr);
                });
                element.on(Zenwork.AssigneeDialog.EVENT.UPDATE, function (e, uid, effort) {
                    var assigneeData = element.data('User');
                    var assigneeStr = self._util_.getAssigneeStr(assigneeData);
                    element.find('.'+opts.cssClass.timelineAssignBtn)
                        .attr('title', assigneeStr)
                        .text(assigneeStr);
                });
                element.on(Zenwork.AssigneeDialog.EVENT.TOGGLE_COMPLETION, function (e, uid, completed, allCompleted) {
                    if ( allCompleted ) {
                        self._markTimelineAsCompleted(element.find('.'+opts.cssClass.timelineCompletionBtn), element, e, false);
                    }
                    else {
                        self._markTimelineAsUnCompleted(element.find('.'+opts.cssClass.timelineCompletionBtn), element, e, false);
                    }
                });
                
                $(document)
                    .bind('mousemove.timeline', function (e) {
                        if ( self.isCreateRelationship ) {
                            self._trigger(self.EVENT.ON_CREATE_RELATIONSHIP, e, self);
                        }
                    })
                    .bind('mouseup.timeline', function (e) {
                        if ( self.isCreateRelationship ) {
                            element.find('.'+opts.cssClass.relationshipPointSelected).removeClass(opts.cssClass.relationshipPointSelected);
                            self.isCreateRelationship = false;
                            self._trigger(self.EVENT.STOP_CREATE_RELATIONSHIP, e, self);
                        }
                    });

                //finally init 'resizable' by calling parent's constructor
                this._super();
            },

        //destructor
            _destroy: function () {},

        //public method
            isCompleted: function () {
                return this.element.find('.'+this.options.cssClass.timelineCompletionBtn).hasClass(this.options.cssClass.timelineCompletedBtn)
            },
            markTimelineAsCompleted: function () {
                var checkbox = this.element.find('.'+this.options.cssClass.timelineCompletionBtn).eq(0);
                this._markTimelineAsCompleted(checkbox, this.element);
            },
            markTimelineAsUnCompleted: function () {
                var checkbox = this.element.find('.'+this.options.cssClass.timelineCompletionBtn).eq(0);
                this._markTimelineAsUnCompleted(checkbox, this.element);
            },
            deleteTimeline: function (e, callback) {
                this._deleteTimeline(e, callback);
            },

        //private method
            _markTimelineAsCompleted: function (checkbox, timeline, e, forceUpdateAll) {
                console.log(1)
                var timelineData = timeline.data();
                if ( timelineData.completed == 1 ) { return false; }

                checkbox.addClass(this.options.cssClass.timelineCompletedBtn);
                timelineData.completed = 1;

                //add changes data to model buffer
                Zenwork.Model.addBuffer({
                    id: timelineData.id,
                    completed: 1
                }, 'Timeline', Zenwork.Model.CU);

                if ( e != undefined ) {
                    this._trigger(this.EVENT.COMPLETED, e, timeline);
                }
            },
            _markTimelineAsUnCompleted: function (checkbox, timeline, e, forceUpdateAll) {
                var timelineData = timeline.data();
                if ( timelineData.completed == 0 ) { return false; }

                checkbox.removeClass(this.options.cssClass.timelineCompletedBtn);
                timelineData.completed = 0;

                //add changes data to model buffer
                Zenwork.Model.addBuffer({
                    id: timelineData.id,
                    completed: false
                }, 'Timeline', Zenwork.Model.CU);

                if ( e != undefined ) {
                    this._trigger(this.EVENT.UNCOMPLETED, e, timeline);
                }
            },
            _deleteTimeline: function (e, callback) {
                var self = this;
                var element = this.element;
                if ( element.prevAll().length == 0 && element.nextAll().length == 0 ) {
                    alert('Sorry, can not delete this timeline bar.\nEach row must have at least 1 timeline bar!');
                    return false;
                }
                Zenwork.Window.confirm('Sure?', function () {
                    $.ajax({
                        type: 'POST',
                        url: Zenwork.Root+'/app/deleteTimeline/'+element.data('id'),
                        dataType: 'json', //return from server
                        success: function (data, textStatus, jqXHR) {
                            if ( data.success ) {
                                self._trigger(self.EVENT.DELETED, e, element);
                                if ( callback !== undefined ) { callback(); }
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            if ( textStatus !== 'abort' ) {
                                alert('Really sorry for this, network error! Please try again!');
                            }
                        }
                    });
                });
            },
            _util_: {
                getAssigneeStr: function (data) {
                    var assigneeStr = 'Assignee: ';
                    if ( data !== undefined && data.length > 0 ) {
                        $.each(data, function (index, obj) {
                            assigneeStr += (obj.username+'('+obj.Users_timeline.effort+' wds)');
                            if ( index < data.length - 1 ) {
                                assigneeStr += ', ';
                            }
                        });
                    }
                    else {
                        assigneeStr += '[no assignee]';
                    }
                    return assigneeStr;
                }
            }
    });

    //version
    $.extend($.ui.timeline, {
        version: '1.0'
    });

    //create model for timeline
    Zenwork.Model.createModel('Timeline', function (timelineData) {
        return { 'Timeline': $.extend({}, timelineData) };
    });
    Zenwork.Model.createModel('Timeline_dependancy', function (data) {
        return { 'Timeline_dependancy': $.extend({}, data) };
    });
    Zenwork.Model.createModel('Users_timeline', function (data) {
        return { 'Users_timeline': $.extend({}, data) };
    });
})(jQuery);