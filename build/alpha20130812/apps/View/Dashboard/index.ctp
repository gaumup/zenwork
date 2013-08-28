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
                    <h2>Today task list</h2><span class="ZWHelpPopup ZWHelpPopupAlt01 QTip QTipPermanent" title="For sirst time page loading(F5) today task list only display tasks assigned to you which not completed and start day earlier than today<br /><br />When you create a new task(which not start today) or update a task as completed, it will show in the list until you refresh the page(F5)" data-qtip-my="left top" data-qtip-at="right top">help</span>

                    <a href="#" title="Create a new task" id="zwAddNewTaskCompact" class="ZWAddNewBtn ZWAddNewBtnCompact QTip">Create a new task</a>
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
                    <h2>Your monthly workload</h2><span class="ZWHelpPopup ZWHelpPopupAlt01 QTip QTipPermanent" title="This chart will show your monthly workload. It contains 2 lines: 'planning' and 'actual'. It auto update every 5 minutes" data-qtip-my="left top" data-qtip-at="right top">help</span>

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

    <?php
        //1. Dashboard: Empty | serverID: addNewStreamTextButton
        if ( in_array('addNewStreamTextButton', $myHelp) ) {
            echo $this->element('tour_block', array(
                'serverID' => 'addNewStreamTextButton',
                'id' => '#zwAddNewTaskText',
                'title' => 'Create a new task',
                'text' => 'Create your first task on Zenwork here. After creating you can assign it to youself or your colleagues',
                'btnText' => 'Got it :)',
                'posMy' => 'center top',
                'posAt' => 'center bottom',
                'posAjust' => '0 10'
            ));
        }

        //2. Dashboard: Empty | serverID: addNewStreamQuickButton
        if ( in_array('addNewStreamQuickButton', $myHelp) ) {
            echo $this->element('tour_block', array(
                'serverID' => 'addNewStreamQuickButton',
                'id' => '#zwAddNewTaskCompact',
                'title' => 'Create a new task',
                'text' => 'You can also create a new task by clicking here',
                'btnText' => 'Got it :)',
                'posMy' => 'right center',
                'posAt' => 'left center',
                'posAjust' => '-10 0'
            ));
        }

        //3. Dashboard: Empty | serverID: userMonthlyWorkloadChartExplanation
        if ( in_array('userMonthlyWorkloadChartExplanation', $myHelp) ) {
            echo $this->element('tour_block', array(
                'serverID' => 'userMonthlyWorkloadChartExplanation',
                'id' => '#myTaskStatisticChartBlock',
                'title' => 'Monthly workload statistic',
                'text' => 'This chart will show your monthly workload. It contains 2 lines: "planning" and "actual". It auto update every 5 minutes',
                'btnText' => 'Got it :)',
                'posMy' => 'center center',
                'posAt' => 'center center'
            ));
        }

        //4. Dashboard: New task -> edit task name | serverID: editStreamSubjectFirstTime
        if ( in_array('editStreamSubjectFirstTime', $myHelp) ) {
            echo $this->element('tour_block', array(
                'serverID' => 'editStreamSubjectFirstTime',
                'id' => '#streamDialogTitle',
                'title' => 'Edit task name',
                'text' => 'Click here to start edit task name. It will auto-save when you start typing',
                'btnText' => 'Got it :)',
                'posMy' => 'right center',
                'posAt' => 'left center',
                'posAjust' => '-5 0'
            ));
        }

        //5. Dashboard: New task -> move to plan input | serverID: moveStreamToListFirstTime
        if ( in_array('moveStreamToListFirstTime', $myHelp) ) {
            echo $this->element('tour_block', array(
                'serverID' => 'moveStreamToListFirstTime',
                'id' => '#listSelection',
                'title' => 'Move task to other plan',
                'text' => 'Click and type the name of plan which you want to move this task to<br /><br />If you do not create any plan before go to "Task Planner" section to create a plan first',
                'btnText' => 'Got it :)',
                'posMy' => 'left center',
                'posAt' => 'right center',
                'posAjust' => '10 0'
            ));
        }
        
        //6. Dashboard: New task -> tagging | serverID: streamTaggingFirstTime
        if ( in_array('streamTaggingFirstTime', $myHelp) ) {
            echo $this->element('tour_block', array(
                'serverID' => 'streamTaggingFirstTime',
                'id' => '#tagBlock',
                'title' => 'Tagging a task',
                'text' => 'Enter tag name for this task. Tag is helpful for filtering task, statistic on report base on tag name<br /><br />**Note: tag is CASE-INSENSITIVE and a task can have NO LIMITED tags',
                'btnText' => 'Got it :)',
                'posMy' => 'left center',
                'posAt' => 'right center',
                'posAjust' => '5 0'
            ));
        }

        //7. Dashboard: New task -> timeline and assignee | serverID: timelineDurationAndAssigneeFirstTime
        if ( in_array('timelineDurationAndAssigneeFirstTime', $myHelp) ) {
            echo $this->element('tour_block', array(
                'serverID' => 'timelineDurationAndAssigneeFirstTime',
                'id' => '#timelineBlock',
                'title' => 'Timeline and assign people',
                'text' => 'You can update START/DEADLINE (by clicking <img src="widgets/tour/images/edit-timeline-btn.png" />). Note start/deadline is task duration<br /><br />Then you can ASSIGNE this task to yourself or colleagues (by clicking <img src="widgets/tour/images/edit-assignee-btn.png" />). After assigning to people, an email will be sent to notify them',
                'btnText' => 'Got it :)',
                'posMy' => 'right center',
                'posAt' => 'left center',
                'posAjust' => '-5 0'
            ));
        }

        //8. Dashboard: Today task list -> view | serverID: todayListExplanation
        if ( in_array('todayListExplanation', $myHelp) ) {
            echo $this->element('tour_block', array(
                'serverID' => 'todayListExplanation',
                'id' => '#todayTaskListJScrollPane',
                'title' => 'Today task list',
                'text' => 'For first time page loading(F5) today task list only display tasks assigned to you which not completed and start day is earlier than today<br /><br />When you create a new task(which not start today or not assigned to yourself) it will show in the list until you refresh the page(F5)',
                'btnText' => 'Got it :)',
                'posMy' => 'left top',
                'posAt' => 'left bottom',
                'posAjust' => '10 -200'
            ));
        }

        //9. Dashboard: Task details -> start working | serverID: timelineStartWorkingFirstTime
        if ( in_array('timelineStartWorkingFirstTime', $myHelp) ) {
            echo $this->element('tour_block', array(
                'serverID' => 'timelineStartWorkingFirstTime',
                'id' => '.StreamTimelineBlockStartWorking:first',
                'title' => 'Start working on this task',
                'text' => 'Click on this icon to start working on this task. An email will be sent to creator of this task to notify he/she that you have started working on this task',
                'btnText' => 'Got it :)',
                'posMy' => 'right bottom',
                'posAt' => 'right top',
                'posAjust' => '-1 -5'
            ));
        }

        //10. Dashboard: Task details -> update completed | serverID: timelineCompletionFirstTime
        if ( in_array('timelineCompletionFirstTime', $myHelp) ) {
            echo $this->element('tour_block', array(
                'serverID' => 'timelineCompletionFirstTime',
                'id' => '.StreamTimelineBlockCompletion:first',
                'title' => 'Update task completion',
                'text' => 'Click on this icon to update task as completed. An email will be sent to creator of this task to notify he/she that you have started working on this task<br /><br />After click to check completed, you can un-check to mark this task as un-completed',
                'btnText' => 'Got it :)',
                'posMy' => 'left center',
                'posAt' => 'right center',
                'posAjust' => '0 0'
            ));
        }

        //TIP: Dashboard: New task plan(list) explanation | serverID: streamListExplanation
        if ( in_array('streamListExplanation', $myHelp) ) {
            echo $this->element('tour_block', array(
                'serverID' => 'streamListExplanation',
                'id' => '#belongsToList',
                'title' => 'Belongs to plan',
                'text' => 'By default, any new task created will be add to a plan called "[default]"<br /><br />You can move it to another plan by clicking on "move to plan" link on the right',
                'btnText' => 'Got it :)',
                'posMy' => 'center top',
                'posAt' => 'center bottom',
                'posAjust' => '0 10'
            ));
        }
    ?>
</div>