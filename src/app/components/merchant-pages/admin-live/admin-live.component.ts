import { Component, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BaseComponent } from 'src/app/base.component';
import { StreamService } from 'src/app/services/stream.service';
import { QuickviewLiveComponent } from './quickview-live/quickview-live.component';

@Component({
    selector: 'app-admin-live',
    templateUrl: './admin-live.component.html',
    styleUrls: ['./admin-live.component.scss'],
    providers: [DialogService],
})
export class AdminLiveComponent extends BaseComponent implements OnInit {
    listLive = [];

    totalRecords: number = 0;
    first: number = 1;
    ref: DynamicDialogRef;
    constructor(
        private streamService: StreamService,
        private dialogService: DialogService
    ) {
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

    openLive(live) {
        this.ref = this.dialogService.open(QuickviewLiveComponent, {
            data: {
                sessionKey: live.sessionId,
            },
        });
    }
}
