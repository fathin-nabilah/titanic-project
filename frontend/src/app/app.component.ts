import { Component } from '@angular/core';
import { PassengerChartComponent } from './passenger-chart/passenger-chart.component';
import { PassengerTableComponent } from './passenger-table/passenger-table.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    PassengerChartComponent,
    PassengerTableComponent,
    FormsModule,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'Titanic Dashboard';

  passengerClassOptions = [
    { value: '1', label: 'Upper Class' },
    { value: '2', label: 'Middle Class' },
    { value: '3', label: 'Lower Class' }
  ];
  
  genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' }
  ];
  
  embarkationPointOptions = [
    { value: 'C', label: 'Cherbourg' },
    { value: 'Q', label: 'Queenstown' },
    { value: 'S', label: 'Southampton' },
    { value: 'null', label: 'Unknown' }
  ];
  
  travellingStatusOptions = [
    { value: 'all', label: 'All' },
    { value: 'alone', label: 'Alone' },
    { value: 'family', label: 'Family' }
  ];

  filters: any = {
    survivalStatus: ['all'],
    ageRange: {min:0, max:100, includeNull: true},
    passengerClass: ['1', '2', '3'],
    gender: ['male', 'female'],
    embarkationPoint: ['C', 'Q', 'S', 'null'],
    travellingStatus: ['all'],
  };

  validateFilters(): boolean {
    const isValid = 
      this.filters.passengerClass.length > 0 &&
      this.filters.gender.length > 0 &&
      this.filters.embarkationPoint.length > 0 &&
      this.filters.travellingStatus.length > 0;

    if (!isValid) {
      alert('Please select one option for each filter!')
    }

    return isValid
  }

  onCheckboxChange(value: string, filterKey: string) {
    const filter = this.filters[filterKey];

    if (filter.includes(value)) {
      this.filters[filterKey] = filter.filter((item: string) => item !== value);
    } else {
      this.filters[filterKey].push(value);
    }

    this.validateFilters();

    // console.log('Updated filters:', this.filters);
    
    this.onFilterChange(this.filters)
  }

  onFilterChange (updatedFilters: any) {
    this.filters = { ...this.filters, ...updatedFilters}
    console.log('filters: ', this.filters)
  }
}
