<?php
    //app/Model/AppModel.php
    App::uses('Model', 'Model');
    App::uses('CakeSession', 'Model/Datasource');

    class AppModel extends Model {
        // Instantiate in constructor
        public function __construct($id = false, $table = null, $ds = null) {
            parent::__construct($id, $table, $ds);
            $this->Session = new CakeSession();
        }

    }
?>