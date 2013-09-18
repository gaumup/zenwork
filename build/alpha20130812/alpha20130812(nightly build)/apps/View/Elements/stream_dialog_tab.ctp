<ul class="StreamDialogTab" id="streamDialogTab">
    <li <?php if ($active === 'Comment') : ?>class="Active"<?php endif; ?>><a href="<?php echo $sid; ?>" title="Comment" class="StreamDialogViewComment"><span><?php echo $countComment; ?></span></a></li>
    <li <?php if ($active === 'Attachment') : ?>class="Active"<?php endif; ?>><a href="<?php echo $sid; ?>" title="File" class="StreamDialogViewAttachment"><span><?php echo $countAttachment; ?></span></a></li>
</ul>
