<?php
    class Users_timeline extends AppModel {
        public $tablePrefix = 'zw_';
        public $name = 'Users_timeline';
        public $actsAs = array('Containable');
        public $belongsTo = array(
            'User' => array(
                'className' => 'User',
                'foreignKey' => 'uid'
            ),
            'Timeline' => array(
                'className' => 'Timeline',
                'foreignKey' => 'tid'
            )
        );

        public function getUsersTimeline ($tid) {
            return $this->find('all', array(
                'conditions' => array('Users_timeline.tid' => $tid),
                'fields' => array('User.id, User.username, User.email, User.avatar, Users_timeline.effort, Users_timeline.completed'),
                'order' => array('User.username')
            ));
        }

        public function getUserTaskList ($uid, $timeBounce=array()) {
            $joins = array(
                array(
                    'table' => 'zw_timelines',
                    'alias' => 'Timeline',
                    'type' => 'INNER',
                    'conditions' => array(
                        'Users_timeline.tid = Timeline.id',
                    )
                ),
                array(
                    'table' => 'zw_streams',
                    'alias' => 'Stream',
                    'type' => 'INNER',
                    'conditions' => array(
                        'Stream.id = Timeline.sid',
                    )
                ),
                array(
                    'table' => 'zw_streams_lists_map',
                    'alias' => 'Stream_list_map',
                    'type' => 'INNER',
                    'conditions' => array(
                        'Stream.id = Stream_list_map.sid',
                    )
                )
            );
            $this->unbindModel(array('belongsTo'=>array('User', 'Timeline')));
            $conditions = array(
                'Users_timeline.uid' => $uid
            );
            if ( !empty($timeBounce) ) {
                $conditions = array_merge($conditions, array(
                    'Timeline.start >=' => $timeBounce[0],   
                    'Timeline.end <=' => $timeBounce[1]      
                ));
            }
            $tasklist = $this->find('all', array(
                'conditions' => $conditions,
                'joins' => $joins,
                'fields' => array('Stream.*', 'Timeline.start', 'Timeline.end', 'Timeline.effort', 'Users_timeline.completed', 'Users_timeline.id', 'Users_timeline.effort', 'Stream_list_map.*'),
                'order' => array('Users_timeline.completed asc', 'Timeline.start asc')
            ));
            foreach ( $tasklist as $key => $_task ) {
                $tasklist[$key]['Stream']['slmid'] = $_task['Stream_list_map']['id'];
                $tasklist[$key]['Stream']['countComment'] = Classregistry::init('Scomment')->find('count', array('conditions'=>array('Scomment.sid'=>$_task['Stream']['id'])));
                $tasklist[$key]['Stream']['countAttachment'] = Classregistry::init('Attachment')->find('count', array('conditions'=>array('Attachment.sid'=>$_task['Stream']['id'])));
            }
            return $tasklist;
        }

        public function getUsersFollowedTaskList ($uid, $timeBounce=array()) {
            $joins = array(
                array(
                    'table' => 'zw_timelines',
                    'alias' => 'Timeline',
                    'type' => 'INNER',
                    'conditions' => array(
                        'Users_timeline.tid = Timeline.id',
                    )
                ),
                array(
                    'table' => 'zw_streams',
                    'alias' => 'Stream',
                    'type' => 'INNER',
                    'conditions' => array(
                        'Stream.id = Timeline.sid',
                    )
                ),
                array(
                    'table' => 'zw_stream_followers',
                    'alias' => 'Stream_follower',
                    'type' => 'INNER',
                    'conditions' => array(
                        'Stream.id = Stream_follower.sid',
                    )
                ),
                array(
                    'table' => 'zw_streams_lists_map',
                    'alias' => 'Stream_list_map',
                    'type' => 'INNER',
                    'conditions' => array(
                        'Stream.id = Stream_list_map.sid',
                    )
                )
            );
            $this->unbindModel(array('belongsTo'=>array('User', 'Timeline')));
            $tasklist = $this->find('all', array(
                'conditions' => array('Stream_follower.uid'=>$uid),
                'joins' => $joins,
                'fields' => array('Stream.*', 'Timeline.start', 'Timeline.end', 'Timeline.effort', 'Users_timeline.completed', 'Users_timeline.id', 'Users_timeline.effort', 'Stream_list_map.*'),
                'order' => array('Users_timeline.completed asc', 'Timeline.start asc')
            ));
            $now = time();
            foreach ( $tasklist as &$_task ) {
                if ( $_task['Timeline']['end'] < $now ) {
                    $_task['Stream']['overdue'] = 1;
                }
                else {
                    $_task['Stream']['overdue'] = 0;
                }
                $_task['Stream']['slmid'] = $_task['Stream_list_map']['id'];
                $_task['Stream']['countComment'] = Classregistry::init('Scomment')->find('count', array('conditions'=>array('Scomment.sid'=>$_task['Stream']['id'])));
                $_task['Stream']['countAttachment'] = Classregistry::init('Attachment')->find('count', array('conditions'=>array('Attachment.sid'=>$_task['Stream']['id'])));
            }
            return $tasklist;
        }
    }
?>
