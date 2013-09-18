<h3 id="streamDialogTitle"><span class="StreamDetailsTitle">Filter to view task by people or keyword</h3>

<div class="StreamContentWrapper">
    <div class="StreamContentInside">
        <div class="StreamBlock">
            <label>View task asigned to people</label>
            <div class="ListInvitedPeopleWrapper ListInvitedPeopleWrapperAlt01">
                <ul class="ListInvitedPeople" id="listInvitedPeople">
                    <li id="creator<?php echo $list['Creator']['id']; ?>" <?php if (isset($postData) && (empty($postData['checkedUID']) || in_array($list['Creator']['id'], $postData['checkedUID']))) { echo 'class="Checked"'; } ?>>
                        <label for="checkboxUserTaskView<?php echo $list['Creator']['id']; ?>">
                            <input class="UserTaskViewCheckbox" type="checkbox" data-uid="<?php echo $list['Creator']['id']; ?>" rel="#creator<?php echo $list['Creator']['id']; ?>" id="checkboxUserTaskView<?php echo $list['Creator']['id']; ?>" <?php if (isset($postData) && (empty($postData['checkedUID']) || in_array($list['Creator']['id'], $postData['checkedUID']))) { echo 'checked="checked"'; } ?> /> 
                            <?php
                                echo $this->element('avatar', array(
                                    'user' => $list['Creator'],
                                    'title' => ''
                                ));
                            ?>
                            <span><?php echo $list['Creator']['username']; ?></span>
                        </label>
                    </li>
                    <?php foreach ( $usersList as $user ) : ?>
                    <li id="invited<?php echo $user['User']['id']; ?>" <?php if (isset($postData) && (empty($postData['checkedUID']) || in_array($user['User']['id'], $postData['checkedUID']))) { echo 'class="Checked"'; } ?>>
                        <label for="checkboxUserTaskView<?php echo $user['User']['id']; ?>">
                            <input class="UserTaskViewCheckbox" type="checkbox" data-uid="<?php echo $user['User']['id']; ?>" rel="#invited<?php echo $user['User']['id']; ?>" id="checkboxUserTaskView<?php echo $user['User']['id']; ?>" <?php if (isset($postData) && (empty($postData['checkedUID']) || in_array($user['User']['id'], $postData['checkedUID']))) { echo 'checked="checked"'; } ?> /> 
                            <?php 
                                echo $this->element('avatar', array(
                                    'user'=> $user['User']
                                ));
                            ?>
                            <span><?php echo $user['User']['username']; ?></span>
                        </label>
                    </li>
                    <?php endforeach ?>
                </ul>
            </div>
        </div>

        <div class="StreamBlock">
            <label for="tagFilterTaskView">View task has tag name</label>
            <input type="text" class="TextInput" id="tagFilterTaskView" placeholder="Tag name, multiple tags seperated by commas. Eg: design, layout, ui" value="<?php echo $postData['tag']; ?>" />
        </div>

        <div class="StreamBlock ButtonRow">
            <a href="<?php echo Configure::read('root_url').'/planner/filter/'.$lid; ?>" class="CommonButtonLnk" title="Update filter" id="updateStreamListFilter">Update filter</a>
        </div>
    </div>
</div>
