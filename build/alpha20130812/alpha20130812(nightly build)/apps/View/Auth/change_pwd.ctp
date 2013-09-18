<div class="FormContainer FormContainerAlt FormContainerAlt01">
    <h2>Change user password</h2>
    <div class="ProfileContainer">
        <form method="post" action="">
            <fieldset>
                <legend>Change user password</legend>

                <div class="MsgBoxWrapper WarningBox FormErrorBoxSize01 Hidden" id="capslock_warning">
                    <div class="MsgBox">
                        <p>Capslock is on !</p>
                    </div>
                </div>

                <div class="FormRow">
                    <input id="old_password" class="TextInput <?php echo isset($errors) && isset($errors["old_password"]) ? 'TextInputError':''; ?>" type="password" name="data[User][old_password]" value="<?php echo (!empty($this->data['User']['old_password']) ? $this->data['User']['old_password'] : ''); ?>" placeholder="Old password" />
                    <?php
                        if ( !empty($errors) && isset($errors["old_password"]) ){
                            $this->Msgbox->render($errors["old_password"][0], 'ErrorBox FormErrorBox FormErrorBoxSize01');
                        }
                    ?>
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
                    <button class="CommonBtn" title="Update password" tabindex="4"><span>Update password</span></button>
                </div>
            </fieldset>
        </form>
    </div>
</div>