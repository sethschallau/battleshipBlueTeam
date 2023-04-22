import { Component, OnInit, OnDestroy, ElementRef, AfterViewChecked, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { io, Socket } from 'socket.io-client';


import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Game } from '../_models/game';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { BoardService } from 'src/app/game/board-service.service';
import { AccountService } from '../_security/account.service';


const NUM_PLAYERS: number = 2;

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

  // Chat id stuff
  idParamSubscription: Subscription;
  apiUrl: string = environment.apiUrl
  canPlay: boolean = false;
  player: number = 0;
  players: number = 0;
  game: Game;
  user: User;
  username: string;


  /** The scrollable chat view */
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  /** The input for the form */
  @ViewChild('messageInput') messageInput: ElementRef;

  constructor(private http: HttpClient, 
    private elementRef: ElementRef, 
    private route: ActivatedRoute,
    private boardService: BoardService,
    private accountService: AccountService

    ) {
    this.socket = io('http://localhost:3000');
    let checkUser = this.accountService.currentUserValue;
    if (checkUser) {
      this.user = checkUser;
      this.username = this.user.username;
   }
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.gameId = this.gameId;
      this.socket.emit('getChats', this.gameId);

      this.socket.on('chatData', (data: any) => {
        this.messages = data.chats;
      });

      // Listen for new messages from the server
      this.socket.on('message', (newMessage: any) => {
        this.messages.push(newMessage);
      });
    }, 0);


    this.idParamSubscription = this.route.params.subscribe(
      params => {
        this.getGame(params['id'])
      }
  )
  }

  ngOnDestroy(): void {
    this.socket.disconnect();
  }

  ngAfterViewChecked() {        
    this.scrollToBottom();        
  }   

  sendMessage(imageName: string): void {
    this.socket.emit('newMessage', {
      playerUserName: this.user.username,
      imageFile: imageName,
      note: 'NA',
      gameId: this.gameId
    });

    this.newMessage = '';
  }

  sendTextMessage(): void {
    this.socket.emit('newMessage', {
      playerUserName: this.user.username,
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

  scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }      
  }

  formSubmit(data: { input: any; }): void{
    console.log(data);
    // alert("The input entered is: " + data.input);
    this.socket.emit('newMessage', {
      playerUserName: this.user.username, //this.elementRef.nativeElement.querySelector('#yourUserName').textContent,
      imageFile: 'NA',
      note: data.input,
      gameId: this.gameId
    });
    
    this.messageInput.nativeElement.value = '';
  }


  getGame(id: number) {
    var httpRequest = this.http.get<Game>(`${this.apiUrl}/games/${id}`)

        httpRequest.subscribe(
            returnedGame => {
                this.game = returnedGame;
                this.gameId = this.game._id;
                this.players = this.game.players.length;
                // this.updateCurrentPlayer();
                // this.createBoards();
            })
  }

  // updateCurrentPlayer(): void {
  //   if (this.game.currentPlayer.includes(this.username)) {
  //     this.canPlay = true;
  //   } else {
  //     this.canPlay = false;
  //   }
  // }

  // createBoards() : ChatBoxComponent {
  //   this.boardService.createBoard(this.user, this.game);
  //   for (let p of this.game.players) {
  //     if (!p.username.includes(this.username)) {
  //       this.boardService.createBoard(p, this.game);
  //     }
  //   }
    
  //   return this;
  // }
}
