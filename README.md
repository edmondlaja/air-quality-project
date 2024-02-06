# Yassir Backend Challenge

This project provides a set of RESTful APIs to interact with air quality data. Below are the details of how to get started and the available endpoints.

## Getting Started

### Setting Up the Environment

1.  **Database Initialization**:
    To get started, we need to set up the databases. This project uses Docker Compose to manage database containers. You can initialize the databases by running:

    ```bash
    npm run start:db
    ```

    This command builds and starts the necessary database containers.

2.  **Environment Variables**:
    Next, set up the environment variables, there is an .env.example file. If the default port settings are unchanged, your environment variables for mongodb should look like this:

    ```env
    MONGO_CONNECTION_STRING="mongodb://localhost:27017/air-quality"
    TEST_MONGO_CONNECTION_STRING="mongodb://localhost:27018/test-air-quality"
    ```

### Running the Project

-   **Testing**:
    Execute all test suites with:

    ```bash
    npm test
    ```

    Ensure that the test database is active for the tests to run successfully.

-   **Development Server**:
    To start the project in a local development environment, use:

    ```bash
    npm run start:dev
    ```

## API Documentation

### Air Quality APIs

1.  **Get Air Quality**:
    Retrieves the current air quality data based on the specified longitude and latitude.

    -   **Endpoint**: `GET /air-quality`
    -   **Query Parameters**:
        -   **lon**: Longitude of the location
        -   **lat**: Latitude of the location
    -   **Success Response**: Returns the current air quality data including pollutants levels.
    -   **Error Response**: Returns an error message in case of failure (e.g., invalid parameters, issues with external service).

2.  **Get Paris Worst Air Quality time**:
    Fetches the worst air quality record for Paris, populated by a scheduled cron job.

    -   **Endpoint**: `GET /air-quality/paris-worst`
    -   **Success Response**: Returns the worst air quality record for Paris.
    -   **Error Response**: Returns a 404 error if no air quality records are found, or an error message for other failures.
