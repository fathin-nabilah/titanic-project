import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerChartComponent } from './passenger-chart.component';

describe('PassengerChartComponent', () => {
  let component: PassengerChartComponent;
  let fixture: ComponentFixture<PassengerChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PassengerChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassengerChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
