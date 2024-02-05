import test from "ava";
import request from "supertest";
import { MockAgent, setGlobalDispatcher } from "undici";
import { StatusCodes } from "http-status-codes";
import { clearDatabase, startApp, stopApp } from "./test-helper";
import AirQuality from "../src/models/db-schemas/AirQuality";
import { PARIS_LAT, PARIS_LON } from "../src/common/constants";

let server;
const mockAgent = new MockAgent();

test.before(async () => {
    server = await startApp();
});

test.afterEach.always(async () => {
    await clearDatabase();
});

test("getAirQuality - should return pollution data", async (t) => {
    const mockLatitude = "48.856613";
    const mockLongitude = "2.352222";
    const mockResponse = {
        status: "success",
        data: {
            current: {
                pollution: {
                    ts: "2024-02-05T20:00:00.000Z",
                    aqius: 1,
                    mainus: "p2",
                    aqicn: 1,
                    maincn: "p2",
                },
            },
        },
    };

    const client = mockAgent.get("https://api.airvisual.com");
    client
        .intercept({
            path: `/v2/nearest_city?lat=${mockLatitude}&lon=${mockLongitude}&key=${process.env.IQAIR_API_KEY}`,
            method: "GET",
        })
        .reply(200, mockResponse);
    setGlobalDispatcher(mockAgent);

    const response = await request(server)
        .get(`/air-quality?lat=${mockLatitude}&lon=${mockLongitude}`)
        .send()
        .expect(StatusCodes.OK);

    t.deepEqual(response.body, mockResponse.data.current.pollution);
});

test("getAirQuality - should fail if no lat", async (t) => {
    const response = await request(server).get(`/air-quality?lon=2.352222`).send().expect(StatusCodes.BAD_REQUEST);
    t.deepEqual(response.body, {
        message: "Invalid queries, check 'errors' property for more info.",
        errors: [
            {
                property: "lat",
                constraints: {
                    isLatitude: "lat must be a latitude string or number",
                    isNumber: "lat must be a number conforming to the specified constraints",
                    isNotEmpty: "lat should not be empty",
                },
            },
        ],
    });
});

test("getAirQuality - should fail if no lon", async (t) => {
    const response = await request(server).get(`/air-quality?lat=48.856613`).send().expect(StatusCodes.BAD_REQUEST);
    t.deepEqual(response.body, {
        message: "Invalid queries, check 'errors' property for more info.",
        errors: [
            {
                property: "lon",
                constraints: {
                    isLongitude: "lon must be a longitude string or number",
                    isNumber: "lon must be a number conforming to the specified constraints",
                    isNotEmpty: "lon should not be empty",
                },
            },
        ],
    });
});

test("getParisWorstAirQuality - should fail if no records on database", async (t) => {
    const response = await request(server).get(`/air-quality/paris-worst`).send().expect(StatusCodes.NOT_FOUND);
    t.deepEqual(response.body, { message: "No air quality records found." });
});

test("getParisWorstAirQuality - should return when paris was most polluted", async (t) => {
    AirQuality.insertMany([
        { lon: PARIS_LON, lat: PARIS_LAT, aqius: 60 },
        { lon: PARIS_LON, lat: PARIS_LAT, aqius: 70 },
    ]);
    const response = await request(server).get(`/air-quality/paris-worst`).send().expect(StatusCodes.OK);
    t.is(response.body.aqius, 70);
    t.truthy(response.body.timestamp);
});

test.after.always("cleanup", async () => {
    await stopApp();
});
