class ThreeObjectFactory{

    #scene = null;

    constructor(scene){
        this.#scene = scene;
    }

    createBox(options){

        options.x = options.x?options.x:0;
        options.y = options.y?options.y:0;
        options.z = options.z?options.z:0;

        options.width = options.width?options.width:1;
        options.height = options.height?options.height:1;
        options.depth = options.depth?options.depth:1;
        options.color = options.color?options.color:0xDDDDDD;

        const geometry = new THREE.BoxGeometry(options.width, options.height, options.depth);
        const material = new THREE.MeshLambertMaterial( { color: options.color } );
        const cube = new THREE.Mesh( geometry, material );

        cube.position.x = options.x;
        cube.position.y = options.y;
        cube.position.z = options.z;

        if(options.layer){
            cube.layers.set(options.layer);
        }

        this.#scene.add(cube);
        return cube;

    }

}