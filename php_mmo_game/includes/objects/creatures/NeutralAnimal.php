<?php

    class NeutralAnimal extends Creature {

        function __construct($symbol, $max_hp = 100)
        {
            parent::__construct($symbol, $max_hp, 0);
        }

        function update(){

        }

    }
