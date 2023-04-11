import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  templateUrl: './routenotfound.component.html'
})
export class RoutenotfoundComponent implements OnInit {
    router: Router;

    constructor(router: Router) {
        this.router = router
    }

  ngOnInit(): void {
      
  }

}
 