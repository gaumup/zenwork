<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link rel="shortcut icon" href="<?php echo Configure::read("root_url"); ?>/favicon.ico" />
    <link type="text/css" rel="stylesheet" href="<?php echo Configure::read("root_url"); ?>/css/global.css" />
    <link type="text/css" rel="stylesheet" href="<?php echo Configure::read("root_url"); ?>/css/app.css" />
    <link type="text/css" rel="stylesheet" href="<?php echo Configure::read("root_url"); ?>/plugins/css/ui-lightness/jquery-ui.css" />
    <link type="text/css" rel="stylesheet" href="<?php echo Configure::read("root_url"); ?>/plugins/css/ui-lightness/jquery-ui-theme.css" />
    <link type="text/css" rel="stylesheet" href="<?php echo Configure::read("root_url"); ?>/widgets/autocomplete/css/autocomplete.css" />
    <link type="text/css" rel="stylesheet" href="<?php echo Configure::read("root_url"); ?>/widgets/menu/css/menu.css" />

    <?php echo isset($styles_for_layout) ? $styles_for_layout : ''; ?>

    <title>IMS&nbsp;&ndash;&nbsp;<?php echo $title_for_layout; ?></title>
</head>

<body>
    <div id="outer">
        <div id="app_top_bar">
            <h1><a href="/" title=""><img src="<?php echo Configure::read("root_url"); ?>/images/logo-ims.png" title="Information Management System" alt="Information Management System" /></a></h1>

            <!-- Root menu -->
            <ul id="app_mainnav">
                <li <?php echo ($this->params['controller'] == 'projects' ? 'class="Active"' : ''); ?>><a href="<?php echo Configure::read("root_url").'/projects'; ?>" title="Projects" class="HomeLnk">Projects</a></li>
                <li <?php echo ($this->params['controller'] == 'resources' ? 'class="Active"' : ''); ?>><a href="<?php echo Configure::read("root_url").'/resources'; ?>" title="Resources">Resources</a></li>
                <li <?php echo ($this->params['controller'] == 'reports' ? 'class="Active"' : ''); ?>><a href="<?php echo Configure::read("root_url").'/reports' ?>" title="Reports">Reports</a></li>
                <li <?php echo ($this->params['controller'] == 'delivery' ? 'class="Active"' : ''); ?>><a href="<?php echo Configure::read("root_url").'/delivery' ?>" title="Delivery">Delivery</a></li>
                <li><a target="_blank" href="http://<?php echo $_SERVER['SERVER_NAME']; ?>/wiki" title="Wiki">Wiki</a></li>
            </ul>
            <!-- end. -->

            <div id="user_profile">
                <?php
                    echo $this->element('avatar', array(
                        'user'=>$this->Session->read('Auth.User'),
                        'width' => 36,
                        'height' => 36
                    ));
                ?>
                <p class="WelcomeText">Hi<strong id="username"> <?php echo $this->Session->read('Auth.User.username'); ?></strong></p>
                <p class="UserSupportLink">
                    <a href="<?php echo Configure::read("root_url")."/auth/profile/".$this->Session->read('Auth.User.id'); ?>" title="My Profile">My Profile</a> |
                    <a href="<?php echo Configure::read("root_url")."/auth/logout"; ?>" title="Logout">Logout</a>
                </p>
                <?php
                    if ( isset($all_project) && count($all_project) > 0 ) {
                        $base_lnk = '';
                        if ( $this->params['controller'] == 'projects' ) {
                            $base_lnk = Configure::read("root_url").'/projects/home';
                        }
                        else if ( $this->params['controller'] == 'issues' ) {
                            $base_lnk = Configure::read("root_url").'/issues/list_issue';
                        }
                        else if ( $this->params['controller'] == 'project_evaluations' ) {
                            $base_lnk = Configure::read("root_url").'/projectevaluations/evaluation_info';
                        }
                        echo '<select id="all_project" class="Hidden">';
                        echo '    <option value=""></option>';
                            foreach ($all_project as $project) {
                                echo '<option value="'.$base_lnk.'/'.$project['Project']['id'].'">'.$project['Project']['name'].'</option>';
                            }
                        echo '</select>';
                        echo '<input type="text" class="InputText01" id="project_select" value="Go to project..." />';
                    }
                ?>
            </div>
        </div>

        <div class="MainNavContainer">
            <!-- Sub menu level 1 -->
            <?php
                if ( !empty($Nav_Active) ) {
                    echo '<ul id="main_nav">';
                    if ( $this->params['controller'] == 'projects' ) {
                        echo '<li  class="'.($Nav_Active == 'Home' ? 'Active' : '').'>"><a href="'.Configure::read("root_url").'/projects" title="Projects list">Projects list</a></li>';
                        echo '<li  class="'.($Nav_Active == 'MasterPlan' ? 'Active' : '').'"><a href="'.Configure::read("root_url").'/projects/master_plan" title="Project timeline">Project timeline</a></li>';
                        echo '<li  class="'.($Nav_Active == 'CreateProject' ? 'Active' : '').'"><a href="'.Configure::read("root_url").'/projects/create_project" title="Create new project">Create new Project</a></li>';
                    }
                    else if ( $this->params['controller'] == 'resources' ) {
                        echo '<li class="'.($Nav_Active == 'Home' ? 'Active' : '').'"><a href="'.Configure::read("root_url").'/resources" title="Resources Home">Resources Home</a></li>';
                        if ( $team_id != 0 ) {
                            echo '<li  class="'.($Nav_Active == "ResourcesMan" ? "Active" : "").'"><a href="'.Configure::read("root_url").'/resources/edit_resources_plan/'.$team_id.'" title="Resources Manager">Resources Manager</a></li>';
                            if ( $is_authorized_setting_own ) {
                                echo '<li  class="'.($Nav_Active == "TeamSettings" ? "Active" : "").'"><a href="'.Configure::read("root_url").'/resources/appraiser_settings/'.$team_id.'" title="Team Settings">Team Settings</a></li>';
                            }
                            if ( $is_authorized_edit_own_plan ) {
                                echo '<li  class="'.($Nav_Active == "MonthlyReport" ? "Active" : "").'"><a href="'.Configure::read("root_url").'/resources/monthly_report/'.$team_id.'" title="Monthly Report">Monthly Report</a></li>';
                            }
                        }
                        echo '<li  class="'.($Nav_Active == "resource_planning" ? "Active" : "").'"><a href="'.Configure::read("root_url").'/resources/resource_planning" title="Resource Planning">Resource Planning</a><span class="NewRelease">New</span></li>';
                    }
                    else if ( $this->params['controller'] == 'reports' ) {
                        echo '<li class="'.($Nav_Active == 'AllTeamReport' ? 'Active' : '').'"><a href="'.Configure::read("root_url").'/reports/all_team_report" title="Department Report">Department Report</a></li>';
                        echo '<li class="'.($Nav_Active == 'TeamReport' ? 'Active' : '').'"><a href="'.Configure::read("root_url").'/reports/team_report" title="View Team Report">Team Report</a></li>';
                        echo '<li class="'.($Nav_Active == 'ProjectReport' ? 'Active' : '').'"><a href="'.Configure::read("root_url").'/reports/project_report" title="View Project Report">Project Report</a></li>';
                    }
                    else if ( $this->params['controller'] == 'issues' ) {
                        echo '<li class="'.($Nav_Active == 'Home' ? 'Active' : '').'"><a href="'.Configure::read("root_url").'/issues" title="Issue Homepage" class="HomeLnk">Issue Homepage</a></li>';
                        if ( isset($Pid) ) {
                            echo '<li class="'.($Nav_Active == 'addIssue' ? 'Active' : '').'">';
                            echo '    <a href="'.Configure::read("root_url").'/issues/add/'.$Pid.'" title="Create New Issues">Create New Issues</a>';
                            echo '</li>';
                            echo '<li class="'.($Nav_Active == 'ListIssue' ? 'Active' : '').'">';
                            echo '    <a href="'.Configure::read("root_url").'/issues/list_issue/'.$Pid.'" title="Issues List">Issues List</a>';
                            echo '</li>';
                            echo '<li class="'.($Nav_Active == 'report' ? 'Active' : '').'">';
                            echo '    <a href="'.Configure::read("root_url").'/issues/report/'.$Pid.'" title="Report">Report</a>';
                            echo '</li>';
                        }
                    }
                    else if ( $this->params['controller'] == 'project_evaluations' ) {
                        echo '<li class="'.($Nav_Active == 'Home' ? 'Active' : '').'"><a href="'.Configure::read("root_url").'/project_evaluations" title="Performances Home">Performances Home</a></li>';
                        echo '<li class="'.($Nav_Active == 'Report' ? 'Active' : '').'">';
                        echo '    <a title="Report" href="'.Configure::read("root_url") .'/project_evaluations/report">Report</a>';
                        echo '</li>';
                    }
                    echo '</ul>';
                }
            ?>
            <!-- end. -->

            <!-- Sub menu level 2 -->
            <?php
                if ( $this->params['controller'] == 'resources' ) {
                    if ( $Nav_Active == "TeamSettings" ) {
                        echo '<ul class="SubNav">';
                        echo '    <li class="'.($Sub_Nav_Active == "AppraiserSettings" ? "Active" : "").'"><a href="'.Configure::read('root_url').'/resources/appraiser_settings/'.$team_id.'" title="Appraiser Settings">Appraiser Settings</a></li>';
                        echo '    <li class="'.($Sub_Nav_Active == "QuantityRankSettings" ? "Active" : "").'"><a href="'.Configure::read('root_url').'/resources/quantity_rank_settings/'.$team_id.'" title="Quantiy Ranking Settings">Quantity Ranking Settings</a></li>';
                        echo '    <li class="'.($Sub_Nav_Active == "FinalRankingSettings" ? "Active" : "").'"><a href="'.Configure::read('root_url').'/resources/final_ranking_settings/'.$team_id.'" title="Final Ranking Settings">Final Ranking Settings</a></li>';
                        echo '</ul>';
                    }
                }
                else if ( $this->params['controller'] == 'reports' ) {
                    echo '<ul class="SubNav">';
                    if ( $Nav_Active == "TeamReport" && isset($team_id) ) {
                        echo '    <li class="'.($Sub_Nav_Active == "MonthlyReport" ? "Active" : "").'"><a href="'.Configure::read('root_url').'/reports/view_team_report/'.$team_id.'" title="Monthly Report">Monthly Report</a></li>';
                        echo '    <li class="'.($Sub_Nav_Active == "ReportComparison" ? "Active" : "").'"><a href="'.Configure::read('root_url').'/reports/report_comparison/'.$team_id.'" title="Multi-months Report">Multi-months Report</a></li>';
                    }
                    else if ( $Nav_Active == "ProjectReport" ) {
                        echo '    <li class="'.($Sub_Nav_Active == "AllProjectsReport" ? "Active" : "").'"><a href="'.Configure::read('root_url').'/reports/view_all_projects_report'.(isset($team_id) ? '/'.$team_id : '').'" title="All Projects Report">All Projects Report</a></li>';
                        if ( isset($team_id) ) {
                            echo '    <li class="'.($Sub_Nav_Active == "TeamProjectReport" ? "Active" : "").'"><a href="'.Configure::read('root_url').'/reports/view_team_project_report/'.$team_id.'" title="Team Project Report">Team Project Report</a></li>';
                            echo '    <li class="'.($Sub_Nav_Active == "MemProjectReport" ? "Active" : "").'"><a href="'.Configure::read('root_url').'/reports/view_mem_project_report/'.$team_id.'" title="Member Project Report">Member Project Report</a></li>';
                        }
                    }
                }
            ?>
            <!-- end. -->
        </div>

        <div id="content">
            <div class="SpacingContainer">
                <?php
                    if (isset($breadcrumb)) {
                        echo '<div id="breadcrumb">';
                        foreach($breadcrumb as $key => $val){
                            if($val['href'] != ''){
                                echo '<a href="'.Configure::read("root_url").$val['href'].'">'.$val['title'].'</a> &gt; ';
                            } else {
                                echo '<strong>'.$val['title'].'</strong>';
                            }
                        }
                        echo '</div>';
                    }
                ?>

                <?php echo $content_for_layout ?>
            </div>
        </div>

        <div class="SpacingContainer">
            <div id="footer">
                <p class="Copyright">&copy; Copyright by DnD</p>
            </div>
        </div>
    </div>

    <div id="notifier" data-content-id="notificationContent" class="Hidden">
        <div class="MsgBoxWrapper MsgBoxNoIcon NotifierBox">
            <div class="MsgBox">
                <p id="notificationContent"></p>
            </div>
        </div>
    </div>

    <div id="overlays" class="Hidden"></div>

    <input type="hidden" value="<?php echo Configure::read("root_url")?>" id="root_url" />

    <script type="text/javascript" src="<?php echo Configure::read("root_url"); ?>/lib/js/jquery-core.js"></script>
    <script type="text/javascript" src="<?php echo Configure::read("root_url"); ?>/lib/js/jquery-ui-core.js"></script>

    <script type="text/javascript" src="<?php echo Configure::read("root_url"); ?>/plugins/js/jquery-ui-effects.js"></script>

    <script type="text/javascript" src="<?php echo Configure::read("root_url"); ?>/plugins/js/jquery-ui-widget.js"></script>

    <script type="text/javascript" src="<?php echo Configure::read("root_url"); ?>/plugins/js/jquery-ui-button.js"></script>
    <script type="text/javascript" src="<?php echo Configure::read("root_url"); ?>/plugins/js/jquery-ui-mouse.js"></script>
    <!-- 'jquery-ui-touchpunch' MUST go after 'jquery-ui-mouse' -->
    <script type="text/javascript" src="<?php echo Configure::read("root_url"); ?>/plugins/js/jquery-ui-touchpunch.js"></script>
    <script type="text/javascript" src="<?php echo Configure::read("root_url"); ?>/plugins/js/jquery-ui-position.js"></script>
    <script type="text/javascript" src="<?php echo Configure::read("root_url"); ?>/plugins/js/jquery-autoresize.js"></script>

    <script type="text/javascript" src="<?php echo Configure::read("root_url"); ?>/widgets/autocomplete/js/autocomplete.js"></script>
    <script type="text/javascript" src="<?php echo Configure::read("root_url"); ?>/widgets/menu/js/menu.js"></script>
    <script type="text/javascript" src="<?php echo Configure::read("root_url"); ?>/widgets/zeroclipboard/js/zeroclipboard.js"></script>

    <script type="text/javascript" src="<?php echo Configure::read("root_url"); ?>/js/zenwork.js"></script>
    <script type="text/javascript" src="<?php echo Configure::read("root_url"); ?>/js/app.js"></script>

    <?php echo $scripts_for_layout ?>
</body>
</html>