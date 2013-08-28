<?php
    //widgets: dialog, depends on: jquery, jquery.ui, ui.widget, ui.mouse, ui.position, ui.draggable
    $this->Css->add('/widgets/jquery-dialog/css/jquery-dialog.css');
    $this->Html->script('/widgets/jquery-dialog/js/jquery-dialog.js', false);
    //END. widgets: dialog

    //widgets: jcrop, depends on: jquery
    $this->Css->add('/widgets/jcrop/css/jcrop.css');
    $this->Html->script('/widgets/jcrop/js/jcrop.js', false);
    //END. widgets: jcrop

    $this->Html->script('/js/profile.js', false);
?>

<div class="FormContainer FormContainerAlt">
    <h2>My profile</h2>
    <div class="ProfileContainer">
        <form method="post" action="">
            <fieldset>
                <legend>My profile</legend>

                <input type="hidden" name="data[User][id]" value="<?php echo $logged_in_user_profile['User']['id']; ?>" />

                <?php
                    echo $this->Session->flash('profile_success', array(
                        'params' => array('extra_classes' => 'SuccessBox'),
                        'element' => 'message_box'
                    ));
                    echo $this->Session->flash('change_pwd_success', array(
                        'params' => array('extra_classes' => 'SuccessBox'),
                        'element' => 'message_box'
                    ));
                ?>

                <div class="ProfileWrapper01">
                    <div class="FormRow">
                        <label>Photo</label>

                        <div class="FieldContainer">
                            <div class="AvatarWrapper">
                                <img src="<?php echo ($this->Session->read('Auth.User.avatar') == "" ? Configure::read("root_url")."/images/default-avatar-fullsize.png" : Configure::read("root_url")."/".Configure::read("upload_path")."/".$this->Session->read('Auth.User.avatar')) ?>" width="160" height="160" id="avatar" />
                                <a href="#" class="EditButton" title="Click to edit photo" id="edit_avatar">Click to edit avatar</a>
                            </div>
                            <p class="AccountName"><?php echo $logged_in_user_profile["User"]["username"]; ?><br />
                            <span><?php echo $logged_in_user_profile["User"]["email"]; ?></span></p>

                            <p class="PhotoNotice">This photo is your identity on IMS and appears with your account on IMS.</p>

                            <div class="MsgBoxWrapper Hidden" id="upload_avatar_msgbox">
                                <div class="MsgBox">
                                    <p id="upload_avatar_response"></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="ProfileWrapper02">
                    <div class="FormRow">
                        <label>Password</label>
                        <div class="FieldContainer">
                            <a href="<?php echo Configure::read('root_url').'/auth/changePwd/'.$this->Session->read('Auth.User.id'); ?>" title="Change passsword" class="CommonButtonLnk"><span>Change passsword</span></a>
                        </div>
                    </div>

                    <div class="FormRow">
                        <label for="fullname">Full name:</label>
                        <div class="FieldContainer">
                            <input id="fullname" class="TextInput <?php echo isset($errors) && isset($errors["fullname"]) ? 'TextInputError':''; ?>" type="text" name="data[User][fullname]" value="<?php echo !empty($this->data["User"]["fullname"]) ? $this->data["User"]["fullname"] : $logged_in_user_profile["User"]["fullname"]; ?>"/>
                            <?php
                                if ( isset($errors) && isset($errors["fullname"]) ){
                                    $this->Msgbox->render($errors["fullname"][0], 'ErrorBox FormErrorBox FormErrorBoxSize01');
                                }
                            ?>
                        </div>
                    </div>
                    <div class="FormRow RadioFormRow">
                        <?php
                            $this->request->data['User']['gender'] = !empty($this->data['User']['gender'])
                                ? $this->data['User']['gender']
                                : $logged_in_user_profile['User']['gender'];
                        ?>
                        <label>Gender:</label>
                        <input class="MultiChoiceInput" id="female" type="radio" name="data[User][gender]" value="1" <?php if ($this->data["User"]["gender"] == 1) { echo 'checked="checked"'; } ?> />
                        <label class="MultiChoiceLabel" for="female">Female</label>

                        <input class="MultiChoiceInput" id="male" type="radio" name="data[User][gender]" value="2" <?php if ($this->data["User"]["gender"] == 2) { echo 'checked="checked"'; } ?> />
                        <label class="MultiChoiceLabel" for="male">Male</label>
                    </div>

                    <div class="FormRow">
                        <label>Birthday:</label>
                        <?php
                            $this->request->data["User"]["birthday"] = !empty($this->data["User"]["birthday"])
                                ? $this->data["User"]["birthday"]
                                : $logged_in_user_profile["User"]["birthday"];
                            $bday = !empty($this->data["User"]["birthday"])
                                ? date("d/m/Y", $this->data["User"]["birthday"])
                                : "";
                            $bday_date = $bday == "" ? array("", "", "") : explode("/", $bday);
                        ?>
                        <select id="birthdayDay" class="SelectStyle01" name="data[bd_day]">
                            <option value="" <?php if ( $bday == "" ) { echo 'selected="selected"'; } ?>>Day:</option>
                            <?php
                                $bday_day = $bday_date[0];
                                for ($i = 1; $i <= 31; $i++) {
                                   if ($i == $bday_day) {
                                        echo '<option selected = "selected" value="'.$i.'">'.$i.'</option>';
                                   } else {
                                        echo '<option value="'.$i.'">'.$i.'</option>';
                                   }
                                }
                            ?>
                        </select>
                        <select id="birthdayMonth" class="SelectStyle01" name="data[bd_month]">
                            <option value="" <?php if ( $bday == "" ) { echo 'selected="selected"'; } ?>>Month:</option>
                            <?php
                                $monthArr = array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
                                $bday_month = $bday_date[1];
                                for ( $i = 1; $i <= 12; $i++) {
                                    if ($i == $bday_month) {
                                         echo '<option selected = "selected" value="'.$i.'">'.$monthArr[$i-1].'</option>';
                                    } else {
                                        echo '<option value="'.$i.'">'.$monthArr[$i-1].'</option>';
                                    }
                                }
                            ?>
                        </select>
                        <select id="birthdayYear" class="SelectStyle02" name="data[bd_year]">
                            <option value="" <?php if ( $bday == "" ) { echo 'selected="selected"'; } ?>>Year:</option>
                            <?php
                                $bday_year = $bday_date[2];
                                for ($i = 2010; $i > 1950; $i--) {
                                    if ($i == $bday_year) {
                                        echo '<option selected= "selected" value="'.$i.'">'.$i.'</option>';
                                    } else {
                                        echo '<option value="'.$i.'">'.$i.'</option>';
                                    }
                                }
                            ?>
                        </select>
                    </div>
                    <div class="FormRow">
                        <label for="mobile">Mobile:</label>
                        <input id="mobile" class="TextInput" type="text" name="data[User][mobile]" value="<?php echo !empty($this->data["User"]["mobile"]) ? $this->data["User"]["mobile"] : $logged_in_user_profile["User"]["mobile"];?>"/>
                    </div>

                    <div class="FormRow ButtonRow">
                        <button class="CommonBtn" title="Update profile">
                            <span>Update profile</span>
                        </button>
                    </div>
                </div>
            </fieldset>
        </form>
    </div>
</div>

<div id="helper_container">
    <div id="edit_avatar_context_menu" class="CommonContextMenu Hidden">
        <ul class="EditAvatarOptions">
            <li><a href="#upload_avatar" title="Upload an image" class="UploadImgIcon">Upload an image<iframe src="<?php echo Configure::read('root_url').'/auth/uploadAvatar/'.$this->Session->read('Auth.User.id') ?>" class="IframeUpload"></iframe></a></li>
            <li><a href="#edit_avatar" title="Edit current image" class="EditImgIcon <?php echo ($this->Session->read('Auth.User.avatar') == "" ? "Hidden" : ""); ?>">Edit current image</a></li>
            <li><a href="#remove_avatar" title="Remove current image" class="RemoveImgIcon <?php echo ($this->Session->read('Auth.User.avatar') == "" ? "Hidden" : ""); ?>">Remove current image</a></li>
        </ul>
    </div>

    <div id="upload_avatar_modal" class="Hidden">
        <div class="DialogHeader">
            <p class="NoticeText02"><strong>Click and drag on the image</strong> to make the avatar as you like<br />Remember to click <strong>&quot;Save changes&quot;</strong> to confirm your changes</p>
        </div>
        <div class="DialogContent">
            <div class="OriginalImg" id="avatar_edit_image"></div>
        </div>
        <div class="DialogFooter">
            <div class="FormRow ButtonRow">
                <button rel="" id="save_changes_avatar" class="CommonBtn" title="Save changes"><span>Save changes</span></button>
                <button rel="" id="cancel_changes_avatar" class="CommonBtn CommonBtnAlt01" title="Cancel"><span>Cancel</span></button>
            </div>
        </div>
    </div>
</div>