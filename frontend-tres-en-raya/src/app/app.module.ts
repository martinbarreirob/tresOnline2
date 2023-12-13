import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { LoggingComponent } from './logging/logging.component';

import { FormsModule } from '@angular/forms';
import { GameComponent } from './game/game.component';
import { ListGamesComponent } from './list-games/list-games.component';
import { HeaderComponent } from './header/header.component';
import { ChatComponent } from './chat/chat.component';

@NgModule({
  declarations: [
    AppComponent,
    LoggingComponent,
    GameComponent,
    ListGamesComponent,
    HeaderComponent,
    ChatComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
