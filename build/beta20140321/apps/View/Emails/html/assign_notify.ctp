<?php
    echo '<h3 style="font-size:20px;font-weight"bold;">You are assigned a new task</h3>';
    echo '<p>You are assigned a new task <strong>"'.htmlspecialchars($stream['name']).'"</strong> by '.($assigner).'</p>';
    if ( !empty($stream['description']) ) {
        echo '<p>with a description</p>';
        echo '<p style="background:#efefef;padding:10px;font-size:14px;line-height:18px;">'.nl2br(htmlspecialchars($stream['description'])).'</p>';
    }
    echo '<a style="display:block;float:left;padding:0 20px;height:40px;line-height:40px;border-top:1px solid #ccc;outline:1px solid #000;background:#666;color:#fff;text-decoration:none;margin-right:10px;" href="'.$url.'" title="View">View</a>';
?>