import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export enum RxJsLoggingLevel {
  WARNING,
  DEBUG,
  ERROR,
  LIST
}

export const debug =
  (level: RxJsLoggingLevel, message: string) =>
    (source: Observable<any>) => source
      .pipe(
        tap(val => {
          switch (level) {
            case RxJsLoggingLevel.WARNING:
              console.warn(`${message}:`, val);
              break;
            case RxJsLoggingLevel.ERROR:
              console.error(`${message}:`, val);
              break;
            case RxJsLoggingLevel.LIST:
              console.table(val);
              break;
            default:
              console.log(`${message}:`, val);
          }
        })
      );
