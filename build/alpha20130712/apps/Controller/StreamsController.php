<?php
    /* author: KhoaNT
     * date: 28-Jun-2013
     * email: ukhome@gmail.com
     * current version: 1.0
     * change log: (note important changes)
     * + v1.0: initial
     */

    class StreamsController extends AppController {
        public $name = 'Streams';
        
        public function tag ($sid) {
            $this->autoRender = false;
            if ( $this->request->isAjax() ) {
                $postData = $this->request->input('json_decode', true);
                
                //create tag if not exist
                $this->loadModel('Tag');
                if ( !$this->Tag->isExist($postData['name']) ) {
                    $this->Tag->create();
                    $this->Tag->save(array(
                        'Tag' => array(
                            'name' => $postData['name']
                        )
                    ));
                }
                
                //save tags to stream
                $this->loadModel('Stream');
                $this->Stream->id = $sid;
                $stream = $this->Stream->read();
                $tag = empty($stream['Stream']['tag']) ? $postData['name'] : ($stream['Stream']['tag'].','.$postData['name']);
                $this->Stream->save(array(
                    'Stream' => array(
                        'tag' => $tag
                    )
                ));
                
                return true;
            }
            return false;
        }
        
        public function untag ($sid) {
            $this->autoRender = false;
            if ( $this->request->isAjax() ) {
                $postData = $this->request->input('json_decode', true);
            
                //save tags to stream
                $this->loadModel('Stream');
                $this->Stream->id = $sid;
                $stream = $this->Stream->read();
                $tag = explode(',', $stream['Stream']['tag']);
                foreach ( $tag as $key => $name ) {
                    if ( $postData['name'] == $name ) {
                        array_splice($tag, $key, 1);
                    }
                }
                $this->Stream->save(array(
                    'Stream' => array(
                        'tag' => empty($tag) ? '' : implode(',', $tag)
                    )
                ));
                
                return true;
            }
            return false;
        }
    }
?>