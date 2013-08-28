<?php
    $this->Html->script('/plugins/js/jquery-capslock.js', false);
    $this->Css->add('/css/form.css', false);
?>

<div id="loginBox" class="FormContainer">
    <h2>Sign in to Zenwork</h2>
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
                </div>

                <div class="FormRow">
                    <label class="RememberLogin" for="remember_login">
                        <input type="checkbox" name="data[User][remember_login]" id="remember_login" tabindex="3" autocomplete="off" />
                        Remember me
                    </label>
                </div>

                <div class="FormRow ButtonRow">
                    <a href="<?php echo Configure::read('root_url').'/auth/forgotPwd'; ?>" title="Forgot password ?" class="ForgotPassLnk" tabindex="5">Forgot password ?</a>

                    <button class="CommonBtn" title="Sign in" tabindex="4"><span>Sign in</span></button>
                </div>
            </fieldset>
        </form>
    </div>
</div>