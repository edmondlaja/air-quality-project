export type PollutionData = {
    ts: string;
    aqius: number;
    mainus: string;
    aqicn: number;
    maincn: string;
};

type IQAirApiResponseSuccess = {
    status: "success";
    data: {
        current: {
            pollution: PollutionData;
        };
    };
};

type IQAirApiResponseError = {
    status: "fail" | "error";
    data: {
        message: string;
    };
};

export type IQAirApiResponse = IQAirApiResponseSuccess | IQAirApiResponseError;
