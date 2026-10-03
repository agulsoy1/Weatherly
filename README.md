# Weatherly

A full-stack weather application that provides current weather conditions and forecasts based on a user's location using React, Node.js, and the OpenWeather API.

## Live Demo

[View the live application](https://weatherly-frontend.vercel.app/)

## Overview

Weatherly is a full-stack weather application that allows users to search for a city and view its current weather conditions and forecast.

The application uses a React and Vite frontend connected to a Node.js backend. The backend communicates with the OpenWeather API to retrieve current weather and forecast data.

The application displays weather information through an interactive and responsive interface, including temperature, weather conditions, and forecast data. Users can also switch between Fahrenheit and Celsius.

## Tech Stack

* React
* JavaScript
* Vite
* Node.js
* OpenWeather API
* Axios
* React Router
* Tailwind CSS
* dotenv
* HTML
* CSS

## Features

* City-based weather search
* Current weather information
* Weather forecast information
* Fahrenheit and Celsius temperature conversion
* Weather condition icons
* Dynamic weather descriptions
* Interactive web interface
* OpenWeather API integration
* Node.js backend
* React frontend
* Axios HTTP requests
* React Router navigation
* Secure environment variable configuration
* Error handling for API requests
* Responsive user interface

## My Contributions

I developed this project to practice working with Node.js, React, external APIs, routing, and full-stack application development. My contributions included:

* Built the Weatherly web application using React and Vite
* Developed a Node.js backend to handle OpenWeather API requests
* Integrated the OpenWeather API
* Used Axios to handle HTTP requests
* Implemented city-based weather searches
* Implemented current weather and forecast data retrieval
* Implemented weather data retrieval using geographic coordinates
* Configured environment variables using dotenv
* Implemented error handling for API requests
* Added React Router for page navigation
* Created a dedicated weather results page
* Implemented Fahrenheit and Celsius temperature switching
* Created reusable weather icon components
* Built a responsive user interface using Tailwind CSS
* Connected the React frontend with the Node.js backend
* Used Git for version control and incremental development

## Getting Started

### Prerequisites

* Node.js
* npm
* OpenWeather API Account

### Installation

Clone the repository:

```
git clone https://github.com/agulsoy1/Weatherly.git
cd Weatherly
```

Install the project dependencies:

```
npm install
```

### Environment Variables

Create a `.env` file inside the `backend` directory:

```
OPENWEATHER_API_KEY=your_openweather_api_key
```

Replace the placeholder value with your OpenWeather API key.

The backend uses this API key to authenticate with the OpenWeather API.

Make sure `.env` is included in `.gitignore` so your API key is not committed to GitHub.

### Running the Appl
