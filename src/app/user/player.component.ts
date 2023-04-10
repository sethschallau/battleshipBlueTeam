import { Component } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
})
export class Player {
    username: string;
    score: number = 0;

    constructor(values: Object = {}) {
      Object.assign(this, values);
    }

}
