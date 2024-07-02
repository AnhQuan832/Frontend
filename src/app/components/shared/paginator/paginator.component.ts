import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-paginator',
    templateUrl: './paginator.component.html',
    styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent {
    @Input() first: number = 0;
    @Input() rows: number = 10;
    @Input() totalRecords: number = 10;

    @Output() onPageChange: EventEmitter<any> = new EventEmitter<any>();

    oPageChange(event) {
        console.log(event);
        this.first = event.first;
        this.rows = event.rows;
        this.onPageChange.emit(event);
    }
}
