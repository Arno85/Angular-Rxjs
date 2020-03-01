import { Component, OnInit } from '@angular/core';
import { Course } from "../model/course";
import { interval, Observable, of, timer, noop, throwError } from 'rxjs';
import { catchError, delayWhen, map, retryWhen, shareReplay, tap, finalize, retry } from 'rxjs/operators';
import { createHttpObservables } from '../common/util';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor() {

  }

  ngOnInit() {
    const http$ = createHttpObservables('/api/courses');
    const courses$ = http$.pipe(
      map<any, Course[]>(res => Object.values(res['payload'])),
      shareReplay(),
      retryWhen(errors => errors
        .pipe(
          delayWhen(() => timer(4000))
        )
      )
    );

    this.beginnerCourses$ = courses$.pipe(
      map(courses => courses
        .filter(course => course.category === 'BEGINNER')
      )
    );

    this.advancedCourses$ = courses$.pipe(
      map(courses => courses
        .filter(course => course.category === 'ADVANCED')
      )
    );
  }

}
