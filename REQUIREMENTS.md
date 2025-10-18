# Garden Calculator Requirements

This document outlines the requirements for the Garden Calculator application, which is designed to help users plan and manage their gardening activities effectively.

## Business requirements

- MUST be able to display/render the garden layout in a 2D grid format.
- MUST allow users to input garden dimensions (length and width).
- MUST allow users to select the units of measurement (e.g., feet, meters).
- MUST allow users to choose the number of measurement points taken.
- MUST allow users to input the distance between measurement points.
- MUST calculate and display the total area of the garden based on user inputs.
- MUST calculate and display the perimeter of the garden based on user inputs.
- Must allow users to define different sections of the garden (e.g., flower beds, vegetable patches, pathways).
- MUST assist the users but requesting additional information about the garden layout, such as additional measurement points or specific shapes.
- MUST allow users to specify the type of object at the measurement points (e.g., plants, trees, decorations, retaining walls, steps, pathways).
- MUST allow users to select an object type for a specific shape (e.g., rectangle, circle, triangle), based on a number of measurements points and/or a radius.
- MUST allow users to input additional notes or comments about the garden layout.
- SHOULD layout the garden drawing on top of a map (e.g., Google Maps, OpenStreetMap) to provide context for the garden's location.
- SHOULD provide suggestions for optimizing garden layout based on best practices (e.g., plant spacing, sunlight exposure).
- SHOULD allow users to save and export their garden plans in various formats (e.g., PDF, image files).
- SHOULD display angles between measurement points when applicable.
- SHOULD allow users to show/hide measurement points on the garden layout or per shape/zones.

## Technical requirements

- MUST be developed using a web-based framework NextJS to ensure accessibility across different devices.
- MUST use a responsive design to ensure usability on both desktop and mobile devices.
- MUST create a docker compose file to facilitate easy deployment and scaling of the application.
- MUST create a Vercel deployment configuration to enable seamless deployment to the Vercel platform.
- MUST implement input validation to ensure that all user inputs are valid and within acceptable ranges.
- MUST provide error handling to manage any issues that arise during user input or calculations using toast notifications.
- MUST use LeafletJS for rendering the garden layout on a map.
- SHOULD request measurement points GPS coordinates to accurately place the garden layout on the map.
