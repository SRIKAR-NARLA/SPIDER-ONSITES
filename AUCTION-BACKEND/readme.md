# Auction Platform

This is a full-featured backend auction platform built with Node.js, Express, and MongoDB. The platform allows users to create and manage auctions, place bids on auction items, and receive notifications about auction activities via email. The project also includes a feedback and rating system for transactions between users.

## Table of Contents

1. [Features](#features)
2. [Technologies](#technologies)
3. [Installation](#installation)
4. [Environment Variables](#environment-variables)
5. [API Endpoints](#api-endpoints)
6. [Real-time Bidding](#real-time-bidding)
7. [Notification System](#notification-system)
8. [Cron Jobs](#cron-jobs)
9. [Feedback and Rating System](#feedback-and-rating-system)
10. [Contributing](#contributing)
11. [License](#license)

## Features

- **Auction Management**: Create, manage, and close auctions.
- **Bidding System**: Place bids on auction items with real-time updates.
- **Notification System**: Email notifications for auction updates.
- **Feedback and Rating**: Users can leave feedback and ratings after transactions.

## Technologies

- Node.js
- Express.js
- MongoDB (Mongoose)
- Nodemailer (for email notifications)
- Cron (for scheduled tasks)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/auction-platform.git

2. Navigate into the project directory:
    ```bash
    cd auction-backend

3. Install dependencies
    ```bash
    npm install

4. Set up the env file

5. Start the server
    ```bash
    nodemon server.js