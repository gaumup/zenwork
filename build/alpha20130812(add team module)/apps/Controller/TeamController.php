<?php
    /* author: KhoaNT
     * date: 12-Aug-2013
     * email: ukhome@gmail.com
     * current version: 1.0
     * change log: (note important changes)
     * + v1.0: initial
     */

    class TeamController extends AppController {
    	public $name = 'Team';
        
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
                        $this->loadModel('Team');
                        if ( $postData['id'] == 1 ) {
                            $this->render('forbidden');
                            return false;
                        }
                        $teamList = $this->Team->findById($postData['id']);
                        if ( count($teamList) == 0 ) {
                            $this->render('404');
                            return false;
                        }
                        $isCreator = $teamList['Team']['creatorID'] == $this->Auth->user('id') ? true : false;
                        $this->set(compact('teamList'));
                    }
                    $this->set(compact('isCreator'));
                    $this->render('add_new_team');
                }
                else { //post data: create or update
                    $this->loadModel('Team');
                    if ( isset($postData['id']) ) { //edit
                        if ( $postData['id'] == 1
                            || !$this->Team->isCreator($postData['id'], $this->Auth->user('id'))
                            || !$this->Team->exists($postData['id'])
                        ) {
                            return false;
                        }
                        $this->Team->id = $postData['id'];
                    }
                    else { //create new
                        $this->Team->create();
                    }
                    return
                        $this->Team->save(array(
                            'Team' => array(
                                'name' => $postData['name'],
                                'creatorID' => $this->Auth->User('id'),
                                'createdOn' => time(),
                                'description' => $postData['description']
                            )
                        )) 
                            ? json_encode(array(
                                'id' => isset($postData['id']) 
                                    ? $postData['id']
                                    : $this->Team->getLastInsertId(),
                                'name' => $postData['name']
                            ))
                            : 0;
                }
            }
        }
        public function remove ($id=null) {
            $this->autoRender = false;
            if ( $this->request->isAjax() && $id != null ) {
                $this->loadModel('Team');
                if ( $this->Team->exists($id)
                    && $this->Team->isCreator($id, $this->Auth->user('id'))
                ) {
                    return $this->Team->delete($id, true) ? true : false;
                }
                else {
                    return false;
                }
            }
        }
        public function searchByName () {
            $this->autoRender = false;
            if ( $this->request->isAjax() ) {
                $this->loadModel('Team');
                return json_encode($this->Team->searchByName($_GET['term']));
            }
            return 0;
        }
        public function searchByUserTeam () {
            $this->autoRender = false;
            if ( $this->request->isAjax() ) {
                $this->loadModel('Team');
                return json_encode($this->Team->searchByUserTeam($this->Auth->user('id'), $_GET['term']));
            }
            return 0;
        }
        public function manageUserTeam ($lid) {
            $this->autoRender = false;
            if ( $this->request->isAjax() ) {
                $this->loadModel('Team');
                $this->Team->id = $lid;
                $this->set('team', $this->Team->read());
                
                $this->loadModel('Users_team');
                $this->Users_team->bindModel(array(
                    'belongsTo' => array(
                        'User' => array(
                            'className' => 'User',
                            'foreignKey' => 'uid'
                        )
                    )    
                ));
                $this->set('teamList', $this->Users_team->find('all', array(
                    'conditions' => array('Users_team.lid'=>$lid),
                    'fields' => array('User.id, User.username, User.email, User.avatar')
                )));
                $this->set(compact('lid'));
                $this->render('manage_user_team');
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
                        $this->Users_list->create();
                        $this->Users_list->save(array(
                            'Users_list' => array(
                                'uid' => $user['User']['id'],
                                'lid' => $lid
                            )
                        ));
                        array_push($invited, $user);
                    }

                    /*------  Begin Send mail -------------*/
                    $email = new CakeEmail(Configure::read('email_config'));
                    $email->to($validRecipients);
                    $email->replyTo($this->Auth->User('email'));
                    $email->subject('Invite to join a plan');
                    //use template in '//View/Emails' with layout in '//View/Layouts/Emails'
                    $email->template('invite_user_list', 'default');
                    $this->loadModel('Team');
                    $email->viewVars(array(
                        'username' => $this->Auth->User('username'),
                        'url' => Configure::read('root_url').'/planner#!'.$lid,
                        'list' => $this->Team->findById($lid),
                        'message' => $postData['message']
                    ));
                    $email->delivery = 'smtp';
                    $email->send();
                    /*------  End Send mail -------------*/
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