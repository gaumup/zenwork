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
            return $this->find('all', array(
                'conditions' => array('Stream_follower.sid' => $sid),
                'fields' => array('User.id', 'User.username', 'User.email', 'User.avatar')
            ));
        }

        public function getFollowersEmail ($sid) {
            $followers = array();
            foreach ( $this->getFollowers($sid) as $_follower ) {
                array_push($followers, $_follower['User']['email']);
            }
            return $followers;
        }
	}
?>
