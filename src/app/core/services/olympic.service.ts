import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic'; // Import the interface

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[] | null | undefined>(undefined);

  constructor(private http: HttpClient) {}

  loadInitialData(): Observable<Olympic[] | null> { // Return type reflects potential null from catchError
    return this.http.get<Olympic[]>(this.olympicUrl).pipe( // Use the interface in http.get
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next(null);
        return caught;
      })
    );
  }

  // Update the return type of the getter function
  getOlympics(): Observable<Olympic[] | null | undefined> {
    return this.olympics$.asObservable();
  }
}
