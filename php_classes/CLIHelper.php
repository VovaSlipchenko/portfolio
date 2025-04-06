<?php


    class CLIHelper{

        const COLOR_DEFAULT = "\e[39m";
        const COLOR_WHITE = "\e[97m";
        const COLOR_GRAY = "\e[90m";
        const COLOR_YELLOW = "\e[33m";
        const COLOR_RED = "\e[31m";
        const COLOR_GREEN = "\e[32m";
        const COLOR_BLUE = "\e[34m";

        const CHARACTER_FILLED = "\u{2587}";
        const CHARACTER_EMPTY = "\u{025A7}";

        //const CHARACTER_FILLED = "#";
        //const CHARACTER_EMPTY = "-";

        const CHARACTER_MOVE_CURSOR_RIGHT = "\033[1C";

        const COMMAND_HIDE_CURSOR = "\033[?251";
        const COMMAND_SHOW_CURSOR = "\033[?25h";

        public function getParams($argv){
            $ret = Array();
            for($i = 1; $i < count($argv); $i++){
                if(strpos($argv[$i],'--') === 0 && strpos($argv[$i],'=')>0){
                    $parts = explode('=',$argv[$i]);
                    $key = $parts[0];
                    $value = $parts[1];
                    $key = substr($key,2);
                    $ret[$key] = $value;
                }
            }
            return $ret;
        }

        private $old_progress_str = '';
        public function progress($total, $current, $start = 0, $perc_segments = 30, $level = 2){

            //var_dump($level);

            $perc = ($current / $total);  

            $segments_filled = floor($perc_segments * $perc);
            $segments_empty = $perc_segments - $segments_filled;
            
            $str =  self::COLOR_WHITE
            ."[ ".($segments_filled>0?str_repeat(self::CHARACTER_FILLED, $segments_filled):'');
            $str.=self::COLOR_GRAY.($segments_empty>0?str_repeat(self::CHARACTER_FILLED, $segments_empty):'').self::COLOR_DEFAULT." ]";

            if($level > 0){
                $str.=str_pad(round($perc * 100, 1),5, ' ', STR_PAD_LEFT)."%";
            }

            if($level > 1){
                $str." (".$current."/".$total.")";                
            }

            
            $this->rewrite_str($this->old_progress_str, $str, $start);

            //echo $str;
            //echo "[START POS: ".$start_pos."]";
            

            $this->old_progress_str = $str;

            echo self::COLOR_DEFAULT;

        }

        private function rewrite_str($old, $new, $start){

            $log = "";
            $start_pos = 0;

            $log.="\r\n";
            $log.= "[".$old."]\r\n";
            $log.= "[".$new."]\r\n";

            

            for($i = 0; $i < mb_strlen($new); $i++){
                $log.= "[".mb_substr($old, $i, 1)." == ".mb_substr($new, $i, 1)."]\r\n";
                if($old && isset($old[$i]) && mb_substr($old, $i,1) == mb_substr($new, $i,1)){
                    $start_pos++;
                } else {
                    break;
                }
            }

            $log.= "[START FROM] ".$start_pos."\r\n";

            echo "\r";

            for($i = 0; $i < mb_strlen($new); $i++){
                echo mb_substr($new, $i,1);
                /*
                $log.= "[".mb_substr($old, $i,1)." == ".mb_substr($new, $i,1)."]\r\n";
                if($old && isset($old[$i]) && mb_substr($old, $i,1) == mb_substr($new, $i,1)){
                    $log.="[SKIP]\r\n";
                    //var_dump(mb_substr($this->old_progress_str, $i,1)." - ".mb_substr($str, $i,1));                    
                    echo self::CHARACTER_MOVE_CURSOR_RIGHT;
                    
                } else {
                    //break;
                    $log.="[DRAW ------------------------]\r\n";
                    echo mb_substr($new, $i,1);
                    //echo "BREAK ----------------------------------------------";
                    //break;
                }
                */
            }

            file_put_contents('test.txt', $log);

        }

    }


    $CH = new CliHelper();

    $params = $CH->getParams($argv);
    echo "\r\n";
    echo $CH::COMMAND_HIDE_CURSOR;
    
    for($i = 0; $i < 1001; $i++){
        $CH->progress(1000, $i, 0, 20, 1);
        usleep(2000);
    }
    