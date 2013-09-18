<div id="loginbox">
    <h2>Allow IMS Dashboard access your IMS account</h2>
    <div class="LoginForm">
            <?php
                echo $this->Form->create('Authorize');
            ?>

            <fieldset>
                <legend>Authorization IMS</legend>

                <div class="MsgBoxWrapper WarningBox">
                    <div class="MsgBox">
                        <p>By agreeing, you will allow IMS Dashboard access your IMS account, retrieve all your personal data belongs to your account!</p>
                    </div>
                </div>

                <?php
                    foreach ( $OAuthParams as $key => $value ) {
                        echo '<input type="hidden" name="data[Authorize]['.$key.']" value="'.$value.'" />';
                    }
                ?>

                <button class="CommonBtn CommonBtnAlt02" title="Yes" name="accept" value="Yes"><span>Yes</span></button>
                <button class="CommonBtn" title="No" name="accept" value="No"><span>No</span></button>
            </fieldset>

            <?php
                echo $this->Form->end();
            ?>
    </div>
</div>
