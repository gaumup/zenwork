<div class="ContentContainer">
<h2><?php echo __d('cake_dev', 'Unexpected Parameter'); ?></h2>
<div class="CommonBlockWrapper">
<div class="CommonBlock">
<p class="error">
	The action <strong>&quot;<?php echo $this->request->action; ?>&quot;</strong> expected <?php echo $expected; ?> parameter(s)
</p>
<br />

<?php echo $this->element('exception_stack_trace'); ?>
</div>
</div>
</div>