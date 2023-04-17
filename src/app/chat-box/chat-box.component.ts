import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css'],
})
export class ChatBoxComponent implements AfterViewInit {

  messages: any[] = [];
  newMessage: string = '';
  gameId: string = '';

  constructor(private http: HttpClient, private elementRef: ElementRef) { }

  ngAfterViewInit(): void {
    // Wait for DOM to be ready before retrieving gameId from the DOM
    setTimeout(() => {
      //the same thing as the username comment below
      this.gameId = this.elementRef.nativeElement.querySelector('#gameId').textContent;
      this.http
        .get<any[]>(`http://localhost:3000/chats/get/${this.gameId}`)
        .subscribe((data: any) => (this.messages = data.chats));
    }, 0);
  }

  sendMessage(imageName: string): void {
    this.http
      .post(`http://localhost:3000/chats/send`, {
        //you need to put the username of the current player in a DOM item with the id #yourUserName
        //needs to just grab from state later
        playerUserName: this.elementRef.nativeElement.querySelector('#yourUserName').textContent,
        imageFile: imageName,
        note: "NA",
        gameId: this.gameId
      })
      .subscribe(() => {
        this.ngAfterViewInit();
      });
  }

  sendTextMessage(): void {
    this.http
      .post('http://localhost:3000/chats/send', {
        playerUserName: this.elementRef.nativeElement.querySelector('#yourUserName').textContent,
        imageFile: "NA",
        note: this.newMessage,
        gameId: this.gameId
      })
      .subscribe(() => {
        this.ngAfterViewInit();
      });
  }
}
