"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFlightNumber = void 0;
const fligntNumberSet = new Set();
function generateFlightNumber() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    result += chars.charAt(Math.floor(Math.random() * chars.length)) + chars.charAt(Math.floor(Math.random() * chars.length));
    for (let i = 0; i < 4; i++) {
        result += Math.floor(Math.random() * 10);
    }
    if (fligntNumberSet.has(result)) {
        return generateFlightNumber();
    }
    else {
        fligntNumberSet.add(result);
        return result;
    }
}
exports.generateFlightNumber = generateFlightNumber;
