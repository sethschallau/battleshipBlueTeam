import { Component } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html'
})
export class Player {
    id: number;
    username: string;
    hits: number = 0;
    misses: number = 0;

    constructor(
      values: Object = {}
      ) {
      Object.assign(this, values);
    }
}
