<?php
    $this->Css->add('/css/monitor.css', false);

    $this->Html->script('/js/monitor.js', false);
    $this->Html->script('/plugins/js/chart.js', false);
?>

<h2>Current active user(total: <?php echo count($users); ?>)</h2>
<p class="MonitorParagraph">Recently login users(within 1 hour)</p>
<ul class="MonitoringActiveUsersList">
    <?php foreach ($users as $_user) : ?>
    <?php
        if ( $_user['User']['lastLogin'] < (time() - 3600) ) {
            continue;
        }
    ?>
    <li class="QTip" title="<?php echo $this->Time->timeAgoInWords($_user['User']['lastLogin']); ?>" data-qtip-my="bottom left" data-qtip-at="top left">
        <?php 
            echo $this->element('avatar', array(
                'width' => 24,
                'height' => 24,
                'user' =>$_user['User']
            ));
        ?>
        <span><?php echo $_user['User']['username']; ?><em>(<?php echo $_user['User']['email']; ?>)</em></span>
    </li>
    <?php endforeach; ?>
</ul>    

<div class="HrWrapper">
    <hr class="Hr" />
</div>

<h2>Stream creation monitoring(total: <?php echo count($streams); ?>)</h2>
<div class="ChartWrapper">
    <input type="hidden" id="streamsCreationChartData" value="<?php echo urlencode(json_encode($streams)); ?>" />
    <canvas id="streamsCreationChart" height="400" />
</div>

<div class="HrWrapper">
    <hr class="Hr" />
</div>

<h2>Plan creation monitoring(total: <?php echo count($streamLists); ?>)</h2>
<div class="ChartWrapper">
    <input type="hidden" id="streamListsCreationChartData" value="<?php echo urlencode(json_encode($streamLists)); ?>" />
    <canvas id="streamListsCreationChart" height="400" />
</div>

