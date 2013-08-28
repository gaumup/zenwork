<?php
    class UPLOAD_func {
        var $source, $file_upload, $ext, $type, $extallow, $mime_pic, $size;

        function UPLOAD_func($file){
            $this->error = false;
            $this->file_upload	=	$file;
            $this->source		=	$this->file_upload['tmp_name'];
            $this->type			=	$this->file_upload['type'];

            $this->extallow		=	array( "gif","jpg","jpeg","png","swf","doc","pdf","GIF","JPG","JPEG","PNG","SWF","DOC","PDF");
            $this->mime_pic		=	array( "image/bmp",
                                           "image/gif",
                                           "image/jpeg",
                                           "image/pjpeg",
                                           "image/png"
                                         );
            $this->mime_other	=	array("application/x-shockwave-flash",
                                          "application/msword",
                                          "application/pdf"
                                         );
            $this->size	= 1024*1024 ; // Max 1 MB
            $this->ext  = strtolower(substr($this->file_upload['name'],-3));
        }

        function convert_name($name){
            $name = str_replace("%20", "_",$name);
            $name = str_replace(" ", "_", $name);
            $name = str_replace("&amp;", "_", $name);
            $name = str_replace("&", "_", $name);
            $name = str_replace(";", "_", $name);
            return $name;
        }
        function upload_file($dir) {
            $newFileName = substr($this->file_upload['name'],0,-4).time().'.'.$this->ext;
            $newFileName = $dir.$this->convert_name($newFileName);

            move_uploaded_file($this->file_upload['tmp_name'],$newFileName);
            $this->source= $newFileName;
        }
        function check_size(){
            if($this->file_upload['size'] > $this->size){
                return false;
            }
            else return true;
        }
        function check_mime($type){
            if (in_array($this->ext,$this->extallow)){
                if(in_array($this->type,($type=="pic")?$this->mime_pic:$this->mime_other))
                        return true;
                else{
                    return false;
                }
            }
            else{
                return false;
            }
        }
        function resize_pic($dir_name,$file_name,$new_width,$new_height){
            list($width,$height)=getimagesize($this->source);
            if($new_height=='') $new_height=($height/$width)*$new_width;
            if($new_width =='') $new_width =($width/$height)*$new_height;
            $tmp = imagecreatetruecolor($new_width,$new_height);

            switch ($this->type){
                case 'image/gif':
                    $ext= '.gif';
                    $src = imagecreatefromgif($this->source);
                    imagecopyresampled($tmp,$src,0,0,0,0,$new_width,$new_height,$width,$height);
                    $this->source=$dir_name.$file_name.$ext;
                    imagegif($tmp,$this->source,100);
                    break;
                case ($this->type =='image/jpeg' || $this->type == 'image/pjpeg'):
                    $ext= '.jpg';
                    $src = imagecreatefromjpeg($this->source);
                    imagecopyresampled($tmp,$src,0,0,0,0,$new_width,$new_height,$width,$height);
                    $this->source = $dir_name.$file_name.$ext;
                    imagejpeg($tmp,$this->source,100);

                    break;
                case 'image/png':
                    $ext= '.png';
                    $src = imagecreatefrompng($this->source);
                    imagecopyresampled($tmp,$src,0,0,0,0,$new_width,$new_height,$width,$height);
                    $this->source=$dir_name.$file_name.$ext;
                    imagepng($tmp,$this->source,5); //Quality from 0 - 9 (0:Good , 9:Bad)
                    break;
            }

            return $this->source;
        }
    }
?>