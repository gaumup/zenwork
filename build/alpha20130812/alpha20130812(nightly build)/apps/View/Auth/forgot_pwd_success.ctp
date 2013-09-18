<div class="FormContainer FormContainerAlt FormContainerAlt01">
    <h2>Reset password</h2>
    <div class="ProfileContainer">
        <div class="MsgBoxWrapper SuccessBox">
            <div class="MsgBox">
                <p class="FormHelpText">An instruction on how to reset password have been sent to your email: <strong><?php echo $recovery_email; ?></strong></p>
            </div>
        </div>

        <div class="FormRow ButtonRow">
            <a href="<?php echo Configure::read('root_url').'/auth/login'; ?>" title="Back to login screen" class="CommonButtonLnk"><span>Back to login screen</span></a>
        </div>
    </div>
</div>