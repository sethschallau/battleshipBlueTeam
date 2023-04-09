import { RouterModule, Routes } from '@angular/router';

//import { RoutenotfoundComponent } from './_security/routenotfound/routenotfound.component';
//import { LoginComponent } from './RegisterLogin/login/login.component';
//import { RegisterComponent } from './RegisterLogin/register/register.component';
// import { GameComponent } from './game/game.component';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { NewGameComponent } from './new-game/new-game.component';
import { JoinGameComponent } from './join-game/join-game.component';


const routes: Routes = [
    //{ path: 'register', component: RegisterComponent },
    //{ path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent, pathMatch: 'full' },
    { path: 'new-game', component: NewGameComponent, pathMatch: 'full' },
    { path: 'join-game', component: JoinGameComponent, pathMatch: 'full' },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', redirectTo: 'home', pathMatch: 'full' }
    //{ path: '**', component: RoutenotfoundComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {})],
    exports: [RouterModule],
  })
  export class AppRoutingModule {}