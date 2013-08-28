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

                    <a href="#" title="Add new task" id="zwAddNewTaskCompact" class="ZWAddNewBtn ZWAddNewBtnCompact">Add new task</a>
                </div>

                <div class="TodayTaskListWrapper">
                    <div id="todayTaskListJScrollPane" class="TodayTaskListJScrollPane ZWPending">
                        <ul id="todayTaskList" class="TodayTaskList">
                            <!-- Dynamically add -->
                        </ul>
                        <div id="todayTaskListEmptyBlock" class="TodayEmptyListBlock Hidden">
                            <p>No task assigned to you</p>
                            <button id="zwAddNewTaskText" class="ZWAddNewBtn CommonBtn CommonBtnSmall">Create a new task</button>
                        </div>
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

                <div id="myTaskStatisticChartBlock" class="ZWChartBlock ZWLeft ZWPending">
                    <canvas id="myTaskStatistic" height="380"></canvas>
                </div>
            </div>
        </div>
    </div>

    <!--
    <div id="teamBlock" class="ZWBlock ZWBlockFullExpand">
        <div class="ZWBlockInner">
            <div class="ZWSection">
                <div class="ZWBlockHeader">
                    <h2>Team resource usage(current month)</h2>
                    <ul class="ZWUserStatisticLabel">
                        <li class="ZWUserStatisticLabelItem01"><span class="ZWUserStatisticLabelImg">&nbsp;</span> <em>planning</em> <span class="ZWHelpPopup QTip QTipPermanent" title="Total workload of all tasks <strong>assigned to you</strong>">help</span></li>
                        <li class="ZWUserStatisticLabelItem02"><span class="ZWUserStatisticLabelImg">&nbsp;</span> <em>actual</em> <span class="ZWHelpPopup QTip QTipPermanent" title="Total workload of all tasks <strong>assigned to you</strong> and <strong>completed</strong>">help</span></li>
                    </ul>
                </div>

                <div id="teamResourceChartBlock" class="ZWChartBlock ZWChartBlockAlt01 ZWPending">
                    <canvas id="teamResourceStatistic" height="380"></canvas>
                </div>
            </div>

            <div class="ZWSection">
                <div class="ZWBlockHeader">
                    <h2>Team progress(current week)</h2>
                    <ul class="ZWUserStatisticLabel">
                        <li class="ZWUserStatisticLabelItem01"><span class="ZWUserStatisticLabelImg">&nbsp;</span> <em>planning</em> <span class="ZWHelpPopup QTip QTipPermanent" title="Total workload of all tasks <strong>assigned to you</strong>">help</span></li>
                        <li class="ZWUserStatisticLabelItem02"><span class="ZWUserStatisticLabelImg">&nbsp;</span> <em>actual</em> <span class="ZWHelpPopup QTip QTipPermanent" title="Total workload of all tasks <strong>assigned to you</strong> and <strong>completed</strong>">help</span></li>
                    </ul>
                </div>

                <div id="teamProgressBurndownChartBlock" class="ZWChartBlock ZWChartBlockAlt01 ZWPending">
                    <canvas id="teamProgressBurndown" height="380"></canvas>
                </div>
            </div>
        </div>
    </div>
    -->
</div>

<div class="ZWContainer">
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