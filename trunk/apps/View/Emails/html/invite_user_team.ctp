<?php
    echo '<h3 style="font-size:20px;font-weight"bold;">Invitation to join team</h3>';
    echo '<p><strong>'.$username.'</strong> invite you to join team <strong>"'.$team['Team']['name'].'"</strong></p>';
    if ( !empty($message) ) {
        echo '<p>with a message</p>';
        echo '<p style="background:#efefef;padding:10px;font-size:14px;line-height:18px;">'.nl2br($message).'</p>';
    }
    echo '<a style="display:block;float:left;padding:0 20px;height:40px;line-height:40px;border-top:1px solid #ccc;outline:1px solid #000;background:#666;color:#fff;text-decoration:none;margin-right:10px;" href="'.$url.'" title="Accept">Accept</a>';
?>