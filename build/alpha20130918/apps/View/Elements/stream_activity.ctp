<div class="StreamBlock StreamActivityBlock" id="streamActivityList<?php echo $streamLog[0]['Stream_log']['sid']; ?>">
    <h4>Activity feed (<?php echo count($streamLog); ?>)</h4>
    <ul class="StreamActivities">
        <?php
            foreach ( $streamLog as $key => $dLog ) {
                echo '<li'.($key >= 5 ? ' class="Hidden"' : '').'><strong>'.$dLog['User']['username'].'</strong>&nbsp;'.nl2br(htmlspecialchars($dLog['Stream_log']['action']), true).'&nbsp;&nbsp;<em>'.$this->Time->timeAgoInWords($dLog['Stream_log']['when']).'</em></li>';
            }
        ?>
    </ul>
    <?php if ( count($streamLog) > 5 ) : ?>
    <a href="#streamActivityList<?php echo $streamLog[0]['Stream_log']['sid']; ?>" title="view more activities" class="StreamActivityViewMoreBtn">. . .</a>
    <?php endif; ?>
</div>