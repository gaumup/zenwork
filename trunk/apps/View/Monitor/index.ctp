<?php
    $this->Css->add('/css/monitor.css', false);

    $this->Html->script('/plugins/js/chart.js', false);
    $this->Html->script('/plugins/js/highstock.js', false);
    $this->Html->script('/js/monitor.js', false);
?>

<h2>Active users: <?php echo count($users); ?></h2>

<div class="HrWrapper">
    <hr class="Hr" />
</div>

<h2>User daily register</h2>
<div class="ChartWrapper ChartWrapperExpand">
    <input type="hidden" id="userRegisterLiveChartData" value="<?php echo urlencode(json_encode($users)); ?>" />
    <div id="userRegisterLiveChart"></div>
</div>

<div class="HrWrapper">
    <hr class="Hr" />
</div>

<h2>Recently login users(within 1 hour)</h2>
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

<h2>Recently login users(within 1 day)</h2>
<ul class="MonitoringActiveUsersList">
    <?php foreach ($users as $_user) : ?>
    <?php
        if ( $_user['User']['lastLogin'] < (time() - 24*3600) ) {
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

<h2>Recently login users(within 1 week)</h2>
<ul class="MonitoringActiveUsersList">
    <?php foreach ($users as $_user) : ?>
    <?php
        if ( $_user['User']['lastLogin'] < (time() - 7*24*3600) ) {
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

<h2>Recently login users(last 30 days)</h2>
<p class="MonitorParagraph"></p>
<ul class="MonitoringActiveUsersList">
    <?php foreach ($users as $_user) : ?>
    <?php
        if ( $_user['User']['lastLogin'] < (time() - 30*24*3600) ) {
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

<h2>Streams creation daily monitoring(total: <?php echo count($streams); ?>)</h2>
<div class="ChartWrapper ChartWrapperExpand">
    <input type="hidden" id="streamsCreationLiveChartData" value="<?php echo urlencode(json_encode($streams)); ?>" />
    <div id="streamsCreationLiveChart"></div>
</div>

<div class="HrWrapper">
    <hr class="Hr" />
</div>

<h2>Streams creation monitoring(total: <?php echo count($streams); ?>) - weekly distributed</h2>
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

<h2>Comments daily monitoring(total: <?php echo count($comments); ?>)</h2>
<div class="ChartWrapper ChartWrapperExpand">
    <input type="hidden" id="streamsCommentChartData" value="<?php echo urlencode(json_encode($comments)); ?>" />
    <div id="streamsCommentChart"></div>
</div>

<h2>Files(total: <?php echo count($attachments); ?>)</h2>
<div class="ChartWrapper">
    <input type="hidden" id="streamsAttachmentChartData" value="<?php echo urlencode(json_encode($attachments)); ?>" />
    <canvas id="streamsAttachmentChart" height="400" />
</div>