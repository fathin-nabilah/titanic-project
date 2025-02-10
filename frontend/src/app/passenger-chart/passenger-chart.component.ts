import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PieController,
  BarController,
  Tooltip,
  Legend } from 'chart.js'
import { PassengerService } from '../services/passenger.service';

@Component({
  selector: 'app-passenger-chart',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './passenger-chart.component.html',
  styleUrls: ['./passenger-chart.component.scss']
})

export class PassengerChartComponent implements OnChanges{

  @Input() filters: any;
  
  classPieChart: any;
  genderBarChart: any;
  passengersData: any = [];
  survivalRate: any = [];
  averageAge: any = [];

  constructor(
    private passengerService: PassengerService
  ) {}

 

  ngOnChanges(changes: SimpleChanges) {
    
    Chart.register(
      ArcElement,
      BarElement,
      CategoryScale,
      LinearScale,
      PieController,
      BarController,
      Tooltip,
      Legend
    );

    if (changes['filters'] && this.filters) {
      this.fetchFilteredData()
    }
  }

  fetchFilteredData() {
    this.passengerService
    .filteredPassengers(this.filters)
    .subscribe({ next: (passengers: any) => {
        this.passengersData = passengers
        // console.log('passengers data: ', this.passengersData)
        console.log('passengers data count: ', this.passengersData.length)
        
        let survivors = passengers.filter((p: any) => p.Survived === 1).length;
        let survivorsRate = passengers.length > 0 ? (survivors / passengers.length) * 100 : 0;
        this.survivalRate = survivorsRate.toFixed(2)

        let validAge = passengers.filter((p: { Age: null; }) => p.Age !== null)
        let totalAge = validAge.reduce((sum: any, p: { Age: any; }) => sum + p.Age, 0)
        let totalAverageAge = validAge.length > 0 ? totalAge/validAge.length: 0
        this.averageAge = totalAverageAge.toFixed(2)

        this.updateGenderBarChart(passengers)
        this.updateClassPieChart(passengers)
      }, error: (err) => {
        console.error('Error fetching filtered passengers: ', err)
      }
    })
  }


  updateGenderBarChart(passengers: any[]) {
    const survivedMale = passengers.filter(
      (p) => p.Sex === 'male' && p.Survived === 1
    ).length;
    const notSurvivedMale = passengers.filter(
      (p) => p.Sex === 'male' && p.Survived === 0
    ).length;
    const survivedFemale = passengers.filter(
      (p) => p.Sex === 'female' && p.Survived === 1
    ).length;
    const notSurvivedFemale = passengers.filter(
      (p) => p.Sex === 'female' && p.Survived === 0
    ).length;

    const ctx = document.getElementById('genderBarChart') as HTMLCanvasElement;
    if (this.genderBarChart) this.genderBarChart.destroy();

    this.genderBarChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Male', 'Female'],
        datasets: [
          {
            label: 'Survived',
            data: [survivedMale, survivedFemale],
            backgroundColor: '#36A2EB',
          },
          {
            label: 'Did Not Survive',
            data: [notSurvivedMale, notSurvivedFemale],
            backgroundColor: '#FF6384',
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  updateClassPieChart(passengers: { Pclass: 1 | 2 | 3 }[]) {

    const classLabelsMap: { [key: number]: string } = {
      1: 'Upper',
      2: 'Middle',
      3: 'Lower',
    };

    const classCounts = passengers.reduce((acc: { [key: string]: number }, p) => {
      const classLabel = classLabelsMap[p.Pclass];
      acc[classLabel] = (acc[classLabel] || 0) + 1;
      return acc;
    }, {});

    const ctx = document.getElementById('classPieChart') as HTMLCanvasElement;
    if (this.classPieChart) this.classPieChart.destroy();

    this.classPieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(classCounts),
        datasets: [
          {
            data: Object.values(classCounts),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          },
        ],
      },
    });
  }
}
