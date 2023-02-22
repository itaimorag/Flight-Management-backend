# Flight Management Server

This is the back-end for the Kubiya interview exam.
The app has been written in a minimalistic fashion and by no means does it represent real data or any best practice for writing a back-end server app.

## Dependencies:

- [Node.js](https://nodejs.org/en/)

## How to run:

1. `npm install`
2. `npm start`

## Specifications:

This back-end Node app offers two interfaces running on port `4963`:

1. Socket.io interface for data update streams on flights (`EVENT: flight-update`).
2. HTTP RESTful interface for getting a list of flights (`GET: /flights`) or a specific flight (`GET: /flights/:flightNumber`).

## Important notes:

- The time is stored as string in the format `dd/MM/yyyy - HH:mm` for the sake of simplicity.
- Take a look at `types.ts` for the data schema.
