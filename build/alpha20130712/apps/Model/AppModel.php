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

        /**
         * helpers function
         */
        public function timestamp_to_phrase ($timestamp) {
            $offset = time() - $timestamp; //in seconds
            if ( $offset >= 0 ) {
                if ( $offset > 60 ) { //maybe minute
                    if ( $offset >= 3600 ) { //maybe hour
                        if ( $offset > (24*3600) ) {
                            return date('d-M-Y H:i', $timestamp);
                        }
                        return round($offset/3600, 0).' hours ago';
                    }
                    return round($offset/60, 0).' minutes ago';
                }
                else {
                    if ( $offset <= 1 ) { return 'a second ago'; }
                    return $offset.' seconds ago';
                }
            }
            return false;
        }
        /**
         * helpers functions
         */
        public function unescape ($strIn, $iconv_to = 'UTF-8') {
            $strOut = '';
            $iPos = 0;
            $len = strlen ($strIn);
            while ($iPos < $len) {
               $charAt = substr ($strIn, $iPos, 1);
                if ($charAt == '%') {
                    $iPos++;
                    $charAt = substr ($strIn, $iPos, 1);
                    if ($charAt == 'u') {
                        // Unicode character
                        $iPos++;
                        $unicodeHexVal = substr ($strIn, $iPos, 4);
                        $unicode = hexdec ($unicodeHexVal);
                        $strOut .= $this->code2utf($unicode);
                        $iPos += 4;
                    }
                    else {
                        // Escaped ascii character
                        $hexVal = substr ($strIn, $iPos, 2);
                        if (hexdec($hexVal) > 127) {
                            // Convert to Unicode
                            $strOut .= $this->code2utf(hexdec ($hexVal));
                        }
                        else {
                            $strOut .= chr (hexdec ($hexVal));
                        }
                        $iPos += 2;
                    }
                }
                else {
                    $strOut .= $charAt;
                    $iPos++;
                }
            }
            if ($iconv_to != "UTF-8") {
                $strOut = iconv("UTF-8", $iconv_to, $strOut);
            }
            return $strOut;
        }
        public function code2utf ($num) {
          if ($num<128) {
            return chr($num);
          }
          if ($num<1024) {
            return chr(($num>>6)+192).chr(($num&63)+128);
          }
          if ($num<32768) {
            return chr(($num>>12)+224).chr((($num>>6)&63)+128).chr(($num&63)+128);
          }
          if ($num<2097152) {
            return chr(($num>>18)+240).chr((($num>>12)&63)+128).chr((($num>>6)&63)+128).chr(($num&63)+128);
          }
          return '';
        }
    }
?>