import { Observable } from 'rxjs';

export function createHttpObservables(url: string): Observable<any> {
  return Observable.create(observer => {

    const controller = new AbortController();
    const signal = controller.signal;
    // Promise
    fetch(url, { signal })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          observer.error(`Request failed with status code: ${response.status}`);
        }
      })
      .then(body => {
        observer.next(body);
        observer.complete();
      })
      .catch(err => {
        observer.error(err);
      });

    return () => controller.abort();
  });
}

