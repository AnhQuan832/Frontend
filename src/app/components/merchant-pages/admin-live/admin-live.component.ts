import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/base.component';
import { StreamService } from 'src/app/services/stream.service';

@Component({
    selector: 'app-admin-live',
    templateUrl: './admin-live.component.html',
    styleUrls: ['./admin-live.component.scss'],
})
export class AdminLiveComponent extends BaseComponent implements OnInit {
    listLive = [];

    totalRecords: number = 0;
    first: number = 1;

    constructor(private streamService: StreamService) {
        super();
    }

    ngOnInit(): void {
        this.getLives();
    }

    getLives() {
        this.streamService.getAllStream().subscribe({
            next: (res) => {
                this.listLive = res;
            },
        });
    }

    onPageChange(event) {}

    initMenuItem(merchant) {}

    deleteLive(live) {}
}
