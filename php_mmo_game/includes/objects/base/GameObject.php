<?php

    class GameObjectTypes {
        const WALL = 1;
        const HOLE = 2;
        const SURFACE = 3;
        const OBSTACLE = 4;
    }

    class GameObject{

        protected $x;
        protected $y;

        protected $background;
        protected $color;

        protected $symbol = ' ';

        protected $owner = null;
        protected $physical_type = GameObjectTypes::WALL;

        protected $name = '';
        protected $alt = '';

        protected $price = 0;

        function __construct($symbol, $color = false, $background = false)
        {
            $this->symbol = $symbol;
            $this->color = $color;
            $this->background = $background;
        }

        function setDesk($alt, $name){

            $this->alt = $alt;
            $this->name = $name;

        }

        function setType($type){
            if(in_array($type, Array(GameObjectTypes::WALL, GameObjectTypes::HOLE, GameObjectTypes::SURFACE, GameObjectTypes::OBSTACLE))) {
                $this->physical_type = $type;
            }
        }

        function getType(){
            return $this->physical_type;
        }

        function checkCoords($x, $y){
            return ($this->x == $x && $this->y == $y);
        }

        function getCoords(){
            return Array('x'=>$this->x, 'y'=>$this->y);
        }

        function setCoords($x, $y){
            $this->x = $x;
            $this->y = $y;
        }

        function incCoords($dx, $dy){
            $this->x += $dx;
            $this->y += $dy;
        }

        function draw(){
            //CLI::moveCursorTo($this->x*2, $this->y);
            if($this->symbol) {
                return $this->symbol;
            } else {

            }
        }

        function update(){

        }

        //EVENTS

        function on_step($object){

        }

        function on_leave($object){

        }

        function on_touch($object){

        }

    }
