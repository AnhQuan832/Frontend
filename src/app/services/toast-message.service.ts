import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
    providedIn: 'root',
})
export class ToastMessageService {
    constructor(private messageService: MessageService) {}

    showMessage(summary: string, detail: string, severity: string) {
        this.messageService.add({
            severity: severity,
            summary: summary,
            detail: detail,
        });
    }
}
