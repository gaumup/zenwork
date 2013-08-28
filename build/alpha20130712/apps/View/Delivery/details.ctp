<?php
    echo $this->element('stream_dialog_tab', array(
        'active' => 'Details',
        'sid' => $delivery['Stream']['id'],
        'countComment' => count($delivery['Scomment']),
        'countAttachment' => count($delivery['Attachment'])
    ));
?>
<h3 id="streamDialogTitle"><span class="StreamDetailsTitle">Details</span></h3>
<div class="StreamContentInside StreamScrollContent">
    <div class="StreamBlock">
        <?php echo $this->element('avatar', array('user'=>$delivery['User'])); ?>
        <p class="StreamAuthor">Created by <?php echo $delivery['User']['username']; ?><br />
        <small><?php echo $this->Time->timeAgoInWords($delivery['Stream']['createdOn']); ?></small>
        </p>
    </div>
    <div class="StreamBlock">
        <label for="dName">Name</label>
        <input  id="dName" <?php echo $isEditable ? '' : 'disabled="disabled"'; ?> class="TextInput" value="<?php echo $delivery['Stream']['name']; ?>" />
		<div class="MsgBoxWrapper ErrorBox Hidden">
			<div class="MsgBox">
				<p>Deliverable name can not be blank</p>
			</div>
		</div>
        <textarea id="dDescription" <?php echo $isEditable ? '' : 'disabled="disabled"'; ?> class="Textarea <?php echo $isEditable ? 'AutoResizeTextbox' : 'TextareaReadonly'; ?>"><?php echo urldecode($delivery['Stream']['description']); ?></textarea>
		<div class="MsgBoxWrapper ErrorBox Hidden">
			<div class="MsgBox">
				<p>Please tell something about this deliverable</p>
			</div>
		</div>
    </div>
    <div class="StreamBlock StreamBlockDeliverAlt03">
        <label for="uid">Assignee</label>
        <input id="uid" <?php echo $isEditable ? '' : 'disabled="disabled"'; ?> class="TextInput" value="<?php echo $dAssignee[0]['User']['username']; ?>" />
        <div class="MsgBoxWrapper ErrorBox Hidden">
            <div class="MsgBox">
                <p>Invalid assignee</p>
            </div>
        </div>
    </div>
    <div class="StreamBlock StreamBlockDeliverAlt04">
        <label for="dPriority">Priority</label>
        <input readonly="readonly" id="dPriority" <?php echo $isEditable ? '' : 'disabled="disabled"'; ?> class="TextInput SelectInput" value="<?php echo $deliveryPriority['name']; ?>" />
        <select id="dPriorityID" class="Hidden">
            <option value="1" <?php echo ($deliveryPriority['id'] == 1 ? 'selected="selected"' : ''); ?> class="DPriorityHigh">High</option>
            <option value="2" <?php echo ($deliveryPriority['id'] == 2 ? 'selected="selected"' : ''); ?> class="DPriorityMedium">Medium</option>
            <option value="3" <?php echo ($deliveryPriority['id'] == 3 ? 'selected="selected"' : ''); ?> class="DPriorityLow">Low</option>
        </select>
        <div class="MsgBoxWrapper ErrorBox Hidden">
            <div class="MsgBox">
                <p>Please set the priority for this deliverable</p>
            </div>
        </div>
    </div>
    <div class="StreamBlock StreamBlockDeliverAlt03">
        <label for="">Start from</label>
        <input disabled="disabled" class="TextInput" value="<?php echo date('d-M-Y H:i', $delivery['Stream']['startTime']); ?>" />
    </div>
    <div class="StreamBlock StreamBlockDeliverAlt04">
        <label for="dTime">Deadline</label>
        <input id="dTime" <?php echo $isEditable ? '' : 'disabled="disabled"'; ?> class="TextInput CalendarInput" value="<?php echo date('d-M-Y H:i', $delivery['Stream']['endTime']); ?>" />
		<?php  if ( $isEditable ) {   ?>
			<div class="MsgBoxWrapper ErrorBox Hidden">
				<div class="MsgBox">
					<p>Deliverable must have delivery date</p>
				</div>
			</div>
		<?php } ?>
    </div>
	<div class="StreamBlock">
        <label for="dCategory">Category</label>
        <input readonly="readonly" id="dCategory" <?php echo $isEditable ? '' : 'disabled="disabled"'; ?> class="TextInput AutocompleteCategoryInput SelectInput" value="<?php echo $deliveryCate['name']; ?>" />
    </div>
	<div class="BlockWrapper">
		<?php if ( $belongsToModel == 'Team' ) { ?>
			<div class="StreamBlock">
				<label for="">Belongs to team</label>
				<input disabled="disabled" class="TextInput" value="<?php echo $belongsTo[$belongsToModel]['name']; ?>" />
			</div>
			<?php if ($isEditable) { ?>
                <div class="StreamBlock StreamBlockDeliverAlt03">
                    <input id="dProjectId" class="TextInput AutocompleteProjectInput" type="text" placeholder="Belongs to project" />
                    <div class="MsgBoxWrapper ErrorBox Hidden">
                        <div class="MsgBox">
                            <p>Deliverable must belongs to at least 1 project</p>
                        </div>
                    </div>
                </div>
                <div class="StreamBlock StreamBlockDeliverAlt04">
                    <input id="dProductId" class="TextInput AutocompleteProductInput" type="text" placeholder="Belongs to product" />
                    <div class="MsgBoxWrapper ErrorBox Hidden">
                        <div class="MsgBox">
                            <p>Deliverable must belongs to at least 1 product</p>
                        </div>
                    </div>
                </div>
			<?php } ?>
		<?php } else if ( $belongsToModel == 'Product' ) { ?>
			<?php  if ( $isEditable ) {   ?>
				<div class="StreamBlock StreamBlockDeliverAlt03">
					<label for="dProjectId">Belongs to project</label>
					<input id="dProjectId" class="TextInput AutocompleteProjectInput" value="" />
				</div>
				<div class="StreamBlock StreamBlockDeliverAlt04">
					<label for="dProductId">Belongs to product</label>
					<input id="dProductId" class="TextInput AutocompleteProductInput" value="<?php echo $belongsTo[$belongsToModel]['name']; ?>" />
				</div>
                <div class="StreamBlock StreamBlockCheckbox">
                    <input id="dTeam" class="CheckBox01" type="checkbox" value="1" />
                    <label for="dTeam">Belongs to <?php echo $selectedTeam['Team']['name'] ?></label>
                    <div class="MsgBoxWrapper ErrorBox Hidden">
                        <div class="MsgBox">
                            <p>Please select Team, Project or Product for delivery</p>
                        </div>
                    </div>
                </div>
			<?php } else { ?>
				<div class="StreamBlock">
					<label for="">Belongs to product</label>
					<input disabled="disabled" class="TextInput" value="<?php echo $belongsTo[$belongsToModel]['name']; ?>" />
				</div>
			<?php } ?>
		<?php } else if ( $belongsToModel == 'Project' ) { ?>
			<div class="StreamBlock StreamBlockDeliverAlt03">
				<label for="dProjectId">Belongs to project</label>
				<input id="dProjectId" <?php echo $isEditable ? '' : 'disabled="disabled"'; ?> class="TextInput AutocompleteProjectInput" value="<?php echo $belongsTo[$belongsToModel]['name']; ?>" />
			</div>
			<div class="StreamBlock StreamBlockDeliverAlt04">
				<label for="dProductId">Belongs to product</label>
				<input id="dProductId" <?php echo $isEditable ? '' : 'disabled="disabled"'; ?> class="TextInput AutocompleteProductInput" value="<?php echo urldecode($belongsTo['Product']['name']); ?>" />
			</div>
			<?php if ( $isEditable ) { ?>
                <div class="StreamBlock StreamBlockCheckbox">
                    <input id="dTeam" class="CheckBox01" type="checkbox" value="1" />
                    <label for="dTeam">Belongs to <?php echo $selectedTeam['Team']['name'] ?></label>
                    <div class="MsgBoxWrapper ErrorBox Hidden">
                        <div class="MsgBox">
                            <p>Please select Team, Project or Product for delivery</p>
                        </div>
                    </div>
                </div>
			<?php } ?>
		<?php } ?>
		<div class="MsgBoxWrapper ErrorBox Hidden">
			<div class="MsgBox">
				<p>Please select Team, Project or Product for delivery</p>
			</div>
		</div>
	</div>
	<?php if ( $isEditable ) { ?>
    <div class="StreamBlock">
		<a href="#" class="CommonButtonLnk" title="Update changes" id="editDeliverySubmitBtn">Update changes</a>
    </div>
	<?php } ?>

    <div class="StreamBlock StreamActivityBlock">
        <h4>Activity feed</h4>
        <ul class="StreamActivities">
			<?php
				foreach ( $deliveryLog as $key => $dLog ) {
					echo '<li><strong>'.$dLog['User']['username'].'</strong>&nbsp;'.$dLog['Stream_log']['action'].'&nbsp;&nbsp;<em>'.$this->Time->timeAgoInWords($dLog['Stream_log']['when']).'</em></li>';
				}
			?>
        </ul>
    </div>
</div>
<?php if ( $isEditable ) { ?>
	<select class="Hidden" id="listProjects">
		<option value="0">-- select project --</option>
		<?php
			foreach ($listProjects as $project) {
				if ( $belongsToModel == 'Project' && $project['Project']['id'] == $belongsTo[$belongsToModel]['id'] ) {
					echo '<option selected="selected" value="'.$project['Project']['id'].'">'.$project['Project']['name'].'</option>';
				} else {
					echo '<option value="'.$project['Project']['id'].'">'.$project['Project']['name'].'</option>';
				}
			}
		?>
	</select>
	<select class="Hidden" id="listProducts">
		<option value="0">-- select product --</option>
		<?php
			foreach ($listProducts as $product) {
				if ( ($belongsToModel == 'Product' && $product['Product']['id'] == $belongsTo[$belongsToModel]['id'] ) || ($belongsToModel == 'Project' && $product['Product']['id'] == $belongsTo['Product']['id']) ) {
					echo '<option selected="selected" value="'.$product['Product']['id'].'">'.urldecode($product['Product']['name']).'</option>';
				} else {
					echo '<option value="'.$product['Product']['id'].'">'.urldecode($product['Product']['name']).'</option>';
				}
			}
		?>
	</select>
	<select class="Hidden" id="mapProjectProduct">
		 <?php
			foreach ($listProjects as $project) {
				echo '<option value="'.$project['Project']['id'].'">'.$project['Project']['product_id'].'</option>';
			}
		?>
	</select>
	<select class="Hidden" id="listDeleveryTypes">
	   <option value="0">-- select type --</option>
	   <?php
			foreach ($listDeliveryTypes as $dType) {
				if ( $deliveryCate['id'] == $dType['Delivery_type']['id'] ) {
					echo '<option selected="selected" value="'.$dType['Delivery_type']['id'].'">'.$dType['Delivery_type']['name'].'</option>';
				} else {
					echo '<option value="'.$dType['Delivery_type']['id'].'">'.$dType['Delivery_type']['name'].'</option>';
				}
			}
		?>
	</select>
	<input id="dEditable" type="hidden" name="dEditable" value="1" />
<?php } ?>