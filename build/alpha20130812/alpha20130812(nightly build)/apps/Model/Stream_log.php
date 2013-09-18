<?php
	class Stream_log extends AppModel {
        public $tablePrefix = 'zw_';
		public $name = 'Stream_log';
		public $belongsTo = array(
            'User' => array(
                'className' => 'User',
                'foreignKey' => 'uid'
            )
        );
		public function saveStreamLog ($sid, $action, $uid, $time=null) {
			$tmpLog = array (
				'Stream_log' => array (
					'sid' => $sid,
					'uid' => $uid,
					'action' => $action,
					'when' => is_null($time) ? time() : $time
				)
			);
			$this->create();
			$this->save($tmpLog);
		}

        public function beforeSave ($options=array()) {
            if ( !isset($this->data['Stream_log']['when']) ) {
                $this->data['Stream_log']['when'] = time();
            }
            return true;
        }
	}
?>
