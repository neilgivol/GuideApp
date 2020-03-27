import $ from 'jquery';
export default class item {
    constructor(id, name, image) {
        this.id = id;
        this.name = name;
        this.image = image;
    }

     show() {
           return(this.name);
    }
}