import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { filter, tap, shareReplay } from 'rxjs/operators';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Router } from '@angular/router';
import { PieChartData } from 'src/app/core/models/chartsModels/pie-chart-data.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<Olympic[] | null | undefined> = of(undefined);
  public chartData: PieChartData[] = [];
  public numberOfJos: number = 0;
  public numberOfCountries: number = 0;

  // --- ngx-charts configuration ---
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
  colorScheme: any = {
    domain: ['#956065', '#B8CBE7', '#89A1DB', '#793D52', '#9780A1'] 
  };

  constructor(private olympicService: OlympicService, private router : Router) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics().pipe(
      filter((data): data is Olympic[] => !!data && Array.isArray(data)),
      tap((data: Olympic[]) => {
        // Perform side-effects here to set component properties
        this.numberOfCountries = data.length;
        this.numberOfJos = this.calculateUniqueJos(data);
        this.chartData = this.processDataForChart(data);
      }),
    );
  }

  /**
   * Transforms the Olympic data into the format needed for the ngx-charts pie chart.
   */
  private processDataForChart(olympics: Olympic[]): PieChartData[] {
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
    // We can just count the participations for the first country.
    return olympics[0]?.participations?.length || 0;
  }

  /**
   * Handles the click event on a chart slice.
   */
  onSelect(event: PieChartData): void { 
  
    // Navigate to detail page using the stored ID from 'extra'
    const countryId = event.extra?.id;
    if (countryId !== undefined) { // Check if id exists
      this.router.navigate(['/detail', countryId]);
    } else {
      console.error('Country ID not found in chart data:', event);
    }
  }
}
