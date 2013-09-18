<?php
    class Scomment extends AppModel {
        public $tablePrefix = 'zw_';
        public $name = 'Scomment';
        public $belongsTo = array(
            'User' => array(
                'className' => 'User',
                'foreignKey' => 'by'
            )
        );
        public $hasMany = array(
            'Attachment' => array(
                'className' => 'Attachment',
                'foreignKey' => 'cid',
                'dependent' => true
            )
        );
    }
?>