import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Pusher from 'pusher-js';
import { AccountService } from '../_security/account.service';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements OnInit {

  username: String;
  message: String = '';
  messages = [];

  constructor(private http: HttpClient, private accountService: AccountService) {
    let checkUser = this.accountService.currentUserValue;
    if (checkUser) {
      this.username = checkUser.username;
   }
  }

  ngOnInit(): void {
    // Enable pusher logging - don't include this in production
    Pusher.logToConsole = true;

    var pusher = new Pusher('c6ebd2b1c5fa25e580cd', {
      cluster: 'mt1'
    });

    const channel = pusher.subscribe('my-channel');
    channel.bind('my-event', data => {
      this.messages.push(data);
    });
  }

  submit(): void{
    this.http.post('http://localhost:3000/chat', {
      username: this.username,
      message: this.message
    }).subscribe(() => this.message = '');
  }
}
