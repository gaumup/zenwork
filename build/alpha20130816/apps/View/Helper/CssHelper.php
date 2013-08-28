<?php
    class CssHelper extends AppHelper {
        public $css = '';
        
        public function afterRender ($viewFile) {
            $this->_View->set('styles_for_layout', $this->css);
        }

        public function add ($href, $media='all') {
            $this->css .= '<link type="text/css" rel="stylesheet" href="'.Configure::read('root_url').$href.'" media="'.$media.'" />';
        }
    }
?>
