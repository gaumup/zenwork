<?php
    echo '<h3 style="font-size:20px;font-weight"bold;">You are un-assigned from a task</h3>';
    echo '<p>'.$assigner.' un-assign you from task <strong>"'.$stream['name'].'"</strong>. Timeline from <strong>'.date('d-M-Y', $timeline['start']).'</strong> to <strong>'.date('d-M-Y', $timeline['end']).'</strong></p>';
    if ( !empty($stream['description']) ) {
        echo '<p>Task description</p>';
        echo '<p style="background:#efefef;padding:10px;font-size:14px;line-height:18px;">'.$stream['description'].'</p>';
    }
?>