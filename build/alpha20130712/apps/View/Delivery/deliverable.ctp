<h3 id="streamDialogTitle"><span class="StreamCommentTitle">Add new deliverable</span></h3>
<div class="StreamContentInside StreamCommentBox">
    <div class="StreamFixedContent">
        <div class="MsgBoxWrapper MsgBoxWrapperDeliverAlt01 WarningBox">
            <div class="MsgBox">
                <p>All fields are required</p>
            </div>
        </div>
        <div class="StreamBlock">
            <input id="dName" class="TextInput" type="text" placeholder="Deliverable name" />
            <div class="MsgBoxWrapper ErrorBox Hidden">
                <div class="MsgBox">
                    <p>Deliverable name can not be blank</p>
                </div>
            </div>
            <textarea id="dDescription" class="Textarea AutoResizeTextbox" placeholder="Tell something about this deliverable"></textarea>
            <div class="MsgBoxWrapper ErrorBox Hidden">
                <div class="MsgBox">
                    <p>Please tell something about this deliverable</p>
                </div>
            </div>
        </div>

        <div class="StreamBlock StreamBlockDeliverAlt03">
			<input id="uid" class="TextInput" type="text" placeholder="Assignee" />
            <div class="MsgBoxWrapper ErrorBox Hidden">
                <div class="MsgBox">
                    <p>Invalid assignee</p>
                </div>
            </div>
        </div>
        <div class="StreamBlock StreamBlockDeliverAlt04">
			<input readonly="readonly" id="dPriority" class="TextInput SelectInput" type="text" placeholder="Priority" />
            <select id="dPriorityID" class="Hidden">
                <option value="1" class="DPriorityHigh">High</option>
                <option value="2" class="DPriorityMedium">Medium</option>
                <option value="3" class="DPriorityLow">Low</option>
            </select>
        </div>

		<div class="BlockWrapper">
			<div class="StreamBlock StreamBlockCheckbox">
				<?php
					if ( !$globalAdd ) {
						echo '<input id="dTeam" class="CheckBox01" type="checkbox" value="1" />';
						echo '<label for="dTeam">Belongs to '.$selectedTeam['Team']['name'].'</label>';
						echo '<select class="Hidden" id="listTeams">';
						echo '<option selected="selected"        value="'.$selectedTeam['Team']['id'].'">'.$selectedTeam['Team']['name'].'</option>';
						echo '</select>';
					} else {
						echo '	<input id="dTeam" class="TextInput AutocompleteTeamInput" type="text" placeholder="Belongs to team - '.count($selectedTeam).' teams available" />';
						echo '<select class="Hidden" id="listTeams">';
						echo '	<option value="0">-- select team --</option>';
						foreach ($selectedTeam as $team) {
							echo '<option value="'.$team['Team']['id'].'">'.$team['Team']['name'].'</option>';
						}
						echo '</select>';
					}
				?>
			</div>
			<div class="StreamBlock StreamBlockDeliverAlt03">
				<input id="dProjectId" class="TextInput AutocompleteProjectInput" type="text" placeholder="Belongs to project - <?php echo count($listProjects); ?> projects available" />
				<select class="Hidden" id="listProjects">
					<option value="0">-- select project --</option>
					<?php
						foreach ($listProjects as $project) {
							echo '<option value="'.$project['Project']['id'].'">'.$project['Project']['name'].'</option>';
						}
					?>
				</select>
			</div>
			<div class="StreamBlock StreamBlockDeliverAlt04">
				<input id="dProductId" class="TextInput AutocompleteProductInput" type="text" placeholder="Belongs to product - <?php echo count($listProjects); ?> products available"" />
				<select class="Hidden" id="listProducts">
					<option value="0">-- select product --</option>
					<?php
						foreach ($listProducts as $product) {
							echo '<option value="'.$product['Product']['id'].'">'.urldecode($product['Product']['name']).'</option>';
						}
					?>
				</select>
			</div>
			<div class="MsgBoxWrapper ErrorBox Hidden">
				<div class="MsgBox">
					<p>Please select Team, Project or Product for delivery</p>
				</div>
			</div>
		</div>
        <div class="StreamBlock StreamBlockDeliverAlt03">
            <input readonly="readonly" id="dCategory" class="TextInput AutocompleteCategoryInput SelectInput" type="text" placeholder="Deliverable category" />
            <div class="MsgBoxWrapper ErrorBox Hidden">
                <div class="MsgBox">
                    <p>Deliverable must belongs to a category</p>
                </div>
            </div>
            <select class="Hidden" id="listDeleveryTypes">
               <option value="0">-- select type --</option>
			   <?php
					foreach ($listDeliveryTypes as $dType) {
						echo '<option value="'.$dType['Delivery_type']['id'].'">'.$dType['Delivery_type']['name'].'</option>';
					}
				?>
            </select>
        </div>
        <div class="StreamBlock StreamBlockDeliverAlt04">
            <input id="dTime" class="TextInput CalendarInput" type="text" placeholder="Delivery date" />
            <div class="MsgBoxWrapper ErrorBox Hidden">
                <div class="MsgBox">
                    <p>Deliverable must have delivery date</p>
                </div>
            </div>
        </div>

        <div class="StreamBlock">
            <a href="#" class="CommonButtonLnk StreamCommentDialogBtn" title="Add" id="addDeliverySubmitBtn">Add</a>
        </div>
    </div>
</div>
<select class="Hidden" id="mapProjectProduct">
    <?php
		foreach ($listProjects as $project) {
			echo '<option value="'.$project['Project']['id'].'">'.$project['Project']['product_id'].'</option>';
		}
	?>
</select>