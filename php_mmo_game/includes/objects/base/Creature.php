<?php


    class Creature extends GameObject {

        protected $max_hp;
        protected $max_mp;
        protected $current_hp;
        protected $current_mp;
        protected $team = 0;
        protected $armor = 0;

        protected $flying = false;
        protected $ephemeral = false;

        private $inventory = Array();

        function __construct($symbol, $max_hp = 100, $max_mp = 100)
        {

            $this->max_hp = $this->current_hp = $max_hp;
            $this->max_mp = $this->current_mp = $max_mp;
            parent::__construct($symbol);

        }

        function setFlying($state){
            $this->flying = $state;
        }

        function setEphemeral($state){
            $this->ephemeral = $state;
        }

        function checkStep(&$GAME_STAGE, $x, $y){

            $canMove = true;

            $objects = $GAME_STAGE->getObjectsByCoords($x, $y);

            foreach($objects as $obj){

                if($obj->getType() == GameObjectTypes::OBSTACLE && !$this->ephemeral){
                    $canMove = false;
                }

                if($obj->getType() == GameObjectTypes::WALL && !$this->flying){
                    $canMove = false;
                }

            }

            return $canMove;

        }

        function move($GAME_STAGE, $dx, $dy){

            //if($this->checkStep($GAME_STAGE, $this->x+$dx, $this->y + $dy)) {

                $this->setCoords($this->x + $dx, $this->y + $dy);

            //}

        }

        function setCoords($x, $y)
        {
            parent::setCoords($x, $y);
        }

        function update(){

        }



    }
