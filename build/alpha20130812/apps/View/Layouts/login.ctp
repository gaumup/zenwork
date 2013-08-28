<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

    <link rel="shortcut icon" href="<?php echo Configure::read('root_url'); ?>/favicon.ico" />

    <link type="text/css" rel="stylesheet" href="<?php echo Configure::read('root_url'); ?>/css/global.css" />
    <link type="text/css" rel="stylesheet" href="<?php echo Configure::read('root_url'); ?>/css/form.css" />
    <link type="text/css" rel="stylesheet" href="<?php echo Configure::read('root_url'); ?>/css/zenwork.css" />
    <link type="text/css" rel="stylesheet" href="<?php echo Configure::read('root_url'); ?>/css/login.css" />
    <link type="text/css" rel="stylesheet" href="<?php echo Configure::read('root_url'); ?>/widgets/qtip/css/qtip2.css" />
    <?php echo isset($styles_for_layout) ? $styles_for_layout : ''; ?>
</head>

<body>
	<div id="outer">
        <div id="header">
            <h1><a href="<?php echo Configure::read("root_url") ?>" title="Zenwork(alpha version)" class="Logo"><img src="<?php echo Configure::read("root_url") ?>/images/logo-zenwork-big.png" alt="Zenwork(alpha version)" /></a></h1>
            <div class="BoxContact"><a href="mailto:khoant@vng.com.vn" title="Send an email to get support from Zenwork team">Need support?</a></div>
        </div>

        <div id="content">
            <?php echo $content_for_layout; ?>
        </div>

        <div id="footer">
            <p>&copy; copyright by <strong>Zenwork 2013</strong></p>
        </div>
	</div>

    <input type="hidden" value="<?php echo Configure::read("root_url"); ?>" id="root_url" />

    <script type="text/javascript" src="<?php echo Configure::read('root_url') ?>/lib/js/jquery-core.js"></script>
    <script type="text/javascript" src="<?php echo Configure::read('root_url'); ?>/js/core.js"></script>
    <script type="text/javascript" src="<?php echo Configure::read('root_url'); ?>/plugins/js/jquery-cookie.js"></script>
    <script type="text/javascript" src="<?php echo Configure::read('root_url'); ?>/widgets/qtip/js/qtip.js"></script>
    <script type="text/javascript" src="<?php echo Configure::read('root_url') ?>/js/login.js"></script>
    <?php echo $scripts_for_layout; ?>
</body>
</html>
