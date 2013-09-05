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

            //get default team
            if ( !$this->Session->check('Auth.User.defaultTeamID') ) {
                $this->loadModel('User');
                list($defaultTeamID) = array_values($this->User->find('list', array(
                    'conditions' => array('User.id' => $this->Session->read('Auth.User.id')),
                    'fields' => array('User.defaultTeamID'),
                    'limit' => 1
                )));
            }
            else {
                $defaultTeamID = $this->Session->read('Auth.User.defaultTeamID');
            }
            $this->set(compact('defaultTeamID'));
            if ( isset($defaultTeamID) ) {
                $this->loadModel('Team');
                $defaultTeam = $this->Team->find('list', array(
                    'conditions' => array('Team.id' => $defaultTeamID),
                    'fields' => array('Team.name'),
                    'limit' => 1
                ));
                $this->set('defaultTeamName', count($defaultTeam) > 0 ? $defaultTeam[$defaultTeamID] : '');
            }


            $this->loadModel('Help');
            $this->set('myHelp', $this->Help->getUserHelp($this->Auth->user('id'), $this->params['controller']));
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
                $tasks = $this->Users_timeline->getUserTaskList($this->Auth->User('id'));
                $filter = $this->_filter($tasks, array('today', 'completed', 'todayCompleted'));

                //TODO: get my created task which not assign to anybody or move into any plan
                $this->loadModel('Stream');
                $this->Stream->find('all', array(
                    'conditions' => array('Stream.creatorID' => $this->Auth->user('id'))
                ));

                return json_encode(array(
                    'today' => $filter['today'],
                    'all' => $tasks,
                    'completed' => $filter['completed'],
                    'todayCompleted' => $filter['todayCompleted']
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

                    //add entry to 'Stream_list_map'
                    $this->loadModel('Stream_list_map');
                    $this->Stream_list_map->create();
                    $this->Stream_list_map->save(array(
                        'Stream_list_map' => array(
                            'sid' => $postData['id'],
                            'lid' => 1
                        )
                    ));
                    $postData['slmid'] = $this->Stream_list_map->getLastInsertId();

                    $this->loadModel('Stream_log');
                    $this->Stream_log->saveStreamLog($postData['id'], 'create this', $this->Auth->user('id'), $postData['createdOn']);

                    //create timeline
                    $start = $now;
                    $end = clone $start;
                    $end = $end->setTime(23, 59, 59)->getTimestamp();
                    $this->loadModel('Timeline');
                    $this->Timeline->create();
                    $this->Timeline->save(array(
                        'Timeline' => array(
                            'start' => $start->getTimestamp(),
                            'end' => $end,
                            'effort' => round(($end+1 - $start->getTimestamp())/86400, 2),
                            'completed' => 0,
                            'sid' => $postData['id'],
                            'createdOn' => $now->getTimestamp(),
                            'creatorID' => $this->Auth->user('id')
                        )    
                    ));
                    
                    return json_encode($postData);
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
                $this->loadModel('Stream');
                if ( !$this->Stream->exists($sid) ) {
                    return 404;
                }

                $loginedUser = $this->Session->read('Auth.User');
                
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
                $this->loadModel('Timeline');
                if ( !$this->Timeline->exists($tid) ) {
                    return 404;
                }

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
                    $timeline = $this->Timeline->find('first', array(
                        'conditions' => array('Timeline.id'=>$tid),
                        'fields' => array('Timeline.start', 'Timeline.end', 'Stream.id', 'Stream.name', 'Stream.creatorID'),
                        'contain' => array('Stream', 'User')
                    ));

                    $this->loadModel('User');
                    $creator = $this->User->findById($timeline['Stream']['creatorID'], array('User.username', 'User.email'));

                    //send email notification to creator
                    $this->notify(
                        $this->Auth->User('username').' start working on task "'.$timeline['Stream']['name'].'"',
                        'start working on task "'.($timeline['Stream']['name']).'". Timeline from "'.date('d-M-Y', $timeline['Timeline']['start']).'" to "'.date('d-M-Y', $timeline['Timeline']['end']).'"',
                        '',
                        '',
                        $creator['User']['email']
                    );

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
                $this->loadModel('Timeline');
                if ( !$this->Timeline->exists($tid) ) {
                    return 404;
                }

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
                    $timeline = $this->Timeline->find('first', array(
                        'conditions' => array('Timeline.id'=>$tid),
                        'fields' => array('Timeline.start', 'Timeline.end', 'Stream.id', 'Stream.name', 'Stream.creatorID'),
                        'contain' => array('Stream', 'User')
                    ));

                    $this->loadModel('User');
                    $creator = $this->User->findById($timeline['Stream']['creatorID'], array('User.username', 'User.email'));

                    $this->loadModel('Stream_list_map');
                    list($lid) = array_values($this->Stream_list_map->find('list', array(
                        'conditions' => array('Stream_list_map.sid' => $timeline['Stream']['id']),
                        'limit' => 1
                    )));

                    //send email notification to creator
                    $this->notify(
                        $this->Auth->User('username').' '.($completed == 3 ? 'completed' : 'uncompleted').' task "'.$timeline['Stream']['name'].'"',
                        ($completed == 3 ? 'completed' : 'uncompleted').' task "'.($timeline['Stream']['name']).'". Timeline from "'.date('d-M-Y', $timeline['Timeline']['start']).'" to "'.date('d-M-Y', $timeline['Timeline']['end']).'"'.($completed == 3 ? ' with effort '.$effort.' days' : ''),
                        '',
                        Configure::read('root_url').'/planner#!'.$lid.'?sid='.$timeline['Stream']['id'],
                        $creator['User']['email']
                    );

                    //log
                    $action = ($completed == 3 ? 'completed' : 'uncompleted').' '.($this->Auth->user('gender') == 1 ? 'her' : 'his').' assigned timeline(from '.date('d-M-Y', $timeline['Timeline']['start']).' to '.date('d-M-Y', $timeline['Timeline']['end']).')';
                    $this->loadModel('Stream_log');
                    $this->Stream_log->saveStreamLog($timeline['Stream']['id'], $action, $this->Auth->user('id'), time());

                    return $effort;
                }
                return false;
            }
        }
        public function reassign ($tid, $uid) {
            $this->autoRender = false;
            if ( $this->request->isAjax() && !empty($uid) && !empty($tid) ) {
                $this->loadModel('Timeline');
                if ( !$this->Timeline->exists($tid) ) {
                    return 404;
                }

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
                            'fields' => array('Stream.id', 'Stream.name'),
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

                        $this->loadModel('Stream_list_map');
                        list($lid) = array_values($this->Stream_list_map->find('list', array(
                            'conditions' => array('Stream_list_map.sid' => $timeline['Stream']['id']),
                            'limit' => 1
                        )));

                        //send mail to user
                        /*------  Begin Send mail -------------*/
                        $email = new CakeEmail(Configure::read('email_config'));
                        $email->to($assignee['email']);
                        $email->replyTo($this->Auth->User('email'));
                        $email->subject('Assign a new task');
                        //use template in '//View/Emails' with layout in '//View/Layouts/Emails'
                        $email->template('assign_notify', 'default');
                        $email->viewVars(array(
                            'stream' => $timeline['Stream'],
                            'assigner' => $this->Auth->User('username'),
                            'url' => Configure::read('root_url').'/planner#!'.$lid.'?sid='.$timeline['Stream']['id']
                        ));
                        $email->delivery = 'smtp';
                        $email->send();
                        /*------  End Send mail -------------*/

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
        public function getFollowedTaskList () {
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
                $this->loadModel('Users_timeline');
                return json_encode($this->Users_timeline->getUsersFollowedTaskList($this->Auth->User('id')));
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
        private function _applyFilter ($item, $filterBy, $time) {
            switch ($filterBy) {
                case 'today':
                    return date('Ymd', $item['Timeline']['start']) == date('Ymd', $time)
                        || ( $item['Timeline']['start'] < $time && $item['Users_timeline']['completed'] < 3 );
                    break;
                case 'todayCompleted':
                    return date('Ymd', $item['Timeline']['start']) == date('Ymd', $time)
                        && $item['Users_timeline']['completed'] >= 3;
                    break;
                case 'completed':
                    return $item['Users_timeline']['completed'] >= 3;
                    break;
            }
        }
    }
?>