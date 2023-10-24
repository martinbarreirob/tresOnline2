import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { DataViewerComponent } from './data-viewer/data-viewer.component';
import { LoggingComponent } from './logging/logging.component';

import { FormsModule } from '@angular/forms';
import { GameComponent } from './game/game.component';
import { ListGamesComponent } from './list-games/list-games.component';

@NgModule({
  declarations: [
    AppComponent,
    DataViewerComponent,
    LoggingComponent,
    GameComponent,
    ListGamesComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
