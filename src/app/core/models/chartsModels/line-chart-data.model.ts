// Interface for the line chart data structure
export interface LineChartData {
    name: string; // Country name
    series: { name: string; value: number }[]; // Year and medals/athletes
  }
  