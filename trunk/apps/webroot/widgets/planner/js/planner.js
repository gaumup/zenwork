/* jQuery planner by gaumup */
/**
 * @use:
 *  - create resizable/movable timeline bar in gantt chart component
 * @depends:
 *  - jQuery core
 *  - jQuery widget
 *  - resizable.js
 *  - timeline.js
 *  - milestone.js
 *  - stream.js (widgets)
 *  - calendar.js (widgets)
 *  - Raphael
 *  - Core
 * @change log:
 *  - v1.0: initial
 */

//gantt widgets
(function($) {
    $.widget('ui.planner', {
        widgetFullName: 'planner',
        widgetEventPrefix: 'planner',

        //private member
            containerBoxModel: {},
            disabledDrawingTimeline: true,
            gridUnitSize: 0,
            highlightOverlays: null,
            onDragging: false,
            PREFIX: {
                MILESTONE: 'm',
                TIMELINE_BAR: 'b',
                TIMELINE_ITEM: 't',
            },
            queue: {},
            scrollTimer: null,
            selectedTimeline: {
                list: [],
                sortAscLeft: [],
                sortDescRight: []
            },
            timelineGroup: [],
            timelineGroupStatus: {
                freezingLeft: false,
                freezingRight: false
            },
            timelineEvalMinMax: {
                equal: function (elem1, elem2) {
                    var $elem1 = $(elem1);
                    var $elem2 = $(elem2);
                    return ($elem1.data('left') == $elem2.data('left'))
                        && ($elem1.data('left') + $elem1.data('width')
                        == $elem2.data('left') + $elem2.data('width'));
                },
                equalOrLessThan: function (elem1, elem2) {
                    return $(elem1).data('left') <= $(elem2).data('left');
                },
                equalOrGreaterThan: function (elem1, elem2) {
                    var $elem1 = $(elem1);
                    var $elem2 = $(elem2);
                    return $elem1.data('left') + $elem1.data('width')
                        >= $elem2.data('left') + $elem2.data('width');
                },
                lessThan: function (elem1, elem2) {
                    return $(elem1).data('left') < $(elem2).data('left');
                },
                greaterThan: function (elem1, elem2) {
                    var $elem1 = $(elem1);
                    var $elem2 = $(elem2);
                    return $elem1.data('left') + $elem1.data('width')
                        > $elem2.data('left') + $elem2.data('width');
                }
            },
            timelineEvalSortLeft: {
                equal: function (elem1, elem2) {
                    return $elem1.data('left') == $elem2.data('left');
                },
                equalOrLessThan: function (elem1, elem2) {
                    return $(elem1).data('left') <= $(elem2).data('left');
                },
                equalOrGreaterThan: function (elem1, elem2) {
                    return $(elem1).data('left') >= $(elem2).data('left');
                },
                lessThan: function (elem1, elem2) {
                    return $(elem1).data('left') < $(elem2).data('left');
                },
                greaterThan: function (elem1, elem2) {
                    return $(elem1).data('left') > $(elem2).data('left');
                }
            },
            timelineEvalSortRight: {
                equal: function (elem1, elem2) {
                    var $elem1 = $(elem1);
                    var $elem2 = $(elem2);
                    return $elem1.data('left') + $elem1.data('width')
                        == $elem2.data('left') + $elem2.data('width');
                },
                equalOrLessThan: function (elem1, elem2) {
                    var $elem1 = $(elem1);
                    var $elem2 = $(elem2);
                    return $elem1.data('left') + $elem1.data('width')
                        <= $elem2.data('left') + $elem2.data('width');
                },
                equalOrGreaterThan: function (elem1, elem2) {
                    var $elem1 = $(elem1);
                    var $elem2 = $(elem2);
                    return $elem1.data('left') + $elem1.data('width')
                        >= $elem2.data('left') + $elem2.data('width');
                },
                lessThan: function (elem1, elem2) {
                    var $elem1 = $(elem1);
                    var $elem2 = $(elem2);
                    return $elem1.data('left') + $elem1.data('width')
                        < $elem2.data('left') + $elem2.data('width');
                },
                greaterThan: function (elem1, elem2) {
                    var $elem1 = $(elem1);
                    var $elem2 = $(elem2);
                    return $elem1.data('left') + $elem1.data('width')
                        > $elem2.data('left') + $elem2.data('width');
                }
            },
            relationshipTable: {},
            relationshipBox: $('<div></div>'),
            relationshipCanvas: null,

        //options
            options: {
                cssClass: {
                    milestone: 'GanttMilestone',
                    ganttStream: 'GanttStream',
                    ganttStreamHighlight: 'GanttStreamHighlight',
                    timelineDrawingBtn: 'GanttTimelineDrawingBtn',
                    timelineDrawingBtnDisabled: 'GanttTimelineDrawingBtnDisabled',
                    timelineDrawingHelper: 'GanttTimelineDrawingHelper',
                    timeline: 'GanttTimelineBar',
                    timelineGroup: 'GanttTimelineGroup',
                    timelineWrapper: 'GanttTimelineWrapper',
                    timelineHelper: 'GanttTimelineBarHelper',
                    timelineSelected: 'GantTimelineBarSelected',
                    timelineDragging: 'GantTimelineBarDragging',
                    timelineOverlays: 'GanttTimelineOverlays',
                    timelineHighlight: 'GanttTimelineHighlight',
                    relationshipBox: 'GanttTimelineRelationshipBox',
                    relationshipBoxArrow: 'GanttTimelineRelationshipBoxArrow',
                    relationshipBoxArrowT: 'GanttTimelineRelationshipBoxArrowT',
                    relationshipBoxArrowB: 'GanttTimelineRelationshipBoxArrowB',
                    relationshipBoxArrowR: 'GanttTimelineRelationshipBoxArrowR',
                    relationshipBoxArrowL: 'GanttTimelineRelationshipBoxArrowL',
                    relationshipBoxTL: 'GanttTimelineRelationshipBoxTL',
                    relationshipBoxTR: 'GanttTimelineRelationshipBoxTR',
                    relationshipBoxBL: 'GanttTimelineRelationshipBoxBL',
                    relationshipBoxBR: 'GanttTimelineRelationshipBoxBR',
                    relationshipBoxL: 'GanttTimelineRelationshipBoxL',
                    relationshipBoxR: 'GanttTimelineRelationshipBoxR',
                    relationshipBoxB: 'GanttTimelineRelationshipBoxB',
                    relationshipBoxT: 'GanttTimelineRelationshipBoxT',
                    relationshipBoxPersistent: 'GanttTimelineRelationshipBoxPersistent',
                    relationshipBoxPersistentHorz: 'GanttTimelineRelationshipBoxPersistentHorz',
                    relationshipBoxPersistentVert: 'GanttTimelineRelationshipBoxPersistentVert',
                    startCreateRelationship: 'StartCreateRelationship',
                    uiSelecting: 'ui-selecting', //depends on jquery selectable
                    uiSelected: 'ui-selected', //depends on jquery selectable
                    buttonPending: 'Pending'
                },
                RELATIONSHIP_TYPE: {
                    SF: 'SF',
                    SS: 'SS',
                    FF: 'FF',
                    FS: 'FS'
                },
                listID: null,
                outer: $('#ganttApp'), //required
                streamList: $('#streamList'), //required
                streamBaseIndex: 0,
                calendarGrid: { //required
                    element: $('#ganttCalendar'), //required
                    container: $('#ganttTimelineContainer'), //required
                    monthRow: $('#ganttCalendarMonthRow'), //required
                    dayRow: $('#ganttCalendarDayRow'), //required
                    clip: $('#gantTimelineClip'), //required
                    syncClip: $('#streamListClip'), //optional
                    content: $('#ganttTimelineList'), //required
                    unitSize: 30, //optional
                    startTime: new Date('Dec 1, 2012 00:00:00'), //required
                    endTime: new Date('Jan 31, 2013 23:59:59') //required
                },
                fakeScroll: $('#ganttCalendarFakeScroll'), //required
                timelineConfig: { //optional
                    gridModel: {
                        unitSize: 15,
                        leftEdge: 0
                    }
                },
                toolbar: [
                    { //add timeline
                        buttons: $('#addGanttTimelineTrigger'),
                        event: 'click',
                        method: 'addTimeline',
                        params: [{}, true]
                    },
                    { //add milestone
                        buttons: $('#addGanttMilestoneTrigger'),
                        event: 'click',
                        method: 'addMilestone',
                        params: [{}, true]
                    },
                    { //toggle draw timeline
                        buttons: $('#drawTimelineTrigger, #drawMilestoneTrigger'),
                        event: 'click',
                        method: 'toggleDrawingTimeline',
                        params: []
                    }
                ],
                timelineConfig: {
                    boundaryMode: false,
                    gridModel: {
                        unitSize: 1,
                        leftEdge: 0
                    }
                }
            },

        //constructor
            _create: function () {
                //create calendar
                this._createCalendar();

                //create toolbar
                this._createToolbar();

                //create stream
                this._createStream();

                //set timeline option
                this._configTimeline();

                //create sync scroll
                this._createSyncScroll();

                this._beforeRender(false); //false -> isReload
            },

        //destructor
            _destroy: function () {},

        //reset
            _setExtraSpacing: function () {
                var extraSpacing = this.options.calendarGrid.clip.height();
                this.options.streamList.css({
                    paddingBottom: extraSpacing
                });
                this.options.calendarGrid.content.css({
                    paddingBottom: extraSpacing
                });
            },
            _reset: function () {
                //reset private member
                this.disabledDrawingTimeline = true;
                this.onDragging = false;
                this.scrollTimer = null;
                this.selectedTimeline = {
                    list: [],
                    sortAscLeft: [],
                    sortDescRight: []
                }
                this.timelineGroup = [];
                this.timelineGroupStatus = {
                    freezingLeft: false,
                    freezingRight: false
                }
                this.relationshipTable = {};

                //reset stream list
                this.options.streamList.stream('reset');

                //reset timeline list
                this.options.calendarGrid.element.calendar('destroy');
                //create calendar
                this._createCalendar(Zenwork.Planner.Config.calendarGrid);
                //re-create relationship helper
                this.options.calendarGrid.clip.append(this.relationshipBox.addClass(this.options.cssClass.relationshipBox+' Hidden'));

                this._setExtraSpacing();

                //close all popup, context
                Zenwork.Popup.close();
                Zenwork.StreamPopup.close();

                this._beforeRender(true); //true -> isReload
            },

        //public method
            /**
             * @use: add new timeline to calendar list
             */
            addTimeline: function (config, isAjax, callback, e) {
                var opts = this.options;
                this._addTimeline(config, isAjax, function (e, uuid, stream) {
                    if ( callback !== undefined ) { callback(e, uuid, stream); }
                }, e);
            },
            /**
             * @use: add new milestone to calendar list
             */
            addMilestone: function (config, isAjax, callback, e) {
                this._addMilestone(config, isAjax, function (e) {
                    if ( callback !== undefined ) { callback(e); }
                }, e);
            },

            /**
             * @use: add new timeline bar
             */
            addStreamTimelineBar: function (stream, timelineConfig, type, isAjax, callback, e) {
                this._addStreamTimelineHelper(stream, timelineConfig, type, isAjax, callback, e);
            },

            addTimelinePlaceholder: function (insertIndex, isAjax) {
                var opts = this.options;
                var _helper = this._getDefaultTimelineHelper();
                var timelineWrapper = $('<li class="'+opts.cssClass.timelineWrapper+' DrawingPending"></li>').data('uuid', Core.Algorithm.UUID());
                var timelineBar = this._preAddingTimelineHelper(
                    insertIndex,
                    timelineWrapper,
                    isAjax,
                    {
                        left: _helper.defaultTimelinePos.left,
                        width: _helper.defaultTimelinePos.width,
                        start: _helper.defaultTimeline.start,
                        end: _helper.defaultTimeline.end,
                        completed: 0
                    }
                );

                return {
                    timelineWrapper: timelineWrapper,
                    timelineBar: timelineBar,
                    Timeline: [
                        {
                            start: _helper.defaultTimeline.start,
                            end: _helper.defaultTimeline.end,
                            completed: 0
                        }    
                    ]
                }
            },

            clearRelationship: function (fromElem, toElem) {
                this._clearRelationship(fromElem, toElem);
            },

            clearDocument: function (callback, e) {
                this.options.streamList.stream('deleteAllStreams', function (isSuccess) {
                    if ( callback !== undefined ) { callback(e); }
                });
            },

            /**
             * @use: disable drawing timeline capability when user drag mouse on timeline item in timeline list
             */
            disableDrawingTimeline: function () {
                this._disableDrawingTimeline();
            },
            /**
             * @use: enable drawing timeline capability when user drag mouse on timeline item in timeline list
             */
            enableDrawingTimeline: function () {
                this._enableDrawingTimeline();
            },

            getRelationshipTable: function () {
                return this.relationshipTable;
            },

            markStreamAsCompleted: function (stream) {
                stream.find('>  .'+this.options.cssClass.streamCompletionBtn).addClass(this.options.cssClass.streamCompletedBtn)
            },

            renderRelationship: function (relationshipData) {
                var self = this;
                $.each(relationshipData, function () {
                    var data = this['Timeline_dependancy'];
                    var startTimeline = $('#'+self.PREFIX.TIMELINE_BAR+data.tID1);
                    var endTimeline = $('#'+self.PREFIX.TIMELINE_BAR+data.tID2);

                    //ignore & continue if one timeline in relationship missing
                    if ( startTimeline.length == 0 || endTimeline.length == 0 ) { return true; } 

                    //render relationship line
                    var renderedRel = self._drawRelationshipLine(startTimeline, endTimeline, data.rel);
                    renderedRel.arrow.data('id', data.id);
                    //then store rendered relationship
                    self._storeRelationship(renderedRel, startTimeline, endTimeline, data.rel);
                    //update relationship table
                    var cTID1 = self.PREFIX.TIMELINE_BAR + data.tID1;
                    var cTID2 = self.PREFIX.TIMELINE_BAR + data.tID2;
                    if ( !(cTID1 in self.relationshipTable) ) {
                        self.relationshipTable[cTID1] = [];
                    }
                    self.relationshipTable[cTID1].push(cTID2);
                });
            },
            
            resetApp: function () {
                this._reset();
            },

            /**
             * callback after DOM rendered
             */
            rendered: function (callback) {
                var opts = this.options;
                this._setExtraSpacing();
                opts.calendarApi.calendar('ajustCalendarSize', 'y');
                opts.fakeScroll.syncscroll('update');
            },

            toggleDrawingTimeline: function (callback, e) {
                this._toggleDrawingTimeline(callback, e);
            },

            viewStream: function (sid) {
                this.options.streamList.stream('viewDetails', sid, this.options.fakeScroll);
            },

        //private method
            /*
             * when a new stream added, following maybe some unsaved 'timeline bar' which already put in a waiting queue
             * proceed saving those timeline bar by calling '_proceedTimelineQueue'
             */
            _proceedTimelineQueue: function (timelineWrapper) {
                var uuid = timelineWrapper.data('uuid');
                var self = this;
                if ( this.queue[uuid] !== undefined ) {
                    $.each(this.queue[uuid], function (index, queueItem) {
                        self._postDrawingTimelineData(timelineWrapper, queueItem.helper, queueItem.data);
                    });
                    delete self.queue[uuid];
                }
            },
            _addStreamHelper: function (type, config, isAjax, callback, e) {
                var self = this;
                var opts = this.options;
                var element = this.element;
                var isAjax = isAjax || false;
                var _helper = this._getDefaultTimelineHelper();
                var defaultTimeline = opts.calendarApi.calendar('getDayValue', _helper.defaultTimelinePos.left, _helper.defaultTimelinePos.width);
                var config = $.extend(true, {
                    Stream: {
                        parentID: 0,
                        listID: opts.listID, //project id
                        streamExtendModel: type == 'timeline' ? 'Task' : 'Deliverable',
                        timelinePrefix: this.PREFIX.TIMELINE_ITEM
                    },
                    Timeline: [
                        {
                            left: _helper.defaultTimelinePos.left,
                            width: _helper.defaultTimelinePos.width,
                            start: _helper.defaultTimeline.start,
                            end: _helper.defaultTimeline.end,
                            completed: 0
                        }
                    ]
                }, config);

                //start add stream
                var timelineWrapper = $('<li class="'+opts.cssClass.timelineWrapper+' DrawingPending"></li>').data('uuid', Core.Algorithm.UUID());
                var timelineHelper;
                opts.streamList.stream('addNewStream',
                    config.Stream,
                    isAjax,
                    function (insertIndex) { //before post data
                        timelineHelper = self._preAddingTimelineHelper(insertIndex, timelineWrapper, isAjax, config.Timeline[0]);
                    },
                    function (stream, streamFinalCallback) { //after stream created
                        self._addStreamTimelineHelper(
                            timelineWrapper,
                            stream,
                            config.Timeline,
                            type,
                            isAjax,
                            function () {
                                if ( streamFinalCallback !== undefined ) { streamFinalCallback(); }
                                timelineHelper.remove();
                                timelineWrapper.removeClass('DrawingPending');
                                self._proceedTimelineQueue(timelineWrapper);
                                if ( callback !== undefined ) { callback(e); }
                            },
                            e
                        );
                    }
                );
            },
            _addStreamTimelineHelper: function (timelineWrapper, stream, timelineConfig, type, isAjax, callback, e) {
                var self = this;
                var opts = this.options;
                var element = this.element;
                var sid = stream.data('clientID');
                var tid = self.PREFIX.TIMELINE_ITEM + stream.data('id');

                var parentTimelineID;
                if ( stream.data('parentID') != 0 ) {
                    var parentStream = $('#'+stream.data('parentClientID'));
                    //get parent timeline bar, first timeline bar
                    parentTimeline = $('#'+self.PREFIX.TIMELINE_ITEM+parentStream.data('id')+' > .'+opts.cssClass.ganttStream).eq(0);
                    //do it once time only if parent timeline has more than 1 child
                    if ( !parentTimeline.hasClass(opts.cssClass.timelineGroup) ) {
                        parentTimeline
                            .addClass(opts.cssClass.timelineGroup)
                            .timeline('disableMoving')
                            .timeline('disableResizing');
                    }
                    parentTimelineID = parentTimeline.data('id');
                }
                //timeline wrapper has id(without prefix) as same as stream id(without prefix)
                timelineWrapper.attr({
                    id: tid,
                    rel: '#'+sid
                });
                //timeline bar has its own id
                var _util_ = function () { //final callback
                    if ( isAjax ) { 
                        Zenwork.Notifier.notify('Saved', 1);
                        opts.calendarApi.calendar('ajustCalendarSize', 'y');
                        opts.fakeScroll.syncscroll('update');
                    }

                    //callback
                    if ( callback !== undefined ) { callback(e); }
                }
                if ( timelineConfig.length === 0 ) {
                    _util_();
                }
                else {
                    $.each(timelineConfig, function (index, timelineData) {
                        var postData = $.extend(true, {
                            completed: 0,
                            sid: stream.data('id')
                        }, timelineData);
                        //post ajax to add new timeline bar

                        self._addTimelineBar(postData, isAjax, function (data) {
                            var timelineBar = type == 'timeline'
                                ? $('<div id="'+self.PREFIX.TIMELINE_BAR+data.id+'" class="'+opts.cssClass.ganttStream+' '+opts.cssClass.timeline+'"></div>')
                                : $('<div id="'+self.PREFIX.MILESTONE+data.id+'" class="'+opts.cssClass.ganttStream+' '+opts.cssClass.milestone+'"></div>');
                            timelineWrapper.append(timelineBar);
                            
                            //set data to timeline bar
                            timelineBar.data(data);

                            var isStreamCreator = String(stream.data('creatorID')) === Zenwork.Auth.User.id;
                            if ( type == 'timeline' ) {
                                var timelineWidth = (self.gridUnitSize*2)*(new Date(data.start*1000)).diff(new Date(data.end*1000), 'day');
                                self._createResizableTimeline(
                                    timelineBar,
                                    $.extend(true, {}, opts.timelineConfig, {
                                        id: data.id,
                                        clientID: self.PREFIX.TIMELINE_BAR+data.id,
                                        left: opts.calendarApi.calendar('getDayPosition', new Date(data.start*1000)),
                                        width: timelineWidth,
                                        isCompleted: data.completed,
                                        disabledResizing: false,
                                        isStreamCreator: isStreamCreator
                                    })
                                );
                            }
                            else { //milestone
                                self._createMilestone(
                                    timelineBar,
                                    $.extend(true, opts.timelineConfig, {
                                        id: data.id,
                                        clientID: self.PREFIX.MILESTONE+data.id,
                                        left: opts.calendarApi.calendar('getDayPosition', new Date(data.start*1000)) - Math.round(self.gridUnitSize/2),
                                        width: self.gridUnitSize,
                                        isCompleted: data.completed,
                                        disabledResizing: false,
                                        isStreamCreator: isStreamCreator
                                    })
                                );
                            }

                            //set parent id for timeline bar
                            if ( parentTimelineID != undefined ) {
                                timelineBar.data({
                                    parentID: parentTimelineID,
                                    parentClientID: self.PREFIX.TIMELINE_BAR+parentTimelineID
                                });
                            }
                            else {
                                timelineBar.data({
                                    parentID: 0,
                                    parentClientID: 0
                                });
                            }

                            if ( index == timelineConfig.length-1 ) { //final callback
                                _util_();
                            }
                        });
                    });
                }
            },
            _preAddingTimelineHelper: function (insertIndex, timelineWrapper, isAjax, config) {
                var opts = this.options;
                var element = this.element;
                var timelineList = element.find('.'+opts.cssClass.timelineWrapper);
                if ( insertIndex === undefined ) { //append at bottom
                    element.append(timelineWrapper);
                }
                else { //insert between list
                    //-1 get prev item, -1 get array index
                    timelineList.eq(insertIndex-1-1).after(timelineWrapper);
                }
                if ( config.left !== undefined
                    && config.width !== undefined
                ) { //add timeline bar(just for placeholder remove later)
                    var helper = $('<div class="'+opts.cssClass.timelineDrawingHelper+'"></div>');
                    helper.css({
                        left: config.left,
                        width: config.width
                    }).appendTo(timelineWrapper);
                    delete config.left;
                    delete config.width;
                }
                return helper;
            },

            /**
             * if ajax adding, add to db then return 'id' and 'callback'
             * if local adding(rendering), callback immediately with 'postData'
             */
            _addTimelineBar: function (postData, isAjax, callback) {
                var opts = this.options;
                var self = this;
                if ( isAjax ) {
                    $.ajax({
                        type: 'POST',
                        url: Zenwork.Planner.Config.baseURL+'/addNewTimeline',
                        dataType: 'json',
                        contentType: 'json',
                        data: JSON.stringify(postData),
                        success: function (data, textStatus, jqXHR) {
                            if ( data ) {
                                callback(data);
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            if ( textStatus !== 'abort' ) {
                                alert('Really sorry for this, network error! Please try again!');
                            }
                        }
                    });
                }
                else {
                    callback(postData);
                }
            },

            /**
             * @use: add new timeline to calendar list
             * config = {
             *     Stream = {
             *         parentID //required
             *     }
             *     Timeline = [
             *         {
             *             completed //required
             *         }
             *     ]
             * }
             */
            _addTimeline: function (config, isAjax, callback, e) {
                this._addStreamHelper('timeline', config, isAjax, callback, e);
            },

            /**
             * @use: add new milestone to calendar list
             */
            _addMilestone: function (config, isAjax, callback, e) {
                this._addStreamHelper('milestone', config, isAjax, callback, e);
            },

            /**
             * recursively
             * @use: ajust relationship line after timeline has changed
             * @warning: this function is called recursively if timeline has parent
             */
            _ajustTimelineRelationship: function (timeline) {
                var self = this;
                var opts =this.options;
                //timeline is moved/resized
                var id = timeline.attr('id');
                var connectors;
                //ajust successor
                var successor = self._succ(timeline);
                $.each(successor, function (index, value) {
                    self._ajustRelationshipHelper(
                        timeline.data(id+'&'+value),
                        timeline,
                        $('#'+value)
                    );
                });

                //ajust predecessor
                var predecessor = self._pre(timeline);
                $.each(predecessor, function (index, value) {
                    var startTimeline = $('#'+value);
                    self._ajustRelationshipHelper(
                        startTimeline.data(value+'&'+id),
                        startTimeline,
                        timeline
                    );
                });

                //recursive
                if ( timeline.data('parentID') != 0 ) {
                    this._ajustTimelineRelationship($('#'+timeline.data('parentClientID')));
                }
            },

            /**
             * @use: conventient method for '_ajustTimelineRelationship'
             */
            _ajustRelationshipHelper: function (relationship, startTimeline, endTimeline) {
                //remove the old one
                $.each(relationship.line, function () {
                    $(this).remove();
                });

                //if 'parent-child' -> do not draw new relationship line
                if ( startTimeline.data('parentID') == endTimeline.data('id')
                    || endTimeline.data('parentID') == startTimeline.data('id')    
                ) {
                    this._clearStoreRelationship(startTimeline, endTimeline);
                    return false;
                }

                //draw new relationship line
                var updatedRel = this._drawRelationshipLine(startTimeline, endTimeline, relationship.type);
                //then store new relationship
                this._storeRelationship(updatedRel, startTimeline, endTimeline, relationship.type);
            },

            /**
             * @use: ..
             */
            _ajustIndentedGroupTimeline: function (timelineBar, indentedStream) {
                var self = this;
                var arrLeft = [];
                var arrRight = [];
                if ( timelineBar.hasClass(this.options.cssClass.timelineGroup) ) {
                    var timelineLeft = timelineBar.data('left');
                    arrLeft.push(timelineLeft);
                    arrRight.push(timelineLeft + timelineBar.data('width'));
                }
                else {
                    timelineBar.timeline('disableMoving');
                    timelineBar.timeline('disableResizing');
                }

                var changedTimelineBars = $('#'+this.PREFIX.TIMELINE_ITEM+indentedStream.data('id')+' > .'+this.options.cssClass.ganttStream);
                changedTimelineBars.data('parentID', timelineBar.data('id'))
                if ( this.options.streamList.stream('isLeaf', indentedStream) ) {
                    changedTimelineBars.each(function () { //traverse each bars inside timeline
                        var $this = $(this);
                        var leftRel = $this.data('left');
                        if ( $this.data('uiMilestone') != undefined ) { //is milestone
                            leftRel -= Math.round(self.gridUnitSize/2);
                        }
                        arrLeft.push(leftRel);
                        arrRight.push(leftRel + $this.data('width'));
                    });
                }
                else { //is group timeline, only has 1 bar
                    changedTimelineBars = changedTimelineBars.eq(0);
                    var changedTimelineLeft = changedTimelineBars.data('left');
                    arrLeft.push(changedTimelineLeft);
                    arrRight.push(changedTimelineLeft + changedTimelineBars.data('width'));
                }
                arrLeft.sort(function (a, b) { return a-b; }); //asc
                arrRight.sort(function (a, b) { return b-a; }); //desc
                this._updateTimelineHelper(
                    timelineBar.addClass(this.options.cssClass.timelineGroup),
                    arrLeft[0],
                    arrRight[0] - arrLeft[0],
                    true //add buffer to flush data to server
                );
                var parentStream = $('#'+indentedStream.data('parentClientID'));
                //update parent's parent stream if available
                if ( parentStream.data('parentClientID') != 0 ) {
                    this._ajustGroupTimelineScaled(parentStream);
                }
            },

            /**
             * recursively
             * @use: ajust timeline position and size
             * @warning: this function is called recursively if parentStream has parent
             */
            _ajustGroupTimelineScaled: function (parentStream, /*Boolean*/addBuffer) {
                if ( parentStream.length == 0
                    || this.options.streamList.stream('isLeaf', parentStream)    
                ) { return; }
                var self = this;
                var parentTimeline = $(parentStream.attr('rel')+' > .'+this.options.cssClass.ganttStream).eq(0);
                var parentTimelineID = parentTimeline.data('id');
                var arrLeft = [];
                var arrRight = [];
                $('.'+this.options.cssClass.ganttStream).filter(function () {
                    return $(this).data('parentID') == parentTimelineID;
                }).each(function () { //traverse each bars inside timeline
                    var $this = $(this);
                    var leftRel = $this.data('left');
                    if ( $this.data('uiMilestone') != undefined ) { //is milestone
                        leftRel -= Math.round(self.gridUnitSize/2);
                    }
                    arrLeft.push(leftRel);
                    arrRight.push(leftRel + $this.data('width'));
                });
                arrLeft.sort(function (a, b) { return a-b; }); //asc
                arrRight.sort(function (a, b) { return b-a; }); //desc
                this._updateTimelineHelper(
                    parentTimeline,
                    arrLeft[0],
                    arrRight[0] - arrLeft[0],
                    addBuffer //add buffer to flush data to server
                );

                var recursiveParentID = parentStream.data('parentID');
                if ( recursiveParentID != 0 ) {
                    this._ajustGroupTimelineScaled($('#'+parentStream.data('parentClientID')), addBuffer);
                }
            },

            /**
             * @use:
             * @params:
             *     - axis: optional, value available 'both | x | y', default 'y'
             */
            _appResizedCallback: function (axis) {
                axis = axis || 'both';
                var opts = this.options;
                
                opts.calendarApi.calendar('ajustCalendarSize', axis);
                
                //resize on y-axis
                if ( axis === 'both' || axis === 'y' ) {
                    this._setExtraSpacing();
                }

                //resize on x-axis
                if ( axis === 'both' || axis === 'x' ) {}

                this.containerBoxModel = $.extend({}, $.getBoxPosition(opts.calendarGrid.container), $.getBoxModel(opts.calendarGrid.container));
                this.clipBoxModel = $.extend({}, $.getBoxPosition(opts.calendarGrid.clip), $.getBoxModel(opts.calendarGrid.clip));

                opts.fakeScroll.syncscroll('update');
            },

            /**
             * @use: preparing last step before showing app
             * - set app width/height
             * - preparing overlays
             * - _initDrawingTimeline
             * - init selectable timeline bar
             * - window resize event
             */
            _beforeRender: function (isReload) {
                var self = this;
                var opts = this.options;
                var $window = $(window);

                //create highlight overlays when moving/resizing timeline/milestone
                if ( !isReload ) { //fire on first time load page only
                    this.highlightOverlays = $('<div class="'+opts.cssClass.timelineOverlays+' Hidden"></div>');
                }
                this.highlightOverlays.appendTo(opts.calendarGrid.clip);
                this.highlightOverlaysBoxModel = $.getBoxModel(this.highlightOverlays);

                //binding events
                if ( !isReload ) { //fire on first time load page only
                    this.containerBoxModel = $.extend({}, $.getBoxPosition(opts.calendarGrid.container), $.getBoxModel(opts.calendarGrid.container));
                    this.clipBoxModel = $.extend({}, $.getBoxPosition(opts.calendarGrid.clip), $.getBoxModel(opts.calendarGrid.clip));

                    var edgeSize = 30;
                    opts.calendarGrid.clip.bind('mousemove', function (e) {
                        self._handleScrollOnEdge(e, edgeSize);
                    });

                    //init drawing timeline
                    this._initDrawingTimeline();

                    //create selectable timeline bars
                    var onSelecting = false;
                    var onDraggingCalendar = false;
                    var x;
                    var y;
                    var mouseTimer;
                    opts.calendarGrid.clip.selectable({
                        filter: '.'+opts.cssClass.ganttStream+':not(.'+opts.cssClass.timelineGroup+'):not(.Disabled)',
                        delay: 50,
                        selected: function (e, ui) {
                            self.timelineGroup.push(ui.selected);
                        },
                        start: function () {
                            opts.fakeScroll.addClass('Hidden');
                            onSelecting = true;
                        },
                        stop: function () {
                            opts.fakeScroll.syncscroll('show');
                            onSelecting = false;
                        }
                    });
                    opts.calendarGrid.clip.on('mousedown', function (e) {
                        mouseTimer = setTimeout(function () {
                            opts.calendarGrid.clip.selectable('enable');
                            onDraggingCalendar = false;
                        }, 100);
                        opts.calendarGrid.clip.selectable('disable');
                        onDraggingCalendar = true;
                        x = e.pageX;
                        y = e.pageY;
                        Zenwork.StreamPopup.close();
                        self._clearTimelineGroup();
                        return false;
                    });
                    opts.calendarGrid.clip.on('mouseup', function (e) {
                        opts.calendarGrid.clip.css({
                            cursor: 'default'
                        });
                        opts.calendarGrid.clip.selectable('enable');
                        onDraggingCalendar = false;
                        x = e.pageX;
                        y = e.pageY;
                    });
                    opts.calendarGrid.clip.on('mousemove', function (e) {
                        if ( onSelecting ) {
                            opts.fakeScroll.addClass('Hidden');
                        }
                        if ( onDraggingCalendar ) {
                            if ( mouseTimer !== undefined ) { clearTimeout(mouseTimer); }
                            opts.calendarGrid.clip.css({
                                cursor: 'url(widgets/planner/images/cursor-close-hand.cur),auto'
                            });
                            var deltaX = e.pageX - x;
                            if ( Math.abs(deltaX) > 10 ) {
                                opts.calendarGrid.container.scrollLeft(opts.calendarGrid.container.scrollLeft()-deltaX);
                                x = e.pageX;
                            }

                            var deltaY = e.pageY - y;
                            if ( Math.abs(deltaY) > 10 ) {
                                opts.fakeScroll.scrollTop(opts.fakeScroll.scrollTop()-deltaY);
                                y = e.pageY;
                            }
                        }
                    });

                    //bind click event to timeline wrapper: select row
                    opts.calendarGrid.clip.on('click', '.'+opts.cssClass.timelineWrapper, function (e) {
                        var $target = $(e.currentTarget);
                        if ( $target.hasClass(opts.cssClass.timelineHighlight) ) { return false; }
                        $target.addClass(opts.cssClass.timelineHighlight);
                        opts.streamList.stream('selectStream', e, $($target.attr('rel')));
                        return false;
                    });

                    //bind resize event
                    $window.on('resize', function (e) {
                        self._appResizedCallback();
                    });
                }
            },

            /**
             * @use: ..
             * contains timeline event:
             *     - cancel
             *     - start
             *     - stop
             *     - moved
             *     - resized
             *     - moving
             *     - resizing
             *     - completed
             *     - uncompleted
             *     - deleted
             */
            _configTimeline: function () {
                var self = this;
                var opts = this.options;
                var element = this.element;
                var timelineDrawingBtn = $('.'+opts.cssClass.timelineDrawingBtn);
                var _util_ = {
                    addMoreCalendarColumns: function (timeline) {
                        var data = timeline.data();

                        var offsetLeft = Math.round(data.left/(opts.calendarGrid.unitSize*2));
                        if ( offsetLeft <= 0 ) {
                            //add more columns before
                            opts.calendarApi.calendar('addColumn', 'before', 'day', Math.max(offsetLeft, 10));

                            //move all timeline +Math.max(offsetLeft, 10)*opts.calendarGrid.unitSize*2
                            var _offset_ = Math.max(offsetLeft, 10)*opts.calendarGrid.unitSize*2;
                            element.find('.'+opts.cssClass.timeline)
                                .css({
                                    left: '+='+_offset_
                                })
                                .each(function () {
                                    var $this = $(this);
                                    $this.data({
                                        left: $this.data('left') + _offset_
                                    });
                                });

                            //move all relationship line
                            $('.'+opts.cssClass.relationshipBoxPersistent+', .'+opts.cssClass.relationshipBoxArrow).css({
                                left: '+='+_offset_
                            });
                        }

                        var offsetRight = Math.round((data.left+data.width - element.width())/(opts.calendarGrid.unitSize*2));
                        if ( offsetRight >= 0 ) {
                            //add more columns after
                            opts.calendarApi.calendar('addColumn', 'after', 'day', Math.max(offsetRight, 10));
                        }
                    }
                }

                //create relationship helper
                opts.calendarGrid.clip.append(this.relationshipBox.addClass(opts.cssClass.relationshipBox+' Hidden'));
                this.relationshipCanvas = Raphael(this.relationshipBox.get(0), 1, 1);
                this._handleRelationshipCreation();

                opts.timelineConfig.cancel = function (e, item) {
                    opts.fakeScroll.syncscroll('show');
                    self.highlightOverlays.addClass('Hidden');
                    self.onDragging = false;
                }
                opts.timelineConfig.start = function (e, ui) {
                    Zenwork.Popup.close();
                    Zenwork.Dialog.close();
                    self.disabledDrawingTimeline = true;
                    if ( ui.element.hasClass(opts.cssClass.uiSelected) ) {
                        self.selectedTimeline = $.each(self.timelineGroup, function (index, item) {
                            $(item).addClass(opts.cssClass.timelineSelected);
                        });
                        $(ui.element).removeClass(opts.cssClass.timelineSelected);
                    }
                    else {
                        $('.'+opts.cssClass.timelineSelected).removeClass(opts.cssClass.timelineSelected);
                        self.selectedTimeline = ui.element;
                    }
                    opts.fakeScroll.addClass('Hidden');
                    self.highlightOverlays.removeClass('Hidden')
                        .css({
                            left: ui.element.position().left - Math.round(self.highlightOverlaysBoxModel.borderLeft/2),
                            width: ui.element.width()
                                - self.highlightOverlaysBoxModel.borderLeft
                                - Math.round(self.highlightOverlaysBoxModel.borderRight/2),
                            height: opts.calendarGrid.content.outerHeight()
                        });
                    ui.element.addClass(opts.cssClass.timelineDragging);
                    self.onDragging = true;
                }
                opts.timelineConfig.stop = function (e, ui) {
                    if ( self.scrollTimer != null ) {
                        self._clearInterval(self.scrollTimer);
                    }
                    opts.fakeScroll.syncscroll('show');
                    self.highlightOverlays.addClass('Hidden');
                    self._clearSelectedTimeline();
                    ui.element.remove(opts.cssClass.timelineDragging);
                    self.onDragging = false;
                }
                opts.timelineConfig.moved = function (e, ui) {
                    _util_.addMoreCalendarColumns(ui.element);

                    if ( !timelineDrawingBtn.hasClass(opts.cssClass.timelineDrawingBtnDisabled) ) {
                        self.disabledDrawingTimeline = false;
                    }

                    //update start & end time data
                    if ( self.timelineGroup.length > 0 ) {
                        $.each(self.timelineGroup, function (index, item) {
                            var $item = $(item);
                            var useModel;
                            if ( $item.data('uiTimeline') != undefined ) {
                                useModel = $item.timeline('option', 'useModel');
                            }
                            else if ( $item.data('uiMilestone') != undefined ) {
                                useModel = $item.milestone('option', 'useModel');
                            }
                            //update start & end time data
                            var startTime = self.options.calendarApi.calendar('getDateFromPosition', $item.data('left'))/1000;
                            var endTime = startTime + ($item.data('width')/(self.gridUnitSize*2))*(24*3600);
                            //add data to model buffer
                            Zenwork.Model.addBuffer({
                                id: $item.data('id'),
                                start: startTime,
                                end: endTime - 1 //-1 second to get the end time, eg. 11:59:59
                            }, useModel, Zenwork.Model.CU);

                            //update parent if available
                            var parentID = $item.data('parentID');
                            if ( parentID != 0 ) {
                                var parentStream = $($('#'+$item.data('parentClientID')).parent().attr('rel'));
                                self._ajustGroupTimelineScaled(parentStream);
                            }
                        });
                    }
                    else { //only one timeline bar moved
                        var startTime = self.options.calendarApi.calendar('getDateFromPosition', ui.element.data('left'))/1000;
                        var endTime = startTime + (ui.element.data('width')/(self.gridUnitSize*2))*(24*3600);
                        //add changes to model buffer
                        Zenwork.Model.addBuffer({
                            id: ui.element.data('id'),
                            start: startTime,
                            end: endTime - 1 //-1 second to get the end time, eg. 11:59:59
                        }, ui.element.timeline('option', 'useModel'), Zenwork.Model.CU);

                        //ajust parent timeline position & size
                        var changedStream = $(ui.element.parent().attr('rel'));
                        if ( changedStream.data('parentID') != 0 ) {
                            var parentStream = $('#'+changedStream.data('parentClientID'));
                            self._ajustGroupTimelineScaled(parentStream);
                        }
                    }

                    //re-render relationship
                    if ( self.timelineGroup.length > 0
                        && ui.element.hasClass(opts.cssClass.uiSelected)
                    ) {
                        self._reRenderRelationship(self.timelineGroup);
                    }
                    else {
                        self._ajustTimelineRelationship(ui.element);
                    }

                    //finally, flush data from buffer and send to server
                    Zenwork.Model.flush();
                }
                opts.timelineConfig.resized = function (e, ui) {
                    _util_.addMoreCalendarColumns(ui.element);

                    if ( !timelineDrawingBtn.hasClass(opts.cssClass.timelineDrawingBtnDisabled) ) {
                        self.disabledDrawingTimeline = false;
                    }

                    //update start/end time data
                    if ( self.timelineGroup.length > 0 ) {
                        $.each(self.timelineGroup, function (index, item) {
                            var $item = $(item);
                            var useModel;
                            if ( $item.data('uiTimeline') != undefined ) {
                                useModel = $item.timeline('option', 'useModel');
                            }
                            else if ( $item.data('uiMilestone') != undefined ) {
                                useModel = $item.milestone('option', 'useModel');
                            }
                            //update start & end time data
                            var startTime = self.options.calendarApi.calendar('getDateFromPosition', $item.data('left'))/1000;
                            var endTime = startTime + ($item.data('width')/(self.gridUnitSize*2))*(24*3600);
                            var postData = {};
                            if ( ui.isResizableLeft ) {
                                postData = {
                                    id: $item.data('id'),
                                    start: startTime
                                }
                            }
                            else {
                                postData = {
                                    id: $item.data('id'),
                                    end: endTime - 1 //-1 second to get the end time, eg. 11:59:59
                                }
                            }

                            //add data to model buffer
                            Zenwork.Model.addBuffer(postData, useModel, Zenwork.Model.CU);

                            //update parent if available
                            var parentID = $item.data('parentID');
                            if ( parentID != 0 ) {
                                var parentStream = $($('#'+$item.data('parentClientID')).parent().attr('rel'));
                                self._ajustGroupTimelineScaled(parentStream);
                            }
                        });
                    }
                    else {
                        var startTime = self.options.calendarApi.calendar('getDateFromPosition', ui.element.data('left'))/1000;
                        var endTime = startTime + (ui.element.data('width')/(self.gridUnitSize*2))*(24*3600);
                        var postData = {};
                        if ( ui.isResizableLeft ) {
                            postData = {
                                start: startTime
                            }
                        }
                        else {
                            postData = {
                                end: endTime - 1 //-1 second to get the end time, eg. 11:59:59
                            }
                        }
                        postData.id = ui.element.data('id');

                        //add changes to model buffer
                        Zenwork.Model.addBuffer(postData, ui.element.timeline('option', 'useModel'), Zenwork.Model.CU);

                        //ajust parent timeline
                        var changedStream = $(ui.element.parent().attr('rel'));
                        if ( changedStream.data('parentClientID') != 0 ) {
                            self._ajustGroupTimelineScaled($('#'+changedStream.data('parentClientID')));
                        }
                    }

                    //re-render relationship
                    if ( self.timelineGroup.length > 0
                        && ui.element.hasClass(opts.cssClass.uiSelected)
                    ) {
                        self._reRenderRelationship(self.timelineGroup);
                    }
                    else {
                        self._ajustTimelineRelationship(ui.element);
                    }

                    //finally, flush data from buffer and send to server
                    Zenwork.Model.flush();
                }
                opts.timelineConfig.moving = function (e, ui) {
                    self.highlightOverlays.css({
                        left: '+='+ui.snapMouseDelta
                    });
                    if ( self.timelineGroup.length > 0 ) {
                        self._moveTimelineGroup(
                            self.selectedTimeline,
                            ui.snapMouseDelta,
                            ui.element
                        );
                    }
                }
                opts.timelineConfig.resizing = function (e, ui) {
                    if ( ui.isResizableLeft ) {
                        self.highlightOverlays.css({
                            left: '+='+ui.snapMouseDelta,
                            width: '+='+(-ui.snapMouseDelta)
                        });
                        $('.'+opts.cssClass.timelineSelected).each(function () {
                            var elem = $(this);
                            if ( elem.timeline('resize', -ui.snapMouseDelta) ) {
                                elem.timeline('move', ui.snapMouseDelta);
                            }
                        });
                    }
                    else {
                        self.highlightOverlays.css({
                            width: '+='+ui.snapMouseDelta
                        });
                        $('.'+opts.cssClass.timelineSelected).each(function () {
                            var elem = $(this);
                            elem.timeline('resize', ui.snapMouseDelta);
                        });
                    }
                }
                opts.timelineConfig.completed = function (e, timelineObj) {
                    var stream = $(timelineObj.parent().attr('rel'));
                    if ( self._isAllTimelineCompleted(timelineObj.parent()) ) {
                        opts.streamList.stream('markStreamAsCompleted', stream);
                    }

                    //children
                    self._markChildrenTimelineAsCompleted(
                        $('.'+opts.cssClass.ganttStream).filter(function () {
                            return $(this).data('parentID') == timelineObj.data('id');
                        })
                    );

                    //parent
                    self._markParentTimelineAsCompleted(stream);

                    //finally, flush data from buffer and send to server
                    Zenwork.Model.flush();
                }
                opts.timelineConfig.uncompleted = function (e, timelineObj) {
                    var stream = $(timelineObj.parent().attr('rel'));
                    opts.streamList.stream('markStreamAsUnCompleted', stream);

                    //children
                    self._markChildrenTimelineAsUnCompleted(
                        $('.'+opts.cssClass.ganttStream).filter(function () {
                            return $(this).data('parentID') == timelineObj.data('id');
                        })
                    );

                    //parent
                    self._markParentTimelineAsUnCompleted(stream);

                    //finally, flush data from buffer and send to server
                    Zenwork.Model.flush();
                }
                opts.timelineConfig.deleted = function (e, timeline) {
                    //console.log('Deleted timeline: '+timeline);
                    self._deleteTimelineCallback(timeline);
                }
                opts.timelineConfig.editTimeline = function (e, timeline) {
                    var startTime = opts.calendarApi.calendar('getDateFromPosition', timeline.data('left'));
                    var endTime = startTime + (timeline.data('width')/(self.gridUnitSize*2))*(24*3600*1000);
                    Zenwork.TimelineDialog.updateTimelineDialog(startTime, endTime, timeline);
                }
                opts.timelineConfig.updated = function (e, timeline, start, end) {
                    var timelineData = timeline.data();
                    var starInUnixSecond = start.valueOf()/1000;
                    var endInUnixSecond = end.valueOf()/1000;
                    var left = opts.calendarApi.calendar('getDayPosition', start);
                    var width = (endInUnixSecond+1-starInUnixSecond)*self.gridUnitSize*2/(24*3600);
                    timeline
                        .data({
                            start: starInUnixSecond,
                            end: endInUnixSecond,
                            left: left,
                            width: width
                        })
                        .css({
                            left: left,
                            width: width
                        });

                    //add more columns if needed
                    _util_.addMoreCalendarColumns(timeline);

                    //add change to model buffer
                    Zenwork.Model.addBuffer({
                        id: timelineData.id,
                        start: starInUnixSecond,
                        end: endInUnixSecond,
                    }, timeline.timeline('option', 'useModel'), Zenwork.Model.CU);

                    //ajust parent timeline position & size
                    var changedStream = $(timeline.parent().attr('rel'));
                    if ( changedStream.data('parentID') != 0 ) {
                        var parentStream = $('#'+changedStream.data('parentClientID'));
                        self._ajustGroupTimelineScaled(parentStream);
                    }

                    //re-render relationship
                    self._ajustTimelineRelationship(timeline);

                    //flush data from buffer
                    Zenwork.Model.flush();
                }
            },

            /**
             * @use: create stream list control
             */
            _createStream: function () {
                var self = this;
                var opts = this.options;
                opts.streamList.stream({ //init stream widget
                    //options
                    baseIndex: opts.streamBaseIndex,

                    //event callback
                    add: function (e, stream, config, callback) {
                        var _util_ = function () {
                            self._proceedTimelineQueue($(stream.attr('rel')));

                            config.timelineBar.remove();
                            config.timelineWrapper.removeClass('DrawingPending');

                            //update parent stream timeline, recursively
                            if ( stream.data('parentID') != 0 ) {
                                self._ajustGroupTimelineScaled($('#'+stream.data('parentClientID')));
                            }
                            //restructure
                            self._restructureCallback(stream.data('index')-1);

                            if ( callback !== undefined ) { callback(e); };
                        }
                        //add timeline
                        self._addStreamTimelineHelper(
                            config.timelineWrapper,
                            stream, //newly created stream
                            config.Timeline, 
                            'timeline', //type 'timeline' | 'milestone'
                            true, //isAjax post
                            _util_, //callback
                            e
                        );
                    },
                    completed: function (e, stream) {
                        self._completedStreamCallback(stream);
                    },
                    uncompleted: function (e, stream) {
                        self._uncompletedStreamCallback(stream);
                    },
                    deleted: function (e, stream, local) {
                        self._deleteStreamCallback(e, stream, local);
                    },
                    deletedAll: function (e, stream) {
                        self.element.empty();
                        $('.'+opts.cssClass.relationshipBoxPersistent).remove();
                        $('.'+opts.cssClass.relationshipBoxArrow).remove();
                        self.relationshipTable = {};
                        opts.fakeScroll.syncscroll('update');
                    },
                    selecting: function (e, stream) {
                        $(stream).each(function () {
                            $($(this).attr('rel')).addClass(opts.cssClass.timelineHighlight);
                        });
                    },
                    selected: function (e, stream) {
                        $(stream).each(function () {
                            $($(this).attr('rel')).addClass(opts.cssClass.timelineHighlight);
                        });
                    },
                    unselecting: function (e, stream) {
                        $(stream).each(function () {
                            $($(this).attr('rel')).removeClass(opts.cssClass.timelineHighlight);
                        });
                    },
                    unselected: function (e, stream) {
                        $(stream).each(function () {
                            $($(this).attr('rel')).removeClass(opts.cssClass.timelineHighlight);
                        });
                    },
                    collapsed: function (e, stream) {
                        opts.streamList.stream('getChildren', stream).each(function () {
                            var stream = $(this);
                            $(stream.attr('rel')).addClass('Hidden');
                        });
                        self._restructureCallback(stream.data('index')-opts.streamBaseIndex);
                    },
                    expanded: function (e, stream) {
                        opts.streamList.stream('getChildren', stream).filter(':visible').each(function () {
                            var stream = $(this);
                            $(stream.attr('rel')).removeClass('Hidden');
                        });
                        self._restructureCallback(stream.data('index')-opts.streamBaseIndex);
                    },
                    collapsedAll: function (e) {
                        var rootElement = $([]);
                        var hideRelIDs = [];
                        $('.'+opts.cssClass.timeline).filter(function () {
                            var $this = $(this);
                            var $thisData = $this.data();
                            if ( $this.data('parentID') != 0 ) {
                                if ( self.relationshipTable[$thisData.clientID] !== undefined ) {
                                    $.each(self.relationshipTable[$thisData.clientID], function (index, value) {
                                        hideRelIDs.push($thisData.clientID+'&'+value);
                                    });
                                }
                                return $this;
                            }
                            else {
                                rootElement = rootElement.add($this);
                            }
                        }).parent().addClass('Hidden');
                        $.each(hideRelIDs, function (index, value) {
                            $('[data-relationship="'+value+'"]').addClass('Hidden');
                        });
                        //re-render relationship on root elements
                        self._reRenderRelationship(rootElement);
                        opts.calendarApi.calendar('ajustCalendarSize', 'y');
                        opts.fakeScroll.syncscroll('update');
                    },
                    expandedAll: function (e) {
                        var rootElement = $([]);
                        $('.'+opts.cssClass.timeline).filter(function () {
                            var $this = $(this);
                            if ( $this.data('parentID') != 0 ) {
                                return $this;
                            }
                            else {
                                rootElement = rootElement.add($this);
                            }
                        }).parent().removeClass('Hidden');
                        $('.'+opts.cssClass.relationshipBoxArrow).removeClass('Hidden');
                        $('.'+opts.cssClass.relationshipBoxPersistent).removeClass('Hidden');
                        //re-render relationship on root elements
                        self._reRenderRelationship(rootElement);
                        opts.calendarApi.calendar('ajustCalendarSize', 'y');
                        opts.fakeScroll.syncscroll('update');
                    },
                    indented: function (e, stream) {
                        var parentStream = $('#'+stream.data('parentClientID'));
                        var tbs = $(parentStream.attr('rel') + ' .'+opts.cssClass.ganttStream);
                        if ( tbs.length > 1 && !tbs.hasClass(opts.cssClass.timelineGroup) ) {
                            //remove others timeline bar of parent, keep 1st timeline bar
                            tbs.filter(':gt(0)').each(function () {
                                var $this = $(this);
                                self._deleteTimelineRelationship($this, true/*= noFlush*/);

                                var useModel;
                                if ( $this.data('uiTimeline') !== undefined ) {
                                    useModel = $this.timeline('option', 'useModel');
                                }
                                else if ( $this.data('uiMilestone') !== undefined ) {
                                    useModel = $this.milestone('option', 'useModel');
                                }

                                //add buffer data
                                Zenwork.Model.addBuffer({
                                    id: $this.data('id')
                                }, useModel, Zenwork.Model.D);

                                $this.remove();
                            });
                        }

                        //update indented bar parentID
                        var indentedTbs = self._getTimelineBar(stream.attr('rel'));
                        indentedTbs.each(function () {
                            var $this = $(this);
                            var fromElemClientId = tbs.eq(0).data('clientID');
                            var toElemClientId = $this.data('clientID');
                            if ( self.relationshipTable[fromElemClientId] !== undefined && self.relationshipTable[fromElemClientId].indexOf(toElemClientId) > -1 ) {
                                self._clearRelationship(tbs.eq(0), $this);
                            }
                            else if ( self.relationshipTable[toElemClientId] !== undefined && self.relationshipTable[toElemClientId].indexOf(fromElemClientId) > -1 ) {
                                self._clearRelationship($this, tbs.eq(0));
                            }
                        });
                        self._ajustIndentedGroupTimeline(tbs.eq(0), stream);

                        var parentTimelineID = tbs.data('id');
                        indentedTbs.data({
                            parentID: parentTimelineID,
                            parentClientID: self.PREFIX.TIMELINE_BAR+parentTimelineID
                        });

                        //expand parent if collapsed
                        if ( !opts.streamList.stream('isExpanded', parentStream) ) {
                            opts.streamList.stream('toggleStreamView', e, parentStream);
                        }

                        self._ajustTimelineRelationship(tbs.eq(0));
                    },
                    outdented: function (e, stream, oldParentStream, oldIndex, newIndex) {
                        //normalize by base index
                        oldIndex -= opts.streamBaseIndex;
                        newIndex -= opts.streamBaseIndex;

                        //move timeline wrapper
                        var itemTimeline = $(stream.attr('rel'));
                        $(opts.streamList.stream('getStreamAtIndex', newIndex-1).attr('rel')).after(itemTimeline);

                        //update timeline bars parentID & parentClientID
                        var newParentID = stream.data('parentID');
                        var newParentClientID = stream.data('parentClientID');
                        var newTimelineParentID = newParentID == 0
                            ? 0
                            : self._getTimelineBar($('#'+newParentClientID).attr('rel')).eq(0).data('id');
                        var newTimelineParentClientID = self.PREFIX.TIMELINE_BAR+newTimelineParentID;
                        $(self._getTimelineBar(stream.attr('rel'))).data({
                            'parentID': newTimelineParentID,
                            'parentClientID': newTimelineParentClientID
                        });

                        //reorder children timeline
                        self._reorderChilrenTimeline(stream, itemTimeline);

                        //update old parent timeline
                        if ( opts.streamList.stream('isLeaf', oldParentStream) ) {
                            self._timelineGroupToLeaf(oldParentStream);
                        }
                        else {
                            self._ajustGroupTimelineScaled(oldParentStream, true/*add buffer*/);
                        }

                        //restructure callback, update timeline related things
                        self._restructureCallback(oldIndex, newIndex);
                    },
                    singleCompleted: function (e, stream) {
                        self._singleStreamCompletedCallback(stream);
                    },
                    singleUnCompleted: function (e, stream) {
                        self._singleStreamUnCompletedCallback(stream);
                    },
                    sorting: function (e, stream, oldIndex, newIndex, oldParentStreamID, newParentStreamID, oldParentStream) {
                        //normalize by base index
                        oldIndex -= opts.streamBaseIndex;
                        newIndex -= opts.streamBaseIndex;

                        var childrenLength = 0;
                        //moving timeline wrapper
                        if ( oldIndex !== newIndex ) {
                            var reorderedTimeline = $(stream.attr('rel'));
                            var childrenStream = opts.streamList.stream('getChildren', stream);
                            childrenLength = childrenStream.length;
                            if ( childrenLength > 0 ) {
                                childrenStream.each(function () {
                                    reorderedTimeline = reorderedTimeline.add(
                                        $($(this).attr('rel'))
                                    );
                                });
                            }
                            if ( newIndex == 1 ) {
                                $('.'+opts.cssClass.timelineWrapper).eq(0).before(reorderedTimeline);
                            }
                            else {
                                var droppedPos = newIndex-1;
                                if ( oldIndex < newIndex ) {
                                    droppedPos += childrenStream.length;
                                    $('.'+opts.cssClass.timelineWrapper).eq(droppedPos).after(reorderedTimeline);
                                }
                                else { //oldIndex > newIndex, no case which oldIndex == newIndex
                                    $('.'+opts.cssClass.timelineWrapper).eq(droppedPos).before(reorderedTimeline);
                                }
                            }
                        }

                        if ( oldParentStreamID !== newParentStreamID ) {
                            //update timeline bars parentID & parentClientID
                            var newTimelineParentID = 0;
                            if ( newParentStreamID != 0 ) {
                                newTimelineParentID = self._getTimelineBar(
                                    $('#'+stream.data('parentClientID')).attr('rel')
                                ).eq(0).data('id');
                            }
                            $(self._getTimelineBar(stream.attr('rel'))).data({
                                'parentID': newTimelineParentID,
                                'parentClientID': self.PREFIX.TIMELINE_BAR+newTimelineParentID
                            });

                            //update old parent timeline
                            if ( oldParentStreamID != 0 ) {
                                if ( opts.streamList.stream('isLeaf', oldParentStream) ) {
                                    self._timelineGroupToLeaf(oldParentStream);
                                }
                                else {
                                    self._ajustGroupTimelineScaled(oldParentStream);
                                }
                                self._ajustTimelineRelationship(self._getTimelineBar(oldParentStream.attr('rel')).eq(0));
                            }

                            //update new parent timeline
                            if ( stream.data('parentID') != 0 ) {
                                self._ajustIndentedGroupTimeline(
                                    self._getTimelineBar($('#'+stream.data('parentClientID')).attr('rel')).eq(0),
                                    stream
                                );
                            }
                        }

                        //restructure callback: update dependancies displaying
                        if ( oldIndex !== newIndex ) {
                            var from = oldIndex-1;
                            var to = newIndex-1;
                            if ( oldIndex > newIndex ) { //upward
                                from += childrenLength;
                            }
                            else { //downward
                                to += childrenLength;
                            }
                            self._restructureCallback(from, to);
                        }
                    },
                    scroll: function (e, offset) {
                        opts.fakeScroll.scrollTop(opts.fakeScroll.scrollTop()-offset);
                    }
                });

                var streamListContainer = opts.streamList.parent();
                streamListContainer.on('mouseenter.stream', function (e) {
                    opts.fakeScroll.syncscroll('show');
                });
                streamListContainer.on('mouseleave.stream', function (e) {
                    opts.fakeScroll.addClass('Hidden');
                });

                //view more/less columns
                $('#streamListCustomFieldsToggle').on('click', function (e) {
                    $(e.currentTarget).toggleClass('StreamListCustomFieldsToggleExpanded');
                    //TODO: expand fields
                    self._appResizedCallback('x');
                    return false;
                });
            },

            /**
             * @use: create app toolbar
             */
            _createToolbar: function () {
                var self = this;
                var _callback_ = function (e) {
                    $(e.currentTarget).removeClass(self.options.cssClass.buttonPending);
                }
                $.each(this.options.toolbar, function () {
                    var data = this;
                    data.button.bind(data.event, function (e) {
                        if ( data.button.hasClass(self.options.cssClass.buttonPending) ) { return false; }
                        data.button.addClass(self.options.cssClass.buttonPending);
                        var params = [_callback_, e];
                        if ( typeof(data.method).toLowerCase() == 'string' ) {
                            if ( data.method == 'addTimeline' ) {
                                data.button.removeClass(self.options.cssClass.buttonPending);
                                params[0] = function () {
                                    _callback_(e);
                                    Zenwork.Planner.pub('firstTaskCreated.Help.Planner', '.StreamDetailsBtn:last', '.StreamContextBtn:last', '.StreamDraggingBtn:last', '.GanttTimelineBar:last');
                                }
                            }
                            self[data.method].apply(self, data.params.concat(params));
                        }
                        else {
                            data.method.apply(self, data.params.concat(params));
                        }
                        return false;
                    });
                });
            },

            /**
             * @use: create sync scroll between stream list and calendar grid
             */
            _createSyncScroll: function () {
                this.options.fakeScroll.syncscroll({
                    container: $('#ganttTimelineContainer'), //required
                    clip: this.options.calendarGrid.clip, //required
                    syncClip: this.options.calendarGrid.syncClip, //optional
                    content: this.options.calendarGrid.content, //required
                    scrollY: function (e) {
                        Zenwork.Popup.close();
                        Zenwork.Dialog.close();
                    }
                });
            },

            /**
             * @use: create calendar grid control
             */
            _createCalendar: function (config) {
                var opts = this.options;
                var calendarOpts = $.extend(true, opts.calendarGrid, config);
                opts.calendarApi = calendarOpts.element.calendar({
                    outer: opts.outer,
                    container: calendarOpts.container, //required
                    monthRow: calendarOpts.monthRow, //required
                    dayRow: calendarOpts.dayRow, //required
                    fakeScroll: opts.fakeScroll, //required
                    clip: calendarOpts.clip, //required
                    syncClip: calendarOpts.syncClip, //optional
                    content: calendarOpts.content, //required
                    unitSize: calendarOpts.unitSize,
                    startTime: calendarOpts.startTime,
                    endTime: calendarOpts.endTime,
                    timeBefore: calendarOpts.timeBefore,
                    timeAfter: calendarOpts.timeAfter,
                    scrollY: function (e, delta) {
                        Zenwork.StreamPopup.close();
                    }
                });
                this.gridUnitSize = calendarOpts.unitSize;
                
                //gantt timeline list
                opts.calendarGrid.clip.on('mouseenter.calendar', function (e) {
                    opts.fakeScroll.syncscroll('show');
                });
                opts.calendarGrid.clip.on('mouseleave.calendar', function (e) {
                    opts.fakeScroll.addClass('Hidden');
                });
                opts.calendarGrid.clip.on('mousedown.calendar', function (e) {
                    Zenwork.Dialog.close();
                });

                return opts.calendarApi;
            },

            /**
             * @use: remove relationship line between 2 timeline bars, also update 'relationshipTable'
             * @params: 
             *    - fromElem: element which rel start
             *    - toElem: element which has arrow end on it
             */
            _clearRelationship: function (fromElem, toElem, local) {
                local = local === undefined ? false : local;
                var fromElemId = fromElem.data('id');
                var toElemId = toElem.data('id');
                var fromElemClientId = fromElem.data('clientID');
                var toElemClientId = toElem.data('clientID');

                this.relationshipTable[fromElemClientId].splice(this.relationshipTable[fromElemClientId].indexOf(toElemClientId), 1);
                this._clearStoreRelationship(fromElem, toElem);
                $.each(fromElem.data(fromElemClientId+'&'+toElemClientId).line, function () {
                    $(this).remove();
                });

                if ( !local ) {
                    //add data to buffer
                    Zenwork.Model.addBuffer({
                        tID1: fromElemId,
                        tID2: toElemId
                    }, 'Timeline_dependancy', Zenwork.Model.D);
                }
            },

            /**
             * @use: clear store relationship in timeline object which store by '_storeRelationship'
             */
            _clearStoreRelationship: function (startTimeline, endTimeline) {
                var startTimelineId = startTimeline.data('clientID');
                var endTimelineId = startTimeline.data('clientID');
                startTimeline.removeData(startTimelineId+'&'+endTimelineId);
                var endTimelineRelationship = endTimeline.data('predecessor');
                if ( endTimelineRelationship == undefined ) { return true; }
                var indexSS = $.inArray(startTimelineId, endTimelineRelationship[this.options.RELATIONSHIP_TYPE.SS]);
                var indexSF = $.inArray(startTimelineId, endTimelineRelationship[this.options.RELATIONSHIP_TYPE.SF]);
                var indexFS = $.inArray(startTimelineId, endTimelineRelationship[this.options.RELATIONSHIP_TYPE.FS]);
                var indexFF = $.inArray(startTimelineId, endTimelineRelationship[this.options.RELATIONSHIP_TYPE.FF]);
                if ( indexSS > -1 ) {
                    endTimelineRelationship[this.options.RELATIONSHIP_TYPE.SS].splice(indexSS, 1);
                    endTimeline.data('predecessor', endTimelineRelationship);
                }
                if ( indexSF > -1 ) {
                    endTimelineRelationship[this.options.RELATIONSHIP_TYPE.SF].splice(indexSF, 1);
                    endTimeline.data('predecessor', endTimelineRelationship);
                }
                if ( indexFS > -1 ) {
                    endTimelineRelationship[this.options.RELATIONSHIP_TYPE.FS].splice(indexFS, 1);
                    endTimeline.data('predecessor', endTimelineRelationship);
                }
                if ( indexFF > -1 ) {
                    endTimelineRelationship[this.options.RELATIONSHIP_TYPE.FF].splice(indexFF, 1);
                    endTimeline.data('predecessor', endTimelineRelationship);
                }
            },

            /**
             * @use: add movable & resizable behavior to timeine DOM
             */
            _createResizableTimeline: function (element, config) {
                //using 'timeline' widget
                return element.timeline(config);
            },

            _createMilestone: function (element, config) {
                //using 'milestone' widget
                return element.milestone(config);
            },

            /**
             * @use: clear current selected timeline(when dragging to select action)
             */
            _clearTimelineGroup: function () {
                this.timelineGroup = [];
                this.element.find('.'+this.options.cssClass.timelineSelected)
                    .removeClass(this.options.cssClass.timelineSelected)
                    .removeClass(this.options.cssClass.uiSelected);
            },

            /**
             * @use: ..
             */
            _clearInterval: function (interval) {
                clearInterval(interval);
                return null;
            },

            /**
             * @use: ..
             */
            _clearSelectedTimeline: function () {
                this.selectedTimeline = [];
            },

            /**
             * @use: calculate the box model then @return {left, top, width, height, cssClass} of relationship box
             * @params:
             *     - startRelPointBoxModel: Object box model
             *     - endRelPointBoxModel: Object box model
             *     - timelineBoxModel: Object box model
             *     - containerModel: Object box model
             * @box model {
             *     leftAbs: float
             *     topAbs: float
             *     leftRel: float
             *     topRel: float
             *     width: float
             *     height: float
             * }
             */
            _calculateRelationshipBox: function (startRelPointBoxModel, endRelPointBoxModel, timelineBoxModel, containerModel) {
                var opts = this.options;
                var left = containerModel.scrollLeft;
                var top = containerModel.scrollTop;
                var width = endRelPointBoxModel.leftAbs - startRelPointBoxModel.leftAbs - startRelPointBoxModel.width/2;
                var height = endRelPointBoxModel.topAbs - startRelPointBoxModel.topAbs - startRelPointBoxModel.height/2;
                //set class
                var className;
                if ( width < 0 && height < 0 ) { //TL
                    className = opts.cssClass.relationshipBoxTL;
                }
                else if ( width > 0 && height < 0 ) { //TR
                    className = opts.cssClass.relationshipBoxTR;
                }
                else if ( width < 0 && height > 0 ) { //BL
                    className = opts.cssClass.relationshipBoxBL;
                }
                else if ( width > 0 && height > 0 ) { //BR
                    className = opts.cssClass.relationshipBoxBR;
                }
                else if ( width == 0 && height > 0 ) { //B
                    className = opts.cssClass.relationshipBoxB;
                }
                else if ( width == 0 && height < 0 ) { //T
                    className = opts.cssClass.relationshipBoxT;
                }
                else if ( width > 0 && height == 0 ) { //R
                    className = opts.cssClass.relationshipBoxR;
                }
                else if ( width < 0 && height == 0 ) { //L
                    className = opts.cssClass.relationshipBoxL;
                }

                left += startRelPointBoxModel.leftRel
                    + timelineBoxModel.leftRel
                    + startRelPointBoxModel.width/2;
                if ( width < 0 ) {
                    left += width;
                }

                top += startRelPointBoxModel.topRel
                    + timelineBoxModel.topRel
                    + startRelPointBoxModel.height/2;
                if ( height < 0 ) {
                    top += height;
                }
                return {
                    left: Math.round(left),
                    top: Math.round(top),
                    width: Math.round(Math.abs(width)),
                    height: Math.round(Math.abs(height)),
                    className: className
                }
            },

            /**
             * @use: when stream completed callback
             */
            _completedStreamCallback: function (completedStream) {
                var opts = this.options;
                var completedTimelineID;
                var completedTimelineGroup = this._getTimelineBar(completedStream.attr('rel')).toArray();
                var childrenStream = this.options.streamList.stream('getChildren', completedStream);
                childrenStream.each(function () {
                    completedTimelineGroup = completedTimelineGroup.concat($($(this).attr('rel')+' .'+opts.cssClass.ganttStream).toArray());
                });

                //mark children timeline as completed
                this._markChildrenTimelineAsCompleted(completedTimelineGroup);
                //mark parent timeline as completed, if available
                this._markParentTimelineAsCompleted(completedStream);
            },
            _markParentTimelineAsCompleted: function (completedStream) {
                //mark parent timeline as completed, if available
                if ( completedStream.data('parentClientID') != 0 ) {
                    var parentStream = $('#'+completedStream.data('parentClientID'));
                    if ( parentStream.data('completed') == 1 ) {
                        this._getTimelineBar(parentStream.attr('rel')).eq(0).timeline('markTimelineAsCompleted');
                    }
                    if ( parentStream.data('parentClientID') != 0 ) { //recursively
                        this._markParentTimelineAsCompleted(parentStream);
                    }
                }
            },
            _markChildrenTimelineAsCompleted: function (timelineGroup) {
                var self = this;
                var opts = this.options;
                $.each(timelineGroup, function (index, item) {
                    item = $(item);
                    if ( item.data('completed') == 1 ) { return; }

                    if ( item.data('uiTimeline') != undefined ) {
                        item.timeline('markTimelineAsCompleted');
                    }
                    else if ( item.data('uiMilestone') != undefined ) {
                        item.milestone('markTimelineAsCompleted');
                    }

                    //if item has children
                    if ( item.hasClass(opts.cssClass.timelineGroup) ) {
                        var tbs = $('.'+opts.cssClass.ganttStream).filter(function () {
                            return $(this).data('parentID') == item.data('id');
                        });
                        self._markChildrenTimelineAsCompleted(tbs);
                    }
                });
            },

            /**
             * @use: ..
             */
            _deleteStreamCallback: function (e, deletedStream, local) {
                local = local === undefined ? false : local;
                var self = this;
                var opts = this.options;
                //1. remove dependancy(if exist)
                var timelineItem = $(deletedStream.attr('rel'));
                var syncArr = [timelineItem];
                opts.streamList.stream('getChildren', deletedStream).each(function () {
                    syncArr.push($($(this).attr('rel')));
                });
                $.each(syncArr, function (index, item) {
                    var timeline = self._getTimelineBar(item); //timeline|milestone
                    timeline.each(function () {
                        var $this = $(this);
                        //check successor
                        var successor = self._succ($this);
                        $.each(successor, function (index, value) {
                            self._clearRelationship($this, $('#'+value), local);
                        });

                        //check predecessor
                        var predecessor = self._pre($this);
                        $.each(predecessor, function (index, value) {
                            self._clearRelationship($('#'+value), $this, local);
                        });
                    });
                });
                //2. remove stream | timeline
                syncArr.push(deletedStream.parent());
                var deletedStreamIndex = deletedStream.data('index');
                var parentStream = $('#'+deletedStream.data('parentClientID'));
                $.sync(
                    syncArr,
                    function (elem, sync) {
                        //elem.fadeOut('medium', function () {
                            elem.remove();
                            sync();
                        //});
                    },
                    function () { //sync callback
                        if ( parentStream.length > 0 ) {
                            //3. if parent stream has no child, make it become leaf
                            if ( opts.streamList.stream('getChildren', parentStream).length == 0 ) {
                                opts.streamList.stream('nodeToLeaf', parentStream);
                                //3.1 make stream's timeline become leaf
                                var parentTimeline = self._getTimelineBar(parentStream.attr('rel'));
                                parentTimeline
                                    .removeClass(opts.cssClass.timelineGroup)
                                    .timeline('enableMoving')
                                    .timeline('enableResizing');
                            }
                            else {
                                //3.2 update parent stream duration
                                self._ajustGroupTimelineScaled(parentStream, true/*add buffer*/);
                                //3.3 update parent stream relationship lines position
                                self._ajustTimelineRelationship(self._getTimelineBar(parentStream.attr('rel')).eq(0));
                            }
                        }
                        //4. trigger re-structure event
                        self._restructureCallback(deletedStreamIndex-1-opts.streamBaseIndex);
                    }
                );
            },

            /**
             * @use: call when timeline has been deleted and return 'true' from server
             */
            _deleteTimelineCallback: function (deletedTimeline) {
                var self = this;
                var opts = this.options;

                //1. remove relationship(if exist)
                this._deleteTimelineRelationship(deletedTimeline);

                //2. remove stream | timeline
                var changedStream = $(deletedTimeline.parent().attr('rel'));
                //update parent timeline, if available
                deletedTimeline.fadeOut('medium', function () {
                    var stream = $(deletedTimeline.parent().attr('rel'));
                    var timelineWrapper = deletedTimeline.parent();
                    //permanently removed DOM element
                    deletedTimeline.remove();
                    //3. update parent timeline, if available
                    var parentClientID = changedStream.data('parentClientID');
                    if ( parentClientID != 0 ) {
                        self._ajustGroupTimelineScaled($('#'+parentClientID), true/*add buffer*/);
                    }
                    //4. update stream completion status
                    if ( self._isAllTimelineCompleted(timelineWrapper) ) {
                        opts.streamList.stream('markStreamAsCompleted', stream);
                    }

                    Zenwork.Model.flush();
                });
            },

            _deleteTimelineRelationship: function (timeline, noFlush) {
                var self = this;
                var opts = this.options;
                //1. remove dependancy(if exist)
                //check successor
                var successor = this._succ(timeline);
                $.each(successor, function (index, value) {
                    self._clearRelationship(timeline, $('#'+value));
                });

                //check predecessor
                var predecessor = this._pre(timeline);
                $.each(predecessor, function (index, value) {
                    self._clearRelationship($('#'+value), timeline);
                });

                if ( noFlush ) { return; }

                //flush data from buffer
                Zenwork.Model.flush();
            },

            /**
             * @use: return relationship type between 2 timeline bar
             * @params:
             *     - startRelPoint: jQuery object
             *     - endRelPoint: jQuery object
             *     - className: object reference to timeline relationship point class name
             * @return: RELATIONSHIP_TYPE(SF|SS|FF|FS)
             */
            _detectRelationshipType: function (startRelPoint, endRelPoint, className) {
                if ( startRelPoint.hasClass(className.relationshipPointLeft)
                    && endRelPoint.hasClass(className.relationshipPointRight)
                ) {
                    return this.options.RELATIONSHIP_TYPE.SF;
                }
                else if ( startRelPoint.hasClass(className.relationshipPointLeft)
                    && endRelPoint.hasClass(className.relationshipPointLeft)
                ) {
                    return this.options.RELATIONSHIP_TYPE.SS;
                }
                else if ( startRelPoint.hasClass(className.relationshipPointRight)
                    && endRelPoint.hasClass(className.relationshipPointRight)
                ) {
                    return this.options.RELATIONSHIP_TYPE.FF;
                }
                else if ( startRelPoint.hasClass(className.relationshipPointRight)
                    && endRelPoint.hasClass(className.relationshipPointLeft)
                ) {
                    return this.options.RELATIONSHIP_TYPE.FS;
                }
            },

            /**
             * @use: draw connection line between 2 timeline bar
             * @params:
             *     - startTimeline
             *     - endTimeline
             *     - relationshipType
             */
            _drawRelationshipLine: function (startTimeline, endTimeline, relationshipType) {
                var connectorsElem = [];

                if ( startTimeline.is(':visible') && endTimeline.is(':visible') ) {
                    var self = this;
                    var opts = this.options;
                    var startTimelineBoxModel = this._getTimelineBoxModel(startTimeline);
                    var endTimelineBoxModel = this._getTimelineBoxModel(endTimeline);
                    var connectors = 2;
                    var xOffset = endTimelineBoxModel.leftAbs - startTimelineBoxModel.leftAbs;
                    var yOffset = endTimelineBoxModel.topAbs - startTimelineBoxModel.topAbs;
                    var left = $.getScrollX(opts.calendarGrid.clip);
                    var top = $.getScrollY(opts.calendarGrid.clip);
                    var minX = Math.round(this.gridUnitSize/2);
                    var width; //width of the virtual box wrap all the connectors
                    var thickness = 1;
                    var relDataID = startTimeline.data('clientID')+'&'+endTimeline.data('clientID');

                    //start draw connector lines
                    //set width & left
                    switch ( relationshipType ) {
                        case opts.RELATIONSHIP_TYPE.SS:
                            break;
                        case opts.RELATIONSHIP_TYPE.SF:
                            xOffset += endTimelineBoxModel.width;
                            break;
                        case opts.RELATIONSHIP_TYPE.FF:
                            xOffset += (endTimelineBoxModel.width - startTimelineBoxModel.width);
                            break;
                        case opts.RELATIONSHIP_TYPE.FS:
                            xOffset -= startTimelineBoxModel.width;
                            break;
                    }
                    width = Math.abs(xOffset);
                    if ( xOffset == 0 ) {
                        xOffset = minX;
                        switch ( relationshipType ) {
                            case opts.RELATIONSHIP_TYPE.SS:
                                //4 connectors left
                                connectors = 4;
                                left += startTimelineBoxModel.leftRel - xOffset;
                                break;
                            case opts.RELATIONSHIP_TYPE.SF:
                                //4 connectors right
                                connectors = 4;
                                left += startTimelineBoxModel.leftRel - xOffset;
                                break;
                            case opts.RELATIONSHIP_TYPE.FF:
                                //4 connectors right
                                connectors = 4;
                                left += startTimelineBoxModel.leftRel + startTimelineBoxModel.width;
                                break;
                            case opts.RELATIONSHIP_TYPE.FS:
                                //4 connectors left
                                connectors = 4;
                                left += startTimelineBoxModel.leftRel + startTimelineBoxModel.width;
                                break;
                        }
                    }
                    else if ( xOffset > 0 ) {
                        switch ( relationshipType ) {
                            case opts.RELATIONSHIP_TYPE.SS:
                                //4 connectors right
                                connectors = 4;
                                xOffset = minX;
                                left += startTimelineBoxModel.leftRel - xOffset;
                                break;
                            case opts.RELATIONSHIP_TYPE.SF:
                                //4 connectors right
                                connectors = 4;
                                xOffset = minX;
                                left += startTimelineBoxModel.leftRel - xOffset;
                                break;
                            case opts.RELATIONSHIP_TYPE.FF:
                                //2 connectors right
                                connectors = 2;
                                left += startTimelineBoxModel.leftRel + startTimelineBoxModel.width;
                                break;
                            case opts.RELATIONSHIP_TYPE.FS:
                                //2 connectors right
                                connectors = 2;
                                left += startTimelineBoxModel.leftRel + startTimelineBoxModel.width;
                                break;
                        }
                    }
                    else {
                        switch ( relationshipType ) {
                            case opts.RELATIONSHIP_TYPE.SS:
                                //2 connectors left
                                connectors = 2;
                                xOffset = Math.abs(xOffset);
                                left += startTimelineBoxModel.leftRel - xOffset;
                                break;
                            case opts.RELATIONSHIP_TYPE.SF:
                                //2 connectors left
                                connectors = 2;
                                xOffset = Math.abs(xOffset);
                                left += startTimelineBoxModel.leftRel - xOffset;
                                break;
                            case opts.RELATIONSHIP_TYPE.FF:
                                //4 connectors left
                                connectors = 4;
                                xOffset = minX;
                                left += startTimelineBoxModel.leftRel + startTimelineBoxModel.width;
                                break;
                            case opts.RELATIONSHIP_TYPE.FS:
                                //4 connectors left
                                connectors = 4;
                                xOffset = minX;
                                left += startTimelineBoxModel.leftRel + startTimelineBoxModel.width;
                                break;
                        }
                    }
                    //from now we got {left, width, connectors}
                    top += startTimelineBoxModel.topRel
                        + startTimelineBoxModel.parent.topRel
                        + Math.round((startTimelineBoxModel.height - thickness)/2);
                    
                    //draw base line(x-axis)
                    var lineX = $('<div class="'+opts.cssClass.relationshipBoxPersistent+' '+opts.cssClass.relationshipBoxPersistentHorz+'"></div>').appendTo(opts.calendarGrid.clip);
                    if ( relationshipType == opts.RELATIONSHIP_TYPE.FS && left < endTimelineBoxModel.leftRel  ) {
                        xOffset += thickness;
                    }
                    lineX.css({
                        left: left,
                        top: top,
                        width: xOffset,
                        height: thickness
                    }).attr('data-relationship', relDataID);
                    connectorsElem.push(lineX);
                    
                    //draw other lines
                    var lineY = $('<div class="'+opts.cssClass.relationshipBoxPersistent+' '+opts.cssClass.relationshipBoxPersistentVert+'"></div>').appendTo(opts.calendarGrid.clip);
                    lineY.css({
                        left: left < startTimelineBoxModel.leftRel ? left : (left + xOffset - thickness),
                        width: thickness
                    }).attr('data-relationship', relDataID);
                    connectorsElem.push(lineY);

                    //draw arrow and extra lines(if needed)
                    var arrow = $('<div></div>').appendTo(opts.calendarGrid.clip);
                    connectorsElem.push(arrow);
                    switch ( connectors ) {
                        case 2:
                        case 3:
                            if ( connectors == 2 ) {
                                //draw arrow
                                arrow.removeAttr('class');
                                if ( yOffset > 0 ) { //arrow -> bottom
                                    arrow.addClass(opts.cssClass.relationshipBoxArrowB);
                                }
                                else { //arrow -> top
                                    arrow.addClass(opts.cssClass.relationshipBoxArrowT);
                                }
                                var arrowWidth = arrow.width();
                                var arrowHeight = arrow.height();
                                arrow.css({
                                    left: (left < startTimelineBoxModel.leftRel ? left : (left + xOffset - thickness)) - Math.round((arrowWidth - thickness)/2),
                                    top: yOffset > 0
                                        ? (top + Math.abs(yOffset) - (endTimelineBoxModel.height - thickness)/2 - arrowHeight)
                                        : (top - Math.abs(yOffset) + (endTimelineBoxModel.height + thickness)/2)
                                });
                                //draw last line
                                lineY.css({
                                    top: yOffset > 0
                                        ? top
                                        : (top - (Math.abs(yOffset) - (endTimelineBoxModel.height - thickness)/2 - arrowHeight) + thickness),
                                    height: Math.abs(yOffset) - (endTimelineBoxModel.height - thickness)/2 - arrowHeight
                                });
                            }
                            else { //3 connectors
                                lineY.css({
                                    top: yOffset > 0 ? top : (top - Math.abs(yOffset)),
                                    height: Math.abs(yOffset)
                                });
                                arrow.removeAttr('class');
                                if ( relationshipType == opts.RELATIONSHIP_TYPE.FF ) {
                                    arrow.addClass(opts.cssClass.relationshipBoxArrowL);
                                }
                                else if ( relationshipType == opts.RELATIONSHIP_TYPE.SS ) {
                                    arrow.addClass(opts.cssClass.relationshipBoxArrowR);
                                }
                                var arrowWidth = arrow.width();
                                var arrowHeight = arrow.height();
                                //draw last line
                                var lineX2 = lineX.clone().appendTo(opts.calendarGrid.clip);
                                lineX2.css({
                                    left: '+='+(relationshipType == opts.RELATIONSHIP_TYPE.FF ? (-width+arrowWidth) : 0),
                                    top: yOffset > 0 ? (top + Math.abs(yOffset)) : (top - Math.abs(yOffset)),
                                    width: width + minX - arrowWidth
                                }).attr('data-relationship', relDataID);
                                connectorsElem.push(lineX2);
                                //draw arrow
                                var arrowLeft;
                                if ( relationshipType == opts.RELATIONSHIP_TYPE.FF ) {
                                    arrowLeft = lineX2.position().left - arrowWidth;
                                }
                                else if ( relationshipType == opts.RELATIONSHIP_TYPE.SS ) {
                                    arrowLeft = lineX2.position().left + width + minX - arrowWidth;
                                }
                                arrow.css({
                                    left: arrowLeft,
                                    top: (yOffset > 0 ? (top + Math.abs(yOffset)) : (top - Math.abs(yOffset)))
                                        - Math.round((arrowHeight - thickness)/2)
                                });
                            }
                            break;
                        case 4:
                            var top2 = yOffset > 0
                                ? top
                                : top - Math.abs(yOffset) + (endTimelineBoxModel.height + thickness)/2 + endTimelineBoxModel.topRel;
                            var height2 = Math.abs(yOffset) - (endTimelineBoxModel.height - thickness)/2 - endTimelineBoxModel.topRel;
                            lineY.css({
                                top: top2,
                                height: height2
                            });
                            var lineX2 = lineX.clone().appendTo(opts.calendarGrid.clip);
                            var lineX2Width = width + minX;
                            lineX2.css({
                                top: yOffset > 0 ? (top2 + height2 - Math.round(thickness/2)) : top2,
                                width: lineX2Width
                            }).attr('data-relationship', relDataID);
                            if ( left > startTimelineBoxModel.leftRel ) {
                                lineX2.css({
                                    left: '+='+(-width)
                                });
                            }
                            connectorsElem.push(lineX2);
                            //draw arrow
                            arrow.removeAttr('class');
                            if ( yOffset > 0 ) { //arrow -> bottom
                                arrow.addClass(opts.cssClass.relationshipBoxArrowB);
                            }
                            else { //arrow -> top
                                arrow.addClass(opts.cssClass.relationshipBoxArrowT);
                            }
                            var arrowWidth = arrow.width();
                            var arrowHeight = arrow.height();
                            //draw last line
                            var lineY2 = lineY.clone().appendTo(opts.calendarGrid.clip);
                            lineY2.css({
                                left: '+='+(left < startTimelineBoxModel.leftRel ? (lineX2Width - thickness) : (-lineX2Width + thickness)),
                                top: yOffset > 0 ? (top2 + height2 - Math.round(thickness/2)) : (top2 - endTimelineBoxModel.topRel + arrowHeight),
                                height: endTimelineBoxModel.topRel - arrowHeight + thickness
                            }).attr('data-relationship', relDataID);
                            connectorsElem.push(lineY2);
                            //draw arrow
                            arrow.css({
                                left: lineY2.position().left - Math.round((arrowWidth-thickness)/2),
                                top: yOffset > 0
                                    ? (top2 + height2 + endTimelineBoxModel.topRel - arrowHeight)
                                    : (top2 - endTimelineBoxModel.topRel)
                            });

                            break;
                    }
                    arrow.addClass(opts.cssClass.relationshipBoxArrow).attr('data-relationship', relDataID);;
                    //END. start draw connector lines
                }

                return {
                    type: relationshipType,
                    line: connectorsElem,
                    arrow: arrow
                };
            },

            /**
             * @use: disable drawing timeline capability when user drag mouse on timeline item in timeline list
             */
            _disableDrawingTimeline: function () {
                //enable selectable
                this.options.calendarGrid.clip.selectable('enable');
                this.disabledDrawingTimeline = true;
            },

            /**
             * @use: enable drawing timeline capability when user drag mouse on timeline item in timeline list
             */
            _enableDrawingTimeline: function () {
                //disable selectable
                this.options.calendarGrid.clip.selectable('disable');
                this.disabledDrawingTimeline = false;
            },

            _getDefaultTimelineHelper: function () {
                var opts = this.options;
                var defaultTimelinePos = {};
                var todayPosition = opts.calendarApi.calendar('getTodayPosition');
                if ( todayPosition == 0 ) {
                    defaultTimelinePos.left = opts.calendarGrid.unitSize*2*opts.calendarGrid.timeBefore;
                }
                else {
                    defaultTimelinePos.left = todayPosition;
                }
                defaultTimelinePos.width = opts.calendarGrid.unitSize*2;
                var defaultTimeline = opts.calendarApi.calendar('getDayValue', defaultTimelinePos.left, defaultTimelinePos.width);

                return {
                    defaultTimelinePos: defaultTimelinePos,
                    defaultTimeline: defaultTimeline
                }
            },

            /**
             * @use: ..
             */
            _getTimelineBar: function (timelineWrapper) {
                var selector = '.'+this.options.cssClass.ganttStream;
                if ( typeof(timelineWrapper) === 'string' ) {
                    return $(timelineWrapper+' '+selector)
                }
                else if ( timelineWrapper.constructor == Array ) {
                    return timelineWrapper[0].find(selector);
                }
                return timelineWrapper.find(selector);
            },

            /**
             * @use: extends from getBoxPosition, adding parent's relative position
             * @params:
             *     - timeline: jQuery object
             */
            _getTimelineBoxModel: function (timeline) {
                var timelineBoxModel = $.extend({}, $.getBoxPosition(timeline), $.getBoxModel(timeline));
                timelineBoxModel.parent = {};
                var timelineParent = timeline.parent();
                timelineBoxModel.parent.leftRel = timelineParent.position().left;
                timelineBoxModel.parent.topRel = timelineParent.position().top;
                return timelineBoxModel;
            },

            /**
             * @use: handle start|on|stop when creating relationship
             * @event:
             *     - startCreateRelationship
             *     - onCreateRelationship
             *     - stopCreateRelationship
             */
            _handleRelationshipCreation: function () {
                var self = this;
                var opts = this.options;
                var stroke = {
                    color: '#000000',
                    thickness: 1,
                    style: '--'
                }

                var startRelPoint;
                var startRelPointBoxModel;
                var containerModel;
                var timelineBoxModel;
                opts.timelineConfig.startCreateRelationship = function (e, ui) {
                    self.disabledDrawingTimeline = true;
                    self.element.addClass(opts.cssClass.startCreateRelationship);
                    self.onDragging = true;
                    self.relationshipCanvas.clear();
                    containerModel = {
                        scrollLeft: $.getScrollX(opts.calendarGrid.clip),
                        scrollTop: $.getScrollY(opts.calendarGrid.clip)
                    }
                    timelineBoxModel = { //special case, do not use 'getBoxModel' method
                        leftAbs: ui.element.offset().left,
                        topAbs: ui.element.offset().top,
                        leftRel: ui.element.position().left + ui.element.parent().position().left,
                        topRel: ui.element.position().top + ui.element.parent().position().top,
                        width: ui.element.width(),
                        height: ui.element.height()
                    };
                    $('.'+ui.options.cssClass.relationshipPoint).addClass(ui.options.cssClass.relationshipPointHint);
                    ui.element
                        .removeClass(ui.options.cssClass.move)
                        .removeClass(ui.options.cssClass.resize);
                    if ( ui.element.data('uiTimeline') != undefined ) {
                        ui.element.timeline('disable');
                    }
                    else if ( ui.element.data('uiMilestone') != undefined ) {
                        ui.element.milestone('disable');
                    }
                    startRelPoint = ui.element.find('.'+ui.options.cssClass.relationshipPointSelected);
                    startRelPointBoxModel = $.extend({}, $.getBoxPosition(startRelPoint), $.getBoxModel(startRelPoint));
                    self.relationshipBox.removeClass('Hidden').css({
                        left: startRelPointBoxModel.leftRel
                            + timelineBoxModel.leftRel
                            + startRelPointBoxModel.width/2
                            + containerModel.scrollLeft,
                        top: startRelPointBoxModel.topRel
                            + timelineBoxModel.topRel
                            + startRelPointBoxModel.height/2
                            + containerModel.scrollTop,
                    });
                }
                opts.timelineConfig.onCreateRelationship = function (e, ui) {
                    startRelPointBoxModel = $.extend({}, $.getBoxPosition(startRelPoint), $.getBoxModel(startRelPoint));
                    var relationshipBoxModel = self._calculateRelationshipBox(startRelPointBoxModel, {
                        leftAbs: e.pageX,
                        topAbs: e.pageY
                    }, timelineBoxModel, containerModel);
                    self.relationshipCanvas.clear();
                    var canvasX1 = 0;
                    var canvasY1 = 0;
                    var canvasX2 = 0;
                    var canvasY2 = 0;
                    var ajustMouse = {
                        x: 1,
                        y: 1
                    }
                    switch ( relationshipBoxModel.className ) {
                        case opts.cssClass.relationshipBoxTL:
                            relationshipBoxModel.left += ajustMouse.x;
                            relationshipBoxModel.top += ajustMouse.y;
                            relationshipBoxModel.width -= ajustMouse.x;
                            relationshipBoxModel.height -= ajustMouse.x;
                            canvasX1 = relationshipBoxModel.width;
                            canvasY1 = relationshipBoxModel.height;
                            break;
                        case opts.cssClass.relationshipBoxBR:
                            relationshipBoxModel.width -= ajustMouse.x;
                            relationshipBoxModel.height -= ajustMouse.x;
                            canvasX2 = relationshipBoxModel.width;
                            canvasY2 = relationshipBoxModel.height;
                            break;
                        case opts.cssClass.relationshipBoxTR:
                            relationshipBoxModel.top += ajustMouse.x;
                            relationshipBoxModel.width -= ajustMouse.x;
                            relationshipBoxModel.height -= ajustMouse.x;
                            canvasY1 = relationshipBoxModel.height;
                            canvasX2 = relationshipBoxModel.width;
                            break;
                        case opts.cssClass.relationshipBoxBL:
                            relationshipBoxModel.left += ajustMouse.x;
                            relationshipBoxModel.width -= ajustMouse.x;
                            canvasX1 = relationshipBoxModel.width;
                            canvasY2 = relationshipBoxModel.height;
                            break;
                        case opts.cssClass.relationshipBoxT:
                            relationshipBoxModel.top += ajustMouse.x;
                            relationshipBoxModel.height -= ajustMouse.x;
                            canvasY1 = relationshipBoxModel.height;
                            break;
                        case opts.cssClass.relationshipBoxB:
                            relationshipBoxModel.width = 1;
                            relationshipBoxModel.height -= ajustMouse.x;
                            canvasY2 = relationshipBoxModel.height;
                            break;
                        case opts.cssClass.relationshipBoxL:
                            relationshipBoxModel.left += ajustMouse.x;
                            relationshipBoxModel.width -= ajustMouse.x;
                            canvasX1 = relationshipBoxModel.width;
                            break;
                        case opts.cssClass.relationshipBoxR:
                            relationshipBoxModel.width -= ajustMouse.x;
                            canvasX2 = relationshipBoxModel.width;
                            break;
                    }
                    relationshipBoxModel.width = relationshipBoxModel.width < 1 ? 1 : relationshipBoxModel.width;
                    relationshipBoxModel.height = relationshipBoxModel.height < 1 ? 1 : relationshipBoxModel.height;
                    canvasX1 = canvasX1 < 0 ? 0 : canvasX1;
                    canvasY1 = canvasY1 < 0 ? 0 : canvasY1;
                    canvasX2 = canvasX2 < 0 ? 0 : canvasX2;
                    canvasY2 = canvasY2 < 0 ? 0 : canvasY2;
                    self.relationshipBox.css({
                        left: relationshipBoxModel.left,
                        top: relationshipBoxModel.top,
                        width: relationshipBoxModel.width,
                        height: relationshipBoxModel.height
                    });
                    self.relationshipCanvas.setSize(relationshipBoxModel.width, relationshipBoxModel.height);
                    var line = self.relationshipCanvas.path('M'+canvasX1+' '+canvasY1+'L'+canvasX2+' '+canvasY2);
                    line.attr({
                        'stroke': stroke.color,
                        'stroke-width': stroke.thickness,
                        'stroke-dasharray': stroke.style
                    });
                }
                opts.timelineConfig.stopCreateRelationship = function (e, ui) {
                    if ( !$('.'+opts.cssClass.timelineDrawingBtn).hasClass(opts.cssClass.timelineDrawingBtnDisabled) ) {
                        self.disabledDrawingTimeline = false;
                    }
                    self._clearInterval(self.scrollTimer);
                    self.onDragging = false;
                    $('.'+ui.options.cssClass.relationshipPoint).removeClass(ui.options.cssClass.relationshipPointHint);
                    var endRelPoint = $('.'+ui.options.cssClass.connectingRelationship);
                    var endTimeline;
                    //validate relationship
                    if ( endRelPoint.length > 0 && self._validateRelationship(startRelPoint, endRelPoint) ) {
                        var endTimeline = endRelPoint.parent();
                        var endRelPointBoxModel = $.extend({}, $.getBoxPosition(endRelPoint), $.getBoxModel(endRelPoint));
                        var startTimelineClientId = startRelPoint.parent().data('clientID');
                        if ( !(startTimelineClientId in self.relationshipTable) ) {
                            self.relationshipTable[startTimelineClientId] = [];
                        }
                        self.relationshipTable[startTimelineClientId].push(endRelPoint.parent().data('clientID'));

                        //ajust timeline first
                        var relationshipType = self._detectRelationshipType(startRelPoint, endRelPoint, ui.options.cssClass);
                        var floatTime = 0*(self.gridUnitSize); //TODO
                        var offsetMove = 0;
                        switch ( relationshipType ) {
                            case opts.RELATIONSHIP_TYPE.FS:
                                if ( endRelPointBoxModel.leftAbs < startRelPointBoxModel.leftAbs ) {
                                    offsetMove = startRelPointBoxModel.leftAbs - endRelPointBoxModel.leftAbs - endRelPointBoxModel.width;
                                    offsetMove += floatTime;
                                }
                                break;
                            case opts.RELATIONSHIP_TYPE.FF:
                            case opts.RELATIONSHIP_TYPE.SS:
                                if ( endRelPointBoxModel.leftAbs != startRelPointBoxModel.leftAbs ) {
                                    offsetMove = startRelPointBoxModel.leftAbs - endRelPointBoxModel.leftAbs;
                                }
                            case opts.RELATIONSHIP_TYPE.FF:
                                //TODO: float time
                                break;
                            case opts.RELATIONSHIP_TYPE.SS:
                                //TODO: float time
                                break;
                            case opts.RELATIONSHIP_TYPE.SF:
                                if ( endRelPointBoxModel.leftAbs - endRelPointBoxModel.width
                                    != startRelPointBoxModel.leftAbs
                                ) {
                                    offsetMove = startRelPointBoxModel.leftAbs - endRelPointBoxModel.leftAbs + endRelPointBoxModel.width;
                                    //TODO: float time
                                }
                                break;
                        }
                        var endTimelineData = endTimeline.data();
                        if ( offsetMove != 0 ) {
                            //end timeline is timeline bar
                            if ( endTimelineData.uiTimeline != undefined ) {
                                //start timeline is timeline bar
                                if ( endTimelineData.uiTimeline != undefined ) {
                                    //endTimeline.timeline('move', offsetMove);
                                }
                                //start timeline is milestone
                                else if ( endTimelineData.uiMilestone != undefined ) {
                                    //endTimeline.milestone('move', offsetMove - Math.round(self.gridUnitSize/2));
                                }
                            }
                            //end timeline is milestone
                            else if ( endTimelineData.uiMilestone != undefined ) {
                                //start timeline is milestone
                                if ( endTimelineData.uiMilestone != undefined ) {
                                    endTimeline.milestone('move', offsetMove);
                                }
                                //start timeline is timeline bar
                                else if ( endTimelineData.uiTimeline != undefined ) {
                                    endTimeline.timeline('move', offsetMove - Math.round(self.gridUnitSize/2));
                                }
                            }
                            endRelPointBoxModel = $.extend({}, $.getBoxPosition(endRelPoint), $.getBoxModel(endRelPoint));
                            self._ajustTimelineRelationship(endTimeline);

                            //update start & end time data
                            endTimelineData = endTimeline.data();
                            var startTime = self.options.calendarApi.calendar('getDateFromPosition', endTimelineData.left)/1000;
                            var endTime = startTime + (endTimelineData.width/(self.gridUnitSize*2))*(24*3600);

                            //add changes to model buffer
                            Zenwork.Model.addBuffer({
                                id: endTimelineData.id,
                                start: startTime,
                                end: endTime - 1 //-1 second to get the end time, eg. 11:59:59
                            }, endTimeline.timeline('option', 'useModel'), Zenwork.Model.CU);

                            //update parent timeline
                            var changedStream = $(endTimeline.parent().attr('rel'));
                            if ( changedStream.data('parentID') != 0 ) {
                                var parentStream = $('#'+changedStream.data('parentClientID'));
                                self._ajustGroupTimelineScaled(parentStream, true/*add buffer*/);
                                self._ajustTimelineRelationship($(parentStream.attr('rel')).find('.'+opts.cssClass.timeline).eq(0));
                            }

                            //update children
                            if ( !opts.streamList.stream('isLeaf', changedStream) ) {
                                var children = opts.streamList.stream('getChildren', changedStream);
                                var childrenTimeline = $([]);
                                children.each(function () {
                                    childrenTimeline = childrenTimeline.add(self._getTimelineBar($(this).attr('rel')));
                                });

                                //move children timeline
                                self._moveTimelineGroup(childrenTimeline, offsetMove);
                                
                                //update relationship position
                                self._reRenderRelationship(childrenTimeline);
                                
                                //update timeline data, add buffer
                                childrenTimeline.each(function () {
                                    var $this = $(this);
                                    //update start & end time data
                                    $thisData = $this.data();
                                    var $thisStartTime = self.options.calendarApi.calendar('getDateFromPosition', $thisData.left)/1000;
                                    var $thisEndTime = $thisStartTime + ($thisData.width/(self.gridUnitSize*2))*(24*3600);

                                    //add changes to model buffer
                                    Zenwork.Model.addBuffer({
                                        id: $thisData.id,
                                        start: $thisStartTime,
                                        end: $thisEndTime - 1 //-1 second to get the end time, eg. 11:59:59
                                    }, $this.timeline('option', 'useModel'), Zenwork.Model.CU);
                                });
                            }
                        }

                        //then draw relationship line...
                        var relationship = self._drawRelationshipLine(ui.element, endTimeline, relationshipType);

                        //finally, store relationship within timeline object
                        self._storeRelationship(relationship, ui.element, endTimeline, relationshipType);

                        //add data to model buffer
                        Zenwork.Model.addBuffer({
                            tID1: ui.element.data('id'),
                            tID2: endTimelineData.id,
                            rel: relationshipType,
                            scopeID: self.options.listID
                        }, 'Timeline_dependancy', Zenwork.Model.CU);

                        //flush model to server
                        Zenwork.Model.flush();
                    }
                    else {
                        //Invalid
                    }
                    if ( ui.element.data('uiTimeline') != undefined ) {
                        ui.element.timeline('enable');
                    }
                    else if ( ui.element.data('uiMilestone') != undefined ) {
                        ui.element.milestone('enable');
                    }
                    ui.element.find('.'+ui.options.cssClass.relationshipPointSelected).removeClass(ui.options.cssClass.relationshipPointSelected);
                    self.relationshipBox.css({
                        width: 0,
                        height: 0
                    }).addClass('Hidden');
                    self.element.removeClass(opts.cssClass.startCreateRelationship);
                }
            },

            /**
             * @use: handle scrolling container when mouse over container edge, happening during dragging something
             * @note: move timeline + timeline hightlight
             */
            _handleScrollOnEdge: function (e, edgeSize) {
                var opts = this.options;
                var self = this;
                var element = this.element; //<ul#ganttTimelineList>
                //containerBoxModel: overflow-x:auto -> fixed position on x-axis calendarGrid.container
                var containerBoxModel = this.containerBoxModel;
                //clipBoxModel: overflow-y:auto -> fixed position on y-axis calendarGrid.container
                var clipBoxModel = this.clipBoxModel;
                var scrollOffset = {
                    x: self.gridUnitSize,
                    y: 10
                };

                if ( !self.onDragging ) { return true; }
                var contentOffsetX = element.outerWidth() - containerBoxModel.width;
                var contentOffsetY = element.outerHeight() - clipBoxModel.height;
                containerBoxModel.scrollLeft = opts.calendarApi.calendar('getScrollX');
                containerBoxModel.scrollTop = opts.calendarApi.calendar('getScrollY');
                var onTopEdge = e.pageY < clipBoxModel.topAbs + edgeSize;
                var onBottomEdge = e.pageY > clipBoxModel.topAbs + clipBoxModel.height - edgeSize;
                var onLeftEdge = e.pageX < containerBoxModel.leftAbs + edgeSize;
                var onRightEdge = e.pageX > containerBoxModel.leftAbs 
                    + Math.min(containerBoxModel.width, clipBoxModel.width)
                    - edgeSize;

                var _stop_ = function () {
                    if ( (onTopEdge || onBottomEdge) && (!onLeftEdge && !onRightEdge) ) {
                        if ( this.scrollTimer != null ) {
                            this.scrollTimer = this._clearInterval(this.scrollTimer);
                        }
                        return true;
                    }

                    if ( onRightEdge ) {
                        opts.calendarApi.calendar('addColumn', onLeftEdge ? 'before' : 'after', 'day', 10);
                        contentOffsetX = element.outerWidth() - containerBoxModel.width;
                        clipBoxModel = self.clipBoxModel = $.extend({}, $.getBoxPosition(opts.calendarGrid.clip), $.getBoxModel(opts.calendarGrid.clip));
                    }
                }

                if ( !this._validateScrollOnEdge(onTopEdge, onBottomEdge, onLeftEdge, onRightEdge, contentOffsetX, contentOffsetY, containerBoxModel) ) {
                    _stop_.call(this);
                }
                if ( onTopEdge || onBottomEdge || onLeftEdge || onRightEdge ) {
                    if ( onLeftEdge ) {
                        scrollOffset.x = -scrollOffset.x;
                    }
                    if ( onTopEdge ) {
                        scrollOffset.y = -scrollOffset.y;
                    }
                    if ( self.scrollTimer == null ) {
                        //interval
                        self.scrollTimer = setInterval(function () {
                            if ( !self._validateScrollOnEdge(onTopEdge, onBottomEdge, onLeftEdge, onRightEdge, contentOffsetX, contentOffsetY, containerBoxModel)
                                || e.pageX < containerBoxModel.leftAbs
                                || e.pageX > containerBoxModel.leftAbs + containerBoxModel.width
                            ) {
                                _stop_.call(self);
                            }
                            else {
                                if ( onTopEdge || onBottomEdge ) {
                                    containerBoxModel.scrollTop += scrollOffset.y;
                                    opts.calendarApi.calendar('scrollY', containerBoxModel.scrollTop);
                                }
                                if ( onLeftEdge || onRightEdge ) {
                                    containerBoxModel.scrollLeft += scrollOffset.x;
                                    opts.calendarApi.calendar('scrollX', containerBoxModel.scrollLeft);
                                    if ( self.selectedTimeline.length > 0 )  {
                                        var offsetMove = (Math.abs(scrollOffset.x)/scrollOffset.x)*opts.timelineConfig.gridModel.unitSize;
                                        self.highlightOverlays.css({
                                            left: '+='+offsetMove
                                        });
                                        self._moveTimelineGroup(self.selectedTimeline, offsetMove);
                                    }
                                }

                                opts.fakeScroll.addClass('Hidden');
                            }
                        }, 13);
                    }
                    return true;
                }
                self.scrollTimer = self._clearInterval(self.scrollTimer);
            },

            /**
             * @use: init drawing timeline capability when user drag mouse on timeline item in timeline list
             */
            _postDrawingTimelineData: function (timelineWrapper, timelineHelperClone, postData) {
                var self = this;
                var opts = this.options;
                var element = this.element;
                var stream = $(timelineWrapper.attr('rel'));
                postData.sid = stream.data('id');
                self._addTimelineBar(postData, true, function (data) { //ajax callback
                    var timelineElement = $('<div id="'+self.PREFIX.TIMELINE_BAR+data.id+'" class="'+opts.cssClass.ganttStream+' '+opts.cssClass.timeline+'"></div>');
                    timelineWrapper.append(timelineElement);
                    
                    //set timeline bar data(return after created on server)
                    timelineElement.data(data);
                    
                    var parentTimelineID = timelineWrapper.find('.'+opts.cssClass.ganttStream).eq(0).data('parentID');
                    self._createResizableTimeline(timelineElement, $.extend(true, opts.timelineConfig, {
                        id: data.id,
                        clientID: self.PREFIX.TIMELINE_BAR+data.id,
                        left: postData.left,
                        width: postData.width,
                        parentID: parentTimelineID
                    }));
                    timelineHelperClone.remove();

                    //mark stream as uncompleted
                    if ( stream.data('completed') == 1 ) {
                        opts.streamList.stream('markStreamAsUnCompleted', stream);
                    }

                    //update parent timeline, if available
                    if ( parentTimelineID != 0 ) {
                        timelineElement.data('parentClientID', self.PREFIX.TIMELINE_BAR+parentTimelineID);
                        self._ajustGroupTimelineScaled($('#'+stream.data('parentClientID')));
                        Zenwork.Model.flush();
                    }
                    else {
                        timelineElement.data('parentClientID', 0);
                    }
                });
                self.onDragging = false;
                startDrawing = false;
                drawingValidated = false;
            },
            _initDrawingTimeline: function () {
                var self = this;
                var opts = this.options;
                var element = this.element;
                var calendar = element.parent();
                var startDrawing = false;
                var startPoint;
                var timelineHelper = $('<div class="'+opts.cssClass.timelineDrawingHelper+'"></div>');
                var onElement;
                var newElement;
                var drawingValidated = false;
                var startDrawingDistance = 5;
                //draw on calendar
                calendar.on('mousedown', function (e) {
                    if ( e.which == 3 ) { return false; }
                    var $this = $(e.target);
                    if ( !self.disabledDrawingTimeline && !$this.hasClass(opts.cssClass.timelineDrawingHelper) ) {
                        if ( $this.hasClass(opts.cssClass.timelineWrapper) 
                            && $this.find('.'+opts.cssClass.timelineGroup).length == 0
                        ) {
                            onElement = $this;
                        }
                        else {
                            newElement = $('<li class="'+opts.cssClass.timelineWrapper+'"></li>');
                            element.append(newElement);
                        }
                        self.onDragging = true;
                        startDrawing = true;
                        startPoint = e.pageX + opts.calendarApi.calendar('getScrollX') - self.containerBoxModel.leftAbs;
                        startPoint = Math.round(startPoint/self.gridUnitSize)*self.gridUnitSize;
                        return false;
                    }
                });
                calendar.on('mousemove', function (e) {
                    if ( !self.disabledDrawingTimeline && startDrawing ) {
                        var offset = e.pageX + opts.calendarApi.calendar('getScrollX') - self.containerBoxModel.leftAbs - startPoint;

                        if ( Math.abs(offset) >= startDrawingDistance && !drawingValidated ) {
                            drawingValidated = true;
                            timelineHelper.appendTo(newElement !== undefined ? newElement : onElement).css({
                                left: startPoint,
                                width: self.gridUnitSize
                            });
                        }

                        if ( offset <= 0 ) {
                            offset = offset > -self.gridUnitSize ? -self.gridUnitSize : Math.round(offset/self.gridUnitSize)*self.gridUnitSize;
                        }
                        else {
                            offset = offset < self.gridUnitSize ? self.gridUnitSize : Math.round(offset/self.gridUnitSize)*self.gridUnitSize;
                        }

                        if ( offset <= 0 ) {
                            timelineHelper.css({
                                left: startPoint - Math.abs(offset)
                            });
                        }
                        else {
                            timelineHelper.css({
                                left: startPoint
                            });
                        }

                        timelineHelper.css({
                            width: Math.abs(offset)+'px'
                        });
                    }
                });
                calendar.on('mouseup', function (e) {
                    if ( !self.disabledDrawingTimeline && startDrawing ) {
                        if ( drawingValidated ) {
                            var ui = {
                                left: timelineHelper.position().left,
                                width: timelineHelper.outerWidth()
                            }
                            if ( newElement !== undefined ) {
                                var timelineDate = opts.calendarApi.calendar('getDayValue', ui.left, ui.width);
                                newElement.remove();
                                newElement = undefined;
                                //start add new timeline
                                self.addTimeline({
                                    Timeline: [
                                        {
                                            left: ui.left,
                                            width: ui.width,
                                            start: timelineDate.start,
                                            end: timelineDate.end,
                                            completed: 0
                                        }
                                    ]
                                }, true, function (e) {}, e);
                            }
                            else {
                                var timelineDate = opts.calendarApi.calendar('getDayValue', timelineHelper.position().left, timelineHelper.outerWidth());
                                var postData = {
                                    completed: 0,
                                    start: timelineDate.start,
                                    end: timelineDate.end,
                                    left: ui.left,
                                    width: ui.width
                                }
                                
                                var timelineHelperClone = timelineHelper.clone().addClass('DrawingInlineBar').appendTo(onElement);
                                timelineHelper.remove(); //must remove because when 'mousemove' new timelineHelper will be append
                                if ( onElement !== undefined && onElement.hasClass('DrawingPending') ) {
                                    //wait in queue until pending stream added and return 'sid'
                                    if ( self.queue[onElement.data('uuid')] === undefined ) { self.queue[onElement.data('uuid')] = []; }
                                    self.queue[onElement.data('uuid')].push({
                                        helper: timelineHelperClone,
                                        data: postData
                                    });
                                }
                                else {
                                    self._postDrawingTimelineData(onElement, timelineHelperClone, postData);
                                }
                            }
                        }
                        else {
                            if ( newElement !== undefined ) {
                                newElement.remove();
                                newElement = undefined;
                            }
                        }
                        self.onDragging = false;
                        startDrawing = false;
                        drawingValidated = false;
                        drawOnCalendar = false;
                    }
                });
            },

            /**
             * @use: ..
             */
            _isAllTimelineCompleted: function (timelineWrapper) {
                var opts = this.options;
                var timelineList = timelineWrapper.find('.'+opts.cssClass.ganttStream);
                var timelineCompleted = 0;
                timelineList.each(function () {
                    var $this = $(this);
                    if ( $this.data('completed') == 0 ) { return false; }
                    timelineCompleted++;
                });
                return timelineCompleted == timelineList.length;
            },

            /**
             * @use: move group of all selected timeline when dragging and moving
             *    - when mouse reach scroll edge
             *    - when dragging one timeline in group
             */
            _moveTimelineGroup: function (timelineGroup, offset, draggingTimeline) {
                var self = this;
                if ( timelineGroup.length > 0 ) {
                    $.each(timelineGroup, function (index, item) {
                        if ( draggingTimeline != undefined && draggingTimeline.is(item) ) { return true; }
                        //move item  which is not dragging item(if exist)
                        var $item = $(item);
                        if ( $item.data('uiTimeline') != undefined ) {
                            $item.timeline('move', offset);
                        }
                        else if ( $item.data('uiMilestone') != undefined ) {
                            $item.milestone('move', offset);
                        }
                    });
                }
            },

            /**
             * @use: return predecessor of a timeline(by clone array, not reference)
             * @parameter:
             *     - timeline
             *     - exception
             */
            _pre: function (timeline, exception) {
                if ( timeline.data('predecessor') == undefined ) { return []; }
                var predecessorData = {};
                predecessorData[this.options.RELATIONSHIP_TYPE.SS] = [];
                predecessorData[this.options.RELATIONSHIP_TYPE.SF] = [];
                predecessorData[this.options.RELATIONSHIP_TYPE.FS] = [];
                predecessorData[this.options.RELATIONSHIP_TYPE.FF] = [];
                //deep copy array, not reference
                predecessorData = $.extend(true, predecessorData, timeline.data('predecessor'));
                predecessor = [].concat(
                    predecessorData[this.options.RELATIONSHIP_TYPE.SS],
                    predecessorData[this.options.RELATIONSHIP_TYPE.SF],
                    predecessorData[this.options.RELATIONSHIP_TYPE.FS],
                    predecessorData[this.options.RELATIONSHIP_TYPE.FF]
                );
                exception = exception || [];
                return predecessor.remove(exception); //remove is method which extended native Array in core.js
            },

            /**
             * @use: re-render relationship line for a group timeline element
             * @parameter:
             *     - timelineGroup: array of jQuery timeline element
             */
            _reRenderRelationship: function (timelineGroup) {
                var self = this;
                var exp = [];
                $.each(timelineGroup, function (index, item) {
                    var $item = $(item);
                    var id = $item.data('clientID');
                    //re-render successor
                    var successor = self._succ($item, exp[id]);
                    if ( successor.length > 0 ) {
                        $.each(successor, function (index, value) {
                            if ( exp[value] == undefined ) { exp[value] = []; }
                            exp[value].push(id);
                            self._ajustRelationshipHelper(
                                $item.data(id+'&'+value),
                                $item,
                                $('#'+value)
                            );
                        });
                    }

                    //re-render predecessor
                    var predecessor = self._pre($item, exp[id]);
                    if ( predecessor.length > 0 ) {
                        $.each(predecessor, function (index, value) {
                            if ( exp[value] == undefined ) { exp[value] = []; }
                            exp[value].push(id);
                            var startTimeline = $('#'+value);
                            self._ajustRelationshipHelper(
                                startTimeline.data(value+'&'+id),
                                startTimeline,
                                $item
                            );
                        });
                    }

                    if ( $item.data('parentID') != 0 ) {
                        self._ajustTimelineRelationship($('#'+$item.data('parentClientID')));
                    }
                });
            },

            /**
             * @use: called when stream and timeline list is restructured: item deleted, re-order, outdent
             * @do:
             * - re-render relationship
             * - update calendar size(only when delete)
             * - update sync scroll(only when delete)
             * @parameter:
             *     - from: > from index - optional, notice: array index, start = 0, pass 'undefined' for unknown
             *     - to: < to index - optional, notice: array index, start = 0, pass 'undefined' for unknown
             */
            _restructureCallback: function (from, to) {
                var self = this;
                var opts = this.options;
                var streams = opts.streamList.stream('getStreamRows');
                if ( from !== undefined && to !== undefined ) {
                    if ( from > to ) {
                        var tmp = from;
                        from = to;
                        to = tmp;
                    }
                }
                from = from || 0;
                to = to || streams.length;
                var timelineGroup = [];
                streams.each(function (index) {
                    if ( index < from || index > to ) { return true; } //continue

                    timelineGroup = timelineGroup.concat(
                        $.makeArray(self._getTimelineBar($(this).attr('rel')))
                    ); //timeline|milestone
                });
                this._reRenderRelationship(timelineGroup);
                opts.calendarApi.calendar('ajustCalendarSize', 'y');
                opts.fakeScroll.syncscroll('update');
            },

            /**
             * @use: ..
             * @parameter:
             *     - parentStream: ...
             *     - parentTimeline: ...
             */
            _reorderChilrenTimeline: function (parentStream, parentTimeline) {
                if ( !this.options.streamList.stream('isLeaf', parentStream) ) {
                    var streams = this.options.streamList.stream('getChildren', parentStream).toArray().reverse();
                    $.each(streams, function (index, item) {
                        parentTimeline.after($($(item).attr('rel')));
                    });
                }
            },

            _singleStreamCompletedCallback: function (stream) {
                this._getTimelineBar(stream.attr('rel')).eq(0).timeline('markTimelineAsCompleted');
            },

            _singleStreamUnCompletedCallback: function (stream) {
                this._getTimelineBar(stream.attr('rel')).eq(0).timeline('markTimelineAsUnCompleted');
            },

            /**
             * @use: return successor of a timeline(by clone array, not reference)
             * @parameter:
             *     - timeline
             *     - exception
             */
            _succ: function (timeline, exception) {
                var id = timeline.data('clientID');
                if ( !(id in this.relationshipTable) ) { return []; }
                var relationshipTable = $.extend(true, [], this.relationshipTable); //deep copy array, not reference
                var successor = relationshipTable[id];
                exception = exception || [];
                //'remove' is method which extended native Array in core.js
                return successor.remove(exception);
            },

            /**
             * @use: store relationship data into timeline after changes
             * @params:
             *     - relationship: jQuery object
             *     - startTimeline: jQuery object
             *     - endTimeline: jQuery object
             *     - relationshipType: String
             */
            _storeRelationship: function (relationship, startTimeline, endTimeline, relationshipType) {
                var startTimelineId = startTimeline.data('clientID');
                var endTimelineId = endTimeline.data('clientID');
                startTimeline.data(startTimelineId+'&'+endTimelineId, relationship);
                var endTimelineRelationship = endTimeline.data('predecessor');
                if ( endTimelineRelationship == undefined ) {
                    endTimelineRelationship = {};
                    endTimelineRelationship[this.options.RELATIONSHIP_TYPE.SS] = [];
                    endTimelineRelationship[this.options.RELATIONSHIP_TYPE.SF] = [];
                    endTimelineRelationship[this.options.RELATIONSHIP_TYPE.FS] = [];
                    endTimelineRelationship[this.options.RELATIONSHIP_TYPE.FF] = [];
                }
                if ( $.inArray(startTimelineId, endTimelineRelationship[relationshipType]) == -1 ) {
                    endTimelineRelationship[relationshipType].push(startTimelineId);
                    endTimeline.data('predecessor', endTimelineRelationship);
                }
            },

            _toggleDrawingTimeline: function (callback, e) {
                var $button = $(e.currentTarget);
                $button.toggleClass(this.options.cssClass.timelineDrawingBtnDisabled+' '+'CommonButtonLnkCheckboxDisabled');
                this[$button.hasClass(this.options.cssClass.timelineDrawingBtnDisabled)
                    ? '_disableDrawingTimeline'
                    : '_enableDrawingTimeline'
                ]();
                if ( callback !== undefined ) { callback(e); }
            },

            /**
             * @use: convert a group timeline to leaf node(no children)
             * param: stream
             */
            _timelineGroupToLeaf: function (stream) {
                var timelineBars = this._getTimelineBar(stream.attr('rel'));
                timelineBars
                    .removeClass(this.options.cssClass.timelineGroup)
                    .timeline('enableMoving')
                    .timeline('enableResizing');
            },

            /**
             * @use: ..
             */
            _uncompletedStreamCallback: function (uncompletedStream) {
                var opts = this.options;
                var uncompletedTimelineID;
                var uncompletedTimelineGroup = this._getTimelineBar(uncompletedStream.attr('rel')).toArray();
                var childrenStream = this.options.streamList.stream('getChildren', uncompletedStream);
                childrenStream.each(function () {
                    uncompletedTimelineGroup = uncompletedTimelineGroup.concat($($(this).attr('rel')+' .'+opts.cssClass.ganttStream).toArray());
                });

                //mark children timeline as uncompleted
                this._markChildrenTimelineAsUnCompleted(uncompletedTimelineGroup);
                //mark parent timeline as uncompleted, if available
                this._markParentTimelineAsUnCompleted(uncompletedStream);
            },
            _markParentTimelineAsUnCompleted: function (uncompletedStream) {
                if ( uncompletedStream.data('parentClientID') != 0 ) {
                    var parentStream = $('#'+uncompletedStream.data('parentClientID'));
                    if ( parentStream.data('completed') == 0 ) {
                        this._getTimelineBar(parentStream.attr('rel')).eq(0).timeline('markTimelineAsUnCompleted');
                    }
                    if ( parentStream.data('parentClientID') != 0 ) {
                        this._markParentTimelineAsUnCompleted(parentStream);
                    }
                }
            },
            _markChildrenTimelineAsUnCompleted: function (timelineGroup) {
                var self = this;
                var opts = this.options;
                $.each(timelineGroup, function (index, item) {
                    item = $(item);
                    if ( item.data('completed') == 0 ) { return; }

                    if ( item.data('uiTimeline') != undefined ) {
                        item.timeline('markTimelineAsUnCompleted');
                    }
                    else if ( item.data('uiMilestone') != undefined ) {
                        item.milestone('markTimelineAsUnCompleted');
                    }

                    //if item has children
                    if ( item.hasClass(opts.cssClass.timelineGroup) ) {
                        var tbs = $('.'+opts.cssClass.ganttStream).filter(function () {
                            return $(this).data('parentID') == item.data('id');
                        });
                        self._markChildrenTimelineAsUnCompleted(tbs);
                    }
                });
            },

            /**
             * @use: convenient method for '_ajustIndentedGroupTimeline' and '_ajustGroupTimelineScaled'
             */
            _updateTimelineHelper: function (timelineObj, left, width, addBuffer) {
                addBuffer = addBuffer === undefined ? false : addBuffer;
                var timelineData = timelineObj.data();
                if ( timelineData.left == left && timelineData.width == width ) { return false; }

                //update timeline object on UI
                timelineObj
                    .css({
                        left: left,
                        width: width
                    })
                    .data('left', left)
                    .data('width', width);

                //add changes to buffer
                if ( addBuffer ) {
                    //update timeline star/end data
                    var startTime = this.options.calendarApi.calendar('getDateFromPosition', left)/1000;
                    var endTime = startTime + (width/(this.gridUnitSize*2))*(24*3600);
                    Zenwork.Model.addBuffer({
                        id: timelineObj.data('id'),
                        start: startTime,
                        end: endTime - 1 //-1 second to get the end time, eg. 11:59:59
                    }, timelineObj.timeline('option', 'useModel'), Zenwork.Model.CU);
                }
            },

            /**
             * @use: check whether relationship between 2 relationship point is valid(@return true) or not(@return false)
             * @params:
             *     - startRelPoint: jQuery object
             *     - endRelPoint: jQuery object
             */
             _validateRelationship: function (startRelPoint, endRelPoint) {
                //self connection
                if ( startRelPoint.parent().is(endRelPoint.parent()) ) {
                    return false;
                }

                //already exist connection => refuse
                var startTimelineId = startRelPoint.parent().attr('id');
                var endTimelineId = endRelPoint.parent().attr('id');
                if ( (startTimelineId in this.relationshipTable
                        && $.inArray(endTimelineId, this.relationshipTable[startTimelineId]) > -1)
                    || (endTimelineId in this.relationshipTable
                        && $.inArray(startTimelineId, this.relationshipTable[endTimelineId]) > -1)
                ) {
                    return false;
                }

                //belongs to the same stream
                if ( $('#'+startTimelineId).parent().is($('#'+endTimelineId).parent()) ) {
                    return false;
                }

                //nested => refuse
                var startStreamIdSelector = $('#'+startTimelineId).parent().attr('rel');
                var endStreamIdSelector = $('#'+endTimelineId).parent().attr('rel');
                var startStreamElement = $(startStreamIdSelector).parent();
                var endStreamElement = $(endStreamIdSelector).parent();
                if ( startStreamElement.find(endStreamIdSelector).length > 0
                    || endStreamElement.find(startStreamIdSelector).length > 0
                ) {
                    return false;
                }

                //circular connection => refuse
                //if ( circularConnected ) { return false; }

                return true;
            },

            /**
             * @use: check whether available scrolling when mouse on edge while dragging
             * @return: true if available, false in otherwise
             */
            _validateScrollOnEdge: function (onTopEdge, onBottomEdge, onLeftEdge, onRightEdge, contentOffsetX, contentOffsetY, containerBoxModel) {
                if ( (onLeftEdge && containerBoxModel.scrollLeft > 0)
                    || (onRightEdge && contentOffsetX > 0 && containerBoxModel.scrollLeft < contentOffsetX)
                    || (onTopEdge && containerBoxModel.scrollTop > 0)
                    || (onBottomEdge && contentOffsetY > 0 && containerBoxModel.scrollTop < contentOffsetY)
                ) {
                    return this.onDragging;
                }
                return false;
            }
    });

    //version
    $.extend($.ui.planner, {
        version: '1.0'
    });
})(jQuery);

//main app
Zenwork.Planner = {};
Core.Mediator.installTo(Zenwork.Planner);

jQuery(document).ready(function () { //ensure document is ready
    (function ($) {
        var defaultPlanId = $('#streamListSelectionSearch').data('defaultPlanId');

        $('body').css({
            overflow: 'hidden'
        });
        
        //init list control
        Zenwork.List.init();
        Zenwork.List.onListener = 'Zenwork.Planner';
        
        //hook action to Zenwork.List
        Zenwork.List.hook(Zenwork.List.EVENT.CREATE, 'Zenwork.Planner', function (data) {
            //set hash on url
            hasher.setHash(data.id);
        });
        Zenwork.List.hook(Zenwork.List.EVENT.DELETE, 'Zenwork.Planner', function (data) {
            Zenwork.Planner.app.planner('resetApp');
            _toggleAppBtn_(true);
        });

        //handle stream list selection
        var streamListSelectionContainer = $('#streamListSelectionContainer');
        var streamListSelection = $('#streamListSelection');
        var streamListSelectionHeight;
        var streamListSelectionSearch = $('#streamListSelectionSearch');
        var _resetStreamListState_ = function () {
            streamListSelectionSearch.blur();
            streamListSelectionContainer.removeClass('Expanded');
            streamListSelection.find('li.Hidden').removeClass('Hidden');
            streamListSelection.find('li.Error').removeClass('ErrorVisible');
            streamListSelectionSearch.val(streamListSelection.find('a[href="'+Zenwork.List.active+'"]').text());
        }
        streamListSelectionContainer.on('click', function (e) {
            Zenwork.Planner.pub('afterClickSelectionList.Help.Planner');

            Zenwork.Planner.app.planner('option', 'streamList').stream('hideContextMenu');
            if ( streamListSelectionContainer.hasClass('Expanded') ) {
                _resetStreamListState_();
            }
            else {
                streamListSelectionContainer.addClass('Expanded');
                streamListSelectionHeight = streamListSelection.height();
            }
            e.stopPropagation();
        });
        $(document).on('click', function (e) {
            _resetStreamListState_();
        });
        streamListSelection.on('click', 'a', function (e) {
            if ( $(this).hasClass('Readonly') ) { return false; }
            Zenwork.Planner.pub('afterSelectList.Help.Planner');
            //set hash on url
            hasher.setHash($(e.currentTarget).attr('href')); //cause 'parseHash()'
            e.preventDefault();
        });
        streamListSelectionSearch.on('focus', function (e) {
            this.value = '';
        });
        streamListSelectionSearch.on('keydown', function (e) {
            if ( e.which == 38 //up
                || e.which == 40 //down 
            ) {
                var listItem = streamListSelection.find('li a');
                var currentActive = streamListSelection.find('li.Active');
                if ( currentActive.length == 0 ) {
                    currentActive = streamListSelection.find('li:first-child');
                }

                if ( e.which == 40 ) { //down
                    var nextAll = currentActive.hasClass('Active')
                        ? currentActive.nextAll('li:not(".Hidden")')
                        : streamListSelection.find('li:not(".Hidden")');
                    if ( nextAll.length > 1 ) {
                        currentActive.removeClass('Active');
                        currentActive = nextAll.eq(0).addClass('Active');
                    }
                }
                else { //e.which == 38 -> up
                    var prevAll = currentActive.prevAll('li:not(".Hidden")');
                    if ( prevAll.length > 0 ) {
                        currentActive.removeClass('Active');
                        currentActive = prevAll.eq(0).addClass('Active');
                    }
                }
                var _basePos = currentActive.position().top;
                if ( e.which == 40 ) { //down
                    _basePos += currentActive.outerHeight();
                    if ( _basePos > streamListSelectionHeight ) {
                        streamListSelection.scrollTop(streamListSelection.scrollTop() + (_basePos - streamListSelectionHeight));
                    }
                }
                else { //e.which == 38 -> up
                    if ( _basePos < 0 ) {
                        streamListSelection.scrollTop(streamListSelection.scrollTop() + _basePos);
                    }
                }
                return false;
            }
        });
        streamListSelectionSearch.on('keyup', function (e) {
            if ( e.which == 38 //up
                || e.which == 40 //down 
                || e.which == 27 //escape 
            ) { return false; }

            var currentActive = streamListSelection.find('li.Active');

            if ( e.which == 13 ) { //enter
                //set hash on url
                hasher.setHash(currentActive.find('a').attr('href'));
                streamListSelectionContainer.removeClass('Expanded');
                return true;
            }

            currentActive.removeClass('Active');
            var listItem = streamListSelection.find('li:not(".Error") a');
            var search = new RegExp(this.value, 'i');
            var isFound = false;
            listItem.each(function () {
                var $this = $(this);
                if ( !search.test($this.text()) ) {
                    $this.parent().addClass('Hidden');
                }
                else {
                    isFound = true;
                    $this.parent().removeClass('Hidden');
                }
            });
            streamListSelection.find('li:last-child').toggleClass('ErrorVisible', !isFound);
        });

        //handle stream filtering
        var filterStreamListParams = {
            checkedUID: [],
            tag: ''
        }
        var _filterStreamList_ = function (e) {
            filterStreamListParams.checkedUID = [];
            filterStreamListParams.tag = $('#tagFilterTaskView').val();
            $('.UserTaskViewCheckbox:checked').each(function (index, element) {
                filterStreamListParams.checkedUID.push($(element).data('uid'));
            });
            if ( filterStreamListParams.checkedUID.length == 0 ) { 
                alert('Please select at least 1 people');
                return false;
            }
            var filteredData = {
                streams: [],
                relationship: Zenwork.Planner.data.relationship
            };
            $.each(Zenwork.Planner.data.streams, function (index, element) {
                var streamFound = false;

                //filter by people
                $.each(element.Timeline, function (_index, _element) {
                    $.each(_element.User, function (__index, __element) {
                        if ( $.inArray(Number(__element.id), filterStreamListParams.checkedUID) > -1 ) {
                            streamFound = true;
                            return false; //break
                        }
                    });
                    if ( streamFound ) { return false; } //break
                });

                //filter by tag
                if ( streamFound && filterStreamListParams.tag != '' ) {
                    var tmpTags = filterStreamListParams.tag.replace(/\s/g, '').split(',');
                    var tagFound = false;
                    $.each(tmpTags, function (index, value) {
                        if ( new RegExp(value, 'gi').test(element.Stream.tag) ) {
                            tagFound = true;
                            return false; //break;
                        }
                    });
                    if ( !tagFound ) { streamFound = false; }
                }

                if ( streamFound ) {
                    filteredData.streams.push(element);
                    return true; 
                } //continue
            });
            //render data
            loadingOverlays.css({
                height: $(document).height() - topBarHeight
            }).show();
            _initGantControl_();
            _lazy_(filteredData, 1, function () {
                //showing app
                ganttAppOuter.css({
                    height: 'auto'
                });
                loadingOverlays.fadeOut('medium', function () {
                    $('#ganttApp > .Invisible').removeClass('Invisible');
                    //completed rendered callback
                    Zenwork.Planner.app.planner('rendered');

                    //when page first load completed, set reload to true
                    if ( !reload ) {
                        reload = true;
                    }

                    Zenwork.Popup.close(true);
                });
            });
        }
        $('#filterStreamList').on('click', function (e) {
            var pos = {
                my: 'center top',
                at: 'center top+60',
                of: window
            };
            var postUrl = Zenwork.Root+'/planner/filterStreamList/'+Zenwork.List.active;
            Zenwork.Popup.preProcess(pos, true);
            $.ajax({
                type: 'POST',
                url: postUrl,
                dataType: 'html', //receive from server
                contentType: 'json', //send to server
                data: JSON.stringify(filterStreamListParams),
                success: function (data, textStatus, jqXHR) {
                    Zenwork.Popup.show(data);

                    $('.UserTaskViewCheckbox').on('change', function (e) {
                        var $this = $(this);
                        $($this.attr('rel')).toggleClass('Checked', $this.is(':checked'));
                    });

                    $('#updateStreamListFilter').on('click', function (e) {
                        _filterStreamList_(e);
                        return false;
                    });
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if ( textStatus !== 'abort' ) {
                        alert('Really sorry for this, network error! Please try again!');
                    }
                }
            });
            return false;
        });
        $('#setDefaultPlanBtn').on('change', function (e) {
            Zenwork.Notifier.notify('Updating...', 0);
            $.ajax({
                type: 'POST',
                url: Zenwork.Root+'/planner/setDefaultPlan/'+($(this).is(':checked') ? Zenwork.List.active : 0),
                dataType: 'json', //receive from server
                success: function (data, textStatus, jqXHR) {
                    Zenwork.Notifier.notify('Updated', 0);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if ( textStatus !== 'abort' ) {
                        alert('Really sorry for this, network error! Please try again!');
                    }
                }
            });
        });

        //gant dialog
        Zenwork.Dialog.container = $('#ganttTimelineContainer');

        //Relationship dialog(Singleton)
        Zenwork.Planner.RelationshipDialog = new function () {
            var self = this;
            var relationshipDialog = $('#relationshipDialog');
            var relationshipList = $('#relationshipList');
            var onTimeline = null;
            var remoteTarget;

            var _util_ = function (data, className/*Pre or Succ*/) {
                var html = '<ul>';
                $.each(data, function () {
                    var itemData = $($('#'+this).parent().attr('rel')).data();
                    html += '<li><a class="ClearRelLnk '+className+'" href="#'+this+'" title="" rel="#'+itemData.clientID+'">'+itemData.index+'. '+itemData.name+'</a>';
                });
                html += '</ul>';
                return html;
            }
            var _updateView_ = function () {
                relationshipDialog
                    .position({
                        my: 'left top+3',
                        at: 'left bottom',
                        of: remoteTarget,
                        within: Zenwork.Dialog.container,
                        collision: 'flipfit'
                    });
            }
            var _unHighlight_ = function () {
                $('.DelRelHighlightStream').removeClass('ui-selected');
                $('.DelRelHighlightTimeline').removeClass('GanttTimelineHighlight');
            }
            
            this.show = function (e, target, pre, succ, _remoteTarget_) {
                remoteTarget = _remoteTarget_ || target;
                var data = '';
                if ( pre.length > 0 || succ.length > 0 ) {
                    if ( pre.length > 0 ) {
                        data += '<h2>Predecessor</h2>';
                        data += _util_(pre, 'Pre');
                    }
                    
                    if ( succ.length > 0 ) {
                        data += '<h2>Successor</h2>';
                        data += _util_(succ, 'Succ');
                    }
                }
                else {
                    data = '<p>No relationship exists</p>';
                }
                relationshipList.html(data);
                relationshipDialog.removeClass('Hidden');
                onTimeline = target;
                _updateView_();
            }

            //constructor
            relationshipDialog.on('mousedown', function (e) {
                e.stopPropagation();            
            });
            relationshipDialog.on('click', '.ClearRelLnk', function (e) {
                Zenwork.Window.confirm('Sure?', function () {
                    var target = $(e.currentTarget);
                    if ( target.hasClass('Succ') ) {
                        Zenwork.Planner.app.planner('clearRelationship', onTimeline, $(target.attr('href')));
                    }
                    else { //target.hasClass('Pre')
                        Zenwork.Planner.app.planner('clearRelationship', $(target.attr('href')), onTimeline);
                    }
                    var li = target.parent();
                    var parent = li.parent(); //a -> li -> ul
                    li.remove();
                    if ( parent.find('li').length == 0 ) {
                        parent.prev().remove();
                        parent.remove();
                    }
                    if ( relationshipList.is(':empty') ) {
                        Zenwork.Dialog.close(relationshipDialog);
                    }
                    else {
                        _updateView_();
                    }
                    _unHighlight_();

                    //flush data from buffer
                    Zenwork.Model.flush();
                });
                return false;
            });
            relationshipDialog.on('mouseenter', '.ClearRelLnk', function (e) {
                var stream = $($(e.target).attr('rel'));
                var timeline = $(stream.attr('rel'));
                stream.addClass('ui-selected DelRelHighlightStream');
                timeline.addClass('GanttTimelineHighlight DelRelHighlightTimeline');
            });
            relationshipDialog.on('mouseleave', '.ClearRelLnk', function (e) {
                _unHighlight_();
            });
            Zenwork.Dialog.add(relationshipDialog.data('ui', this));
        }

        //app setting
        var ganttAppOuter = $('#ganttApp');
        var currentMonth = Zenwork.Now.getMonth();
        var currentYear = Zenwork.Now.getFullYear();
        Zenwork.Planner.Config = {
            baseURL: Zenwork.Root+'/planner', //required
            outer: ganttAppOuter, //required
            streamList: $('#streamList'), //required
            streamBaseIndex: 0,
            calendarGrid: { //required
                element: $('#ganttCalendar'), //required
                container: $('#ganttTimelineContainer'), //required
                monthRow: $('#ganttCalendarMonthRow'), //required
                dayRow: $('#ganttCalendarDayRow'), //required
                clip: $('#gantTimelineClip'), //required
                syncClip: $('.StreamListClip'), //optional
                content: $('#ganttTimelineList'), //required
                unitSize: 15,
                startTime: new Date(currentYear, currentMonth, 1, 0, 0, 0), //required
                endTime: new Date(currentYear, currentMonth, Date.getDaysInMonth(Zenwork.Now.getFullYear(), Zenwork.Now.getMonth()), 23, 59, 59) //required
            },
            fakeScroll: $('#ganttCalendarFakeScroll'), //required
            timelineConfig: { //optional
                gridModel: {
                    unitSize: 15,
                    leftEdge: 0
                }
            },
            toolbar: [
                { //add timeline
                    button: $('#addGanttTimelineTrigger'),
                    event: 'click',
                    method: 'addTimeline',
                    params: [{}, true] //{} -> empty config, isAjax = true
                },
                { //add milestone
                    button: $('#addGanttMilestoneTrigger'),
                    event: 'click',
                    method: 'addMilestone',
                    params: [{}, true] //{} -> empty config, isAjax = true
                },
                { //toggle draw timeline
                    button: $('#drawTimelineTrigger'),
                    event: 'click',
                    method: 'toggleDrawingTimeline',
                    params: []
                },
                { //clear document
                    button: $('#clearDocument'),
                    event: 'click',
                    method: 'clearDocument',
                    params: []
                }
            ]
        }

        //lazy render DOM
        var lazyTimer;
        var _lazy_ = function (data, limit, callback) {
            var delay = 1;
            limit = limit || 20;
            /**
             * data {
             *    streams: Array,
             *    relationship: Array
             * }
             */
            $.each(data.streams.splice(0, limit), function (index, streamData) {
                streamData.Stream.countAttachment = streamData.Attachment.length;
                streamData.Stream.countComment = streamData.Scomment.length;
                Zenwork.Planner.app.planner('addTimeline', {
                    Stream: streamData.Stream,
                    Timeline: streamData.Timeline
                }, false);
            });

            if ( data.streams.length > 0 ) {
                Zenwork.Notifier.notify('Preparing UI...remaining('+data.streams.length+' items)', 0);
                lazyTimer = setTimeout(function () {
                    _lazy_(data, limit, callback);
                }, delay);
            }
            else {
                Zenwork.Notifier.notify('Ready!', 0.5);
                //render relationship
                Zenwork.Planner.app.planner('renderRelationship', data.relationship);

                //callback
                if ( callback !== undefined ) { callback(); }
            }
        }

        //preparing app overlays
        var loadingOverlays = Zenwork.Planner.loadingOverlays = $('<div id="appLoadingOverlays"></div>').appendTo('#ganttApp');
        var topBarHeight = $('#app_top_bar').height();
        var initAppHeight = $(document).height() - topBarHeight;
        ganttAppOuter.css({
            height: initAppHeight
        });
        loadingOverlays.css({
            top: topBarHeight
        });
        $(window).on('resize', function (e) {
            loadingOverlays.css({
                height: $(document).height() - topBarHeight
            });
        });
        //load app data & render function
        var reload = false;
        var streamNameSearchBox = $('#streamNameSearchBox');
        streamNameSearchBox.on('keyup', function (e) {
            if ( e.which == 13 ) {
                var keyword = this.value;
                var searchData = {
                    streams: [],
                    relationship: Zenwork.Planner.data.relationship
                };
                $.each(Zenwork.Planner.data.streams, function (index, element) {
                    //search by name
                    if ( new RegExp(keyword, 'gi').test(element.Stream.name) ) {
                        searchData.streams.push(element);
                        return true; //continue;
                    }
                });

                //render data
                loadingOverlays.css({
                    height: $(document).height() - topBarHeight
                }).show();
                _initGantControl_();
                _lazy_(searchData, 1, function () {
                    //showing app
                    ganttAppOuter.css({
                        height: 'auto'
                    });
                    loadingOverlays.fadeOut('medium', function () {
                        $('#ganttApp > .Invisible').removeClass('Invisible');
                        //completed rendered callback
                        Zenwork.Planner.app.planner('rendered');

                        //when page first load completed, set reload to true
                        if ( !reload ) {
                            reload = true;
                        }
                    });
                });
            }
        });
        var _toggleAppBtn_ = function (disable) {
            disable = disable || false;
            Zenwork.List.toggleEditing(!disable);
            $('.GanttToolbarBtn').toggleClass('Hidden', disable);
            if ( disable ) {
                streamNameSearchBox.attr('disabled', 'disabled');
            }
            else {
                streamNameSearchBox.removeAttr('disabled');
            }
        }
        var _404_ = function (msg, callback) {
            //toolbar and buttons
            _toggleAppBtn_(true); //true -> disable
            Zenwork.Notifier.notify(msg !== undefined && msg !== '' ? msg : 'Sorry can not find any document as you want<br />Please pick another one from the list box<br />or create a new one by your own!');
            loadingOverlays.fadeOut('medium', function () {
                $('#ganttApp > .Invisible').removeClass('Invisible');

                //when page first load completed, set reload to true
                if ( !reload ) {
                    reload = true;
                }

                if ( callback !== undefined ) { callback(); }
            });
        }
        var _initGantControl_ = function () {
            if ( reload ) { //reset
                Zenwork.Planner.app.planner('option', 'listID', Zenwork.Planner.Config.listID);
                Zenwork.Planner.app.planner('resetApp');
            }
            else { //first time loading, init app control
                Zenwork.Planner.app = $('#ganttTimelineList').planner(Zenwork.Planner.Config);
            }
            _toggleAppBtn_();
        }
        var _publishFirstHelp_ = function () {
            Zenwork.Planner.pub('selectPlan.Help.Planner', '#streamListSelection');
            Zenwork.Planner.pub('createFirstPlan.Help.Planner', '#createNewStreamList');
        }
        var _loadApp_ = function (id, lazyLimit, callback) {
            filterStreamListParams = {
                checkedUID: [],
                tag: ''
            }
            _toggleAppBtn_(true); //disable all button before finish loading

            loadingOverlays.css({
                height: $(document).height() - topBarHeight
            }).show();

            if ( id == 0 ) {
                _initGantControl_();
                _404_('Please select a plan or create a new one', function () {
                    if ( callback !== undefined ) { callback(); }
                });
                return;
            }

            //loading data
            Zenwork.Notifier.notify('Loading data from server...');
            if ( lazyTimer !== undefined ) { clearTimeout(lazyTimer); }
            Zenwork.Planner.Config.listID = id;
            $.ajax({
                type: 'POST',
                url: Zenwork.Planner.Config.baseURL+'/getData/'+id,
                dataType: 'json', //receive from server
                contentType: 'json', //send to server
                data: JSON.stringify({}),
                success: function (data, textStatus, jqXHR) {
                    Zenwork.Planner.data = $.extend(true, {}, data); //clone 'data' and store locally

                    if ( data === 403 ) { //forbidden access app
                        Zenwork.Notifier.notify('Sorry! You are not allow to view this page!');
                        loadingOverlays.fadeOut('medium', function () {
                            if ( callback !== undefined ) { callback(); }
                        });
                        return;
                    } //return

                    if ( data === 404 ) { //stream list not found
                        //init gantt control
                        _initGantControl_();
                        _404_('', function () {
                            if ( callback !== undefined ) { callback(); }
                        });
                        return;
                    } //return

                    //set calendar range
                    if ( data.timeRange.length > 0 ) {
                        Zenwork.Planner.Config.calendarGrid.timeBefore = 5;
                        Zenwork.Planner.Config.calendarGrid.timeAfter = 5;
                        Zenwork.Planner.Config.calendarGrid.startTime = new Date(data.timeRange[0]*1000);
                        Zenwork.Planner.Config.calendarGrid.startTime.setHours(0, 0, 0);
                        Zenwork.Planner.Config.calendarGrid.endTime = new Date(data.timeRange[1]*1000);
                        Zenwork.Planner.Config.calendarGrid.endTime.setHours(23, 59, 59);
                    }
                    else {
                        Zenwork.Planner.Config.calendarGrid.timeBefore = 0;
                        Zenwork.Planner.Config.calendarGrid.timeAfter = 0;
                    }

                    //init gantt control
                    _initGantControl_();
                    if ( defaultPlanId != id ) {
                        $('#setDefaultPlanBtn').removeAttr('checked');
                    }
                    else {
                        $('#setDefaultPlanBtn').attr('checked', 'checked');
                    }

                    //render data
                    _lazy_(data, lazyLimit, function () {
                        //showing app
                        ganttAppOuter.css({
                            height: 'auto'
                        });
                        loadingOverlays.fadeOut('medium', function () {
                            $('#ganttApp > .Invisible').removeClass('Invisible');
                            //completed rendered callback
                            Zenwork.Planner.app.planner('rendered');

                            //when page first load completed, set reload to true
                            if ( !reload ) {
                                reload = true;
                            }

                            if ( callback !== undefined ) { callback(); }

                            Zenwork.Planner.pub('createFirstTask.Help.Planner', '#addGanttTimelineTrigger');
                        });
                    });
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if ( textStatus !== 'abort' ) {
                        alert('Really sorry for this, network error! Please try again!');
                    }
                }
            });
        }

        //MAIN ENTRANCE: route the app
        var urlHashCookie = $.cookie('urlHash');
        if ( urlHashCookie !== undefined && urlHashCookie != '') {
            $.removeCookie('urlHash', {path: '/'});
            window.location = window.location + '#' + urlHashCookie;
        }
        //setup #Hasher
        function parseHash (newHash, oldHash) { //callback when 'setHash'
            newHash = newHash.indexOf('?') > 0 ? newHash.substr(0, newHash.indexOf('?')) : newHash;
            if (newHash !== oldHash) {
                if ( newHash !== '' ) { //open stream list as in hash '!id'
                    Zenwork.List.active = newHash;
                    $('#streamListSelection li.Active').removeClass('Active');
                    var listItem = $('#streamListSelection li a[href="'+Zenwork.List.active+'"]').eq(0);
                    listItem.parent().addClass('Active');
                    Zenwork.Planner.creatorID = listItem.attr('data-creator-id');
                    streamListSelectionSearch.val(listItem.text());
                }
                _loadApp_(Zenwork.List.active, 1, function () {
                    crossroads.parse(window.location.href.match('/planner.*').toString());
                    _publishFirstHelp_();
                });
            }
        }
        hasher.prependHash = '!';
        hasher.changed.add(parseHash); //parse hash changes
        hasher.initialized.add(parseHash); //parse initial hash
        hasher.init(); //start listening for history change

        //setup Crossroads
        crossroads.addRoute('/planner', function() {
            //load default plan
            if( defaultPlanId != 0 ) {
                hasher.setHash(defaultPlanId);
            }
        });
        crossroads.addRoute('/planner#!{id}{?query}', function(id, query) {
            // query strings are decoded into objects
            Zenwork.Planner.app.planner('viewStream', query.sid);
        });
    })(jQuery);
});

//automate test: remove when going to production
var scripts = [
    {
        action: 'add',
        data: 20
    },
    {
        action: 'indent',
        data: [2, 5]
    },
    {
        action: 'add',
        data: 18
    },
    {
        action: 'indent',
        data: [3, 3, 4, 6, 8, 9, 10, 11, 12, 13, 14, 15, 20]
    },
    {
        action: 'add',
        data: 230
    },
    {
        action: 'indent',
        data: [30, 30, 45, 47, 59, 64, 65, 66, 67, 68, 68, 98, 99, 99, 100, 102, 102, 103, 105, 105, 145, 189, 189, 196, 203, 204, 204, 205, 205, 205, 206, 206, 240, 241, 242, 243, 243, 259, , 270, 271, 272, 272, 289, 290, 291, 291, 292, 292, 293, 294]
    },
];
jQuery(document).ready(function () { //ensure document is ready
    (function ($) {
        Zenwork.Debug.robot($, scripts);
    })(jQuery);
});
Zenwork.Debug.robot = function ($, scripts) {
    if ( !Zenwork.Debug.enable ) { 
        $('#robot').remove();
        return false;
    }

    //for testing only, remove on production
    var batch = function (jobs, callback) {
        callback = callback || function () { alert('Batch jobs completed!') }
        var addCount = 0;
        var done = 0;
        var pending = false;
        var _callback_ = function () {
            done++;
            pending = false;
            if ( done == jobs.length ) {
                callback();
            }
        }
        $.each(jobs, function (index, job) {
            switch (job.action) {
                case 'add':
                    var addInterval = setInterval(function () {
                        if ( pending ) { return false; }

                        clearInterval(addInterval);
                        pending = true;
                        addCount += job.data;
                        var robotInterval = setInterval(function () {
                            if ( $('.StreamElement').length == addCount ) {
                                if ( $('.StreamElement:visible').length == addCount ) {
                                    clearInterval(robotInterval);
                                    _callback_();
                                }
                            }
                            else {
                                $('#addGanttTimelineTrigger').trigger('click');
                            }
                        }, 10);
                    }, 100);                        
                    break;
                case 'indent':
                    var indentInterval = setInterval(function () {
                        if ( pending ) { return false; }

                        clearInterval(indentInterval);
                        pending = true;
                        $.each(job.data, function (index, value) {
                            $('.StreamContextBtn').eq(value-1).trigger('mousedown.stream');
                            setTimeout(function () {
                                $('.StreamIndentBtn').eq(0).trigger('click.stream');
                                if ( index == job.data.length-1 ) {
                                    _callback_();
                                }
                            }, 1)
                        });
                    }, 100);
                    break;
                case 'outdent':
                    var indentInterval = setInterval(function () {
                        if ( pending ) { return false; }

                        clearInterval(indentInterval);
                        pending = true;
                        $.each(job.data, function (index, value) {
                            $('.StreamContextBtn').eq(value-1).trigger('mousedown.stream');
                            setTimeout(function () {
                                $('.StreamOutdentBtn').eq(0).trigger('click.stream');
                                if ( index == job.data.length-1 ) {
                                    _callback_();
                                }
                            }, 1)
                        });
                    }, 100);
                    break;
                case 'delete':
                    var deleteInterval = setInterval(function () {
                        if ( pending ) { return false; }

                        clearInterval(deleteInterval);
                        pending = true;
                        $.each(job.data, function (index, value) {
                            $('.StreamMarker a').filter(function (index) {
                                return $.inArray((index+1), job.data) > -1;
                            }).addClass('StreamMarked');
                            $('#streamGroupContextMenu .StreamDeleteBtn').trigger('click.stream');
                            if ( index == job.data.length-1 ) {
                                _callback_();
                            }
                        });
                    }, 100);
                    break;
            }
        });
    }
    
    $('#robot').on('click', function (e) {
        var $this = $(this).addClass('Pending');
        $this.text('Robot is running...');
        batch(scripts, function () {
            $this.text('Robot completed').removeClass('Pending');
            Zenwork.Notifier.notify('Batch jobs completed');
        });
        return false;
    });
}
