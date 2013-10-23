<?php
    class Stream extends AppModel {
        public $tablePrefix = 'zw_';
        public $name = 'Stream';
        public $actsAs = array('Containable');
        public $hasMany = array(
            'Stream_follower' => array(
                'className' => 'Stream_follower',
                'foreignKey' => 'sid',
                'dependent' => true
            ),
            'Attachment' => array(
                'className' => 'Attachment',
                'foreignKey' => 'sid',
                'dependent' => true
            ),
            'Scomment' => array(
                'className' => 'Scomment',
                'foreignKey' => 'sid',
                'dependent' => true
            ),
            'Stream_log' => array (
                'className' => 'Stream_log',
                'foreignKey' => 'sid',
                'dependent' => true
            ),
            'Timeline' => array(
                'className' => 'Timeline',
                'foreignKey' => 'sid',
                'dependent' => true
            )
        );
        public $belongsTo = array(
            'Creator' => array(
                'className' => 'User',
                'foreignKey' => 'creatorID'
            )
        );
        public $hasAndBelongsToMany = array(
            'Stream_list' => array(
                'className' => 'Stream_list',
                'joinTable' => 'zw_streams_lists_map',
                'with' => 'Stream_list_map',
                'foreignKey' => 'sid',
                'associationForeignKey' => 'lid',
                'unique' => true
            )
        );

        public function search ($keyword='') {
            if ( empty($keyword) ) { return array(); }
            $this->unbindModel(array(
                'hasMany' => array('Stream_follower', 'Attachment', 'Scomment', 'Stream_log', 'Timeline')
            ));
            return $this->find('all', array(
                'conditions' => array('Stream.name LIKE'=>'%'.$keyword.'%'),
                'order' => array('Stream.name ASC')
            ));
        }
        public function getDetails ($sid, $lid=null) {
            //check whether stream has child or not
            $hasChild = $lid == null ? false : $this->hasChild($sid, $lid);

            //get stream
            $this->id = $sid;
            $stream = $this->read();
            $usersTimelineModel = ClassRegistry::init('Users_timeline');
            foreach ( $stream['Timeline'] as $key => $timeline ) {
                $start[$key]  = $timeline['start'];
                $end[$key] = $timeline['end'];
                $stream['Timeline'][$key]['assignee'] = $usersTimelineModel->getUsersTimeline($timeline['id']);
            }
            array_multisort($start, SORT_ASC, $end, SORT_ASC, $stream['Timeline']);

            //get stream logs
            $streamLogModel = ClassRegistry::init('Stream_log');
            $streamLog = $streamLogModel->find('all', array(
                'conditions' => array(
                    'Stream_log.sid' =>  $sid
                ),
                'order' => array('Stream_log.when DESC')
            ));
            
            return array(
                'stream' => $stream,
                'streamLog' => $streamLog,
                'hasChild' => $hasChild
            );
        }
        /*
         * @use
         * Stream
         */
        public function getStreamsHasChild ($lid) {
            return array_values(ClassRegistry::init('Stream_list_map')->find('list', array(
                'conditions' => array(
                    'Stream_list_map.parentID <>' => 0,
                    'Stream_list_map.lid' => $lid
                ),
                'groupBy' => array('Stream_list_map.parentID'),
                'fields' => array('Stream_list_map.parentID')
            )));
        }
        public function hasChild ($sid, $lid) {
            return in_array($sid, $this->getStreamsHasChild($lid));
        }
        public function getUnlistedStreams ($uid) {
            $streams = $this->find('list', array(
                'conditions' => array('Stream.creatorID' => $uid),
                'fields' => array('Stream.id'),
                'order' => array('Stream.id' => 'asc')
            ));

            $streamListMapModel = ClassRegistry::init('Stream_list_map');
            $streamListMap = $streamListMapModel->find('list', array(
                'conditions' => array('Stream_list_map.sid' => $streams),
                'fields' => array('Stream_list_map.sid'),
                'group' => array('Stream_list_map.sid')
            ));

            $unlistedStreams = array();
            foreach ( $streams as $sid ) {
                if ( !in_array($sid, $streamListMap) ) {
                    array_push($unlistedStreams, $sid);
                }
            }

            return $unlistedStreams;
        }

        public function beforeDelete ($cascade=true) {
            $stream = $this->findById($this->id);
            if ( count($stream) == 0 || $stream['Stream']['creatorID'] != $this->Session->read('Auth.User.id') ) {
                return false;
            }

            $streamListMapModel = ClassRegistry::init('Stream_list_map');
            $childStreamsID = $streamListMapModel->find('list', array(
                'conditions' => array('Stream_list_map.parentID' => $this->id),
                'fields' => array('Stream_list_map.sid')
            ));
            $this->deleteAll(array('Stream.id'=>$childStreamsID), true/*cascade*/, true/*run callbacks*/);
            return true;
        }
    }
?>
