<?php
    echo '<h3 style="font-size:20px;font-weight"bold;">'.(!empty($stream['Stream']['streamExtendModel']) ? $stream['Stream']['streamExtendModel'].': ' : '').$stream['Stream']['name'].'</h3>';
    echo '<p><strong>'.$username.'</strong> '.$action.' <em style="color:#999999;">on '.date('d-M-Y H:i', $time).'</em></p>';
    if ( !empty($message) ) {
        echo '<p>with a message</p>';
        echo '<p style="background:#efefef;padding:10px;font-size:14px;line-height:18px;">'.nl2br($message).'</p>';
    }
?>