<?php
    $this->Css->add('/css/iframe-file-upload.css');
    $this->Html->script('/lib/js/jquery-core.js', false);
    $this->Html->script('/js/iframe-file-upload.js', false);
?>
<form id="upload_avatar" name="upload_avatar" method="post" action="" enctype="multipart/form-data">
    <input type="file" name="data[User][avatar]" id="input_upload_avatar" class="InputFileUpload" />
</form>
<?php
    if ( isset($upload_filename) ) {
        echo '<input id="upload_path" type="hidden" value="'.$upload_path.'" />';
        echo '<input id="upload_filename" type="hidden" value="'.$upload_filename.'" />';
    }
    if ( isset($error) && isset($error['avatar']) ) {
        echo '<input id="error" type="hidden" value="'.$error['avatar'][0].'" />';
    }
?>