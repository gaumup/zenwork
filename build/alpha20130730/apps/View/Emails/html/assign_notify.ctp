<?php
    echo '<h3 style="font-size:20px;font-weight"bold;">'.(!empty($stream['Stream']['streamExtendModel']) ? $stream['Stream']['streamExtendModel'].': ' : '').$stream['Stream']['name'].'</h3>';
    echo '<p><strong>'.$username.'</strong> '.(!empty($message) ? $message : '').'</p>';
    echo '<a style="display:block;float:left;padding:8px 20px;border-top:1px solid #ccc;outline:1px solid #000;background:#666;color:#fff;text-decoration:none;margin-right:10px;" href="'.$url.'&action=details" title="View more information about this deliverable">View more</a>';
?>