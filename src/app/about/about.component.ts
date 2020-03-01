import { Component, OnInit } from '@angular/core';
import { of, concat, interval, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { createHttpObservables } from '../common/util';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    /*
    document.addEventListener('click', evt => {
      console.log(evt);
      setTimeout(() => {
        console.log('hannnn');
        let counter = 0;
        setInterval(() => {
          console.info(counter);
          counter++;
        }, 3000);
      }, 1000);
    });*/

    /*
    const interval$ = timer(3000, 1000);


    const sub = interval$.subscribe(val => console.log('stream 1: ' + val));
    //interval$.subscribe(val => console.log('stream 2: ' + val));

    setTimeout(() => sub.unsubscribe(), 15000);

    const event$ = fromEvent(document, 'click');
    event$.subscribe(
      val => console.log(val),
      err => console.error(err),
      () => console.log('completed')
    );*/

    // tap - (do) execute something
    // filter - Like ES6 on an array
    // map - Like ES6 on an array
    // shareReplay() - Reuse cahced response of Observable to avoid multiple calls for same data

    // of / Observable.create - Create an Observable
    // fromPromise - Create an Observable from a Promise
    // fromEvent - Create an Observable from an Event (ex: click)
    // timer - Create a setTimeout() Observable
    // intreval - Create a setInterval Observable

    // concat/concatMap
    // Use case -> sequential http calls
    // Will wait for observable 1 to complete before excuting observable 2
    const source1$ = interval(1000);
    const source2$ = of(4, 5, 6);
    const source3$ = of(7, 8, 9);
    const concat$ = concat(source1$, source2$, source3$);
    // concat$.subscribe(console.log);

    // merge/mergeMap
    // Use case -> parallel http calls
    // Will execute observable 1 and observable 2 in parallel
    const interval$ = interval(1000);
    const interval2$ = interval$.pipe(map(val => val * 10));
    const merge$ = merge(interval$, interval2$);
    // merge$.subscribe(console.log);

    // exhaustMap
    // Use case -> multiple clicks on button
    // Will ignore all calls emitted before the completion of the first one.

    // switch/switchMap
    const http$ = createHttpObservables('/api/courses');
    //const sub = http$.subscribe(console.log);
    //setTimeout(() => sub.unsubscribe(), 0);
  }
}
