import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { NgReduxModule, NgRedux, DevToolsExtension } from 'ng2-redux';
import { rootReducer, IAppState, middleware } from './store';

import { AppComponent } from './app.component';
import { CurrentTaskComponent } from './components/current-task/current-task.component';
import { TimerComponent } from './components/timer/timer.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskListItemComponent } from './components/task-list-item/task-list-item.component';

const persistState = require('redux-localstorage');

@NgModule({
  declarations: [
    AppComponent,
    CurrentTaskComponent,
    TimerComponent,
    TaskListComponent,
    TaskListItemComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule
  ],
  providers: [NgRedux, DevToolsExtension],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(private ngRedux: NgRedux<IAppState>,
    devTools: DevToolsExtension) {
    const storage = persistState('', {
      key: 'chronacc',
      serialize: s => JSON.stringify(s),
      deserialize: s => JSON.parse(s),
    });
    let enhancers = [storage];

    enhancers = devTools.isEnabled() ? [...enhancers, devTools.enhancer()] : [...enhancers];

    ngRedux.configureStore(rootReducer, {}, [...middleware], [...enhancers]);
  }
}
