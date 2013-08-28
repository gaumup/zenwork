<?php
    App::uses('CakeEmail', 'Network/Email');

    class PlannerController extends AppController {
        public $components = array('RequestHandler');
        public $uses = array('Stream', 'Timeline');

        //public method
        public function beforeFilter () {
            parent::beforeFilter();

            $params = $this->request->params['pass'];
            /*
            switch ( $this->action ) {
                case 'getData':
                    if ( strtolower($this->Auth->user('username')) !== 'khoant'
                        && strtolower($this->Auth->user('username')) !== 'vunbpp'
                        && strtolower($this->Auth->user('username')) !== 'quannd'
                    ) {
                        //check permission
                        $this->_forbidden();
                    }
                    break;
                case 'addNewStream':
                    if ( strtolower($this->Auth->user('username')) !== 'khoant' ) {
                        //check permission
                        $this->_forbidden();
                    }
                    break;
                case 'deleteStream':
                    if ( strtolower($this->Auth->user('username')) !== 'khoant' ) {
                        //check permission
                        $this->_forbidden();
                    }
                    break;
                case 'addNewTimeline':
                    if ( strtolower($this->Auth->user('username')) !== 'khoant' ) {
                        //check permission
                        $this->_forbidden();
                    }
                    break;
                case 'deleteTimeline':
                    if ( strtolower($this->Auth->user('username')) !== 'khoant' ) {
                        //check permission
                        $this->_forbidden();
                    }
                    break;
                case 'assignUserTimeline':
                    if ( strtolower($this->Auth->user('username')) !== 'khoant' ) {
                        //check permission
                        $this->_forbidden();
                    }
                    break;
                case 'unassignUserTimeline':
                    if ( strtolower($this->Auth->user('username')) !== 'khoant' ) {
                        //check permission
                        $this->_forbidden();
                    }
                    break;
                case 'cud':
                    if ( strtolower($this->Auth->user('username')) !== 'khoant' ) {
                        //check permission
                        $this->_forbidden();
                    }
                    break;
            }
            */
        }

        public function index () {
            $this->layout = 'zenwork';
            $this->loadModel('Stream_list');
            $this->set('streamList', $this->Stream_list->getUsersLists($this->Auth->user('id')));
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

                //get streams
                $postData = $this->request->input('json_decode', true);
                
                $this->loadModel('Stream_list');
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
         *     index
         *     name
         *     startTime
         *     endTime
         *     parentID
         *     listID
         *     streamExtendModel
         * }
         * return: server return if success = { json
         *     id
         *     index
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
                $this->loadModel('Stream_list_map');
                $isIndexExist = $this->Stream_list_map->find('count', array(
                    'conditions' => array(
                        'Stream_list_map.index' => $postData['index'],
                        'Stream_list_map.lid' => $postData['listID']
                    )    
                )) > 0;
                if ( $isIndexExist ) {
                    $this->Stream_list_map->updateAll(
                        array(
                            'Stream_list_map.index' => 'Stream_list_map.index+1'
                        ),
                        array(
                            'Stream_list_map.index >=' => $postData['index'],
                            'Stream_list_map.lid' => $postData['listID']
                        )
                    );
                }
                $postData['startTime'] = isset($postData['startTime']) ? $postData['startTime'] : time();
                $postData['endTime'] = isset($postData['endTime'])
                    ? $postData['endTime']
                    : mktime(23, 59, 59, date('m', $postData['startTime']), date('d', $postData['startTime']), date('Y', $postData['startTime']));
                $postData['completed'] = 0;
                $postData['parentID'] = isset($postData['parentID']) ? $postData['parentID'] : 0;
                $postData['creatorID'] = $this->Auth->user('id');
                $postData['createdOn'] = time();
                $postData['description'] = isset($postData['description']) ? $postData['description'] : '';

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
                            'index' => $postData['index'],
                            'parentID' => $postData['parentID']
                        )
                    ));
                    $postData['slmid'] = $this->Stream_list_map->getLastInsertId();
                    
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
                $streamDetails = $this->Stream->getDetais($sid, $lid);
                
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
                if ( !isset($postData['deleteStreams']) || empty($postData['deleteStreams']) ) {
                    $message = 'No stream to delete';
                }
                else {
                    if ( $this->Stream->deleteAll(array('Stream.id' => $postData['deleteStreams']), true) ) {
                        $isSuccess = true;
                        $message = 'Stream have been deleted!';

                        $this->_updateStreamIndex($postData['indexTable'], $postData['listID']);
                    }
                }
            }
            return json_encode(array('success'=>$isSuccess, 'message'=>$message));
        }
        public function deleteAllStreams ($listID) {
            $this->autoRender = false;
            $isSuccess = false;
            $message = 'Unknown';
            if ( $this->request->isAjax() ) {
                $this->loadModel('Stream_list');
                if ( $this->Stream_list->clear($listID) ) {
                    $isSuccess = true;
                    $message = 'All streams have been deleted!';
                }
            }
            return json_encode(array('success'=>$isSuccess, 'message'=>$message));
        }
        
        /** send user here if they do not have permission on specific action
         */
        private function _forbidden () {
            print_r(403);
            exit;
        }
        /** update indexes of streams with given index table
         */
        private function _updateStreamIndex ($indexTable, $lid) {
            $this->loadModel('Stream_list_map');
            foreach ( $indexTable as $sid => $index ) {
                $this->Stream_list_map->updateAll(
                    array(
                        'Stream_list_map.sid' => $sid,
                        'Stream_list_map.lid' => $lid
                    ),
                    array(
                        'Stream_list_map.index' => $index
                    )
                );
            }
        }
    }
?>