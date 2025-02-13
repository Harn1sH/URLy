# URL Shortener Platform
## Tech stack
  - **Runtime**: Node.js
  - **Framework**: Exress.js
  - **Database**: MySQL
  - **ORM**: typeORM
  - **Caching**: redis

## Overview
URLy is a URL shortener people to create short URLs that includes advanced analytics, user authentication via Google Sign-In, and rate limiting. It supports unique features such as grouping links under specific topics and providing detailed analytics for both individual and overall URLs. 

## Features
- **Shorten URL**: Allows users can generate shorter url for any given URL under any topics or a specified alias.
- **Analytics Tracking**: Tracks the number of clicks per link and the number of unique users.
- **Click Tracking by Date**: Stores click counts for the last 7 days.
- **User Uniqueness Detection**: Uses Redis to track unique visitors based on IP addresses.
- **Authorization Support**: Uses token-based authentication for secured endpoints.

## Prerequisites
Ensure you have the following installed:
- **Node.js** (>= 14.x)
- **Redis Server** 
- **MySQL** 
- **Postman** 

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/Harn1sH/URLy
   cd URLy
   ```

2. Install dependencies:
   ```sh
   npm install --dev
   ```

3. Configure environment variables:
   - Create a `.env` file in the root directory and add:
     ```env
      PORT=
      SQL_USERNAME=
      SQL_PASSWORD=
      SQL_DATABASE=
      GOOGLE_CALLBACK_URL=
      GOOGLE_CLIENT_ID=
      GOOGLE_CLIENT_SECRET=
      JWT_SECRET=
      REDIS_USERNAME=
      REDIS_PASSWORD=
      REDIS_HOST=
      REDIS_PORT=
     ```

## Running the Project
2. **Start the backend server**:
   ```sh
    nodemon
   ```
   The server should now be running at `http://localhost:3000` or at specified port.

## API Endpoints
### 1. Shorten a URL
**Endpoint:** `POST  /api/shorten`

**Request Body:**
```json
{
  "longUrl": "https://exampleLongURL.com",
  "topic": "topic,
  "customAlias": "alias"
}
```

**Response:**
```json
{
  "shortUrl": "http://url.ly/alias",
  "longUrl": "https://exampleLongURL.com"
}
```

### 1. Redirect to Long Url
**Endpoint:** `GET /api/shorten/:customAlias`

**Response:**
302 response, redirects to the long URL


### 2. Get analytics for specific URL
**Endpoint:** `GET /api/analytics/:alias`

**Response:**
```json
{
  "totalClicks": 0,
  "uniqueUsers": 0,
  "clicksByDate": [
    {
      "date": "2025-02-13",
      "clickCount": 0
    }
  ],
  "osType": [
    {
      "osName": "string",
      "uniqueClicks": 0,
      "uniqueUsers": 0
    }
  ],
  "deviceType": [
    {
      "deviceName": "string",
      "uniqueClicks": 0,
      "uniqueUsers": 0
    }
  ]
}
```

### 2. Get analytics for URLs of same topic
**Endpoint:** `GET /api/analytics/topic/:topic`

**Response:**
```json
{
  "totalClicks": 0,
  "uniqueUsers": 0,
  "clicksByDate": [
    {
      "date": "2025-02-13",
      "clickCount": 0
    }
  ],
  "urls": [
    {
      "shortUrl": "string",
      "totalClicks": 0,
      "uniqueUsers": 0
    }
  ]
}
```

### 2. Get analytics for all URLs
**Endpoint:** `GET /api/analytics/overall/url`

**Response:**
```json
{
  "totalUrls": 0,
  "totalClicks": 0,
  "uniqueUsers": 0,
  "clicksByDate": [
    {
      "date": "2025-02-03",
      "clickCount": 0
    }
  ],
  "osType": [
    {
      "osName": "string",
      "uniqueClicks": 0,
      "uniqueUsers": 0
    }
  ],
  "deviceType": [
    {
      "deviceName": "string",
      "uniqueClicks": 0,
      "uniqueUsers": 0
    }
  ]
}
```

<!-- ## Challenges Faced & Solutions
### 1. **Tracking Unique Users Without Login**
- **Problem:** Users do not need to log in, making uniqueness tracking difficult.
- **Solution:** Used Redis to store unique IPs and to check if a user has already visited.

### 2. **Efficiently Storing Clicks for the Last 7 Days**
- **Problem:** Old records needed to be removed, and new ones added dynamically.
- **Solution:** Implemented an array-based approach where the oldest date is removed if the array exceeds 7 entries. -->


