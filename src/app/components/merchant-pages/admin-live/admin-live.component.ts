import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-admin-live',
    templateUrl: './admin-live.component.html',
    styleUrls: ['./admin-live.component.scss'],
})
export class AdminLiveComponent implements OnInit {
    listLive = [];

    totalRecords: number = 0;
    first: number = 1;

    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }

    onPageChange(event) {}

    initMenuItem(merchant) {}

    deleteLive(live) {}
}
