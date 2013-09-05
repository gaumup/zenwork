<?php
    class MsgboxHelper extends AppHelper {
        function render ($content, $extra_class=null) {
            print_r(
				'<div class="MsgBoxWrapper '.($extra_class != null ? $extra_class : "").'">'.
					'<div class="MsgBox">'.
					'    <p>'.$content.'</p>'.
					'</div>'.
				'</div>'
            );
        }
    }
?>
