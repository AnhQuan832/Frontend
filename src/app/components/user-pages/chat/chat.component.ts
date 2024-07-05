import {
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import SockJS from 'sockjs-client';
import { ChatService } from 'src/app/services/chat.service';
import { StorageService } from 'src/app/services/storage.service';
import { over } from 'stompjs';
@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.less'],
})
export class ChatComponent implements OnInit, AfterViewInit {
    constructor(
        private chatService: ChatService,
        private storageService: StorageService,
        private router: Router
    ) {}

    isLoadingChatRoom = true;
    isLoadingChatContent = true;
    listChatRoom: any;
    listUsers: UserMessage[];
    listUsersBackup: UserMessage[];
    rawMessages: any;
    public listMessage = new Array<Message>();
    currentUser: any;
    currentUserChat: any;
    isLogin;
    userSearch: string;
    message: string;
    recipientId: string;

    senderId = this.storageService.getItemLocal('currentUser')?.userId;
    senderAvatar = this.storageService.getItemLocal('currentUser')?.userAvatar;

    private stompClient = null;
    private messageData = {
        senderId: this.storageService.getItemLocal('currentUser')?.userId,
        recipientId: '',
        message: '',
    };

    async ngOnInit() {
        this.isLogin = this.storageService.getDataFromCookie('jwtToken');
        if (!this.isLogin) this.router.navigate(['/auth/login']);
        await this.connect();
        await this.getChatRoom();
        await this.getListUsers();
        await this.getUnreadMessage();
        this.isLoadingChatRoom = false;
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            if (sessionStorage.getItem('reciepientId')) {
                console.log(this.listUsers);
                this.currentUser = this.listUsers.filter((user) => {
                    if (user.userId == sessionStorage.getItem('reciepientId')) {
                        return user;
                    } else return 0;
                });
                this.selectUser(this.currentUser[0]);
            }
        }, 3500);
    }

    async sendMessage() {
        if (this.message) {
            const currentDate = new Date();
            const timestamp = currentDate.getTime();
            await this.sendValue(this.message);
            this.currentUserChat.push({
                chatRoomId: this.currentUser.chatRoomId,
                senderId: this.senderId,
                recipientId: this.recipientId,
                content: this.message,
                timestamp: timestamp,
                status: 'DELIVERED',
            });
            this.listMessage.push({
                chatRoomId: this.currentUser.chatRoomId,
                senderId: this.senderId,
                recipientId: this.recipientId,
                content: this.message,
                timestamp: timestamp,
                status: 'DELIVERED',
            });
            this.message = null;
        }
        setTimeout(() => {
            this.autoScrollToNewMessage();
        }, 50);
    }

    async selectUser(user) {
        this.isLoadingChatContent = true;
        this.recipientId = user.userId;
        this.currentUser = user;
        const items = document.querySelectorAll('.reciepient');
        const element = document.getElementById(user.userId);
        items.forEach((item) => {
            item.classList.remove('active');
            item.removeAttribute('style');
        });
        element.classList.add('active');

        this.setReceipientId(this.recipientId);
        await this.getListMessages(user.chatRoomId);
        this.listUsers.map((selectedUser) => {
            if (user.userId === selectedUser.userId) selectedUser.isRead = true;
        });
        this.isLoadingChatContent = false;
        setTimeout(() => {
            this.autoScrollToNewMessage();
        }, 10);
    }

    public getListUsers() {
        this.listUsers = this.listChatRoom.map((chatRoom) => {
            if (chatRoom.firstUser.userId !== this.senderId) {
                return {
                    chatRoomId: chatRoom.chatRoomId,
                    userId: chatRoom.firstUser.userId,
                    userName:
                        chatRoom.firstUser.userFirstName +
                        ' ' +
                        chatRoom.firstUser.userLastName,
                    userAvatar: chatRoom.firstUser.userAvatar,
                    isRead: false,
                };
            } else {
                return {
                    chatRoomId: chatRoom.chatRoomId,
                    userId: chatRoom.secondUser.userId,
                    userName:
                        chatRoom.secondUser.userFirstName +
                        ' ' +
                        chatRoom.secondUser.userLastName,
                    userAvatar: chatRoom.secondUser.userAvatar,
                    isRead: false,
                };
            }
        });
        this.listUsersBackup = [...this.listUsers];
    }

    onFocusBoxChat() {
        this.chatService
            .putSeenMessage(this.senderId, this.recipientId)
            .then(() => {})
            .catch((err) => {
                console.log(err);
            });
    }

    public async getChatRoom() {
        await this.chatService
            .getChatRooom()
            .then((chatRoom) => {
                this.listChatRoom = chatRoom;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    async getListMessages(chatRoomId: string) {
        await this.chatService
            .getMessageByChatRoom(chatRoomId, this.senderId, this.recipientId)
            .then((messages) => {
                this.rawMessages = messages;
            })
            .catch((error) => {
                console.log(error);
            });
        this.currentUserChat = await this.rawMessages.map((message) => {
            return {
                senderId: message.senderId,
                recipientId: message.recipientId,
                content: message.content,
                timestamp: message.timestamp,
                status: message.status,
            };
        });
    }

    getUnreadMessage() {
        const unreadMessages = [];
        this.listUsers.map((user) => {
            unreadMessages.push(
                this.chatService
                    .getUnreadMessageByRecipientId(user.userId, this.senderId)
                    .subscribe((messageCount) => {
                        if (messageCount === 0) user.isRead = true;
                    })
            );
        });
    }

    onUserSearched() {
        this.listUsers = [...this.listUsersBackup];
        this.listUsers = this.listUsers.filter((room) => {
            if (
                room.userName
                    .toLocaleLowerCase()
                    .includes(this.userSearch.toLocaleLowerCase())
            )
                return room;
            else return 0;
        });
    }

    autoScrollToNewMessage() {
        const chatContent = document.getElementById('boxchat');
        chatContent.scrollTop = chatContent.scrollHeight;
    }

    public setReceipientId(recipientId: string) {
        this.messageData.recipientId = recipientId;
    }

    public async connect() {
        let Sock = new SockJS(
            'https://kltn-pescue-production.up.railway.app/ws'
        );
        // let Sock = new SockJS('http://localhost:8080/ws');

        this.stompClient = over(Sock);
        await this.stompClient.connect({}, this.onConnected, this.onError);
    }

    onConnected = () => {
        this.stompClient.subscribe('/private-message', this.onMessageSend);
        this.stompClient.subscribe(
            '/user/' + this.senderId + '/private',
            this.onPrivateMessage
        );
    };

    onMessageSend = (payload) => {
        var payloadData = JSON.parse(payload.body);
        this.listMessage.push(payloadData);
    };

    onPrivateMessage = (payload) => {
        var payloadData = JSON.parse(payload.body);
        this.listMessage.push(payloadData);
        if (this.currentUserChat) this.currentUserChat.push(payloadData);
        this.listUsers.map((user) => {
            if (user.userId === payloadData.senderId) user.isRead = false;
        });
        setTimeout(() => {
            this.autoScrollToNewMessage();
        }, 10);
    };

    onError = (err) => {
        console.log(err);
    };

    sendValue(message, senderId?, recipientId?) {
        if (this.stompClient) {
            var chatMessage = {
                senderId:
                    senderId ||
                    this.messageData.senderId ||
                    'USER_1699792351661_gmNWp',
                recipientId:
                    recipientId ||
                    this.messageData.recipientId ||
                    'USER_1697033158735',
                content: message,
            };
            this.stompClient.send(
                '/app/private-message',
                {},
                JSON.stringify(chatMessage)
            );
            this.messageData.message = '';
        }
    }
}
export interface UserMessage {
    chatRoomId: string;
    userId: string;
    userName: string;
    userAvatar: string;
    isRead: boolean;
}

export interface Message {
    chatRoomId: string;
    senderId: string;
    recipientId: string;
    content: string;
    timestamp: any;
    status: string;
}
