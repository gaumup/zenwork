<?php
    $this->Css->add('/widgets/delivery/css/delivery.css', false);

	$this->Html->script('/plugins/js/datetimehelper.js', false);
	$this->Html->script('/plugins/js/json2.js', false);
    $this->Html->script('/widgets/delivery/js/delivery.js', false);
    $this->Html->script('/widgets/jquery-datepicker/js/jquery-datepicker.js', false);
    $this->Html->script('/widgets/jquery-datepicker/js/jquery-timepicker.js', false);
    $this->Html->script('/widgets/jquery-datepicker/js/jquery-monthpicker.js', false);
	$this->Html->script('/widgets/draggable/js/jquery-draggable.js', false);
	$this->Html->script('/widgets/droppable/js/jquery-droppable.js', false);
	$this->Html->script('/widgets/autocomplete/js/autocomplete.js', false);
    $this->Html->script('/widgets/jquery-slider/js/jquery-slider.js', false);
    $this->Html->script('/widgets/plupload/js/plupload.full.js', false);
    $this->Html->script('/widgets/uploader/js/uploader.js', false);
    $this->Html->script('/widgets/comment/js/comment.js', false);
    $this->Html->script('/plugins/js/signals.js', false);
    $this->Html->script('/plugins/js/crossroads.js', false);
    $this->Html->script('/plugins/js/hasher.js', false);
?>

<table id="deliveryBoard" class="DeliveryBoard" cellspacing="0" cellpadding="0">
    <thead>
        <?php
            $monthWeeks = intval( ($endMonthTime - $startMonthTime + 24*3600)/(7*24*3600));
        ?>
        <tr>
            <th></th>
			<th colspan="1" class="HeaderRowStyle01">
			<?php
				foreach ( $listTeam as $key => $team ) {
					if ($team['editable']) {
						echo '	<a href="#" class="CommonButtonLnk" title="Add new deliverable" id="addDeliverableInput">+ Add new deliverable</a>';
						break;
					}
				}
			?>
			</th>
            <th colspan="<?php echo $monthWeeks-1; ?>" class="HeaderRowStyle02">
                <input type="text" id="searchDeliverableInput" class="TextInput SearchInput" placeholder="Type deliverable name and press enter to search" data-source="<?php echo Configure::read('root_url').'/delivery/search'; ?>" />
            </th>
        </tr>
        <tr>
            <th></th>
			<?php
				echo '<th colspan="'.$monthWeeks.'">';
				echo '	<a href="'.Configure::read("root_url").'/delivery/index/'.($month == 1 ? intval($year) - 1 : $year).'/'.($month == 1 ? 12:$month-1).'/'.$searchCondition.'" title="'.($month == 1 ? $monthArr[12].' '. (intval($year) - 1) : $monthArr[intval($month) - 1].' '. $year).'" class="CalendarNavigationBtn">'.($month == 1 ? $monthArr[12].' '. (intval($year) - 1) : $monthArr[intval($month) - 1].' '. $year).'</a>';
			?>
            <input title="Click to select month" class="TextInput" id="currTimeline" value="<?php echo $monthArr[intval($month)].' '.$year; ?>" />
            <select id="teamFilter" class="FilterY">
                <option value="all" <?php echo $searchCondition == 'all' ? 'selected="selected"' : ''; ?>>All</option>
                <option value="mine" <?php echo $searchCondition == 'mine' ? 'selected="selected"' : ''; ?>>My team</option>
                <option value="functional" <?php echo $searchCondition == 'functional' ? 'selected="selected"' : ''; ?>>Functional team</option>
                <option value="spg" <?php echo $searchCondition == 'spg' ? 'selected="selected"' : ''; ?>>SGPs</option>
            </select>
            <?php
                echo '<a href="'.Configure::read("root_url").'/delivery/index/'.($month == 12 ? intval($year) + 1 : $year).'/'.($month == 12 ? 1:$month+1).'/'.$searchCondition.'" title="'.($month == 12 ? $monthArr[12].' '. (intval($year) + 1) : $monthArr[intval($month) + 1].' '. $year).'" class="CalendarNavigationBtn CalendarNavigationBtnAlt01">'.($month == 12 ? $monthArr[12].' '. (intval($year) + 1) : $monthArr[intval($month) + 1].' '. $year).'</a>';
            ?>
            </th>
        </tr>
        <tr>
			<?php
				$monthWeeks = intval(($endMonthTime - $startMonthTime + 24*3600)/(7*24*3600));
                $w = ceil((date('z', time()) - date('z', $startMonthTime) + 1)/7);
				echo '<th width="10%"></th>';
				for ($i = 1; $i <= $monthWeeks; $i++) {
					echo '<th class="WeekTitleCol '.($w == $i ? 'CurrentWeek' : '').'" width="'.(90/$monthWeeks).'%">Week '.$i.'</th>';
				}
			?>
        </tr>
    </thead>

    <tbody>
		<?php
			foreach ( $listTeam as $key => $team ) {
				$startTime = $startMonthTime;
				echo '<tr class="RowWrapper">';
				echo '	<td class="TitleCol">'.$team['Team']['name'].'</td>';
				for ( $i = 1; $i <= $monthWeeks; $i++ ) {
					$startWeekTime = $startTime;
					$endWeekTime = $startTime;
					$countWeekDays = 0;
					$countWeekDelivery = 0;
					echo '<td>';
					do {
						$countWeekDays++;
						$endWeekTime += 24*3600;
					} while ( date('w', $endWeekTime) != 1 );
                    $cellID = 'team'.$team['Team']['id'].'W'.$i;
					echo '	<div id="'.$cellID.'" class="CellWrapper '.(!$team['editable'] ? 'CellWrapperRestricted' : '').'" data-row-id="'.$team['Team']['id'].'" data-start-time="'.$startWeekTime.'" data-end-time="'.($endWeekTime - 1).'">';
					foreach ( $team['Delivery'] as $dKey => $delivery ) {
						if ( $delivery['Stream']['endTime'] >= $startWeekTime && $delivery['Stream']['endTime'] < $endWeekTime ) {
							$countWeekDelivery++;
							unset($team['Delivery'][$dKey]);
						}
					}
					if ( $countWeekDelivery == 0 && $team['editable'] ) {
						echo '		<a href="" title="" class="DeliveryNotification DeliveryNotificationEmpty">+</a>';
					} else if ( $countWeekDelivery > 0 ) {
						echo '		<a href="" title="" class="DeliveryNotification">'.$countWeekDelivery.'</a>';
					}
					echo '		<table class="DeliveryMiniBoard" cellspacing="0" cellpadding="0">';
					echo '			 <thead>';
					echo '				<tr>';
					for ( $w = 0; $w < $countWeekDays; $w++ ) {
						echo '				<th class="'.($w == 0 ? 'FirstCol':'').' '.(date('N',($startWeekTime + $w*3600*24)) == 6 || date('N',($startWeekTime + $w*3600*24)) == 7 ? 'Weekend':'' ).' '.(date('z',($startWeekTime + $w*3600*24)) == date('z', time()) ? 'Today' : '').'">'.substr(date('D',($startWeekTime + $w*3600*24)),0,1).'</th>';
					}
					echo '				</tr>';
					echo '				<tr>';
					for ( $w = 0; $w < $countWeekDays; $w++ ) {
						echo '				<th class="'.($w == 0 ? 'FirstCol' : '').' '.(date('N',($startWeekTime + $w*3600*24)) == 6 || date('N',($startWeekTime + $w*3600*24)) == 7 ? 'Weekend' : '' ).' '.(date('z',($startWeekTime + $w*3600*24)) == date('z', time()) ? 'Today' : '').'">'.date('j',($startWeekTime + $w*3600*24)).'</th>';
					}
					echo '				</tr>';
					echo '			</thead>';
					echo '			<tbody>';
					echo '				<tr>';
					for ( $w = 0; $w < $countWeekDays; $w++ ) {
						echo '				<td class="'.($w == 0 ? 'FirstCol' : '').' '.(date('N',($startWeekTime + $w*3600*24)) == 6 || date('N',($startWeekTime + $w*3600*24)) == 7 ? 'Weekend' : '').'" data-date="'.date('j',($startWeekTime + $w*3600*24)).'" data-time="'.($startWeekTime + $w*3600*24).'"></td>';
					}
					echo '				</tr>';
					echo '			</tbody>';
					echo '			<tfoot>';
					echo '				<tr>';
					echo '					<td colspan="7" class="FirstCol">';
					echo '						<button title="Close" rel="#'.$cellID.'" class="DeliveryMiniBoardBtn CloseDeliveryMiniBoardBtn">close</button>';
					if ($team['editable']) {
						echo '						<button title="Add new deliverable" rel="#'.$cellID.'" class="DeliveryMiniBoardBtn AddNewDeliverableBtn">+</button>';
					}
					echo '					</td>';
					echo '				</tr>';
					echo '			</tfoot>';
					echo '		</table>';
					echo '	</div>';
					echo '</td>';
					$startTime = $endWeekTime;
				}
				echo '</tr>';
			}
		?>
    </tbody>
</table>
<div id="helperContainer" class="ZWContainer">
    <div id="contextMenuWrapper" class="Hidden"></div>

    <div id="streamDialog" class="StreamDialog Hidden">
        <a href="#" rel="#streamDialog" title="Close" class="StreamDialogRemoveBtn StreamDialogCloseBtn">Close</a>
        <div class="StreamDialogDecor">
            <div class="StreamDialogContent" id="streamDialogContent">
                <!-- Dynamically loading via ajax -->
            </div>
        </div>
    </div>
	<div id="guideDialog" class="StreamDialog <?php echo count($guide) > 0 ? 'GuideHidden' : ''; ?>">
		<div class="StreamDialogDecor">
			<a href="#guideDialog" class="QuickHelpBtn <?php echo count($guide) > 0 ? '' : 'Hidden'; ?>" title="Quick help" id="quickHelpBtn">Quick help?</a>
			<div class="StreamDialogContent">
				<div class="StreamBlock StreamBlockHeader">
					<h3>Delivery's help</h3>
					<a href="<?php echo Configure::read('root_url').'/app/dismissGuide/'.$this->params['controller'].'/'.$this->params['action']; ?>" class="CommonButtonLnk" title="Close" id="closeGuideBtn">Close</a>
					<?php if (count($guide) == 0) { ?>
					<label for="dismissGuideFor"><input id="dismissGuideFor" type="checkbox" value="<?php echo $loginedUser['id'] ?>" /> Do not display it on next time visit</label>
					<?php } ?>
				</div>

				<div class="StreamContentInside">
					<ul id="guideList" class="GuideList">
						<li><a href="overview" title="Overview">Overview</a></li>
						<li><a href="exploring" title="Exploring deliverables">Exploring deliverables</a></li>
						<li><a href="add" title="Add new deliverable">Add new deliverable</a></li>
						<li><a href="dragndrop" title="Live Drag&amp;Drop deliverables">Live Drag&amp;Drop deliverables</a></li>
						<li><a href="edit" title="Edit an exsiting deliverable">Edit an exsiting deliverable details</a></li>
						<li><a href="comment" title="Comment on a deliverable">Comment on a deliverable</a></li>
						<li><a href="attachment" title="Upload and attach files into a deliverable">Upload and attach files into a deliverable</a></li>
						<li><a href="details" title="View deliverable details information">View deliverable details information</a></li>
						<li><a href="follow" title="Follow up a deliverable">Follow up a deliverable</a></li>
						<li><a href="share" title="Share a deliverable to other people">Share a deliverable to other people</a></li>
						<li><a href="delete" title="Delete a deliverable">Delete a deliverable</a></li>
						<li><a href="complete" title="Mark a deliverable as completed">Mark a deliverable as completed</a></li>
					</ul>

					<div id="guideContent" class="StreamScrollContent">
						<a class="GuideListAnchor" name="overview"></a>
						<h4>Overview</h4>
						<p>Delivery page is use to manage and <strong>share all the deliverables(outputs)</strong> among team members. Leaders of each team can add and manage deliverables on this page. Members of each team can view deliverables, make comment, attach file, follow... This delivery page is created in order to build up a <em>strong communication</em> among team members and better tracking on output of each team</p>
						<div class="GuideImgBlock">
							<img src="<?php echo Configure::read('root_url').'/widgets/delivery/images/guide/overview.jpg' ?>" alt="Overview" />
							<span class="GuideImgCaption">Overview</span>
						</div>

						<a class="GuideListAnchor" name="exploring"></a>
						<h4>Exploring deliverables</h4>
						<div class="GuideImgBlock">
							<img src="<?php echo Configure::read('root_url').'/widgets/delivery/images/guide/exploring-1.jpg' ?>" alt="Exploring deliverable" />
							<span class="GuideImgCaption">Deliverable number and click to view deliverables in a week</span>
						</div>
						<div class="GuideImgBlock">
							<img src="<?php echo Configure::read('root_url').'/widgets/delivery/images/guide/exploring-2.jpg' ?>" alt="Exploring deliverable" />
							<span class="GuideImgCaption">Overview</span>
						</div>

						<a class="GuideListAnchor" name="add"></a>
						<h4>Add new deliverable</h4>
						<div class="GuideImgBlock">
							<img src="<?php echo Configure::read('root_url').'/widgets/delivery/images/guide/add.jpg' ?>" alt="add new deliverable" />
							<span class="GuideImgCaption">Add new deliverable</span>
						</div>

						<a class="GuideListAnchor" name="dragndrop"></a>
						<h4>Live Drag&amp;Drop deliverables</h4>
						<div class="GuideImgBlock">
							<img src="<?php echo Configure::read('root_url').'/widgets/delivery/images/guide/exploring-3.jpg' ?>" alt="Drag &amp; Drop deliverable" />
							<span class="GuideImgCaption">Add new deliverable</span>
						</div>

						<a class="GuideListAnchor" name="edit"></a>
						<h4>Edit an exsiting deliverable details</h4>
						<div class="GuideImgBlock">
							<img src="<?php echo Configure::read('root_url').'/widgets/delivery/images/guide/edit.jpg' ?>" alt="Edit deliverable" />
							<span class="GuideImgCaption">Edit an exsiting deliverable</span>
						</div>

						<a class="GuideListAnchor" name="comment"></a>
						<h4>Comment on a deliverable</h4>
						<div class="GuideImgBlock">
							<img src="<?php echo Configure::read('root_url').'/widgets/delivery/images/guide/comment.jpg' ?>" alt="Comment" />
							<span class="GuideImgCaption">Comment on a deliverable</span>
						</div>

						<a class="GuideListAnchor" name="attachment"></a>
						<h4>Upload and attach files into a deliverable</h4>
						<div class="GuideImgBlock">
							<img src="<?php echo Configure::read('root_url').'/widgets/delivery/images/guide/attachment.jpg' ?>" alt="Attachment" />
							<span class="GuideImgCaption">Upload and attach files into a deliverable</span>
						</div>

						<a class="GuideListAnchor" name="details"></a>
						<h4>View deliverable details information</h4>
						<div class="GuideImgBlock">
							<img src="<?php echo Configure::read('root_url').'/widgets/delivery/images/guide/details.jpg' ?>" alt="Details" />
							<span class="GuideImgCaption">View deliverable details information</span>
						</div>

						<a class="GuideListAnchor" name="details"></a>
						<h4>View deliverable details information</h4>
						<div class="GuideImgBlock">
							<img src="<?php echo Configure::read('root_url').'/widgets/delivery/images/guide/details.jpg' ?>" alt="Details" />
							<span class="GuideImgCaption">View deliverable details information</span>
						</div>

						<a class="GuideListAnchor" name="follow"></a>
						<h4>Follow up a deliverable</h4>
						<div class="GuideImgBlock">
							<img src="<?php echo Configure::read('root_url').'/widgets/delivery/images/guide/follow.jpg' ?>" alt="Follow a deliverable" />
							<span class="GuideImgCaption">Follow up a deliverable</span>
						</div>

						<a class="GuideListAnchor" name="share"></a>
						<h4>Share a deliverable to other people</h4>
						<div class="GuideImgBlock">
							<img src="<?php echo Configure::read('root_url').'/widgets/delivery/images/guide/sharing.jpg' ?>" alt="Share a deliverable" />
							<span class="GuideImgCaption">Share a deliverable to other people</span>
						</div>

						<a class="GuideListAnchor" name="delete"></a>
						<h4>Delete a deliverable</h4>
						<div class="GuideImgBlock">
							<img src="<?php echo Configure::read('root_url').'/widgets/delivery/images/guide/delete.jpg' ?>" alt="Delete a deliverable" />
							<span class="GuideImgCaption">Delete a deliverable</span>
						</div>

						<a class="GuideListAnchor" name="complete"></a>
						<h4>Mark a deliverable as completed</h4>
						<div class="GuideImgBlock">
							<img src="<?php echo Configure::read('root_url').'/widgets/delivery/images/guide/complete.jpg' ?>" alt="Mark delvierable as completed" />
							<span class="GuideImgCaption">Mark a deliverable as completed</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<div id="tmpContainer" class="ZWContainer"></div>

<input type="hidden" value="<?php echo $year; ?>" id="selectYear" />
<input type="hidden" value="<?php echo $month; ?>" id="selectMonth" />
<input type="hidden" value="<?php echo $searchCondition; ?>" id="searchCondition" />
<input type="hidden" value="<?php echo count($guide); ?>" id="guide" />