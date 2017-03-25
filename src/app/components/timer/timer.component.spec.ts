/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Observable } from 'rxjs';

import { TimerComponent } from './timer.component';

import * as moment from 'moment';

describe('TimerComponent', () => {
  let component: TimerComponent;
  let fixture: ComponentFixture<TimerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return time with appropriate frequency', fakeAsync(() => {
    component.beginTime = new Date().getTime();
    component.isActive = true;
    let duration = 3500
    let currentTime = moment.utc(new Date().getTime()).format('HH:mm:ss');
    let counter = 0;
    let subscription = component.time$.subscribe((t) => {
      counter++;
    });
    tick(duration);
    expect(counter).toBe(duration / 1000 | 0);
    subscription.unsubscribe();
  }));

});
