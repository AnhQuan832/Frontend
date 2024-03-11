import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { StorageService } from 'src/app/services/storage.service';
import { VoucherService } from 'src/app/services/voucher.service';
import { VoucherDetailComponent } from './voucher-detail/voucher-detail.component';
import { Table } from 'primeng/table';

@Component({
    selector: 'app-voucher-management',
    templateUrl: './voucher-management.component.html',
    styleUrls: ['./voucher-management.component.scss'],
})
export class VoucherManagementComponent implements OnInit {
    selectedVouchers;
    listVoucher;
    ref: DynamicDialogRef;
    constructor(
        private voucherSerice: VoucherService,
        private router: Router,
        private dialogService: DialogService,
        private storageSerive: StorageService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.getListVoucher();
    }

    getListVoucher() {
        this.voucherSerice.getVoucher().subscribe({
            next: (res) => {
                this.listVoucher = res;
            },
        });
    }

    openAddVoucher(data?) {
        this.ref = this.dialogService.open(VoucherDetailComponent, {
            position: 'center',
            data: data,
            width: '425px',
        });

        this.ref.onClose.subscribe(() => {
            this.getListVoucher();
        });
    }

    showToast() {}
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }
}
