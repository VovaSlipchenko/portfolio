class ElementPower{
    
    constructor(x,y,number, dir){
        this.x = x;
        this.y = y;
        this.number = number;
        this.direction = 0;
        console.log('power constructor');
    }

    direction = 0;
    param = 0;
    param_letter = "E";
    number = 0;
    x = 0;
    y = 0;

    multi_element = false;

    error = false;

    nextDirection(){
        this.direction++;
        console.log('Direction '+this.direction);
    }

    eventClick(x, y){

    }

    eventElementAdded(){

    }

    createElement(x, y, number, direction){
        return [new ElementPower(x, y, number, direction)];
    }

    checkError(field_manager){

        const result = field_manager.getElementsAroundAmount(this.x, this.y);

        console.log('Check error result', result);

        if(result.total_elements != 2){
            this.error = true;
            return true;
        }

        if(!(result.total_elements_vertical == 2 || result.total_elements_horizontal == 2)){
            this.error = true;
            return true;
        }

        this.error = false;
        return false;

    }

    render(context, cell_size, field_manager){

        
        const center_real_x = this.x * cell_size + cell_size / 2;
        const center_real_y = this.y * cell_size + cell_size / 2;

        const top_real_y = this.y * cell_size;
        const bottom_real_y = (this.y + 1) * cell_size;

        const left_real_x = this.x * cell_size;
        const right_real_x = (this.x + 1) * cell_size;

        this.checkError(field_manager);

        console.log('Error',this.error);

        const margin_small = cell_size / 6;
        const margin_big = cell_size / 3;

        if(!this.error){

            let result = field_manager.getElementsAroundAmount(this.x, this.y);
            let radius = cell_size/4;

            context.beginPath();

            context.arc(center_real_x, center_real_y, radius, 0, 2 * Math.PI);

            if(result.total_elements_horizontal){

                context.moveTo(left_real_x, center_real_y);
                context.lineTo(left_real_x + (cell_size / 2 - radius), center_real_y);

                context.moveTo(right_real_x, center_real_y);
                context.lineTo(right_real_x - (cell_size / 2 - radius), center_real_y);

            } else {

                context.moveTo(center_real_x, top_real_y);
                context.lineTo(center_real_x, top_real_y + (cell_size / 2 - radius));
                
                context.moveTo(center_real_x, bottom_real_y);
                context.lineTo(center_real_x, bottom_real_y - (cell_size / 2 - radius));

            }

            context.strokeStyle = 'rgba(0, 0, 0, 1)';
            context.stroke();

        }

    }

}


class ElementResistor{
    
    constructor(x,y,number, dir){
        this.x = x;
        this.y = y;
        this.number = number;
        this.direction = 0;
    }

    direction = 0;
    param = 0;
    param_letter = "R";
    number = 0;
    x = 0;
    y = 0;

    multi_element = false;

    error = false;

    nextDirection(){

    }

    eventClick(x, y){

    }

    eventElementAdded(){

    }

    createElement(x, y, number, direction){
        return [new ElementResistor(x, y, number, direction)];
    }

    checkError(field_manager){

        const result = field_manager.getElementsAroundAmount(this.x, this.y);

        console.log('Check error result', result);

        if(result.total_elements != 2){
            this.error = true;
            return true;
        }

        if(!(result.total_elements_vertical == 2 || result.total_elements_horizontal == 2)){
            this.error = true;
            return true;
        }

        this.error = false;
        return false;

    }

    render(context, cell_size, field_manager){

        
        const center_real_x = this.x * cell_size + cell_size / 2;
        const center_real_y = this.y * cell_size + cell_size / 2;

        const top_real_y = this.y * cell_size;
        const bottom_real_y = (this.y + 1) * cell_size;

        const left_real_x = this.x * cell_size;
        const right_real_x = (this.x + 1) * cell_size;

        this.checkError(field_manager);

        console.log('Error',this.error);

        const margin_small = cell_size / 6;
        const margin_big = cell_size / 3;

        if(!this.error){

            let result = field_manager.getElementsAroundAmount(this.x, this.y);

            context.beginPath();

            if(result.total_elements_horizontal){

                context.rect(center_real_x - margin_big, center_real_y - margin_small, margin_big * 2, margin_big);

                context.moveTo(left_real_x, center_real_y);
                context.lineTo(left_real_x + margin_small, center_real_y);

                context.moveTo(right_real_x, center_real_y);
                context.lineTo(right_real_x - margin_small, center_real_y);

            } else {

                context.rect(center_real_x - margin_small, center_real_y - margin_big, margin_big, margin_big * 2);

                context.moveTo(center_real_x, top_real_y);
                context.lineTo(center_real_x, top_real_y + margin_small);

                context.moveTo(center_real_x, bottom_real_y);
                context.lineTo(center_real_x, bottom_real_y - margin_small);
                
            }

            context.strokeStyle = 'rgba(0, 0, 0, 1)';
            context.stroke();

        }

    }

}

//

class ElementWire{

    constructor(x,y,number, dir){
        this.x = x;
        this.y = y;
        this.number = number;
        this.direction = 0;
    }

    direction = 0;
    param = 0;
    param_letter = "";
    number = 0;
    x = 0;
    y = 0;

    add_from_x = false;
    add_from_y = false;

    add_to_x = false;
    add_to_y = false;

    multi_element = true;

    error = false;

    nextDirection(){

    }

    eventClick(x, y){

        if(this.add_from_x !== false && this.add_to_x === false){
            this.add_to_x = x;
            this.add_to_y = y;
        }

        if(this.add_from_x === false){
            this.add_from_x = x;
            this.add_from_y = y;
        }

    }

    eventElementAdded(){

        this.add_from_x = false;
        this.add_from_y = false;

        this.add_to_x = false;
        this.add_to_y = false;

    }

    createElement(x, y, number, direction){

        if(this.add_from_x !== false){

            let from_x = this.add_from_x;
            let from_y = this.add_from_y;

            let to_x = this.add_to_x?this.add_to_x:x;
            let to_y = this.add_to_y?this.add_to_y:y;

            if(from_x > to_x){
                let temp = to_x;
                to_x = from_x;
                from_x = temp;
            } 

            if(from_y > to_y){
                let temp = to_y;
                to_y = from_y;
                from_y = temp;
            }

            console.log('ADD PROCEDURE');

            let elements = [];

            if(from_x == to_x && from_y != to_y){ //vertical line
                for(let c_y = from_y; c_y < to_y+1; c_y++){
                    elements.push(new ElementWire(x, c_y, number, direction));
                }
                return elements;
            }

            if(from_y == to_y && from_x != to_x){ //horizontal line
                for(let c_x = from_x; c_x < to_x+1; c_x++){
                    elements.push(new ElementWire(c_x, y, number, direction));
                }
                return elements;
            }

            if(from_y != to_y && from_x != to_x){ //square

                for(let c_x = from_x; c_x < to_x+1; c_x++){ //top line
                    elements.push(new ElementWire(c_x, from_y, number, direction));
                }
                for(let c_x = from_x; c_x < to_x+1; c_x++){ //bottom line
                    elements.push(new ElementWire(c_x, to_y, number, direction));
                }
                for(let c_y = from_y+1; c_y < to_y; c_y++){ //left line
                    elements.push(new ElementWire(from_x, c_y, number, direction));
                }
                for(let c_y = from_y+1; c_y < to_y; c_y++){ //right line
                    elements.push(new ElementWire(to_x, c_y, number, direction));
                }
                return elements;
            }

        } else {

            console.log('ADD PROCEDURE');

            if(this.add_from_x == this.add_from_x && this.add_from_y == this.add_from_y){ //single element
                return [ new ElementWire(x, y, number, direction) ];
            }

        }

    }

    checkError(field_manager){
        return false;   
    }

    render(context, cell_size, field_manager){

        const center_real_x = this.x * cell_size + cell_size / 2;
        const center_real_y = this.y * cell_size + cell_size / 2;

        context.beginPath();
        //

        let elem_found = 0;

        let el = field_manager.getElement(this.x + 1, this.y);
        //console.log('x+1', el);
        if(el){
            context.moveTo(center_real_x, center_real_y);
            context.lineTo(center_real_x + cell_size / 2, center_real_y);
            elem_found++;
        }

        el = field_manager.getElement(this.x - 1, this.y);
        //console.log('x-1', el);
        if(el){
            context.moveTo(center_real_x, center_real_y);
            context.lineTo(center_real_x - cell_size / 2, center_real_y);
            elem_found++;
        }

        el = field_manager.getElement(this.x, this.y - 1);
        //console.log('y-1', el);
        if(el){
            context.moveTo(center_real_x, center_real_y);
            context.lineTo(center_real_x, center_real_y - cell_size / 2);
            elem_found++;
        }

        el = field_manager.getElement(this.x, this.y + 1);
        //console.log('y+1', el);
        if(el){
            context.moveTo(center_real_x, center_real_y);
            context.lineTo(center_real_x, center_real_y + cell_size / 2);
            elem_found++;
        }

        context.strokeStyle = 'rgba(0, 0, 0, 1)';
        context.stroke();

        if(!elem_found){
            context.beginPath();
            context.arc(center_real_x, center_real_y, 4, 0, 2*Math.PI);
            context.strokeStyle = 'rgba(0, 0, 0, 1)';
            context.stroke();
        }

        if(elem_found>2){
            context.beginPath();
            context.arc(center_real_x, center_real_y, 2, 0, 2*Math.PI);
            context.strokeStyle = 'rgba(0, 0, 0, 1)';
            context.stroke();
        }

    }

}