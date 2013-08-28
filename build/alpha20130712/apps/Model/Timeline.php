<?php
    class Timeline extends AppModel {
        public $tablePrefix = 'zw_';
        public $name = 'Timeline';
        public $actsAs = array('Containable');
        public $belongsTo = array(
            'Stream' => array(
                'className' => 'Stream',
                'foreignKey' => 'sid'
            )
        );
        public $hasAndBelongsToMany = array(
            'User' => array(
                'className' => 'User',
                'joinTable' => 'zw_users_timelines',
                'with' => 'Users_timeline',
                'foreignKey' => 'tid',
                'associationForeignKey' => 'uid',
                'unique' => true,
                'fields' => 'User.id, User.username, User.email, User.avatar, User.gender'
            )
        );

        public function afterDelete () {
            ClassRegistry::init('Timeline_dependancy')->deleteAll(array(
                'OR' => array(
                    'Timeline_dependancy.tID1' => $this->id,
                    'Timeline_dependancy.tID2' => $this->id
                )
            ));
        }
    }
?>
