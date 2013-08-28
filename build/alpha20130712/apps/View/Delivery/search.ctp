<h3 id="streamDialogTitle"><span class="StreamDetailsTitle"><strong><?php echo count($results); ?></strong> results for "<?php echo $keyword; ?>"</span></h3>
<div class="StreamContentInside StreamScrollContent">
    <?php
        $maxlength = 150;
        if ( count($results) > 0 ) {
            echo '<ul id="searchDeliverableResults">';
            foreach ( $results as $_r ) {
                //pre-process
                $y = date('Y', $_r['Stream']['endTime']);
                $m = date('m', $_r['Stream']['endTime']);
                //because we show days of previous month in 1st week of month,
                $startMonthTime = mktime(0, 0, 0, $m, 1, $y);
                //so we need to subtract number of days = (date('N', $startMonthTime)-1)
                //to get the right 1st day to display on UI
                $startMonthTime -= (date('N', $startMonthTime)-1)*24*3600;
                $w = ceil((date('z', $_r['Stream']['endTime']) - date('z', $startMonthTime) + 1)/7);
                $startWeekTime = $startMonthTime+($w-1)*7*24*3600;
                //+7 days = 00:00:00 of 1st day of next week
                //subtract 1s to get 23:59:59 of last day of current week
                $endWeekTime = $startWeekTime+7*24*3600 - 1;

                //build 'url' link for details view of deliverable
                $url = Configure::read('root_url').'/delivery/index/'.$y.'/'.$m.'/all?tid='.$_r['Stream']['tid'].'&did='.$_r['Stream']['id'].'&positionId=team'.$_r['Stream']['tid'].'W'.$w.'&startWeekTime='.$startWeekTime.'&endWeekTime='.$endWeekTime.'&action=details';
                echo '<li>';
                echo '    <a href="'.$url.'" title="'.$_r['Stream']['name'].'">';
                echo preg_replace(
                    '/(?![^&;]+;)(?!<[^<>]*)('.$keyword.')(?![^<>]*>)(?![^&;]+;)/i',
                    '<strong>$1</strong>',
                    $_r['Stream']['name']
                );
                echo '</a>';
                $description = urldecode($_r['Stream']['description']);
                echo '    <p>'.(strlen($description) < $maxlength ? $description : substr($description, 0, $maxlength).'...').'</p>';
                echo '    <p class="TextAlt01">Deadline on</strong>&nbsp;'.date('d-M-Y H:i', $_r['Stream']['endTime']).'</p>';
                echo '    <p class="TextAlt01">Created by</strong>&nbsp;'.$_r['User']['username'].'</p>';
                echo '</li>';
            }
            echo '</ul>';
        }
    ?>
</div>