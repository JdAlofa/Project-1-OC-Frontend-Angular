import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
// No need to import Participation if only used within Olympic

// Interface for the chart data structure expected by ngx-charts
interface ChartData {
  name: string; // Country name
  value: number; // Total medals
  extra?: { id: number }; // Optional: Store country ID for navigation
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public olympics$: Observable<Olympic[] | null | undefined> = of(undefined);
  public chartData: ChartData[] = [];
  public numberOfJos: number = 0;
  public numberOfCountries: number = 0;

  private dataSubscription: Subscription | undefined;

  // --- ngx-charts configuration ---
  view: [number, number] = [700, 400]; // Width, Height
  gradient: boolean = false;
  showLegend: boolean = false; // Using custom legend/labels
  showLabels: boolean = true; // Show data labels on slices
  isDoughnut: boolean = false; // Pie chart, not doughnut
  tooltipText = (data: any): string => { // Custom tooltip
    // Using 'data.data' because ngx-charts wraps the original object
    return `
      <div class="chart-tooltip">
         <span class="tooltip-label">${data.data.name}</span>
         <span class="tooltip-val"><i class="fas fa-medal"></i> ${data.data.value.toLocaleString()}</span>
      </div>
    `;
  };
  // Define a color scheme (adjust colors to better match the image)
  colorScheme: any = {
    domain: ['#956065', '#B8CBE7', '#89A1DB', '#793D52', '#9780A1'] // Example colors matching image better
  };
  // --- End ngx-charts configuration ---


  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();

    this.dataSubscription = this.olympics$
      .pipe(
        filter((data): data is Olympic[] => !!data && Array.isArray(data))
      )
      .subscribe((data: Olympic[]) => {
        this.numberOfCountries = data.length; // Number of countries is the array length
        this.numberOfJos = this.calculateUniqueJos(data); // Calculate unique JO years
        this.chartData = this.processDataForChart(data);
      });
  }

  ngOnDestroy(): void {
    this.dataSubscription?.unsubscribe();
  }

  /**
   * Transforms the Olympic data into the format needed for the ngx-charts pie chart.
   */
  private processDataForChart(olympics: Olympic[]): ChartData[] {
    return olympics.map(olympic => ({
      name: olympic.country,
      value: olympic.participations.reduce((sum, p) => sum + p.medalsCount, 0),
      extra: { id: olympic.id } // Store ID if needed for navigation later
    }));
  }

  /**
   * Calculates the number of unique Olympic Games years from the participation data.
   */
  private calculateUniqueJos(olympics: Olympic[]): number {
    if (!olympics || olympics.length === 0) {
      return 0;
    }
    // Assuming all countries participated in the same years based on the mock data structure
    // We can just count the participations for the first country.
    // If participation years could differ per country, a Set-based approach would be needed.
    return olympics[0]?.participations?.length || 0;
    /* // Alternative: Use Set if years might differ per country
    const uniqueYears = new Set<number>();
    olympics.forEach(o => {
      o.participations.forEach(p => {
        uniqueYears.add(p.year);
      });
    });
    return uniqueYears.size;
    */
  }

  /**
   * Handles the click event on a chart slice.
   */
  onSelect(event: any): void {
    console.log('Chart item selected:', event);
    // Example: Navigate to a detail page using the stored ID
    // const countryId = event.extra?.id;
    // if (countryId) {
    //   this.router.navigate(['/detail', countryId]); // Requires importing Router
    // }
  }
}
