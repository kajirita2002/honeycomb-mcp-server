# Honeycomb MCP Server

<a href="https://glama.ai/mcp/servers/honeycomb-mcp-server">
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
   - Authenticates with the Honeycomb API and validates your API key
   - No input parameters required (uses environment variable)

### Dataset Management

1. `honeycomb_datasets_list`
   - Lists all available datasets in your Honeycomb environment
   - No input parameters required

2. `honeycomb_dataset_get`
   - Gets detailed information about a specific dataset
   - Input:
     - `datasetSlug` (string, required): Slug of the dataset to retrieve

### Column Management

1. `honeycomb_columns_list`
   - Lists all columns in a dataset with optional filtering
   - Input:
     - `datasetSlug` (string, required): Slug of the dataset
     - `key_name` (string, optional): Filter by a specific column key name

### Query Management

1. `honeycomb_query_create`
   - Creates a new query for a dataset
   - Input:
     - `datasetSlug` (string, required): Slug of the dataset
     - `query` (object, required): Query configuration object with calculation, time range, and filters

2. `honeycomb_query_get`
   - Gets information about a specific query
   - Input:
     - `datasetSlug` (string, required): Slug of the dataset
     - `queryId` (string, required): ID of the query to retrieve

3. `honeycomb_query_result_create`
   - Executes a query and returns the results (runs a query)
   - Input:
     - `datasetSlug` (string, required): Slug of the dataset
     - `queryId` (string, required): ID of the query to run
     - `disable_series` (boolean, optional): Whether to disable series data
     - `disable_total_by_aggregate` (boolean, optional): Whether to disable total aggregates
     - `disable_other_by_aggregate` (boolean, optional): Whether to disable other aggregates
     - `limit` (integer, optional): Limit on the number of results

4. `honeycomb_query_result_get`
   - Gets the results of a previously executed query
   - Input:
     - `datasetSlug` (string, required): Slug of the dataset
     - `queryResultId` (string, required): ID of the query result to retrieve

### Dataset Definitions

1. `honeycomb_dataset_definitions_list`
   - Lists dataset definitions with pagination support
   - Input:
     - `page` (number, optional): Page number (starting from 1)
     - `limit` (number, optional): Number of results per page (default: 100, max: 1000)
     - `sort_by` (string, optional): Field to sort by (e.g. 'name', 'description')
     - `sort_order` (string, optional): Sort order ('asc' or 'desc')

### Board Management

1. `honeycomb_boards_list`
   - Lists all available boards
   - No input parameters required

2. `honeycomb_board_get`
   - Gets detailed information about a specific board
   - Input:
     - `boardId` (string, required): ID of the board to retrieve


## Example Usage

Here's an example of Claude using this MCP server to list datasets and run a query:

```
[Claude] Can you show me the available datasets in our Honeycomb environment?

[User] Sure, I'd like to see what datasets we have in Honeycomb.

[Claude] I'll list all the available datasets in your Honeycomb environment.

I'll use the honeycomb_datasets_list tool...

Here are your available datasets:
- production-metrics (slug: prod-metrics)
- staging-services (slug: staging-svc)
- application-logs (slug: app-logs)

Which dataset would you like to explore further?

[User] Let's look at the production-metrics dataset.

[Claude] I'll get details about the production-metrics dataset using honeycomb_dataset_get with the slug "prod-metrics"...

Now I'll create and run a query to show the average response time over the last 24 hours.

I'll use honeycomb_query_create and then honeycomb_query_result_create...

Here are the results showing the average response time trend:
[Query results visualization description]

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
