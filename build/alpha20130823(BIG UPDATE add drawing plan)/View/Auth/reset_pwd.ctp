<div class="FormContainer FormContainerAlt FormContainerAlt01">
    <h2>Reset password</h2>
    <div class="ProfileContainer">
        <form method="post" action="">
            <fieldset>
                <legend>Reset user password</legend>

                <div class="MsgBoxWrapper WarningBox FormErrorBoxSize01 Hidden" id="capslock_warning">
                    <div class="MsgBox">
                        <p>Capslock is on !</p>
                    </div>
                </div>

                <div class="FormRow">
                    <input id="password" class="TextInput <?php echo isset($errors) && isset($errors["password"]) ? 'TextInputError':''; ?>" type="password" name="data[User][password]" value="" placeholder="New password" />
                    <?php
                        if ( !empty($errors) && isset($errors["password"]) ){
                            $this->Msgbox->render($errors["password"][0], 'ErrorBox FormErrorBox FormErrorBoxSize01');
                        }
                    ?>
                </div>
                <div class="FormRow">
                    <input id="confirm_password" class="TextInput <?php echo isset($errors) && isset($errors["confirm_password"]) ? 'TextInputError':''; ?>" type="password" name="data[User][confirm_password]" value="" placeholder="Confirm new password" />
                    <?php
                        if ( !empty($errors) && isset($errors["confirm_password"]) ){
                            $this->Msgbox->render($errors["confirm_password"][0], 'ErrorBox FormErrorBox FormErrorBoxSize01');
                        }
                    ?>
                </div>

                <div class="FormRow ButtonRow">
                    <button class="CommonBtn" title="Reset password">
                        <span>Reset password</span>
                    </button>
                </div>
            </fieldset>
        </form>
    </div>
</div>