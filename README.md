# URLy
## Tech stack
  - **Runtime**: Node.js
  - **Framework**: Exress.js
  - **Database**: MySQL
  - **ORM**: typeORM
  - **Caching**: redis

## live URL
[URLy hotsed link](https://urly-ovr0.onrender.com/)


## Overview
URLy is a URL shortener people to create short URLs that includes advanced analytics, user authentication via Google Sign-In, and rate limiting. It supports unique features such as grouping links under specific topics and providing detailed analytics for both individual and overall URLs. 

## Features
- **Shorten URL**: Allows users to generate shorter url for any given URL under any topics or a specified alias.
- **Analytics Tracking**: Tracks the number of clicks per link and the number of unique users.
- **Click Tracking by Date**: Stores click counts upto one week.
- **Unique user detection**: Accurate detection of unique user.
- **Google login**: Supports google login.

## Dependencies
- **Node.js** (>= 22.x.x)
- **Redis** 
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
      SQL_HOST=
      GOOGLE_CALLBACK_URL=
      GOOGLE_CLIENT_ID=
      GOOGLE_CLIENT_SECRET=
      JWT_SECRET=
      REDIS_USERNAME=
      REDIS_PASSWORD=
      REDIS_HOST=
      REDIS_PORT=
     ```

    - Get google variables from configuring google API.

## Running the Project
1. **Start the server**:
   ```sh
    nodemon
   ```
   For development mode, nodemon is already configured in nodemon.json, running ```nodemon``` starts and watches for changes in ./src, configure the SQL_HOST variable inside .env appropriately according to how you are running(if using docker, set it to 'db', else set it to 'localhost')
   The server should now be running at `http://localhost:3000` or at specified port.

## API Endpoints

### 1. login
**Endpoint:** `GET /auth/google/login`

### 1. Shorten a URL
**Endpoint:** `POST  /api/shorten`

**Request Body:**
```json
{
  "longUrl": "https://exampleLongURL.com",
  "topic": "topic",
  "customAlias": "alias"
}
```

**Response Body:**
```json
{
  "shortUrl": "http://url.ly/alias",
  "longUrl": "https://exampleLongURL.com"
}
```

### 2. Redirect to Long Url
**Endpoint:** `GET /api/shorten/:customAlias`

**Response:**
302 response, redirects to the long URL


### 3. Get analytics for specific URL
**Endpoint:** `GET /api/analytics/:alias`

**Response:**
```json
{
  "totalClicks": 0,
  "uniqueUsers": 0,
  "clicksByDate": [],
   "osType":[],
  "deviceType": []
}
```

### 4. Get analytics for URLs of same topic
**Endpoint:** `GET /api/analytics/topic/:topic`

**Response:**
```json
{
  "totalClicks": 0,
  "uniqueUsers": 0,
  "clicksByDate": [],
   "osType":[],
  "deviceType": []
}
```

### 5. Get analytics for all URLs
**Endpoint:** `GET /api/analytics/overall/url`

**Response:**
```json
{
  "totalUrls": 0,
  "totalClicks": 0,
  "uniqueUsers": 0,
 "clicksByDate": [],
  "osType":[],
  "deviceType": []
}
```

### 6. Get analytics for all URLs
**Endpoint:** `GET /api/docs`
**Response:**
endpoint for swagger documentaion


