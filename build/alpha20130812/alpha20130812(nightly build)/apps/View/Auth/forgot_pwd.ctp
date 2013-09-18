<div class="FormContainer FormContainerAlt FormContainerAlt01">
    <h2>Recover your password</h2>
    <div class="ProfileContainer">
        <form name="forgot" id="forgot" action="<?php echo Configure::read("root_url")?>/auth/forgotPwd" method="post">
            <fieldset>
                <legend>Reset password</legend>

                <div class="MsgBoxWrapper WarningBox">
                    <div class="MsgBox">
                        <p class="FormHelpText">An instruction on how to reset password will be sent to your email account below.<br />
                        <strong>Please provide the email you have registered for your account before</strong></p>
                    </div>
                </div>

                <?php
                    echo $this->Session->flash('email');
                ?>

                <div class="FormRow">
                    <input type="text" class="TextInput" name="data[Forgot][email]" id="email" placeholder="Recover email" />
                </div>

                <?php
                    foreach ( $query_string as $key => $value ) {
                        echo '<input type="hidden" name="data[Query]['.$key.']" value="'.$value.'" />';
                    }
                ?>

                <div class="FormRow ButtonRow">
                    <button class="CommonBtn" title="Send reset password instruction"><span>Send reset password instruction</span></button>

                    <a href="<?php echo Configure::read('root_url').'/auth/login'; ?>" title="Return to login page" class="LnkStyle01">Return to <strong>login</strong> page</a>
                </div>
            </fieldset>
        </form>
    </div>
</div>