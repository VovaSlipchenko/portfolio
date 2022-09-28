<?php

    class GameStage{

        private $width = 50;
        private $height = 50;

        private $draw_array = Array();

        private $players = Array();
        private $objects = Array();


        function init(){



        }

        function addPlayer($player){
            $this->players[] = $player;
        }

        function movePlayer($player_number, $dx, $dy){
            $this->players[$player_number]->move($this, $dx, $dy);
        }

        function addObject($object){
            $this->objects[] = $object;
        }

        function update(){
            foreach($this->objects as $obj){
                $obj->update();
            }
        }

        function draw(){

            $this->draw_array = Array();

            for($x= 0; $x < $this->width; $x++){
                for($y= 0; $y < $this->height; $y++){

                    $this->draw_array[$x][$y] = null;

                    foreach($this->objects as $obj){
                        if($obj->checkCoords($x, $y)){
                            $this->draw_array[$x][$y] = $obj->draw();
                        }
                    }
                }
            }


            for($x= 0; $x < $this->width; $x++){
                for($y= 0; $y < $this->height; $y++){

                    foreach($this->players as $player){
                        if($player->checkCoords($x, $y)){
                            $this->draw_array[$x][$y] = $player->draw();
                        }
                    }
                }
            }

        }

        function render($draw_array = false){

            CLI::clear();

            if(!$draw_array){
                $draw_array = $this->draw_array;
            }

            for($x= 0; $x < $this->width; $x++) {
                for ($y = 0; $y < $this->height; $y++) {

                    CLI::moveCursorTo($x*2, $y);

                    if($this->draw_array[$x][$y] == null){
                        echo "  ";
                    } else {
                        echo $this->draw_array[$x][$y];
                    }

                }
            }

        }

        function getObjectsByCoords($x, $y){

            $objects = Array();

            foreach($this->objects as $obj) {
                if ($obj->checkCoords($x, $y)) {
                    $objects[] = $obj;
                }
            }

            return $objects;

        }


    }
