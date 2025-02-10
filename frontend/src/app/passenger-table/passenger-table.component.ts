import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PassengerService } from '../services/passenger.service';


@Component({
  selector: 'app-passenger-table',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './passenger-table.component.html',
  styleUrls: ['./passenger-table.component.scss']
})
export class PassengerTableComponent implements OnInit {

  @Input() filters: any;

  passengers: any[] = [];
  headers: string[] = [];
  keys: string[] = [];

  constructor(
    private passengerService: PassengerService
  ) {}


  ngOnInit() {
    this.fetchPassengers();
  }

  ngOnChanges() {
    this.fetchPassengers();
  }

  fetchPassengers() {
    this.passengerService
    .filteredPassengers(this.filters)
    .subscribe({ next: (passengers: any) => {
        // console.log('Success get passengers: ', passengers)
        this.passengers = passengers.map((passenger: any) => this.formatPassenger(passenger));;

        if (this.passengers.length > 0) {
          this.keys = [
            'PassengerId',
            'Survived',
            'TicketClass',
            'Name',
            'Gender',
            'Age',
            '#SiblingsSpouseAboard',
            '#ParentsChildrenAboard',
            'Ticket',
            'Fare',
            'Cabin',
            'Embarked'
          ];
    
          this.headers = [
            'Passenger ID',
            'Survival Status',
            'Ticket Class',
            'Name',
            'Gender',
            'Age',
            '# Siblings/Spouse Aboard',
            '# Parents/Children Aboard',
            'Ticket',
            'Fare',
            'Cabin',
            'Embarked Location'
          ];
        }
      }, error: (err) => {
        console.error('Error fetching passengers data: ', err)
      }
    })
  }

  formatPassenger(passenger: any): any {
    return {
      ...passenger,
      Survived: passenger.Survived === 1 ? 'Survived' : "Didn't Survive",
      TicketClass: passenger.Pclass === 1 ? 'Upper' : passenger.Pclass === 2 ? 'Middle' : 'Lower',
      Gender: passenger.Sex.charAt(0).toUpperCase() + passenger.Sex.slice(1),
      '#SiblingsSpouseAboard': passenger.SibSp,
      '#ParentsChildrenAboard': passenger.Parch,
      Embarked:
        passenger.Embarked === 'C'
          ? 'Cherbourg'
          : passenger.Embarked === 'Q'
          ? 'Queenstown'
          : passenger.Embarked === 'S'
          ? 'Southampton'
          : passenger.Embarked,
    };
  }

}
