import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Pusher from 'pusher-js';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements OnInit {
  username = 'username';
  message = '';
  messages = [];

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {

    // Enable pusher logging - don't include this in production
    Pusher.logToConsole = true;

    var pusher = new Pusher('c6ebd2b1c5fa25e580cd', {
      cluster: 'mt1'
    });

    var channel = pusher.subscribe('my-channel');
    channel.bind('my-event', function(data) {
      this.messages.push(data);
      alert(JSON.stringify(data));
    });


    // // Enable pusher logging - don't include this in production
    // Pusher.logToConsole = true;

    // const pusher = new Pusher('3c6bb27ad7d79b21eb8a', {
    //   cluster: 'mt1'
    // });

    // const channel = pusher.subscribe('chat');
    // channel.bind('message', function(data) {
    //   this.messages.push(data);
    // });
  }


  submit(): void{
    this.http.post('http://localhost:3000/chat', {
      username: this.username,
      message: this.message
    }).subscribe(() => this.message = '');
  }
}
