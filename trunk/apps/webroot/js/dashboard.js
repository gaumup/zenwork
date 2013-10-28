Zenwork.Dashboard = {};
Core.Mediator.installTo(Zenwork.Dashboard);

jQuery(document).ready(function () {
    (function($) {
        $('.jscrollpane').each(function() {
            Zenwork.Plugins.jScrollPane.call(this, {contentWidth: '0px'});
        });

        Zenwork.Dashboard.LineChartModel = function (container) {
            var _drawChart_ = function (container, opts) {
                var opts = $.extend(true, {
                    legend: {
                        enabled: false
                    },
                    chart: {
                        type: 'area',
                        zoomType: 'x'
                    },
                    title: {
                        text: ''
                    },
                    xAxis: {
                        categories: opts.labels
                    },
                    yAxis: {
                        title: {
                            text: ''
                        },
                        min: 0
                    },
                    tooltip: {
                        crosshairs: [true]
                    },
                    series: opts.datasets
                }, opts.config);
                var api = container.highcharts();
                if ( api !== undefined ) {
                    api.destroy();
                }
                container.highcharts(opts);
            }
            var api = { //export api
                container: container,
                store: {
                    /*
                     * key: {
                     *    name : key,
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
                    this.store[key] = data;
                    _drawChart_(this.container, {
                        config: this.config,
                        labels: this.labels,
                        datasets: this.getDatasets()
                    });
                },
                setDatasets: function (datasets) {
                    this.clearDatasets();
                    for ( var key in datasets ) {
                        this.store[key] = datasets[key];
                    }
                    _drawChart_(this.container, {
                        config: this.config,
                        labels: this.labels,
                        datasets: this.getDatasets()
                    });
                },
                setLabels: function (labels) {
                    this.labels = labels;
                },
                clearDatasets: function () {
                    this.store = {};
                    this.container.empty();
                },
                config: function (cfg) {
                    this.config = $.extend(true, this.config, cfg);
                } 
            }
            $(window).on('resize', function (e) {
                _drawChart_(api.container, {
                    config: api.config,
                    labels: api.labels,
                    datasets: api.getDatasets()
                });
            });

            return api;
        };

        var _dailyWorkload_ = function (data) {
            var dailyTasks = [];
            var dailyCompletedTasks = [];

            $.each(data, function (index, value) {
                var startOn = new Date(value.Timeline.start*1000);
                var deadline = new Date(value.Timeline.end*1000);
                var dailyEffortInPercent = value.Users_timeline.effort*100/(new TimeSpan(deadline - startOn).getDiffDays());

                var startOnDate = startOn.getDate(); //1->31
                var deadlineDate = deadline.getDate(); //1->31

                for ( var i = startOnDate-1; i <= deadlineDate-1; i++ ) {
                    //totals workload
                    if ( dailyTasks[i] == undefined ) {
                        dailyTasks[i] = dailyEffortInPercent;
                    }
                    else {
                        dailyTasks[i] += dailyEffortInPercent;
                    }
                    dailyTasks[i] = Math.round(dailyTasks[i]*100)/100;

                    //totals completed workload
                    if ( value.Users_timeline.completed > 2 ) {
                        if ( dailyCompletedTasks[i] == undefined ) {
                            dailyCompletedTasks[i] = dailyEffortInPercent;
                        }
                        else {
                            dailyCompletedTasks[i] += dailyEffortInPercent;
                        }
                    }
                    dailyCompletedTasks[i] = isNaN(dailyCompletedTasks[i])
                        ? 0
                        : Math.round(dailyCompletedTasks[i]*100)/100
                }
            });

            return {
                planning: dailyTasks,
                completed: dailyCompletedTasks
            }
        }
        var _monthlyWorkload_ = function (data) {
            var monthlyTasks = [];
            var monthlyCompletedTasks = [];

            $.each(data, function (index, value) {
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
                monthlyTasks[month] = Math.round(monthlyTasks[month]*100)/100;
                if ( value.Users_timeline.completed > 2 ) {
                    monthlyCompletedTasks[month] = monthlyCompletedTasks[month] === undefined
                        ? workloadInMonth
                        : monthlyCompletedTasks[month] + workloadInMonth;
                    monthlyCompletedTasks[month] = Math.round(monthlyCompletedTasks[month]*100)/100;
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
                    monthlyTasks[nextMonth] = Math.round(monthlyTasks[nextMonth]*100)/100;
                    if ( value.Users_timeline.completed > 2 ) {
                        monthlyCompletedTasks[nextMonth] = monthlyCompletedTasks[nextMonth] === undefined
                            ? _workload_
                            : monthlyCompletedTasks[nextMonth] + _workload_;
                        monthlyCompletedTasks[nextMonth] = Math.round(monthlyCompletedTasks[nextMonth]*100)/100;
                    }
                    nextMonth++;
                    fisrtDayInNextMonth.addMonths(1);
                    lastDayInNextMonth.addMonths(1).setDate(Date.getDaysInMonth(year, nextMonth));
                    effortInNextMonth = new TimeSpan((deadline.isAfter(lastDayInNextMonth) ? lastDayInNextMonth : deadline) - fisrtDayInNextMonth).getDiffDays()*totalEffortInPercent/100;
                }
            });

            return {
                planning: monthlyTasks,
                completed: monthlyCompletedTasks
            }
        }
        var chartLabel = {
            month: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
            year: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        };

    /* Today block js code */
        //today task list behavior
        var todayTaskListjsp = $('#todayTaskListJScrollPane');
        var todayTaskList = $('#todayTaskList');
        var todayCompletedTask = $('#todayCompletedTask');
        var userStatisticModel = new Zenwork.Dashboard.LineChartModel($('#myTaskStatistic'));
        userStatisticModel.setLabels(chartLabel.year);
        userStatisticModel.config({
            tooltip: {
                formatter: function() {
                    return this.y+' %';
                }
            },
            yAxis: {
                max: 250,
                labels: {
                    formatter: function () {
                        return this.value+' %';
                    }
                }
            }
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
                var monthlyTasks = _monthlyWorkload_(data.all);

                //draw chart
                $('#myTaskStatisticChartBlock').removeClass('ZWPending');
                userStatisticModel.setDatasets({
                    planning: { //planning
                        color : 'rgba(220, 220, 220, 1)',
                        name: 'planning',
                        data : $.extend([], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], monthlyTasks.planning)
                    },
                    actual: { //actual
                        color : 'rgba(151, 187, 205, 1)',
                        name: 'completed',
                        data : $.extend([], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], monthlyTasks.completed)
                    }
                });
                if ( data.today.length == 0 ) {
                    Zenwork.Dashboard.pub('todayBlockLoad.Help.Dashboard', '#zwAddNewTaskText', '#zwAddNewTaskCompact', '#myTaskStatisticChartBlock');
                }
                else {
                    Zenwork.Dashboard.pub('todayBlockLoad.Help.Dashboard', '#zwAddNewTaskCompact', '#myTaskStatisticChartBlock', '#todayTaskListJScrollPane');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if ( textStatus !== 'abort' ) {
                    alert('Really sorry for this, network error! Please try again!');
                }
            }
        });

        Zenwork.Plugins.jScrollPane.call(todayTaskListjsp, {verticalGutter: 0, contentWidth: '0px'}); //init jscrollpane for todayTaskList
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
            Zenwork.Dashboard.pub('dashboardStartAddFirstTask.Help.Dashboard');
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
                    stream.find('.StreamDetailsBtn').trigger('mousedown', function () {
                        Zenwork.Dashboard.pub('dashboardViewAddedFirstTask.Help.Dashboard', '#streamDialogTitle', '#belongsToList', '#listSelection', '#tagBlock', '#timelineBlock');
                    });
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

    /* Followed task block js code */
        var followedTaskListjsp = $('#followedTaskListJScrollPane');
        var followedTaskList = $('#followedTaskList');
        //load today task list data
        $.ajax({
            type: 'POST',
            url: Zenwork.Root+'/dashboard/getFollowedTaskList',
            dataType: 'json', //receive from server
            contentType: 'json', //send to server
            data: JSON.stringify({}),
            success: function (data, textStatus, jqXHR) {
                if ( data.length > 0 ) {
                    //render today task list
                    $.each(data, function (index, value) {
                        followedTaskList.tasklist('addNewStream', value.Stream, false, 'bottom', function (stream) {});
                    });
                }
                else {
                    $('#followedTaskListEmptyBlock').removeClass('Hidden');
                }
                followedTaskListjsp.removeClass('ZWPending').data('jsp').reinitialise();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if ( textStatus !== 'abort' ) {
                    alert('Really sorry for this, network error! Please try again!');
                }
            }
        });

        Zenwork.Plugins.jScrollPane.call(followedTaskListjsp, {verticalGutter: 0, contentWidth: '0px'}); //init jscrollpane for todayTaskList
        followedTaskList.tasklist({ //init tasklist widget
            //options
            baseIndex: 0,
            customFieldsList: {},
            listPrefix: 'followed_',

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
    /* End. Followed task block js code */

    /* Resource usage block js code */
        var teamResourceStatistic = $('#teamResourceStatistic');
        var teamResourceChartBlock = $('#teamResourceChartBlock');
        if ( teamResourceStatistic.length > 0 ) {
            teamResourceChartBlock.removeClass('ZWPending');
            var teamResourceStatisticModel = new Zenwork.Dashboard.LineChartModel(teamResourceStatistic);
            teamResourceStatisticModel.config({
                plotOptions: {
                    spline: {
                        tooltip: {
                            headerFormat: '',
                            pointFormat: '{point.y} %'
                        },
                        marker: {
                            enabled: false
                        }
                    },
                    pie: {
                        tooltip: {
                            headerFormat: '',
                            pointFormat: '<strong>{point.name}</strong>: {point.y} %'
                        }
                    }
                },
                yAxis: {
                    max: 250,
                    labels: {
                        formatter: function () {
                            return this.value+' %';
                        }
                    }
                }
            });
        }
    /* End. Resource usage block js code */

    /* Team member workload block js code */
        var teamMemberWorkloadStatistic = $('#teamMemberWorkloadStatistic');
        var teamMemberWorkloadChartBlock = $('#teamMemberWorkloadChartBlock');
        if ( teamMemberWorkloadStatistic.length > 0 ) {
            teamMemberWorkloadChartBlock.removeClass('ZWPending');
            var teamMemberWorkloadStatisticModel = new Zenwork.Dashboard.LineChartModel(teamMemberWorkloadStatistic);
            teamMemberWorkloadStatisticModel.config({
                chart: {
                    type: 'spline'
                },
                tooltip: {
                    formatter: function() {
                        return this.y+' %';
                    }
                },
                plotOptions: {
                    spline: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                yAxis: {
                    max: 250,
                    labels: {
                        formatter: function () {
                            return this.value+' %';
                        }
                    }
                }
            });
        }
    /* End. Team member workload block js code */

    /* Team control */
        Zenwork.Dashboard.pub('teamSelectionFirstTime.Help.Dashboard', '#teamAutoSuggestDashboard');
        Zenwork.Dashboard.pub('createFirstTeam.Help.Dashboard', '#createNewTeam');
        
        var _analyzeTag_ = function (tasks) {
            var totalTagEffort = 0;
            var tagsList = [];
            var tags = {};
            tags.uncategorized = 0;
            $.each(tasks, function () {
                totalTagEffort += Number(this.Users_timeline.effort);
                if ( this.Stream.tag == '' ) {
                    tags.uncategorized += Number(this.Users_timeline.effort);
                }
                else {
                    var _tags = this.Stream.tag.split(',');
                    tagsList = tagsList.concat(_tags);
                    for ( var i = 0; i < _tags.length; i++ ) {
                        if ( tags[_tags[i]] === undefined ) {
                            tags[_tags[i]] = Number(this.Users_timeline.effort);
                        }
                        else {
                            tags[_tags[i]] += Number(this.Users_timeline.effort);
                        }
                    }
                }
            });
            var tagsPercentage = [];
            $.each(tags, function (key, value) {
                tagsPercentage.push({
                    name: key,
                    y: Math.round(value*100/totalTagEffort)
                });
            });
            return {
                list: $.unique(tagsList),
                statistic: tagsPercentage
            }
        }
        var _loadTeamData_ = function (tid, config) {
            var opts = $.extend({
                timeBounce: [],
                xAxisType: 'month' //available 'month', 'year'
            }, config);
            var _filter_ = {
                month: _dailyWorkload_,
                year: _monthlyWorkload_
            };
    
            if ( teamResourceChartBlock.length > 0  ) {
                teamResourceChartBlock.addClass('ZWPending');
            }
            if ( teamMemberWorkloadChartBlock.length > 0  ) {
                teamMemberWorkloadChartBlock.addClass('ZWPending');
            }

            var api1 = teamResourceStatisticModel.container.highcharts();
            var api2 = teamMemberWorkloadStatisticModel.container.highcharts();
            if ( api1 !== undefined ) {
                api1.showLoading();
            }
            if ( api2 !== undefined ) {
                api2.showLoading();
            }
            $.ajax({
                type: 'POST',
                url: Zenwork.Root+'/team/getTeamData/'+tid,
                dataType: 'json', //receive from server
                contentType: 'json', //send to server
                data: JSON.stringify({
                    timeBounce: opts.timeBounce
                }),
                success: function (data, textStatus, jqXHR) {
                    if ( data == 404 ) {
                        Zenwork.Team.toggleEditing(false);
                        Zenwork.Team.buttons.setDefault.removeAttr('checked');
                        Zenwork.Team.active = 0;
                        teamResourceChartBlock.removeClass('ZWPending');
                        teamMemberWorkloadChartBlock.removeClass('ZWPending');
                        Zenwork.Notifier.notify('Team maybe delete and is not exist any more', 4);
                        return false;
                    }

                    //preparing data for team monthly statistic chart: total
                    var totalTasks = _filter_[opts.xAxisType](data.tasks);
                    for ( var i=0; i < totalTasks.planning.length; i++ ) {
                        totalTasks.planning[i] = totalTasks.planning[i] === undefined
                            ? 0
                            : totalTasks.planning[i]/data.members.length;
                        totalTasks.planning[i] = Math.round(totalTasks.planning[i]*100)/100;
                        
                        totalTasks.completed[i] = totalTasks.completed[i] === undefined
                            ? 0
                            : totalTasks.completed[i]/data.members.length;
                        totalTasks.completed[i] = Math.round(totalTasks.completed[i]*100)/100;
                    }
                    //preparing data for team members workload: individual
                    var teamMemberDatasets = {};
                    var i = 0;
                    $.each(data.memberTasks, function (username, _data) {
                        var memberTasks = _filter_[opts.xAxisType](_data);
                        var color = Core.ColorSwatch.hex2rgb(Core.ColorSwatch.palette[i]);
                        var rgba = 'rgba('+color.r+','+color.g+','+color.b+',1)'; 
                        teamMemberDatasets[username] = {
                            id: username,
                            color: rgba,
                            name: username,
                            data : $.extend([],
                                (opts.xAxisType == 'month'
                                    ? [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                                    : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                memberTasks.planning
                            )
                        }
                        i++;
                    });

                    //Resource chart: start drawing chart
                    var tagsAnalyzing = _analyzeTag_(data.tasks);
                    if ( teamResourceStatistic.length > 0 
                        && teamResourceChartBlock.length > 0 
                        && teamResourceStatisticModel !== undefined
                    ) { //draw chart
                        teamResourceChartBlock.removeClass('ZWPending');
                        teamResourceStatisticModel.setLabels(chartLabel[opts.xAxisType]);
                        teamResourceStatisticModel.setDatasets({
                            planning: { //planning
                                type: 'spline',
                                color : 'rgba(220, 220, 220, 1)',
                                name: 'planning',
                                data : $.extend([],
                                    (opts.xAxisType == 'month'
                                        ? [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                                        : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                    totalTasks.planning
                                )
                            },
                            actual: { //actual
                                type: 'spline',
                                color : 'rgba(151, 187,205 ,1)',
                                name: 'actual',
                                data : $.extend([],
                                    (opts.xAxisType == 'month'
                                        ? [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                                        : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                    totalTasks.completed
                                )
                            },
                            pie: {
                                type: 'pie',
                                name: 'Tags',
                                data: tagsAnalyzing.statistic,
                                center: ['80%', '10%'],
                                size: 100,
                                showInLegend: false,
                                dataLabels: {
                                    enabled: false
                                }
                            }
                        });
                    }
                    //render members chart legend
                    var teamMembersChartLegend = $('#teamMembersChartLegend').empty();
                    $.each(data.members, function (index, member) {
                        var member = member.User;
                        teamMembersChartLegend.append(
                            '<li class="QTip" title="Click to toggle view line chart of this person" data-key="'+member.username+'">'+
                            '    <img onerror="this.src=\''+Zenwork.Root+'/images/default-avatar.png\''+'" src="'+Zenwork.Root+'/'+(member.avatar == '' ? 'images/default-avatar.png' : 'upload_files/'+member.avatar)+'" title="'+member.username+'" alt="'+member.username+'" /><em>'+member.username+'<span style="background-color:'+Core.ColorSwatch.palette[index]+';" class="LegendLine">&nbsp;</span></em>'+
                            '</li>'
                        );
                    });
                    Zenwork.Chart.Control.installTo(teamMembersChartLegend, teamMemberDatasets);
                    teamMembersChartLegend.on('update.zenworkchart', function (e, datasets) {
                        var datasetsKey = $.map(datasets, function(el, index) {return index;});
                        var api = teamMemberWorkloadStatisticModel.container.highcharts();
                        $.each(teamMemberDatasets, function (key, obj) {
                            var series = api.get(obj.id);
                            if ( $.inArray(key, datasetsKey) > -1 ) {
                                series.show();
                            }
                            else {
                                series.hide();
                            }
                        });
                    });
                    //Team member workload chart: start drawing chart
                    if ( teamMemberWorkloadStatistic.length > 0 
                        && teamMemberWorkloadChartBlock.length > 0 
                        && teamMemberWorkloadStatisticModel !== undefined
                    ) { //draw chart
                        teamMemberWorkloadChartBlock.removeClass('ZWPending');
                        teamMemberWorkloadStatisticModel.setLabels(chartLabel[opts.xAxisType]);
                        teamMemberWorkloadStatisticModel.setDatasets(teamMemberDatasets);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if ( textStatus !== 'abort' ) {
                        alert('Really sorry for this, network error! Please try again!');
                    }
                }
            });
        }
        var teamSelection = $('#teamAutoSuggestDashboard');
        var defaultTeamID = teamSelection.attr('data-default-tid');
        Zenwork.Plugins.autocomplete(teamSelection, null, {
            remoteDatasource: Zenwork.Root+'/team/searchByUserTeam',
            autocomplete: {
                minLength: 0
            }
        });
        teamSelection.on('mouseup', function (e) {
            $(this).select();
        });
        teamSelection.on('autocompleteselect', function (e, ui) {
            Zenwork.Dashboard.pub('teamSelectedFirstTime.Help.Dashboard');
            Zenwork.Team.toggleEditing(true);
            teamSelection.blur();
            var tid = Zenwork.Team.active = ui.item.value;
            if ( defaultTeamID > 0 ) {
                if ( tid != defaultTeamID ) {
                    Zenwork.Team.buttons.setDefault.removeAttr('checked');
                }
                else {
                    Zenwork.Team.buttons.setDefault.attr('checked', 'checked');
                }
            }
            _loadTeamData_(Zenwork.Team.active);
        });
        Zenwork.Team.init();
        Zenwork.Team.onListener = 'Zenwork.Dashboard';
        Zenwork.Team.hook(Zenwork.Team.EVENT.CREATE, 'Zenwork.Dashboard', function (data) {
            _loadTeamData_(Zenwork.Team.active);
            teamSelection.val(data.name);

            //update autocomplete list value 'label'
            var autocompleteApi = teamSelection.data('uiAutocomplete');
            var cache = autocompleteApi.getCache();
            $.each(cache, function (index, _cache) {
                _cache.push({
                    label: data.name,
                    value: data.id
                });
            });
        });
        Zenwork.Team.hook(Zenwork.Team.EVENT.UPDATE, 'Zenwork.Dashboard', function (data) {
            teamSelection.val(data.name);

            //update autocomplete list value 'label'
            var autocompleteApi = teamSelection.data('uiAutocomplete');
            var cache = autocompleteApi.getCache();
            $.each(cache, function (index, _cache) {
                $.each(_cache, function () {
                    if ( this.value == data.id ) {
                        this.label = data.name;
                        return false; //break;
                    }
                });
            });
        });
        Zenwork.Team.hook(Zenwork.Team.EVENT.DELETE, 'Zenwork.Dashboard', function (data) {
            teamSelection.val('');

            //update autocomplete list value 'label'
            var autocompleteApi = teamSelection.data('uiAutocomplete');
            var cache = autocompleteApi.getCache();
            $.each(cache, function (index, _cache) {
                $.each(_cache, function (_index, __cache) {
                    if ( __cache.value == data ) {
                        _cache.splice(_index, 1);
                        return false; //break;
                    }
                });
            });

            teamResourceStatisticModel.clearDatasets();
            teamMemberWorkloadStatisticModel.clearDatasets();
            $('#teamMembersChartLegend').empty();
        });
        Zenwork.Team.hook(Zenwork.Team.EVENT.SET_DEFAULT, 'Zenwork.Dashboard', function (data) {
            teamSelection.attr('data-default-tid', data);
            defaultTeamID = data;
        });
        Zenwork.Team.hook(Zenwork.Team.EVENT.INVITE, 'Zenwork.Dashboard', function (data) {
            _loadTeamData_(Zenwork.Team.active);
        });
        Zenwork.Team.hook(Zenwork.Team.EVENT.UNINVITE, 'Zenwork.Dashboard', function (data) {
            _loadTeamData_(Zenwork.Team.active);
        });
        Zenwork.Team.buttons.create.on('click', function (e) {
            Zenwork.Dashboard.pub('firstTeamCreating.Help.Dashboard');
        })

        //init default team control & data
        if ( defaultTeamID > 0 ) {
            Zenwork.Team.setDefaultTeam(defaultTeamID);
            _loadTeamData_(defaultTeamID);
        }
        var teamResourceTimeBounce = $('.TeamResourceTimeBounce');
        teamResourceTimeBounce.on('change', function (e) {
            teamResourceTimeBounce.val(this.value);
            var selectedOption = $(this).find('option[value="'+this.value+'"]').eq(0);
            _loadTeamData_(Zenwork.Team.active, {
                timeBounce: this.value,
                xAxisType: selectedOption.data('label')
            });
        });
    /* End. Team control */
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
                    unassignedTask: 'UnassignedTask',
                    streamOverdue: 'StreamOverdue'
                },
                listPrefix: '',
                selectable: false,
                isUserScroll: true
            },

        //constructor
            _create: function () {
                var opts = this.options;
                var self = this;
                this._super.call(this);
                this.element.on(
                    'click',
                    '.'+opts.cssClass.streamCommentBtn+', .'+opts.cssClass.streamAttachmentBtn,
                    function (e) {
                        var $target = $(e.currentTarget);
                        self._openStreamDetails(e, $($target.attr('href')), $target.attr('rel'));
                        return false;
                    });
                var disableWindowScrolling = false;

                var listjsp =  $('#'+this.element.attr('data-jsp-container'));
                var jspApi = listjsp.data('jsp');
                var currListScollTop = jspApi.getContentPositionY();
                listjsp.bind('jsp-scroll-y', function(e, scrollPositionY, isAtTop, isAtBottom) {
                    //console.log('Handle jsp-scroll-y', this,
                    //            'scrollPositionY=', scrollPositionY,
                    //            'isAtTop=', isAtTop,
                    //            'isAtBottom=', isAtBottom);
                    if ( currListScollTop !== scrollPositionY ) {
                        if ( !$(self.element.attr('rel')).hasClass('ZWSectionPullLeft') ) {
                            Zenwork.StreamPopup.close();
                        }
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
                $(window).on('click', function (e) {
                    Zenwork.Window.toggleWindowScrolling(true);
                });

                var currWindowScollTop = $(window).scrollTop();
                $(window).bind('scroll', function (e) {
                    if ( e.originalEvent !== undefined && currWindowScollTop !== $(window).scrollTop() ) {
                        Zenwork.StreamPopup.close();
                    }
                });
                this.element.on('mousedown.stream', '.'+opts.cssClass.streamDetailsBtn, function (e) {
                    var taskListSection = $(self.element.attr('rel'));
                    if( taskListSection.length > 0 && taskListSection.hasClass('ZWSectionPullLeft') ) {
                        taskListSection.addClass('ZWSectionPullLeftPermanent');
                    }
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

                this.element.on('click.tasklist', '.'+opts.cssClass.streamOverdue, function (e) {
                    $($(this).attr('rel') + ' .' + opts.cssClass.streamDetailsBtn).eq(0).trigger('mousedown');
                });
            },

        //public method
            addNewStream: function (data, isAjax, position, callback) {
                position = position === undefined ? 'bottom' : position;
                return this._addNewStream(data, isAjax, position, callback);
            },

        //private method
            _addNewStream: function (data, isAjax, position, callback) {
                var self = this;
                var opts = this.options;
                if ( $('#'+opts.listPrefix+this.PREFIX+data.id).length > 0 ) { return; }
                isAjax = isAjax || false;
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
                    var sid = opts.listPrefix+self.PREFIX+data.id;
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
                        (data.overdue ? '<span rel="#'+sid+'" title="Overdue" class="QTip '+opts.cssClass.streamOverdue+'">Overdue</span>' : '')+
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

                        if ( streamData.description === this.value ) { 
                            return false;
                        } //no change
                        streamData.description = this.value;
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

                //workload estimation(planning) control
                this._initWorkloadPlanningControl();
            
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
                            //TODO: calculate exactly duration
                            $('#'+target.data('wdaysId')).text(Math.round((end-start)/86400000));
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
                            var selectDate = Date.parse(dateStr);
                            if ( id === 'timelineDialogStartTimeCalendar' ) {
                                startField.text(dateStr);
                                if ( selectDate.valueOf() > Date.parse(endField.text()).valueOf() ) {
                                    endField.text(dateStr);
                                }
                            }
                            else if ( id === 'timelineDialogEndTimeCalendar' ) {
                                endField.text(dateStr);
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
                        '.StreamTimelineBlockEditAssignee',
                        function (e) {
                            target = $(e.currentTarget);
                            if ( target.hasClass('ZWDialogBtnActive') ) {
                                return false;
                            }
                            target.addClass('ZWDialogBtnActive');
                            if ( Zenwork.Dialog !== undefined ) {
                                Zenwork.Dialog.close();
                            }
                            var timeline = $(target.attr('href'));
                            listAssignee = $(target.attr('rel'));
                            Zenwork.AssigneeDialog.show(e, timeline, target);
                            return false;
                        }); //end. assignee
                }

                //re-assign autocomplete
                var cache = {}; //use for auto-suggest box
                var reassignBox = $('.ReassignTaskBox');
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
                    reassignBox.autocomplete('widget').on('click', function (e) {
                        $(this).menu('resetMouseHandled');
                        e.stopPropagation();
                    });
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
                        self._updateMyAssignedTimelineCompletion(postUrl, function (response) {
                            var tid = $target.data('timelineId');
                            $('.MyEffort[data-id="'+tid+'"] strong').text(response);
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
                    Core.Mediator.pub('afterClickFinishTask.Help.Dashboard');

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
                    Core.Mediator.pub('afterClickStartWorking.Help.Dashboard');

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

                            Core.Mediator.pub('finishTask.Help.Dashboard', '.StreamTimelineBlockCompletion:first');
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
            _openStreamDetails: function (e, stream, aside, callback) {
                var self = this;
                var opts = this.options;
                var taskListSection = $(this.element.attr('rel'));
                if ( taskListSection.length > 0 ) {
                    taskListSection.removeClass('ZWSectionPullLeftPermanent');
                    if ( !taskListSection.hasClass('ZWSectionPullLeft') ) {
                        taskListSection.addClass('ZWSectionPullLeft');
                        if ( !taskListSection.hasClass('SubscribedClosePopup') ) {
                            taskListSection.addClass('SubscribedClosePopup')
                            Core.Mediator.sub('beforeCloseStreamPopup.StreamPopup', function () {
                                if ( !taskListSection.hasClass('ZWSectionPullLeftPermanent') ) {
                                    taskListSection.removeClass('ZWSectionPullLeft');
                                }
                            });
                        }
                    }
                }
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
                            Zenwork.Plugins.jScrollPane.call(this, {verticalGutter: 0, contentWidth: '0px'});
                        });
                        scrollContentBlock.bind(
                            'jsp-scroll-y', 
                            function(e, scrollPositionY, isAtTop, isAtBottom) {
                                if ( Zenwork.Dialog !== undefined ) {
                                    Zenwork.Dialog.close();
                                }
                            });
                    
                        if ( callback !== undefined ) { callback(); }

                        Core.Mediator.pub('startWorkingTask.Help.Dashboard', '.StreamTimelineBlockStartWorking:first');
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
            },
            _notFoundException: function (stream) {
                var self = this;                
                var opts = this.options;

                Zenwork.StreamPopup.show({content: '<p class="ExceptionNotFound">'+Zenwork.Exception.MESSAGE['404']+'&nbsp;&nbsp;<a href="#s'+stream.data('id')+'" title="remove from list">remove from list</a></p>'});

                //remove stream if stream does not exist anymore
                $('.ExceptionNotFound a').on('click', function (e) {
                    Zenwork.StreamPopup.close();

                    var streamWrapper = $($(e.currentTarget).attr('href')).parent();
                    //re-index all list item after
                    $('.'+opts.cssClass.streamIndex+':gt('+streamWrapper.prevAll('li').length+')').each(function () {
                        $(this).text(Number($(this).text())-1);
                    });
                    streamWrapper.remove();

                    if ( self._isEmpty() ) {
                        $('#todayTaskListEmptyBlock').removeClass('Hidden');
                    }

                    return false;
                });
            },
    });
})(jQuery);

//Team is a group of people in Zenwork
Zenwork.Team = {
    EVENT: {
        CREATE: 'create',
        UPDATE: 'update',
        DELETE: 'delete',
        SET_DEFAULT: 'setDefault',
        INVITE: 'invite',
        UNINVITE: 'uninvite'
    },
    active: 0,
    defaultTeam: 0,
    hookAction: {},
    hook: function (when, listener, action) {
        this.hookAction[when][listener] = action;
    },
    buttons: {
        create: $('<div/>'),
        edit: $('<div/>'),
        manageUser: $('<div/>'),
        setDefault: $('<div/>')
    },
    onListener: null,
    toggleEditing: function (editable) {
        this.buttons.edit.toggleClass('CommonBtnDisabled', !editable);
        this.buttons.manageUser.toggleClass('CommonBtnDisabled', !editable);
        this.buttons.setDefault.parent().toggleClass('SetDefaultTeamDisabled', !editable);
    },
    init: function () {
        for ( var i in this.EVENT ) {
            this.hookAction[this.EVENT[i]] = [];
        }
    
        //buttons
        var createNewTeamBtn = this.buttons.create = $('#createNewTeam');
        var editSelectedTeamBtn = this.buttons.edit = $('#editSelectedTeam');
        var manageUserTeamBtn = this.buttons.manageUser = $('#manageUserTeam');
        var setDefaultTeamBtn = this.buttons.setDefault = $('#setDefaultTeam');
        var pos = {
            my: 'center top',
            at: 'center top+60',
            of: window
        };
        
        //create, edit, delete stream list document
        var _CUTeam_ = function (CU) {
            var postUrl = Zenwork.Root+'/team/cu';
            var ajaxGetData = {};
            if ( CU === Zenwork.Team.EVENT.UPDATE ) {
                ajaxGetData.id = Zenwork.Team.active;
            }
            Zenwork.Popup.preProcess(pos, true);
            $.ajax({
                type: 'POST',
                url: postUrl,
                dataType: 'html', //receive from server
                contentType: 'json',
                data: JSON.stringify(ajaxGetData),
                success: function (data, textStatus, jqXHR) {
                    Zenwork.Popup.show(data);
                    
                    //init autoresize textarea
                    Zenwork.Popup.wrapper.find('.AutoResizeTextbox').autoresize({
                        container: 'tmpContainer',
                        buffer: 1,
                        animate: false,
                        resizeOnStart: true,
                        onresize: function () {}
                    });

                    var newTeamNameField = $('#newTeamName').focus();
                    var newTeamDescriptionField = $('#newTeamDescription');
                    
                    //validate form and submit
                    $('#submitTeamFormBtn').on('click', function (e) {
                        var $target = $(e.currentTarget).addClass('Pending');
                        //validate
                        if ( newTeamNameField.val() === '' ) {
                            $target.removeClass('Pending');
                            newTeamNameField.addClass('Error').focus();
                            newTeamNameField.parent().find('.ErrorBox').removeClass('Hidden');
                            return false;
                        }
                        else {
                            newTeamNameField.removeClass('Error');
                            newTeamNameField.parent().find('.ErrorBox').addClass('Hidden');
                        }

                        //submit
                        var ajaxPostData = {
                            name: newTeamNameField.val(),
                            description: newTeamDescriptionField.val()
                        };
                        if ( CU === Zenwork.Team.EVENT.UPDATE ) {
                            ajaxPostData.id = Zenwork.Team.active;
                        }
                        $.ajax({
                            type: 'POST',
                            url: postUrl,
                            dataType: 'json', //receive from server
                            contentType: 'json', //send to server
                            data: JSON.stringify(ajaxPostData),
                            success: function (data, textStatus, jqXHR) {
                                if ( CU === Zenwork.Team.EVENT.CREATE ) {
                                    Zenwork.Team.active = data.id;
                                    Zenwork.Team.toggleEditing(true);
                                    setDefaultTeamBtn.removeAttr('checked', 'checked');
                                    Zenwork.Popup.close(true);
                                }
                                else if ( CU === Zenwork.Team.EVENT.UPDATE ) {
                                    Zenwork.Popup.close(true);
                                    Zenwork.Notifier.notify('Updated', 1);
                                }
                                if ( Zenwork.Team.hookAction[CU][Zenwork.Team.onListener] !== undefined ) {
                                    Zenwork.Team.hookAction[CU][Zenwork.Team.onListener](data);
                                }
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                if ( textStatus !== 'abort' ) {
                                    alert('Really sorry for this, network error! Please try again!');
                                }
                            }
                        });
                        return false;
                    });

                    //delete
                    $('#deleteTeamFormBtn').on('click', function (e) {
                        var $target = $(e.currentTarget).addClass('Pending');
                        Zenwork.Window.confirm('Sure? All tasks in this plan will be deleted.\nIt can not be undone',
                            function () {
                               $.ajax({
                                    type: 'POST',
                                    url: Zenwork.Root+'/team/remove/'+Zenwork.Team.active,
                                    dataType: 'json', //receive from server
                                    success: function (data, textStatus, jqXHR) {
                                        //return deleted team ID if success, false in otherwise
                                        $target.removeClass('Pending');

                                        Zenwork.Team.active = 0;
                                        Zenwork.Team.toggleEditing(false);
                                        setDefaultTeamBtn.removeAttr('checked', 'checked');

                                        if ( Zenwork.Team.hookAction[Zenwork.Team.EVENT.DELETE][Zenwork.Team.onListener] !== undefined
                                        ) {
                                            Zenwork.Team.hookAction[Zenwork.Team.EVENT.DELETE][Zenwork.Team.onListener](data);
                                        }

                                        Zenwork.Popup.close(true);
                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        if ( textStatus !== 'abort' ) {
                                            alert('Really sorry for this, network error! Please try again!');
                                        }
                                    }
                                }); 
                            },
                            function () {
                                $target.removeClass('Pending');
                            }
                        );
                        return false;
                    });
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if ( textStatus !== 'abort' ) {
                        alert('Really sorry for this, network error! Please try again!');
                    }
                }
            });
        }
        createNewTeamBtn.on('click', function (e) {
            _CUTeam_(Zenwork.Team.EVENT.CREATE);
            return false;
        });
        editSelectedTeamBtn.on('click', function (e) {
            if ( editSelectedTeamBtn.hasClass('CommonBtnDisabled') ) { return false;  }
            _CUTeam_(Zenwork.Team.EVENT.UPDATE);
            return false;
        });

        var _manageUserTeam_ = function (CU) {
            var postUrl = Zenwork.Root+'/team/manageUserTeam/'+Zenwork.Team.active;
            Zenwork.Popup.preProcess(pos, true);
            $.ajax({
                type: 'POST',
                url: postUrl,
                dataType: 'html', //receive from server
                success: function (data, textStatus, jqXHR) {
                    Zenwork.Popup.show(data);

                    //init auto suggest email
                    var invitedEmails = $('#invitedEmails').focus();
                    Zenwork.Plugins.autocomplete(invitedEmails, null, {
                        isMultiple: true,
                        remoteDatasource: Zenwork.Root+'/auth/searchEmail',
                        autocomplete: {
                            minLength: 0
                        }
                    });
                    
                    //init autoresize textarea
                    Zenwork.Popup.wrapper.find('.AutoResizeTextbox').autoresize({
                        container: 'tmpContainer',
                        buffer: 1,
                        animate: false,
                        resizeOnStart: true,
                        onresize: function () {}
                    });

                    //send invitation button
                    $('#sendTeamInvitation').on('click', function (e) {
                        if ( !$(e.currenttarget).hasClass('Pending') ) {
                            _sendInvitation_(e);
                        }
                        return false;
                    });

                    //remove user button
                    $('#listInvitedPeople').on('click', '.RemoveUserTeam', function (e) {
                        if ( confirm('Sure?') ) {
                            var target = $(e.currentTarget) ;
                            _removeUserTeam_(target.attr('href'));
                            $(target.attr('rel')).remove();
                        }
                        return false;
                    });

                    Zenwork.Plugins.jScrollPane.call($('#listInvitedPeople').parent(), {verticalGutter: 0, contentWidth: '0px'});
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if ( textStatus !== 'abort' ) {
                        alert('Really sorry for this, network error! Please try again!');
                    }
                }
            });
        }
        var _sendInvitation_ = function (e) {
            var target = $(e.target).addClass('Pending');
            var invitedEmails = $('#invitedEmails');
            var invitedMessage = $('#invitedMessage');
            var invalidInvitedEmailsError = $('#invalidInvitedEmailsError');
            invitedEmails.attr('disabled', 'disabled');
            invitedMessage.attr('disabled', 'disabled');
            if ( invitedEmails.val() == '' ) {
                invitedEmails.addClass('Error').removeAttr('disabled').focus();
                invitedMessage.removeAttr('disabled');
                invalidInvitedEmailsError
                    .removeClass('Hidden')
                    .find('p:first').html('<strong>Email can not be blank</strong>');
                $(invitedEmails, invitedMessage).removeAttr('disabled');
                target.removeClass('Pending');
                return false;
            }
            invitedEmails.removeClass('Error');

            //post data
            $.ajax({
                type: 'POST',
                dataType: 'json', //receive from server
                contentType: 'json', //send to server
                url: target.attr('href'),
                data: JSON.stringify({
                    recipients: invitedEmails.val(),
                    message: invitedMessage.val()
                }),
                success: function (data, textStatus, jqXHR) {
                    var msg = '';
                    if ( data.valid !== '' ) {
                        //append
                        $.each(data.invited, function () {
                            $('#listInvitedPeople').append(
                                '<li id="invited'+this.User.id+'" class="QTip" title="Participant" data-qtip-my="right center" data-qtip-at="left center">'+
                                '    <img onerror="this.src=\''+Zenwork.Root+'/images/default-avatar.png\'" src="'+Zenwork.Root+(this.User.avatar ? '/upload_files/'+this.User.avatar : '/images/default-avatar.png')+'" alt="'+this.User.username+'">'+
                                '    <span>'+this.User.username+'</span>'+
                                '    <a class="QTip RemoveUserTeam" href="'+this.User.id+'" rel="#invited'+this.User.id+'" title="Remove '+this.User.username+' from this plan">Remove '+this.User.username+' from this plan</a>'+
                                '</li>'
                            );
                        });

                        msg += 'Invitation have been sent';
                        invitedEmails.removeClass('Error').val(data.valid);
                        if ( data.invalid !== '' ) {
                            msg += ' but contains some errors'
                            invitedEmails.addClass('Error').focus();
                            invalidInvitedEmailsError
                                .removeClass('Hidden')
                                .find('p:first').html('<strong>Invalid emails: </strong>'+data.invalid);
                        }
                        Zenwork.Notifier.notify(msg, 2);
                        invitedEmails.val('');

                        if ( Zenwork.Team.hookAction[Zenwork.Team.EVENT.INVITE][Zenwork.Team.onListener] !== undefined ) {
                            Zenwork.Team.hookAction[Zenwork.Team.EVENT.INVITE][Zenwork.Team.onListener]();
                        }
                    }
                    else {
                        invitedEmails.addClass('Error').focus();
                        invalidInvitedEmailsError
                            .removeClass('Hidden')
                            .find('p:first').html('<strong>Invalid emails: </strong>'+data.invalid);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if ( textStatus !== 'abort' ) {
                        alert('Really sorry for this, network error! Please try again!');
                    }
                },
                complete: function (jqXHR, textStatus) {
                    invitedEmails.removeAttr('disabled');
                    invitedMessage.removeAttr('disabled');
                    target.removeClass('Pending');
                }
            });
        }
        var _removeUserTeam_ = function (uid) {
            $.ajax({
                type: 'POST',
                url: Zenwork.Root+'/team/removeUserTeam/'+uid+'/'+Zenwork.Team.active,
                dataType: 'json', //receive from server
                success: function (data, textStatus, jqXHR) {
                    Zenwork.Notifier.notify('Removed', 1);
                    if ( Zenwork.Team.hookAction[Zenwork.Team.EVENT.UNINVITE][Zenwork.Team.onListener] !== undefined ) {
                        Zenwork.Team.hookAction[Zenwork.Team.EVENT.UNINVITE][Zenwork.Team.onListener]();
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if ( textStatus !== 'abort' ) {
                        alert('Really sorry for this, network error! Please try again!');
                    }
                }
            });
        }
        manageUserTeamBtn.on('click', function (e) {
            _manageUserTeam_();
            return false;
        });

        setDefaultTeamBtn.on('click', function (e) {
            if ( $(this).attr('checked') != 'checked' ) {
                return false;
            }

            Zenwork.Team.defaultTeam = Zenwork.Team.active;
            Zenwork.Team.hookAction[Zenwork.Team.EVENT.SET_DEFAULT][Zenwork.Team.onListener](Zenwork.Team.defaultTeam);
            $.ajax({
                type: 'POST',
                url: Zenwork.Root+'/team/setUserDefaultTeam/'+Zenwork.Team.defaultTeam,
                dataType: 'json', //receive from server
                success: function (data, textStatus, jqXHR) {
                    Zenwork.Notifier.notify('Set team "'+data+'" as user default display team', 2);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if ( textStatus !== 'abort' ) {
                        alert('Really sorry for this, network error! Please try again!');
                    }
                }
            });
        });
    },
    setDefaultTeam: function (tid) {
        this.active = this.defaultTeam = tid;
        this.toggleEditing(true);
        this.buttons.setDefault.attr('checked', 'checked');
    }
};
