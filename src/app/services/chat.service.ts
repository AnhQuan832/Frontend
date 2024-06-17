import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { API } from '../constant/enum';

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    constructor(
        private http: HttpClient,
        private storageService: StorageService
    ) {}

    async getChatRooom() {
        return await this.http
            .get(
                API.CHAT.END_POINT.CHAT_ROOM +
                    `/${
                        this.storageService.getItemLocal('currentUser')?.userId
                    }`
            )
            .toPromise();
    }

    async getMessageByChatRoom(chatRoom, senderID, recipientID) {
        return await this.http
            .get(
                API.CHAT.END_POINT.MESSAGES_BY_CHAT_ROOM +
                    `/${chatRoom}/` +
                    `${senderID}/` +
                    `${recipientID}`
            )
            .toPromise();
    }

    async getUnreadMessageByRecipientId(recipientID: string, senderID: string) {
        return await this.http
            .get(
                API.CHAT.END_POINT.UNREAD_MESSAGES_COUNT +
                    `/${senderID}/` +
                    `${recipientID}/count`
            )
            .toPromise();
    }

    putSeenMessage(senderID: string, recipientID: string) {
        return this.http
            .put(
                API.CHAT.END_POINT.SEEN_MESSAGE +
                    `/${senderID}/` +
                    `${recipientID}`,
                null
            )
            .toPromise();
    }
}
