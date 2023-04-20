import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { io, Socket } from 'socket.io-client';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css'],
})
export class ChatBoxComponent implements OnInit, OnDestroy {
  messages: any[] = [];
  newMessage: string = '';
  gameId: string = '';
  CloseChat: boolean = true;
  chatIsVisible: boolean = true;
  items = Array.from({ length: 100000 }).map((_, i) => `Item #${i}`);
  private socket: any;
  angryImgSrc = '../assets/emoticons/Angry.png';
  ggImgSrc = '../assets/emoticons/GG.png';
  wowImgSrc = '../assets/emoticons/Wow.png';


  constructor(private http: HttpClient, private elementRef: ElementRef) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.gameId = this.elementRef.nativeElement.querySelector('#gameId').textContent;
      this.socket.emit('getChats', this.gameId);

      this.socket.on('chatData', (data: any) => {
        this.messages = data.chats;
      });

      // Listen for new messages from the server
      this.socket.on('message', (newMessage: any) => {
        this.messages.push(newMessage);
      });
    }, 0);
  }

  ngOnDestroy(): void {
    this.socket.disconnect();
  }

  sendMessage(imageName: string): void {
    this.socket.emit('newMessage', {
      playerUserName: this.elementRef.nativeElement.querySelector('#yourUserName').textContent,
      imageFile: imageName,
      note: 'NA',
      gameId: this.gameId
    });

    this.newMessage = '';
  }

  sendTextMessage(): void {
    this.socket.emit('newMessage', {
      playerUserName: this.elementRef.nativeElement.querySelector('#yourUserName').textContent,
      imageFile: 'NA',
      note: this.newMessage,
      gameId: this.gameId
    });

    this.newMessage = '';
  }

  closeForm(): void {
    this.CloseChat = !this.CloseChat;
    this.chatIsVisible = !this.chatIsVisible;
  }

  openForm(): void {
    this.chatIsVisible = !this.chatIsVisible;
  }
}
