<?php
    App::uses('CakeEmail', 'Network/Email');

    class AuthController extends AppController {
        public $uses = array('User');

        /* login
         * use to authentication user into system
         * authenticate by 'email'
         */
        public function login () {
            $this->checkParams($this->request->params, 0);

            $this->layout = 'login';
            $this->set('title_for_layout', 'Login or Register');

            $this->loadModel('User');
            if ( $this->Auth->login() ) {
                if ( $this->Auth->user('is_blocked') == 1 ) {
                    $this->Auth->logout();
                    $this->Session->setFlash('Sorry, your account has been blocked!<br />Please <a href="mailto:ukhome@gmail.com?Subject=[ZW-Account blocked]" title="mailto:ukhome@gmail.com">contact us</a> more details', '', '', 'auth');
                    return false;
                }

                $this->User->id = $this->Auth->user('id');
                $this->User->save(array(
                    'User' => array(
                        'online' => 1,
                        'lastLogin' => time()
                    )
                ));
                if ( !empty($this->data['User']['remember_login']) ) {
                    //mixed $key, mixed $value = null, boolean $encrypt = true, mixed $expires = null
                    $this->Cookie->write('Auth.User', $this->Auth->user(), true, '+1 week');
                    unset($this->request->data['User']['remember_login']);
                }
                $this->redirect($this->Session->read('Auth.redirectUrl'));
            }
            else {
                if ( !empty($this->data) ) {
                    //msg, element, params, key
                    $this->Session->setFlash('Username or password is incorrect :(', '', '', 'auth');
                }
                else {
                    $this->Session->delete('Message.auth');
                    $cookie = $this->Cookie->read('Auth.User');
                    if ( !is_null($cookie) ) {
                        if ( $this->Auth->login($cookie) ) {
                            $this->User->id = $cookie['id'];
                            $this->User->save(array(
                                'User' => array(
                                    'online' => 1,
                                    'lastLogin' => time()
                                )
                            ));
                            $this->redirect($this->Session->read('Auth.redirectUrl'));
                        }
                        else {
                            $this->Cookie->destroy('Auth.User'); # delete invalid cookie
                            $this->Session->setFlash('Invalid cookie');
                            $this->redirect(Configure::read("root_url").'/auth/login');
                        }
                    }
                }
            }
        }

        /* logout
         * log user out from system
         */
        public function logout () {
            $this->checkParams($this->request->params, 0);

            $this->loadModel('User');
            $this->User->id = $this->Auth->user('id');
            $this->User->save(array(
                'User' => array(
                    'online' => 0
                )
            ));

            $this->Auth->logout();
            $cookie = $this->Cookie->read('Auth.User');
            if (!is_null($cookie)) {
                $this->Cookie->delete('Auth.User');
            }
            $this->Session->destroy();

            $this->redirect(Configure::read('root_url').'/auth/login');
        }

        /* change_pwd
         * change user password
         */
        public function changePwd ($uid=null) {
            $this->checkParams($this->request->params, 1);

            $this->layout = 'zenwork';
            $this->set('title_for_layout', 'Change password');

            if ( $uid != $this->Auth->user('id') ) {
                $this->redirect(Configure::read('root_url').'/auth/change_pwd/'.$this->Auth->user('id'));
            }
            else {
                $errors = array();
                if ( isset($this->data['User']) ) {
                    //1. validate old password
                    //2. check empty password then matching on new password
                    //3. update new password

                    $this->User->set($this->data);
                    $this->User->id = $uid;
                    if ( $this->User->validates() ) {
                        if ( $this->User->save($this->data) ) {
                            $this->Session->setFlash('Your password is updated :)', '', '', 'change_pwd_success');
                            $this->redirect(array(
                                'controller' => 'auth',
                                'action' => 'profile/'.$uid
                            ));
                        }
                    }
                    else {
                        $this->set('errors', $this->User->validationErrors);
                        $this->request->data['User']['old_password'] = $this->data['User']['old_password'];
                    }
                }
            }
        }

        /* profile
         * view/edit existing user account
         */
        public function profile ($uid=null) {
            $this->checkParams($this->request->params, 1);

            $this->layout = 'zenwork';
            $this->set('title_for_layout', 'My profile');

            if ( $uid != $this->Auth->user('id') ) {
                $this->redirect(Configure::read('root_url').'/auth/profile/'.$this->Auth->user('id'));
            }
            else {
                $this->User->recursive = 2;
                $logged_in_user_profile = $this->User->findById($uid);
                $this->set(compact('logged_in_user_profile'));

                //saving data
                if ( !empty($this->data['User']) || !empty($this->data['User']) ) { //save data to DB
                    $is_saved = false;

                    if ( !empty($this->data['User']) ) {
                        $birthday = '';
                        if ( !empty($this->data['bd_day'])
                            && !empty($this->data['bd_month'])
                            && !empty($this->data['bd_year'])
                        ) {
                            $birthday = mktime(0, 0, 0, $this->data['bd_month'], $this->data['bd_day'], $this->data['bd_year']);
                        }
                        $this->request->data['User']['birthday'] = $birthday;

                        $this->User->set($this->data);
                        if ( $this->User->validates() ) {
                            $this->User->id = $uid;
                            $is_saved = $this->User->save($this->data);
                        }
                        else {
                            $this->set('errors', $this->User->validationErrors);
                        }
                    }

                    if ( $is_saved && !empty($this->data['User']) ) {
                        $this->loadModel('User');
                        $this->User->id = $this->data['User']['id'];
                        $is_saved = $this->User->save(array(
                            'mobile' => $this->data['User']['mobile']
                        ));
                    }

                    if ( $is_saved ) {
                        $this->Session->setFlash('Your profile is updated :)', '', '', 'profile_success');
                    }
                }
            }
        }

        /* upload_avatar
         */
        public function uploadAvatar ($uid) {
            $this->checkParams($this->request->params, 1);

            $this->layout = 'default';
            if ( $this->Session->read('Auth.User.id') == $uid ) {
                CakePlugin::load('Uploader');
                App::import('Vendor', 'Uploader.Uploader');
                $this->Uploader = new Uploader(array(
                    'uploadDir' => Configure::read('upload_path')
                ));

                if ( !empty($this->data['User']['avatar']) ) {
                    $this->User->set($this->data);
                    if ( !$this->User->Behaviors->attached('Uploader.FileValidation') ) {
                        $this->User->Behaviors->attach('Uploader.FileValidation', array(
                            'avatar' => array(
                                'extension'    => array(
                                    'value' => array('jpeg', 'jpg', 'png', 'gif'),
                                    'error' => 'Only support jpeg, jpg, png, gif'
                                ),
                                'filesize'    => array(
                                    'value' => 2048000,
                                    'error' => 'Maximum filesize allowed is 2MB'
                                )
                            )
                        ));
                    }
                    if ( $this->User->validates() ) {
                        /* do the upload:
                         * 1st arguments is the name of the file input field
                         * in format data[Model][name] -> 1st arg = 'name'
                         */
                        //old filename, included file extension
                        $old_filename = $this->Session->read('Auth.User.avatar'); //currently in DB
                        if ( $data = $this->Uploader->upload("avatar", array(
                                'overwrite' => true,
                                'name' => md5($uid)
                            ))
                        ) { //Upload successful
                            $this->User->id = $uid;
                            $fname = $data['custom_name'].'.'.$data['ext'];
                            if ( $this->User->saveField('avatar', $fname) ) { //save avatar's name to DB
                                $this->Session->write('Auth.User.avatar', $fname); //renew avatar in current session
                                $this->set('upload_path', Configure::read('upload_path'));
                                $this->set('upload_filename', $fname);
                            }

                            //delete old file if do not have same extension
                            if ( $old_filename != "" && $fname != $old_filename ) {
                                $this->Uploader->delete(Configure::read('upload_path').'/'.$old_filename);
                            }
                        }
                    }
                    else {
                        $this->set('error', $this->User->validationErrors);
                    }
                }
            }
        }

        /* edit_avatar
         * ajax call
         */
        public function editAvatar ($uid) {
            //$this->checkParams($this->request->params, 1);

            if ( $this->request->is('ajax') ) {
                $this->autoRender = false;

                $is_success = false;
                $filename = '';
                if ( $this->Session->read('Auth.User.id') == $uid ) {
                    if ( isset($_POST['scale_width'])
                        && isset($_POST['scale_height'])
                        && isset($_POST['x'])
                        && isset($_POST['y'])
                        && isset($_POST['w'])
                        && isset($_POST['h'])
                    ) {
                        $scale_width = $_POST['scale_width'];
                        $scale_height = $_POST['scale_height'];
                        $x = $_POST['x'];
                        $y = $_POST['y'];
                        $w = $_POST['w'];
                        $h = $_POST['h'];

                        $filepath = Configure::read('upload_path').'/'.$this->Session->read('Auth.User.avatar');

                        list($image_width, $image_height, $image_type) = getimagesize($filepath);

                        $image_type = image_type_to_mime_type($image_type);
                        switch($image_type) {
                            case "image/gif":
                                $src_image = imagecreatefromgif($filepath);
                                break;
                            case "image/pjpeg":
                            case "image/jpeg":
                            case "image/jpg":
                                $src_image = imagecreatefromjpeg($filepath);
                                break;
                            case "image/png":
                            case "image/x-png":
                                $src_image = imagecreatefrompng($filepath);
                                break;
                        }
                        $tmp_image = imagecreatetruecolor($scale_width, $scale_height);
                        imagecopyresized($tmp_image , $src_image, 0, 0, 0, 0, $scale_width, $scale_height, $image_width, $image_height);

                        $crop = imagecreatetruecolor($w,$h);
                        imagecopy($crop, $tmp_image, 0, 0, $x, $y, $w, $h);

                        //save to server
                        switch($image_type) {
                            case "image/gif":
                                $is_success = imagegif($crop, Configure::read('upload_path').'/'.$this->Session->read('Auth.User.avatar'), 100);
                                break;
                            case "image/pjpeg":
                            case "image/jpeg":
                            case "image/jpg":
                                $is_success = imagejpeg($crop, Configure::read('upload_path').'/'.$this->Session->read('Auth.User.avatar'), 100);
                                break;
                            case "image/png":
                            case "image/x-png":
                                //quality: 0(no compression)-9
                                $is_success = imagepng($crop, Configure::read('upload_path').'/'.$this->Session->read('Auth.User.avatar'), 0);
                                break;
                        }
                    }
                }
                $response = '{';
                $response .= '"success":"'.$is_success.'",';
                $response .= '"img_path":"'.Configure::read('root_url').'/'.$filepath.'"';
                $response .= '}';

                print_r($response);
            }
            else {
                throw new BadRequestException('Request can only be called via ajax');
            }
        }

        /* remove_avatar
         * ajax call
         */
        public function removeAvatar ($uid) {
            $this->checkParams($this->request->params, 1);

            if ( $this->request->is('ajax') ) {
                $this->autoRender = false;

                $is_success = false;
                if ( $this->Session->read('Auth.User.id') == $uid ) {
                    CakePlugin::load('Uploader');
                    App::import('Vendor', 'Uploader.Uploader');
                    $this->Uploader = new Uploader(array(
                        'uploadDir' => Configure::read('upload_path')
                    ));
                    if ( $this->Session->read('Auth.User.avatar') != '' ) {
                        //remove image on server
                        $is_success = $this->Uploader->delete(Configure::read('upload_path').'/'.$this->Session->read('Auth.User.avatar'));

                        //update DB
                        $this->User->id = $uid;
                        $is_success = $this->User->saveField('avatar', '');
                        if ( !empty($is_success) ) { $is_success = true; }

                        //update current session
                        $this->Session->write('Auth.User.avatar', '');
                    }
                }

                print_r($is_success);
            }
            else {
                throw new BadRequestException('Request can only be called via ajax');
            }
        }

        /* forgot_pwd: send email
         * use to send new password reset link to user's email
         */
        public function forgotPwd () {
            $this->checkParams($this->request->params, 0);

            $this->layout = 'zenwork';
            $this->set('title_for_layout', 'Forgot password :(');

            if ( $this->request->isPost() ) {
                $this->set('query_string', $this->data['Query']);
            }
            else {
                $this->set('query_string', $this->request->query);
            }

            if ( !empty($this->data['Forgot']) ) {
                $register_data = $this->data['Forgot'];
                $is_valid = true;

                //check empty
                if ( empty($register_data['email']) ) {
                    $is_valid = false;
                    $this->Session->setFlash('Oops, we need your email :)', 'message_box', array(
                        'extra_classes' => 'ErrorBox'
                    ), 'email');
                }
                //check email valid
                else if ( preg_match('/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/', $register_data['email']) == 0 ) {
                    $is_valid = false;
                    $this->Session->setFlash('Your email is invalid :)', 'message_box', array(
                        'extra_classes' => 'ErrorBox'
                    ), 'email');
                }
                //check email existing
                else if ( $this->User->find('count', array('conditions'=>array('User.email'=>$register_data['email']))) == 0 ) {
                    $is_valid = false;
                    $this->Session->setFlash('This email is not registered !', 'message_box', array(
                        'extra_classes' => 'ErrorBox'
                    ), 'email');
                }

                if ( $is_valid ) {
                    $recovery_email = strtolower($register_data['email']);

                    //save key reset to recovery email account
                    $key_reset_pwd = Security::hash(time(), null, true);
                    $this->User->updateAll(
                        array(
                            'User.key_reset_pwd' => '\''.$key_reset_pwd.'\''
                        ),
                        array(
                            'User.email' => $recovery_email
                        )
                    );
                    //send email
                    $email = new CakeEmail(Configure::read('email_config'));
                    $email->to($recovery_email);
                    $email->subject('Reset password confirmation');
                    $email->viewVars(array(
                        'recovery_email' => $recovery_email,
                        'recovery_lnk' => Configure::read('root_url').'/auth/resetPwd?email='.$recovery_email.'&key='.$key_reset_pwd
                    ));
                    //use template in '//View/Emails' with layout in '//View/Layouts/Emails'
                    $email->template('forgot_pwd', 'default');
                    $email->send();

                    $this->set(compact('recovery_email'));
                    $this->render('forgot_pwd_success');
                }
            }
        }

        /* reset_pwd: reset user password from reset password link in user's email
         */
        public function resetPwd () {
            $this->checkParams($this->request->params, 0);

            $this->layout = 'zenwork';
            $this->set('title_for_layout', 'Change password');

            $query = $this->request->query;
            if ( empty($query['email']) || empty($query['key']) ) {
                throw new UnexpectedParameterException(array('expected'=>2));
            }
            $user = $this->User->find('first', array(
                'conditions' => array('User.email'=>$query['email'])
            ));
            if ( $user['User']['key_reset_pwd'] != $query['key'] ) {
                throw new IllegalException(null);
            }

            $errors = array();
            if ( isset($this->data['User']) ) {
                //1. check empty password then matching on new password
                //2. update new password

                $this->request->data['key_reset_pwd'] = '';
                $this->User->set($this->data);
                $this->User->id = $user['User']['id'];
                if ( $this->User->validates() ) {
                    if ( $updated = $this->User->save($this->data) ) {
                        $user['User']['password'] = $updated['User']['password'];
                        $this->Auth->login($user['User']);
                        $this->Session->setFlash('Your password is updated :)', '', '', 'change_pwd_success');
                        $this->redirect(array(
                            'controller' => 'auth',
                            'action' => 'profile/'.$this->Auth->user('id')
                        ));
                    }
                }
                else {
                    $this->set('errors', $this->User->validationErrors);
                }
            }
        }

        /** 
         * searchEmail: return indexed-array
         */
        public function searchEmail () {
            $this->autoRender = false;
            if ( $this->request->isAjax() ) {
                $this->loadModel('User');
                return json_encode($this->User->searchEmail($_GET['term']));
            }
            return 0;
        }

        /** 
         * searchUsername: return indexed-array
         */
        public function searchUsername () {
            $this->autoRender = false;
            if ( $this->request->isAjax() ) {
                $this->loadModel('User');
                return json_encode($this->User->searchUsername($_GET['term']));
            }
            return 0;
        }

        /** 
         * searchByUsernameOrEmail: return object {{id: username}, {}, ...}
         */
        public function searchByUsernameOrEmail () {
            $this->autoRender = false;
            if ( $this->request->isAjax() ) {
                $this->loadModel('User');
                return json_encode($this->User->searchByUsernameOrEmail($_GET['term']));
            }
            return 0;
        }

        public function signup () {
            $this->checkParams($this->request->params, 0);

            $this->layout = 'login';
            $this->set('title_for_layout', 'Login or Register');

            $register = $this->User->register($this->data);
            if ( !$register ) {
                $this->set('errors', $this->User->validationErrors);
                $this->render('login');
            }
            else {
                if ( $this->Auth->login($register) ) {
                    $this->redirect(Configure::read('root_url').'/dashboard');
                }
            }
        }
    }
?>
