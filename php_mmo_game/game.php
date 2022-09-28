<?php

    include './includes/CLI.php';

    include './includes/objects/base/GameObject.php';
    include './includes/objects/base/Creature.php';
    include './includes/objects/base/Weapon.php';
    include './includes/objects/base/Projectile.php';

    include './includes/objects/Factory.php';
    include './includes/objects/GameStage.php';
    include './includes/objects/Player.php';



    //CLI::clear();

/*

    echo CLI::coloredAndBgText('W', 'green', 'red');
    echo CLI::coloredAndBgText('M', 'green', 'light_gray');
    echo CLI::coloredAndBgText('B', 'green', 'black');
    echo CLI::coloredAndBgText('B', 'green', 'yellow');
    echo CLI::coloredAndBgText('B', 'green', 'blue');
    echo CLI::coloredAndBgText('B', 'green', 'green');
    echo CLI::coloredAndBgText('B', 'green', 'cyan');

    CLI::newLine();

    echo CLI::coloredAndBgText('W', 'red', 'red');
    echo CLI::coloredAndBgText('M', 'red', 'light_gray');
    echo CLI::coloredAndBgText('B', 'red', 'black');
    echo CLI::coloredAndBgText('B', 'red', 'yellow');
    echo CLI::coloredAndBgText('B', 'red', 'blue');
    echo CLI::coloredAndBgText('B', 'red', 'green');
    echo CLI::coloredAndBgText('B', 'red', 'cyan');

*/

//$unicodeChar = '\u03E1';

//$unicodeChar = "\u{1F49B}";
//echo $unicodeChar;
//echo json_decode('"'.$unicodeChar.'"');

//echo json_decode('"\uD83D\uDE00"');

//echo json_decode('"\u{1F577}\u{FE0F}"');

//echo json_decode('"\u{1F578}\u{FE0F}"');

//echo json_decode('"\u{1F43A}"');

/*
CLI::moveCursorTo(1, 1);
echo '🔪';
CLI::moveCursorTo(1, 2);
echo '🧱';
CLI::moveCursorTo(3, 2);
echo '🧱';
CLI::moveCursorTo(5, 2);
echo '🧱';
CLI::moveCursorTo(1, 3);
echo '🧝‍';//Archer
echo '🧙‍';//Mage
echo '💂';//Warrior
echo '🧛';//Bard
exit;
*/


$stage = new GameStage(60,60);
$factory = new Factory();

$player = new Player(1, 'Vova');
$player->setCoords(20,20);

$stage->addPlayer($player);



$stage->addObject($factory->createGameObject('wall',1,1));
$stage->addObject($factory->createGameObject('wall',1,2));
$stage->addObject($factory->createGameObject('wall',1,3));
$stage->addObject($factory->createGameObject('wall',1,4));
$stage->addObject($factory->createGameObject('wall',1,5));
$stage->addObject($factory->createGameObject('wall',1,6));

$stage->addObject($factory->createGameObject('wall',2,6));
$stage->addObject($factory->createGameObject('wall',3,6));
$stage->addObject($factory->createGameObject('wall',4,6));
$stage->addObject($factory->createGameObject('wall',5,6));

Cli::disableCursor();
Cli::setMode(true);

while(true) {

    if($c = CLI::readInput()) {

        CLI::moveCursorUp();
        CLI::clearDown();

        if(CLI::checkKeyControl($c) == CLI::CONTROL_LEFT){
            $stage->movePlayer(0, -1,0);
        }

        if(CLI::checkKeyControl($c) == CLI::CONTROL_RIGHT){
            $stage->movePlayer(0, 1,0);
        }

        if(CLI::checkKeyControl($c) == CLI::CONTROL_UP){
            $stage->movePlayer(0, 0,-1);
        }

        if(CLI::checkKeyControl($c) == CLI::CONTROL_DOWN){
            $stage->movePlayer(0, 0,1);
        }

        if(CLI::checkKeyControl($c) == CLI::CONTROL_ENTER){
            break;
        }

        $stage->draw();
        $stage->render();

        //var_dump($c);

    }

}


Cli::enableCursor();
Cli::setMode(false);
