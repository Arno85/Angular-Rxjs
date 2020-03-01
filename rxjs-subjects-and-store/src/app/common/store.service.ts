import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject, timer } from 'rxjs';
import { Course } from '../model/course';
import { createHttpObservable } from './util';
import { tap, map, shareReplay, retryWhen, delayWhen, filter } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';

@Injectable({
  providedIn: 'root'
})
export class Store {
  private subject = new BehaviorSubject<Course[]>([]);

  courses$ = this.subject.asObservable();

  init() {
    const http$ = createHttpObservable('/api/courses');

    http$
      .pipe(
        tap(() => console.log('HTTP request executed')),
        map<object, Course[]>(res => Object.values(res['payload']))
      )
      .subscribe(courses => this.subject.next(courses));
  }

  selectBeginnerCourses() {
    return this.filterByCategory('BEGINNER');
  }

  selectAdvancedCourses() {
    return this.filterByCategory('ADVANCED');
  }

  saveCourse(id: number, changes: any): Observable<any> {
    const courses = [...this.subject.getValue()];
    const courseIndex = courses.findIndex(course => course.id === id);
    courses[courseIndex] = {
      ...courses[courseIndex],
      ...changes
    };
    this.subject.next(courses);

    return fromPromise(fetch(`api/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(changes),
      headers: {
        'content-type': 'application/json'
      }
    }));
  }

  selectCourseById(courseId: number) {
    return this.courses$
      .pipe(
        map(courses => courses.find(course => course.id === courseId)),
        filter(course => !!course)
      );
  }

  private filterByCategory(category: string) {
    return this.courses$
      .pipe(
        map(courses => courses.filter(course => course.category === category))
      );
  }

}
