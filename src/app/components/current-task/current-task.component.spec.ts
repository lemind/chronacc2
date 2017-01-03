/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';

import { NgRedux } from 'ng2-redux';

import { CurrentTaskComponent } from './current-task.component';
import { TimerComponent } from './../timer/timer.component';

describe('CurrentTaskComponent', () => {
  let component: CurrentTaskComponent;
  let fixture: ComponentFixture<CurrentTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentTaskComponent, TimerComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [ NgRedux ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
