/* tslint:disable:no-unused-variable */

import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';

import { CurrentTaskComponent } from './components/current-task/current-task.component';
import { TimerComponent } from './components/timer/timer.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskListItemComponent } from './components/task-list-item/task-list-item.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgReduxModule, NgRedux, DevToolsExtension } from 'ng2-redux';

describe('App: Chronacc', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        CurrentTaskComponent,
        TimerComponent,
        TaskListComponent,
        TaskListItemComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [NgRedux],
    });

  });

  it('should create the app', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'Chronacc'`, async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    expect(app.title).toEqual('Chronacc');
  }));

  it('should render title in a h1 tag', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Chronacc');
  }));

});
