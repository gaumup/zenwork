<?php
    $this->Css->add('/css/dashboard.css', false);

    $this->Html->script('/widgets/jquery-datepicker/js/jquery-datepicker.js', false);
    $this->Html->script('/widgets/jquery-datepicker/js/jquery-timepicker.js', false);
    $this->Html->script('/widgets/jquery-slider/js/jquery-slider.js', false);
    $this->Html->script('/widgets/stream/js/stream.js', false);
    $this->Html->script('/widgets/plupload/js/plupload.full.js', false);
    $this->Html->script('/widgets/uploader/js/uploader.js', false);
    $this->Html->script('/widgets/comment/js/comment.js', false);
    $this->Html->script('/widgets/tagit/js/tagit.js', false);
    $this->Html->script('/plugins/js/jquery-mousewheel.js', false);
    $this->Html->script('/plugins/js/jquery-selectable.js', false);
    $this->Html->script('/plugins/js/jquery-hotkeys.js', false);
    $this->Html->script('/plugins/js/chart.js', false);
    $this->Html->script('/js/dashboard.js', false);
?>

<div id="dashboard" class="ZWDashboard">
    <div id="todayTaskBlock" class="ZWBlock ZWBlockFullExpand">
        <div class="ZWBlockInner">
            <div class="ZWSection">
                <div class="ZWBlockHeader">
                    <h2>Today tasks</h2>

                    <a href="#" title="Add new task" class="ZWAddNewBtn">Add new task</a>
                </div>

                <div class="TodayTaskListWrapper">
                    <div id="todayTaskListJScrollPane" class="TodayTaskListJScrollPane ZWPending">
                        <ul id="todayTaskList" class="TodayTaskList">
                            <!-- Dynamically add -->
                        </ul>
                    </div>
                </div>
            </div>

            <div class="ZWSection">
                <div class="ZWBlockHeader">
                    <h2>Your monthly workload</h2>
                    <ul class="ZWUserStatisticLabel">
                        <li class="ZWUserStatisticLabelItem01"><span class="ZWUserStatisticLabelImg">&nbsp;</span> <em>planning</em> <span class="ZWHelpPopup QTip QTipPermanent" title="Total workload of all tasks <strong>assigned to you</strong>">help</span></li>
                        <li class="ZWUserStatisticLabelItem02"><span class="ZWUserStatisticLabelImg">&nbsp;</span> <em>actual</em> <span class="ZWHelpPopup QTip QTipPermanent" title="Total workload of all tasks <strong>assigned to you</strong> and <strong>completed</strong>">help</span></li>
                    </ul>
                </div>

                <div id="chartBlock" class="ZWChartBlock ZWLeft ZWPending">
                    <canvas id="myTaskStatistic" height="380"></canvas>
                </div>
            </div>
        </div>
    </div>
    <!--
    <div id="teamBlock" class="ZWBlock ZWBlockFullExpand">
        <div class="ZWBlockInner">
            <div class="ZWBlockHeader">
                <h2>Team activities</h2>
                <div class="ZWBlockExplore">
                    <span>go to</span>
                    <ul id="teamExploringList" class="ZWMenuList">
                        <li><a href="#" title="Task Planner">Task Planner</a></li>
                        <li><a href="#" title="Task Planner">Team Delivery</a></li>
                        <li><a href="#" title="Team KPIs">Team KPIs(Trello)</a></li>
                        <li class="ZWMenuListItemException"><a href="#" title="Settings">Settings</a></li>
                    </ul>
                </div>
            </div>

            <div class="ZWSection">
                <h3>Delivery</h3>
                <div id="teamDeliveryChart" class="ZWChartBlock"></div>
            </div>

            <div class="ZWSection">
                <h3>Resource usage</h3>
                <div id="teamResourceChart" class="ZWChartBlock"></div>
            </div>
        </div>
    </div>
    -->
</div>

<div id="helperContainer">
    <div id="streamDialog" class="ZWDialog StreamDialog Hidden">
        <a href="#" rel="#streamDialog" title="Close" class="ZWDialogCloseBtn">Close</a>
        <div class="StreamDialogDecor">
            <div class="ZWDialogContent StreamDialogContent" id="streamDialogContent">
                <!-- Dynamically loading via ajax -->
            </div>
            <div class="StreamDialogAside" id="streamDialogAside">
                <!-- Dynamically loading via ajax -->
            </div>
        </div>
    </div>
</div>