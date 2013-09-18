<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link rel="shortcut icon" href="<?php echo Configure::read("root_url"); ?>/favicon.ico" />
    <title>Zenwork</title>
    <link type="text/css" rel="stylesheet" href="<?php echo Configure::read("root_url"); ?>/css/global.css" />
    <?php echo isset($styles_for_layout) ? $styles_for_layout : ''; ?>
</head>

<body>
    <?php echo $content_for_layout ?>
    <?php echo $scripts_for_layout ?>
</body>