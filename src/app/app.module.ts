import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './RegisterLogin/login/login.component';
import { RegisterComponent } from './RegisterLogin/register/register.component';
import { FormsModule } from '@angular/forms';
import { GameComponent } from './game/game.component';
import { Player } from './user/player.component';
import { ToastrModule } from 'ngx-toastr';
import { Board } from './game/board/board.component';
import { HomeComponent } from './home/home.component';
import { Tile } from './game/tile/tile.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NewGameComponent } from './new-game/new-game.component';
import { JoinGameComponent } from './join-game/join-game.component';
import { ErrorInterceptor } from './_security/error.interceptor';
import { SocketChatsComponent } from './socket-chats/socket-chats.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    GameComponent,
    Player,
    Board,
    HomeComponent,
    Tile,
    NewGameComponent,
    JoinGameComponent,
    SocketChatsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [ 
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
