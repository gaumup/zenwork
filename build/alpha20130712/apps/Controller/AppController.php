<?php
    App::uses('CakeEmail', 'Network/Email');

    class AppController extends Controller {
        public $components = array('Auth', 'Cookie', 'Session', 'Acl');
        public $helpers = array('Html', 'Form', 'Css', 'Msgbox', 'Session', 'Time', 'Number');

        public function beforeFilter () {
            //configure 'Auth' components
            $this->autoRedirect = false;
            $this->Auth->authenticate = array(
                'Form' => array(
                    'userModel' => 'User',
                    'fields' => array('username' => 'username', 'password' => 'password')
                )
            );
            $this->Auth->loginAction = array(
                'controller' => 'auth',
                'action' => 'login'
            );
            $this->Auth->allow('register', 'login', 'forgotPwd', 'resetPwd');
            $this->Auth->authorize = 'Controller';
            if ( $this->action !== 'login' ) {
                if ( !empty($this->request->query) && $this->action !== 'forgotPwd' ) {
                    $this->Session->write('Auth.redirectUrl', Configure::read('root_url').'/'.$this->request->query['url']);
                }
                else {
                    $this->Session->write('Auth.redirectUrl', Configure::read('root_url'));
                }
            }
            else if ( !$this->Session->check('Auth.redirectUrl') ) {
                $this->Session->write('Auth.redirectUrl', Configure::read('root_url'));
            }
            
            //get server time
            $this->set('serverTime', time());

            //cache data from model 'Flow'
            if ( !$this->Session->check('Zenwork.Flow') ) {
                $this->loadModel('Flow');
                $this->Session->write('Zenwork.Flow', $this->Flow->find('all', array('order'=>array('Flow.status'=>'asc'))));
            }
        }

        public function checkParams ($pass_params, $accept_params) {
            if ( count($pass_params['pass']) !== $accept_params ) {
                if ( $this->action == 'login' ) {
                    $this->redirect($this->Auth->redirect());
                }
                else {
                    //failure will excute these code
                    throw new UnexpectedParameterException(array('expected'=>$accept_params, 'pass'=>count($pass_params['pass'])));
                }
            }
        }

        public function isAuthorized () {
            return true;
        }

        public function download ($filename, $name) {
            try {
                $this->autoRender = false;
                $this->response->file(Configure::read('upload_path').'/'.$filename, array('download' => true, 'name' => $name));
            } catch (NotFoundException $e) {
                pr('Sorry, file is broken or deleted!');
            }
        }

        /* attachment module */
        public function attachment ($sid=null) {
            $this->autoRender = false;
            if ( $this->request->is('ajax') && !is_null($sid) ) {
                $this->loadModel('Attachment');
                $this->set('uploadFiles', $this->Attachment->find('all', array(
                    'conditions' => array('Attachment.sid'=>$sid),
                    'order' => array('Attachment.since'=>'desc'),
                    'fields' => array('Attachment.*', 'User.id', 'User.email', 'User.username')
                )));
                $this->loadModel('Stream');
                $stream = $this->Stream->find('first', array(
                    'conditions' => array('Stream.id'=>$sid),
                    'fields' => array('Stream.id'),
                    'contain' => array('Attachment.id', 'Scomment.id')    
                ));
                $this->layout = 'blank';
                $this->set(compact(array('sid', 'stream')));
                return $this->render('/Elements/attachment');
            }
            return false;
        }
        public function uploadFile ($sid=null) {
            $this->autoRender = false;

            CakePlugin::load('Uploader');
            App::import('Vendor', 'Uploader.Uploader');
            $this->Uploader = new Uploader(array(
                'uploadDir' => Configure::read('upload_path')
            ));

            if ( !empty($this->data['name']) && !is_null($sid) ) {
                $this->loadModel('Attachment');
                $this->Attachment->set($this->data);

                if ( $this->Attachment->validates() ) {
                    /* do the upload:
                     * pr($_FILES): index of this will be 1st argument
                     */
                    $now = time();
                    $filename = md5($this->data['name'].$now);
                    if ( $upload = $this->Uploader->upload('file', array(
                            'overwrite' => false,
                            'name' => $filename
                        ))
                    ) { //Upload successful
                        //post as a comment
                        $this->loadModel('Scomment');
                        $this->Scomment->save(array(
                            'comment' => 'Upload a file',
                            'by' => $this->Auth->User('id'),
                            'when' => $now,
                            'sid' => $sid
                        ));
                        $cid = $this->Scomment->getLastInsertId();

                        $filename .= '.'.$upload['ext'];
                        $attachment = array(
                            'Attachment' => array(
                                'name' => $this->data['name'],
                                'filename' => $filename,
                                'size' => $upload['size'],
                                'ext' => $upload['ext'],
                                'uploader' => $this->Auth->user('id'),
                                'since' => $now,
                                'sid' => $sid,
                                'cid' => $cid
                            )
                        );
                        $this->Attachment->create();
                        if ( $this->Attachment->save($attachment) ) { //save upload file's info to DB
                            $upload['id'] = $this->Attachment->getLastInsertID();
                            $upload['success'] = true;
                            $upload['downloadUrl'] = Configure::read('root_url').'/app/download/'.$filename.'/'.$this->data['name'];
                            $upload['previewUrl'] = Configure::read('root_url').'/'.Configure::read('upload_path').'/'.$filename;
                            $upload['removeUrl'] = Configure::read('root_url').'/app/removeFile/'.$upload['id'];
                            $upload['uploader'] = $this->Auth->user('username');

                            //save log and send email
                            $action = 'upload file '.$attachment['Attachment']['name'];
                            $this->loadModel('Stream_log');
                            $this->Stream_log->saveStreamLog($sid, $action, $this->Auth->user('id'), $now);

                            //send notify to recipients
                            $this->notify(
                                $sid,
                                'upload file <strong>'.$attachment['Attachment']['name'].'</strong>',
                                $now,
                                '<a href="'.$upload['downloadUrl'].'" title="Download file">Download file</a>'
                            );

                            return json_encode($upload);
                        }
                    }
                    else {
                        return json_encode(array('success'=>false, 'err'=>'Sorry, unsupported file, please zip it then upload again!'));
                    }
                }
                else {
                    return json_encode($this->Attachment->validationErrors);
                }
            }
        }
        public function removeFile ($fid=null) {
            $this->autoRender = false;
            if ( $this->request->is('ajax') && !is_null($fid) ) {
                $this->loadModel('Attachment');
                $this->Attachment->id = $fid;
                $attachment = $this->Attachment->read();
                if ( $attachment['Attachment']['uploader'] == $this->Auth->User('id') ) {
                    $now = time();
                    $this->Attachment->delete($fid);

                    //log
                    $this->loadModel('Stream_log');
                    $this->Stream_log->saveStreamLog($attachment['Attachment']['sid'], 'delete file '.$attachment['Attachment']['name'], $this->Auth->user('id'), $now);
                    
                    //post as a comment
                    $this->loadModel('Scomment');
                    $this->Scomment->save(array(
                        'comment' => 'Delete file <strong>'.$attachment['Attachment']['name'].'</strong>',
                        'by' => $this->Auth->User('id'),
                        'when' => $now,
                        'sid' => $attachment['Attachment']['sid']
                    ));
                    $this->Scomment->id = $this->Scomment->getLastInsertId();
                    $comment = $this->Scomment->read();
                    $this->set(compact('comment'));
                    $this->layout = 'blank';
                    $this->render('/Elements/comment_item');
                }
                return false;
            }
            return false;
        }
        /* END. attachment module */

        /* comment module */
        public function comment ($sid=null) {
            $this->autoRender = false;
            if ( $this->request->is('ajax') && !is_null($sid) ) {
                $this->loadModel('Scomment');
                $this->set('commentList', $this->Scomment->find('all', array(
                    'conditions' => array('Scomment.sid'=>$sid),
                    'order' => array('Scomment.when'=>'desc'),
                    'fields' => array('Scomment.*', 'User.id', 'User.username', 'User.avatar')
                )));

                $this->loadModel('Stream');
                $stream = $this->Stream->find('first', array(
                    'conditions' => array('Stream.id'=>$sid),
                    'fields' => array('Stream.id'),
                    'contain' => array('Attachment.id', 'Scomment.id')    
                ));
                
                $this->layout = 'blank';
                $this->set(compact(array('sid', 'stream')));
                return $this->render('/Elements/comment');
            }
            return false;
        }
        public function addComment ($sid=null) {
            $this->autoRender = false;
            if ( $this->request->is('ajax') && !is_null($sid) ) {
                $postData = $this->request->input('json_decode', true/*force return array*/);
                $now = time();
                $this->loadModel('Scomment');
                if ( $this->Scomment->save(array(
                    'comment' => $postData['comment'],
                    'by' => $this->Auth->User('id'),
                    'when' => $now,
                    'sid' => $sid
                ))) {
                    $cid = $this->Scomment->getLastInsertId();
                    if ( !$postData['attachment'] ) {
                        //load comment data
                        $this->Scomment->id = $cid;
                        $comment = $this->Scomment->read();
                        $this->set(compact('comment'));

                        //save log and send email
                        $action = 'post a comment "'.$comment['Scomment']['comment'].'"';
                        $uid = $this->Auth->User('id');
                        $this->loadModel('Stream_log');
                        $this->Stream_log->saveStreamLog($sid, $action, $uid, $now);

                        //send notify to recipients
                        $this->notify(
                            $sid,
                            $action,
                            $now,
                            '"'.$comment['Scomment']['comment'].'"'
                        );

                        $htmlView = new View($this, false);
                        $htmlView->layout = 'blank';
                        $html = $htmlView->render('/Elements/comment_item');
                        return json_encode(array(
                            'attachment' => false,
                            'data' => $html,
                            'sid' => $sid,
                            'cid' => $cid
                        ), JSON_NUMERIC_CHECK);
                    }
                    else {
                        return json_encode(array(
                            'attachment' => true,
                            'data' => '',
                            'sid' => $sid,
                            'cid' => $cid
                        ));
                    }
                }
            }
            return false;
        }
        public function uploadCommentAttachment ($sid=null, $cid=null) {
            $this->autoRender = false;

            CakePlugin::load('Uploader');
            App::import('Vendor', 'Uploader.Uploader');
            $this->Uploader = new Uploader(array(
                'uploadDir' => Configure::read('upload_path')
            ));
            $this->loadModel('Attachment');
            if ( !empty($this->data['name']) ) {
                $this->Attachment->set($this->data);

                if ( $this->Attachment->validates() ) {
                    /* do the upload:
                     * pr($_FILES): index of this will be 1st argument
                     */
                    $now = time();
                    $filename = md5($this->data['name'].$now);
                    if ( $upload = $this->Uploader->upload('file', array(
                            'overwrite' => false,
                            'name' => $filename
                        ))
                    ) { //Upload successful
                        $filename .= '.'.$upload['ext'];
                        $attachment = array(
                            'Attachment' => array(
                                'name' => $this->data['name'],
                                'filename' => $filename,
                                'size' => $upload['size'],
                                'ext' => $upload['ext'],
                                'uploader' => $this->Auth->user('id'),
                                'since' => $now,
                                'sid' => $sid,
                                'cid' => $cid
                            )
                        );
                        $this->Attachment->create();
                        $this->Attachment->save($attachment);
                    }
                }
            }
        }
        public function removeComment ($cid=null) {
            $this->autoRender = false;
            if ( $this->request->is('ajax') && !is_null($cid) ) {
                $this->loadModel('Scomment');
                $this->Scomment->id = $cid;
                $comment = $this->Scomment->read();
                if ( $comment['Scomment']['by'] == $this->Auth->User('id') ) {
                    $this->Scomment->delete($cid);
                    return true;
                }
                return false;
            }
            return false;
        }
        public function getComment ($cid=null) {
            $this->autoRender = false;
            if ( $this->request->is('ajax') && !is_null($cid) ) {
                $this->loadModel('Scomment');
                $this->Scomment->id = $cid;
                $comment = $this->Scomment->read();
                $this->set(compact('comment'));
                $this->layout = 'blank';
                $this->render('/Elements/comment_item');
            }
        }
        /* END. comment module */
        

        /** timeline
         * received: client send post data = { json
         *     start: Optional
         *     end: Optional
         *     completed: Optional
         *     sid
         * }
         * return: server return if success = { json
         *     id
         *     start
         *     end
         *     completed
         *     sid
         *     createdOn
         *     creatorID
         * } else if false = 0;
         */
        public function addNewTimeline ($useLayout=0) {
            $this->autoRender = false;
            if ( $this->request->isAjax() ) {
                $postData = $this->request->input('json_decode', true);
                $now = time();
                $postData['start'] = isset($postData['start']) ? $postData['start'] : mktime(0, 0, 0);
                $postData['end'] = isset($postData['end'])
                    ? $postData['end']
                    : mktime(23, 59, 59, date('m', $postData['start']), date('d', $postData['start']), date('Y', $postData['start']));
                $postData['completed'] = isset($postData['completed']) ? $postData['completed'] : 0;
                $postData['createdOn'] = $now;
                $postData['creatorID'] = $this->Auth->user('id');

                $this->loadModel('Timeline');
                $this->Timeline->create();
                if ( $this->Timeline->save(array('Timeline' => $postData)) ) {
                    $postData['id'] = $this->Timeline->getLastInsertId();

                    //log
                    $this->loadModel('Stream_log');
                    $this->Stream_log->saveStreamLog($postData['sid'], 'add a new timeline', $this->Auth->user('id'), $postData['createdOn']);

                    if ( $useLayout === 0 ) {
                        return json_encode($postData, JSON_NUMERIC_CHECK);
                    }
                    else {
                        $this->Timeline->id = $postData['id'];
                        $timeline = $this->Timeline->read();
                        $timeline['Timeline']['assignee'] = array();
                        
                        $htmlView = new View($this, false);
                        $htmlView->layout = 'blank';
                        $htmlView->set(array(
                            'timeline' => $timeline['Timeline'],
                            'isCreator' => true,
                            'hasChild' => false,
                            'showDeleteTimelineBtn' => true
                        ));
                        $html = $htmlView->render('/Elements/stream_timeline_block');
                        return json_encode(array(
                            'json' => $postData,
                            'html' => $html
                        ), JSON_NUMERIC_CHECK);
                    }
                }
                else {
                    return false;
                }
            }
        }
        public function deleteTimeline ($tid=0) {
            $this->autoRender = false;
            if ( $this->request->isAjax() && !empty($tid) ) {
                $isSuccess = false;
                $message = 'Unknown';
                $timeline = $this->Timeline->findById($tid, array('Timeline.sid'));
                if ( $this->Timeline->find('count', array(
                        'conditions' => array('Timeline.sid' => $timeline['Timeline']['sid'])
                    )) == 1
                ) {
                    $isSuccess = false;
                    $message = 'Forbidden';
                }
                else if ( $this->Timeline->delete($tid, true) ) {
                    $isSuccess = true;
                    $message = 'Timeline have been deleted!';
                }
                return json_encode(array('success'=>$isSuccess, 'message'=>$message), JSON_NUMERIC_CHECK);
            }
        }
        public function assignUserTimeline ($uid, $tid, $effort=0) {
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
                    $this->Users_timeline->create();
                    if (
                        $this->Users_timeline->save(array(
                            'Users_timeline' => array(
                                'uid' => $uid,
                                'tid' => $tid,
                                'effort' => $effort,
                                'completed' => 1
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
                                break;
                            }
                        }

                        //log
                        $this->loadModel('Stream_log');
                        $this->Stream_log->saveStreamLog($timeline['Stream']['id'], 'assign this to '.$assignee['username'], $this->Auth->user('id'), time());

                        return json_encode($assignee, JSON_NUMERIC_CHECK);
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return $existing['Users_timeline']['uid'];
                }
            }
        }
        public function unassignUserTimeline ($uid, $tid) {
            $this->autoRender = false;
            if ( $this->request->isAjax() && !empty($uid) && !empty($tid) ) {
                $this->loadModel('Users_timeline');
                if ( $this->Users_timeline->deleteAll(array(
                        'Users_timeline.uid' => $uid,
                        'Users_timeline.tid' => $tid
                    )) 
                ) {
                    $this->loadModel('User');
                    $assignee = $this->User->findById($uid, array('User.username'));

                    $this->loadModel('Timeline');
                    $timeline = $this->Timeline->findById($tid, array('Stream.id'));

                    //log
                    $this->loadModel('Stream_log');
                    $this->Stream_log->saveStreamLog($timeline['Stream']['id'], 'unassign '.$assignee['User']['username'].' from this', $this->Auth->user('id'), time());

                    return $uid;
                }
                else {
                    return false;
                }
            }
        }
        public function updateUserTimelineEffort ($uid, $tid, $effort) {
            $this->autoRender = false;
            if ( $this->request->isAjax() && !empty($uid) && !empty($tid) && !empty($effort) ) {
                $this->loadModel('Users_timeline');
                if ( $this->Users_timeline->updateAll(
                        array(
                            'Users_timeline.effort' => $effort
                        ),
                        array(
                            'Users_timeline.uid' => $uid,
                            'Users_timeline.tid' => $tid
                        )
                    )
                ) {
                    $this->loadModel('User');
                    $assignee = $this->User->findById($uid, array('User.username'));

                    $this->loadModel('Timeline');
                    $timeline = $this->Timeline->findById($tid, array('Stream.id'));

                    //log
                    $this->loadModel('Stream_log');
                    $this->Stream_log->saveStreamLog($timeline['Stream']['id'], 'update '.$assignee['User']['username'].' effort to '.$effort. ' wdays', $this->Auth->user('id'), time());

                    return $effort;
                }
                else {
                    return false;
                }
            }
        }
        public function updateUserTimelineCompletion ($uid, $tid, $completed) {
            $this->autoRender = false;
            if ( $this->request->isAjax() && !empty($uid) && !empty($tid) ) {
                $this->loadModel('Users_timeline');
                return $this->Users_timeline->updateAll(
                    array(
                        'Users_timeline.completed' => $completed
                    ),
                    array(
                        'Users_timeline.uid' => $uid,
                        'Users_timeline.tid' => $tid
                    )
                ) ? true : false; 
            }
        }

        /** create|update|delete with dynamic model which contained in post data
         */
        public function cud () {
            $this->autoRender = false;
            if ( $this->request->isAjax() ) {
                $isSuccess = false;
                $postData = $this->request->input('json_decode', true);
                foreach ( $postData as $data ) {
                    if ( $data['action'] == 'CU' ) { //create | update
                        $this->loadModel($data['model']);
                        if ( isset($data['data'][$data['model']]['id']) ) {
                            $this->{$data['model']}->id = $data['data'][$data['model']]['id'];
                            $CU = 'U';
                        }
                        else {
                            $this->{$data['model']}->create();
                            $CU = 'C';
                        }
                        $isSuccess = $this->{$data['model']}->save($data['data']) ? true : false;
                        if ( $CU == 'C' ) {
                            $data['data'][$data['model']]['id'] = $this->{$data['model']}->getLastInsertId();
                        }
                        $this->_logCUD($CU, $data['model'], $data['data']);
                    }
                    else if ( $data['action'] == 'D' ) { //delete
                        $this->loadModel($data['model']);
                        $deleteConditions = array();
                        foreach ( $data['data'][$data['model']] as $key => $value ) {
                            $deleteConditions[$data['model'].'.'.$key] = $value;
                        }
                        $isSuccess = $this->{$data['model']}->deleteAll($deleteConditions, true) ? true : false;
                        $this->_logCUD('D', $data['model'], $deleteConditions);
                    }
                }
                return $isSuccess;
            }
        }
        private function _logCUD ($cud, $model, $data) {
            /*
            $sid = '';
            switch ($CUD) {
                case 'C';
                    $action = 'create new';
                    break;
                case 'U';
                    $action = 'update';
                    break;
                case 'D';
                    $action = 'delete';
                    break;
            }

            $this->loadModel('Stream_log');
            $this->Stream_log->saveStreamLog(
                $sid,
                $action,
                $this->Auth->user('id'),
                time()
            );
            */
        }

        public function notify ($sid, $action, $time, $message='', $recipients=null) {
            $this->loadModel('Stream_follower');
            if ( is_null($recipients) || empty($recipients) ) {
                $recipients = $this->Stream_follower->getFollowers($sid);
                if ( empty($recipients) ) { return false; }
            }

            $this->loadModel('Stream');
            $stream = $this->Stream->findById($sid);
            /*------  Begin Send mail -------------*/
            $email = new CakeEmail(Configure::read('email_config'));
            $email->to($recipients);
            $email->replyTo($this->Auth->User('email'));
            $email->subject((!empty($stream['Stream']['streamExtendModel']) ? $stream['Stream']['streamExtendModel'].': ' : '').$stream['Stream']['name']);
            //use template in '//View/Emails' with layout in '//View/Layouts/Emails'
            $email->template('notify', 'default');
            $email->viewVars(array(
                'username' => $this->Auth->User('username'),
                'stream' => $stream,
                'action' => $action,
                'time' => $time,
                'message' => $message
            ));
            $email->send();
            /*------  End Send mail -------------*/
        }

        /**
         * protected function for convenient merge 2 multi-dimensional array(recursive)
         * with overwrite key enable
         */
        protected function array_extend ($arr1, $arr2) {
            foreach ($arr2 as $key => $value) {
                if( array_key_exists($key, $arr1) && is_array($value) ) {
                    $arr1[$key] = $this->array_extend($arr1[$key], $arr2[$key]);
                }
                else {
                    $arr1[$key] = $value;
                }
            }
            return $arr1;
        }
    }

    /**
     * Exception class for parameter mismatch in action
     */
    class UnexpectedParameterException extends CakeException {}

    /**
     * Exception class for illegal request
     */
    class IllegalException extends CakeException {}
?>