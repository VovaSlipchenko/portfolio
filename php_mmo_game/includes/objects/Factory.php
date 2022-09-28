<?php

    class Factory{

        function createPlayer(){

        }

        function createGameObject($name, $x, $y){

            if($name == 'wall'){
                $obj = new GameObject('🧱');
                $obj->setType(GameObjectTypes::OBSTACLE);
                $obj->setDesk('wall', 'Wall');
            }

            if($name == 'fence'){
                $obj = new GameObject('⛩');
                $obj->setDesk('fence', 'Fence');
            }

            if($name == 'stone'){
                $obj = new GameObject('🪨');
                $obj->setDesk('stone', 'Stone');
            }

            if($name == 'grawe'){
                $obj = new GameObject('🪦');
                $obj->setDesk('grawe', 'Stone');
            }

            if($name == 'tree'){
                $obj = new GameObject('🌲');
                $obj->setDesk('tree', 'Tree');
            }

            if($name == 'wood'){
                $obj = new GameObject('🪵');
                $obj->setDesk('wood', 'Wood');
            }

            if($name == 'plant'){
                $obj = new GameObject('🌱');
                $obj->setDesk('plant', 'Plant');
            }

            if($name == 'rice'){
                $obj = new GameObject('🌾');
                $obj->setDesk('rice', 'Rice');
            }

            ////////////////////////////////////////////////////////
            /// Decorations

            if($name == 'fountain'){
                $obj = new GameObject('⛲');
                $obj->setDesk('fountain', 'Fountain');
            }

            if($name == 'snowman'){
                $obj = new GameObject('⛄');
                $obj->setDesk('snowman', 'Snowman');
            }

            if($name == 'bell'){
                $obj = new GameObject('🔔');
                $obj->setDesk('bell', 'Bell');
            }

            if($name == 'ladder'){
                $obj = new GameObject('🪜');
                $obj->setDesk('ladder', 'Ladder');
            }

            if($name == 'chair'){

                $obj = new GameObject('🪑');
                $obj->setDesk('chair', 'Chair');

            }

            if($name == 'basket'){

                $obj = new GameObject('🧺');
                $obj->setDesk('basket', 'basket');

            }

            if($name == 'window'){

                $obj = new GameObject('🪟');
                $obj->setDesk('window', 'window');

            }

            if($name == 'bed'){

                $obj = new GameObject('🛏');
                $obj->setDesk('window', 'window');

            }

            if($name == 'amphora'){

                $obj = new GameObject('🏺');
                $obj->setDesk('amphora', 'amphora');

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
            $obj = $this->createGameObject($type);
        }

        function createCreature(&$GAME_STAGE, $type, $x_start, $y){




        }


    }
