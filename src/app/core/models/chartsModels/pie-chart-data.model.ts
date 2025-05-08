// Interface for the chart data structure expected by ngx-charts
export interface PieChartData {
    name: string; // Country name
    value: number; // Total medals
    extra?: { id: number }; //Store country ID for navigation
  }