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

            //check auth token
        }
        
        /*
         * get user's tasks
         */
        public function getUserTasks () {
            $this->autoRender = false;
            $this->loadModel('Users_timeline');
            $tasks = $this->Users_timeline->getUserTaskList($this->request->params['id']);
            /*
             * tasks: [
             *     name: String
             *     duration: Number
             *     estWorkload: Number
             *     actualWorkload: Number
             *     completed: True|False
             * ]
             */
            $data = array();
            foreach ($tasks as $task) {
                array_push($data, array(
                    'name' => $task['Stream']['name'],
                    'duration' => $task['Timeline']['end'] - $task['Timeline']['start'],
                    'estWorkload' => $task['Timeline']['effort'], 
                    'actualWorkload' => $task['Users_timeline']['effort'],
                    'completed' => $task['Users_timeline']['completed']
                ));
            }
            return json_encode($data);
        }
    }
?>