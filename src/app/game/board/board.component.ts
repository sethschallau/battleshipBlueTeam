import { Component } from '@angular/core';
import { Tile } from '../tile/tile.component';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html'
})
export class Board {
  gameId: number;
  player: User;
  tiles: Tile[][];

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
 
}

