<!--@params:
    - $timeline
    - $isCreator
-->
<?php
    $isOwner = false;
    $DOMAssigneeList = '';
    if ( $isCreator ) {
        $DOMAssigneeList .= '<a rel="#streamAssigneeList'.$timeline['id'].'" data-id="'.$timeline['id'].'" href="#streamTimelineBlock'.$timeline['id'].'" title="Assign this task to someone" class="QTip StreamTimelineBlockEditAssignee StreamTimelineBlockEditAssigneeAlt01">Edit assignee</a>';
    }
    $DOMAssigneeList .= '<ul class="TimelineAssigneeList" id="streamAssigneeList'.$timeline['id'].'">';
    $effort = 0;
    $selfCompleted = false;
    if ( count($timeline['assignee']) > 0 ) {
        foreach ( $timeline['assignee'] as $userTimeline ) {
            $DOMAssigneeList .= '<li id="assigneeItemT'.$timeline['id'].'U'.$userTimeline['User']['id'].'">'.$this->element('avatar', array('user'=>$userTimeline['User'], 'width'=>24, 'height'=>24, 'class'=>'QTip', 'id'=>('assigneeT'.$timeline['id'].'U'.$userTimeline['User']['id']))).'<span title="'.$userTimeline['User']['username'].' completed this task" class="QTip QTipPermanent AssigneeCompleted '.($userTimeline['Users_timeline']['completed'] > 2 ? '' : 'Hidden').'" id="assigneeCompletionT'.$timeline['id'].'U'.$userTimeline['User']['id'].'" data-uid="'.$userTimeline['User']['id'].'" data-timeline-id="'.$timeline['id'].'" rel="#assigneeItemT'.$timeline['id'].'U'.$userTimeline['User']['id'].'">completed</span></li>';
            if ( $userTimeline['User']['id'] == $this->Session->read('Auth.User.id') ) {
                $effort = $userTimeline['Users_timeline']['effort'];
                $selfCompleted = $userTimeline['Users_timeline']['completed'];
                $isOwner = true;
            }
        }
    }
    else {
        $DOMAssigneeList .= '<li class="NoAssignee">[No assignee]</li>';
    }
    $DOMAssigneeList .= '</ul>';
?>
<?php
    /* data-assignee-json []
     * {
     *     id,
     *     username,
     *     email,
     *     avatar,
     *     Users_timeline: {
     *         effort
     *         completed
     *     }
     * }
     */
    $timelineJSON = array(
        'id' => $timeline['id'],
        'start' =>  $timeline['start'],
        'end' =>  $timeline['end'],
        'completed' =>  $timeline['completed'],
        'sid' =>  $timeline['sid'],
        'createdOn' => $timeline['createdOn'],
        'creatorID' => $timeline['creatorID'],
        'User' => array()
    );
    $assignee = array();
    foreach ( $timeline['assignee'] as $_assignee ) {
        array_push($timelineJSON['User'], array(
            'id' => $_assignee['User']['id'],
            'username' => $_assignee['User']['username'],
            'email' => $_assignee['User']['email'],
            'avatar' => $_assignee['User']['avatar'],
            'Users_timeline' => array(
                'effort' => $_assignee['Users_timeline']['effort'],
                'completed' => $_assignee['Users_timeline']['completed']
            )
        ));
    }
?>
<div class="StreamBlock StreamTimelineBlock <?php if ( $timeline['completed'] ) : ?>StreamTimelineBlockDone<?php endif; ?>" id="streamTimelineBlock<?php echo $timeline['id']; ?>" data-json="<?php echo urlencode(json_encode($timelineJSON)); ?>">
    <!-- Start/Deadline -->
    <div class="StreamBlockInside">
        <label>Start <span data-id="<?php echo $timeline['id']; ?>" class="StreamDateTime StreamDateTimeStart"><?php echo date('d-M-Y', $timeline['start']); ?></span>&nbsp;&nbsp;&nbsp;&nbsp;Deadline&nbsp;<span data-id="<?php echo $timeline['id']; ?>" class="StreamDateTime StreamDateTimeEnd"><?php echo date('d-M-Y', $timeline['end']); ?></span></label>

        <?php if ( $isCreator || $isOwner ) : ?>
        <a data-id="<?php echo $timeline['id']; ?>" href="#" title="Change <strong>Start</strong> and <strong>Deadline</strong>" class="QTip StreamTimelineBlockEditTimeline" data-start="<?php echo $timeline['start']; ?>" data-end="<?php echo $timeline['end']; ?>">Edit timeline</a>
        <?php endif; ?>
    </div>

    <?php if ( $isOwner && count($timeline['assignee']) > 0 ) : ?>
    <div class="StreamBlockInside">
        <label>My effort <span data-id="<?php echo $timeline['id']; ?>" class="MyEffort StreamDateTime"><strong><?php echo $effort; ?></strong> wdays</span>&nbsp;&nbsp;<span class="ZWHelpPopup QTip QTipPermanent" title="This is your assigned effort set by creator.<br />You can <strong>update it later</strong> when you check <strong>finished task</strong>">help</span></label>
    </div>
    <?php endif; ?>

    <?php if ( $isOwner ) : ?>
    <ul class="StreamTimelineBlockActionBtn">
        <?php if ( $selfCompleted == 1 ) : ?>
        <li><a data-timeline-id="<?php echo $timeline['id']; ?>" data-effort="<?php echo $effort; ?>" href="<?php echo Configure::read('root_url').'/dashboard/startWorkingTimeline/'.$timeline['id']; ?>" title="Start working on this timeline" class="StreamTimelineBlockStartWorking QTip">Start working on this timeline</a></li>
        <?php endif; ?>

        <li><a data-timeline-id="<?php echo $timeline['id']; ?>" data-effort="<?php echo $effort; ?>" href="<?php echo Configure::read('root_url').'/dashboard/updateTaskCompletion/'.$timeline['id']; ?>" title="Completed?" class="QTip StreamTimelineBlockCompletion <?php if ( $selfCompleted > 2 ) : ?>StreamTimelineBlockCompleted<?php endif; ?> <?php if ( $selfCompleted < 2 ) : ?>Hidden<?php endif; ?>">Completed?</a></li>
    </ul>
    <?php endif; ?>

    <div class="AssigneeListWrapper">
        <p>Assign to</p><?php echo $DOMAssigneeList; ?>
        
        <?php if ( $isOwner ) : ?>
        <ul class="StreamTimelineBlockActionBtn">
            <?php if ( !$timeline['completed'] && $selfCompleted < 3 ) : ?>
            <li><input data-timeline-id="<?php echo $timeline['id']; ?>" type="text" id="" name="" value="" placeholder="re-assign to" class="ReassignBox" spellcheck="false" /></li>
            <?php endif; ?>
        </ul>
        <?php endif; ?>
    </div>
</div>
