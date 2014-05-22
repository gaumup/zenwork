<?php
    class Timeline extends AppModel {
        public $tablePrefix = 'zw_';
        public $name = 'Timeline';
        public $actsAs = array('Containable');
        public $belongsTo = array(
            'Stream' => array(
                'className' => 'Stream',
                'foreignKey' => 'sid'
            )
        );
        public $hasAndBelongsToMany = array(
            'User' => array(
                'className' => 'User',
                'joinTable' => 'zw_users_timelines',
                'with' => 'Users_timeline',
                'foreignKey' => 'tid',
                'associationForeignKey' => 'uid',
                'unique' => true,
                'fields' => 'User.id, User.username, User.email, User.avatar, User.gender'
            )
        );

        public function afterSave ($created, $options = array()) {
            //use to update parent(recursively) start/end if current save node has parent
            if ( isset($this->data['Timeline']['start']) || isset($this->data['Timeline']['end']) ) {
                $this->_updateParentTimeline_($this->data['Timeline']);
            }
            return true;
        }
        public function beforeDelete ($options=array()) {
            $this->_updateParentTimeline_(array('id'=>$this->id), true);
            return true;
        }
        public function afterDelete () {
            ClassRegistry::init('Timeline_dependancy')->deleteAll(array(
                'OR' => array(
                    'Timeline_dependancy.tID1' => $this->id,
                    'Timeline_dependancy.tID2' => $this->id
                )
            ));
        }

        private function _updateParentTimeline_ ($data, $exclude=false) {
            $sid = null;
            if ( isset($data['sid']) ) {
                $sid = $data['sid'];
            }
            else if ( isset($data['id']) ) {
                $timeline = $this->findById($data['id'], array('Timeline.sid'));
                $sid = $timeline['Timeline']['sid'];
            }
            if ( $sid === null ) { return true; }

            $streamListMapModel = ClassRegistry::init('Stream_list_map');
            $slm = $streamListMapModel->find('all', array(
                'conditions' => array('Stream_list_map.sid' => $sid),
                'fields' => array('Stream_list_map.id', 'Stream_list_map.lid')
            ));
            foreach ( $slm as $_slm ) {
                $streamListMapModel->Behaviors->load('StreamTree', array('scope' => 'Stream_list_map.lid = '.$_slm['Stream_list_map']['lid']));
                $parentStream = $streamListMapModel->getParentNode($_slm['Stream_list_map']['id']);
                if ( !$parentStream ) { continue; } //no parent, continue

                //get all children of its parent
                $children = $streamListMapModel->children(
                    $parentStream['Stream_list_map']['id'],
                    true, //only direct children
                    array('Stream_list_map.sid') //fields
                );

                $tmp = array();
                foreach ( $children as $_child ) {
                    array_push($tmp, $_child['Stream_list_map']['sid']);
                }
                $conditions = array('Timeline.sid' => $tmp);
                if ( $exclude && isset($data['id']) ) {
                    $conditions['Timeline.id <>'] = $data['id'];
                }
                $childrenTimeline = $this->find('all', array(
                    'conditions' => $conditions
                ));
                $startTimeArr = array();
                $endTimeArr = array();
                foreach ( $childrenTimeline as $_childTimeline ) {
                    array_push($startTimeArr, $_childTimeline['Timeline']['start']);
                    array_push($endTimeArr, $_childTimeline['Timeline']['end']);
                }
                if ( !empty($startTimeArr) && !empty($endTimeArr) ) {
                    $this->updateAll(
                        array(
                            'Timeline.start' => min($startTimeArr),
                            'Timeline.end' => max($endTimeArr)
                        ),
                        array(
                            'Timeline.sid' => $parentStream['Stream_list_map']['sid']
                        )
                    );
                    //recursively
                    $this->_updateParentTimeline_(array('sid'=>$parentStream['Stream_list_map']['sid']));
                }
            }
        }
    }
?>
