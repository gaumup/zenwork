<?php
    Router::connect('/oauth/:action/*', array('plugin' => 'OAuth', 'controller' => 'OAuthApp'));
?>
