<?php
    App::uses('CakeEmail', 'Network/Email');

    class AppController extends Controller {
        public $components = array('Auth', 'Cookie', 'Session', 'Acl');
        public $helpers = array('Html', 'Form', 'Css', 'Msgbox', 'Session', 'Time', 'Number');

        public function beforeFilter () {
            //configure 'Auth' components
            $this->autoRedirect = false;
            $this->Auth->authenticate = array('Custom');
            $this->Auth->loginAction = array(
                'controller' => 'auth',
                'action' => 'login'
            );
            $this->Auth->allow('register', 'login', 'forgotPwd', 'resetPwd', 'signup', 'getUserTasks');
            $this->Auth->authorize = 'Controller';
            if ( $this->action !== 'login' && $this->action !== 'signup' ) {
                if ( !empty($this->request->query) && $this->action !== 'forgotPwd' ) {
                    $query = $this->request->query;
                    unset($query['url']);
                    $this->Session->write('Auth.redirectUrl',
                        Configure::read('root_url')
                            .'/'.$this->request->query['url']
                            .'?'.http_build_query($query)
                    );
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

            $this->loadModel('Help');
            $this->set('startUpTour', $this->Help->getUserHelp($this->Auth->user('id'), 'app'));
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

        public function check ($model, $id) { //check exists
            $this->autoRender = false;

            $this->loadModel($model);
            return $this->{$model}->exists($id) ? true : false;
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

        public function search ($keyword, $scope=array()) {
            $this->layout = 'blank';
            $this->loadModel('Stream');
            $this->loadModel('Stream_list');
            $this->set(array(
                'keyword' => $keyword,
                'streams' => $this->Stream->search($keyword, $this->Auth->user('id')),
                'lists' => $this->Stream_list->search($keyword, $this->Auth->user('id'))
            ));
        }

        /* attachment module */
        public function attachment ($sid=null) {
            $this->autoRender = false;
            if ( $this->request->is('ajax') && !is_null($sid) ) {
                $this->loadModel('Stream');
                if ( !$this->Stream->exists($sid) ) {
                    return 404;
                }

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
                    'contain' => array('Attachment.id', 'Scomment.id', 'Stream_follower.uid')    
                ));
                $this->layout = 'blank';
                $this->set(compact(array('sid', 'stream')));
                return $this->render('/Elements/attachment');
            }
            return false;
        }
        public function uploadFile ($sid=null) {
            $this->autoRender = false;

            if ( !is_null($sid) ) {
                $this->loadModel('Stream');
                if ( !$this->Stream->exists($sid) ) {
                    return 404;
                }

                CakePlugin::load('Uploader');
                App::import('Vendor', 'Uploader.Uploader');
                $this->Uploader = new Uploader(array(
                    'uploadDir' => Configure::read('upload_path')
                ));

                if ( !empty($this->data['name']) ) {
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
                                $stream = $this->Stream->findById($sid, array('Stream.name', 'Creator.email'));

                                $this->notify(
                                    'New file attached to task '.$stream['Stream']['name'],
                                    'upload file "'.$attachment['Attachment']['name'].'"',
                                    '',
                                    $upload['downloadUrl'],
                                    $this->_recipients($sid, array($stream['Creator']['email']))
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
                        'comment' => 'Delete file "'.$attachment['Attachment']['name'].'"',
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
                $this->loadModel('Stream');
                if ( !$this->Stream->exists($sid) ) {
                    return 404;
                }

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
                    'contain' => array('Attachment.id', 'Scomment.id', 'Stream_follower.uid')    
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
                $this->loadModel('Stream');
                if ( !$this->Stream->exists($sid) ) {
                    return 404;
                }

                $postData = $this->request->input('json_decode', true/*force return array*/);
                $now = time();
                $this->loadModel('Scomment');
                if ( $this->Scomment->save(array(
                    'comment' => $this->replace_url($postData['comment']),
                    'by' => $this->Auth->User('id'),
                    'when' => $now,
                    'sid' => $sid
                ))) {
                    $cid = $this->Scomment->getLastInsertId();
                    //load comment data
                    $this->Scomment->id = $cid;
                    $comment = $this->Scomment->read();
                    if ( !$postData['attachment'] ) {
                        $this->set(compact('comment'));

                        //save log and send email
                        $action = 'post a comment "'.$comment['Scomment']['comment'].'"';
                        $uid = $this->Auth->User('id');
                        $this->loadModel('Stream_log');
                        $this->Stream_log->saveStreamLog($sid, $action, $uid, $now);

                        //send notify to recipients
                        $this->loadModel('Stream');
                        $stream = $this->Stream->findById($sid, array('Stream.name', 'Creator.email'));
                        $this->notify(
                            'New comment on task "'.$stream['Stream']['name'].'"',
                            $action,
                            '',
                            Configure::read('root_url').'/planner?sid='.$sid,
                            $this->_recipients($sid, array($stream['Creator']['email']))
                        );

                        $htmlView = new View($this, false);
                        $htmlView->layout = 'blank';
                        $html = $htmlView->render('/Elements/comment_item');
                        return json_encode(array(
                            'attachment' => false,
                            'data' => $html,
                            'sid' => $sid,
                            'cid' => $cid
                        ));
                    }
                    else {
                        $uploadingQueue = array();
                        $uploadingQueue[$cid] = array(
                            'sid' => $sid,
                            'time' => $now,
                            'comment' => 'post a comment "'.$comment['Scomment']['comment'].'" with attachment:', 
                            'listAttachment' => '', 
                            'link' => array()
                        );
                        $this->Session->write('uploadingQueue', $uploadingQueue);
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

                        if ( $this->Session->check('uploadingQueue.'.$cid) ) {
                            $uploadingQueue = $this->Session->read('uploadingQueue.'.$cid);
                            $uploadingQueue['listAttachment'] .= chr(13).chr(10).'-'.$this->data['name'];
                            array_push($uploadingQueue['link'], '<a href="'.(Configure::read('root_url').'/'.Configure::read('upload_path').'/'.$filename).'" title="">'.$this->data['name'].'</a>');
                            $this->Session->write('uploadingQueue.'.$cid, $uploadingQueue);
                        }
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
                if ( $this->Session->check('uploadingQueue.'.$cid) ) {
                    $uploadingQueue = $this->Session->read('uploadingQueue.'.$cid);
                    $sid = $uploadingQueue['sid'];
                    $time = $uploadingQueue['time'];
                    $action = $uploadingQueue['comment'];
                    $listAttachment = $uploadingQueue['listAttachment'];
                    $link = $uploadingQueue['link'];

                    //save log and send email
                    $this->loadModel('Stream_log');
                    $this->Stream_log->saveStreamLog($sid, $action.$listAttachment, $this->Auth->User('id'), $time);

                    //send notify to recipients
                    $this->loadModel('Stream');
                    $stream = $this->Stream->findById($sid, array('Stream.name', 'Creator.email'));
                    $this->notify(
                        'Post a comment on task "'.$stream['Stream']['name'].'"',
                        $action,
                        '',
                        '',
                        $this->_recipients($sid, array($stream['Creator']['email'])),
                        $link
                    );

                    $this->Session->delete('uploadingQueue.'.$cid);
                }
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
                $postData['effort'] = ($postData['end']+1 - $postData['start'])/86400;
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
                        return json_encode($postData);
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
                        ));
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
                $this->loadModel('Timeline');
                if ( !$this->Timeline->exists($tid) ) {
                    $isSuccess = true;
                    $message = 'Timeline have been deleted!';
                }
                else {
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
                }
                return json_encode(array('success'=>$isSuccess, 'message'=>$message));
            }
        }
        public function assignUserTimeline ($uid, $tid, $effort=0) {
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
                            'fields' => array('Stream.id', 'Stream.name', 'Stream.description'),
                            'contain' => array('Stream', 'User')
                        ));

                        //get assignee information
                        foreach ( $timeline['User'] as $_assignee ) {
                            if ( $_assignee['id'] === $uid ) {
                                $assignee = $_assignee;
                                break;
                            }
                        }

                        /* Refactoring 07-Mar-2014: no need $lid in url anymore because stream possible moved to another plan
                         * after that, so we will get $lid when user click on link in email
                        $this->loadModel('Stream_list_map');
                        list($lid) = array_values($this->Stream_list_map->find('list', array(
                            'conditions' => array('Stream_list_map.sid' => $timeline['Stream']['id']),
                            'fields' => array('Stream_list_map.lid'),
                            'limit' => 1
                        )));
                        */

                        //send mail to user
                        if ( $this->Auth->User('email') != $assignee['email'] ) {
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
                                'url' => Configure::read('root_url').'/planner?sid='.$timeline['Stream']['id']
                            ));
                            $email->delivery = 'smtp';
                            $email->send();
                            /*------  End Send mail -------------*/
                        }

                        //log
                        $this->loadModel('Stream_log');
                        $this->Stream_log->saveStreamLog($timeline['Stream']['id'], 'assign this to '.$assignee['username'], $this->Auth->user('id'), time());

                        return json_encode($assignee);
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
                $this->loadModel('Timeline');
                if ( !$this->Timeline->exists($tid) ) {
                    return 404;
                }

                $this->loadModel('Users_timeline');
                if ( $this->Users_timeline->deleteAll(array(
                        'Users_timeline.uid' => $uid,
                        'Users_timeline.tid' => $tid
                    )) 
                ) {
                    $this->loadModel('User');
                    $assignee = $this->User->findById($uid, array('User.username', 'User.email'));

                    $this->loadModel('Timeline');
                    $timeline = $this->Timeline->findById($tid, array('Stream.id', 'Stream.name', 'Stream.description', 'Timeline.start', 'Timeline.end'));

                    //send mail to user
                    if ( $this->Auth->User('email') != $assignee['User']['email'] ) {
                        /*------  Begin Send mail -------------*/
                        $email = new CakeEmail(Configure::read('email_config'));
                        $email->to($assignee['User']['email']);
                        $email->replyTo($this->Auth->User('email'));
                        $email->subject('Assign a new task');
                        //use template in '//View/Emails' with layout in '//View/Layouts/Emails'
                        $email->template('unassign_notify', 'default');
                        $email->viewVars(array(
                            'stream' => $timeline['Stream'],
                            'timeline' => $timeline['Timeline'],
                            'assigner' => $this->Auth->User('username')
                        ));
                        $email->delivery = 'smtp';
                        $email->send();
                        /*------  End Send mail -------------*/
                    }

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
                $this->loadModel('Timeline');
                if ( !$this->Timeline->exists($tid) ) {
                    return 404;
                }

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
                $this->loadModel('Timeline');
                if ( !$this->Timeline->exists($tid) ) {
                    return 404;
                }

                $this->loadModel('Users_timeline');
                $isSuccess =  $this->Users_timeline->updateAll(
                    array(
                        'Users_timeline.completed' => $completed
                    ),
                    array(
                        'Users_timeline.uid' => $uid,
                        'Users_timeline.tid' => $tid
                    )
                ) ? true : false;
                
                if ( $isSuccess ) {
                    $timeline = $this->Timeline->find('first', array(
                        'conditions' => array('Timeline.id'=>$tid),
                        'fields' => array('Timeline.start', 'Timeline.end', 'Stream.id', 'Stream.name', 'Stream.creatorID'),
                        'contain' => array('Stream', 'User')
                    ));

                    $this->loadModel('User');
                    $creator = $this->User->findById($timeline['Stream']['creatorID'], array('User.username', 'User.email'));

                    /* Refactoring 07-Mar-2014: no need $lid in url anymore because stream possible moved to another plan
                     * after that, so we will get $lid when user click on link in email
                    $this->loadModel('Stream_list_map');
                    list($lid) = array_values($this->Stream_list_map->find('list', array(
                        'conditions' => array('Stream_list_map.sid' => $timeline['Stream']['id']),
                        'limit' => 1
                    )));
                    */

                    //send email notification to creator
                    $this->notify(
                        $this->Auth->User('username').' '.($completed == 3 ? 'completed' : 'uncompleted').' task "'.$timeline['Stream']['name'].'"',
                        ($completed == 3 ? 'completed' : 'uncompleted').' task "'.($timeline['Stream']['name']).'". Timeline from "'.date('d-M-Y', $timeline['Timeline']['start']).'" to "'.date('d-M-Y', $timeline['Timeline']['end']).'"',
                        '',
                        Configure::read('root_url').'planner?sid='.$timeline['Stream']['id'],
                        $this->_recipients($timeline['Stream']['id'], array($creator['User']['email']))
                    );

                    //log
                    $action = ($completed == 3 ? 'completed' : 'uncompleted').' '.($this->Auth->user('gender') == 1 ? 'her' : 'his').' assigned timeline(from '.date('d-M-Y', $timeline['Timeline']['start']).' to '.date('d-M-Y', $timeline['Timeline']['end']).')';
                    $this->loadModel('Stream_log');
                    $this->Stream_log->saveStreamLog($timeline['Stream']['id'], $action, $this->Auth->user('id'), time());
                }

                return $isSuccess;
            }
        }

        /** create|update|delete with dynamic model which contained in post data
         */
        public function cud () {
            $this->autoRender = false;
            if ( $this->request->isAjax() ) {
                $response = array();
                $postData = $this->request->input('json_decode', true);
                foreach ( $postData as $data ) {
                    $this->loadModel($data['model']);

                    //model specifics
                    if ( $data['model'] == 'Stream_list_map' && isset($data['data'][$data['model']]['lid']) ) {
                        $this->Session->write('Auth.User.activeListID', $data['data'][$data['model']]['lid']);
                    }

                    if ( $data['action'] == 'CU' ) { //create | update
                        if ( isset($data['data'][$data['model']]['id']) ) {
                            if ( !$this->{$data['model']}->exists($data['data'][$data['model']]['id']) ) {
                                continue;
                            }
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
                        array_push($response, array(
                            'success' => $isSuccess,
                            'data' => $isSuccess
                                ? ($CU == 'C' ? $data['data'][$data['model']]['id'] : array())
                                : array()
                        ));
                        if ( $isSuccess ) {
                            $this->_logCUD($CU, $data['model'], $data['data']);
                        }
                    }
                    else if ( $data['action'] == 'D' ) { //delete
                        if ( isset($data['data'][$data['model']]['id']) ) {
                            $isSuccess = $this->{$data['model']}->delete($data['data'][$data['model']]['id'], true) ? true : false;
                        }
                        else {
                            $deleteConditions = array();
                            foreach ( $data['data'][$data['model']] as $key => $value ) {
                                $deleteConditions[$data['model'].'.'.$key] = $value;
                            }
                            $isSuccess = $this->{$data['model']}->deleteAll($deleteConditions, true) ? true : false;
                        }
                        array_push($response, array(
                            'success' => $isSuccess,
                            'data' => array()
                        ));
                        if ( $isSuccess ) {
                            if ( isset($data['data'][$data['model']]['id']) ) {
                                $this->_logCUD('D', $data['model'], $data['model'].'->id = '.$data['data'][$data['model']]['id']);
                            }
                            else {
                                $this->_logCUD('D', $data['model'], $deleteConditions);
                            }
                        }
                    }
                }
                return json_encode($response);
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

        public function notify ($title, $action, $message='', $url='', $recipients='', $link=array()) {
            if ( empty($recipients) ) { return false; }
            if ( !is_array($recipients) && $this->Auth->User('email') == $recipients ) {
                return false;
            }
            if ( is_array($recipients) && in_array($this->Auth->User('email'), $recipients) ) {
                array_splice($recipients, array_search($this->Auth->User('email'), $recipients), 0);
            }

            /*------  Begin Send mail -------------*/
            $email = new CakeEmail(Configure::read('email_config'));
            $email->to($recipients);
            $email->replyTo($this->Auth->User('email'));
            $email->subject($title);
            //use template in '//View/Emails' with layout in '//View/Layouts/Emails'
            $email->template('notify', 'default');
            $email->viewVars(array(
                'username' => $this->Auth->User('username'),
                'title' => $title,
                'action' => $action,
                'message' => $message,
                'url' => $url,
                'link' => $link
            ));
            $email->send();
            /*------  End Send mail -------------*/
        }

        public function dismissHelp () {
            $this->autoRender = false;
            if ( $this->request->is('ajax') ) {
                $postData = $this->request->input('json_decode', true);
                $this->loadModel('Help');
                $this->Help->dismiss($this->Auth->user('id'), $postData['name'], $postData['scope']);
            }
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

        private function _recipients ($sid, $recipients=array()) {
            $this->loadModel('Stream_follower');
            $this->loadModel('Timeline');
            $this->loadModel('Users_timeline');

            $tid = array_values($this->Timeline->find('list', array(
                'conditions' => array('Timeline.sid' => $sid),
                'fields' => array('Timeline.id')
            )));
            $assigneeEmail = array();
            foreach ( $this->Users_timeline->getUsersTimeline($tid) as $userTimeline ) {
               array_push($assigneeEmail, $userTimeline['User']['email']); 
            }
            return array_unique(array_merge($this->Stream_follower->getFollowersEmail($sid), $assigneeEmail, $recipients));
        }

        protected function get_bitly_url ($url) {
            $this->autoRender = false;
            $bitly = new BitlyConsumer();
            return $bitly->get_bitly_short_url($url);
        }

        private function replace_url_bitly ($matches) {
            return $this->get_bitly_url($matches[0]);
            
            //$url = $this->get_bitly_url($matches[0]);
            //return '<a href="'.$url.'">'.$url.'</a>';
        }
        private function replace_url ($html) {
            return preg_replace_callback(
                '(https?://([-\w\.]+)+(:\d+)?(/([\w/_\.]*(\?\S+)?)?)?)',
                'self::replace_url_bitly',
                $html
            );
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

    class BitlyConsumer {
        private $token = 'e4fee321359cc64321cb95468d41471e7eec35df';
        private $clientID = 'c7c375ac8369582dca3ce8b9bd98e40b6ea1e01e';
        private $clientSecret = '5bb77aaadb6d1b5d9d8904f25688306494ff9749';
        private $login = 'ukhome';
        private $appkey = 'R_e50eb30b580448a18ea065b33ffb351f';

        /* returns the shortened url */
        public function get_bitly_short_url ($url, $format='txt') {
            $connectURL = 'http://api.bit.ly/v3/shorten?login='.$this->login.'&apiKey='.$this->appkey.'&uri='.urlencode($url).'&format='.$format;
            return $this->curl_get_result($connectURL);
        }

        /* returns expanded url */
        public function get_bitly_long_url ($url, $format='txt') {
            $connectURL = 'http://api.bit.ly/v3/expand?login='.$this->login.'&apiKey='.$this->appkey.'&shortUrl='.urlencode($url).'&format='.$format;
            return $this->curl_get_result($connectURL);
        }

        /* returns a result form url */
        private function curl_get_result ($url) {
            $ch = curl_init();
            $timeout = 5;
            curl_setopt($ch,CURLOPT_URL,$url);
            curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
            curl_setopt($ch,CURLOPT_CONNECTTIMEOUT,$timeout);
            $data = curl_exec($ch);
            curl_close($ch);
            return $data;
        }
    }
?>