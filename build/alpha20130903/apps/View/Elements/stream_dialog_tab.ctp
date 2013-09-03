<ul class="StreamDialogTab" id="streamDialogTab">
    <li class="Alt01"><a data-sid="<?php echo $sid; ?>" data-followed="<?php echo ($followed ? 'true' : 'false'); ?>" href="<?php echo Configure::read('root_url').'/streams/follow/'.$sid; ?>" class="StreamDialogFollow"><em title="<?php echo ($followed ? 'You have followed this task, click to unfollow, you will NOT receive notification email related to this task any more' : 'Click to follow. You will receive notification email when task has any update activities'); ?>" class="QTip" data-qtip-my="right center" data-qtip-at="left center"><?php echo ($followed ? 'Unfollow' : 'Follow') ?></em><span class="QTip StreamDialogFollowCounter" title="<?php echo ($followed ? 'You '.($countFollower == 1 ? '' : 'and '.($countFollower-1).' others ').'followed this task' : $countFollower.' people followed this task'); ?>"><?php echo $countFollower; ?></span></a></li>
    
    <li class="Alt01"><a href="<?php echo Configure::read('root_url').'/streams/shareStreamPopup/'.$sid; ?>" title="Click to share this task to other people" class="QTip StreamDialogShare" data-sid="<?php echo $sid; ?>" data-qtip-my="right center" data-qtip-at="left center">Share</a></li>

    <li <?php if ($active === 'Comment') : ?>class="Active"<?php endif; ?>><a href="<?php echo $sid; ?>" title="Comment" class="StreamDialogViewComment"><span><?php echo $countComment; ?></span></a></li>
    
    <li <?php if ($active === 'Attachment') : ?>class="Active"<?php endif; ?>><a href="<?php echo $sid; ?>" title="File" class="StreamDialogViewAttachment"><span><?php echo $countAttachment; ?></span></a></li>
</ul>
