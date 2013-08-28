<?php
    /* author: KhoaNT
     * date: 14-Aug-2013
     * email: ukhome@gmail.com
     * current version: 1.0
     * change log: (note important changes)
     * + v1.0: initial
     */

    class MonitorController extends AppController {
    	public $name = 'Monitor';
        
        public function beforeFilter () {
            parent::beforeFilter();
            if ( strtolower($this->Auth->user('username')) != 'khoant' ) {
                $this->redirect(Configure::read('root_url'));
            }
        }

        public function index () {
            $this->layout = 'zenwork';

            //users
            $this->loadModel('User');
            $users = $this->User->find('all', array(
                'conditions' => array('User.lastLogin >' => 0),
                'order' => array('User.lastLogin desc')
            ));
            
            //task monitoring
            $this->loadModel('Stream');
            $this->Stream->unbindModel(array(
                'hasMany' => array('Stream_follower', 'Attachment', 'Scomment', 'Stream_log', 'Timeline'),
                'hasAndBelongsToMany' => array('Stream_list')
            ));
            $streams = array_values($this->Stream->find('list', array(
                'fields' => array('Stream.createdOn'),
                'order' => array('Stream.createdOn asc')    
            )));
            
            //plan monitoring
            $this->loadModel('Stream_list');
            $this->Stream->unbindModel(array(
                'hasAndBelongsToMany' => array('User')
            ));
            $streamLists = array_values($this->Stream_list->find('list', array(
                'conditions' => array('Stream_list.id >' => 1),
                'fields' => array('Stream_list.createdOn'),
                'order' => array('Stream_list.createdOn asc')    
            )));

            $this->set(compact('users', 'streams', 'streamLists'));
        }
    }
?>