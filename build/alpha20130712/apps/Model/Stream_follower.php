<?php
	class Stream_follower extends AppModel {
        public $tablePrefix = 'zw_';
		public $name = 'Stream_follower';
		public $belongsTo = array(
            'User' => array(
                'className' => 'User',
                'foreignKey' => 'user_id'
            )
        );

        public function getFollowers ($sid) {
            $followers = $this->find('all', array(
                'conditions' => array('Stream_follower.stream_id' => $sid),
                'fields' => array('User.email')
            ));
            $recipients = array();
            foreach ( $followers as $user ) {
                array_push($recipients, $user['User']['email']);
            }
            return $recipients;
        }
	}
?>
