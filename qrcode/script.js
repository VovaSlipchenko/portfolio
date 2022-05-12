class QRCodeRenderer{

    source = [];
    islands = [];
    algorythm = 0;

    windth = 200;
    height = 200;

    constructor(source, algorythm){

        this.algorythm = algorythm;
        this.source = JSON.parse(JSON.stringify(source));
        const map = new IslandMap(this.source, this.algorythm);
        this.islands = map.getIslands();

        console.log('Final islands:', this.islands);

        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

        this.islands.forEach(function(island){
            island.getPointsMap();
        });

        this.islands.forEach(function(island){
            
        });

        console.log('SLANDS:', this.islands);



    }

}

class IslandMap{

    source = [];
    islands = [];
    algorythm = 0;
    recursiveChecker = null;

    constructor(source, algorythm){
        this.algorythm = algorythm;
        //Clone source array to avoid data damage
        this.source = JSON.parse(JSON.stringify(source));
        this.recursiveChecker = new RecursiveChecker(this.source, this.algorythm);
    }

    getIslands(){
        for(let r = 0; r < this.source.length; r++){
            for(let c = 0; c < this.source[r].length; c++){
                //console.log('[R:'+r+';C'+c+']', this.source[r][c]);
                if(this.source[r][c]){

                    //Prepare array filled with 0
                    let island_map = this.source.map(array=> { return array.map( el => { return 0; } ); });
                    let bounds = new Bounds;

                    this.recursiveChecker.recursiveCheck(r, c, island_map, bounds);

                    for(var map_r = 0; map_r < island_map.length; map_r++){
                        for(var map_c = 0; map_c < island_map[map_r].length; map_c++){
                            if(island_map[map_r][map_c] == 1){
                                this.source[map_r][map_c] = 0;
                            }
                        }
                    }

                    //console.log('CREATE IN MAP:');
                    let island = new Island(island_map, bounds, this.algorythm);

                    this.islands.push(island);

                    //console.log('IM AF:', island_map);
                    //console.log('Bounds: ', bounds);

                }
            }
        }

        return this.islands;

    }

}

class Island{

    map = [];
    map_inner_islands = [];
    map_points = [];
    inner_islands = [];
    bounds = null;
    algorythm = 0;

    constructor(map, bounds, algorythm){

        console.log('-------------> ISLAND CONSTRUCTOR', map, bounds);

        this.map = JSON.parse(JSON.stringify(map));
        this.map_inner_islands = this.map.map(array=> { return array.map( el => { return 0; } ); });
        this.bounds = bounds;
        this.algorythm = algorythm;

        //Look for inner islands

        console.log('GET INNER ISLANDS:');

        var inner_algorythm = 0;
        if(!this.algorythm) inner_algorythm = 1;

        var inner_islands_found = false;

        for(let rx = this.bounds.min_r; rx <= this.bounds.max_r; rx++){
            for(let cx = this.bounds.min_c; cx <= this.bounds.max_c; cx++){
                if(!this.map[rx][cx]){

                    let recursiveChecker = new RecursiveChecker(this.map, inner_algorythm);
                    let result = recursiveChecker.recursiveCheckBounds(rx, cx, 0, bounds);

                    if(!result){
                        console.log('SET INNER MAP 1');
                        this.map_inner_islands[rx][cx] = 1;
                        inner_islands_found = true;
                    }

                }
            }
        }

        //get inner islands from islands map

        if(inner_islands_found){

            console.log('Create inner islands:');

            const island_map = new IslandMap(this.map_inner_islands, this.algorythm);
            this.inner_islands = island_map.getIslands();

            console.log('MAP OF INNER ISLANDS', this.map_inner_islands);
            //console.log(this.inner_islands);

        }

    }

    getPointsMap(){
        
        this.map_points = new Array(this.map.length * 3);

        for(let y = 0; y < this.map.length * 3; y++){

            this.map_points[y] = new Array(this.map[0].length * 3);

            for(let x = 0; x < this.map[0].length * 3; x++){
                this.map_points[y][x] = 0;
            }

        }

        for(let y = this.bounds.min_r; y <= this.bounds.max_r; y++){
            for(let x = this.bounds.min_c; x <= this.bounds.max_c; x++){
                if(this.map[y][x] == 1){

                    if((typeof this.map[y-1][x] == 'undefined' || this.map[y-1][x] == 0) && this.map_inner_islands[y-1][x] == 0){ //top of point
                        this.map_points[y*2][x*2] = 1;
                        this.map_points[y*2][x*2+1] = 1;
                        this.map_points[y*2][x*2+2] = 1;
                    }

                    if((typeof this.map[y+1][x] == 'undefined' || this.map[y+1][x] == 0) && this.map_inner_islands[y+1][x] == 0){ //bottom of point
                        this.map_points[(y+1)*2][x*2] = 1;
                        this.map_points[(y+1)*2][x*2+1] = 1;
                        this.map_points[(y+1)*2][x*2+2] = 1;
                    }

                    if((typeof this.map[y][x-1] == 'undefined' || this.map[y][x-1] == 0) && this.map_inner_islands[y][x-1] == 0){ //left side of point
                        this.map_points[y*2][x*2] = 1;
                        this.map_points[y*2+1][x*2] = 1;
                        this.map_points[y*2+2][x*2] = 1;
                    }

                    if((typeof this.map[y][x+1] == 'undefined' || this.map[y][x+1] == 0) && this.map_inner_islands[y][x+1] == 0){ //right side of point
                        this.map_points[y*2][(x+1)*2] = 1;
                        this.map_points[y*2+1][(x+1)*2] = 1;
                        this.map_points[y*2+2][(x+1)*2] = 1;
                    }

                }
            }
        }

        console.log('Map points:');
        console.log(this.map_points);

        this.inner_islands.forEach(function(island){
            console.log('GET INNER ISLAND POINT MAP');
            island.getPointsMap();
        });

    }

}

class RecursiveChecker{

    map = [];
    source = [];
    algorythm = 0;
    filled_valie = 1;
    unfilled_value = 0;

    constructor(source, algorythm){
        this.algorythm = algorythm;
        this.source = JSON.parse(JSON.stringify(source));
    }

    recursiveCheck(r, c, map, bounds){

        if(this.source[r] && typeof this.source[r][c] != undefined){

            if(this.source[r][c] == this.filled_valie){

                bounds.setBounds(r,c);

                this.source[r][c] = this.unfilled_value;
                map[r][c] = this.filled_valie;

                this.recursiveCheck(r + 1, c, map, bounds);
                this.recursiveCheck(r - 1, c, map, bounds);
                this.recursiveCheck(r, c + 1, map, bounds);
                this.recursiveCheck(r, c - 1, map, bounds);

                if(this.algorythm){

                    this.recursiveCheck(r + 1, c + 1, map, bounds);
                    this.recursiveCheck(r - 1, c - 1, map, bounds);
                    this.recursiveCheck(r - 1, c + 1, map, bounds);
                    this.recursiveCheck(r + 1, c - 1, map, bounds);

                }

            }

        }

    }

    recursiveCheckBounds(r, c, type, bounds){

        if(this.source[r][c] == type){

            if(r == bounds.min_r || r == bounds.max_r){
                return true;
            }
            
            if(c == bounds.max_c || c == bounds.min_c){
                return true;
            }

            this.source[r][c] = -1;

            if(
                this.recursiveCheckBounds(r + 1,c, type, bounds) || 
                this.recursiveCheckBounds(r - 1,c, type, bounds) || 
                this.recursiveCheckBounds(r, c + 1, type, bounds) || 
                this.recursiveCheckBounds(r, c - 1, type, bounds)
            ) return true;

            if(!this.algorythm){

                if(
                    this.recursiveCheckBounds(r + 1, c + 1, type, bounds) ||
                    this.recursiveCheckBounds(r - 1, c - 1, type, bounds) ||
                    this.recursiveCheckBounds(r - 1, c + 1, type, bounds) ||
                    this.recursiveCheckBounds(r + 1, c - 1, type, bounds)
                ) return true;

            }

        }

        return false;

    }

}

class Bounds{

    min_r = null;
    min_c = null;
    max_r = null;
    max_c = null;

    constructor(){

    }

    setBounds(r,c){


        if(this.min_r === null || this.min_r > r){
            this.min_r = r;
        }

        if(this.min_c === null || this.min_c > c){
            this.min_c = c;
        }

        if(this.max_r === null || this.max_r < r){
            this.max_r = r;
        }

        if(this.max_c === null || this.max_c < c){
            this.max_c = c;
        }

    }


}

class Point{

    x = 0;
    y = 0;

    constructor(x,y){
        this.x = x
        this.y = y;
    }

}