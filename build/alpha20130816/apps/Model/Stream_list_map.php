<?php
    class Stream_list_map extends AppModel {
        public $tablePrefix = 'zw_';
        public $useTable = 'streams_lists_map';
        public $name = 'Stream_list_map';
        public $actsAs = array(
            'Containable',
            'Tree' => array(
                'left' => 'left',
                'right' => 'right',
                'parent' => 'parentSlmID'
            )
        );

        /* override 'save' method */
        public function save ($data=null, $validate=true, $fieldList=array()) {
            $isPermitted = true;
            //Tree will call save again when create new node and parent != NULL
            //$data when Tree call save do not contains 'Stream_list_map'
            //so we need to check isset($data['Stream_list_map']) in order to perform first-time saving
            if ( isset($data['Stream_list_map']) ) {
                $this->Behaviors->load('Tree', array('scope' => 'Stream_list_map.lid = '.$data['Stream_list_map']['lid']));

                //PERMISSION CHECKING
                $isPermitted = false;
                //check if user belongs to list or creator of list or not, if yes, proceed saving
                if ( $data['Stream_list_map']['lid'] == 1 ) { //if list id = 1 -> proceed
                    $isPermitted = true;
                }
                else {
                    $streamListModel = ClassRegistry::init('Stream_list');
                    $userLists = $streamListModel->getUsersLists($this->Session->read('Auth.User.id'));
                    foreach ( $userLists as $list ) {
                        if ( $list['Stream_list']['id'] == $data['Stream_list_map']['lid'] ) {
                            $isPermitted = true;
                            break;
                        }
                    }
                }

                if ( $isPermitted ) {
                    if ( isset($data['Stream_list_map']['parentID']) ) { //parent
                        if ( $data['Stream_list_map']['parentID'] != 0 ) {
                            $parent = $this->find('first', array(
                                'conditions' => array(
                                    'Stream_list_map.lid' => $data['Stream_list_map']['lid'],
                                    'Stream_list_map.sid' => $data['Stream_list_map']['parentID']
                                ) ,
                                'fields' => array('Stream_list_map.id')
                            ));
                            if ( count($parent) > 0 ) {
                                $data['Stream_list_map']['parentSlmID'] = $parent['Stream_list_map']['id'];
                            }
                            else {
                                $data['Stream_list_map']['parentID'] = 0;
                            }
                        }
                        else {
                            $data['Stream_list_map']['parentSlmID'] = '';
                        }
                    }
                    
                    if ( isset($data['Stream_list_map']['offset']) 
                        && $data['Stream_list_map']['offset'] != 0
                    ) { //index changes
                        if ( $data['Stream_list_map']['offset'] > 0 ) {
                            $this->moveDown($this->id, abs($data['Stream_list_map']['offset']));
                        }
                        else {
                            $this->moveUp($this->id, abs($data['Stream_list_map']['offset']));
                        }
                    }
                }
            }
            
            if ( $isPermitted ) {
                //continue saving normally
                return parent::save($data, $validate, $fieldList);
            }
            else {
                return false;
            }
        }

        public function delete ($id = null, $cascade = true) {
            $this->id = $id;
            $slm = $this->read();
            $this->Behaviors->load('Tree', array('scope' => 'Stream_list_map.lid = '.$slm['Stream_list_map']['lid']));
            return parent::delete($id, $cascade);
        }

        public function changeScope ($id, $lid) {
            $this->id = $id;
            $slm = $this->read();

            $this->create();
            $this->save(array(
                'Stream_list_map' => array(
                    'lid' => $lid,
                    'sid' => $slm['Stream_list_map']['sid']
                )
            ));
            $slmid = $this->getLastInsertId();

            //check dependancy
            list($tid) = array_values(ClassRegistry::init('Timeline')->find('first', array(
                'conditions' => array('Timeline.sid' => $slm['Stream_list_map']['sid']),
                'fields' => array('Timeline.id')
            )));
            $dependancyModel = ClassRegistry::init('Timeline_dependancy');
            $dependancyModel->deleteAll(array(
                'OR' => array(
                    'Timeline_dependancy.tID1' => $tid,
                    'Timeline_dependancy.tID2' => $tid
                ),
                'Timeline_dependancy.scopeID' => $slm['Stream_list_map']['lid']
            ));

            $children = $this->find('all', array(
                'conditions' => array(
                    'Stream_list_map.lid' => $slm['Stream_list_map']['lid'],
                    'Stream_list_map.left >' => $slm['Stream_list_map']['left'],
                    'Stream_list_map.right <' => $slm['Stream_list_map']['right']
                ),
                'fields' => array('Stream_list_map.sid', 'Stream_list_map.parentID'),
                'order' => array('Stream_list_map.left')
            ));
            $childrenSID = array();
            foreach ( $children as $_slm ) {
                array_push($childrenSID, $_slm['Stream_list_map']['sid']);
                $this->create();
                $this->save(array(
                    'Stream_list_map' => array(
                        'lid' => $lid,
                        'sid' => $_slm['Stream_list_map']['sid'],
                        'parentID' => $_slm['Stream_list_map']['parentID']
                    )
                ));
            }
            $childrenTimelineID = ClassRegistry::init('Timeline')->find('list', array(
                'conditions' => array('Timeline.sid' => $childrenSID),
                'fields' => array('Timeline.id')
            ));
            $dependancyModel->updateAll(
                array(
                    'Timeline_dependancy.scopeID' => $lid
                ),
                array(
                    'Timeline_dependancy.tID1' => $childrenTimelineID,
                    'Timeline_dependancy.tID2' => $childrenTimelineID,
                    'Timeline_dependancy.scopeID' => $slm['Stream_list_map']['lid']
                )
            );
            $dependancyModel->deleteAll(array(
                'OR' => array(
                    array(
                        'Timeline_dependancy.tID1' => $childrenTimelineID,
                        'NOT' => array('Timeline_dependancy.tID2' => $childrenTimelineID)
                    ),
                    array(
                        'NOT' => array('Timeline_dependancy.tID1' => $childrenTimelineID),
                        'Timeline_dependancy.tID2' => $childrenTimelineID
                    )
                ),
                'Timeline_dependancy.scopeID' => $slm['Stream_list_map']['lid']
            ));
            return json_encode(array('id'=>$slmid));
        }

        public function fix ($lid) {
            $this->Behaviors->load('Tree', array('scope' => 'Stream_list_map.lid = '.$lid));
            $this->recover();
        }
    }
?>
