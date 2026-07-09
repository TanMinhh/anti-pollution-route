# Anti-Pollution Routes

A real-time routing service that tracks pollution and weather data to suggest cleaner travel routes. Built with the MERN stack.

## Features

* Real-time air quality tracking using OpenWeatherMap API
* Route visualization via React Leaflet and OSRM
* Automated background workers for continuous monitoring
* Email and WhatsApp alerts for clean air routes

## Tech Stack

* **Frontend:** React, React Leaflet, Axios
* **Backend:** Node.js, Express, MongoDB, node-cron
* **APIs & Services:** OpenWeatherMap, OSRM, Nodemailer, Twilio

## Prerequisites

* Node.js installed
* MongoDB cluster
* Twilio account
* OpenWeatherMap API key
* Gmail App Password

## Installation

### 1. Setup Backend

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install