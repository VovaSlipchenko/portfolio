
class Card{

    type = '';
    nominal = 1;
    block = null;
    hidden = false;

    x = 0;
    y = 0;

    //private

    #card_dx = 0;
    #card_dy = 0;

    #current_x = 0;
    #current_y = 0;

    start_move_click_x = 0;
    start_move_click_y = 0;

    start_move_x = 0;
    start_move_y = 0;

    draggable = true;
    dragstate = false;

    stage = null;
    next_card = null;

    constructor(stage, type, nominal, hidden){

        this.type = type;
        this.nominal = nominal;
        this.stage = stage;
        this.hidden = hidden;

    }

    createBlock(parent){

        this.block = document.createElement("div");


        let nominal = document.createElement("div");

        if(this.nominal <= 10){
            nominal.innerHTML = this.nominal;
        } else {
            if(this.nominal == 11){
                nominal.innerHTML = "J";
            }
            if(this.nominal == 12){
                nominal.innerHTML = "Q";
            }
            if(this.nominal == 13){
                nominal.innerHTML = "K";
            }
            if(this.nominal == 14){
                nominal.innerHTML = "A";
            }
        }

        nominal.classList.add('card_inner_nominal');

        let type = document.createElement("div");
        type.classList.add('card_inner_type');
        type.classList.add('card_inner_type_'+this.type.t);

        type.innerHTML = this.type.i;

        this.block.appendChild(nominal);
        this.block.appendChild(type);
        this.block.classList.add("card");
        this.block.classList.add("card_size");
        this.block.classList.add("card_nominal_"+this.nominal);

        if(this.type.c == "R"){
            this.block.classList.add("card_red");
        }
        
        this.block.onmousedown = this.eventOnMouseDonw.bind(this);
        this.block.onmouseup = this.eventOnMouseUp.bind(this);

        this.block.onmousemove = function(){
            
        }

        parent.appendChild(this.block);

    }

    setNextCard(card){
        this.next_card = card;
    }

    eventOnMouseDonw(event){

        if(!this.hidden){

            if(!this.next_card || (this.next_card && this.stack.allow_multi_pick)){

                this.dragstate = true;

                this.setLayer(30);

                this.start_move_click_x = event.pageX;
                this.start_move_click_y = event.pageY;
                this.start_move_x = this.x;
                this.start_move_y = this.y;

            }

        }

    }

    eventOnMouseUp(event){

        if(this.dragstate){
            this.dragstate = false;
            console.log(this.#current_x, this.#current_y);
            this.x = this.#current_x;
            this.y = this.#current_y;
            this.stage.eventCardDrugEnd(this, this.#current_x, this.#current_y );
        }

    }

    eventOnMouseMove(event){
        
        if(this.dragstate){

            this.#current_x = (this.start_move_x + event.pageX - this.start_move_click_x);
            this.#current_y =  (this.start_move_y + event.pageY - this.start_move_click_y);
            this.block.style.left = this.#current_x + "px";
            this.block.style.top = this.#current_y +"px";

            if(this.next_card){
                this.next_card.setNextCardPosition(this.#current_x + this.#card_dx, this.#current_y + this.#card_dy);
            }
            
        }

    }

    setStack(stack){
        this.stack = stack;
    }


    setPlace(x, y){
        this.#current_x = x;
        this.#current_y = y;
        this.x = x;
        this.y = y;
        this.block.style.left = this.#current_x + "px";
        this.block.style.top = this.#current_y +"px";
    }   

    setInvisible(invisible){
        if(invisible){
            this.block.style.display = 'none';
        } else {
            this.block.style.display = 'block';
        }
    }

    setCardDistance(dx, dy){
        this.#card_dx = dx;
        this.#card_dy = dy;
    }

    setLayer(zindex){
        this.block.style.zIndex = zindex;
        if(this.next_card){
            this.next_card.setLayer(zindex+1);
        }
    }

    setNextCardPosition(x, y){
        this.setPlace(x,y);
        if(this.next_card){
            this.next_card.setNextCardPosition(x + this.#card_dx,y + this.#card_dy);
        }
    }

    getAllNextCards(){
        let cards = [];
        if(this.next_card){
            let card = this.next_card;
            while(card){
                cards.push(card);
                card = card.next_card;
            }
        } 
        return cards;
    }

    isHidden(){
        return this.hidden;
    }

    setCardHidden(){
        this.hidden = true;
        this.block.classList.add("card_hidden");
    }

    setCardVisible(){
        this.hidden = false;
        this.block.classList.remove("card_hidden");
    }



}