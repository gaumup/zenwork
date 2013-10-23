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
    <link type="text/css" rel="stylesheet" href="<?php echo Configure::read('root_url'); ?>/widgets/scrollup/css/scrollup.css" />

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
                <?php if ( strtolower($this->Session->read('Auth.User.username')) == 'khoant' ) : ?>
                <li <?php echo ($this->params['controller'] == 'monitor' ? 'class="Active"' : ''); ?>><a href="<?php echo Configure::read('root_url').'/monitor'; ?>" title="Go to Monitor page" class="QTip Monitor" data-qtip-my="center left" data-qtip-at="center right">Monitor</a></li>
                <?php endif; ?>
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

                    <!--<a href="#" title="Quick help ?" class="ZWQuickHelpBtn" id="zwQuickHelp">Quick help ?</a>-->
                    <input class="TextInput GlobalSearchBox" type="text" placeholder="You can search for Task and Plan" id="zwGlobalSearch" />
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
        //echo $this->element('feedback_dialog');
    ?>
    <?php if ( in_array('alphaVersionFirstLogin', $startUpTour) ) : ?>
    <div class="ZWHelpBoard" id="zwStartUpTour">
        <div class="FormRow ButtonRow">
            <h2>Zenwork start-up tour</h2>

            <button class="CommonBtn CommonDeleteBtn QTip ZWHelpTourControlDismiss" id="zwHelpTourControlDismiss" title="End tour" data-qtip-my="top center" data-qtip-at="bottom center"><span>End tour</span></button>
            <button class="CommonBtn QTip ZWHelpTourControl ZWHelpTourControlNext" title="Next slide: <strong>Dashboard</strong>" data-qtip-my="top center" data-qtip-at="bottom center"><span>&nbsp;&gt;&nbsp;</span></button>
            <button class="CommonBtn CommonBtnDisabled QTip ZWHelpTourControl ZWHelpTourControlPrev" title="No slide" data-qtip-my="top center" data-qtip-at="bottom center"><span>&nbsp;&lt;&nbsp;</span></button>
        </div>

        <div class="ZWHelpBoardContentWrapper">
            <ul class="ZWHelpTourContent" id="zwHelpTour">
                <li class="Active" data-slide="Overview">
                    <h3 class="ZWHelpTourTitle">Less administrative, more creative</h3>
                    <p class="ZWHelpTourDescription">Our product will help boost-up your team with more efficient daily task tracking<br />and centralizing communication workflow in a simple UI</p>

                    <div class="ZWHelpTourExtras">
                        <div class="ZWHelpProductBlockWrapper">
                            <span title="<strong>Dashboard</strong> is where you can manage your related task such as:<br />&ndash;&nbsp;Create task and assign to yourself or other people<br />&ndash;&nbsp;Update &amp; communicate on task which assigned to you<br />&ndash;&nbsp;Show a chart which show your workload to help you easily tracking your workload monthly" class="QTip QTipPermanent ZWHelpProductBlock ZWHelpProductBlockDashboard">Dashboard</span>

                            <span title="<strong>Task Planner</strong> is where you can manage all your plans such as:<br />&ndash;&nbsp;Create your own plan and invite people join and work together<br />&ndash;&nbsp;Create and manage all tasks in your own plan or other plan which you have been invited.<br /><br />**<strong>Plan</strong>(as known as 'List') in Zenwork is a document which contains many tasks, it support timeline schedule as same a gantt chart" class="QTip QTipPermanent ZWHelpProductBlock ZWHelpProductBlockPlanner">Task Planner</span>
                        </div>
                    </div>
                </li>

                <li data-slide="Dashboard">
                    <h3 class="ZWHelpTourTitle">Dashboard</h3>
                    <p class="ZWHelpTourDescription">Where you can manage your assigned task</p>

                    <div class="ZWHelpTourExtras">
                        <div class="ImageGuideBlock">
                            <img src="<?php echo Configure::read('root_url'); ?>/images/tour-dashboard.png" alt="Dashboard" />

                            <span id="imageGuideBlockSpotDashboardMenu" title="Dashboard menu: click to go to Dashboard" class="QTip QTipPermanent ImageGuideBlockSpot">Dashboard menu: click to go to Dashboard</span>

                            <span id="imageGuideBlockSpotTodayTaskList" title="Today task list: all your assigned task which started today or earlier(which is not completed)" class="QTip QTipPermanent ImageGuideBlockSpot">Today task list: all your assigned task which started today or earlier(which is not completed)</span>

                            <span id="imageGuideBlockSpotDashboardTask" title="Task: you can view and edit information, post a comment, attach a file or re-assign to other people. Click to view/update task details" class="QTip QTipPermanent ImageGuideBlockSpot">Task: you can view and edit information, post a comment, attach a file or re-assign to other people. Click to view/update task details</span>

                            <span id="imageGuideBlockSpotMonthlyWorkloadChart" title="Your monthly workload chart: showing your workload by each month in chart view. It contains 2 line for planning workload and completed(actual) task workload" class="QTip QTipPermanent ImageGuideBlockSpot">Your monthly workload chart: showing your workload by each month in chart view. It contains 2 line for planning workload and completed(actual) task workload</span>
                        </div>
                    </div>
                </li>

                <li data-slide="Task Planner">
                    <h3 class="ZWHelpTourTitle">Task Planner</h3>
                    <p class="ZWHelpTourDescription">Where you can manage all your plans and tasks</p>

                    <div class="ZWHelpTourExtras">
                        <div class="ImageGuideBlock">
                            <img src="<?php echo Configure::read('root_url'); ?>/images/tour-planner.png" alt="Dashboard" />

                            <span id="imageGuideBlockSpotPlannerMenu" title="Task Planner menu: click to go to Task Planner" class="QTip QTipPermanent ImageGuideBlockSpot">Task Planner menu: click to go to Task Planner</span>

                            <span id="imageGuideBlockSpotPlannerSelectPlan" title="Contains all your created plans and all plans that you joined. Click to search or select a plan.<br />Currently select plan &quot;VMAS Phase 2&quot;" class="QTip QTipPermanent ImageGuideBlockSpot">Contains all your created plans and all plans that you joined. Click to search or select a plan.<br />Currently select plan &quot;VMAS Phase 2&quot;</span>

                            <span id="imageGuideBlockSpotPlannerInvitePeople" title="Invite people join and start working together in this plan" class="QTip QTipPermanent ImageGuideBlockSpot">Invite people join and start working together in this plan</span>

                            <span id="imageGuideBlockSpotPlannerTask" title="Task: you can view and edit information, post a comment, attach a file or re-assign to other people. Click this icon to view task details" class="QTip QTipPermanent ImageGuideBlockSpot">Task: you can view and edit information, post a comment, attach a file or re-assign to other people. Click this icon to view task details</span>

                            <span id="imageGuideBlockSpotPlannerTimeline" title="This is a <strong>Timeline</strong>. Timeline present start/deadline and duration of a task. Each task can have many timelines, you can add more timeline by update in task details or drawing directly on this calendar(by checking 'Draw timeline' ar top-right corner)" class="QTip QTipPermanent ImageGuideBlockSpot">This is a <strong>Timeline</strong>. Timeline present start/deadline and duration of a task. Each task can have many timelines, you can add more timeline by update in task details or drawing directly on this calendar(by checking 'Draw timeline' ar top-right corner)</span>

                            <span id="imageGuideBlockSpotPlannerTimelineHover" title="Hover on a timeline give you more actions which you can perform on a timeline such as: assign to someone, update start/deadline, delete dependancies and delete a task" class="QTip QTipPermanent ImageGuideBlockSpot">Hover on a timeline give you more actions which you can perform on a timeline such as: assign to someone, update start/deadline, delete dependancies and delete a task</span>
                        </div>
                    </div>
                </li>

                <li data-slide="Feedback &amp; Support">
                    <h3 class="ZWHelpTourTitle">Feedback &amp; Support</h3>
                    <p class="ZWHelpTourDescription">You can <strong>send feedbacks</strong> or <strong>get support from us</strong> by clicking <strong>&quot;Feedbacks &amp; Support&quot;</strong> button at anytime.<br /><strong>&quot;Feedbacks &amp; Support&quot;</strong> always on the top-right corner of the screen whenever you are on Zenwork.<br /><br />There is also a button call <strong>&quot;Quick help ?&quot;</strong> which will show you all actions you can do on your viewing page when you click on it</p>

                    <div class="ZWHelpTourExtras">
                        <button class="CommonBtn CommonBtnCentered ZWHelpTourGetStartedBtn ZWHelpTourControlDismiss QTip" title="Close this tour and let me exploring Zenwork" data-qtip-my="left center" data-qtip-at="right center"><span>Get started</span></button>
                    </div>
                </li>
            </ul>
        </div>
    </div>
    <?php endif; ?>

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
    <script type="text/javascript" src="<?php echo Configure::read('root_url'); ?>/plugins/js/jquery-bg-position.js"></script>
    
    <script type="text/javascript" src="<?php echo Configure::read('root_url'); ?>/widgets/scrollup/js/scrollup.js"></script>
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
</body>
</html>