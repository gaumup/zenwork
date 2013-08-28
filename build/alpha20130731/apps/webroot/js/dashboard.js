Zenwork.Dashboard = {};

jQuery(document).ready(function () {
    (function($) {
        $('.jscrollpane').each(function() {
            Zenwork.Plugins.jScrollPane.call(this);
        });

        Zenwork.Dashboard.LineChartModel = function (canvas) {
            var _drawChart_ = function (ctx, $canvas, opts) {
                ctx.clearRect(0, 0, $canvas.attr('width'), $canvas.attr('height'));
                $canvas.attr('width', $canvas.parent().width());
                new Chart(ctx).Line(
                    {
                        labels : opts.labels,
                        datasets : opts.datasets
                    },
                    $.extend({}, Zenwork.Chart.Line.defaults, opts.config)
                );
            }
            var api = { //export api
                canvas: canvas,
                ctx: canvas.get(0).getContext('2d'),
                store: {
                    /*
                     * key: {
                     *    fillColor : 'rgba(220,220,220,0.5)',
                     *    strokeColor : 'rgba(220,220,220,1)',
                     *    pointColor : 'rgba(220,220,220,1)',
                     *    pointStrokeColor : '#fff',
                     *    data : [100, 80, 90, 95, 110, 100, 50, 0, 0, 0, 0, 0]
                     * }
                     */
                },
                getDatasets: function () {
                    var datasets = [];
                    for ( key in this.store ) {
                        datasets.push(this.store[key]);
                    }
                    return datasets;
                },
                set: function (key, data) {
                    this.store[key].data = data;
                    _drawChart_(this.ctx, this.canvas, {
                        config: this.config,
                        labels: this.labels,
                        datasets: this.getDatasets()
                    });
                },
                setDatasets: function (datasets) {
                    for ( var key in datasets ) {
                        this.store[key] = datasets[key];
                    }
                    _drawChart_(this.ctx, this.canvas, {
                        config: this.config,
                        labels: this.labels,
                        datasets: this.getDatasets()
                    });
                },
                setLabels: function (labels) {
                    this.labels = labels;
                },
                config: function (cfg) {
                    this.config = cfg;
                } 
            }
            $(window).on('resize', function (e) {
                _drawChart_(api.ctx, api.canvas, {
                    config: api.config,
                    labels: api.labels,
                    datasets: api.getDatasets()
                });
            });

            return api;
        };

    /* Today block js code */
        //today task list behavior
        var todayTaskListjsp = $('#todayTaskListJScrollPane');
        var todayTaskList = $('#todayTaskList');
        var todayCompletedTask = $('#todayCompletedTask');
        var userStatisticModel = new Zenwork.Dashboard.LineChartModel($('#myTaskStatistic'));
        userStatisticModel.config({
            scaleOverride: true,
            scaleSteps: 10,
            scaleStepWidth: 20,
            scaleStartValue: 0,
            scaleLabel: '<%=value%> %'
        });
        //load today task list data
        $.ajax({
            type: 'POST',
            url: Zenwork.Root+'/dashboard/getTaskList',
            dataType: 'json', //receive from server
            contentType: 'json', //send to server
            data: JSON.stringify({}),
            success: function (data, textStatus, jqXHR) {
                var monthlyTasks = [];
                var monthlyCompletedTasks = [];

                todayCompletedTask.removeClass('Hidden');
                $('#todayTotalTask').text(data.all.length);
                $('#todayCompletedTask > strong').text(data.completed.length);
                if ( data.today.length > 0 ) {
                    //render today task list
                    $.each(data.today, function (index, value) {
                        todayTaskList.tasklist('addNewStream', value.Stream, false, 'bottom', function (stream) {
                            $.each(data.todayCompleted, function () {
                                if ( this.Stream.id == stream.data('id') ) {
                                    stream.addClass('TodayCompleted');
                                    return false; //break;
                                }
                            });
                            
                        });
                    });
                }
                else {
                    $('#todayTaskListEmptyBlock').removeClass('Hidden');
                }
                todayTaskListjsp.removeClass('ZWPending').data('jsp').reinitialise();

                //preparing data for user monthly statistic chart
                $.each(data.all, function (index, value) {
                    var startOn = new Date(value.Timeline.start*1000);
                    var deadline = new Date(value.Timeline.end*1000);
                    var totalEffortInPercent = value.Users_timeline.effort*100/(new TimeSpan(deadline - startOn).getDiffDays());
                    var month = startOn.getMonth();
                    var year = startOn.getFullYear();
                    var lastDayInMonth = startOn.clone().moveToLastDayOfMonth().add({
                        hours: 23,
                        minutes: 59,
                        seconds: 59
                    });
                    var effortInMonth = new TimeSpan((deadline.isAfter(lastDayInMonth) ? lastDayInMonth : deadline) - startOn).getDiffDays()*totalEffortInPercent/100;
                    var workloadInMonth = effortInMonth*100/Date.getDaysInMonth(year, month);
                    monthlyTasks[month] = monthlyTasks[month] === undefined
                        ? workloadInMonth
                        : monthlyTasks[month] + workloadInMonth;
                    if ( value.Users_timeline.completed > 2 ) {
                        monthlyCompletedTasks[month] = monthlyCompletedTasks[month] === undefined
                            ? workloadInMonth
                            : monthlyCompletedTasks[month] + workloadInMonth;
                    }

                    //calculate the extend out of month if deadline > last day in month
                    //!warning: recursive until deadline < last day in month
                    var nextMonth = month+1;
                    var fisrtDayInNextMonth = lastDayInMonth.clone().add({seconds: 1});
                    var lastDayInNextMonth = lastDayInMonth.clone().add({months: 1});
                    var effortInNextMonth = new TimeSpan((deadline.isAfter(lastDayInNextMonth) ? lastDayInNextMonth : deadline) - fisrtDayInNextMonth).getDiffDays()*totalEffortInPercent/100;
                    while (effortInNextMonth > 0) {
                        var _workload_ = effortInNextMonth*totalEffortInPercent/Date.getDaysInMonth(year, nextMonth);
                        monthlyTasks[nextMonth] = monthlyTasks[nextMonth] === undefined
                            ? _workload_
                            : monthlyTasks[nextMonth] + _workload_;
                        if ( value.Users_timeline.completed > 2 ) {
                            monthlyCompletedTasks[nextMonth] = monthlyCompletedTasks[nextMonth] === undefined
                                ? _workload_
                                : monthlyCompletedTasks[nextMonth] + _workload_;
                        }
                        nextMonth++;
                        fisrtDayInNextMonth.addMonths(1);
                        lastDayInNextMonth.addMonths(1).setDate(Date.getDaysInMonth(year, nextMonth));
                        effortInNextMonth = new TimeSpan((deadline.isAfter(lastDayInNextMonth) ? lastDayInNextMonth : deadline) - fisrtDayInNextMonth).getDiffDays()*totalEffortInPercent/100;
                    }
                });

                //draw chart
                $('#myTaskStatisticChartBlock').removeClass('ZWPending');
                userStatisticModel.setLabels(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
                userStatisticModel.setDatasets({
                    planning: { //planning
                        fillColor : 'rgba(220, 220, 220, 0.5)',
                        strokeColor : 'rgba(220, 220, 220, 1)',
                        pointColor : 'rgba(220, 220, 220, 1)',
                        pointStrokeColor : '#fff',
                        data : $.extend([], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], monthlyTasks)
                    },
                    actual: { //actual
                        fillColor : 'rgba(151, 187, 205, 0.5)',
                        strokeColor : 'rgba(151, 187,205 ,1)',
                        pointColor : 'rgba(151, 187, 205, 1)',
                        pointStrokeColor : '#fff',
                        data : $.extend([], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], monthlyCompletedTasks)
                    }
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if ( textStatus !== 'abort' ) {
                    alert('Really sorry for this, network error! Please try again!');
                }
            }
        });

        Zenwork.Plugins.jScrollPane.call(todayTaskListjsp, {verticalGutter: 0}); //init jscrollpane for todayTaskList
        todayTaskList.tasklist({ //init tasklist widget
            //options
            baseIndex: 0,
            customFieldsList: {},

            //event callback
            add: function (e, stream, callback) {
                //no thing todo
            },
            completed: function (e, stream) {
                //no thing todo
            },
            uncompleted: function (e, stream) {
                //no thing todo
            },
            deleted: function (e, stream) {
                //no thing todo
            },
            deletedAll: function (e, stream) {
                //no thing todo
            },
            selecting: function (e, stream) {
                //no thing todo
            },
            selected: function (e, stream) {
                //no thing todo
            },
            unselecting: function (e, stream) {
                //no thing todo
            },
            unselected: function (e, stream) {
                //no thing todo
            },
            collapsed: function (e, stream) {
                //no thing todo
            },
            expanded: function (e, stream) {
                //no thing todo
            },
            collapsedAll: function (e) {
                //no thing todo
            },
            expandedAll: function (e) {
                //no thing todo
            },
            indented: function (e, stream) {
                //no thing todo
            },
            outdented: function (e, stream, oldParentStream, oldIndex, newIndex) {
                //no thing todo
            },
            singleCompleted: function (e, stream) {
                //no thing todo
            },
            singleUnCompleted: function (e, stream) {
                //no thing todo
            },
            sorting: function (e, stream, oldIndex, newIndex, oldParentStreamID, newParentStreamID, oldParentStream) {
                //no thing todo
            }
        });

        //add new task
        $('.ZWAddNewBtn').bind('click', function (e) {
            var $this = $(this).addClass('Pending');

            todayTaskList.tasklist('addNewStream', 
                {
                    streamExtendModel: 'Task'
                }, 
                true,
                'top',
                function (stream) {
                    $('#todayTaskListEmptyBlock').addClass('Hidden');
                    $this.removeClass('Pending')
                    stream.find('.StreamDetailsBtn').trigger('mousedown');
                }
            );
            return false;
        });

        //create model
        Zenwork.Model.createModel('Timeline', function (timelineData) {
            return { 'Timeline': $.extend({}, timelineData) };
        });
        Zenwork.Model.createModel('Users_timeline', function (data) {
            return { 'Users_timeline': $.extend({}, data) };
        });
    /* End. Today block js code */

    /* Team progress block js code */
        if ( $('#teamProgressBurndown').length > 0 ) {
            $('#teamProgressBurndownChartBlock').removeClass('ZWPending');
            var teamProgressBurndownModel = new Zenwork.Dashboard.LineChartModel($('#teamProgressBurndown'));
            teamProgressBurndownModel.config({
                bezierCurve: false,
                scaleOverride: false,
                scaleLabel: '<%=value%>'
            });
            teamProgressBurndownModel.setLabels(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
            teamProgressBurndownModel.setDatasets({
                planning: { //planning
                    fillColor : 'rgba(220, 220, 220, 0.5)',
                    strokeColor : 'rgba(220, 220, 220, 1)',
                    pointColor : 'rgba(220, 220, 220, 1)',
                    pointStrokeColor : '#fff',
                    data : $.extend([], [0, 0, 0, 0, 0, 0, 0], [60, 50, 40, 30, 20, 10, 0])
                },
                actual: { //actual
                    fillColor : 'rgba(151, 187, 205, 0.5)',
                    strokeColor : 'rgba(151, 187,205 ,1)',
                    pointColor : 'rgba(151, 187, 205, 1)',
                    pointStrokeColor : '#fff',
                    data : $.extend([], [0, 0, 0, 0, 0, 0, 0], [55, 45, 38, 24, 26, 8, 0])
                }
            });
        }
    /* End. Team progress block js code */

    /* Resource usage block js code */
        if ( $('#teamResourceStatistic').length > 0 ) {
            $('#teamResourceChartBlock').removeClass('ZWPending');
            var teamResourceStatisticModel = new Zenwork.Dashboard.LineChartModel($('#teamResourceStatistic'));
            teamResourceStatisticModel.config({
                scaleOverride: true,
                scaleSteps: 10,
                scaleStepWidth: 20,
                scaleStartValue: 0,
                scaleLabel: '<%=value%> %'
            });
            teamResourceStatisticModel.setLabels(['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']);
            teamResourceStatisticModel.setDatasets({
                planning: { //planning
                    fillColor : 'rgba(220, 220, 220, 0.5)',
                    strokeColor : 'rgba(220, 220, 220, 1)',
                    pointColor : 'rgba(220, 220, 220, 1)',
                    pointStrokeColor : '#fff',
                    data : $.extend([],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [160, 50, 40, 30, 20, 10, 0, 0, 50, 40, 30, 20, 10, 0, 0, 50, 40, 30, 20, 10, 0, 0, 50, 40, 30, 20, 10, 0, 34, 56]
                    )
                },
                actual: { //actual
                    fillColor : 'rgba(151, 187, 205, 0.5)',
                    strokeColor : 'rgba(151, 187,205 ,1)',
                    pointColor : 'rgba(151, 187, 205, 1)',
                    pointStrokeColor : '#fff',
                    data : $.extend([],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [55, 45, 38, 24, 26, 8, 0, 0, 55, 45, 38, 24, 26, 8, 0, 0, 55, 45, 38, 24, 26, 8, 0, 0, 50, 40, 30, 20, 10, 0, 34, 56]
                    )
                }
            });
        }
    /* End. Resource usage block js code */
    })(jQuery);
});

(function($) {
    $.widget('ui.tasklist', $.ui.stream, {
        widgetNamespace: 'tasklist',
        widgetEventPrefix: 'tasklist',

        //options
            options: {
                cssClass: {
                    streamExtendModel: 'StreamExtendModel',
                    streamExtendModelTask: 'StreamExtendModelTask',
                    unassignedTask: 'UnassignedTask'
                },
                selectable: false,
                isUserScroll: true
            },

        //constructor
            _create: function () {
                var opts = this.options;
                var self = this;
                this._super.call(this);
                this.element.on('click', '.'+opts.cssClass.streamCommentBtn+', .'+opts.cssClass.streamAttachmentBtn, function (e) {
                    var $target = $(e.currentTarget);
                    self._openStreamDetails(e, $($target.attr('href')), $target.attr('rel'));
                    return false;
                });
                var disableWindowScrolling = false;

                var listjsp =  $('#todayTaskListJScrollPane');
                var jspApi = listjsp.data('jsp');
                var currListScollTop = jspApi.getContentPositionY();
                listjsp.bind('jsp-scroll-y', function(e, scrollPositionY, isAtTop, isAtBottom) {
                    //console.log('Handle jsp-scroll-y', this,
                    //            'scrollPositionY=', scrollPositionY,
                    //            'isAtTop=', isAtTop,
                    //            'isAtBottom=', isAtBottom);
                    if ( currListScollTop !== scrollPositionY ) {
                        Zenwork.StreamPopup.close();
                    }
                });
                this.element.hover(
                    function (e) {
                        Zenwork.Window.toggleWindowScrolling(false);
                    },
                    function (e) {
                        Zenwork.Window.toggleWindowScrolling(true);
                    }
                );

                var currWindowScollTop = $(window).scrollTop();
                $(window).bind('scroll', function (e) {
                    if ( opts.isUserScroll && currWindowScollTop !== $(window).scrollTop() ) {
                        Zenwork.StreamPopup.close();
                    }
                });
                this.element.on('mousedown.stream', '.'+opts.cssClass.streamDetailsBtn, function (e) {
                    currListScollTop = jspApi.getContentPositionY();
                    currWindowScollTop = $(window).scrollTop();
                    jspApi.scrollToElement($($(e.currentTarget).attr('href')));
                    var scrollOffset = $(e.currentTarget).offset().top - $(window).scrollTop() - $('header').height() - 20;
                    if ( scrollOffset < 0 ) {
                        opts.isUserScroll = false;
                        window.scrollTo(0, $(window).scrollTop() + scrollOffset);
                        currWindowScollTop += scrollOffset;
                        setTimeout(function () {
                            opts.isUserScroll = true;
                        }, 100);
                    }
                    Zenwork.Dialog.close();
                    //hopeless :(
                    Zenwork.Popup.getTitle().find('input').focus();
                });

                //listen comment event
                this.element.on(
                    Zenwork.Comment.EVENT.POST+' '+Zenwork.Comment.EVENT.DELETED+' '+Zenwork.Comment.DELETED_ATTACHMENT,
                    '.'+opts.cssClass.streamRow,
                    function (e) {
                        var stream = $(e.currentTarget);
                        var streamData = stream.data();

                        //count comment
                        stream.find('.'+opts.cssClass.streamCommentBtn+' span').text(streamData.countComment);

                        //count attachment
                        stream.find('.'+opts.cssClass.streamAttachmentBtn+' span').text(streamData.countAttachment);
                    }
                );

                //listen attachment event
                this.element.on(
                    Zenwork.Uploader.EVENT.UPLOADED+' '+Zenwork.Uploader.EVENT.DELETED,
                    '.'+opts.cssClass.streamRow,
                    function (e) {
                        var stream = $(e.currentTarget);
                        var streamData = stream.data();
                        
                        //count comment
                        stream.find('.'+opts.cssClass.streamCommentBtn+' span').text(streamData.countComment);

                        //count attachment
                        stream.find('.'+opts.cssClass.streamAttachmentBtn+' span').text(streamData.countAttachment);
                    }
                );
            },

        //public method
            addNewStream: function (data, isAjax, position, callback) {
                position = position === undefined ? 'bottom' : position;
                return this._addNewStream(data, isAjax, position, callback);
            },

        //private method
            _addNewStream: function (data, isAjax, position, callback) {
                if ( $('#'+this.PREFIX+data.id).length > 0 ) { return; }
                isAjax = isAjax || false;
                var self = this;
                var opts = this.options;
                var index = 1+opts.baseIndex;
                if ( position === 'bottom' ) {
                    index += this.element.find('li').length;
                }
                var tabIndex = index;
                var postData = $.extend(true, {
                    index: index,
                    name: 'Untitled',
                    completed: false,
                    parentID: 0
                }, data);
                var _util_ = function (data) {
                    var isCreator = String(data.creatorID) === Zenwork.Auth.User.id;
                    var sid = self.PREFIX+data.id;
                    //DOM
                    var streamElement = $(
                        '<li class="'+opts.cssClass.streamElement+' '+opts.cssClass.streamLeaf+' '+(isCreator ? opts.cssClass.streamCreator : '')+' '+(isAjax ? opts.cssClass.unassignedTask : '')+'">'+
                        '    <div id='+sid+' class="StreamRow">'+
                        '        <a href="#'+sid+'" title="" class="'+opts.cssClass.streamActionBtn+' '+opts.cssClass.streamDetailsBtn+'">Click to see stream\'s details</a>'+
                        '        <a href="#'+sid+'" rel="comment" title="Comment" class="'+opts.cssClass.streamActionBtn+' '+opts.cssClass.streamCommentBtn+'"><span>'+data.countComment+'<span></a>'+
                        '        <a href="#'+sid+'" rel="attachment" title="File" class="'+opts.cssClass.streamActionBtn+' '+opts.cssClass.streamAttachmentBtn+'"><span>'+data.countAttachment+'<span></a>'+
                        '        <div class="'+opts.cssClass.streamField+' '+opts.cssClass.streamIndex+'">'+index+'</div>'+
                        '        <div class="'+opts.cssClass.streamField+' '+opts.cssClass.streamExtendModel+'">Task</div>'+
                        '        <div class="StreamRowWrapperInside01">'+
                        '            <div class="StreamRowWrapperInside02">'+
                        '                <div class="'+opts.cssClass.streamField+' '+opts.cssClass.streamName+'">'+
                        '                    <em>'+data.name+'</em>'+
                        '                </div>'+
                        '            </div>'+
                        '        </div>'+
                        '    </div>'+
                        '</li>'
                    );
                    if ( position === 'bottom' ) {
                        self.element.append(streamElement);
                    }
                    else { //position = top
                        //re-index all list
                        $('.'+opts.cssClass.streamIndex).each(function () {
                            $(this).text(Number($(this).text())+1);
                        });
                        self.element.prepend(streamElement);
                    }
                    
                    var stream = $('#'+sid).data($.extend(data, {
                        'clientID': sid,
                        'parentClientID': data.parentID === 0 ? 0 : self.PREFIX+data.parentID
                    }));
                    if ( data.parentID !== 0 && appendAtBottom ) {
                        self._addStream($('#'+self.PREFIX+data.parentID).parent(), streamElement, 'inside');
                    }
                    //set data object {} to stream element <div id="sid">
                    if ( callback != undefined ) {
                        callback(stream);
                    }
                    $('#'+sid+' .'+opts.cssClass.streamName).trigger('focus.stream');
                }
                if (isAjax) {
                    $.ajax({
                        type: 'POST',
                        url: Zenwork.Root+'/dashboard/addNewStream',
                        dataType: 'json',
                        contentType: 'json',
                        data: JSON.stringify(postData),
                        success: function (data, textStatus, jqXHR) {
                            if (data) {
                                _util_(data);
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            alert('Really sorry for this, network error! Please try again!');
                        }
                    });
                }
                else {
                    _util_(postData);
                }
            },
            _ajustDialogSize: function () {
                var $window = $(window);
                var $windowBoxModel = {
                    width: $window.width(),
                    height: $window.height()
                }
                var $streamDialogPosition = $.getBoxPosition(this.options.streamDialog);
                var bottomSpacing = 49;

                this.options.streamDialog.css({
                    width: $windowBoxModel.width - $streamDialogPosition.leftAbs - 10,
                    height: $windowBoxModel.height - bottomSpacing
                });
                this.options.streamDialogContent.css({
                    height: $windowBoxModel.height - bottomSpacing
                });
                this.options.streamDialogAside.css({
                    height: $windowBoxModel.height - bottomSpacing
                });
            },
            _ajustStreamDialogDecorBox: function (stream) {
                var opts = this.options;
                var decorBox = opts.streamDialog.find('.'+opts.cssClass.streamDialogDecor).eq(0);
                var streamDialogPosition = $.getBoxPosition(opts.streamDialog);
                var streamDialogBoxModel = $.getBoxModel(opts.streamDialog);
                var streamPosition = $.getBoxPosition(stream);
                var streamBoxModel = $.getBoxModel(stream);
                var topPos = streamPosition.topAbs
                    - streamBoxModel.borderTop
                    - streamBoxModel.borderBottom
                    - streamDialogPosition.topAbs
                    + Math.floor((streamBoxModel.height - opts.streamDialogDecorArrow.height)/2)
                    - 1;
                decorBox.css({
                    backgroundPosition: '0 '+topPos+'px'
                });
            },
            _reassign: function (e, tid, uid, callback) {
                $.ajax({
                    type: 'POST',
                    url: Zenwork.Root+'/dashboard/reassign/'+tid+'/'+uid,
                    dataType: 'json',
                    success: function (data, textStatus, jqXHR) {
                        if ( data == 404 ) {
                            return Zenwork.Exception._404();
                        }
                        if ( callback !== undefined ) { callback(data); }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        if ( textStatus !== 'abort' ) {
                            alert('Really sorry for this, network error! Please try again!');
                        }
                    },
                    complete: function (jqXHR, textStatus) {}
                });
            },
            _updateMyAssignedTimelineCompletion: function (postUrl, callback) {
                Zenwork.Notifier.notify('Updating...');
                $.ajax({
                    type: 'POST',
                    url: postUrl,
                    dataType: 'json',
                    success: function (data, textStatus, jqXHR) {
                        if ( data == 404 ) {
                            Zenwork.Notifier.off();
                            return Zenwork.Exception._404();
                        }
                        if ( callback !== undefined ) { callback(data); }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        if ( textStatus !== 'abort' ) {
                            alert('Really sorry for this, network error! Please try again!');
                        }
                    },
                    complete: function (jqXHR, textStatus) {}
                });
            },
            /**
             * has 'addListener' inside
             * review to ensure no duplicated listener
             */
            _initStreamDetailsControl: function (stream) {
                var self = this;
                var opts = this.options;
                var streamData = stream.data();
                var target;
                var targetData;
                var timeline;
                var timelineData;

                //init live edit name control
                var syncStreamName = stream.find('.'+opts.cssClass.streamName+' > em');
                Zenwork.StreamPopup.getTitle().find('input')
                    .on('keydown', function (e) {
                        syncStreamName.text(this.value);
                    })
                    .on('keyup', function (e) {
                        if ( String(streamData.creatorID) !== Zenwork.Auth.User.id ) { return false; }
                        if ( stream.data('name') === this.value ) { 
                            return false;
                        } //no change
                        syncStreamName.text(this.value);
                        stream.data('name', this.value);
                        //live update changed data
                        Zenwork.Model.liveUpdate({
                            id: streamData.id,
                            name: this.value
                        }, opts.useModel, Zenwork.Model.CU, streamData.clientID);
                    });
                
                //auto expand textarea
                Zenwork.StreamPopup.wrapper.find('.AutoResizeTextbox')
                    .autoresize({
                        container: 'tmpContainer',
                        buffer: 1,
                        animate: false,
                        resizeOnStart: true,
                        onresize: function () {}
                    })
                    .filter('.AutoSync').bind('keyup.stream', function (e) {
                        if ( String(streamData.creatorID) !== Zenwork.Auth.User.id ) { return false; }

                        if ( stream.data('description') === this.value ) { 
                            return false;
                        } //no change
                        //live update changed data
                        Zenwork.Model.liveUpdate({
                            id: streamData.id,
                            description: this.value
                        }, opts.useModel, Zenwork.Model.CU, streamData.clientID);
                    });

                //tagging
                $('.TagInput').each(function () {
                    Zenwork.Plugins.tagit.call(this, streamData.id);
                });
            
                //Timeline Dialog
                if ( Zenwork.TimelineDialog !== undefined ) {
                    /**
                     * timeline dialog
                     */
                    var isUpdatedTimeline = false;
                    var startField;
                    var endField;
                    Zenwork.StreamPopup.wrapper.on( //update timeline dialog
                        Zenwork.TimelineDialog.EVENT.UPDATE,
                        '.StreamTimelineBlockEditTimeline',
                        function (e, start, end) {
                            var target = $(e.currentTarget);
                            target.attr('data-start', start/1000);
                            target.attr('data-end', end/1000);
                            isUpdatedTimeline = true;

                            //add buffer
                            Zenwork.Model.addBuffer({
                               id: target.data('id'),
                               start: start/1000,
                               end: end/1000
                            }, 'Timeline', Zenwork.Model.CU);
                            //then flush
                            Zenwork.Model.flush();
                        });
                    Zenwork.StreamPopup.wrapper.on( //close timeline dialog without update
                        Zenwork.TimelineDialog.EVENT.CLOSE,
                        '.StreamTimelineBlockEditTimeline',
                        function (e) {
                            target.removeClass('ZWDialogBtnActive');
                            if ( !isUpdatedTimeline ) {
                                startField.text(new Date(target.attr('data-start')*1000).toString('dd-MMM-yyyy'));
                                endField.text(new Date(target.attr('data-end')*1000).toString('dd-MMM-yyyy'));
                            }
                            isUpdatedTimeline = false;
                        });
                    Zenwork.StreamPopup.wrapper.on( //select date from timeline dialog
                        Zenwork.TimelineDialog.EVENT.SELECT,
                        '.StreamTimelineBlockEditTimeline',
                        function (e, id, dateStr) {
                            var selectDate = new Date(dateStr);
                            if ( id === 'timelineDialogStartTimeCalendar' ) {
                                startField.text(selectDate.toString('dd-MMM-yyyy'));
                                if ( selectDate.valueOf() > new Date(endField.text()).valueOf() ) {
                                    endField.text(selectDate.toString('dd-MMM-yyyy'));
                                }
                            }
                            else if ( id === 'timelineDialogEndTimeCalendar' ) {
                                endField.text(selectDate.toString('dd-MMM-yyyy'));
                            }
                        });
                    Zenwork.StreamPopup.wrapper.on( //click on button
                        'click.stream', 
                        '.StreamTimelineBlockEditTimeline',
                        function (e) {
                            if ( $(e.currentTarget).hasClass('ZWDialogBtnActive') ) {
                                return false;
                            }
                            target = $(e.currentTarget).addClass('ZWDialogBtnActive');
                            targetData = target.data();

                            Zenwork.Model.checkExist('Timeline', targetData.id, function (exists) {
                                if ( exists ) {
                                    startField = $('.StreamDateTimeStart[data-id="'+targetData.id+'"]');
                                    endField = $('.StreamDateTimeEnd[data-id="'+targetData.id+'"]');

                                    Zenwork.Dialog.close();

                                    Zenwork.TimelineDialog.updateTimelineDialog(target.attr('data-start')*1000, target.attr('data-end')*1000);

                                    Zenwork.TimelineDialog.show(e, target);
                                }
                            });

                            return false;
                        }); //end. timeline dialog
                }

                if ( Zenwork.AssigneeDialog !== undefined ) {
                    /**
                     * assignee dialog
                     */
                    var listAssignee;
                    Zenwork.StreamPopup.wrapper.on( //assign
                        Zenwork.AssigneeDialog.EVENT.ASSIGN,
                        '.StreamTimelineBlockEditAssignee',
                        function (e, assigneeData) {
                            if ( listAssignee.find('li').length === 1 ) {
                                listAssignee.find('.NoAssignee').addClass('Hidden');
                            }
                            /*
                             * data {
                             *     id: value, //user id
                             *     username: value,
                             *     email: value
                             *     avatar: value
                             *     Users_timeline: { 
                             *         effort: value
                             *         id: value
                             *         tid: value
                             *         uid: value
                             *     }
                             * }
                             */
                            var tid = assigneeData.Users_timeline.tid;
                            listAssignee.append('<li class="AssigneeAlt01" data-uid="'+assigneeData.id+'" data-timeline-id="'+tid+'" id="assigneeT'+tid+'U'+assigneeData.id+'" rel="#assigneeT'+tid+'U'+assigneeData.id+'">'+assigneeData.username+'</li>');

                            //others buttons
                            if ( Zenwork.Auth.User.id == assigneeData.id ) {
                                $('.MyEffort[data-id="'+tid+'"] strong').text(assigneeData.Users_timeline.effort);
                                $('.StreamTimelineBlockStartWorking[data-timeline-id="'+tid+'"]').removeClass('Hidden');
                                $('.ReassignBox[data-timeline-id="'+tid+'"]').removeClass('Hidden');
                            }
                        });
                    Zenwork.StreamPopup.wrapper.on( //un-assign
                        Zenwork.AssigneeDialog.EVENT.UNASSIGN,
                        '.StreamTimelineBlockEditAssignee',
                        function (e, uid) {
                            var assignee = listAssignee.find('[data-uid="'+uid+'"]');
                            var tid = assignee.data('timelineId');
                            $(assignee.attr('rel')).remove();
                            if ( listAssignee.find('li').length === 1 ) {
                                listAssignee.find('.NoAssignee').removeClass('Hidden');
                            }
                            //others buttons
                            if ( Zenwork.Auth.User.id == uid ) {
                                $('.MyEffort[data-id="'+tid+'"] strong').html('&ndash;&ndash;');
                                $('.StreamTimelineBlockCompletion[data-timeline-id="'+tid+'"]').addClass('Hidden');
                                $('.StreamTimelineBlockStartWorking[data-timeline-id="'+tid+'"]').addClass('Hidden');
                                $('.ReassignBox[data-timeline-id="'+tid+'"]').addClass('Hidden');
                            }
                        });
                    Zenwork.StreamPopup.wrapper.on( //update effort
                        Zenwork.AssigneeDialog.EVENT.UPDATE,
                        '.StreamTimelineBlockEditAssignee',
                        function (e, uid, effort) {
                            var tid = listAssignee.find('[data-uid="'+uid+'"]').data('timelineId');
                            $('.MyEffort[data-id="'+tid+'"] strong').text(effort);
                        });
                    Zenwork.StreamPopup.wrapper.on( //update completion
                        Zenwork.AssigneeDialog.EVENT.TOGGLE_COMPLETION,
                        '.StreamTimelineBlockEditAssignee',
                        function (e, uid, completed) {
                            var isCompleted = completed > 2;
                            var tid = listAssignee.find('[data-uid="'+uid+'"]').toggleClass('Hidden', !isCompleted).data('timelineId');
                            $('.StreamTimelineBlockCompletion[data-timeline-id="'+tid+'"]').toggleClass('StreamTimelineBlockCompleted', isCompleted);
                        });
                    Zenwork.StreamPopup.wrapper.on( //click on button
                        'click.stream', 
                        '.StreamTimelineBlockEditAssignee:not(".ZWDialogBtnActive")',
                        function (e) {
                            Zenwork.Dialog.close();
                            target = $(e.currentTarget).addClass('ZWDialogBtnActive');
                            var timeline = $(target.attr('href'));
                            listAssignee = $(target.attr('rel'));
                            Zenwork.AssigneeDialog.show(e, timeline, target);
                            return false;
                        }); //end. assignee
                }

                //re-assign autocomplete
                var cache = {}; //use for auto-suggest box
                var reassignBox = $('.ReassignBox');
                if ( reassignBox.length > 0 ) {
                    reassignBox
                        .autocomplete({
                            autoFocus: true,
                            source: function (request, response) {
                                dataSource = Zenwork.Root+'/auth/searchByUsernameOrEmail';
                                if ( request.term in cache ) {
                                    response(cache[request.term], request, response);
                                    return;
                                }

                                $.getJSON(dataSource, {
                                    term: request.term
                                }, function (data, status, xhr) {
                                    if ( data.constructor !== Array ) {
                                        var tmp = [];
                                        $.each(data, function (key, value) {
                                            tmp.push({
                                                label: value,
                                                value: key
                                            });
                                        });
                                        data = tmp;
                                    }
                                    response($.ui.autocomplete.filter(data, request.term));
                                    cache[request.term] = data;
                                });
                            },
                            focus: function (e, ui) {
                                return false; //return false prevent autocomplete auto set value of input = ui.item.value
                            },
                            select: function (e, ui) {
                                var _self = this;
                                var tid = $(e.target).data('timelineId');
                                self._reassign(e, tid, ui.item.value, function (data) {
                                    if ( data.isReassigned ) {
                                        Zenwork.Notifier.notify('Task reassigned to '+data.assignee.username, 2);
                                        $(_self).after('<span class="ReassignedNotice">re-assigned&nbsp;&#8594;&nbsp;<em>'+data.assignee.username+'</em></span>').remove();
                                        var img = $('#assigneeT'+tid+'U'+Zenwork.Auth.User.id);
                                        img.attr({
                                            id: 'assigneeT'+tid+'U'+data.assignee.id,
                                            title: img.attr('alt')+'&nbsp;&#8594;&nbsp;<strong>'+data.assignee.username+'</strong>',
                                            alt: data.assignee.username,
                                            src: data.assignee.avatar
                                        });
                                    }
                                    else {
                                        Zenwork.Notifier.notify('Task is already assigned to '+data.assignee.User.username, 2);
                                    }
                                    _self.value = '';
                                });
                                this.value = ui.item.label;
                                return false; //return false prevent autocomplete auto set value of input = ui.item.value
                            },
                            position: {
                                collision: 'flip'
                            }
                        })
                        .on('blur', function (e) {
                            this.value = '';
                        })
                        .data('uiAutocomplete')._renderItem = function(ul, item) {
                            return $('<li>').append(
                                '<a>'+
                                item.label.replace(
                                    new RegExp(
                                        '(?![^&;]+;)(?!<[^<>]*)(' +
                                        $.ui.autocomplete.escapeRegex(this.term) +
                                        ')(?![^<>]*>)(?![^&;]+;)', 'gi'
                                    ),
                                    '<strong class="SearchTerm">$1</strong>'
                                ) +
                                '</a>'
                            ).appendTo(ul);
                        };
                }
            
                //check complete button
                var _updateCompletion = function (e, effort) {
                    if ( effort != null && effort != '' ) {
                        var $target = $(e.currentTarget);
                        $target.toggleClass('StreamTimelineBlockCompleted');
                        var completed = $target.hasClass('StreamTimelineBlockCompleted') ? 3 : 2;
                        var postUrl = $target.attr('href');
                        postUrl += '/'+completed;
                        postUrl += '/'+effort;
                        self._updateMyAssignedTimelineCompletion(postUrl, function (data) {
                            var tid = $target.data('timelineId');
                            if ( $('#streamTimelineBlock'+tid).data('start') <= Zenwork.Now.valueOf()/1000 ) {
                                stream.toggleClass('TodayCompleted', completed == 3);
                            }
                            $('#assigneeCompletionT'+tid+'U'+Zenwork.Auth.User.id).toggleClass('Hidden', completed == 2);
                            reassignBox.filter('[data-timeline-id="'+tid+'"]').toggleClass('Hidden', completed == 3);
                            Zenwork.Notifier.notify('Update task to '+(completed == 3 ? 'completed' : 'uncompleted'), 1);
                        });
                    }
                    else if ( effort == '' ) {
                        effort = prompt('Effort can not be empty', effort);
                        _updateCompletion(e, effort);
                    }
                }
                $('.StreamTimelineBlockCompletion').on('click', function (e) {
                    var $target = $(e.currentTarget);
                    var completed = $target.hasClass('StreamTimelineBlockCompleted');
                    if ( completed ) { 
                        if ( !confirm('Mark this task as uncompleted?') ) {
                            return false;
                        }
                    }
                    var effort = completed
                        ? $target.data('effort')
                        : prompt('How many effort(day) have you spent for this task?', $target.data('effort'));
                    _updateCompletion(e, effort);
                    return false;
                });
                $('.StreamTimelineBlockStartWorking').on('click', function (e) {
                    var $target = $(e.currentTarget);
                    var tid = $target.data('timelineId');
                    Zenwork.Notifier.notify('Updating...');
                    $.ajax({
                        type: 'POST',
                        url: Zenwork.Root+'/dashboard/startWorkingTimeline/'+tid,
                        dataType: 'json',
                        success: function (data, textStatus, jqXHR) {
                            if ( data == 404 ) {
                                Zenwork.Notifier.off();
                                return Zenwork.Exception._404();
                            } 
                            if ( data ) {
                                Zenwork.Notifier.notify('Done', 1);
                                $target.remove();
                                $('.StreamTimelineBlockCompletion[data-timeline-id="'+tid+'"]').removeClass('Hidden');
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            if ( textStatus !== 'abort' ) {
                                alert('Really sorry for this, network error! Please try again!');
                            }
                        },
                        complete: function (jqXHR, textStatus) {}
                    });
                    return false;
                });

                $('.StreamActivityViewMoreBtn').on('click', function (e) {
                    var $target = $(e.currentTarget);
                    var list = $($target.attr('href'));
                    var visible = list.find('li:visible');
                    var index = visible.length+visible.length;
                    list.find('li:lt('+index+')').removeClass('Hidden');
                    Zenwork.StreamPopup.wrapper.find('.StreamScrollContent').data('jsp').reinitialise();
                    if ( index >= list.find('li').length ) {
                        $target.addClass('Hidden');
                    }
                    return false;
                });

                //close dialog when click on stream popup
                Zenwork.StreamPopup.wrapper.on('click.stream', function (e) {
                    if ( Zenwork.Dialog !== undefined ) {
                        Zenwork.Dialog.close();
                    }
                });

                //set timeline data
                $('.StreamTimelineBlock').each(function () {
                    $timeline = $(this);
                    $json = JSON.parse(decodeURIComponent($timeline.data('json')));
                    $timelineData = $timeline.removeAttr('data-assignee-json').data();
                    $.each($json, function (key, value) {
                        $timelineData[key] = value;
                    });
                });

                //stream list selection
                var listSelection = $('#listSelection');
                if ( listSelection.length > 0 ) {
                    Zenwork.Plugins.listSelection(listSelection, streamData);
                }

                //delete stream
                $('.StreamDeleteBtn').on('click', function (e) {
                    if ( confirm('Sure?') ) {
                        var $this = $(this).addClass('Pending');
                        $.ajax({
                            type: 'POST',
                            url: Zenwork.Root+'/streams/remove/'+$this.attr('href'),
                            success: function (data, textStatus, jqXHR) {
                                if ( data == 404 ) {
                                    return Zenwork.Exception._404();
                                }

                                Zenwork.StreamPopup.close();
                                Zenwork.Dialog.close();
                                Zenwork.Plugins.Tip.hideTip();

                                var streamWrapper = $('#s'+streamData.id).parent();
                                //re-index all list item after
                                $('.'+opts.cssClass.streamIndex+':gt('+streamWrapper.prevAll('li').length+')').each(function () {
                                    $(this).text(Number($(this).text())-1);
                                });
                                streamWrapper.remove();

                                if ( self._isEmpty() ) {
                                    $('#todayTaskListEmptyBlock').removeClass('Hidden');
                                }
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                if ( textStatus !== 'abort' ) {
                                    alert('Really sorry for this, network error! Please try again!');
                                }
                            }
                        });
                    }
                    return false;
                });
            },
            _openStreamDetails: function (e, stream, aside) {
                var self = this;
                var opts = this.options;
                Zenwork.StreamPopup.observer = stream;
                Zenwork.StreamPopup.preProcess({}, false);
                this._dialogUtil(stream);

                $.ajax({
                    type: 'POST',
                    url: Zenwork.Root+'/dashboard/getStreamDetails/'+stream.data('id'),
                    success: function (data, textStatus, jqXHR) {
                        if ( data == 404 ) {
                            self._notFoundException(stream);
                            return false;
                        }

                        Zenwork.StreamPopup.show({content: data});

                        //init stream details control
                        if ( Zenwork.TimelineDialog !== undefined ) {
                            Zenwork.StreamPopup.wrapper.off(Zenwork.TimelineDialog.EVENT.UPDATE);
                            Zenwork.StreamPopup.wrapper.off(Zenwork.TimelineDialog.EVENT.CLOSE);
                            Zenwork.StreamPopup.wrapper.off(Zenwork.TimelineDialog.EVENT.SELECT);
                        }
                        if ( Zenwork.AssigneeDialog !== undefined ) {
                            Zenwork.StreamPopup.wrapper.off(Zenwork.AssigneeDialog.EVENT.ASSIGN);
                            Zenwork.StreamPopup.wrapper.off(Zenwork.AssigneeDialog.EVENT.UNASSIGN);
                            Zenwork.StreamPopup.wrapper.off(Zenwork.AssigneeDialog.EVENT.UPDATE);
                        }
                        Zenwork.StreamPopup.wrapper.off('click.stream');
                        //init stream details control
                        self._initStreamDetailsControl(stream);

                        //last action
                        self._dialogUtil(stream);
                        self._ajustDialogScrollContentSize();

                        var scrollContentBlock = Zenwork.StreamPopup.content.find('.StreamScrollContent');
                        scrollContentBlock.each(function() {
                            Zenwork.Plugins.jScrollPane.call(this, {verticalGutter: 0});
                        });
                        scrollContentBlock.bind(
                            'jsp-scroll-y', 
                            function(e, scrollPositionY, isAtTop, isAtBottom) {
                                if ( Zenwork.Dialog !== undefined ) {
                                    Zenwork.Dialog.close();
                                }
                            });
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        if ( textStatus !== 'abort' ) {
                            alert('Really sorry for this, network error! Please try again!');
                        }
                    }
                });

                aside = aside || 'comment';
                if ( aside === 'comment' ) {
                    //init comment box
                    this._loadStreamCommentBox(e, stream);
                }
                else if ( aside === 'attachment' ) {
                    //init attachment box
                    this._loadStreamAttachmentBox(e, stream);
                }
            }
    });
})(jQuery);

Zenwork.Chart = {
    Line: {
        defaults: {
            //Boolean - If we show the scale above the chart data            
            scaleOverlay: false,
            
            //Boolean - If we want to override with a hard coded scale
            scaleOverride: false,
            
            //** Required if scaleOverride is true **
            //Number - The number of steps in a hard coded scale
            scaleSteps: null,
            //Number - The value jump in the hard coded scale
            scaleStepWidth: null,
            //Number - The scale starting value
            scaleStartValue: null,

            //String - Colour of the scale line    
            scaleLineColor: 'rgba(219, 219, 219, 1)',
            
            //Number - Pixel width of the scale line    
            scaleLineWidth: 1,

            //Boolean - Whether to show labels on the scale    
            scaleShowLabels: true,
            
            //Interpolated JS string - can access value
            scaleLabel: '<%=value%>',
            
            //String - Scale label font declaration for the scale label
            scaleFontFamily: 'Arial',
            
            //Number - Scale label font size in pixels    
            scaleFontSize: 12,
            
            //String - Scale label font weight style    
            scaleFontStyle: 'normal',
            
            //String - Scale label font colour    
            scaleFontColor: '#444',    
            
            ///Boolean - Whether grid lines are shown across the chart
            scaleShowGridLines: true,
            
            //String - Colour of the grid lines
            scaleGridLineColor: 'rgba(219, 219, 219, 1)',
            
            //Number - Width of the grid lines
            scaleGridLineWidth: 1,    
            
            //Boolean - Whether the line is curved between points
            bezierCurve: true,
            
            //Boolean - Whether to show a dot for each point
            pointDot: true,
            
            //Number - Radius of each point dot in pixels
            pointDotRadius: 4,
            
            //Number - Pixel width of point dot stroke
            pointDotStrokeWidth: 1,
            
            //Boolean - Whether to show a stroke for datasets
            datasetStroke: true,
            
            //Number - Pixel width of dataset stroke
            datasetStrokeWidth: 2,
            
            //Boolean - Whether to fill the dataset with a colour
            datasetFill: true,
            
            //Boolean - Whether to animate the chart
            animation: true,

            //Number - Number of animation steps
            animationSteps: 30,
            
            //String - Animation easing effect
            animationEasing: 'easeOutQuart',

            //Function - Fires when the animation is complete
            onAnimationComplete: null
        }
    },
    Bar: {
        defaults: {
            //Boolean - If we show the scale above the chart data            
            scaleOverlay : false,
            
            //Boolean - If we want to override with a hard coded scale
            scaleOverride : false,
            
            //** Required if scaleOverride is true **
            //Number - The number of steps in a hard coded scale
            scaleSteps : null,
            //Number - The value jump in the hard coded scale
            scaleStepWidth : null,
            //Number - The scale starting value
            scaleStartValue : null,

            //String - Colour of the scale line    
            scaleLineColor : 'rgba(0,0,0,.1)',
            
            //Number - Pixel width of the scale line    
            scaleLineWidth : 1,

            //Boolean - Whether to show labels on the scale    
            scaleShowLabels : false,
            
            //Interpolated JS string - can access value
            scaleLabel : '<%=value%>',
            
            //String - Scale label font declaration for the scale label
            scaleFontFamily : '"Arial"',
            
            //Number - Scale label font size in pixels    
            scaleFontSize : 12,
            
            //String - Scale label font weight style    
            scaleFontStyle : 'normal',
            
            //String - Scale label font colour    
            scaleFontColor : '#666',    
            
            ///Boolean - Whether grid lines are shown across the chart
            scaleShowGridLines : true,
            
            //String - Colour of the grid lines
            scaleGridLineColor : 'rgba(0,0,0,.05)',
            
            //Number - Width of the grid lines
            scaleGridLineWidth : 1,    

            //Boolean - If there is a stroke on each bar    
            barShowStroke : true,
            
            //Number - Pixel width of the bar stroke    
            barStrokeWidth : 2,
            
            //Number - Spacing between each of the X value sets
            barValueSpacing : 5,
            
            //Number - Spacing between data sets within X values
            barDatasetSpacing : 1,
            
            //Boolean - Whether to animate the chart
            animation : true,

            //Number - Number of animation steps
            animationSteps : 60,
            
            //String - Animation easing effect
            animationEasing : 'easeOutQuart',

            //Function - Fires when the animation is complete
            onAnimationComplete : null
        }
     }
}
