import $ from 'jquery';
export default class item {
    constructor(id, name, price, image) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
    }

     show() {
           return(this.name + ' is ' + this.price +'$');
    }
}