import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Game } from '../_models/game';

@Component({
  selector: 'app-join-game',
  templateUrl: './join-game.component.html'
})
export class JoinGameComponent {

  activeGames: Game[];
  apiUrl: string = environment.apiUrl
  IdParamSubscription: Subscription

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
      this.getActiveGames();
  }

  ngOnDestroy() {
    this.IdParamSubscription.unsubscribe();
}
  
  submitForm() {
    // join game
    // post to /join
    // go to game screen
  }

  getActiveGames() {
    var httpRequest = this.http.get<Game[]>(`${this.apiUrl}/active`)
    httpRequest.subscribe(
      returnedGames => {
        console.log(returnedGames);
          this.activeGames = returnedGames;
      })
  }

}
