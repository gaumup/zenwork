<?php
    class User extends AppModel {
        public $name = 'User';
        public $validate = array(
            /**
             * use when in action 'profile'
             */
            'fullname' => array (
                'rule' => 'notEmpty',
                'message' => 'Please enter fullname'
            ),
            //END. use when in action 'profile'

            /**
             * use when in action 'change_pwd'
             */
            'old_password' => array(
                'rule' => 'checkOldPwd',
                'message' => 'Old password is incorrect!'
            ),
            'password' => array(
                'rule' => 'notEmpty',
                'message' => 'Password can not be blank!'
            ),
            'confirm_password' => array(
                'rule' => 'checkPwdConfirm',
                'message' => 'Confirm password do not match!'
            )
            //END. use when in action 'change_pwd'
        );

        /*
         * register new user into system
         */
        public function register ($postData) {
            $data = array(
                'User' => $postData['Register']    
            );
            $this->validator()
                ->add('username', 'required', array(
                    'rule' => 'notEmpty',
                    'message' => 'Username can not be blank!'
                ))
                ->add('email', array(
                    'required' => array(
                        'rule' => 'email',
                        'message' => 'Please enter a valid email'
                    ),
                    'uniqueEmail' => array(
                        'rule' => 'uniqueEmail',
                        'message' => 'This email already registered<br />Please go to "Sign in to Zenwork" tab to login'
                    )
                ));
            
            $this->create();
            $data['User']['fullname'] = $data['User']['username'];
            $data['User']['online'] = 1;
            $data['User']['lastLogin'] = time();
            if ( !$this->save($data) ) {
                return false;
            }
            $data['User']['id'] = $this->getLastInsertId();
            return $data['User'];
        }

        /**
         * validation methods
         */
        public function checkOldPwd () {
            $logged_in_user = $this->findById(CakeSession::read('Auth.User.id'));
            return strcmp(Security::hash($this->data['User']['old_password'], null, true), $logged_in_user['User']['password']) == 0;
        }
        public function checkPwdConfirm () {
            return strcmp($this->data['User']['password'], $this->data['User']['confirm_password']) == 0;
        }
        public function uniqueEmail () {
            return $this->find('count', array('conditions'=>array('User.email LIKE' => $this->data['User']['email']))) == 0;
        }


        public function beforeSave ($options=array()) {
            //hashing password before save, use in 'change_pwd' action
            if ( !empty($this->data['User']['password']) ) {
                $this->data['User']['password'] = Security::hash($this->data['User']['password'], null, true);
            }
            return true; //MUST return TRUE to perform save action
        }
        public function afterSave($created) {
            if ( $created ) {
                $data = $this->read();
                $aro = array(
                     'parent_id' => null,
                     'foreign_key' => $data['User']['id'],
                     'alias' => $data['User']['username'],
                     'model' => 'User'
                );
                Classregistry::init('Aro')->create();
                Classregistry::init('Aro')->save($aro);
            }
        }

        public function searchEmail ($keyword) {
            //return sequential indexed array
            return array_values($this->find('list', array(
                'conditions' => array('User.email LIKE'=>'%'.$keyword.'%', 'User.is_blocked' => 0),
                'order' => array('User.email ASC'),
                'fields' => array('User.email')
            )));
        }
        public function searchUsername ($keyword) {
            //return sequential indexed array
            return array_values($this->find('list', array(
                'conditions' => array('User.username LIKE'=>'%'.$keyword.'%', 'User.is_blocked' => 0),
                'order' => array('User.username ASC'),
                'fields' => array('User.username')
            )));
        }
        public function searchByUsernameOrEmail ($keyword) {
            $results = $this->find('all', array(
                'conditions' => array(
                    'OR' => array(
                        'User.username LIKE'=>'%'.$keyword.'%',
                        'User.email LIKE'=>'%'.$keyword.'%'
                    ),
                    'User.is_blocked' => 0
                ),
                'order' => array('User.username ASC'),
                'fields' => array('User.id, User.username, User.email')
            ));
            $users = array();
            foreach ( $results as $user ) {
                $users[$user['User']['id']] = $user['User']['username'].'('.$user['User']['email'].')';
            }
            return $users;
        }
    }
?>