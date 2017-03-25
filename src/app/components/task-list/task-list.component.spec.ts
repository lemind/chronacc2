/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Observable } from 'rxjs';
import { NgReduxModule } from 'ng2-redux';

import { ITasks, ITask } from '../../store/tasks';

import { TaskListComponent } from './task-list.component';
import { TaskListItemComponent } from './../task-list-item/task-list-item.component';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
          TaskListComponent,
          TaskListItemComponent
        ],
      providers: [],
      imports: [ NgReduxModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;

    var task1:ITask = {id: '1', name: 'name1', active: false, periods: []};
    var task2:ITask = {id: '2', name: 'name2', active: false, periods: []};
    let expectedTaskList: Observable<ITasks> = Observable.of([task1, task2]);
    let expectedCurrentTask = Observable.of({});
    component.currentTask = expectedCurrentTask;
    component.tasks = expectedTaskList
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
