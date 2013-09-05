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
        
        /** team
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
                        $team = $this->Team->findById($postData['id']);
                        if ( count($team) == 0 ) {
                            $this->render('404');
                            return false;
                        }
                        $isCreator = $team['Team']['creatorID'] == $this->Auth->user('id') ? true : false;
                        $this->set(compact('team'));
                    }
                    $this->set(compact('isCreator'));
                    $this->render('add_new_team');
                }
                else { //post data: create or update
                    $this->loadModel('Team');
                    if ( isset($postData['id']) ) { //edit
                        if ( !$this->Team->isCreator($postData['id'], $this->Auth->user('id'))
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
                if ( $this->Team->exists($id)
                    && $this->Team->isCreator($id, $this->Auth->user('id'))
                ) {
                    if ( $this->Team->delete($id, true) ) {
                        $this->loadModel('User');
                        $this->User->updateAll(
                            array(
                                'User.defaultTeamID' => 0  
                            ),
                            array(
                                'User.id' => $this->Auth->user('id'),  
                                'User.defaultTeamID' => $id   
                            )
                        );
                        if ( $this->User->getAffectedRows() > 0 ) {
                            $this->Session->write('Auth.User.defaultTeamID', 0);
                        }
                        return $id;
                    }
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
        public function manageUserTeam ($tid) {
            $this->autoRender = false;
            if ( $this->request->isAjax() ) {
                if ( !$this->Team->exists($tid) ) {
                    return false;
                }

                $this->Team->id = $tid;
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
                $this->set('usersTeam', $this->Users_team->find('all', array(
                    'conditions' => array('Users_team.tid'=>$tid),
                    'fields' => array('User.id, User.username, User.email, User.avatar')
                )));
                $this->set(compact('tid'));
                $this->render('manage_user_team');
            }
        }
        public function removeUserTeam ($uid, $tid) {
			$this->autoRender = false;
            if ( $this->request->isAjax() ) {
                if ( !$this->Team->exists($tid) ) {
                    return false;
                }

                $this->loadModel('Users_team');
                return $this->Users_team->deleteAll(array(
                    'Users_team.tid' => $tid,
                    'Users_team.uid' => $uid
                )) ? true : false;
            }
        }
        public function invite ($tid) {
			$this->autoRender = false;
            if ( $this->request->isAjax() ) {
                if ( !$this->Team->exists($tid) ) {
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
                    $this->loadModel('Users_team');
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
                        $this->Users_team->create();
                        $this->Users_team->save(array(
                            'Users_team' => array(
                                'uid' => $user['User']['id'],
                                'tid' => $tid
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
                    $email->template('invite_user_team', 'default');
                    $this->loadModel('Team');
                    $email->viewVars(array(
                        'username' => $this->Auth->User('username'),
                        'url' => Configure::read('root_url').'/dashboard?tid='.$tid.'#team',
                        'team' => $this->Team->findById($tid),
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
        public function setUserDefaultTeam ($tid) {
			$this->autoRender = false;
            if ( $this->request->isAjax() ) {
                if ( !$this->Team->exists($tid) ) {
                    return false;
                }

                $this->loadModel('User');
                $this->User->id = $this->Auth->User('id');
                if ( $this->User->save(array(
                    'User' => array(
                        'defaultTeamID' => $tid
                    )    
                )) ) {
                    $this->Session->write('Auth.User.defaultTeamID', $tid);

                    list($team) = array_values($this->Team->find('list', array(
                        'conditions' => array('Team.id' => $tid),
                        'fields' => array('Team.name'),
                        'limit' => 1
                    )));

                    return json_encode($team);
                }
                return false;
            }
        }
        public function getTeamData ($tid) {
			$this->autoRender = false;
            if ( $this->request->isAjax() ) {
                if ( !$this->Team->exists($tid) ) {
                    $this->Session->write('Auth.User.defaultTeamID', 0);
                    return 404;
                }

                $postData = $this->request->input('json_decode', true);

                $this->loadModel('Users_team');
                $this->loadModel('Users_timeline');

                //team
                $this->Team->bindModel(array(
                    'belongsTo' => array(
                        'Creator' => array(
                            'className' => 'User',
                            'foreignKey' => 'creatorID'
                        )
                    )
                ));
                $team = $this->Team->findById($tid);

                //team members
                $this->Users_team->bindModel(array(
                    'belongsTo' => array(
                        'User' => array(
                            'className' => 'User',
                            'foreignKey' => 'uid'
                        )
                    )
                ));
                $members = array_values($this->Users_team->find('all', array(
                    'conditions' => array('Users_team.tid' => $tid),
                    'fields' => array('User.id', 'User.username', 'User.avatar'),
                    'order' => array('User.username asc')
                )));
                array_unshift($members, array(
                    'User' => array(
                        'id' => $team['Creator']['id'],
                        'username' => $team['Creator']['username'],
                        'avatar' => $team['Creator']['avatar']
                    )
                ));

                if ( !empty($postData['timeBounce']) ) {
                    $timeBounce = json_decode($postData['timeBounce']);
                }
                else {
                    $now = time();
                    $timeBounce = array(
                        mktime(0, 0, 0, date('n', $now), 1, date('Y', $now)),
                        mktime(0, 0, 0, date('n', $now), date('t', $now), date('Y', $now))
                    );
                }
                $teamTasks = array();
                $memberTasks = array();
                foreach ( $members as $_member ) {
                    $uidTasks = $this->Users_timeline->getUserTaskList($_member['User']['id'], $timeBounce);
                    $memberTasks[$_member['User']['username']] = $uidTasks;
                    $teamTasks = array_merge($teamTasks, $uidTasks);
                }

                return json_encode(array(
                    'tasks' => $teamTasks,
                    'memberTasks' => $memberTasks,
                    'members' => $members
                ));
            }
        }
    }
?>