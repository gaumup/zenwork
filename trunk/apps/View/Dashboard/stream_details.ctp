<h3 id="streamDialogTitle"><span class="StreamDetailsTitle"><input type="text" <?php echo $isCreator ? '' : 'readonly="readonly"'; ?> class="TextInput TextInputAlt01 <?php if ($isCreator) : ?>QTip<?php endif; ?>" <?php if ($isCreator) : ?>title="Task name: click to edit"<?php endif; ?> value="<?php echo htmlspecialchars($stream['Stream']['name']); ?>" <?php if ($isCreator) : ?>data-qtip-my="right center" data-qtip-at="left center"<?php endif; ?> /></span></h3>
<div class="StreamContentWrapper StreamScrollContent">
    <div class="StreamContentInside">
        <div class="StreamBlock">
            <?php echo $this->element('avatar', array('user'=>$stream['Creator'])); ?>
            <p class="StreamAuthor">Created by <?php echo $stream['Creator']['username']; ?><br />
            <small><?php echo $this->Time->timeAgoInWords($stream['Stream']['createdOn']); ?></small>
            </p>

            <?php if ( $isCreator ) : ?>
            <a href="<?php echo $stream['Stream']['id']; ?>" title="Delete this task" class="CommonButtonLnk CommonButtonLnkSmall CommonButtonLnkDialog StreamDeleteBtn">Delete this task</a>
            <?php endif; ?>
        </div>

        <div class="StreamBlock">
            <?php
                $listNameFull = !empty($stream['Stream_list'])
                    ? htmlspecialchars($stream['Stream_list'][0]['name'])
                    : '[default]';

                $lid = !empty($stream['Stream_list']) ? $stream['Stream_list'][0]['id'] : 1;
            ?>
            <label class="ListSelectionLabel"><span class="ZWHelpPopup ZWHelpPopupAlt01 QTip QTipPermanent" title="Plan is a document which contains tasks, you can create your own plan in 'Task Planner' section.<br /><br />By default, any new task will be add to a plan called '[default]'<br /><br />You can move it to another plan by clicking on 'move to plan' link">help</span> Belongs to plan <span class="StreamCurrentList QTip QTipPermanent" title="Click to view and edit plan" id="belongsToList" data-lid="<?php echo $lid; ?>"><a target="_blank" href="<?php echo Configure::read('root_url').'/planner#!'.$lid; ?>" title=""><?php echo $listNameFull; ?></a></span></label>
            <?php if ($isCreator) : ?>
            <input type="text" id="listSelection" name="" value="" placeholder="move to plan" class="ReassignBox ReassignBoxAlt01" spellcheck="false" />
            <?php endif; ?>
        </div>
        <div class="StreamBlock">
            <label for="sDescription">Description</label>
            <?php if ($isCreator || !empty($stream['Stream']['description']) ) : ?>
            <textarea spellcheck="false" placeholder="enter description for your task here" id="sDescription" <?php echo $isCreator ? '' : 'readonly="readonly"'; ?> class="<?php if ($isCreator) : ?>QTip<?php endif; ?> Textarea TextareaAlt01 AutoResizeTextbox AutoSync NoLimitResizable" <?php if ($isCreator) : ?>title="Click to edit"<?php endif; ?> <?php if ($isCreator) : ?>data-qtip-my="right center" data-qtip-at="left center"<?php endif; ?>><?php echo urldecode($stream['Stream']['description']); ?></textarea>
            <?php else: ?>
            &nbsp;<span>&nbsp;&ndash;&nbsp; </span>
            <?php endif; ?>
        </div>

        <div class="StreamBlock" id="tagBlock">
            <label for="sTag<?php echo $stream['Stream']['id']; ?>">Tags</label>
            <span class="ZWHelpPopup ZWHelpPopupAlt01 QTip QTipPermanent" title="Tag is helpful for <strong>filtering, statistic on report</strong> base on tag name">help</span>
            <input type="text" class="TagInput" id="sTag<?php echo $stream['Stream']['id']; ?>" placeholder="enter tag name" value="<?php echo $stream['Stream']['tag']; ?>" />
        </div>

        <div class="StreamBlock" id="timelineBlock">
            <label>Timeline</label>
            <?php
                foreach ( $stream['Timeline'] as $key => $timeline ) {
                    echo $this->element('stream_dashboard_timeline_block', array(
                        'timeline' => $timeline,
                        'isCreator' => $isCreator
                    ));
                }
            ?>
        </div>

        <?php
            echo $this->element('stream_activity', array('streamLog'=>$streamLog));
        ?>
    </div>
</div>