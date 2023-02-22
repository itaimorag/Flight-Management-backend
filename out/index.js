"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const utils_1 = require("./utils");
const airportList_1 = require("./airportList");
const moment_1 = __importDefault(require("moment"));
const path = require('path');
// const PORT = 3030;
const TIME_FORMAT = "DD/MM/yyyy - HH:mm";
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use(express_1.default.json());
if (process.env.NODE_ENV === 'production') {
    app.use(express_1.default.static(path.resolve(__dirname, 'public')));
}
else {
    const corsOptions = {
        origin: ['http://127.0.0.1:5173', 'http://localhost:5173', 'http://127.0.0.1:5174', 'http://localhost:5174'],
        credentials: true
    };
    app.use((0, cors_1.default)(corsOptions));
}
app.get('/**', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// app.use(
//   cors({
//     origin: "*",
//     credentials: true
//   })
// );
const io = new socket_io_1.Server(server, {
    cors: { origin: "*" },
});
const flights = [];
var intervalId;
io.on("connection", (socket) => {
    console.log("a user connected");
    intervalId = setInterval(() => {
        publishEntityUpdate(socket);
    }, 300);
    socket.on("disconnecting", (reason) => {
        console.log("a user disconnected");
        clearInterval(intervalId);
    });
});
app.get("/flights", (req, res) => {
    res.json({ flights });
});
app.get("/flights/:flightNum", (req, res) => {
    const flight = flights.find((p) => p.flightNumber === req.params.flightNum);
    res.json(flight);
});
const port = process.env.PORT || 3030;
server.listen(port, () => {
    console.log("server listening on port", port);
    for (let i = 0; i < 50; i++) {
        const randomAP1 = Math.floor(Math.random() * 50);
        const randomAP2 = Math.floor(Math.random() * 50);
        flights.push({
            flightNumber: (0, utils_1.generateFlightNumber)(),
            status: "hangar",
            takeoffTime: "01/02/2022 - 12:35",
            landingTime: "02/02/2022 - 14:30",
            takeoffAirport: airportList_1.airports[randomAP1],
            landingAirport: airportList_1.airports[randomAP2],
        });
    }
});
function publishEntityUpdate(socket) {
    const randomIndex = Math.floor(Math.random() * flights.length);
    const randomFlight = flights[randomIndex];
    const actionType = Math.floor(Math.random() * 3);
    switch (actionType) {
        case 0: // status update
            const chance = Math.random();
            switch (randomFlight.status) {
                case "hangar":
                    randomFlight.status = chance >= 0.9 ? "malfunction" : "airborne";
                    break;
                case "airborne":
                    randomFlight.status =
                        chance >= 0.9 ? "malfunction" : chance >= 0.7 ? "hangar" : "airborne";
                    break;
                case "malfunction":
                    randomFlight.status = chance >= 0.9 ? "hangar" : "malfunction";
                    break;
            }
            break;
        case 1: // time delay
            const delayByMin = Math.floor(Math.random() * 120);
            randomFlight.takeoffTime = (0, moment_1.default)(randomFlight.takeoffTime, TIME_FORMAT)
                .add(delayByMin, "minutes")
                .format(TIME_FORMAT);
            randomFlight.landingTime = (0, moment_1.default)(randomFlight.landingTime, TIME_FORMAT)
                .add(delayByMin, "minutes")
                .format(TIME_FORMAT);
            break;
        case 2: // destination update
            const newDestination = airportList_1.airports[Math.floor(Math.random() * 50)];
            randomFlight.landingAirport = newDestination;
            break;
    }
    socket.emit("flight-update", randomFlight);
}
