<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link rel="shortcut icon" href="<?php echo Configure::read("root_url"); ?>/favicon.ico" />
    <link type="text/css" rel="stylesheet" href="<?php echo Configure::read("root_url"); ?>/css/global.css" />
    <link type="text/css" rel="stylesheet" href="<?php echo Configure::read("root_url"); ?>/css/app.css" />
    <link type="text/css" rel="stylesheet" href="<?php echo Configure::read("root_url"); ?>/css/theme.css" />

    <?php echo isset($styles_for_layout) ? $styles_for_layout : ''; ?>

    <title>IMS&nbsp;&ndash;&nbsp;<?php echo $title_for_layout; ?></title>
</head>

<body>
    <?php echo $content_for_layout ?>
    <input type="hidden" value="<?php echo Configure::read("root_url")?>" id="root_url" />

    <script type="text/javascript" src="<?php echo Configure::read("root_url"); ?>/lib/js/jquery-core.js"></script>
    <script type="text/javascript" src="<?php echo Configure::read("root_url"); ?>/lib/js/jquery-ui-core.js"></script>
    <script type="text/javascript" src="<?php echo Configure::read("root_url"); ?>/plugins/js/jquery-ui-widget.js"></script>
    <script type="text/javascript" src="<?php echo Configure::read("root_url"); ?>/plugins/js/jquery-ui-mouse.js"></script>
    <script type="text/javascript" src="<?php echo Configure::read("root_url"); ?>/plugins/js/jquery-ui-position.js"></script>

    <?php echo $scripts_for_layout ?>
</body>
</html>





