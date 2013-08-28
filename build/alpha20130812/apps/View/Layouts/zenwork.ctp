<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

    <link rel="shortcut icon" href="<?php echo Configure::read('root_url'); ?>/favicon.ico" />

    <link type="text/css" rel="stylesheet" href="<?php echo Configure::read('root_url'); ?>/css/global.css" />
    <link type="text/css" rel="stylesheet" href="<?php echo Configure::read('root_url'); ?>/css/form.css" />
    <link type="text/css" rel="stylesheet" href="<?php echo Configure::read('root_url'); ?>/css/zenwork.css" />
    <link type="text/css" rel="stylesheet" href="<?php echo Configure::read('root_url'); ?>/plugins/css/zenwork/jquery-ui.css" />
    <link type="text/css" rel="stylesheet" href="<?php echo Configure::read('root_url'); ?>/widgets/jscrollpane/css/jscrollpane.css" />
    <link type="text/css" rel="stylesheet" href="<?php echo Configure::read('root_url'); ?>/widgets/autocomplete/css/autocomplete.css" />
    <link type="text/css" rel="stylesheet" href="<?php echo Configure::read('root_url'); ?>/widgets/menu/css/menu.css" />
    <link type="text/css" rel="stylesheet" href="<?php echo Configure::read('root_url'); ?>/widgets/qtip/css/qtip2.css" />
    <link type="text/css" rel="stylesheet" href="<?php echo Configure::read('root_url'); ?>/widgets/preview/css/preview.css" />
    <link type="text/css" rel="stylesheet" href="<?php echo Configure::read('root_url'); ?>/widgets/social/css/social.css" />
    <link type="text/css" rel="stylesheet" href="<?php echo Configure::read('root_url'); ?>/widgets/tour/css/tour.css" />

    <?php echo isset($styles_for_layout) ? $styles_for_layout : ''; ?>

    <title>Zenwork</title>
</head>

<body>
    <div id="outer">
        <div id="sideBar">
            <?php
                if ( $this->Session->check('Auth.User') ) {
                    $loggedInUser = $this->Session->read('Auth.User');
                    echo '<div id="userAccountBox">';
                    echo '    <a target="_blank" href="'.(Configure::read('root_url').'/auth/profile/'.$loggedInUser['id']).'" title="'.$loggedInUser['username'].'" id="accountSettingLnk">';
                    echo $this->element('avatar', array(
                        'user' => $loggedInUser,
                        'class' => 'Avatar',
                        'id' => 'profileAvatar',
                        'width' => 36,
                        'height' => 36
                    ));
                    echo '    </a>';
                    echo '</div>';
                    echo '<div id="accountSettingBoxContainer" class="Hidden">';
                    echo '    <ul id="accountSettingBox">';
                    echo '        <li><a target="_blank" href="'.(Configure::read('root_url').'/auth/profile/'.$loggedInUser['id']).'" title="Edit profile"><strong>'.$loggedInUser['fullname'].'</strong><br />Edit profile</a></li>';
                    echo '        <li><a target="_blank" href="'.(Configure::read('root_url').'/auth/changePwd/'.$loggedInUser['id']).'" title="Change password">Change password</a></li>';
                    echo '        <li class="LastItem"><a id="logoutLnk" href="'.(Configure::read('root_url').'/auth/logout').'" title="Logout">Logout</a></li>';
                    echo '    </ul>';
                    echo '</div>';
                }
            ?>

            <?php if ( $this->Session->check('Auth.User') ) : ?>
            <ul id="sideBarNav">
                <li <?php echo ($this->params['controller'] == 'dashboard' ? 'class="Active"' : ''); ?>><a href="<?php echo Configure::read('root_url').'/dashboard'; ?>" title="Dashboard" class="QTip Dashboard" data-qtip-my="center left" data-qtip-at="center right">Dashboard</a></li>
                <li <?php echo ($this->params['controller'] == 'planner' ? 'class="Active"' : ''); ?>><a href="<?php echo Configure::read('root_url').'/planner'; ?>" title="Task Planner" class="QTip Planner" data-qtip-my="center left" data-qtip-at="center right">Task Planner</a></li>
                <!--
                <li <?php echo ($this->params['controller'] == 'delivery' ? 'class="Active"' : ''); ?>><a href="<?php echo Configure::read('root_url').'/delivery'; ?>" title="Go to Delivery page" class="QTip Delivery" data-qtip-my="center left" data-qtip-at="center right">Delivery</a></li>
                <li <?php echo ($this->params['controller'] == 'report' ? 'class="Active"' : ''); ?>><a href="#" title="Go to Report &amp; Statistic page" class="QTip Report" data-qtip-my="center left" data-qtip-at="center right">Report &amp; Statistic</a></li>
                <li><a href="#" title="Add more page" class="QTip AddMore" data-qtip-my="center left" data-qtip-at="center right">Add more +</a></li>
                -->
            </ul>
            <?php endif; ?>

            <p class="Copyright QTip" title="&copy; copyright by Zenwork 2013." data-qtip-my="left center" data-qtip-at="center right">&copy; copyright by Zenwork 2013.</p>
        </div>

        <div id="mainSection">
            <div class="MainSectionWrapper">
                <header>
                    <h1><a title="Nice day :)" href="<?php echo Configure::read('root_url'); ?>"><img src="<?php echo Configure::read('root_url'); ?>/images/logo-zenwork.png" alt="Zenwork(alpha version)" /></a></h1>

                    <?php
                        if ( $this->Session->check('Auth.User') ) {
                            //echo $this->element('notification_center');
                        } 
                    ?>
                </header>

                <div id="content">
                    <?php echo $content_for_layout ?>
                </div>
            </div>
        </div>
    </div>
    
    <?php
        echo $this->element('zw_dialog');
        echo $this->element('overlays');
        echo $this->element('notifier');
        echo $this->element('alert_dialog');
        echo $this->element('confirm_dialog');
        echo $this->element('info_dialog');
        echo $this->element('timeline_dialog');
        echo $this->element('assignee_dialog');
        echo $this->element('tag_dialog');
    ?>

    <input type="hidden" value="<?php echo $this->Session->read('Auth.User.id'); ?>" id="loggedInUserID" />
    <input type="hidden" value="<?php echo Configure::read('root_url')?>" id='rootUrl' />
    <input type="hidden" value="<?php echo $serverTime*1000; ?>" id="serverTime" />

    <script type="text/javascript" src="<?php echo Configure::read('root_url'); ?>/lib/js/jquery-core.js"></script>
    <script type="text/javascript" src="<?php echo Configure::read('root_url'); ?>/lib/js/jquery-ui-core.js"></script>

    <script type="text/javascript" src="<?php echo Configure::read('root_url'); ?>/plugins/js/jquery-ui-effects.js"></script>

    <script type="text/javascript" src="<?php echo Configure::read('root_url'); ?>/plugins/js/jquery-ui-widget.js"></script>

    <!-- Zenwork core -->
    <script type="text/javascript" src="<?php echo Configure::read('root_url'); ?>/js/zenwork.js"></script>
    <script type="text/javascript" src="<?php echo Configure::read('root_url'); ?>/js/core.js"></script>
    <!-- End. Zenwork core -->

    <script type="text/javascript" src="<?php echo Configure::read('root_url'); ?>/plugins/js/jquery-ui-button.js"></script>
    <script type="text/javascript" src="<?php echo Configure::read('root_url'); ?>/plugins/js/jquery-ui-mouse.js"></script>
    <!-- 'jquery-ui-touchpunch' MUST go after 'jquery-ui-mouse' -->
    <script type="text/javascript" src="<?php echo Configure::read('root_url'); ?>/plugins/js/jquery-ui-touchpunch.js"></script>
    <script type="text/javascript" src="<?php echo Configure::read('root_url'); ?>/plugins/js/jquery-ui-position.js"></script>
    <script type="text/javascript" src="<?php echo Configure::read('root_url'); ?>/plugins/js/jquery-autoresize.js"></script>
    <script type="text/javascript" src="<?php echo Configure::read('root_url'); ?>/plugins/js/resize.js"></script>
    <script type="text/javascript" src="<?php echo Configure::read('root_url'); ?>/plugins/js/jquery-cookie.js"></script>

    <script type="text/javascript" src="<?php echo Configure::read('root_url'); ?>/widgets/jscrollpane/js/jscrollpane.js"></script>
    <script type="text/javascript" src="<?php echo Configure::read('root_url'); ?>/widgets/autocomplete/js/autocomplete.js"></script>
    <script type="text/javascript" src="<?php echo Configure::read('root_url'); ?>/widgets/menu/js/menu.js"></script>
    <script type="text/javascript" src="<?php echo Configure::read('root_url'); ?>/widgets/zeroclipboard/js/zeroclipboard.js"></script>
    <script type="text/javascript" src="<?php echo Configure::read('root_url'); ?>/widgets/qtip/js/qtip.js"></script>
    <script type="text/javascript" src="<?php echo Configure::read('root_url'); ?>/widgets/preview/js/preview.js"></script>
    <script type="text/javascript" src="<?php echo Configure::read('root_url'); ?>/widgets/social/js/social.js"></script>
    <script type="text/javascript" src="<?php echo Configure::read('root_url'); ?>/widgets/tour/js/tour.js"></script>

    <script type="text/javascript" src="<?php echo Configure::read('root_url'); ?>/plugins/js/date.js"></script>
    <script type="text/javascript" src="<?php echo Configure::read('root_url'); ?>/plugins/js/time.js"></script>

    <?php echo $scripts_for_layout ?>

    <script type="text/javascript" src="<?php echo Configure::read('root_url'); ?>/js/override.js"></script>

    <!-- UserVoice JavaScript SDK (only needed once on a page) -->
    <script>(function(){var uv=document.createElement('script');uv.type='text/javascript';uv.async=true;uv.src='//widget.uservoice.com/REK0Yjf5zUmFkzhBlzufA.js';var s=document.getElementsByTagName('script')[0];s.parentNode.insertBefore(uv,s)})()</script>

    <!-- A tab to launch the Classic Widget -->
    <script type="text/javascript">
        UserVoice = window.UserVoice || [];
        UserVoice.push(['showTab', 'classic_widget', {
          mode: 'full',
          primary_color: '#cdb968',
          link_color: '#007dbf',
          default_mode: 'feedback',
          forum_id: 215243,
          tab_label: 'Feedback & Support',
          tab_color: '#cdb968',
          tab_position: 'top-right',
          tab_inverted: false
        }]);
    </script>
</body>
</html>