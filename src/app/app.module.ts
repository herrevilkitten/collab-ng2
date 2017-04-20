import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
//import { AngularFireModule, AngularFireAuth, FirebaseAppConfig } from 'angularfire2';

import { AppComponent } from './app.component';

import 'hammerjs';

//const firebaseConfig: FirebaseAppConfig = {

//};

const routes: Routes = [
  {
    path: 'main',
    loadChildren: './modules/main/main.module#MainModule',
  }
];

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes),
    MaterialModule,
//    AngularFireModule.initializeApp(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
