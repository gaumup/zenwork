<?php
    if ( !isset($posMy) ) { $posMy = 'left top'; }
    if ( !isset($posAt) ) { $posAt = 'left bottom'; }
    if ( !isset($posAjust) ) { $posAjust = '0 10'; }
?>

<div data-scope="<?php echo $this->params['controller']; ?>" data-server-id="<?php echo $serverID; ?>" class="TourGuideBlock Hidden" rel="<?php echo $id; ?>" data-tour-my="<?php echo $posMy; ?>" data-tour-at="<?php echo $posAt; ?>" data-tour-ajust="<?php echo $posAjust; ?>">
    <h3><?php echo $title; ?></h3>
    <p class="TourGuideText"><?php echo $text; ?></p>
    <button class="TourGuideCloseBtn"><?php echo $btnText ?></button>

    <span class="TourBlockAnchor">&nbsp;</span>
</div>