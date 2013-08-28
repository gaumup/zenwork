<?php
	class Stream_follower extends AppModel {
        public $tablePrefix = 'zw_';
		public $name = 'Stream_follower';
		public $belongsTo = array(
            'User' => array(
                'className' => 'User',
                'foreignKey' => 'uid'
            )
        );

        public function getFollowers ($sid) {
            $followers = $this->find('all', array(
                'conditions' => array('Stream_follower.sid' => $sid),
                'fields' => array('User.id', 'User.username', 'User.email', 'User.avatar')
            ));
            $recipients = array();
            foreach ( $followers as $user ) {
                array_push($recipients, array_values($user));
            }
            return $recipients;
        }
	}
?>
