# Garden Shape Calculator

A web application that calculates the area and shape of a garden or plot based on distance measurements between labeled points.

## How It Works

Instead of requiring GPS coordinates or manual drawing, this calculator uses **trilateration** to compute the shape of your garden from distance measurements:

1. **Add Points**: Define labeled points (A, B, C, D, etc.) around your garden
2. **Add Measurements**: Input the distances you've measured between these points
3. **View Results**: The app automatically:
   - Calculates the 2D positions of all points
   - Draws the shape of your garden
   - Computes the total area and perimeter

## Example Usage

For a rectangular garden:

1. Add 4 points: A, B, C, D
2. Add measurements:
   - A to B: 10 meters (one side)
   - B to C: 5 meters (adjacent side)
   - C to D: 10 meters (opposite side)
   - D to A: 5 meters (remaining side)
   - A to C: 11.2 meters (diagonal, optional for accuracy)

The calculator will display your rectangle with the correct shape and calculate the area as 50 m².

## Features

- ✅ Calculate area from distance measurements
- ✅ Support for any polygon shape (3+ points)
- ✅ Real-time 2D visualization
- ✅ Metric and imperial units
- ✅ Automatic validation of measurements
- ✅ Suggestions for improving accuracy
- ✅ Responsive design for mobile/desktop

## Getting Started

### Development

```bash
# Install dependencies
yarn install

# Run development server
yarn dev

# Open http://localhost:3000
```

### Production

```bash
# Build for production
yarn build

# Start production server
yarn start
```

### Docker

```bash
# Build image
docker build -t garden-calculator .

# Run container
docker run -p 3000:3000 garden-calculator
```

## Tech Stack

Framework: Next.js 14 (App Router)
Language: TypeScript
Styling: Tailwind CSS
State Management: Zustand
Visualization: SVG
Algorithm: Trilateration with gradient descent

## How Trilateration Works

The calculator uses a mathematical technique called trilateration to determine point positions:

1. First point is placed at the origin (0, 0)
1. Second point is placed on the x-axis at the measured distance
1. Remaining points are positioned by finding the intersection of circles centered at known points with radii equal to the measured distances
1. When measurements are overdetermined (more than minimum required), the algorithm minimizes error across all measurements

## Tips for Best Results

- Measure between all adjacent points (edges of your shape)
- Add diagonal measurements for better accuracy
- Use consistent units (don't mix meters and feet)
- Double-check measurements before entering
- Add at least 3 points to form a shape

## License

MIT
