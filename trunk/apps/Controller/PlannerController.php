<?php
    App::uses('CakeEmail', 'Network/Email');

    class PlannerController extends AppController {
        public $components = array('RequestHandler');
        public $uses = array('Stream', 'Timeline');

        //public method
        public function beforeFilter () {
            parent::beforeFilter();

            $params = $this->request->params['pass'];
            switch ( $this->action ) {
                case 'getData':
                    break;
                case 'addNewStream':
                    break;
                case 'deleteStream':
                    break;
                case 'addNewTimeline':
                    break;
                case 'deleteTimeline':
                    break;
                case 'assignUserTimeline':
                    break;
                case 'unassignUserTimeline':
                    break;
                case 'cud':
                    break;
            }
        }

        public function index () {
            $this->layout = 'zenwork';
            $this->loadModel('Stream_list');
            $this->set('streamList', $this->Stream_list->getUsersLists($this->Auth->user('id')));

            $this->loadModel('Help');
            $this->set('myHelp', $this->Help->getUserHelp($this->Auth->user('id'), $this->params['controller']));

            $this->set('defaultPlanID', $this->Auth->user('defaultPlanID'));

            if ( isset($this->request->query['sid']) ) {
                $this->loadModel('Stream_list_map');
                list($lid) = array_values($this->Stream_list_map->find('list', array(
                    'conditions' => array('Stream_list_map.sid' => $this->request->query['sid']),
                    'fields' => array('Stream_list_map.lid')
                )));
                $this->redirect(Configure::read('root_url').'/planner#!'.$lid.'?sid='.$this->request->query['sid']);
            }
        }

        /** stream
         * arguments: listID
         * return streams via ajax in json format
         */
        public function getData ($listID=0) {
            /* return json
             *    [ //array of 'Stream'
             *        {
             *            'Stream': { //stream info
             *                'id': value,
             *                'name': value,
             *                'startTime': value,
             *                'endTime': value,
             *                'completed': value,
             *                'parentID': value,
             *                'listID': value,
             *                'creatorID': value,
             *                'description': value,
             *                'createdOn': value
             *                'streamExtendModel': value,
             *                'countComment': value,
             *                'countAttachment': value
             *            },
             *            'User': { //creator of this stream
             *                'username': value,
             *                'email': value,
             *                'avatar': value
             *            },
             *            'Timeline': [ //array of timeline
             *                {
             *                    'id': value,
             *                    'start': value,
             *                    'end': value,
             *                    'aStart': value,
             *                    'aEnd': value,
             *                    'completed': value,
             *                    'sid': value
             *                    'createdOn': value
             *                    'creatorID': value
             *                }, {...}, {...}
             *            ]
             *        }, {...}, {...}
             *    ]
             */
            $this->autoRender = false;
            if ( $this->request->isAjax() ) {
                $this->loadModel('Stream_list');
                if ( !$this->Stream_list->exists($listID) ) {
                    return 404;
                }

                $this->_validateTree($listID); //warning: performance

                //get streams
                $postData = $this->request->input('json_decode', true);

                if ( $listID == 1 ) {
                    $streams = $this->Stream_list->getStreams($listID, $this->Auth->user('id'));
                }
                else {
                    $streams = $this->Stream_list->getStreams($listID);
                }

                //load relationship table
                $this->loadModel('Timeline_dependancy');
                $timelineDependancies = $this->Timeline_dependancy->find('all', array(
                    'conditions' => array('Timeline_dependancy.scopeID' => $listID)
                ));

                //get timeline range
                $timeline = array();
                foreach ( $streams as $_stream ) {
                    foreach ( $_stream['Timeline'] as $_timeline ) {
                        array_push($timeline, $_timeline['start']);
                        array_push($timeline, $_timeline['end']);
                    }
                }

                $this->Session->write('Auth.User.activeListID', $listID);

                return json_encode(array(
                    'timeRange' => empty($timeline) ? array() : array(min($timeline), max($timeline)),
                    'streams' => $streams,
                    'relationship' => $timelineDependancies
                ));
            }
            return 404;
        }
        /**
         * received: client send post data = {
         *     name
         *     startTime
         *     endTime
         *     parentID
         *     listID
         *     streamExtendModel
         * }
         * return: server return if success = { json
         *     id
         *     name
         *     startTime
         *     endTime
         *     completed
         *     parentID
         *     creatorID
         *     createdOn
         * } else if false = 0;
         */
        public function addNewStream () {
            $this->autoRender = false;
            if ( $this->request->isAjax() ) {
                $postData = $this->request->input('json_decode', true);

                $this->loadModel('Stream_list');
                if ( !$this->Stream_list->exists($postData['listID']) ) {
                    return false;
                }

                $this->loadModel('Stream_list_map');
                $postData['startTime'] = isset($postData['startTime']) ? $postData['startTime'] : time();
                $postData['endTime'] = isset($postData['endTime'])
                    ? $postData['endTime']
                    : mktime(23, 59, 59, date('m', $postData['startTime']), date('d', $postData['startTime']), date('Y', $postData['startTime']));
                $postData['completed'] = 0;
                $postData['parentID'] = isset($postData['parentID']) ? $postData['parentID'] : 0;
                $postData['creatorID'] = $this->Auth->user('id');
                $postData['createdOn'] = time();
                $postData['description'] = isset($postData['description']) ? $postData['description'] : '';
                $postData['offset'] = isset($postData['offset']) ? $postData['offset'] : 0;

                $streamPostData = array(
                    'name' => $postData['name'],
                    'completed' => $postData['completed'],
                    'creatorID' => $postData['creatorID'],
                    'description' => $postData['description'],
                    'createdOn' => $postData['createdOn'],
                    'streamExtendModel' => $postData['streamExtendModel']
                );
                $this->Stream->create();
                if ( $this->Stream->save(array('Stream' => $streamPostData)) ) {
                    $postData['id'] = $this->Stream->getLastInsertId();

                    //add entry to 'Stream_list_map'
                    $this->Stream_list_map->create();
                    $this->Stream_list_map->save(array(
                        'Stream_list_map' => array(
                            'sid' => $postData['id'],
                            'lid' => $postData['listID'],
                            'parentID' => $postData['parentID'],
                            'offset' => $postData['offset']
                        )
                    ));
                    $postData['slmid'] = $this->Stream_list_map->getLastInsertId();
                    $postData['tag'] = '';

                    $this->loadModel('Stream_log');
                    $this->Stream_log->saveStreamLog($postData['id'], 'create this', $this->Auth->user('id'), $postData['createdOn']);
                    return json_encode($postData);
                }
                else {
                    return false;
                }
            }
        }
        public function getStreamDetails ($sid, $lid=null) {
            $this->autoRender = false;
            $details = array();
            if ( $this->request->isAjax() && !empty($sid) ) {
                $this->loadModel('Stream');
                if ( !$this->Stream->exists($sid) ) {
                    return 404;
                }

                $streamDetails = $this->Stream->getDetails($sid, $lid);

                //check edit stream permission
                $streamDetails['isCreator'] = false;
                if ( $streamDetails['stream']['Stream']['creatorID'] == $this->Auth->user('id') ) {
                    $streamDetails['isCreator'] = true;
                }

                $this->set($streamDetails);
                $this->layout = 'blank';
                $this->render('stream_details');
                return true;
            }
        }
        public function deleteStream () {
            $this->autoRender = false;
            $isSuccess = false;
            $message = 'Unknown';
            if ( $this->request->isAjax() ) {
                $postData = $this->request->input('json_decode', true);
                if ( !isset($postData['sids']) || empty($postData['sids']) ) {
                    $message = 'No stream to delete';
                }
                else {
                    foreach ( $postData['sids'] as $sid ) {
                        $this->Stream->delete(array('Stream.id' => $sid), true);
                    }
                    $isSuccess = true;
                    $message = 'Stream have been deleted!';
                }
            }
            return json_encode(array('success'=>$isSuccess, 'message'=>$message));
        }
        public function filterStreamList ($lid) {
            $this->autoRender = false;
            if ( $this->request->isAjax() ) {
                if ( $lid == 1 ) {
                    $this->render('forbidden');
                    return false;
                }

                $postData = $this->request->input('json_decode', true);

                $this->loadModel('Stream_list');
                $this->Stream_list->id = $lid;
                $this->set('list', $this->Stream_list->read());

                $this->loadModel('Users_list');
                $this->Users_list->bindModel(array(
                    'belongsTo' => array(
                        'User' => array(
                            'className' => 'User',
                            'foreignKey' => 'uid'
                        )
                    )
                ));
                $this->set('usersList', $this->Users_list->find('all', array(
                    'conditions' => array('Users_list.lid'=>$lid),
                    'fields' => array('User.id, User.username, User.email, User.avatar')
                )));

                $this->set(compact('lid', 'postData'));
                $this->render('filter_stream_list');
            }
        }

        public function setDefaultPlan ($lid) {
            $this->autoRender = false;
            if ( $this->request->isAjax() ) {
                //need to be validated list ID before saving: user joined list or not? list id exists or not?
                $this->loadModel('User');
                $this->User->id = $this->Auth->user('id');
                if ( $this->User->save(array(
                    'User' => array(
                        'defaultPlanID' => $lid
                    )
                )) ) {
                     $this->Session->write('Auth.User.defaultPlanID', $lid);
                    return true;
                }
            }
        }

        private function _validateTree ($lid) {
            $this->loadModel('Stream_list_map');
            $this->Stream_list_map->fix($lid);
        }
        /*
         * send user here if they do not have permission on specific action
         */
        private function _forbidden () {
            print_r(403);
            exit;
        }
    }
?>