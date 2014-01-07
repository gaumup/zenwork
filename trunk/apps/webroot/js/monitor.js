Zenwork.Monitor = {};

jQuery(document).ready(function () {
    (function($) {
        Zenwork.Monitor.LineChartModel = function (canvas) {
            var _drawChart_ = function (ctx, $canvas, opts) {
                opts.config.scaleFontSize = 16;
                opts.config.scaleFontStyle = 'bold';
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

        //draw chart: #streamsCreationChart -> monitoring
        var createdStreamsLiveData = {};
        var createdStreamsLive = JSON.parse(unescape($('#streamsCreationLiveChartData').val()));
        $.each(createdStreamsLive, function (index, value) {
            var _dateObj = new Date(value*1000);
            var _date = _dateObj.getDate();
            var _month = _dateObj.getMonth();
            var _year = _dateObj.getFullYear();
            var _index = new Date(_year, _month, _date).valueOf();
            if ( createdStreamsLiveData[_index] === undefined ) {
                createdStreamsLiveData[_index] = 1;
            }
            else {
                createdStreamsLiveData[_index]++;
            }
        });
        var createdStreamsLiveDataIndexed = [];
        $.each(createdStreamsLiveData, function (key, value) {
            createdStreamsLiveDataIndexed.push([Number(key), value]);
        });
        $('#streamsCreationLiveChart').highcharts('StockChart', {
            rangeSelector : {
                selected : 1
            },
            title : {
                text : 'Streams created monitoring'
            },
            series : [{
                name : 'Streams created monitoring',
                data : createdStreamsLiveDataIndexed,
                tooltip: {
                    valueDecimals: 2
                }
            }]
        });

        //draw chart: #streamsCreationChart
        var createdStreamListsData = [0, 0, 0, 0, 0, 0, 0];
        var createdStreamLists = JSON.parse(unescape($('#streamListsCreationChartData').val()));
        $.each(createdStreamLists, function (index, value) {
            //Sun = 0
            var index = new Date(value*1000).getDay();
            if ( index == 0 ) {
                index = 6;
            }
            else {
                --index;
            }
            createdStreamListsData[index]++;
        });
        var streamListsCreationStatisticModel = new Zenwork.Monitor.LineChartModel($('#streamListsCreationChart').removeClass('ZWPending'));
        streamListsCreationStatisticModel.config({
            pointValue: true,
            //scaleOverride: true,
            //scaleSteps: createdStreamLists.length,
            //scaleStepWidth: 1,
            //scaleStartValue: 0,
            scaleLabel: '<%=value%>'
        });
        streamListsCreationStatisticModel.setLabels(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
        streamListsCreationStatisticModel.setDatasets({
            created: { //actual
                fillColor : 'rgba(151, 187, 205, 0.5)',
                strokeColor : 'rgba(151, 187,205 ,1)',
                pointColor : 'rgba(151, 187, 205, 1)',
                pointStrokeColor : '#fff',
                data : createdStreamListsData
            }
        });

        //draw chart: #streamsCreationChart
        var createdStreamsData = [0, 0, 0, 0, 0, 0, 0];
        var createdStreams = JSON.parse(unescape($('#streamsCreationChartData').val()));
        $.each(createdStreams, function (index, value) {
            //Sun = 0
            var index = new Date(value*1000).getDay();
            if ( index == 0 ) {
                index = 6;
            }
            else {
                --index;
            }
            createdStreamsData[index]++;
        });
        var streamsCreationStatisticModel = new Zenwork.Monitor.LineChartModel($('#streamsCreationChart').removeClass('ZWPending'));
        streamsCreationStatisticModel.config({
            pointValue: true,
            //scaleOverride: true,
            //scaleSteps: createdStreams.length/10,
            //scaleStepWidth: 10,
            //scaleStartValue: 0,
            scaleLabel: '<%=value%>'
        });
        streamsCreationStatisticModel.setLabels(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
        streamsCreationStatisticModel.setDatasets({
            created: { //actual
                fillColor : 'rgba(151, 187, 205, 0.5)',
                strokeColor : 'rgba(151, 187,205 ,1)',
                pointColor : 'rgba(151, 187, 205, 1)',
                pointStrokeColor : '#fff',
                data : createdStreamsData
            }
        });

        //draw chart: #streamsCreationChart
        var createdStreamListsData = [0, 0, 0, 0, 0, 0, 0];
        var createdStreamLists = JSON.parse(unescape($('#streamListsCreationChartData').val()));
        $.each(createdStreamLists, function (index, value) {
            //Sun = 0
            var index = new Date(value*1000).getDay();
            if ( index == 0 ) {
                index = 6;
            }
            else {
                --index;
            }
            createdStreamListsData[index]++;
        });
        var streamListsCreationStatisticModel = new Zenwork.Monitor.LineChartModel($('#streamListsCreationChart').removeClass('ZWPending'));
        streamListsCreationStatisticModel.config({
            pointValue: true,
            //scaleOverride: true,
            //scaleSteps: createdStreamLists.length,
            //scaleStepWidth: 1,
            //scaleStartValue: 0,
            scaleLabel: '<%=value%>'
        });
        streamListsCreationStatisticModel.setLabels(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
        streamListsCreationStatisticModel.setDatasets({
            created: { //actual
                fillColor : 'rgba(151, 187, 205, 0.5)',
                strokeColor : 'rgba(151, 187,205 ,1)',
                pointColor : 'rgba(151, 187, 205, 1)',
                pointStrokeColor : '#fff',
                data : createdStreamListsData
            }
        });

        //draw chart: #streamsCommentChart
        var commentsData = [0, 0, 0, 0, 0, 0, 0];
        var comments = JSON.parse(unescape($('#streamsCommentChartData').val()));
        $.each(comments, function (index, value) {
            //Sun = 0
            var index = new Date(value*1000).getDay();
            if ( index == 0 ) {
                index = 6;
            }
            else {
                --index;
            }
            commentsData[index]++;
        });
        var commentStatisticModel = new Zenwork.Monitor.LineChartModel($('#streamsCommentChart').removeClass('ZWPending'));
        commentStatisticModel.config({
            pointValue: true,
            //scaleOverride: true,
            //scaleSteps: commentsData.length/10,
            //scaleStepWidth: 10,
            //scaleStartValue: 0,
            scaleLabel: '<%=value%>'
        });
        commentStatisticModel.setLabels(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
        commentStatisticModel.setDatasets({
            created: { //actual
                fillColor : 'rgba(151, 187, 205, 0.5)',
                strokeColor : 'rgba(151, 187,205 ,1)',
                pointColor : 'rgba(151, 187, 205, 1)',
                pointStrokeColor : '#fff',
                data : commentsData
            }
        });

        //draw chart: #streamsAttachmentChart
        var attachmentsData = [0, 0, 0, 0, 0, 0, 0];
        var attachments = JSON.parse(unescape($('#streamsAttachmentChartData').val()));
        $.each(attachments, function (index, value) {
            //Sun = 0
            var index = new Date(value*1000).getDay();
            if ( index == 0 ) {
                index = 6;
            }
            else {
                --index;
            }
            attachmentsData[index]++;
        });
        var attachmentStatisticModel = new Zenwork.Monitor.LineChartModel($('#streamsAttachmentChart').removeClass('ZWPending'));
        attachmentStatisticModel.config({
            pointValue: true,
            //scaleOverride: true,
            //scaleSteps: attachmentsData.length/10,
            //scaleStepWidth: 10,
            //scaleStartValue: 0,
            scaleLabel: '<%=value%>'
        });
        attachmentStatisticModel.setLabels(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
        attachmentStatisticModel.setDatasets({
            created: { //actual
                fillColor : 'rgba(151, 187, 205, 0.5)',
                strokeColor : 'rgba(151, 187,205 ,1)',
                pointColor : 'rgba(151, 187, 205, 1)',
                pointStrokeColor : '#fff',
                data : attachmentsData
            }
        });
    })(jQuery);
});