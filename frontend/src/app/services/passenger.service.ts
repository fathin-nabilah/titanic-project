import { Injectable } from '@angular/core';
import { HttpClient }  from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class PassengerService {

  private apiUrl = 'http://localhost:3000/api/passengers';

  constructor(
    private http: HttpClient
  ) { }

  getPassengers() {
    return this.http.get(this.apiUrl);
  }

  filteredPassengers(filters: any) {
    return this.http.post(`${this.apiUrl}/filter`, filters);
  }
}
