# Honeycomb MCP Server

<a href="https://glama.ai/mcp/servers/@kajirita2002/honeycomb-mcp-server">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@kajirita2002/honeycomb-mcp-server/badge" alt="Honeycomb MCP server" />
</a>

*Read this in [Japanese](README.ja.md)*

## Overview

This server is an interface that uses the [Model Context Protocol (MCP)](https://github.com/anthropics/anthropic-cookbook/tree/main/model_context_protocol) to enable Claude AI to interact with the [Honeycomb API](https://docs.honeycomb.io/api//).

With this MCP server, Claude AI can perform operations such as retrieving, creating, and updating Honeycomb datasets, queries, events, boards, markers, SLOs, and triggers.

## About the Repository

This repository provides a standalone implementation of the Honeycomb MCP server. It integrates Claude AI with Honeycomb to streamline observability and monitoring workflows.

## Setup

### Prerequisites

- Node.js 18 or higher
- Honeycomb API key

### Installation

```bash
# Install globally
npm install -g @kajirita2002/honeycomb-mcp-server

# Or use directly with npx
npx @kajirita2002/honeycomb-mcp-server
```

### Setting Environment Variables

```bash
# Set environment variables
export HONEYCOMB_API_KEY="your_honeycomb_api_key"
```

### MCP Configuration Example

If you're using this MCP server, add the following configuration to your `mcp_config.json` file:

```json
"honeycomb": {
  "command": "npx",
  "args": ["-y", "@kajirita2002/honeycomb-mcp-server"],
  "env": {
    "HONEYCOMB_API_KEY": "your_honeycomb_api_key"
  }
}
```

### Starting the Server

```bash
# Start the server
npm start
```

## Available Tools

This MCP server provides the following tools:

### Authentication

1. `honeycomb_auth`
   - Authenticates with the Honeycomb API
   - Input:
     - `apiKey` (string, optional): Honeycomb API key (if not provided, uses environment variable)

#### Dataset Management

1. `honeycomb_datasets_list`
   - Lists all available datasets
   - No input parameters required

2. `honeycomb_dataset_get`
   - Gets information about a specific dataset
   - Input:
     - `datasetSlug` (string, required): Slug of the dataset

3. `honeycomb_datasets_create`
   - Creates a new dataset
   - Input:
     - `name` (string, required): Name of the dataset
     - `description` (string, optional): Description of the dataset

4. `honeycomb_datasets_update`
   - Updates an existing dataset
   - Input:
     - `datasetSlug` (string, required): Slug of the dataset to update
     - `name` (string, optional): New name for the dataset
     - `description` (string, optional): New description for the dataset

#### Column Management

1. `honeycomb_columns_list`
   - Lists all columns in a dataset
   - Input:
     - `datasetSlug` (string, required): Slug of the dataset

#### Query Management

1. `honeycomb_query_create`
   - Creates a new query for a dataset
   - Input:
     - `datasetSlug` (string, required): Slug of the dataset
     - `query` (object, required): Query configuration

2. `honeycomb_query_result_create`
   - Executes a query and returns the results
   - Input:
     - `datasetSlug` (string, required): Slug of the dataset
     - `query` (object, required): Query configuration

#### Event Management

1. `honeycomb_event_create`
   - Creates a new event in a dataset
   - Input:
     - `datasetSlug` (string, required): Slug of the dataset
     - `data` (object, required): Event data

2. `honeycomb_batch_event_create`
   - Creates multiple events in a dataset
   - Input:
     - `datasetSlug` (string, required): Slug of the dataset
     - `events` (array of objects, required): Array of event data


#### Board Management

1. `honeycomb_boards_list`
   - Lists all boards
   - No input parameters required

2. `honeycomb_board_get`
   - Gets information about a specific board
   - Input:
     - `boardId` (string, required): ID of the board

3. `honeycomb_board_create`
   - Creates a new board
   - Input:
     - `name` (string, required): Name of the board
     - `description` (string, optional): Description of the board
     - `query_ids` (array of strings, optional): Query IDs to include in the board

4. `honeycomb_board_update`
   - Updates an existing board
   - Input:
     - `boardId` (string, required): ID of the board to update
     - `name` (string, optional): New name for the board
     - `description` (string, optional): New description for the board
     - `query_ids` (array of strings, optional): New query IDs to include in the board

5. `honeycomb_board_delete`
   - Deletes a board
   - Input:
     - `boardId` (string, required): ID of the board to delete

#### Marker Management

1. `honeycomb_markers_list`
   - Lists all markers for a dataset
   - Input:
     - `datasetSlug` (string, required): Slug of the dataset

2. `honeycomb_marker_get`
   - Gets information about a specific marker
   - Input:
     - `datasetSlug` (string, required): Slug of the dataset
     - `markerId` (string, required): ID of the marker

3. `honeycomb_marker_create`
   - Creates a new marker
   - Input:
     - `datasetSlug` (string, required): Slug of the dataset
     - `message` (string, required): Message for the marker
     - `type` (string, required): Type of the marker
     - `start_time` (string, required): Start time for the marker
     - `end_time` (string, optional): End time for the marker
     - `url` (string, optional): URL associated with the marker

4. `honeycomb_marker_update`
   - Updates an existing marker
   - Input:
     - `datasetSlug` (string, required): Slug of the dataset
     - `markerId` (string, required): ID of the marker to update
     - `message` (string, optional): New message for the marker
     - `type` (string, optional): New type for the marker
     - `start_time` (string, optional): New start time for the marker
     - `end_time` (string, optional): New end time for the marker
     - `url` (string, optional): New URL associated with the marker

5. `honeycomb_marker_delete`
   - Deletes a marker
   - Input:
     - `datasetSlug` (string, required): Slug of the dataset
     - `markerId` (string, required): ID of the marker to delete

#### SLO Management

1. `honeycomb_slos_list`
   - Lists all SLOs for a dataset
   - Input:
     - `datasetSlug` (string, required): Slug of the dataset

2. `honeycomb_slo_get`
   - Gets information about a specific SLO
   - Input:
     - `datasetSlug` (string, required): Slug of the dataset
     - `sloId` (string, required): ID of the SLO

3. `honeycomb_slo_create`
   - Creates a new SLO
   - Input:
     - `datasetSlug` (string, required): Slug of the dataset
     - `name` (string, required): Name of the SLO
     - `description` (string, optional): Description of the SLO
     - `sli` (object, required): Service Level Indicator configuration with alias property
     - `time_period_days` (integer, required): The time period in days over which the SLO will be evaluated
     - `target_per_million` (integer, required): The number of events out of one million that you expect qualified events to succeed

4. `honeycomb_slo_update`
   - Updates an existing SLO
   - Input:
     - `datasetSlug` (string, required): Slug of the dataset
     - `sloId` (string, required): ID of the SLO to update
     - `name` (string, optional): New name for the SLO
     - `description` (string, optional): New description for the SLO
     - `sli` (object, optional): New Service Level Indicator configuration with alias property
     - `time_period_days` (integer, optional): New time period in days
     - `target_per_million` (integer, optional): New target per million events

#### Trigger Management

1. `honeycomb_triggers_list`
   - Lists all triggers for a dataset
   - Input:
     - `datasetSlug` (string, required): Slug of the dataset

2. `honeycomb_trigger_create`
   - Creates a new trigger
   - Input:
     - `datasetSlug` (string, required): Slug of the dataset
     - `name` (string, required): Name of the trigger (max 120 chars)
     - `description` (string, optional): Description of the trigger (max 1023 chars)
     - `query_id` (string, required if query not provided): Query ID for the trigger
     - `query` (object, required if query_id not provided): Inline query specification
     - `threshold` (object, required): Threshold configuration
       - `op` (string, required): Operator for comparison (`>`, `>=`, `<`, `<=`)
       - `value` (number, required): Threshold value to compare against
       - `exceeded_limit` (integer, optional): Number of times threshold must be met before alerting (1-5, default: 1)
     - `frequency` (integer, optional): Interval in seconds to check results (60-86400, must be multiple of 60, default: 900)
     - `alert_type` (string, optional): Alert behavior (`on_change`: only when crossing threshold, `on_true`: every check while threshold is met, default: `on_change`)
     - `recipient_ids` (array of strings, optional): IDs of recipients for trigger notifications
     - `disabled` (boolean, optional): If true, the trigger will not be evaluated (default: false)
     - `evaluation_schedule_type` (string, optional): Schedule type (`frequency` or `window`)
     - `evaluation_schedule` (object, optional): Schedule configuration when type is `window`

3. `honeycomb_trigger_update`
   - Updates an existing trigger
   - Input:
     - `datasetSlug` (string, required): Slug of the dataset
     - `triggerId` (string, required): ID of the trigger to update
     - `name` (string, optional): New name for the trigger (max 120 chars)
     - `description` (string, optional): New description for the trigger (max 1023 chars)
     - `query_id` (string, optional): New query ID for the trigger (use either query_id or query)
     - `query` (object, optional): New inline query specification (use either query or query_id)
     - `threshold` (object, optional): New threshold configuration
       - `op` (string, optional): Operator for comparison (`>`, `>=`, `<`, `<=`)
       - `value` (number, optional): Threshold value to compare against
       - `exceeded_limit` (integer, optional): Number of times threshold must be met before alerting (1-5)
     - `frequency` (integer, optional): New interval in seconds to check results (60-86400, must be multiple of 60)
     - `alert_type` (string, optional): New alert behavior (`on_change` or `on_true`)
     - `recipient_ids` (array of strings, optional): New IDs of recipients for trigger notifications
     - `disabled` (boolean, optional): If true, the trigger will not be evaluated
     - `evaluation_schedule_type` (string, optional): Schedule type (`frequency` or `window`)
     - `evaluation_schedule` (object, optional): Schedule configuration when type is `window`

4. `honeycomb_trigger_delete`
   - Deletes a trigger
   - Input:
     - `datasetSlug` (string, required): Slug of the dataset
     - `triggerId` (string, required): ID of the trigger to delete

## Example Usage

Here's an example of Claude using this MCP server to create a new Honeycomb dataset and add an event:

```
[Claude] Please create a new dataset in Honeycomb called "Application Monitoring" with a description "Monitoring for our production application".

[User] I'll help you create a new dataset in Honeycomb.

[Claude] I'll create a new dataset for you in Honeycomb. 

I'll use the honeycomb_datasets_create tool:

Input:
{
  "name": "Application Monitoring",
  "description": "Monitoring for our production application"
}

The dataset has been created successfully!

[Claude] Now, let me add an event to this dataset. I'll create an event with some sample metrics.

I'll use the honeycomb_event_create tool:

Input:
{
  "datasetSlug": "application-monitoring",
  "data": {
    "service": "api-gateway",
    "duration_ms": 45.2,
    "status_code": 200,
    "endpoint": "/users",
    "method": "GET"
  }
}

Event created successfully! You can now see this event in the Honeycomb UI under the Application Monitoring dataset.

[Claude] I can also create a query to analyze this data. Let me create a query that shows the average duration by endpoint.

I'll use the honeycomb_query_create tool:

Input:
{
  "datasetSlug": "application-monitoring",
  "query": {
    "calculations": [
      {
        "op": "AVG",
        "column": "duration_ms"
      }
    ],
    "breakdowns": ["endpoint"],
    "time_range": 3600
  }
}
```

### Common Integration Patterns

1. **Observability Automation**
   ```
   [User] Claude, please help me set up a new SLO for API response times.
   
   [Claude] I can help with that. Let me create an SLO to track API response times.
   
   I'll use honeycomb_slo_create with these parameters:
   {
     "datasetSlug": "production-api",
     "name": "API Response Time SLO",
     "description": "Tracks response time for critical API endpoints",
     "sli": {
       "alias": "Response Time < 300ms",
       "conditions": {
         "column": "duration_ms",
         "operator": "<",
         "value": 300
       }
     },
     "time_period_days": 30,
     "target_per_million": 995000
   }
   ```

2. **Incident Investigation**
   ```
   [User] We're seeing elevated error rates in production. Can you help investigate?
   
   [Claude] I'll help investigate the elevated error rates. Let me query the recent error data.
   
   First, I'll use honeycomb_query_result_create:
   {
     "datasetSlug": "production",
     "query": {
       "calculations": [
         {
           "op": "COUNT"
         }
       ],
       "filters": [
         {
           "column": "status_code",
           "operator": ">=",
           "value": 500
         }
       ],
       "breakdowns": ["service", "endpoint"],
       "time_range": 3600,
       "granularity": 60
     }
   }
   ```

Creating dataset "Application Monitoring" with the description "Monitoring for our production application"...

[Claude uses honeycomb_datasets_create]

The dataset has been successfully created! Now we can add events to it.

Would you like me to create a sample event in the dataset to test it?

[User] Yes, please add a sample event.

[Claude] I'll add a sample event to the "Application Monitoring" dataset.

[Claude uses honeycomb_event_create]

Success! I've added a sample event to your "Application Monitoring" dataset with the following data:
{
  "service": "api-server",
  "message": "User login successful",
  "duration_ms": 45,
  "status_code": 200,
  "endpoint": "/api/login",
  "timestamp": "2025-03-25T14:30:00Z"
}

This event represents a successful user login operation that took 45ms to complete.

You can now view this event in your Honeycomb dashboard and start building queries to analyze your data.
```

## Error Handling

This MCP server returns error information in a consistent format. When an error occurs, the following structure is returned:

```json
{
  "error": {
    "message": "Detailed error description",
    "code": "ERROR_CODE"
  }
}
```

### Common Error Codes

- `AUTH_ERROR`: Authentication failed. Check your API key.
- `NOT_FOUND`: The requested resource was not found.
- `INVALID_PARAMETER`: One or more parameters are invalid.
- `RATE_LIMIT`: Honeycomb API rate limit has been reached.
- `SERVER_ERROR`: Internal server error occurred.

### Troubleshooting Tips

1. **Authentication Issues**
   - Ensure your `HONEYCOMB_API_KEY` is set correctly
   - Verify the API key has appropriate permissions

2. **Dataset Not Found**
   - Confirm that the dataset slug is correct (check for typos)
   - Make sure the dataset exists in your Honeycomb account

3. **Query Execution Issues**
   - Validate that query parameters are formatted correctly
   - Check column names in queries match those in your dataset

## Contributing

Contributions to the Honeycomb MCP server are welcome! Here's how you can contribute:

### Development Setup

1. Fork the repository
2. Clone your fork
   ```bash
   git clone https://github.com/your-username/honeycomb-mcp-server.git
   ```
3. Install dependencies
   ```bash
   npm install
   ```
4. Make your changes
5. Run the build
   ```bash
   npm run build
   ```
6. Test your changes locally

### Pull Request Process

1. Create a feature branch
   ```bash
   git checkout -b feat-your-feature-name
   ```
2. Commit your changes following [Conventional Commits](https://www.conventionalcommits.org/) format
   ```bash
   git commit -m "feat: add new feature"
   ```
3. Push to your fork
   ```bash
   git push origin feat-your-feature-name
   ```
4. Open a Pull Request

### Coding Standards

- Use TypeScript for all new code
- Follow the existing code style
- Add comments for public APIs
- Write tests for new functionality

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
