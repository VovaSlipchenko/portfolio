
        class WorkingStage{

            #width = 12;
            #height = 10;

            #cell_size = 70;

            #canvas = null;
            #context = null;

            #field = [];
            #field_temp = [];

            #current_mode = WorkingStageModes.MODE_ADD_ELEMENT;
            #current_mode_element = new ElementWire(0,0,0,0);

            #previous_seletected_cell = {x:-1, y:-1};

            constructor(options){

                this.#canvas = options.canvas;
                this.#context = this.#canvas.getContext('2d');

                this.#width = options.width?options.width:this.#width;
                this.#height = options.height?options.height:this.#height;
                this.#cell_size = options.cell_size?options.cell_size:this.#cell_size;

                this.#canvas.setAttribute('width', (this.#width * this.#cell_size) +'px');
                this.#canvas.setAttribute('height', (this.#height * this.#cell_size) +'px');

                this.#canvas.onclick = this.eventOnMouseClick.bind(this);
                this.#canvas.onmousemove = this.eventOnMouseMove.bind(this);
                this.#canvas.onwheel = this.eventOnMouseWheel.bind(this);
                this.#canvas.oncontextmenu = this.eventOnMouseRightClick.bind(this);

                /*
                this.#field = Array(this.#height).fill(Array(this.#width).fill(false));
                this.#field_temp = Array(this.#height).fill(Array(this.#width).fill(false));
                */

                for(let y = 0; y < this.#height; y++){

                    this.#field[y] = new Array();
                    this.#field_temp[y] = new Array();
                    
                    for(let x = 0; x < this.#width; x++){
                        this.#field[y][x] = false;
                        this.#field_temp[y][x] = false;
                    }
                    
                }

                console.log(this.#field);

                this.render();

            }

            updateTempField(elems){

                const field_manager = new FieldManager(this.#field, this.#field_temp);

                for(let y = 0; y < this.#height; y++){
                    this.#field_temp[y] = new Array();
                    for(let x = 0; x < this.#width; x++){
                        this.#field_temp[y][x] = false;
                    }
                }

                if(elems){
                    for(let i = 0; i < elems.length; i++){
                        elems[i].checkError(field_manager);
                        this.#field_temp[elems[i].y][elems[i].x] = elems[i];
                    }
                }

                this.render();

            }

            eventOnMouseMove(event){
                //console.log(event.layerX,event.layerY);
                const current_cell = this.getCurrentCellByCoords(event.layerX, event.layerY);

                console.log(current_cell, this.#previous_seletected_cell);

                if(current_cell.x != this.#previous_seletected_cell.x || current_cell.y != this.#previous_seletected_cell.y){

                    console.log('CELL CHANGED');

                    if(this.#current_mode == WorkingStageModes.MODE_ADD_ELEMENT){

                        let elems = this.#current_mode_element.createElement(current_cell.x, current_cell.y,0,0);
                        this.updateTempField(elems);

                    }

                    this.#previous_seletected_cell.x = current_cell.x;
                    this.#previous_seletected_cell.y = current_cell.y;

                }

            }

            eventOnMouseWheel(event){

                const current_cell = this.getCurrentCellByCoords(event.layerX, event.layerY);

                if(this.#current_mode == WorkingStageModes.MODE_SELECT_ELEMENT){
                    if(this.#field[current_cell.y][current_cell.x]){
                        this.#field[current_cell.y][current_cell.x].nextDirection();
                    }
                }

                if(this.#current_mode == WorkingStageModes.MODE_ADD_ELEMENT){
                    this.#current_mode_element.nextDirection();
                    let elems = this.#current_mode_element.createElement(current_cell.x, current_cell.y,0,0);
                    this.updateTempField(elems);
                }

            }

            eventOnMouseClick(event){

                const current_cell = this.getCurrentCellByCoords(event.layerX, event.layerY);

                console.log('Click on:',current_cell);

                if(this.#current_mode == WorkingStageModes.MODE_ADD_ELEMENT){

                    this.#current_mode_element.eventClick(current_cell.x, current_cell.y);

                    let elems = this.#current_mode_element.createElement(current_cell.x, current_cell.y,0,0);

                    console.log('Returned elements:', elems);

                    if(elems){
                        this.#current_mode_element.eventElementAdded();
                        for(let i = 0; i < elems.length; i++){
                            this.#field[elems[i].y][elems[i].x] = elems[i];
                            console.log('ADD ELEM ['+elems[i].x+'|'+elems[i].y+']s');
                            console.log(this.#field);
                        }
                    }
                    this.render();
                }

            }

            eventOnMouseRightClick(event){
                event.preventDefault();
                this.setMode(WorkingStageModes.MODE_ADD_ELEMENT, new ElementPower(0,0,0,0));
            }



            setMode(mode, element){
                this.#current_mode = mode;
                this.#current_mode_element = element;
            }

            getCurrentCellByCoords(x,y){
                return {x: Math.floor(x / this.#cell_size), y: Math.floor(y / this.#cell_size) }
            }

            render(){

                this.#context.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
                this.drawNet();

                console.log('render');

                const field_manager = new FieldManager(this.#field, this.#field_temp);

                console.log(this.#field);

                for(let y = 0; y < this.#field.length; y++){
                    for(let x = 0; x < this.#field[y].length; x++){
                        if(this.#field_temp[y][x] && !this.#field_temp[y][x].error){
                            this.#field_temp[y][x].render(this.#context, this.#cell_size, field_manager);
                        } else if(this.#field[y][x]){
                            this.#field[y][x].render(this.#context, this.#cell_size, field_manager);
                        }
                    }
                }

            }

            drawNet(){

                this.#context.beginPath();

                for(let y = 0; y < this.#height + 1; y++){
                    this.#context.moveTo(0, y * this.#cell_size);
                    this.#context.lineTo(this.#width * this.#cell_size, y * this.#cell_size);
                }

                for(let x = 0; x < this.#width + 1; x++){
                    this.#context.moveTo(x*this.#cell_size, 0);
                    this.#context.lineTo(x*this.#cell_size, this.#height * this.#cell_size);
                }   

                this.#context.strokeStyle = 'rgba(200, 200, 200, 0.5)';
                this.#context.stroke();

            }

        }