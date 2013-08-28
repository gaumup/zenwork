<!--@params:
    - $timeline
    - $isCreator
    - $hasChild
-->
<?php
    //TODO
    $wdays = round(($timeline['end'] - $timeline['start'])/86400, 2);
?>
<div class="StreamBlock StreamTimelineBlock <?php if ( $timeline['completed'] ) : ?>StreamTimelineBlockDone<?php endif; ?>" id="streamTimelineBlock<?php echo $timeline['id']; ?>">
    <?php
        $isOwner = false;
        foreach ( $timeline['assignee'] as $userTimeline ) {
            if ( $userTimeline['User']['id'] == $this->Session->read('Auth.User.id') ) {
                $isOwner = true;
                break;
            }
        }
    ?>

    <!-- Completion & Delete timeline button -->
    <?php if ( $isCreator ) : ?>
    <ul class="StreamTimelineBlockActionBtn">
        <li><a href="#b<?php echo $timeline['id']; ?>" rel="#streamTimelineBlock<?php echo $timeline['id']; ?>" title="Toggle completion" class="StreamTimelineBlockCompletion <?php if ( $timeline['completed'] ) : ?>StreamTimelineBlockCompleted<?php endif; ?>">Toggle completion</a></li>
        
        <li><a href="#b<?php echo $timeline['id']; ?>" rel="#streamTimelineBlock<?php echo $timeline['id']; ?>" title="Delete timeline" class="StreamTimelineBlockDelete <?php if ( !$showDeleteTimelineBtn ) : ?>Hidden<?php endif; ?>">Delete timeline</a></li>
    </ul>
    <?php endif; ?>

    <!-- Start/Deadline -->
    <div class="StreamBlockInside">
        <label>Start <span data-id="<?php echo $timeline['id']; ?>" class="StreamDateTime StreamDateTimeStart"><?php echo date('d-M-Y', $timeline['start']); ?></span> Deadline <span data-id="<?php echo $timeline['id']; ?>" class="StreamDateTime StreamDateTimeEnd"><?php echo date('d-M-Y', $timeline['end']); ?></span>&nbsp;&nbsp;&nbsp;<span id="streamTimelineWDays<?php echo $timeline['id']; ?>"><?php echo $wdays; ?></span> wdays</label>

        <?php if ( !$hasChild && ($isCreator || $isOwner) ) : ?>
            <a data-id="streamTimelineBlockEditTimeline<?php echo $timeline['id']; ?>" href="#b<?php echo $timeline['id']; ?>" title="Change <strong>Start</strong> and <strong>Deadline</strong>" class="QTip StreamTimelineBlockEditTimeline" data-start="<?php echo $timeline['start']; ?>" data-end="<?php echo $timeline['end']; ?>" data-wdays-id="streamTimelineWDays<?php echo $timeline['id']; ?>">Edit timeline</a>
        <?php endif; ?>
    </div>

    <!-- Assignee -->
    <div class="StreamBlockInside">
        <label>Assign To:</label>

        <?php if ( !$hasChild && ($isCreator || $isOwner) ) : ?>
        <a rel="#streamAssigneeList<?php echo $timeline['id']; ?>" data-tid="<?php echo $timeline['id']; ?>" data-id="streamTimelineBlockEditAssignee<?php echo $timeline['id']; ?>" href="#b<?php echo $timeline['id']; ?>" title="Assign this task to someone" class="QTip StreamTimelineBlockEditAssignee">Edit assignee</a>
        <?php endif; ?>
        
        <ul class="StreamAssigneeList" id="streamAssigneeList<?php echo $timeline['id']; ?>">
            <li class="NoAssignee <?php if (count($timeline['assignee']) > 0) :  ?>Hidden<?php endif; ?>">[No assignee]</li>

            <?php foreach ( $timeline['assignee'] as $userTimeline ) : ?>
                <li data-id="<?php echo $userTimeline['User']['id']; ?>">
                    <?php echo '<strong>'.$userTimeline['User']['username'].'</strong>(<span data-effort-id="'.$userTimeline['User']['id'].'">'.$userTimeline['Users_timeline']['effort'].'</span> wdays) <span title="'.$userTimeline['User']['username'].' completed this task" class="QTip QTipPermanent AssigneeCompleted '.($userTimeline['Users_timeline']['completed'] > 2 ? '' : 'Hidden').'" data-completion-id="'.$userTimeline['User']['id'].'">completed</span>'; ?>
                </li>
            <?php endforeach; ?>
        </ul>
    </div>
</div>
