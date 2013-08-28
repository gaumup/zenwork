<?php
    $this->Css->add('/widgets/planner/css/planner.css', false);

    $this->Html->script('/lib/js/raphael.js', false);
    $this->Html->script('/plugins/js/signals.js', false);
    $this->Html->script('/plugins/js/hasher.js', false);
    $this->Html->script('/plugins/js/crossroads.js', false);
    $this->Html->script('/plugins/js/json2.js', false);
    $this->Html->script('/plugins/js/jquery-mousewheel.js', false);
    $this->Html->script('/plugins/js/jquery-selectable.js', false);
    $this->Html->script('/plugins/js/jquery-hotkeys.js', false);
    $this->Html->script('/widgets/jquery-datepicker/js/jquery-datepicker.js', false);
    $this->Html->script('/widgets/jquery-datepicker/js/jquery-timepicker.js', false);
    $this->Html->script('/widgets/jquery-slider/js/jquery-slider.js', false);
    $this->Html->script('/widgets/stream/js/stream.js', false);
    $this->Html->script('/widgets/planner/js/syncscroll.js', false);
    $this->Html->script('/widgets/planner/js/resizable.js', false);
    $this->Html->script('/widgets/planner/js/timeline.js', false);
    $this->Html->script('/widgets/planner/js/milestone.js', false);
    $this->Html->script('/widgets/planner/js/calendar.js', false);
    $this->Html->script('/widgets/planner/js/planner.js', false);
    $this->Html->script('/widgets/plupload/js/plupload.full.js', false);
    $this->Html->script('/widgets/uploader/js/uploader.js', false);
    $this->Html->script('/widgets/comment/js/comment.js', false);
    $this->Html->script('/widgets/tagit/js/tagit.js', false);
    $this->Html->script('/widgets/jquery-dialog/js/jquery-dialog.js', false);
?>
<div id="ganttApp" class="GanttApp">
    <div class="Invisible">
        <div id="ganttTimelineToolbar" class="GanttTimelineToolbar">
            <div class="FilterBlock">
                <div class="StreamListSelectionWrapper">
                    <ul id="streamListSelection" class="StreamListSelection">
                        <li class="StreamListSelectionTitle"><input type="text" class="TextInput QTip" placeholder="Click to select a plan to view" id="streamListSelectionSearch" title="Type search or select a plan to view" data-qtip-my="left center" data-qtip-at="right center" /></li>
                        <li><a href="1" title="">[default]</a></li>
                    
                        <?php foreach ($streamList as $list) : ?>
                        <li><a data-creator-id="<?php echo $list['Stream_list']['creatorID']; ?>" href="<?php echo $list['Stream_list']['id']; ?>" class="QTip" data-qtip-my="left center" data-qtip-at="right center" title="Click to view plan '<?php echo htmlspecialchars($list['Stream_list']['name']); ?>'"><?php echo htmlspecialchars($list['Stream_list']['name']); ?></a></li>
                        <?php endforeach; ?>
                    </ul>
                    <a href="#" id="editSelectedStreamList" title="Edit/delete current selected plan" class="QTip CommonButtonLnk CommonButtonLnkSmall EditSListBtn" data-qtip-my="top center" data-qtip-at="bottom center">Edit</a>
                </div>

                <a href="#" id="createNewStreamList" title="Create new plan" class="QTip CommonButtonLnk CommonButtonLnkSmall TextBtn" data-qtip-my="left center" data-qtip-at="right center">Create new plan</a>

                <a href="#" title="Manage people in this plan: invite new people, remove exsiting people" class="QTip CommonButtonLnk CommonButtonLnkSmall CommonButtonLnkCompact GanttPeople GanttToolbarBtn" id="manageUserList" data-qtip-my="left center" data-qtip-at="right center">Manage people in this plan</a>
            </div>

            <!--
            <a href="#" id="robot" class="CommonButtonLnk CommonButtonLnkSmall">[Test] Robot</a>
            <a href="#" title="Settings" class="CommonButtonLnk CommonButtonLnkSmall CommonButtonLnkCompact GanttSettings GanttToolbarBtn">Settings</a>
            <a href="#" title="Filter task by tag name" class="QTip CommonButtonLnk CommonButtonLnkSmall CommonButtonLnkCompact GanttTag GanttToolbarBtn" id="manageTagList" data-qtip-my="top center" data-qtip-at="bottom center">Filter task by tag name</a>
            <a href="" id="clearDocument" class="CommonButtonLnk CommonButtonLnkSmall GanttToolbarBtn">Clear document</a>-->
            <!--<a href="" id="addGanttMilestoneTrigger" title="Add new milestone" class="CommonButtonLnk CommonButtonLnkSmall GanttToolbarBtn">Add new milestone</a>
            -->

            <a href="#drawing" id="drawTimelineTrigger" class="CommonButtonLnk GanttTimelineDrawingBtn GanttTimelineDrawingBtnDisabled CommonButtonLnkSmall CommonButtonLnkCheckbox CommonButtonLnkCheckboxDisabled QTip GanttToolbarBtn" title="Enable drawing timeline by dragging mouse on calendar row" data-qtip-my="top center" data-qtip-at="bottom center">Draw timeline</a>
            
            <a href="" id="addGanttTimelineTrigger" title="Add a new task to current plan" class="QTip CommonButtonLnk CommonButtonLnkSmall GanttToolbarBtn" data-qtip-my="right center" data-qtip-at="left center">Add new task</a>
        </div>

        <div class="GanttAppWrapper">
            <!-- Stream list -->
            <div id="streamContainer" class="StreamContainer">
                <table width="100%" cellpadding="0" cellspacing="0">
                    <thead id="streamHeader" class="StreamHeader">
                        <tr>
                            <th colspan="7" class="SearchStreamWrapper"><input disabled="disabled" type="text" placeholder="Type and press enter to highlight matched row" id="streamSearchBox[disabled]->remove[] when using" class="QTip" data-qtip-my="left center" data-qtip-at="right center" title="Sorry! Currently not available" /></th>
                        </tr>
                        <tr>
                            <th width="24" class="CenterCol"><a href="#" title="Click on checkbox of each row in this column then click on this icon to perform action(such as delete, indent, outdent...) on selected rows" id="streamBatchActionTrigger" class="StreamBatchActionTrigger QTip" data-qtip-my="bottom left" data-qtip-at="top right">Batch action</a></th>
                            <th width="54" class="RightCol NoPadding">No <span class="ZWHelpPopup ZWHelpPopupAlt02 QTip QTipPermanent" title="Drag icon next to index number to reorder task" data-qtip-my="left center" data-qtip-at="right center">Drag icon next to index number to reorder task</span></th>
                            <th width="19" class="CenterCol">&nbsp;</th>
                            <th width="19" class="CenterCol">&nbsp;</th>
                            <th width="236"><a id="streamToggleRowViewTrigger" href="#" title="Expand/collape all rows" class="StreamToggleViewAll StreamToggleViewAllExpaned QTip" data-qtip-my="bottom left" data-qtip-at="top right">Expand/collape all rows</a>Name</th>
                            <th width="29" class="CenterCol">%</th>
                            <th width="29" class="CenterCol"><!--<a href="#" title="Click to view more/less columns" class="StreamListCustomFieldsToggle QTip" id="streamListCustomFieldsToggle">View more columns</a>--></th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td colspan="7">
                                <div id="streamListClip" class="StreamListClip">
                                    <ul id="streamList" class="StreamList">
                                        <!-- Dynamically loading via ajax -->
                                    </ul>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

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

            <!-- Timeline grid -->
            <!-- overflow-x:auto -> fixed position on x-axis calendarGrid.container -->
            <div id="ganttTimelineContainer" class="GanttTimelineContainer">
                <table id="ganttCalendar" class="GanttTimelineCalendar" cellpadding="0" cellspacing="0">
                    <thead>
                        <tr id="ganttCalendarMonthRow"><!-- content dynamically created by calendar.js --></tr>
                        <tr id="ganttCalendarDayRow"><!-- content dynamically created by calendar.js --></tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>
                                <!-- overflow-y:auto -> fixed position on y-axis calendarGrid.clip -->
                                <div id="gantTimelineClip" class="GanttTimelineClip">
                                    <!-- element -->
                                    <ul id="ganttTimelineList" class="GanttTimelineList"></ul>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div id="ganttCalendarFakeScroll" class="GanttCalendarFakeScroll Hidden"><div>&nbsp;</div></div>
    </div>
</div>

<div class="ZWContainer">
    <div id="streamContextMenu" class="StreamContextMenu Hidden">
        <ul class="StreamContextList">
            <li><a href="#" title="Make this task become subtask of its above task" class="QTip StreamIndentBtn" data-qtip-my="left center" data-qtip-at="right center">Indent</a></li>
            <li><a href="#" title="Make this task no longer be a subtask of its current parent task" class="QTip StreamOutdentBtn" data-qtip-my="left center" data-qtip-at="right center">Outdent</a></li>
            <li><a href="#" title="Post a comment on this task" class="QTip StreamCommentBtn" data-qtip-my="left center" data-qtip-at="right center">Comment <span>0</span></a></li>
            <li class="StreamContextListSeparator"><a href="#" title="Attach files to this task" class="QTip StreamAttachmentBtn" data-qtip-my="left center" data-qtip-at="right center">Attach file <span>0</span></a></li>
            <!--
            <li><a href="#" title="Follow" class="StreamFollowBtn StreamContextDisabledBtn">Follow</a></li>
            <li class="StreamContextListSeparator"><a href="#" title="Share" class="StreamShareBtn StreamContextDisabledBtn">Share</a></li>
            -->
            <!-- separator -->
            <li><a href="#" title="Permanently delete this task" class="QTip StreamDeleteBtn" data-qtip-my="left center" data-qtip-at="right center">Delete</a></li>
            <!--
            <li><a href="#" title="Duplicate" class="StreamDuplicateBtn StreamContextDisabledBtn">Duplicate</a></li>
            <li><a href="#" title="Cut" class="StreamCutBtn StreamContextDisabledBtn">Cut</a></li>
            <li><a href="#" title="Copy" class="StreamCopyBtn StreamContextDisabledBtn">Copy</a></li>
            <li class="StreamContextListSeparator"><a href="#" title="Paste" class="StreamPasteBtn StreamContextDisabledBtn">Paste</a></li>
            <li><a href="#" title="Export as deliverable" class="StreamExportBtn StreamContextDisabledBtn">Export as deliverable</a></li>
            <li><a href="#" title="Export as sub project" class="StreamExportBtn StreamContextDisabledBtn">Export as sub-project</a></li>
            -->
        </ul>
    </div>

    <div id="streamGroupContextMenu" class="StreamContextMenu Hidden">
        <ul class="StreamContextList">
            <li><a href="#" title="Select all" class="StreamSelectAllBtn">Select all</a></li>
            <li class="StreamContextListSeparator"><a href="#" title="Clear selection" class="StreamClearSelectionBtn StreamContextRequiredBtn">Clear selection</a></li>
            <!--
            <li><a href="#" title="Indent" class="StreamIndentBtn StreamContextRequiredBtn">Indent selected rows</a></li>
            <li class="StreamContextListSeparator"><a href="#" title="Outdent" class="StreamOutdentBtn StreamContextRequiredBtn">Outdent selected rows</a></li>
            -->
            <!-- separator -->
            <li><a href="#" title="Delete" class="StreamDeleteBtn StreamContextRequiredBtn">Delete selected rows</a></li>
            <!--
            <li><a href="#" title="Duplicate" class="StreamDuplicateBtn StreamContextRequiredBtn StreamContextDisabledBtn">Duplicate</a></li>
            <li><a href="#" title="Cut" class="StreamCutBtn StreamContextRequiredBtn StreamContextDisabledBtn">Cut</a></li>
            <li><a href="#" title="Copy" class="StreamCopyBtn StreamContextRequiredBtn StreamContextDisabledBtn">Copy</a></li>
            <li class="StreamContextListSeparator"><a href="#" title="Paste" class="StreamPasteBtn StreamContextRequiredBtn StreamContextDisabledBtn">Paste</a></li>
            <li><a href="#" title="Export as deliverable" class="StreamExportBtn StreamContextRequiredBtn StreamContextDisabledBtn">Export as deliverable</a></li>
            -->
        </ul>
    </div>

    <div id="relationshipDialog" class="GanttDialog RelationshipDialog Hidden">
        <a href="#" title="Close" class="ZWDialogCloseBtn">Close</a>

        <div id="relationshipList"></div>
    </div>

    <a id="addingRowHelper" data-stream-extend-model="Task" data-timeline-prefix="t" href="#" title="Add new row here" class="QTip Hidden StreamRowAddingHelper" data-qtip-my="left center" data-qtip-at="right center">Add new row here</a>

    <?php
        //1. Planner: select plan list | serverID: streamListSelection 
        if ( in_array('streamListSelection', $myHelp) ) {
            echo $this->element('tour_block', array(
                'serverID' => 'streamListSelection',
                'id' => '#streamListSelection',
                'title' => 'Select a plan to view/edit',
                'text' => 'This list contains all plans which created by you or plan you have invited and joined<br /><br />Click and find the plan you want in the list',
                'btnText' => 'Got it :)',
                'posMy' => 'left top',
                'posAt' => 'left bottom',
                'posAjust' => '0 8'
            ));
        }

        //2. Planner: create new plan | serverID: createFirstStreamList
        if ( in_array('createFirstStreamList', $myHelp) ) {
            echo $this->element('tour_block', array(
                'serverID' => 'createFirstStreamList',
                'id' => '#createNewStreamList',
                'title' => 'Create your own plan',
                'text' => 'Create your own plan and then invite people joining to start working together',
                'btnText' => 'Got it :)',
                'posMy' => 'left top',
                'posAt' => 'left bottom',
                'posAjust' => '5 8'
            ));
        }

        //3. Planner: create first task | serverID: addFirstStreamIntoList
        if ( in_array('addFirstStreamIntoList', $myHelp) ) {
            echo $this->element('tour_block', array(
                'serverID' => 'addFirstStreamIntoList',
                'id' => '#addGanttTimelineTrigger',
                'title' => 'Create your first task',
                'text' => 'Create your first task in this plan',
                'btnText' => 'Got it :)',
                'posMy' => 'right top',
                'posAt' => 'right bottom',
                'posAjust' => '0 8'
            ));
        }

        //4. Planner: task details | serverID: viewStreamDetailsFirstTime
        if ( in_array('viewStreamDetailsFirstTime', $myHelp) ) {
            echo $this->element('tour_block', array(
                'serverID' => 'viewStreamDetailsFirstTime',
                'id' => '.StreamDetailsBtn:last',
                'title' => 'View task details information',
                'text' => 'Click on this icon to see the details of this task. Details will contains <strong>description, timeline, assignee, activities on this task...</strong>',
                'btnText' => 'Got it :)',
                'posMy' => 'left center',
                'posAt' => 'right center',
                'posAjust' => '0 0'
            ));
        }

        //5. Planner: task actions | serverID: streamContextFirstTime
        if ( in_array('streamContextFirstTime', $myHelp) ) {
            echo $this->element('tour_block', array(
                'serverID' => 'streamContextFirstTime',
                'id' => '.StreamContextBtn:last',
                'title' => 'Exploring task action',
                'text' => 'Click on this icon to explore which actions you can perform on this task such as: <strong>delete, make task become subtask, make task become summary task, comment, attach file...</strong>',
                'btnText' => 'Got it :)',
                'posMy' => 'left center',
                'posAt' => 'right center',
                'posAjust' => '5 0'
            ));
        }

        //6. Planner: dragging reorder | serverID: streamReorderFirstTime
        if ( in_array('streamReorderFirstTime', $myHelp) ) {
            echo $this->element('tour_block', array(
                'serverID' => 'streamReorderFirstTime',
                'id' => '.StreamDraggingBtn:last',
                'title' => 'Dragging this icon to reorder task',
                'text' => 'Dragging this icon to reorder task. You can make a task become subtask of other task by dragging it into other task.<br /><br />An arrow will be shown to help you to see where your task will be reorder to while you are dragging',
                'btnText' => 'Got it :)',
                'posMy' => 'left center',
                'posAt' => 'right center',
                'posAjust' => '5 0'
            ));
        }

        //7. Planner: timeline created | serverID: firstCreatedTimeline
        if ( in_array('firstCreatedTimeline', $myHelp) ) {
            echo $this->element('tour_block', array(
                'serverID' => 'firstCreatedTimeline',
                'id' => '.GanttTimelineBar:last',
                'title' => 'Exploring timeline bar',
                'text' => 'Hover mouse on this timeline bar to exploring it. You can perform some actions on this timeline such as:<br /> &ndash;&nbsp;Add assignee to this timeline<br />&ndash;&nbsp;Change it start/deadline by dragging timeline bar or update by clicking on calendar icon<br />&ndash;&nbsp;Delete dependancies(relationship) of this timeline with other timelines<br />&ndash;&nbsp;Delete this timeline',
                'btnText' => 'Got it :)',
                'posMy' => 'center top',
                'posAt' => 'center bottom',
                'posAjust' => '0 10'
            ));
        }
    ?>
</div>

<div id="tmpContainer" class="ZWContainer"></div>