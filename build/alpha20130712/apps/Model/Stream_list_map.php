<?php
    class Stream_list_map extends AppModel {
        public $tablePrefix = 'zw_';
        public $useTable = 'streams_lists_map';
        public $name = 'Stream_list_map';
        public $actsAs = array('Containable');

        public function beforeSave ($options=array()) {
            if ( isset($this->data['Stream_list_map']['lid']) ) {
                //index = '' or 0 -> set index before saving
                if ( !isset($this->data['Stream_list_map']['index']) || empty($this->data['Stream_list_map']['index']) ) {
                    $this->data['Stream_list_map']['index'] = $this->find('count', array(
                        'conditions' => array('Stream_list_map.lid'=>$this->data['Stream_list_map']['lid'])    
                    )) + 1;
                }

                //check if user belongs to list or creator of list or not, if yes, proceed saving
                if ( $this->data['Stream_list_map']['lid'] == 1 ) { //if list id = 1 -> proceed
                    return true;
                }
                $session = new CakeSession();
                $streamListModel = ClassRegistry::init('Stream_list');
                $userLists = $streamListModel->getUsersLists($session->read('Auth.User.id'));
                foreach ( $userLists as $list ) {
                    if ( $list['Stream_list']['id'] == $this->data['Stream_list_map']['lid'] ) {
                        return true;
                    }
                }

                return false;
            }
            return true;
        }
    }
?>
