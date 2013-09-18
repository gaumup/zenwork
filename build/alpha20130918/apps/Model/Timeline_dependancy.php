<?php
	class Timeline_dependancy extends AppModel {
        public $tablePrefix = 'zw_';
		public $name = 'Timeline_dependancy';

        public function beforeSave ($options=array()) {
            $timelineModel = ClassRegistry::init('Timeline');
            return $timelineModel->find('count', array(
                'conditions' => array(
                    'Timeline.id' => array(
                        $this->data['Timeline_dependancy']['tID1'],
                        $this->data['Timeline_dependancy']['tID2']
                    )
                )    
            )) == 2;
        }
	}
?>
