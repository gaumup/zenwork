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
                $this->loadModel('Stream');
                if ( !$this->Stream->exists($sid) ) {
                    return 404;
                }

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
                $this->loadModel('Stream');
                if ( !$this->Stream->exists($sid) ) {
                    return 404;
                }

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

        public function remove ($sid=0) {
            $this->autoRender = false;
            if ( $this->request->isAjax() && !empty($sid) ) {
                $this->loadModel('Stream');
                if ( !$this->Stream->exists($sid) ) {
                    return 404;
                }
                $this->Stream->delete($sid, true);
                return true;
            }
            return false;
        }

        public function moveStream ($slmid, $lid) {
            $this->autoRender = false;
            if ( $this->request->isAjax() ) {
                $this->loadModel('Stream_list_map');
                return $this->Stream_list_map->changeScope($slmid, $lid);
            }
        }

        public function shareStreamPopup ($sid) {
            $this->autoRender = false;
            if ( $this->request->isAjax() ) {
                $postData = $this->request->input('json_decode', true);
                $this->layout = 'blank';
                $this->loadModel('Stream_list_map');
                list($lid) = array_values($this->Stream_list_map->find('list', array(
                    'conditions' => array('Stream_list_map.id' => $postData['slmid']), 
                    'fields' => array('Stream_list_map.lid'),
                    'limit' => 1
                )));
                $url = Configure::read('root_url').'/planner#!'.$lid.'?sid='.$sid;

                $this->set(compact('sid', 'url'));
                $this->render('share_stream_popup');
            }
        }

        public function shareByEmail ($sid) {
            $this->autoRender = false;
            if ( $this->request->isAjax() ) {
                $postData = $this->request->input('json_decode', true);
                $stream = $this->Stream->findById($sid);
                //$title, $action, $message='', $url='', $recipients=''
                $this->notify(
                    $this->Auth->user('username').' share a task '.$stream['Stream']['name'],
                    'share you a task "'.$stream['Stream']['name'].'" in order you need to follow it',
                    $postData['message'],
                    $postData['url'],
                    explode(',', $postData['recipients'])
                );

                return true;
            }
        }

        public function follow ($sid) {
            $this->autoRender = false;
            if ( $this->request->isAjax() ) {
                $this->loadModel('Stream_follower');
                $this->Stream_follower->create();
                return $this->Stream_follower->save(array(
                    'Stream_follower' => array(
                        'uid' => $this->Auth->user('id'),
                        'sid' => $sid
                    )    
                )) ? true : false;
            }
        }
        public function unfollow ($sid) {
            $this->autoRender = false;
            if ( $this->request->isAjax() ) {
                $this->loadModel('Stream_follower');
                return $this->Stream_follower->deleteAll(array(
                    'Stream_follower.uid' => $this->Auth->user('id'),
                    'Stream_follower.sid' => $sid
                )) ? true : false;
            }
        }
    }
?>