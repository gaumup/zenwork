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
            return $this->find('list', array(
                'conditions' => array('Team.name LIKE'=>'%'.$keyword.'%'),
                'order' => array('Team.name ASC'),
                'fields' => array('Team.name')
            ));
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
            $teams = $this->find('all', array(
                'conditions' => array(
                    'Team.name LIKE'=>'%'.$keyword.'%',
                    'OR' => array(
                        'Team.creatorID' => $uid,
                        'Users_team.uid' => $uid
                    )
                ),
                'order' => array('Team.name ASC'),
                'fields' => array('Team.id', 'Team.name'),
                'group' => array('Team.id')
            ));
            $results = array();
            foreach ( $teams as $_team ) {
                array_push($results, array(
                    'value' => $_team['Team']['id'],
                    'label' => $_team['Team']['name']
                ));
            }
            return $results;
        }

        public function isCreator ($tid, $uid) {
            return $this->find('count', array(
                'conditions' => array('Team.id' => $tid, 'Team.creatorID' => $uid)    
            )) > 0;
        }
    }
?>