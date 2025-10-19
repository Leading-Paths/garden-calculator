# Garden Calculator

A comprehensive web application for planning and managing garden layouts with precision. Built with Next.js 15, React 19, TypeScript, Tailwind CSS, and Leaflet for interactive mapping.

## Features

### Core Features (MUST Requirements)

- ✅ **2D Garden Layout Display**: Interactive map-based garden visualization using Leaflet
- ✅ **Garden Dimensions Input**: Configure length, width, and units (feet/meters)
- ✅ **Measurement Points**: Add GPS-based measurement points OR calculate from distance and bearing
- ✅ **Distance-Based Points**: Only need 2 GPS points - calculate others using distance and bearing
- ✅ **Area Calculations**: Automatic calculation of total garden area
- ✅ **Perimeter Calculations**: Automatic calculation of garden perimeter
- ✅ **Garden Sections**: Define different zones (flower beds, vegetable patches, pathways)
- ✅ **Shape Creation**: Create shapes (rectangles, circles, triangles, polygons) based on measurement points
- ✅ **Object Types**: Specify object types (plants, trees, decorations, retaining walls, steps, pathways)
- ✅ **Additional Notes**: Add notes to measurement points and shapes
- ✅ **Input Validation**: Comprehensive validation with toast notifications
- ✅ **Error Handling**: User-friendly error messages via toast notifications

### Advanced Features (SHOULD Requirements)

- ✅ **Map Integration**: Garden layout rendered on OpenStreetMap
- ✅ **GPS Coordinates**: Measurement points use GPS coordinates for accurate placement
- ✅ **Layout Suggestions**: AI-powered recommendations based on best practices
- ✅ **Angle Display**: Shows angles between measurement points
- ✅ **Show/Hide Controls**: Toggle visibility of sections and shapes

## Technology Stack

- **Framework**: Next.js 15.5.6 (App Router)
- **React**: 19.1.0
- **TypeScript**: 5.x
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand 5 (with persistence)
- **Mapping**: Leaflet 1.9.4 + React-Leaflet 5
- **Notifications**: React Hot Toast
- **Package Manager**: Yarn 1.22.19
- **Node**: 22.15

## Getting Started

### Prerequisites

- Node.js 22.15 or higher
- Yarn 1.22.19 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/Leading-Paths/garden-calculator.git
cd garden-calculator

# Install dependencies
yarn install

# Run development server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Available Scripts

- `yarn dev` - Start development server with Turbopack
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint

## Docker Deployment

### Using Docker Compose

```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Manual Docker Build

```bash
# Build image
docker build -t garden-calculator .

# Run container
docker run -p 3000:3000 garden-calculator
```

## Vercel Deployment

The application is optimized for Vercel deployment:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Vercel will automatically detect Next.js and deploy

Or use the Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## Usage Guide

### 1. Set Garden Dimensions

- Enter length and width
- Select unit of measurement (meters or feet)
- Click "Update Dimensions"

### 2. Add Measurement Points

**Option A: GPS Reference Points**

- Enter a label for the point (e.g., "Corner A")
- Input GPS coordinates (latitude and longitude)
- Optionally add notes
- Click "Add Point"
- This creates a GPS reference point

**Option B: Distance-Based Points** (Requires at least 1 GPS reference point)

- Enter a label for the point (e.g., "Point B")
- Enter distance from the previous point (in meters or feet)
- Enter bearing/direction (0° = North, 90° = East, 180° = South, 270° = West)
- Optionally add notes
- Click "Calculate & Add Point"
- GPS coordinates are automatically calculated

### 3. Create Sections

- Enter a section name (e.g., "Vegetable Garden")
- Click "Add Section"

### 4. Add Shapes

- Select a section
- Choose shape type (polygon, rectangle, triangle, circle)
- Select object type (flower-bed, vegetable-patch, etc.)
- Select measurement points to define the shape
- For circles, specify the radius
- Click "Add Shape"

### 5. View Results

- Total area and perimeter are automatically calculated
- Section areas are displayed
- Angles between measurement points are shown
- Layout suggestions appear based on your garden configuration

### 6. Manage Visibility

- Toggle section visibility using the eye icon
- Toggle individual shape visibility
- Hide/show measurement points on the map

## Project Structure

```sh
garden-calculator/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout with Toaster
│   │   ├── page.tsx            # Main application page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── GardenMap.tsx       # Leaflet map component
│   │   ├── forms/              # Form components
│   │   │   ├── GardenDimensionsForm.tsx
│   │   │   ├── MeasurementPointForm.tsx
│   │   │   └── ShapeForm.tsx
│   │   ├── display/            # Display components
│   │   │   ├── CalculationResults.tsx
│   │   │   ├── MeasurementPointsList.tsx
│   │   │   ├── SectionsList.tsx
│   │   │   └── GardenSuggestions.tsx
│   │   └── layout/             # Layout components (empty)
│   ├── lib/
│   │   ├── store.ts            # Zustand state management
│   │   ├── calculations.ts     # Garden calculation utilities
│   │   └── validation.ts       # Input validation utilities
│   └── types/
│       └── garden.ts           # TypeScript type definitions
├── public/                     # Static assets
├── Dockerfile                  # Docker configuration
├── docker-compose.yml          # Docker Compose configuration
├── vercel.json                 # Vercel deployment configuration
├── next.config.ts              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
├── eslint.config.mjs           # ESLint configuration
├── postcss.config.mjs          # PostCSS configuration
└── package.json                # Dependencies and scripts
```

## State Management

The application uses Zustand for state management with localStorage persistence:

- Garden dimensions and units
- Measurement points with GPS coordinates
- Sections and shapes
- Calculation results
- User notes

Data persists across browser sessions automatically.

## Calculations

### Area Calculation

- Uses the Shoelace formula for polygon areas
- Handles rectangles, triangles, and custom polygons
- Circle areas calculated using πr²

### Distance Calculation

- Uses Haversine formula for GPS coordinate distances
- Accurate for Earth's curvature
- Returns distances in meters

### Angle Calculation

- Calculates interior angles at measurement points
- Displayed in degrees
- Useful for planning irrigation and pathways

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Requirements Checklist

See [REQUIREMENTS.md](./REQUIREMENTS.md) for the complete list of business and technical requirements.

## License

This project is private and proprietary to Leading Paths.

## Support

For issues or questions, please open an issue on GitHub.
