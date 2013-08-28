<?php
    $this->Css->add('/widgets/planner/css/planner.css', false);

    $this->Html->script('/lib/js/raphael.js', false);
    $this->Html->script('/plugins/js/signals.js', false);
    $this->Html->script('/plugins/js/hasher.js', false);
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
                <ul id="streamListSelection" class="StreamListSelection">
                    <li class="StreamListSelectionTitle"><input type="text" class="TextInput QTip" placeholder="search a plan by name" id="streamListSelectionSearch" title="Click to search a plan" data-qtip-my="left center" data-qtip-at="right center" /></li>
                    <li><a href="1" title="">[default]</a></li>
                
                    <?php foreach ($streamList as $list) : ?>
                    <li><a data-creator-id="<?php echo $list['Stream_list']['creatorID']; ?>" href="<?php echo $list['Stream_list']['id']; ?>" class="QTip" data-qtip-my="left center" data-qtip-at="right center" title="<?php echo htmlspecialchars($list['Stream_list']['name']); ?>"><?php echo htmlspecialchars($list['Stream_list']['name']); ?></a></li>
                    <?php endforeach; ?>
                </ul>

                <a href="#" id="createNewStreamList" title="Create a new plan" class="QTip CommonButtonLnk CommonButtonLnkSmall" data-qtip-my="left center" data-qtip-at="right center">Create new +</a>
                <a href="#" id="editSelectedStreamList" title="Edit current selected plan" class="QTip CommonButtonLnk CommonButtonLnkSmall" data-qtip-my="top center" data-qtip-at="bottom center">Edit</a>
            </div>

            <!--
            <a href="#" id="robot" class="CommonButtonLnk CommonButtonLnkSmall">[Test] Robot</a>
            

            <a href="#" title="Settings" class="CommonButtonLnk CommonButtonLnkSmall CommonButtonLnkCompact GanttSettings GanttToolbarBtn">Settings</a>
            -->
            <a href="#" title="Manage people in this plan: invite new people, remove exsiting people" class="QTip CommonButtonLnk CommonButtonLnkSmall CommonButtonLnkCompact GanttPeople GanttToolbarBtn" id="manageUserList" data-qtip-my="top center" data-qtip-at="bottom center">Manage people in this plan</a>
            <a href="#" title="Filter task by tag name" class="QTip CommonButtonLnk CommonButtonLnkSmall CommonButtonLnkCompact GanttTag GanttToolbarBtn" id="manageTagList" data-qtip-my="top center" data-qtip-at="bottom center">Filter task by tag name</a>

            <a href="#drawing" id="drawTimelineTrigger" class="CommonButtonLnk GanttTimelineDrawingBtn GanttTimelineDrawingBtnDisabled CommonButtonLnkSmall CommonButtonLnkCheckbox CommonButtonLnkCheckboxDisabled QTip GanttToolbarBtn" title="Enable drawing timeline by dragging mouse on calendar row" data-qtip-my="top center" data-qtip-at="bottom center">Draw timeline</a>
            
            <!--<a href="" id="clearDocument" class="CommonButtonLnk CommonButtonLnkSmall GanttToolbarBtn">Clear document</a>-->
            
            <!--<a href="" id="addGanttMilestoneTrigger" title="Add new milestone" class="CommonButtonLnk CommonButtonLnkSmall GanttToolbarBtn">Add new milestone</a>-->

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
            <li><a href="#" title="Indent" class="StreamIndentBtn">Indent</a></li>
            <li><a href="#" title="Outdent" class="StreamOutdentBtn">Outdent</a></li>
            <li><a href="#" title="Comment" class="StreamCommentBtn">Comment <span>0</span></a></li>
            <li><a href="#" title="Attachment" class="StreamAttachmentBtn">Attach file <span>0</span></a></li>
            <li><a href="#" title="Follow" class="StreamFollowBtn StreamContextDisabledBtn">Follow</a></li>
            <li class="StreamContextListSeparator"><a href="#" title="Share" class="StreamShareBtn StreamContextDisabledBtn">Share</a></li>
            <!-- separator -->
            <li><a href="#" title="Delete" class="StreamDeleteBtn">Delete</a></li>
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
</div>

<div id="tmpContainer" class="ZWContainer"></div>