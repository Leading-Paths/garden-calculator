# Garden Shape Calculator Requirements

This document outlines the requirements for the Garden Shape Calculator application, which helps users calculate the area and shape of a garden or plot based on distance measurements between labeled points.

## Business Requirements

### Core Functionality

- **MUST** allow users to define labeled points (A, B, C, D, etc.)
- **MUST** allow users to input distance measurements between any two points
- **MUST** calculate 2D coordinates of points from distance measurements using trilateration
- **MUST** display a 2D visualization of the computed shape
- **MUST** calculate and display the total area of the shape
- **MUST** calculate and display the perimeter of the shape
- **MUST** support both metric (meters) and imperial (feet) units
- **MUST** validate that measurements form a valid geometric shape
- **MUST** allow users to add/remove points and measurements dynamically

### User Experience
- **SHOULD** auto-suggest next point label (A, B, C, etc.)
- **SHOULD** show measurement lines with distances on the visualization
- **SHOULD** provide feedback when measurements are inconsistent
- **SHOULD** allow users to add notes to points
- **SHOULD** persist data in browser localStorage
- **SHOULD** provide suggestions for improving accuracy (e.g., add diagonal measurements)

### Data Management
- **MUST** validate all user inputs
- **MUST** prevent invalid measurements (negative distances, duplicate point pairs)
- **MUST** recalculate shape automatically when measurements change
- **MUST** handle deletion of points (and cascade delete related measurements)

## Technical Requirements

### Framework & Technology
- **MUST** be developed using Next.js 14+ with App Router
- **MUST** use TypeScript for type safety
- **MUST** use Tailwind CSS for styling
- **MUST** use Zustand for state management
- **MUST** use SVG for 2D visualization
- **MUST** implement trilateration algorithm for computing point positions

### Architecture
- **MUST** separate concerns: types, calculations, state management, UI components
- **MUST** use client-side rendering for interactive components
- **MUST** implement proper error handling with user feedback
- **MUST** validate data at both UI and calculation levels

### Deployment
- **MUST** include Docker configuration for containerized deployment
- **MUST** include Vercel deployment configuration
- **MUST** be responsive and work on mobile devices
- **SHOULD** optimize for performance (memoization, efficient re-renders)

## Algorithm Requirements

### Trilateration
- **MUST** place first point at origin (0, 0)
- **MUST** place second point on positive x-axis using distance from first point
- **MUST** compute positions of remaining points using circle-circle intersection
- **SHOULD** use gradient descent or iterative refinement for overdetermined systems
- **SHOULD** minimize error when measurements are slightly inconsistent

### Calculations
- **MUST** use Shoelace formula for polygon area calculation
- **MUST** calculate perimeter as sum of edge lengths
- **MUST** support dynamic recalculation as data changes
- **SHOULD** calculate angles at vertices
- **SHOULD** detect and report measurement inconsistencies

## User Interface Requirements

### Forms
- Point addition form with auto-generated labels
- Measurement form with point selection dropdowns
- Unit selection (meters/feet)

### Displays
- List of all defined points with delete option
- List of all measurements with labels and values
- Results card showing area and perimeter
- Validation status indicator

### Visualization
- SVG-based 2D representation of shape
- Points labeled clearly
- Measurement lines with distance annotations
- Grid background for spatial reference
- Auto-scaling to fit viewport

## Data Model

### Point
- Unique ID
- Label (A, B, C, etc.)
- Optional notes
- Computed 2D position (x, y)

### Measurement
- Unique ID
- Point A ID
- Point B ID  
- Distance value
- Unit of measurement

### Results
- Total area
- Perimeter
- Validity flag
- Error message (if invalid)
- Computed point positions
