<?php
    /* author: KhoaNT
     * date: 10-Feb-2014
     * email: ukhome@gmail.com
     * current version: 1.0
     * change log: (note important changes)
     * + v1.0: initial
     */

    class ApiController extends AppController {
    	public $name = 'Api';

        public function beforeFilter () {
            parent::beforeFilter();
        }
        
        /*
         * get user's tasks
         * RESTFul: /api/user/:id/task/all/:from/:to
         * - :id -> user id
         * - :from -> UNIX timestamp
         * - :to -> UNIX timestamp
         */
        public function getUserTasks () {
            $this->autoRender = false;
            $this->loadModel('Users_timeline');
            $tasks = $this->Users_timeline->getUserTaskList($this->request->params['id'], array(
                $this->request->params['from'], $this->request->params['to']  
            ));
            /*
             * tasks: [
             *     name: String
             *     start: Number
             *     end: Number
             *     estWorkload: Number
             *     actualWorkload: Number
             *     completed: True|False
             * ]
             */
            $data = array();
            foreach ($tasks as $task) {
                array_push($data, array(
                    'name' => $task['Stream']['name'],
                    'start' => $task['Timeline']['start'],
                    'end' => $task['Timeline']['end'],
                    'estWorkload' => $task['Timeline']['effort'], 
                    'actualWorkload' => $task['Users_timeline']['effort'],
                    'completed' => $task['Users_timeline']['completed'],
                    'url' => Configure::read('root_url').'/planner#!'.$task['Stream_list_map']['lid'].'?sid='.$task['Stream']['id']
                ));
            }
            return json_encode($data);
        }
    }
?>