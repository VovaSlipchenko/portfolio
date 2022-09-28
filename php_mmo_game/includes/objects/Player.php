<?php

    class Player extends Creature {

        function __construct($class, $name)
        {
            $symbol = '🧛';

            parent::__construct($symbol);
            $this->setDesk('player', $name);
        }

        function move($GAME_STAGE,$dx, $dy){

            if($this->checkStep($GAME_STAGE,$this->x + $dx, $this->y + $dy)){

                parent::move($GAME_STAGE, $dx, $dy);

            }

        }

        function receiveDamage($dmg){

        }


    }
