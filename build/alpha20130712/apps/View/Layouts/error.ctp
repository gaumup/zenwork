<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

    <link rel="shortcut icon" href="<?php echo Configure::read('root_url'); ?>/favicon.ico" />

    <link type="text/css" rel="stylesheet" href="<?php echo Configure::read('root_url'); ?>/css/global.css" />
    <link type="text/css" rel="stylesheet" href="<?php echo Configure::read('root_url'); ?>/css/form.css" />
    <link type="text/css" rel="stylesheet" href="<?php echo Configure::read('root_url'); ?>/css/zenwork.css" />
    <link type="text/css" rel="stylesheet" href="<?php echo Configure::read('root_url'); ?>/css/error.css" />

    <title>Zenwork</title>
</head>

<body>
    <div id="outer">
        <div id="mainSection">
            <div class="MainSectionWrapper">
                <header>
                    <h1><a title="Nice day :)" href="<?php echo Configure::read('root_url'); ?>"><img src="<?php echo Configure::read('root_url'); ?>/images/logo-zenwork.png" alt="Zenwork" /></a></h1>
                </header>

                <div id="content">
                    <div class="FormContainer FormContainerAlt">
                        <div class="ProfileContainer">
                            <?php echo $content_for_layout ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>