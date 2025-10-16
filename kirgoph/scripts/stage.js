
        class WorkingStage{

            #width = 13;
            #height = 9;

            #cell_size = 70;

            #table = null;
            #canvas = null;
            #context = null;

            #tableEds = null;
            #tableRes = null;

            #field = [];
            #field_temp = [];

            #current_mode = WorkingStageModes.MODE_ADD_ELEMENT;
            #current_mode_element = new ElementWire(0,0,0,0);

            #previous_seletected_cell = {x:-1, y:-1};

            constructor(options){

                this.#table = options.table;
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

                this.render();
                this.initTable();

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

                const current_cell = this.getCurrentCellByCoords(event.offsetX, event.offsetY);
                const field_manager = new FieldManager(this.#field, this.#field_temp);

                this.#current_mode_element.x = current_cell.x;
                this.#current_mode_element.y = current_cell.y;

                if(current_cell.x != this.#previous_seletected_cell.x || current_cell.y != this.#previous_seletected_cell.y){

                    
                    
                    if(this.#current_mode == WorkingStageModes.MODE_ADD_ELEMENT){

                        let existed_element = field_manager.getElement(current_cell.x, current_cell.y, true);

                        //console.log('existed_element', existed_element);
                        //console.log('current_mode_element', this.#current_mode_element);

                        if(!existed_element || (existed_element && existed_element.constructor != this.#current_mode_element.constructor)){

                            let elems = this.#current_mode_element.createElement(
                                current_cell.x, 
                                current_cell.y, 
                                0, 
                                this.#current_mode_element.direction, 
                                field_manager);
                            this.updateTempField(elems);

                        }

                    }

                    if(this.#current_mode == WorkingStageModes.MODE_REMOVE_ELEMENT){
                        
                        this.updateTempField([new ElementEraser(current_cell.x, current_cell.y)]);

                    }

                    this.#previous_seletected_cell.x = current_cell.x;
                    this.#previous_seletected_cell.y = current_cell.y;

                }

            }

            eventOnMouseWheel(event){

                if(this.#current_mode == WorkingStageModes.MODE_ADD_ELEMENT){

                    const current_cell = this.getCurrentCellByCoords(event.offsetX, event.offsetY);
                    const field_manager = new FieldManager(this.#field, this.#field_temp);

                    if(this.#current_mode == WorkingStageModes.MODE_SELECT_ELEMENT){
                        if(this.#field[current_cell.y][current_cell.x]){
                            this.#field[current_cell.y][current_cell.x].nextDirection();
                        }
                    }

                    if(this.#current_mode == WorkingStageModes.MODE_ADD_ELEMENT){
                        this.#current_mode_element.nextDirection(1, field_manager);

                        let elems = this.#current_mode_element.createElement(current_cell.x, current_cell.y, 0, this.#current_mode_element.direction, field_manager);
                        this.updateTempField(elems);
                    }

                }

            }

            eventOnMouseClick(event){


                const current_cell = this.getCurrentCellByCoords(event.offsetX, event.offsetY);
                const field_manager = new FieldManager(this.#field, this.#field_temp);

                if(this.#current_mode == WorkingStageModes.MODE_ADD_ELEMENT){

                    this.#current_mode_element.eventClick(current_cell.x, current_cell.y, field_manager);
                    let elems = this.#current_mode_element.createElement(current_cell.x, current_cell.y, field_manager.getElementNextNumber(this.#current_mode_element.param_letter), this.#current_mode_element.direction, field_manager);

                    if(elems){
                        this.#current_mode_element.eventElementAdded();
                        for(let i = 0; i < elems.length; i++){
                            this.#field[elems[i].y][elems[i].x] = elems[i];
                        }
                    }
                    
                    this.render();
                    this.renderTable();

                }

                if(this.#current_mode == WorkingStageModes.MODE_REMOVE_ELEMENT){
                    field_manager.removeElement(current_cell.x, current_cell.y);
                    this.render();
                    this.renderTable();
                }

            }

            eventOnMouseRightClick(event){
                event.preventDefault();
            }

            setMode(mode, element){
                this.#current_mode = mode;
                this.#current_mode_element = element;
            }

            getCurrentCellByCoords(x,y){
                return {x: Math.floor(x / this.#cell_size), y: Math.floor(y / this.#cell_size) }
            }

            initTable(){

                let holderEds = document.createElement("div");
                holderEds.className = 'table-holder';
                this.#tableEds = holderEds;
                this.#table.appendChild(holderEds);

                let holderRes = document.createElement("div");
                holderRes.className = 'table-holder';
                this.#tableRes = holderRes;
                this.#table.appendChild(holderRes);

            }

            renderTable(){

            }

            render(){

                //console.log('render');

                this.#context.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
                this.drawNet();

                const field_manager = new FieldManager(this.#field, this.#field_temp);

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