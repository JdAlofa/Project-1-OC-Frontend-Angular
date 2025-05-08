# Olympic Games App

This project is an Angular-based application designed to display data about the Olympic Games, including country participation, medals, and other statistics. It uses modern Angular features and libraries to provide a responsive and interactive user experience.

---

## Getting Started

### Prerequisites

Before starting, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 16 or later recommended)
- [Angular CLI](https://angular.io/cli) (version 18.0.3 or later)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Project-1-OC-Frontend-Angular
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server:

```bash
ng serve
```

Navigate to `http://localhost:4200/` in your browser. The application will automatically reload when you make changes to the source files.

### Building the Application

To build the project for production:

```bash
ng build
```

The build artifacts will be stored in the `dist/` directory.

---

## Libraries and Tools Used

This project leverages the following libraries and tools:

- **Angular**: The core framework for building the application.
- **Ngx-Charts**: Used for rendering interactive and responsive charts.
- **RxJS**: For managing asynchronous data streams and reactive programming.
- **Angular Router**: For navigation and routing between pages.
- **HttpClientModule**: For making HTTP requests to fetch data.
- **BrowserAnimationsModule**: For enabling animations in the application.

---

## Application Architecture

The project follows a modular and organized structure to ensure scalability and maintainability. Below is an overview of the key folders and their purposes:

### `src/app/core`

- **`models`**: Contains TypeScript interfaces and models for the application's data (e.g., `Olympic`, `Participation`, `PieChartData`, `LineChartData`).
- **`services`**: Contains the `OlympicService`, which handles fetching and processing Olympic data.

### `src/app/pages`

- **`home`**: Contains the `HomeComponent`, which displays a pie chart of medals per country and summary info boxes.
- **`detail`**: Contains the `DetailComponent`, which shows detailed statistics for a selected country, including a line chart of medals over time.
- **`not-found`**: Contains the `NotFoundComponent`, which displays a 404 error page for invalid routes.

### `src/app/components`

- This folder is reserved for reusable components that can be shared across multiple pages. (Currently empty but can be extended as needed.)

---

## Features

1. **Home Page**:

   - Displays a pie chart of medals per country using `ngx-charts`.
   - Shows summary info boxes for the number of countries and unique Olympic Games years.
   - Allows navigation to a detailed view for each country by clicking on a chart slice.

2. **Detail Page**:

   - Displays detailed statistics for a selected country, including:
     - Total medals
     - Total athletes
     - Total participations
   - Includes a line chart showing medals over time.

3. **404 Page**:
   - Displays a user-friendly error message for invalid routes.

---

## How It Works

1. **Data Fetching**:

   - The `OlympicService` fetches data from a JSON file or API endpoint.
   - Data is processed into reusable observables using RxJS operators like `map`, `filter`, and `tap`.

2. **Reactive Programming**:

   - Observables are used throughout the app to manage data streams.
   - The `async` pipe in templates automatically subscribes to observables and updates the UI when data changes.

3. **Charts**:
   - The `ngx-charts` library is used to render both pie charts and line charts.
   - Data is transformed into the required format using helper functions in the components.