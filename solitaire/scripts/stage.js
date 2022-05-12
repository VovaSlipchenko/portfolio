
class SolitareStage{

    block = null;
    cards = [];
    stacks = [];

    #card_width = 150;
    #card_height = 200;
    #card_step = 12;
    #top_margin = 30;
    #left_margin = 30;

    self = this;

    stack_hidden = null;
    stack_special = null;

    block_roll = null;

    constructor(window, block){

        this.block = block;

        let placements_simple_amount = 7;
        let placements_final_amount = 4;

        
        //Create top 7 bottom stacks

        for(let i = 0; i < placements_simple_amount; i++){

            let stack = new CardStack(this, this.#left_margin + i*(this.#card_width + this.#card_step), 260, 0, 30);
            stack.rule_different_color = true;
            stack.createBlock(this.block);
            this.stacks.push(stack);

        }

        //Create top 4 stacks

        for(let i = 0; i < placements_final_amount; i++){

            let stack = new CardStack(this, this.#left_margin + 3*(this.#card_width + this.#card_step) + i*(this.#card_width + this.#card_step), this.#top_margin, 0, 0);
            stack.rule_same_type = true;
            stack.default_root = 14;
            stack.nominal_mask = [14, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
            stack.allow_multi_pick = false;
            stack.createBlock(this.block);
            this.stacks.push(stack);

        }

        //Create stack with hidden cards

        this.stack_hidden = new CardStack(this, this.#left_margin, this.#top_margin, 0, 0);
        this.stack_hidden.allow_put = false;
        this.stack_hidden.hidden = true;
        this.stacks.push(this.stack_hidden);

        //Create stack with current hand

        this.stack_special = new CardStack(this, this.#left_margin + (this.#card_width + this.#card_step), this.#top_margin, 40, 0);
        this.stack_special.createBlock(this.block);
        this.stack_special.allow_put = false;
        this.stack_special.allow_multi_pick = false;
        this.stacks.push(this.stack_special);

        let gen = CardTypesGenerator();
        let type = false;

        do{
            type = gen.next().value;
            console.log(type);
            if(type){
                let card = new Card(this, type.type, type.nominal);
                card.createBlock(this.block);
                this.cards.push(card);
            }
        } while (type);

        this.cards = shuffle(this.cards);
        
        let cards_counter = 0;

        //Fill stacks with cards
        for(let i = 0; i < placements_simple_amount; i++){

            for(let c = 0; c < i+1; c++){

                this.stacks[i].addCard(this.cards[cards_counter]);
                this.stacks[i].setCardPlace(this.cards[cards_counter]);

                if(c < i){
                    this.cards[cards_counter].setCardHidden();
                }

                cards_counter++;
            }

            
        }

        for(let i = cards_counter; i < this.cards.length; i++){
            this.stack_hidden.addCard(this.cards[i]);
            this.stack_hidden.setCardPlace(this.cards[i]);
        }

        this.block_roll = document.createElement("div");
        this.block_roll.classList.add("card");
        this.block_roll.classList.add("card_size");
        this.block_roll.classList.add("card_roller");
        this.block_roll.classList.add("card_hidden");

        this.block_roll.style.left = this.#left_margin+"px";
        this.block_roll.style.top = this.#top_margin+"px";

        let self = this;
        this.block_roll.onclick = function(){ self.rollHand(); }; 


        this.block.appendChild(this.block_roll);

    }

    eventOnMouseMove(event){
        this.cards.forEach(function(c){
            if(c.dragstate){
                c.eventOnMouseMove(event);
            }
        });
    }


    eventCardDrugEnd(card, x, y){

        //look for stack to set card

        let card_center_x = x + this.#card_width / 2;
        let card_center_y = y + this.#card_height / 2;

        console.log('Card coords: ', card_center_x, card_center_y);

        let found_stack = null;

        this.stacks.forEach(function(s){
            console.log('Check',s);
            if(s.checkInBounds(card_center_x, card_center_y) && s.checkAddCard(card)){
                found_stack = s;
            }
        });

        console.log(found_stack);

        if(!found_stack){

            //If user placed card to free space

            this.stacks.forEach(function(s){
                if(s.haveCard(card)){
                    found_stack = s;
                }
            });

        }

        if(found_stack){

            var next_cards_array = card.getAllNextCards();
            console.log('next_cards_array', next_cards_array);

            if(found_stack.haveCard(card)){

                found_stack.setCardPlace(card);
                next_cards_array.forEach(function(c){
                    found_stack.setCardPlace(c);
                });
                
            } else {
                //If we changed stack
                this.stacks.forEach(function(s){
                    s.removeCard(card); 
                    next_cards_array.forEach(function(c){ s.removeCard(c);  });
                });
                
                found_stack.addCard(card);
                found_stack.setCardPlace(card);

                next_cards_array.forEach(function(c){
                    found_stack.addCard(c);
                    found_stack.setCardPlace(c);
                });

            }

        }

        console.log(this.stacks);

    }

    rollHand(){

        if(this.stack_special.getCardsAmount()){

            let cards = this.stack_special.getAllCards();

            console.log('CARDS TO REMOVE:', cards);

            for(var i = 0; i < cards.length; i++){
                this.stack_special.removeCard(cards[i]);
                console.log('Remove '+i+ ' / '+cards.length);
                console.log('Cards after remove:', this.stack_special.cards);
            }

            for(var i = 0; i < cards.length; i++){
                this.stack_hidden.addCard(cards[i], true);
                this.stack_hidden.setCardPlace(cards[i]);
            }

        }

        let cards = this.stack_hidden.getLastCards(3);
        console.log('ROLL CARDS:', cards);

        for(var i = 0; i < cards.length; i++){
            this.stack_hidden.removeCard(cards[i]);
        }

        for(var i = 0; i < cards.length; i++){
            this.stack_special.addCard(cards[i]);
            this.stack_special.setCardPlace(cards[i]);
        }

    }

    moveCard(card, from, to){
        from.removeCard(card);
        to.addCard(card);
        to.setCardPlace(card);
    }

    //Getters

    getCardWidth(){
        return this.#card_width;
    }

    getCardHeight(){
        return this.#card_height;
    }

}