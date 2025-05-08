import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable,  of, combineLatest } from 'rxjs';
import { filter, map,  tap } from 'rxjs/operators';
import { Olympic } from 'src/app/core/models/Olympic';
import { Participation } from 'src/app/core/models/Participation';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { LineChartData } from 'src/app/core/models/chartsModels/line-chart-data.model';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  public countryData$: Observable<Olympic | null | undefined> = of(undefined); // Observable for the specific country
  public lineChartData$: Observable<LineChartData[] | null> = of(null); // Observable for chart data

  // Info box data
  public countryName: string = '';
  public totalEntries: number = 0;
  public totalMedals: number = 0;
  public totalAthletes: number = 0;

  // --- ngx-charts line chart options ---
  legend: boolean = false;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = false; 
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Dates';
  yAxisLabel: string = 'Medals'; // 
  timeline: boolean = false; 
  colorScheme: any = {
    domain: ['#956065', '#B8CBE7', '#89A1DB', '#793D52', '#9780A1'], 
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private olympicService: OlympicService
  ) {}

  ngOnInit(): void {
    // Geting the country ID from the route parameters
    const countryId$ = this.route.paramMap.pipe(
      map((params) => params.get('id')),
      filter((id): id is string => id !== null), // Ensure ID is not null
      map((id) => +id), // Convert ID to number
      filter((id) => !isNaN(id)) // Ensure it's a valid number
    );

    // Apply the filter HERE, before combineLatest uses the observable
    const olympicsList$ = this.olympicService.getOlympics().pipe(
      filter((data): data is Olympic[] => !!data && Array.isArray(data)) // Ensure data is loaded and is an array
    );

    // Combine ID and data to find the specific country
    this.countryData$ = combineLatest([countryId$, olympicsList$]).pipe(
      map(([id, olympics]) => {
        const foundCountry = olympics.find((o) => o.id === id);
        if (!foundCountry) {
          console.error('Country not found for ID:', id, 'in data:', olympics); // Log data for debugging
          this.router.navigate(['/not-found']); // Redirect if country not found
          return null; // Return null if not found
        }
        return foundCountry;
      }),
      filter((country): country is Olympic => country !== null), // Proceed only if country was found
      tap((country) => {
        // Update info box data when country data is available
        this.countryName = country.country;
        this.totalEntries = country.participations.length;
        this.totalMedals = country.participations.reduce(
          (sum, p) => sum + p.medalsCount,
          0
        );
        this.totalAthletes = country.participations.reduce(
          (sum, p) => sum + p.athleteCount,
          0
        );
      })
    );

    // Prepare data for the line chart
    this.lineChartData$ = this.countryData$.pipe(
      map((country) => {
        if (!country) return null;
        const chartData = [this.processDataForLineChart(country)];
        return chartData;
      })
    );

  
  }

  // Helper function to process data for the line chart
  private processDataForLineChart(country: Olympic): LineChartData {
    return {
      name: country.country,
      series: country.participations.map((p: Participation) => ({
        name: String(p.year), // Year as string for x-axis label
        value: p.medalsCount, // Plotting medals count
        // value: p.athleteCount, // Or plot athlete count
      })),
    };
  }

  // Function to navigate back
  goBack(): void {
    this.router.navigate(['/']);
  }
}
