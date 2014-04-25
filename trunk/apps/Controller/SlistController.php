<?php
    /* author: KhoaNT
     * date: 28-Jun-2013
     * email: ukhome@gmail.com
     * current version: 1.0
     * change log: (note important changes)
     * + v1.0: initial
     */

    class SlistController extends AppController {
    	public $name = 'Slist';
        
        /** stream list
         */
        public function cu () {
            $this->autoRender = false;
            if ( $this->request->isAjax() ) {
                $postData = $this->request->input('json_decode', true);
                if ( empty($postData) || (count($postData) == 1 && isset($postData['id'])) ) { //view
                    $this->layout = 'blank';
                    $isCreator = true;
                    if ( isset($postData['id']) && !empty($postData['id']) ) {
                        $this->loadModel('Stream_list');
                        if ( $postData['id'] == 1 ) {
                            $this->render('forbidden');
                            return false;
                        }
                        $streamList = $this->Stream_list->findById($postData['id']);
                        if ( count($streamList) == 0 ) {
                            $this->render('404');
                            return false;
                        }
                        $isCreator = $streamList['Stream_list']['creatorID'] == $this->Auth->user('id') ? true : false;
                        $this->set(compact('streamList'));
                    }
                    $this->set(compact('isCreator'));
                    $this->render('add_new_stream_list');
                }
                else { //post data: create or update
                    $this->loadModel('Stream_list');
                    if ( isset($postData['id']) ) { //edit
                        if ( $postData['id'] == 1
                            || !$this->Stream_list->isCreator($postData['id'], $this->Auth->user('id'))
                            || !$this->Stream_list->exists($postData['id'])
                        ) {
                            return false;
                        }
                        $this->Stream_list->id = $postData['id'];
                    }
                    else { //create new
                        $this->Stream_list->create();
                    }
                    return
                        $this->Stream_list->save(array(
                            'Stream_list' => array(
                                'name' => $postData['name'],
                                'creatorID' => $this->Auth->User('id'),
                                'createdOn' => time(),
                                'description' => $postData['description'],
                                'ownerID' => $this->Auth->User('id'),
                                'ownerModel' => 'User'
                            )
                        )) 
                            ? json_encode(array(
                                'id' => isset($postData['id']) 
                                    ? $postData['id']
                                    : $this->Stream_list->getLastInsertId(),
                                'name' => $postData['name']
                            ))
                            : 0;
                }
            }
        }
        public function remove ($id=null) {
            $this->autoRender = false;
            if ( $this->request->isAjax() && $id != null ) {
                $this->loadModel('Stream_list');
                if ( $this->Stream_list->exists($id)
                    && $this->Stream_list->isCreator($id, $this->Auth->user('id'))
                ) {
                    return $this->Stream_list->delete($id, true) ? true : false;
                }
                else {
                    return false;
                }
            }
        }
        public function searchByName () {
            $this->autoRender = false;
            if ( $this->request->isAjax() ) {
                $this->loadModel('Stream_list');
                return json_encode($this->Stream_list->searchByName($_GET['term']));
            }
            return 0;
        }
        public function searchByUserList () {
            $this->autoRender = false;
            if ( $this->request->isAjax() ) {
                $this->loadModel('Stream_list');
                return json_encode($this->Stream_list->searchByUserList($this->Auth->user('id'), $_GET['term']));
            }
            return 0;
        }
        public function manageUserList ($lid) {
            $this->autoRender = false;
            if ( $this->request->isAjax() ) {
                if ( $lid == 1 ) {
                    $this->render('forbidden');
                    return false;
                }

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
                $this->set(compact('lid'));
                $this->render('manage_user_list');
            }
        }
        public function removeUserList ($uid, $lid) {
			$this->autoRender = false;
            if ( $this->request->isAjax() ) {
                $this->loadModel('Users_list');
                return $this->Users_list->deleteAll(array(
                    'Users_list.lid' => $lid,
                    'Users_list.uid' => $uid
                ));
            }
        }
        public function invite ($lid) {
			$this->autoRender = false;
            if ( $this->request->isAjax() ) {
                if ( $lid == 1 ) {
                    return false;
                }

				$postData = $this->request->input('json_decode', true/*force return array*/);
                $postData['recipients'] = preg_replace('/\s+/', '', $postData['recipients']);
                $recipients = preg_match('/,$/', $postData['recipients'])
                    ? substr($postData['recipients'], 0, -1)
                    : $postData['recipients'];
                $recipients = explode(',', $recipients);

                $validRecipients = array();
                $invalidRecipients = array();
                $sendMailRecipients = array();
                foreach ( $recipients as $key => $email ) {
                    if ( Validation::email($email, true) ) {
                        array_push($validRecipients, $email);
                    }
                    else {
                        array_push($invalidRecipients, $email);
                    }
                }
                $invited = array();
				if ( count($validRecipients) > 0 ) {
                    $this->loadModel('User');
                    $this->loadModel('Users_list');
                    foreach ( $validRecipients as $email ) {
                        $user = $this->User->find('first', array(
                            'conditions' => array('User.email' => $email),
                            'fields' => array('User.id, User.username, User.email, User.avatar')
                        ));
                        if ( count($user) == 0 ) {
                            //TODO: registry new user
                            continue;
                        }
                        //add user to list
                        $conditions = array(
                            'Users_list.uid' => $user['User']['id'],
                            'Users_list.lid' => $lid
                        );
                        if ( !$this->Users_list->hasAny($conditions) ) {
                            $this->Users_list->create();
                            $this->Users_list->save(array(
                                'Users_list' => array(
                                    'uid' => $user['User']['id'],
                                    'lid' => $lid
                                )
                            ));
                            array_push($invited, $user);
                            array_push($sendMailRecipients, $email);
                        }
                    }

                    if ( count($sendMailRecipients) > 0 ) {
                        /*------  Begin Send mail -------------*/
                        $email = new CakeEmail(Configure::read('email_config'));
                        $email->to($sendMailRecipients);
                        $email->replyTo($this->Auth->User('email'));
                        $email->subject('Invite to join a plan');
                        //use template in '//View/Emails' with layout in '//View/Layouts/Emails'
                        $email->template('invite_user_list', 'default');
                        $this->loadModel('Stream_list');
                        $email->viewVars(array(
                            'username' => $this->Auth->User('username'),
                            'url' => Configure::read('root_url').'/planner#!'.$lid,
                            'list' => $this->Stream_list->findById($lid),
                            'message' => $postData['message']
                        ));
                        $email->delivery = 'smtp';
                        $email->send();
                        /*------  End Send mail -------------*/
                    }
                }

                return json_encode(array(
                    'valid' => implode(', ', $validRecipients),
                    'invalid' => implode(', ', $invalidRecipients),
                    'invited' => $invited
                ));
            }
        }
    }
?>