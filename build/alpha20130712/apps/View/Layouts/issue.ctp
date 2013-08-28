<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link rel="shortcut icon" href="<?php echo Configure::read("root_url"); ?>/favicon.ico" />
    <link rel="stylesheet" type="text/css" href="<?php echo Configure::read("root_url"); ?>/css/global.css"/>
    <link rel="stylesheet" type="text/css" href="<?php echo Configure::read("root_url"); ?>/css/master.css"/>
    <link rel="stylesheet" type="text/css" href="<?php echo Configure::read("root_url"); ?>/css/theme.css"/>
    <link rel="stylesheet" type="text/css" href="<?php echo Configure::read("root_url"); ?>/plugins/autocomplete/css/autocomplete.css"/>
    <link rel="stylesheet" type="text/css" href="<?php echo Configure::read("root_url"); ?>/css/home.css"/>
    <title>IMS [Issue Tracking System]</title>
</head>

<body>
    <div id="outer">
        <div id="app_top_bar">
            <h1><a href="/" title=""><img src="<?php echo Configure::read("root_url"); ?>/images/logo-ims.png" title="Information Management System" alt="Information Management System" /></a></h1>

            <ul id="app_mainnav">
                <li class="Active"><a href="<?php echo Configure::read("project_system_url"); ?>" title="Projects" class="HomeLnk">Projects</a></li>
                <li><a href="<?php echo Configure::read("resource_system_url"); ?>" title="Resources">Resources</a></li>
                <li><a href="<?php echo Configure::read("report_system_url"); ?>" title="Reports">Reports</a></li>
                <li><a target="_blank" href="<?php echo 'http://'.$_SERVER['SERVER_NAME'].'/wiki'; ?>" title="Wiki">Wiki</a></li>
            </ul>

            <div id="user_profile">
                <img src="<?php if($_SESSION['Auth']['User']['avatar'] == ""){echo Configure::read("account_system_url")."/images/noimage.gif";}else{echo Configure::read("account_system_url")."/".Configure::read("upload_path").'/'.$_SESSION['Auth']['User']['avatar'];}?>" width="36" height="36" align="absbottom" />
                <p class="WelcomeText">Hi<strong id="username"> <?php echo $_SESSION['Auth']['User']['username']; ?></strong></p>
                <p class="UserSupportLink">
                    <a href="<?php echo Configure::read("account_system_url")."/auth/profile/".$_SESSION['Auth']['User']['id']; ?>" title="My Profile">My Profile</a> |
                    <a href="<?php echo Configure::read("account_system_url")."/auth/logout"; ?>" title="Logout">Logout</a>
                </p>
                <select id="all_project" class="Hidden">
                    <option value=""></option>
                    <?php
                        foreach($all_projects as $val){
                            echo '<option value="'.Configure::read("root_url").'/issues/list_issue/'.$val['Project']['id'].'">'.$val['Project']['name'].'</option>';
                        }
                    ?>
                </select>
                <input type="text" class="InputText01" id="project_select" value="Go to project..." />
            </div>
        </div>

        <div class="MainNavContainer">
            <ul id="main_nav">
                <li  class="<?php if($Nav_Active == "Home"){ echo "Active";}?>"><a href="<?php echo Configure::read("root_url"); ?>" title="Issues Home">Issues Home</a></li>
            </ul>
        </div>

        <div id="content">
            <div class="SpacingContainer">
                <div id="breadcrumb">
                    <?php
                        if (isset($breadcrumb)) {
                            foreach ($breadcrumb as $key => $val) {
                                if ($val['href'] != '') {
                                    echo '<a href="'.Configure::read("root_url").$val['href'].'">'.$val['title'].'</a> &gt; ';
                                }
                                else {
                                    echo '<strong>'.$val['title'].'</strong>';
                                }
                            }
                        }
                    ?>
                </div>
                <?php echo $content_for_layout ?>
            </div>
        </div>

        <div class="SpacingContainer">
            <div id="footer">
                <p class="Copyright">&copy; Copyright by Web Operation 2011</p>
            </div>
        </div>
    </div>

    <input type="hidden" value="<?php echo Configure::read("root_url")?>" id="root_url" />

    <script type="text/javascript" src="<?php echo Configure::read("root_url"); ?>/js/jquery.js"></script>
    <script type="text/javascript" src="<?php echo Configure::read("root_url"); ?>/js/lib/jquery.ui.core.js"></script>
    <script type="text/javascript" src="<?php echo Configure::read("root_url"); ?>/js/lib/jquery.ui.widget.js"></script>
    <script type="text/javascript" src="<?php echo Configure::read("root_url"); ?>/js/lib/jquery.ui.position.js"></script>
    <script type="text/javascript" src="<?php echo Configure::read("root_url"); ?>/plugins/autocomplete/js/autocomplete.js"></script>
    <script type="text/javascript" src="<?php echo Configure::read("root_url"); ?>/js/master.js"></script>
    <script type="text/javascript" src="<?php echo Configure::read("root_url"); ?>/js/common.js"></script>

    <?php echo $scripts_for_layout ?>
</body>
</html>