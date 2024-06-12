import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-quantity',
    templateUrl: './quantity.component.html',
    styleUrls: ['./quantity.component.scss'],
})
export class QuantityComponent implements OnInit {
    @Input() quantity: any;
    @Input() min: number = 0;
    @Input() max: number = 999999;

    @Output() onQuantity: EventEmitter<number> = new EventEmitter();
    constructor() {}

    ngOnInit() {}

    increase() {
        if (parseInt(this.quantity) < this.max) {
            this.quantity = (1 + +this.quantity).toString();
            this.onQuantity.emit(Number(this.quantity));
        }
    }

    decrease() {
        if (parseInt(this.quantity) > this.min) {
            this.quantity = (-1 + +this.quantity).toString();
            this.onQuantity.emit(Number(this.quantity));
        }
    }

    validateQuantity(event: any) {
        let value = event.target.value;
        value = value.replace(/[^0-9]/g, '');

        if (value === '0') {
            value = '1';
        } else if (Number(value) > this.max) {
            value = this.max.toString();
        } else if (Number(value) < this.min) {
            value = this.min.toString();
        }

        this.quantity = value;
        event.target.value = this.quantity;
        this.onQuantity.emit(Number(this.quantity));
    }
}
