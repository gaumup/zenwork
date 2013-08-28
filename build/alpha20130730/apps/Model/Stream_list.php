<?php
    class Stream_list extends AppModel {
        public $tablePrefix = 'zw_';
        public $useTable = 'lists';
        public $name = 'Stream_list';
        public $belongsTo = array(
            'Creator' => array(
                'className' => 'User',
                'foreignKey' => 'creatorID'
            )    
        );
        public $hasAndBelongsToMany = array(
            'User' => array(
                'className' => 'User',
                'joinTable' => 'zw_users_lists',
                'foreignKey' => 'lid',
                'associationForeignKey' => 'uid',
                'unique' => true,
                'fields' => 'User.id, User.username, User.email'
            )
        );
        
        public function getStreams ($lid, $uid=0) {
            $streamModel = ClassRegistry::init('Stream');
            $streamListMapModel = ClassRegistry::init('Stream_list_map');

            if ( $lid == 1 && $uid != 0 ) {
                $cond = array(
                    'Stream.creatorID' => $uid
                );
            }

            $streamIDs = $streamListMapModel->find('list', array(
                'conditions' => array('Stream_list_map.lid'=>$lid),
                'fields' => array('Stream_list_map.sid')
            ));
            $cond['Stream.id'] = $streamIDs;
            
            $streamModel->bindModel(array(
                'hasOne' => array(
                    'Stream_list_map' => array(
                        'className' => 'Stream_list_map',
                        'foreignKey' => 'sid',
                        'conditions' => array('Stream_list_map.lid' => $lid),
                        'fields' => array('Stream_list_map.parentID')
                    )
                )
            ));
            $streams = $streamModel->find('all', array(
                'conditions' => $cond,
                'fields' => array('Stream.*'),
                'contain' => array(
                    'Timeline' => array(
                        'User' => array(
                            'fields' => array('User.id', 'User.username', 'User.email', 'User.avatar'),
                            'order' => array('User.username' => 'asc')
                        )
                    ),
                    'Creator' => array(
                        'fields' => array('Creator.id', 'Creator.username', 'Creator.email', 'Creator.avatar')
                    ),
                    'Attachment.id',
                    'Scomment.id',
                    'Stream_list_map' => array(
                        'fields' => array('Stream_list_map.id', 'Stream_list_map.left', 'Stream_list_map.parentID')
                    )
                ),
                'order' => array('Stream_list_map.left')
            ));
            
            $counter = 0;
            foreach ( $streams as $key => $_stream) {
                $streams[$key]['Stream']['index'] = ++$counter;
                $streams[$key]['Stream']['slmid'] = $_stream['Stream_list_map']['id'];
                $streams[$key]['Stream']['parentID'] = $_stream['Stream_list_map']['parentID'];
            }
            return $streams;
        }
        
        public function getUsersLists ($uid) {
            $this->bindModel(array(
                'hasOne' => array(
                    'Users_list' => array(
                        'className' => 'Users_list',
                        'foreignKey' => 'lid'
                    )
                )
            ));
            return $this->find('all', array(
                'conditions' => array(
                    'OR' => array(
                        'Stream_list.creatorID' => $uid,
                        'Users_list.uid' => $uid
                    )
                ),
                'order' => array('Stream_list.name'),
                'group' => array('Stream_list.id')
            ));
        }

        public function searchByName ($keyword) {
            $results = $this->find('all', array(
                'conditions' => array('Stream_list.name LIKE'=>'%'.$keyword.'%'),
                'order' => array('Stream_list.name ASC'),
                'fields' => array('Stream_list.id, Stream_list.name')
            ));
            $lists = array();
            foreach ( $results as $list ) {
                $lists[$list['Stream_list']['id']] = $list['Stream_list']['name'];
            }
            return $lists;
        }

        public function searchByUserList ($uid, $keyword) {
            $this->bindModel(array(
                'hasOne' => array(
                    'Users_list' => array(
                        'className' => 'Users_list',
                        'foreignKey' => 'lid'
                    )
                )
            ));
            $results = $this->find('all', array(
                'conditions' => array(
                    'Stream_list.name LIKE'=>'%'.$keyword.'%',
                    'OR' => array(
                        'Stream_list.creatorID' => $uid,
                        'Users_list.uid' => $uid
                    )
                ),
                'order' => array('Stream_list.name ASC'),
                'fields' => array('Stream_list.id, Stream_list.name')
            ));
            $lists = array();
            foreach ( $results as $list ) {
                $lists[$list['Stream_list']['id']] = $list['Stream_list']['name'];
            }
            return $lists;
        }

        public function clear ($lid, $uid=0) {
            $streamListMapModel = ClassRegistry::init('Stream_list_map');
            $streamsListID = $streamListMapModel->find('list', array(
                'conditions' => array('Stream_list_map.lid'=>$lid),
                'fields' => array('Stream_list_map.sid'),
                'group' => array('Stream_list_map.sid')
            ));
            $cond = array(
                'Stream.id' => $streamsListID   
            );
            if ( $lid == 1 && $uid != 0 ) {
                $cond['Stream.creatorID'] = $uid;
            }
            return ClassRegistry::init('Stream')->deleteAll($cond, true);
        }

        public function isCreator ($lid, $uid) {
            return $this->find('count', array(
                'conditions' => array('Stream_list.id' => $lid, 'Stream_list.creatorID' => $uid)    
            )) > 0;
        }

        //callbacks
        public function afterDelete ($options=array()) {
            ClassRegistry::init('Stream_list_map')->deleteAll(array(
                'Stream_list_map.lid' => $this->id    
            ));
            return true;
        }
    }
?>