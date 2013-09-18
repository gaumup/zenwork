<?php
    /* author: KhoaNT
     * date: 01-Dec-2011
     * email: ukhome@gmail.com
     * current version: 1.0
     * change log: (note important changes)
     * + v1.0: initial
     */

    class PagesController extends AppController {
    	var $name = 'Pages';
        var $uses = ''; /* do not use any database tables */

        public function index () {
            $this->layout = 'zenwork';
        }
    }
?>