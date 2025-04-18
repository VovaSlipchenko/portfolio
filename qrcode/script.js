class QRCodeRenderer{

    source = [];
    islands = [];
    algorythm = 0;

    windth = 200;
    height = 200;

    c_width = 0;
    c_heihgt = 0;

    constructor(source, options){

        this.algorythm = options.algorythm;
        this.windth = options.width;
        this.height = options.height;

        this.c_width = source[0].length;
        this.c_heihgt = source.length;

        this.parent = options.parent;
        this.step = this.windth / source.length;

        console.log('');
        console.log('Init params:');
        console.log('');

        console.log('windth:', this.windth);
        console.log('height:', this.height);
        console.log('cWidth:', this.c_width);
        console.log('cHeihgt:', this.c_heihgt);
        console.log('');

        this.source = JSON.parse(JSON.stringify(source));
        const map = new IslandMap(this.source, this.algorythm);
        this.islands = map.getIslands();

        console.log('Final islands:', this.islands);

        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute('width', this.windth+'px');
        svg.setAttribute('height', this.height+'px');
        this.parent.appendChild(svg);

        var i = 0;
        this.islands.forEach((island)=>{
            //if(i == 1){
                island.getPointsMap(this.step);
            //}
            i++;
        });

        var i = 0;
        this.islands.forEach((island)=>{
            //if(i == 1){
                this.drawIsland(svg, island);
            //}
            i++;
        });

        console.log('ISLANDS:', this.islands);

    }

    drawIsland(svg, island){

        console.log('DRAW ISLAND');

        let element = document.createElementNS("http://www.w3.org/2000/svg", "path");

        var path_main = island.getPointsPath(1);
        let path = this.getSvgPath(path_main);

        island.inner_islands.forEach(inner=>{
            //console.log('island inner:', inner);
            var path_inner = inner.getPointsPath(0);
            //console.log('PATH INNER:',path_inner);
            path += this.getSvgPath(path_inner);
        });

        element.setAttribute('d', path);

        svg.appendChild(element);



        //Find first points
        let end = false;


        return element;

    }

    getSvgPath(points){

        console.log('------------------------------');

        console.log('Points:', points);

        points.push(points[0]);
        points.push(points[1]);

        let path = 'M '+points[1].x+' '+points[1].y+' ';

        let i = 1;
        while(i < points.length - 2){

            //path += 'L '+(points[i+1].x)+' '+(points[i+1].y)+' ';
            //i++;

            if(this.pointsOnSameAxis([points[i], points[i+1], points[i+2]])){
                path += 'L '+(points[i+1].x)+' '+(points[i+1].y)+' ';
                i+=1;
                //console.log('inc 1');
            } else {
                path += 'C '+(points[i].x)+' '+(points[i].y)+' '+(points[i+1].x)+' '+(points[i+1].y)+' '+(points[i+2].x)+' '+(points[i+2].y);
                i+=2;
                //console.log('inc 2');
            }

            //console.log('i = '+i);
            
        }

        //points.forEach(point=>{  
        //});

        return path;
    }

    pointsOnSameAxis(points){

        const result_x = points.every(point => {
            if (Math.round(point.x) === Math.round(points[0].x)) {
              return true;
            } else {
                return false;
            }
          });

        const result_y = points.every(point => {
            if (Math.round(point.y) === Math.round(points[0].y)) {
              return true;
            } else {
                return false;
            }
        });
        
        return result_x || result_y;

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
    path_points = [];
    inner_islands = [];
    bounds = null;
    algorythm = 0;

    constructor(map, bounds, algorythm){

        //console.log('-------------> ISLAND CONSTRUCTOR', map, bounds);

        this.map = JSON.parse(JSON.stringify(map));
        this.map_inner_islands = this.map.map(array=> { return array.map( el => { return 0; } ); });
        this.bounds = bounds;
        this.algorythm = algorythm;

        //Look for inner islands

        //console.log('GET INNER ISLANDS:');

        var inner_algorythm = 0;
        if(!this.algorythm) inner_algorythm = 1;

        var inner_islands_found = false;

        for(let rx = this.bounds.min_r; rx <= this.bounds.max_r; rx++){
            for(let cx = this.bounds.min_c; cx <= this.bounds.max_c; cx++){
                if(!this.map[rx][cx]){

                    let recursiveChecker = new RecursiveChecker(this.map, inner_algorythm);
                    let result = recursiveChecker.recursiveCheckBounds(rx, cx, 0, bounds);

                    if(!result){
                        //console.log('SET INNER MAP 1');
                        this.map_inner_islands[rx][cx] = 1;
                        inner_islands_found = true;
                    }

                }
            }
        }

        //get inner islands from islands map

        if(inner_islands_found){

            //console.log('Create inner islands:');

            const island_map = new IslandMap(this.map_inner_islands, this.algorythm);
            this.inner_islands = island_map.getIslands();

            //console.log('MAP OF INNER ISLANDS', this.map_inner_islands);
            //console.log(this.inner_islands);

        }

    }

    getPointsMap(step){

        this.map_points = new Array(this.map.length * 3);
        this.map_points_coords = new Array(this.map.length * 3);

        for(let y = 0; y < this.map.length * 3; y++){

            this.map_points[y] = new Array(this.map[0].length * 3);
            this.map_points_coords[y] = new Array(this.map[0].length * 3);

            for(let x = 0; x < this.map[0].length * 3; x++){
                this.map_points[y][x] = 0;
            }

        }

        const mul = 2;

        for(let y = this.bounds.min_r; y <= this.bounds.max_r; y++){
            for(let x = this.bounds.min_c; x <= this.bounds.max_c; x++){
                if(this.map[y][x] == 1){

                    if(y == 0 || (y != 0 && (this.map_inner_islands[y-1][x] == 0 && this.map[y-1][x] == 0))){ //top of point

                        this.map_points[y*mul][x*mul] = 1;
                        this.map_points[y*mul][x*mul+1] = 1;
                        this.map_points[y*mul][x*mul+2] = 1;

                        this.map_points_coords[y*mul][x*mul]   = { x: x * step, y: y * step};
                        this.map_points_coords[y*mul][x*mul+1] = { x: x * step + step / 2, y: y * step};
                        this.map_points_coords[y*mul][x*mul+2] = { x: x * step + step, y: y * step};

                    }

                    if(y == this.bounds.max_r || (y != this.bounds.max_r && (this.map_inner_islands[y+1][x] == 0 && this.map[y+1][x] == 0))){ //bottom of point

                        this.map_points[y*mul+2][x*mul] = 1;
                        this.map_points[y*mul+2][x*mul+1] = 1;
                        this.map_points[y*mul+2][x*mul+2] = 1;

                        this.map_points_coords[y*mul+2][x*mul]   = { x: x * step, y: y * step + step};
                        this.map_points_coords[y*mul+2][x*mul+1] = { x: x * step + step / 2, y: y * step  + step};
                        this.map_points_coords[y*mul+2][x*mul+2] = { x: x * step + step, y: y * step + step};

                    }

                    if(x == 0 || (x != 0 && (this.map_inner_islands[y][x-1] == 0 && this.map[y][x-1] == 0))){ //left side of point

                        this.map_points[y*mul][x*mul] = 1;
                        this.map_points[y*mul+1][x*mul] = 1;
                        this.map_points[y*mul+2][x*mul] = 1;

                        this.map_points_coords[y*mul][x*mul]   = { x: x * step, y: y * step};
                        this.map_points_coords[y*mul+1][x*mul] = { x: x * step, y: y * step + step / 2};
                        this.map_points_coords[y*mul+2][x*mul] = { x: x * step, y: y * step + step};

                    }

                    if(x == this.bounds.max_c || (x!=this.bounds.max_c && (this.map_inner_islands[y][x+1] == 0 && this.map[y][x+1] == 0))){ //right side of point

                        this.map_points[y*mul][x*mul+2] = 1;
                        this.map_points[y*mul+1][x*mul+2] = 1;
                        this.map_points[y*mul+2][x*mul+2] = 1;

                        this.map_points_coords[y*mul][x*mul+2]   = { x: x * step + step, y: y * step};
                        this.map_points_coords[y*mul+1][x*mul+2] = { x: x * step + step, y: y * step + step / 2};
                        this.map_points_coords[y*mul+2][x*mul+2] = { x: x * step + step, y: y * step + step};

                    }

                }
            }
        }

        console.log('Map points:');
        console.log_matrix(this.map_points);
        console.log('Map coords:');
        console.log(this.map_points_coords);


        this.inner_islands.forEach(island => {
            console.log('GET INNER ISLAND POINT MAP');
            island.getPointsMap(step);
        });


    }

    getPointsPath(direction){

        let pointsMain = new Array();
        let current_x = false;
        let current_y = false;

        const checks = [{x:0, y: -1},{x:0, y: 1},{x:1, y: 0},{x:-1, y: 0}];

        for(let y = 0; y <= this.map_points.length-1; y++){
            for(let x = 0; x <= this.map_points[y].length-1; x++) {
                if(this.map_points[y][x] == 1 && current_x === false && current_y === false){
                    current_x = x;
                    current_y = y;
                    break;
                }
            }
        }

        if(direction == 1){ //Left to right

            console.log('START WITH: ',[current_x, current_y]);

            this.map_points[current_y][current_x] = 2;
            pointsMain.push(this.map_points_coords[current_y][current_x]);
            current_x++;
            this.map_points[current_y][current_x] = 2;
            pointsMain.push(this.map_points_coords[current_y][current_x]);

            console.log(pointsMain);


        }

        if(direction == 0){ //Right to left

            console.log('START WITH: ',[current_x, current_y]);

            current_x++;
            this.map_points[current_y][current_x] = 2;
            pointsMain.push(this.map_points_coords[current_y][current_x]);
            current_x--;
            this.map_points[current_y][current_x] = 2;
            pointsMain.push(this.map_points_coords[current_y][current_x]);

            console.log(pointsMain);

        }

        for(var i = 0; i < 200; i++){
            checks.forEach(c=>{
                if(current_y+c.y >= 0 && current_x+c.x >= 0) {
                    if (this.map_points[current_y + c.y][current_x + c.x] == 1) {
                        current_y += c.y;
                        current_x += c.x;
                        //console.log('CURRENT WITH: ', [current_x, current_y]);
                        //console.log(this.map_points_coords[current_y][current_x]);
                        this.map_points[current_y][current_x] = 2;
                        pointsMain.push(this.map_points_coords[current_y][current_x]);
                    }
                }

            })
        }

        console.log('FINAL:');
        console.log(pointsMain);

        return pointsMain;


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

console.__proto__.figures = {
    'rect': {
        'red': String.fromCodePoint(0x1F7E5),
        'gray': String.fromCodePoint(0x2B1C),
        'green': String.fromCodePoint(0x1F7E9),
        'yellow': String.fromCodePoint(0x1F7E8)
    }
}

console.__proto__.log_matrix = function(array, options){

    let colors = options?options:{};

    colors[-1] = colors[-1]?colors[-1]:this.figures.rect.red;
    colors[0] = colors[0]?colors[0]:this.figures.rect.gray;
    colors[1] = colors[1]?colors[1]:this.figures.rect.green;
    colors[2] = colors[2]?colors[2]:this.figures.rect.yellow;

    let unknown = '❔';
    let log_str = '';

    for(let y = 0; y <= array.length - 1; y++) {
        //console.log(array[y]);
        for (let x = 0; x <= array[y].length - 1; x++) {
            if(typeof colors[array[y][x]] != undefined){
                log_str += colors[array[y][x]];
            } else {
                log_str += unknown;
            }
        }

        log_str+="\r\n";
    }

    console.log(log_str);

}
