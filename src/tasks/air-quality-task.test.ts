import test from "ava";
import { MockAgent, setGlobalDispatcher } from "undici";
import { StatusCodes } from "http-status-codes";
import { clearDatabase, startApp, stopApp } from "../utils/test-helper";
import { PARIS_LAT, PARIS_LON } from "../common/constants";
import { parisAirQualityCheck } from "./air-quality.task";
import { AirQualityRepository } from "../repositories/air-quality.repository";

let server;
const mockAgent = new MockAgent();
const airQualityRepository = new AirQualityRepository();

test.before(async () => {
    server = await startApp();
});

test.afterEach.always(async () => {
    await clearDatabase();
});

test("parisAirQualityCheck - should save on database", async (t) => {
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
        .reply(StatusCodes.OK, mockResponse);
    setGlobalDispatcher(mockAgent);

    await parisAirQualityCheck();
    const worstRecord = await airQualityRepository.getWorstAirQuality(PARIS_LON, PARIS_LAT);

    t.deepEqual(worstRecord.aqius, mockResponse.data.current.pollution.aqius);
});

test.after.always("cleanup", async () => {
    await stopApp();
});
