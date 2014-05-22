<?php
    /* author: KhoaNT
     * date: 22-Aug-2013
     * email: ukhome@gmail.com
     * current version: 1.0
     * change log: (note important changes)
     * + v1.0: add new behavior to TreeBehavior, moveUp/Down node after add new node
     */

    class StreamTreeBehavior extends TreeBehavior {
        public function afterSave(Model $Model, $created, $options = array()) {
            if ( isset($Model->data['Stream_list_map']['offset'])
                && $Model->data['Stream_list_map']['offset'] != 0
            ) { //index changes
                if ( $Model->data['Stream_list_map']['offset'] > 0 ) {
                    $this->moveDown($Model, $Model->data['Stream_list_map']['id'], abs($Model->data['Stream_list_map']['offset']));
                }
                else {
                    $this->moveUp($Model, $Model->data['Stream_list_map']['id'], abs($Model->data['Stream_list_map']['offset']));
                }
            }
            parent::afterSave($Model, $created);
        }
    }
?>