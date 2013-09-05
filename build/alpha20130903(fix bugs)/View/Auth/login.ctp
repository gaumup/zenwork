<?php
    $this->Html->script('/plugins/js/jquery-capslock.js', false);

    $this->Css->add('/widgets/countdown/fonts/stylesheet.css', false);
    $this->Css->add('/widgets/countdown/css/style.css', false);

    $this->Html->script('/widgets/countdown/js/modernizr.custom.js', false);
    $this->Html->script('/widgets/countdown/js/jquery.countdown.js', false);
    $this->Html->script('/widgets/countdown/js/script.js', false);
?>
<?php if ( time() >= mktime(9, 0, 0, 8, 12, 2013) ) : ?>
<ul class="AuthTab" id="authTab">
    <li class="Active"><a href="#signin" title="Sign in to Zenwork with your registered account" class="QTip" data-qtip-my="right center" data-qtip-at="left center" data-qtip-ajust="4px 0">Sign in to Zenwork</a></li>
    <li><a href="#signup" class="AuthTabDisabled QTip" title="Currently not available on 'alpha' version" data-qtip-at="right center" data-qtip-my="left center">Create a free account</a></li>
</ul>
<div id="loginBox" class="FormContainer">
    <div id="signin" class="AuthTabContent">
        <div class="LoginForm">
            <form id="loginForm" action="<?php echo Configure::read('root_url').'/auth/login'; ?>" method="post">
                <fieldset>
                    <legend>Sign in to Zenwork</legend>
                    <?php
                        echo $this->Session->flash('auth', array(
                            'params' => array('extra_classes' => 'ErrorBox'),
                            'element' => 'message_box'
                        ));
                    ?>
                    <div class="MsgBoxWrapper WarningBox Hidden" id="capslock_warning">
                        <div class="MsgBox">
                            <p>Capslock is on !</p>
                        </div>
                    </div>

                    <div class="FormRow">
                        <input class="TextInput" value="<?php echo (!empty($this->data['User']) ? $this->data['User']['username'] : ""); ?>" type="text" name="data[User][username]" id="username" tabindex="1" placeholder="Username" autocomplete="off" />
                    </div>

                    <div class="FormRow">
                        <input class="TextInput" type="password" name="data[User][password]" id="password" tabindex="2" placeholder="Password" autocomplete="off" />
                        <a href="<?php echo Configure::read('root_url').'/auth/forgotPwd'; ?>" title="Click to recover your password" class="ForgotPassLnk QTip" tabindex="5" data-qtip-at="right center" data-qtip-my="left center">Forgot password ?</a>
                    </div>

                    <div class="FormRow">
                        <label class="RememberLogin QTip" for="remember_login" title="Check to log me in automatically on next time visit" data-qtip-my="right center" data-qtip-at="left center" data-qtip-ajust="0 -3px">
                            <input type="checkbox" name="data[User][remember_login]" id="remember_login" tabindex="3" autocomplete="off" />
                            Remember me
                        </label>

                        <div class="FormRow ButtonRow">
                            <button class="CommonBtn" title="Sign in" tabindex="4"><span>Sign in</span></button>
                        </div>
                    </div>
                </fieldset>
            </form>
        </div>
    </div>

    <div id="signup" class="AuthTabContent Hidden">
        <div class="LoginForm">
            <form id="signupForm" action="<?php echo Configure::read('root_url').'/auth/signup'; ?>" method="post">
                <fieldset>
                    <legend>Create a free account on Zenwork</legend>
                    <?php
                        echo $this->Session->flash('auth', array(
                            'params' => array('extra_classes' => 'ErrorBox'),
                            'element' => 'message_box'
                        ));
                    ?>
                    <div class="MsgBoxWrapper WarningBox Hidden" id="capslock_warning">
                        <div class="MsgBox">
                            <p>Capslock is on !</p>
                        </div>
                    </div>

                    <div class="FormRow">
                        <input class="TextInput" value="<?php echo (!empty($this->data['User']) ? $this->data['User']['username'] : ""); ?>" type="text" name="data[User][username]" id="signupUsername" tabindex="6" placeholder="Username" autocomplete="off" />
                        <?php
                            echo $this->element('message_box', array(
                                'extra_classes' => 'ErrorBox Hidden',
                                'message' => 'Username contains letter or number(6-20 characters)'
                            ));
                        ?>
                    </div>

                    <div class="FormRow">
                        <input class="TextInput" value="<?php echo (!empty($this->data['User']) ? $this->data['User']['email'] : ""); ?>" type="email" name="data[User][email]" id="signupEmail" tabindex="6" placeholder="Email" autocomplete="off" />
                        <?php
                            echo $this->element('message_box', array(
                                'extra_classes' => 'ErrorBox Hidden',
                                'message' => 'Email can not be blank'
                            ));
                        ?>
                    </div>

                    <div class="FormRow">
                        <input class="TextInput" type="password" name="data[User][password]" id="signupPassword" tabindex="7" placeholder="Password" autocomplete="off" />
                        <?php
                            echo $this->element('message_box', array(
                                'extra_classes' => 'ErrorBox Hidden',
                                'message' => 'Password can not be blank'
                            ));
                        ?>
                    </div>
                    <div class="FormRow">
                        <input class="TextInput" type="password" name="data[User][password]" id="signupPasswordAgain" tabindex="8" placeholder="Confirm password" autocomplete="off" />
                        <?php
                            echo $this->element('message_box', array(
                                'extra_classes' => 'ErrorBox Hidden',
                                'message' => 'Confirm password do not match'
                            ));
                        ?>
                    </div>

                    <div class="FormRow">
                        <div class="FormRow ButtonRow">
                            <button class="CommonBtn" title="Create account" tabindex="9"><span>Create account</span></button>
                        </div>
                    </div>
                </fieldset>
            </form>
        </div>
    </div>
</div>
<?php else : ?>
<div class="CountdownBlock">
    <h2>We are working really hard to deliver the best value for you :)</h2>
    <p>Our developer is doing his best to finish this website before the counter.<br /><span>Please join us after</span></p>

    <div id="counter"></div>
</div>
<?php endif; ?>