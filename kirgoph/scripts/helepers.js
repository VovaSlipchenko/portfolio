
class FieldManager{

    #field = null;
    #field_temp = null;

    constructor(field, field_temp){
        this.#field = field;
        this.#field_temp = field_temp;
    }

    getElement(x, y, only_real){

        if(!only_real){

            if(typeof this.#field_temp[y] != 'undefined' && typeof this.#field_temp[y][x] != 'undefined' && this.#field_temp[y][x]){
                if(!this.#field_temp[y][x].error && !(this.#field_temp[y][x] instanceof ElementEraser)){
                    return this.#field_temp[y][x];
                }
            }

        }

        if(typeof this.#field[y] != 'undefined' && typeof this.#field[y][x] != 'undefined'){
            if(!this.#field[y][x].error && !(this.#field[y][x] instanceof ElementEraser)){
                return this.#field[y][x];
            }
        }

        return false;

    }

    removeElement(x, y){
        var element = this.getElement(x, y, true);
        console.log('-----------------------------------');
        console.log(element);
        if(element){
            this.#field[y][x] = false;
            let near = this.getElementsAroundAmount(x, y);
            if (near.total_elements > 1){
                //if(!element instanceof ElementWire){
                    this.#field[y][x] = new ElementWire(x,y)
                //}
            }
        }
    }

    getElementNextNumber(letter){

        let amount = 0;

        this.#field.forEach(row=>{
            row.forEach(elem=>{
                if(elem.param_letter == letter){
                    amount++;
                }
            });
        });

        let recount = false;

        this.#field.forEach(row=>{
            row.forEach(elem=>{
                if(elem.param_letter == letter && elem.number == (amount+1)){
                    recount = true;
                }
            });
        });

        if(recount){
            console.log('RECOUNT');
            let n = 0;
            this.#field.forEach(row=>{
                row.forEach(elem=>{
                    if(elem.param_letter == letter){
                        n++;
                        elem.number = n;                        
                    }
                });
            });
        }        

        let number = amount + 1;

        return number;
    }

    getElementsAroundAmount(x,y){

        let result = {
            total_elements: 0,
            total_elements_vertical: 0,
            total_elements_horizontal:0,
            elements:[]
        };

        let el = this.getElement(x+1,y);
        if(el && !el.error){
            result.total_elements++;
            result.total_elements_horizontal++;
            result.elements.push(el);
        }

        el = this.getElement(x-1,y);
        if(el && !el.error){
            result.total_elements++;
            result.total_elements_horizontal++;
            result.elements.push(el);
        }

        el = this.getElement(x,y+1);
        if(el && !el.error){
            result.total_elements++;
            result.total_elements_vertical++;
            result.elements.push(el);
        }

        el = this.getElement(x,y-1);
        if(el && !el.error){
            result.total_elements++;
            result.total_elements_vertical++;
            result.elements.push(el);
        }

        return result;

    }

}

class WorkingStageModes{}
WorkingStageModes.MODE_SELECT_ELEMENT = 0;
WorkingStageModes.MODE_ADD_ELEMENT = 1;
WorkingStageModes.MODE_REMOVE_ELEMENT = 2;

class ElementDirections{}
ElementDirections.DIR_DOWN_TO_TOP = 0;
ElementDirections.DIR_RIGHT_TO_LEFT = 1;
ElementDirections.DIR_TOP_TO_DOWN = 2;
ElementDirections.DIR_LEFT_TO_RIGHT = 3;