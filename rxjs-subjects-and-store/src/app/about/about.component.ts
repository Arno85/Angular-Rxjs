import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { concat, fromEvent, interval, noop, observable, Observable, of, timer, merge, Subject, BehaviorSubject, AsyncSubject, ReplaySubject } from 'rxjs';
import { delayWhen, filter, map, take, timeout } from 'rxjs/operators';
import { createHttpObservable } from '../common/util';
import { fromPromise } from 'rxjs/internal-compatibility';


@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  ngOnInit() {
    // The subject does not support late . It will not emit anything for the late Sub.
    // const subject = new Subject();

    // The BeahviorSubject will emit the last value for late subscription
    // const subject = new BehaviorSubject(0);

    // The AsyncSubject will emit only the last value for both subscriptions - The subject has to be complete though.
    // const subject = new AsyncSubject();

    // The Replay Subject will emit all for both subs - complete or not.
    const subject = new ReplaySubject();

    const series$ = subject.asObservable();

    // Early subscription (before next))
    series$.subscribe(val => console.log('early sub ' + val));

    subject.next(1);
    subject.next(2);
    subject.next(3);

    // If subject is complete the late subscription will not receive anything in the case of BehaviorSubject.
    // It has to be complete in the case of AsyncSubject
    // It has no effect on the ReplaySubject
    // subject.complete();

    // Late subscription (after next))
    series$.subscribe(val => console.log('late sub ' + val));

    // Both subscriptions will receive this, unless the subject is complete.
    // subject.next(4);

  }


}






