function* CardTypesGenerator() {

    types = [{t:"H", c:"R",i:"&hearts;"},{t:"D", c:"R",i:"&diams;"},{t:"C", c:"B",i:"&clubs;"},{t:"S", c:"B",i:"&spades;"}]; //
    nominals = [2,3,4,5,6,7,8,9,10,11,12,13,14]; //11 - J, 12 - Q, 13 - K, 14 - A

    for(let i = 0; i < types.length; i++){
        for(let j = 0; j < nominals.length; j++){
            yield { type: types[i], nominal: nominals[j] };
        }
    }

}

function shuffle(array) {

    var currentIndex = array.length,  randomIndex;

    while (0 !== currentIndex) {
  
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;

  }
