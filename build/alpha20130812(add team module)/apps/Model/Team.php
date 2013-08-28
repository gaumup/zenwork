<?php
    class Team extends AppModel {
        public $tablePrefix = 'zw_';
        public $useTable = 'teams';
        public $name = 'Team';
        public $belongsTo = array(
            'Creator' => array(
                'className' => 'User',
                'foreignKey' => 'creatorID'
            )    
        );
        public $hasAndBelongsToMany = array(
            'User' => array(
                'className' => 'User',
                'joinTable' => 'zw_users_teams',
                'foreignKey' => 'tid',
                'associationForeignKey' => 'uid',
                'unique' => true,
                'fields' => 'User.id, User.username, User.email'
            )
        );
        
        public function searchByName ($keyword) {
            $results = $this->find('all', array(
                'conditions' => array('Team.name LIKE'=>'%'.$keyword.'%'),
                'order' => array('Team.name ASC'),
                'fields' => array('Team.id, Team.name')
            ));
            $teams = array();
            foreach ( $results as $team ) {
                $teams[$team['Team']['id']] = $team['Team']['name'];
            }
            return $teams;
        }

        public function searchByUserTeam ($uid, $keyword) {
            $this->bindModel(array(
                'hasOne' => array(
                    'Users_team' => array(
                        'className' => 'Users_team',
                        'foreignKey' => 'tid'
                    )
                )
            ));
            $results = $this->find('all', array(
                'conditions' => array(
                    'Team.name LIKE'=>'%'.$keyword.'%',
                    'OR' => array(
                        'Team.creatorID' => $uid,
                        'Users_team.uid' => $uid
                    )
                ),
                'order' => array('Team.name ASC'),
                'fields' => array('Team.id, Team.name')
            ));
            $lists = array();
            foreach ( $results as $list ) {
                $lists[$list['Team']['id']] = $list['Team']['name'];
            }
            return $lists;
        }

        public function isCreator ($lid, $uid) {
            return $this->find('count', array(
                'conditions' => array('Team.id' => $lid, 'Team.creatorID' => $uid)    
            )) > 0;
        }
    }
?>