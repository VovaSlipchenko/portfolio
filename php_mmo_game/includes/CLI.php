<?php

class CLI{

    private static $stdin = null;

    const CONTROL_UP = 'UP';
    const CONTROL_DOWN = 'DOWN';
    const CONTROL_LEFT = 'LEFT';
    const CONTROL_RIGHT = 'RIGHT';
    const CONTROL_ENTER = 'ENTER';
    const CONTROL_SPACE = 'SPACE';

    const COLOR_GRAY = 'gray';
    const COLOR_RED = 'red';
    const COLOR_GREEN = 'green';
    const COLOR_GREEN_LIGHT = 'green_light';
    const COLOR_BLUE = 'blue';
    const COLOR_BLUE_LIGHT = 'blue_light';
    const COLOR_BROWN = 'brown';

    const NEW_LINE = "\r\n";



    /*
    Foreground Colors
        Black	0;30
        Dark Grey	1;30
        Red	0;31
        Light Red	1;31
        Green	0;32
        Light Green	1;32
        Brown	0;33
        Yellow	1;33
        Blue	0;34
        Light Blue	1;34
        Magenta	0;35
        Light Magenta	1;35
        Cyan	0;36
        Light Cyan	1;36
        Light Grey	0;37
        White	1;37
    Background Colors
        Black	40
        Red	41
        Green	42
        Yellow	43
        Blue	44
        Magenta	45
        Cyan	46
        Light Grey	47


            $this->foreground_colors['black'] = '0;30';
			$this->foreground_colors['dark_gray'] = '1;30';
			$this->foreground_colors['blue'] = '0;34';
			$this->foreground_colors['light_blue'] = '1;34';
			$this->foreground_colors['green'] = '0;32';
			$this->foreground_colors['light_green'] = '1;32';
			$this->foreground_colors['cyan'] = '0;36';
			$this->foreground_colors['light_cyan'] = '1;36';
			$this->foreground_colors['red'] = '0;31';
			$this->foreground_colors['light_red'] = '1;31';
			$this->foreground_colors['purple'] = '0;35';
			$this->foreground_colors['light_purple'] = '1;35';
			$this->foreground_colors['brown'] = '0;33';
			$this->foreground_colors['yellow'] = '1;33';
			$this->foreground_colors['light_gray'] = '0;37';
			$this->foreground_colors['white'] = '1;37';

			$this->background_colors['black'] = '40';
			$this->background_colors['red'] = '41';
			$this->background_colors['green'] = '42';
			$this->background_colors['yellow'] = '43';
			$this->background_colors['blue'] = '44';
			$this->background_colors['magenta'] = '45';
			$this->background_colors['cyan'] = '46';
			$this->background_colors['light_gray'] = '47';


    */

    private static $colors = Array(

        'black' => '0;30',
        'dark_gray' => '1;30',
        'blue' => '0;34',
        'light_blue' => '1;34',
        'green' => '0;32',
        'light_green' => '1;32',
        'cyan' => '0;36',
        'light_cyan' => '1;36',
        'red' => '0;31',
        'light_red' => '1;31',
        'purple' => '0;35',
        'light_purple' => '1;35',
        'brown' => '0;33',
        'yellow' => '1;33',
        'light_gray' => '0;37',
        'white' => '1;37',

    );

    private static $colors_background = Array(
        'black' => '40',
        'red' => '41',
        'green' => '42',
        'yellow' => '43',
        'blue' => '44',
        'magenta' => '45',
        'cyan' => '46',
        'light_gray' => '47'
    );

    private static $controls = [
        "[A"=>self::CONTROL_UP,
        "[B"=>self::CONTROL_DOWN,
        "[D"=>self::CONTROL_LEFT,
        "[C"=>self::CONTROL_RIGHT,
        "\n"=>self::CONTROL_ENTER,
        /*" "=>self::CONTROL_SPACE,*/
    ];

    private static $graph = Array(

    );

    public static function checkKeyControl($key){
        if(isset(self::$controls[$key])) return self::$controls[$key];
        return null;
    }

    public static function simple($text, $level){
        self::log("", "", $text, $level);
    }

    public static function inactive($text, $level = 0){
        self::log('gray', "info", $text, $level);
    }

    public static function success($text, $level = 0){
        self::log('green', "success", $text, $level);
    }

    public static function error($text, $level = 0){
        self::log('red', "error", $text, $level);
    }

    public static function info($text, $level = 0){
        self::log('blue', "info", $text, $level);
    }

    public static function log($color, $prefix, $text, $level){

        $str = str_repeat("  ", $level);

        if($prefix){
            $str .= "[".self::coloredText($color, $prefix)."]";
            //$str .= "[".$color.$prefix."\e[39m]";
        }

        self::printTime(false);

        $str .= $text;
        $str .= self::NEW_LINE;

        echo $str;

    }

    public static function coloredText($color, $text){

        $color_code = '';

        if(isset(self::$colors[$color])) {
            $color_code = "\033[".self::$colors[$color]."m";
        }

        return $color_code.$text."\033[0m";

    }

    public static function backgroundedText($color, $text){

        $color_code = '';

        if(isset(self::$colors_background[$color])) {
            $color_code = "\033[".self::$colors_background[$color]."m";
        }

        return $color_code.$text."\033[0m";

    }

    public static function coloredAndBgText($text, $color, $background = false){

        if($background){
            $text = self::backgroundedText($background, $text);
        }

        if($color) {
            $text = self::coloredText($color, $text);
        }

        return $text;

    }

    public static function printTime(){
        $format = 'H:i:s';
        echo "[".date('H:i:s')."] ";
    }

    public static function newLine(){
        echo self::NEW_LINE;
    }


    public static function sleep($time, $message = "WAITING"){

        for($i = 0; $i < $time; $i++){

            echo $message." (".str_pad($time - $i, 2, '0', STR_PAD_LEFT).")     \r";

            sleep(1);

        }

    }

    public static function beep(){
        echo "\x07";
    }

    public static function table($table, $options = []){

        $column_sizes = Array();

        $max_length = isset($options['max_length'])?intval($options['max_length']):50;

        if(count($table) > 0){
            $headers = array_keys($table[0]);
        }

        foreach($headers as $header){
            $column_sizes[$header] = strlen($header);
            foreach($table as $row){
                if(strlen($row[$header]) > $column_sizes[$header]) $column_sizes[$header] = strlen($row[$header]);
            }
        }

    }

    public static function clear()
    {
        echo "\033[2J";
    }

    public static function clearLine()
    {
        echo "\033[2K";
    }


    public static function clearDown()
    {
        echo "\033[J";
    }

    public static function enableCursor()
    {
        echo "\033[?25h";
    }

    public static function disableCursor()
    {
        echo "\033[?25l";
    }

    public function moveCursorUp($lines = 1)
    {
        echo "\033[".$lines."A";
    }

    public function moveCursorDown($lines = 1)
    {
        echo "\033[".$lines."B";
    }

    public function moveCursorRight($lines = 1)
    {
        echo "\033[".$lines."C";
    }

    public function moveCursorLeft($lines = 1)
    {
        echo "\033[".$lines."D";
    }

    public function moveCursorTo($column, $line){
        echo "\033[".$line.";".$column."f";
    }



    public static function setMode($mode){

        if($mode){
            self::$stdin = fopen('php://stdin', 'r');
            stream_set_blocking(self::$stdin, 0);
            system('stty cbreak -echo');
        } else {
            system("stty echo");
        }


    }

    public static function readInput(){
        $c = fread(self::$stdin, 16);
        if($c) {
            $c = preg_replace('/[^[:print:]\n]/u', '', mb_convert_encoding($c, 'UTF-8', 'UTF-8'));
        }
        return $c;
    }

    public static function selectFromList($title, $params){

        echo $title.self::NEW_LINE;

        $selected_index = 0;

        self::printList($params);
        self::setMode(true);
        self::disableCursor();

        while (true) {

            //$c = fread(STDIN, 16);
            $c = self::readInput();

            //var_dump($c);

            if($c) {


                if (self::checkKeyControl($c) == self::CONTROL_UP && $selected_index > 0) {
                    $selected_index--;
                }

                if (self::checkKeyControl($c) == self::CONTROL_DOWN && $selected_index < count($params) - 1) {
                    $selected_index++;
                }

                if (self::checkKeyControl($c) == self::CONTROL_ENTER) {

                    self::setMode(false);
                    self::enableCursor();

                    return array_keys($params)[$selected_index];
                    break;

                }

                self::printList($params, $selected_index, false);

            }

        }

        self::setMode(false);
        self::enableCursor();

    }

    private static function printList($array, $index = 0, $first_print = true){

        $description = false;
        $description_exists = false;

        $i = 0;
        foreach($array as $param){

            if(is_array($param) && count($param) > 1){
                $description_exists = true;
                if($i == $index){
                    $description = $param[1];
                }
            }

            $i++;

        }


        if(!$first_print){
            self::moveCursorUp(count($array) + ($description_exists?1:0));
            self::clearDown();
        }


        $i = 0;
        foreach($array as $param){

            $character = " ";

            if($i == $index){
                $character = self::coloredText('green','+');
            }

            $title = $param;
            if(is_array($param)){
                $title = $param[0];
            }

            echo "[".$character."] ".$title.self::NEW_LINE;

            $i++;
        }

        if($description_exists){
            if($description) echo $description;
            echo self::NEW_LINE;
        }

    }

}
