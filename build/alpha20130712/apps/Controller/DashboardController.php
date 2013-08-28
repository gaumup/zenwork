<?php
    /* author: KhoaNT
     * date: 08-May-2013
     * email: ukhome@gmail.com
     * current version: 1.0
     * change log: (note important changes)
     * + v1.0: initial
     */
    class DashboardController extends AppController {
    	public $name = 'Dashboard';

        public function index () {
            $this->layout = 'zenwork';
        }

        /** stream
         * arguments: listID
         * return streams via ajax in json format
         */
        public function getTaskList () {
            /* return json
             *    [ //array of 'Stream'
             *        {
             *            'Stream': { //stream info
             *                'id': value,
             *                'completed': value,
             *                'countAttachment': value,
             *                'countComment': value,
             *                'creatorID': value,
             *                'createdOn': value
             *                'description': value,
             *                'name': value,
             *                'streamExtendModel': value
             *            },
             *            'Users_timeline': { //creator of this stream
             *                'completed': value,
             *                'effort': value
             *            },
             *            'Timeline': [ //array of timeline
             *                {
             *                    'start': value,
             *                    'end': value
             *                }, {...}, {...}
             *            ]
             *        }, {...}, {...}
             *    ]
             */
            $this->autoRender = false;
            if ( $this->request->isAjax() ) {
                $postData = $this->request->input('json_decode', true);
                $this->loadModel('Users_timeline');
                $tasks = $this->Users_timeline->getUsersTaskList($this->Auth->User('id'));
                $filter = $this->_filter($tasks, array('today', 'completed'));
                return json_encode(array(
                    'today' => $filter['today'],
                    'all' => $tasks,
                    'completed' => $filter['completed']
                ));
            }
        }
        public function addNewStream () {
            $this->autoRender = false;
            if ( $this->request->isAjax() ) {
                $postData = $this->request->input('json_decode', true);

                $now = new DateTime('NOW');
                $postData['startTime'] = isset($postData['startTime']) ? $postData['startTime'] : time();
                $postData['endTime'] = isset($postData['endTime'])
                    ? $postData['endTime']
                    : mktime(23, 59, 59, date('m', $postData['startTime']), date('d', $postData['startTime']), date('Y', $postData['startTime']));
                $postData['completed'] = 0;
                $postData['parentID'] = isset($postData['parentID']) ? $postData['parentID'] : 0;
                $postData['creatorID'] = $this->Auth->user('id');
                $postData['createdOn'] = $now->getTimestamp();
                $postData['countComment'] = 0;
                $postData['countAttachment'] = 0;

                $this->loadModel('Stream');
                $this->Stream->create();
                if ( $this->Stream->save(array('Stream' => $postData)) ) {
                    $postData['id'] = $this->Stream->getLastInsertId();
                    $this->loadModel('Stream_log');
                    $this->Stream_log->saveStreamLog($postData['id'], 'create this', $this->Auth->user('id'), $postData['createdOn']);

                    //create timeline
                    $start = $now;
                    $this->loadModel('Timeline');
                    $this->Timeline->create();
                    $this->Timeline->save(array(
                        'Timeline' => array(
                            'start' => $start->getTimestamp(),
                            'end' => $start->setTime(23, 59, 59)->getTimestamp(),
                            'completed' => 0,
                            'sid' => $postData['id'],
                            'createdOn' => $now->getTimestamp(),
                            'creatorID' => $this->Auth->user('id')
                        )    
                    ));
                    
                    return json_encode($postData, JSON_NUMERIC_CHECK);
                }
                else {
                    return false;
                }
            }
        }
        public function getStreamDetails ($sid) {
            $this->autoRender = false;
            $details = array();
            if ( $this->request->isAjax() && !empty($sid) ) {
                $loginedUser = $this->Session->read('Auth.User');
                
                $this->loadModel('Stream');
                //get stream
                $this->Stream->id = $sid;
                $stream = $this->Stream->read();
                $this->loadModel('Users_timeline');
                foreach ( $stream['Timeline'] as $key => $timeline ) {
                    $start[$key]  = $timeline['start'];
                    $end[$key] = $timeline['end'];
                    $stream['Timeline'][$key]['assignee'] = $this->Users_timeline->getUsersTimeline($timeline['id']);
                }
                array_multisort($start, SORT_ASC, $end, SORT_ASC, $stream['Timeline']);

                //check edit stream permission
                $isCreator = false;
                if ( $stream['Stream']['creatorID'] == $loginedUser['id'] ) {
                    $isCreator = true;
                }

                //get stream logs
                $this->loadModel('Stream_log');
                $streamLog = $this->Stream_log->find('all', array(
                    'conditions' => array(
                        'Stream_log.sid' =>  $sid
                    ),
                    'order' => array('Stream_log.when DESC')
                ));

                $this->loadModel('Stream_list');
                $streamList = $this->Stream_list->getUsersLists($this->Auth->user('id'));

                $this->set(compact(array('isCreator', 'stream', 'streamLog', 'streamList')));

                $this->layout = 'blank';
                $this->render('stream_details');
                return true;
            }
        }
        public function startWorkingTimeline ($tid) {
            $this->autoRender = false;
            if ( $this->request->isAjax() && !empty($tid) ) {
                $this->loadModel('Users_timeline');
                if ( $this->Users_timeline->updateAll(
                        array(
                            'Users_timeline.completed' => 2
                        ),
                        array(
                            'Users_timeline.uid' => $this->Auth->User('id'),
                            'Users_timeline.tid' => $tid
                        )
                    ) 
                ) {
                    $this->loadModel('Timeline');
                    $timeline = $this->Timeline->find('first', array(
                        'conditions' => array('Timeline.id'=>$tid),
                        'fields' => array('Timeline.start', 'Timeline.end', 'Stream.id'),
                        'contain' => array('Stream', 'User')
                    ));

                    //log
                    $action = 'start working on '.($this->Auth->user('gender') == 1 ? 'her' : 'his').' assigned timeline(from '.date('d-M-Y', $timeline['Timeline']['start']).' to '.date('d-M-Y', $timeline['Timeline']['end']).')';
                    $this->loadModel('Stream_log');
                    $this->Stream_log->saveStreamLog($timeline['Stream']['id'], $action, $this->Auth->user('id'), time());

                    return true;
                }
                return false;
            }
        }
        public function updateTaskCompletion ($tid, $completed, $effort) {
            $this->autoRender = false;
            if ( $this->request->isAjax() && !empty($tid) && isset($completed) && isset($effort) ) {
                $this->loadModel('Users_timeline');
                if ( $this->Users_timeline->updateAll(
                        array(
                            'Users_timeline.completed' => $completed,
                            'Users_timeline.effort' => $effort
                        ),
                        array(
                            'Users_timeline.uid' => $this->Auth->User('id'),
                            'Users_timeline.tid' => $tid
                        )
                    ) 
                ) {
                    $this->loadModel('Timeline');
                    $timeline = $this->Timeline->find('first', array(
                        'conditions' => array('Timeline.id'=>$tid),
                        'fields' => array('Timeline.start', 'Timeline.end', 'Stream.id'),
                        'contain' => array('Stream', 'User')
                    ));

                    //log
                    $action = ($completed == 3 ? 'completed' : 'uncompleted').' '.($this->Auth->user('gender') == 1 ? 'her' : 'his').' assigned timeline(from '.date('d-M-Y', $timeline['Timeline']['start']).' to '.date('d-M-Y', $timeline['Timeline']['end']).')';
                    $this->loadModel('Stream_log');
                    $this->Stream_log->saveStreamLog($timeline['Stream']['id'], $action, $this->Auth->user('id'), time());

                    return true;
                }
                return false;
            }
        }
        public function reassign ($tid, $uid) {
            $this->autoRender = false;
            if ( $this->request->isAjax() && !empty($uid) && !empty($tid) ) {
                $this->loadModel('Users_timeline');
                $existing = $this->Users_timeline->find('first', array(
                    'conditions' => array(
                        'Users_timeline.uid' => $uid,
                        'Users_timeline.tid' => $tid
                    ),
                    'fields' => array('Users_timeline.uid')
                ));
                if ( count($existing) === 0 ) {
                    $currentAssigned = $this->Users_timeline->find('first', array(
                        'conditions' => array(
                            'Users_timeline.uid' => $this->Auth->User('id'),
                            'Users_timeline.tid' => $tid
                        ),
                        'fields' => array('Users_timeline.effort')
                    ));
                    $this->Users_timeline->create();
                    if (
                        $this->Users_timeline->save(array(
                            'Users_timeline' => array(
                                'uid' => $uid,
                                'tid' => $tid,
                                'effort' => $currentAssigned['Users_timeline']['effort']
                            ))
                        )
                    ) {
                        $this->loadModel('Timeline');
                        $timeline = $this->Timeline->find('first', array(
                            'conditions' => array('Timeline.id'=>$tid),
                            'fields' => array('Stream.id'),
                            'contain' => array('Stream', 'User')
                        ));

                        //get assignee information
                        foreach ( $timeline['User'] as $_assignee ) {
                            if ( $_assignee['id'] === $uid ) {
                                $assignee = $_assignee;
                                $assignee['avatar'] = Configure::read('root_url').'/'.(empty($assignee['avatar']) ? 'images/default-avatar.png' : Configure::read('upload_path').'/'.$assignee['avatar']);
                                break;
                            }
                        }

                        //log
                        $this->loadModel('Stream_log');
                        $this->Stream_log->saveStreamLog($timeline['Stream']['id'], 're-assign this to '.$assignee['username'], $this->Auth->user('id'), time());

                        //unassign current logged-in user
                        $this->_unassignUserTimeline($this->Auth->User('id'), $tid);

                        return json_encode(array(
                            'isReassigned' => true,
                            'assignee' => $assignee
                        ), JSON_NUMERIC_CHECK);
                    }
                    else {
                        return false;
                    }
                }
                else {
                    $this->loadModel('User');
                    return json_encode(array(
                        'isReassigned' => false,
                        'assignee' => $this->User->findById($uid, array('User.username'))
                    ), JSON_NUMERIC_CHECK);
                }
            }
        }

        private function _unassignUserTimeline ($uid, $tid) {
            $this->autoRender = false;
            if ( $this->request->isAjax() && !empty($uid) && !empty($tid) ) {
                $this->loadModel('Users_timeline');
                if ( $this->Users_timeline->deleteAll(array(
                        'Users_timeline.uid' => $uid,
                        'Users_timeline.tid' => $tid
                    )) 
                ) {
                    return $uid;
                }
                else {
                    return false;
                }
            }
        }
        private function _filter ($tasks, $by=array()) {
            $filter = array();
            foreach ( $by as $key ) {
                $filter[$key] = array();
            }
            $now = time();
            foreach ( $tasks as $_task ) {
                foreach ( $by as $key ) {
                    if ( $this->_applyFilter($_task, $key, $now) ) {
                        array_push($filter[$key], $_task);
                    }
                }
            }
            return $filter; 
        }
        private function _applyFilter ($item, $filterBy, $synctime) {
            switch ($filterBy) {
                case 'today':
                    return date('Ymd', $item['Timeline']['start']) == date('Ymd', $synctime)
                        || ( $item['Timeline']['start'] < $synctime && $item['Users_timeline']['completed'] < 3 );
                    break;
                case 'completed':
                    return $item['Users_timeline']['completed'] > 3;
                    break;
            }
        }
    }
?>