<?php
    class Help extends AppModel {
        public $tablePrefix = 'zw_';
        public $name = 'Help';

        public function getuserHelp ($uid, $controller) {
            if ( empty($uid) ) { return array(); }

            $help = $this->find('all', array(
                'conditions' => array('Help.controller' => $controller),
                'fields' => array('Help.name', 'Help.uid')
            ));
            $myHelp = array();
            foreach ( $help as $_help ) {
                $uidList = explode(',', $_help['Help']['uid']);
                if ( !in_array($uid, $uidList) ) {
                    array_push($myHelp, $_help['Help']['name']);
                }
            }
            return $myHelp;
        }

        public function dismiss ($uid, $name, $controller) {
            $help = $this->find('first', array(
                'conditions' => array('Help.name' => $name, 'Help.controller' => $controller),
                'fields' => array('Help.id', 'Help.uid')
            ));
            $uidList = empty($help['Help']['uid']) ? array() : explode(',', $help['Help']['uid']);
            if ( !in_array($uid, $uidList) ) {
                array_push($uidList, $uid);
            }
            $this->id = $help['Help']['id'];
            $this->save(array(
                'Help' => array(
                    'uid' => implode(',', $uidList)
                )    
            ));
        }
    }
?>
