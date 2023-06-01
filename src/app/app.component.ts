import { Component } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { debounceTime, switchMap, takeUntil, skip } from 'rxjs/operators';

const autocomplete = (time, selector) => (source$) =>
  source$.pipe(
    debounceTime(time),
    switchMap((...args: any[]) =>
      selector(...args).pipe(takeUntil(source$.pipe(skip(1))))
    )
  );

@Component({
  selector: 'my-app',
  template: `
    <input type="text" (input)="term$.next($event.target.value)"/>
    {{term$|async}}
    <pre>
      {{results$|async|json}}
    </pre>
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  term$ = new BehaviorSubject<string>('');
  results$ = this.term$.pipe(autocomplete(5000, (term) => this.fetch(term)));

  constructor(private httpClient: HttpClient) {}

  fetch(term: string): Observable<any> {
    return this.httpClient.get('https://swapi.dev/api/people/?search=' + term);
  }
}
