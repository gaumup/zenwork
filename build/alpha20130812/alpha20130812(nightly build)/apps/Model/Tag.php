<?php
    class Tag extends AppModel {
        public $tablePrefix = 'zw_';
        public $name = 'Tag';
        
        public function isExist ($tagName) {
            return $this->find('count', array(
                'conditions' => array('Tag.name' => $tagName)
            )) > 0;
        }
    }
?>
