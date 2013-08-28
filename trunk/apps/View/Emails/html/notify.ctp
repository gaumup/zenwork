<?php
    /* params
     * $title -> String
     * $username -> String: actor of this action
     * $action -> String
     * $message -> String
     * $url -> link to this stream
     */
    echo '<h3 style="font-size:20px;font-weight:bold;">'.htmlspecialchars($title).'</h3>';
    echo '<p><strong>'.$username.'</strong> '.nl2br(htmlspecialchars($action)).'</p>';
    echo '<p style="color:#999;font-size:10px;">-&nbsp;'.$this->Time->timeAgoInWords(time()).'</p>';
    if ( !empty($message) ) {
        echo '<p>with a message</p>';
        echo '<p style="background:#efefef;padding:10px;font-size:14px;line-height:18px;">'.nl2br(htmlspecialchars($message), true).'</p>';
    }
    if ( !empty($url) ) {
        echo '<a style="display:block;float:left;padding:0 20px;height:40px;line-height:40px;border-top:1px solid #ccc;outline:1px solid #000;background:#666;color:#fff;text-decoration:none;margin-right:10px;" href="'.$url.'" title="View">View</a>';
    }
?>