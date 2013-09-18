<?php
	class Attachment extends AppModel {
        public $tablePrefix = 'zw_';
		public $name = 'Attachment';
        public $belongsTo = array(
            'User' => array(
                'className' => 'User',
                'foreignKey' => 'uploader'
            )
        );

        public function beforeDelete ($cascade = true) {
            $attchment = $this->read();
            $file = new File(
                Configure::read('upload_path').'/'.$attchment['Attachment']['filename'],
                true,
                0777
            );
            $file->delete();
            return true;
        }
    }
?>