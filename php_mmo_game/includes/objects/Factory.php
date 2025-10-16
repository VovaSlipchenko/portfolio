<?php

    class Factory{

        function createPlayer(){

        }

        function createGameObject($name, $x, $y){

            if($name == 'wall'){
                $obj = new GameObject('🧱');
                $obj->setType(GameObjectTypes::WALL);
                $obj->setDesk($name, 'Wall');
            }

            if($name == 'fence'){
                $obj = new GameObject('⛩');
                $obj->setDesk($name, 'Fence');
            }

            if($name == 'stone'){
                $obj = new GameObject('🪨');
                $obj->setDesk($name, 'Stone');
            }

            if($name == 'grawe'){
                $obj = new GameObject('🪦');
                $obj->setDesk($name, 'Stone');
            }

            if($name == 'tree'){
                $obj = new GameObject('🌲');
                $obj->setDesk($name, 'Tree');
            }

            if($name == 'wood'){
                $obj = new GameObject('🪵');
                $obj->setDesk($name, 'Wood');
            }

            if($name == 'plant'){
                $obj = new GameObject('🌱');
                $obj->setDesk($name, 'Plant');
            }

            if($name == 'rice'){
                $obj = new GameObject('🌾');
                $obj->setDesk($name, 'Rice');
            }

            ////////////////////////////////////////////////////////
            /// Decorations

            if($name == 'fountain'){
                $obj = new GameObject('⛲');
                $obj->setDesk($name, 'Fountain');
            }

            if($name == 'snowman'){
                $obj = new GameObject('⛄');
                $obj->setDesk($name, 'Snowman');
            }

            if($name == 'bell'){
                $obj = new GameObject('🔔');
                $obj->setDesk($name, 'Bell');
            }

            if($name == 'ladder'){
                $obj = new GameObject('🪜');
                $obj->setDesk($name, 'Ladder');
            }

            if($name == 'chair'){

                $obj = new GameObject('🪑');
                $obj->setDesk($name, 'Chair');

            }

            if($name == 'basket'){

                $obj = new GameObject('🧺');
                $obj->setDesk($name, 'Basket');

            }

            if($name == 'window'){

                $obj = new GameObject('🪟');
                $obj->setDesk($name, 'Window');

            }

            if($name == 'bed'){

                $obj = new GameObject('🛏');
                $obj->setDesk($name, 'bed');

            }

            if($name == 'amphora'){

                $obj = new GameObject('🏺');
                $obj->setDesk($name, 'Amphora');

            }

            $obj->setCoords($x, $y);

            return $obj;

        }

        function createNeutralAnimal($name){

            if($name == 'cow'){
                $obj = new NeutralAnimal('🐄');
            }

            if($name == 'pig'){
                $obj = new NeutralAnimal('🐖');
            }

            return $obj;

        }

        function createLine(&$GAME_STAGE, $type, $x_start, $y_start, $dx, $dy){
            for($x = $x_start; $x <= $x_start + $dx; $x++){
                for($y = $y_start; $y <= $y_start + $dy; $y++){
                    $obj = $this->createGameObject($type, $x, $y);
                    $GAME_STAGE->addObject($obj);
                }
            }
        }

        function createRectangle(&$GAME_STAGE, $type, $x1, $y1, $x2, $y2){
            for($x = $x1; $x <= $x2; $x++){
                $obj = $this->createGameObject($type, $x, $y1);
                $GAME_STAGE->addObject($obj);
                $obj = $this->createGameObject($type, $x, $y2);
                $GAME_STAGE->addObject($obj);
            }

            for($y = $y1; $y <= $y2; $y++){
                $obj = $this->createGameObject($type, $x1, $y);
                $GAME_STAGE->addObject($obj);
                $obj = $this->createGameObject($type, $x2, $y);
                $GAME_STAGE->addObject($obj);
            }

        }

        function createCreature(&$GAME_STAGE, $type, $x_start, $y){




        }


    }
