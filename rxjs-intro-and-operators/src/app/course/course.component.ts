import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Course } from "../model/course";
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll, shareReplay
} from 'rxjs/operators';
import { merge, fromEvent, Observable, concat } from 'rxjs';
import { Lesson } from '../model/lesson';
import { createHttpObservables } from './../common/util';
import { RxJsLoggingLevel, debug, setRxJsLoggingLevel } from '../common/debug';


@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {

  courseId: string;
  course$: Observable<Course>;
  lessons$: Observable<Lesson[]>;

  @ViewChild('searchInput', { static: true }) input: ElementRef;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.courseId = this.route.snapshot.params['id'];
    this.course$ = createHttpObservables(`/api/courses/${this.courseId}`);
  }

  ngAfterViewInit() {
    this.lessons$ = fromEvent<Event>(this.input.nativeElement, 'keyup')
      .pipe(
        map(event => (<HTMLTextAreaElement>event.target).value),
        startWith(''),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(searchTerm => this.loadLessons(searchTerm))
      );
  }

  loadLessons(searchTerm = ''): Observable<Lesson[]> {
    return createHttpObservables(`/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${searchTerm}`)
      .pipe(
        map(res => res['payload'])
      );
  }
 
}
