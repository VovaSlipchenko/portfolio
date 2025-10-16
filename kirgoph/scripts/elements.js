class Element{

    unit = '';

    constructor(){
        this.unic_id = Math.ceil(Math.random()*1000000);
    }

    drawLabel(context, left_real_x, top_real_y){

        const label_font_size = 12;
        const label_padding = 2;

        if(this.number != 0){
            context.font = label_font_size+"px Arial";
            context.fillText(this.param_letter+this.number, left_real_x + label_padding, top_real_y + label_font_size);
        }

    }

    drawValue(context, right_real_x, bottom_real_y){

    }

    checkError(field_manager){

        const result = field_manager.getElementsAroundAmount(this.x, this.y);

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

}

class ElementPower extends Element{
    
    constructor(x,y,number, dir, field_manager){
        super();
        this.x = x;
        this.y = y;
        this.number = number;        
        if(field_manager){
            let allowed_directions = this.getAllowedDirections(field_manager);
            if(allowed_directions.includes(dir)){
                this.direction = dir;
            } else {
                this.direction = allowed_directions[0];
            }
        } else {
            this.direction = dir;
        }

        this.unit = 'V';
        
    }

    direction = 0;
    param = 0;
    param_letter = "E";
    number = 0;
    x = 0;
    y = 0;

    multi_element = false;

    error = false;

    getAllowedDirections(field_manager){

        const result = field_manager.getElementsAroundAmount(this.x, this.y);

        //console.log('result', result);
        //console.log('result vertical', result.total_elements_vertical);
        //console.log('result horizontal', result.total_elements_horizontal);

        let allowed_directions = [];

        if(result.total_elements_vertical == 2){
            allowed_directions = [ElementDirections.DIR_DOWN_TO_TOP, ElementDirections.DIR_TOP_TO_DOWN];
        }

        if(result.total_elements_horizontal == 2){
            allowed_directions = [ElementDirections.DIR_RIGHT_TO_LEFT, ElementDirections.DIR_LEFT_TO_RIGHT];
        }

        return allowed_directions;

    }

    nextDirection(dir, field_manager){


        //console.log('------------------------------------------------------------');

        //console.log('x', this.x);
        //console.log('y', this.y);

        let allowed_directions = this.getAllowedDirections(field_manager);

        //console.log('allowed_directions', allowed_directions);

        if(allowed_directions.includes(this.direction)){
            if(allowed_directions.indexOf(this.direction) == 0){
                this.direction = allowed_directions[1];
            } else {
                this.direction = allowed_directions[0];
            }
        } else {
            this.direction = allowed_directions[0];
        }

        //console.log('Direction '+this.direction);
    }

    eventClick(x, y, field_manager){

    }

    eventElementAdded(){

    }

    createElement(x, y, number, direction, field_manager){
        if(!this.checkError(field_manager)){
            return [new ElementPower(x, y, number, direction, field_manager)];
        }
    }    

    render(context, cell_size, field_manager){

        if(!this.checkError(field_manager)){

            const center_real_x = this.x * cell_size + cell_size / 2;
            const center_real_y = this.y * cell_size + cell_size / 2;

            const top_real_y = this.y * cell_size;
            const bottom_real_y = (this.y + 1) * cell_size;

            const left_real_x = this.x * cell_size;
            const right_real_x = (this.x + 1) * cell_size;

            const margin_small = cell_size / 6;
            const margin_big = cell_size / 3;

            const arrow_size = 5;
            const arrow_const = 6;
        
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

            

            if(this.direction == ElementDirections.DIR_DOWN_TO_TOP || this.direction == ElementDirections.DIR_TOP_TO_DOWN){

                context.moveTo(center_real_x, center_real_y - cell_size / 6);
                context.lineTo(center_real_x, center_real_y + cell_size / 6);

                if(this.direction == ElementDirections.DIR_DOWN_TO_TOP){
                    context.moveTo(center_real_x, center_real_y - cell_size / arrow_const);
                    context.lineTo(center_real_x - arrow_size, center_real_y - cell_size / arrow_const + arrow_size);

                    context.moveTo(center_real_x, center_real_y - cell_size / arrow_const);
                    context.lineTo(center_real_x + arrow_size, center_real_y - cell_size / arrow_const + arrow_size);
                }

                if(this.direction == ElementDirections.DIR_TOP_TO_DOWN){
                    context.moveTo(center_real_x, center_real_y + cell_size / arrow_const);
                    context.lineTo(center_real_x - arrow_size, center_real_y + cell_size / arrow_const - arrow_size);

                    context.moveTo(center_real_x, center_real_y + cell_size / arrow_const);
                    context.lineTo(center_real_x + arrow_size, center_real_y + cell_size / arrow_const - arrow_size);
                }

            }

            if(this.direction == ElementDirections.DIR_RIGHT_TO_LEFT || this.direction == ElementDirections.DIR_LEFT_TO_RIGHT){

                context.moveTo(center_real_x - cell_size / arrow_const, center_real_y);
                context.lineTo(center_real_x + cell_size / arrow_const, center_real_y);

                if(this.direction == ElementDirections.DIR_RIGHT_TO_LEFT){
                    context.moveTo(center_real_x - cell_size / arrow_const, center_real_y);
                    context.lineTo(center_real_x - cell_size / arrow_const + arrow_size, center_real_y + arrow_size);

                    context.moveTo(center_real_x - cell_size / arrow_const, center_real_y);
                    context.lineTo(center_real_x - cell_size / arrow_const + arrow_size, center_real_y - arrow_size);
                }
                if(this.direction == ElementDirections.DIR_LEFT_TO_RIGHT){
                    context.moveTo(center_real_x + cell_size / arrow_const, center_real_y);
                    context.lineTo(center_real_x + cell_size / arrow_const - arrow_size, center_real_y + arrow_size);

                    context.moveTo(center_real_x + cell_size / arrow_const, center_real_y);
                    context.lineTo(center_real_x + cell_size / arrow_const - arrow_size, center_real_y - arrow_size);
                }

            }

            context.strokeStyle = 'rgba(0, 0, 0, 1)';
            context.stroke();

            this.drawLabel(context, left_real_x, top_real_y);

        }

    }

}


class ElementResistor extends Element{
    
    constructor(x,y,number, dir, field_manager){
        super();
        this.x = x;
        this.y = y;
        this.number = number;
        this.direction = 0;
        this.unit = 'Ω';
    }

    direction = 0;
    param = 0;
    param_letter = "R";
    number = 0;
    x = 0;
    y = 0;

    multi_element = false;

    error = false;

    nextDirection(dir, field_manager){

    }

    eventClick(x, y, field_manager){

    }

    eventElementAdded(){

    }

    createElement(x, y, number, direction, field_manager){
        if(!this.checkError(field_manager)){
            return [new ElementResistor(x, y, number, direction, field_manager)];
        }
    }


    render(context, cell_size, field_manager){

        if(!this.checkError(field_manager)){

            const center_real_x = this.x * cell_size + cell_size / 2;
            const center_real_y = this.y * cell_size + cell_size / 2;

            const top_real_y = this.y * cell_size;
            const bottom_real_y = (this.y + 1) * cell_size;

            const left_real_x = this.x * cell_size;
            const right_real_x = (this.x + 1) * cell_size;

            const margin_small = cell_size / 6;
            const margin_big = cell_size / 3;

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

            this.drawLabel(context, left_real_x, top_real_y);

        }

    }

}

//

class ElementWire extends Element{

    constructor(x,y,number, dir, field_manager){
        super();
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

    nextDirection(dir, field_manager){

    }

    eventClick(x, y, field_manager){

        if(this.add_from_x !== false && this.add_to_x === false){
            this.add_to_x = x;
            this.add_to_y = y;
        }

        if(this.add_from_x === false){
            if(!this.checkError(field_manager)){
                console.log('click ok');
                this.add_from_x = x;
                this.add_from_y = y;
            } else {
                console.log('click error');
            }
        }

    }

    eventElementAdded(){

        console.log('eventElementAdded');

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

            if(this.add_from_x == this.add_from_x && this.add_from_y == this.add_from_y){ //single element
                return [ new ElementWire(x, y, number, direction) ];
            }

        }

    }

    checkError(field_manager){

        const result = field_manager.getElementsAroundAmount(this.x, this.y);

        if(result.total_elements == 2 && result.total_elements_vertical == 1 && result.total_elements_horizontal == 1){
            console.log('CORNER ERROR');
            return true;
        }

        return false;   
    }

    render(context, cell_size, field_manager){

        const center_real_x = this.x * cell_size + cell_size / 2;
        const center_real_y = this.y * cell_size + cell_size / 2;

        context.beginPath();
        //

        let elem_found = 0;

        let el = field_manager.getElement(this.x + 1, this.y);
        if(el){
            context.moveTo(center_real_x, center_real_y);
            context.lineTo(center_real_x + cell_size / 2, center_real_y);
            elem_found++;
        }

        el = field_manager.getElement(this.x - 1, this.y);
        if(el){
            context.moveTo(center_real_x, center_real_y);
            context.lineTo(center_real_x - cell_size / 2, center_real_y);
            elem_found++;
        }

        el = field_manager.getElement(this.x, this.y - 1);
        if(el){
            context.moveTo(center_real_x, center_real_y);
            context.lineTo(center_real_x, center_real_y - cell_size / 2);
            elem_found++;
        }

        el = field_manager.getElement(this.x, this.y + 1);
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



class ElementEraser extends Element{

    constructor(x,y,number, dir, field_manager){
        super();
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

    nextDirection(dir, field_manager){

    }

    eventClick(x, y, field_manager){


    }

    eventElementAdded(){


    }

    createElement(x, y, number, direction){

        

    }

    checkError(field_manager){
        return false;   
    }

    render(context, cell_size, field_manager){

        //console.log('render eraser');

        const center_real_x = this.x * cell_size + cell_size / 2;
        const center_real_y = this.y * cell_size + cell_size / 2;

        let other_element = field_manager.getElement(this.x, this.y, true);

        if(other_element){

            other_element.render(context, cell_size, field_manager);

            context.beginPath();
            context.arc(center_real_x, center_real_y, cell_size / 2 - cell_size / 10, 0, 2*Math.PI);
            context.strokeStyle = 'rgba(255, 0, 0, 1)';
            context.stroke();

        }

    }

}