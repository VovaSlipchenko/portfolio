
class CardStack{

    x = 0;
    y = 0;
    cards_dy = 0;
    cards_dx = 0;
    cards = [];

    block = null;
    stage = null;
    stack = null;

    rule_different_color = null;
    rule_same_type = null;

    hidden = false;

    allow_put = true;
    default_root = 13;
    allow_multi_pick = true;
    nominal_mask = false;

    constructor(stage, x, y, dx, dy){
        this.x = x;
        this.y = y;
        this.cards_dx = dx;
        this.cards_dy = dy;
        this.stage = stage;
    }

    createBlock(parent){

        this.block = document.createElement("div");
        this.block.classList.add("card_stack");
        this.block.classList.add("card_size");
        this.block.style.left = this.x+"px";
        this.block.style.top = this.y+"px";
        parent.appendChild(this.block);

    }

    checkInBounds(x,y){
        if(x > this.x && x < this.x + this.stage.getCardWidth() + (this.cards_dx * this.cards.length) 
            && y > this.y && y < this.y + this.stage.getCardHeight() + (this.cards_dy * this.cards.length) ){
            return true;
        }
        return false;
    }

    checkAddCard(card){

        console.log('CHECK ADD CARD');

        if(!this.allow_put){
            return false;
        }

        if(this.cards.length){

            let last_card = this.cards[this.cards.length - 1];

            if(!this.nominal_mask){
                if(card.nominal != last_card.nominal - 1){
                    return false;
                }
            } else {
                if(card.nominal != this.nominal_mask[this.cards.length]){
                    return false;
                }   
            }

            if(this.rule_different_color && card.type.c == last_card.type.c){
                return false;
            }

            if(this.rule_same_type){
                if(last_card.type.t != card.type.t){
                    return false;
                }
            }

        } else {

            if(card.nominal != this.default_root){
                return false;
            }

            if(this.nominal_mask){
                console.log('CHECK NOMINAL MASK');
                if(card.nominal != this.nominal_mask[this.cards.length]){
                    return false;
                }   
            }

        }
        
        return true;

    }

    haveCard(card){
        return this.cards.includes(card);
    }

    removeCard(card){

        const index = this.cards.indexOf(card);

        if (index > -1) {
            this.cards.splice(index, 1);
        }

        this.linkCards();

        if(this.cards.length){
            this.cards[this.cards.length-1].setCardVisible();
        }

    }

    addCard(card, to_back){

        if(!to_back){
            this.cards.push(card);
        } else {
            this.cards = [card, ...this.cards];
            console.log('cards after add to back', this.cards);
        }

        this.linkCards();
        card.setCardDistance(this.cards_dx, this.cards_dy);
        card.setStack(this);

        console.log('CARDS AFTER ADD', this.cards);

    }

    setCardPlace(card){
        let index = this.cards.length;
        if(this.cards.includes(card)){
            index = this.cards.indexOf(card) + 1;
        }
        const x = this.x + this.cards_dx * (index - 1);
        const y = this.y + this.cards_dy * (index - 1);
        console.log('set card place: ', x, y, index);
        card.setPlace(x, y);
        card.setLayer(this.cards.indexOf(card));
        card.setInvisible(this.hidden);
    }

    linkCards(){

        if(this.cards.length){
            for(let i = 0; i < this.cards.length - 1; i++){
                this.cards[i].setNextCard(this.cards[i + 1]);
            }
            this.cards[this.cards.length-1].setNextCard(null);
        }

    }

    getLastCards(amount){
        return this.cards.slice(amount*-1);
    }

    getAllCards(){
        return [...this.cards];
    }

    getCardsAmount(){
        return this.cards.length;
    }

}