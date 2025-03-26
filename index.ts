#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequest,
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";

// Honeycomb APIのインターフェース定義
interface AuthArgs {}

interface DatasetListArgs {}

interface DatasetGetArgs {
  datasetSlug: string;
}

interface ColumnListArgs {
  datasetSlug: string;
}

interface QueryCreateArgs {
  datasetSlug: string;
  query: any;
}

interface QueryGetArgs {
  datasetSlug: string;
  queryId: string;
}

interface QueryResultCreateArgs {
  datasetSlug: string;
  queryId: string;
}

interface QueryResultGetArgs {
  datasetSlug: string;
  queryResultId: string;
}

interface EventCreateArgs {
  datasetSlug: string;
  event: any;
}



// P2のエンドポイント用インターフェース
interface BoardListArgs {}

interface BoardCreateArgs {
  name: string;
  description?: string;
  query_ids?: string[];
}

interface BoardGetArgs {
  boardId: string;
}

interface BoardUpdateArgs {
  boardId: string;
  name?: string;
  description?: string;
  query_ids?: string[];
}



interface MarkerListArgs {
  datasetSlug: string;
}

interface MarkerCreateArgs {
  datasetSlug: string;
  message: string;
  type: string;
  start_time: string;
  end_time?: string;
  url?: string;
}



























// P1のツール定義
const authTool: Tool = {
  name: "honeycomb_auth",
  description: "Get authentication information and validate API key",
  inputSchema: {
    type: "object",
    properties: {},
  },
};

const datasetsListTool: Tool = {
  name: "honeycomb_datasets_list",
  description: "List all datasets in the environment",
  inputSchema: {
    type: "object",
    properties: {},
  },
};

const datasetGetTool: Tool = {
  name: "honeycomb_dataset_get",
  description: "Get information about a specific dataset",
  inputSchema: {
    type: "object",
    properties: {
      datasetSlug: {
        type: "string",
        description: "Dataset slug to retrieve",
      },
    },
    required: ["datasetSlug"],
  },
};

const columnsListTool: Tool = {
  name: "honeycomb_columns_list",
  description: "List all columns in a dataset",
  inputSchema: {
    type: "object",
    properties: {
      datasetSlug: {
        type: "string",
        description: "Dataset slug to list columns for",
      },
    },
    required: ["datasetSlug"],
  },
};

const queryCreateTool: Tool = {
  name: "honeycomb_query_create",
  description: "Create a new query for a dataset",
  inputSchema: {
    type: "object",
    properties: {
      datasetSlug: {
        type: "string",
        description: "Dataset slug to create query for",
      },
      query: {
        type: "object",
        description: "Query object with calculation, time range, and filters",
      },
    },
    required: ["datasetSlug", "query"],
  },
};

const queryGetTool: Tool = {
  name: "honeycomb_query_get",
  description: "Get information about a specific query",
  inputSchema: {
    type: "object",
    properties: {
      datasetSlug: {
        type: "string",
        description: "Dataset slug the query belongs to",
      },
      queryId: {
        type: "string",
        description: "Query ID to retrieve",
      },
    },
    required: ["datasetSlug", "queryId"],
  },
};

const queryResultCreateTool: Tool = {
  name: "honeycomb_query_result_create",
  description: "Create a new query result (run a query)",
  inputSchema: {
    type: "object",
    properties: {
      datasetSlug: {
        type: "string",
        description: "Dataset slug to create query result for",
      },
      queryId: {
        type: "string",
        description: "Query ID to run",
      },
    },
    required: ["datasetSlug", "queryId"],
  },
};

const queryResultGetTool: Tool = {
  name: "honeycomb_query_result_get",
  description: "Get results of a specific query execution",
  inputSchema: {
    type: "object",
    properties: {
      datasetSlug: {
        type: "string",
        description: "Dataset slug the query result belongs to",
      },
      queryResultId: {
        type: "string",
        description: "Query result ID to retrieve",
      },
    },
    required: ["datasetSlug", "queryResultId"],
  },
};

const eventCreateTool: Tool = {
  name: "honeycomb_event_create",
  description: "Create a new event in a dataset",
  inputSchema: {
    type: "object",
    properties: {
      datasetSlug: {
        type: "string",
        description: "Dataset slug to create event in",
      },
      event: {
        type: "object",
        description: "Event data to send",
      },
    },
    required: ["datasetSlug", "event"],
  },
};



// P2のツール定義
const boardsListTool: Tool = {
  name: "honeycomb_boards_list",
  description: "List all boards",
  inputSchema: {
    type: "object",
    properties: {},
  },
};

const boardCreateTool: Tool = {
  name: "honeycomb_board_create",
  description: "Create a new board",
  inputSchema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Name of the board",
      },
      description: {
        type: "string",
        description: "Description of the board",
      },
      query_ids: {
        type: "array",
        items: {
          type: "string",
        },
        description: "Query IDs to include in the board",
      },
    },
    required: ["name"],
  },
};

const boardGetTool: Tool = {
  name: "honeycomb_board_get",
  description: "Get information about a specific board",
  inputSchema: {
    type: "object",
    properties: {
      boardId: {
        type: "string",
        description: "Board ID to retrieve",
      },
    },
    required: ["boardId"],
  },
};

const boardUpdateTool: Tool = {
  name: "honeycomb_board_update",
  description: "Update an existing board",
  inputSchema: {
    type: "object",
    properties: {
      boardId: {
        type: "string",
        description: "Board ID to update",
      },
      name: {
        type: "string",
        description: "New name for the board",
      },
      description: {
        type: "string",
        description: "New description for the board",
      },
      query_ids: {
        type: "array",
        items: {
          type: "string",
        },
        description: "New query IDs to include in the board",
      },
    },
    required: ["boardId"],
  },
};



const markersListTool: Tool = {
  name: "honeycomb_markers_list",
  description: "List all markers for a dataset",
  inputSchema: {
    type: "object",
    properties: {
      datasetSlug: {
        type: "string",
        description: "Dataset slug to list markers for, or 'all' for all datasets",
      },
    },
    required: ["datasetSlug"],
  },
};

const markerCreateTool: Tool = {
  name: "honeycomb_marker_create",
  description: "Create a new marker for a dataset",
  inputSchema: {
    type: "object",
    properties: {
      datasetSlug: {
        type: "string",
        description: "Dataset slug to create marker for, or 'all' for all datasets",
      },
      message: {
        type: "string",
        description: "Message for the marker",
      },
      type: {
        type: "string",
        description: "Type of marker",
      },
      start_time: {
        type: "string",
        description: "Start time for the marker (ISO format)",
      },
      end_time: {
        type: "string",
        description: "End time for the marker (ISO format), optional for point-in-time markers",
      },
      url: {
        type: "string",
        description: "URL associated with the marker",
      },
    },
    required: ["datasetSlug", "message", "type", "start_time"],
  },
};











// P2機能用のツールの追加定義
const datasetsCreateTool: Tool = {
  name: "honeycomb_datasets_create",
  description: "Create a new dataset",
  inputSchema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Name of the dataset",
      },
      description: {
        type: "string",
        description: "Description of the dataset",
      },
    },
    required: ["name"],
  },
};



class HoneycombClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(apiKey: string) {
    this.baseUrl = "https://api.honeycomb.io/v1";
    this.headers = {
      "X-Honeycomb-Team": apiKey,
      "Content-Type": "application/json",
    };
  }

  // Dataset operations
  async listDatasets(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/datasets`, {
      method: "GET",
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to list datasets: ${response.statusText}`);
    }

    return await response.json();
  }

  async getDataset(slug: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/datasets/${slug}`, {
      method: "GET",
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to get dataset: ${response.statusText}`);
    }

    return await response.json();
  }

  async createDataset(name: string, description?: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/datasets`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        name,
        description,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create dataset: ${response.statusText}`);
    }

    return await response.json();
  }

  async updateDataset(slug: string, name?: string, description?: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/datasets/${slug}`, {
      method: "PUT",
      headers: this.headers,
      body: JSON.stringify({
        name,
        description,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update dataset: ${response.statusText}`);
    }

    return await response.json();
  }

  // Column operations
  async listColumns(datasetSlug: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/datasets/${datasetSlug}/columns`, {
      method: "GET",
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to list columns: ${response.statusText}`);
    }

    return await response.json();
  }

  // Query operations
  async createQuerySpec(datasetSlug: string, querySpec: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/datasets/${datasetSlug}/queries`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(querySpec),
    });

    if (!response.ok) {
      throw new Error(`Failed to create query spec: ${response.statusText}`);
    }

    return await response.json();
  }

  async getQueryResult(datasetSlug: string, queryId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/datasets/${datasetSlug}/queries/${queryId}/results`, {
      method: "GET",
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to get query results: ${response.statusText}`);
    }

    return await response.json();
  }

  // Board operations
  async listBoards(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/boards`, {
      method: "GET",
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to list boards: ${response.statusText}`);
    }

    return await response.json();
  }

  async getBoard(boardId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/boards/${boardId}`, {
      method: "GET",
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to get board: ${response.statusText}`);
    }

    return await response.json();
  }

  async createBoard(name: string, description?: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/boards`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        name,
        description,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create board: ${response.statusText}`);
    }

    return await response.json();
  }

  async updateBoard(boardId: string, name?: string, description?: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/boards/${boardId}`, {
      method: "PUT",
      headers: this.headers,
      body: JSON.stringify({
        name,
        description,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update board: ${response.statusText}`);
    }

    return await response.json();
  }

  async deleteBoard(boardId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/boards/${boardId}`, {
      method: "DELETE",
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to delete board: ${response.statusText}`);
    }
  }

  // SLO operations
  async listSLOs(datasetSlug: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/slos?dataset=${datasetSlug}`, {
      method: "GET",
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to list SLOs: ${response.statusText}`);
    }

    return await response.json();
  }

  async getSLO(sloId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/slos/${sloId}`, {
      method: "GET",
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to get SLO: ${response.statusText}`);
    }

    return await response.json();
  }

  async createSLO(datasetSlug: string, sloData: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/slos`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        ...sloData,
        dataset: datasetSlug,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create SLO: ${response.statusText}`);
    }

    return await response.json();
  }

  async updateSLO(sloId: string, sloData: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/slos/${sloId}`, {
      method: "PUT",
      headers: this.headers,
      body: JSON.stringify(sloData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update SLO: ${response.statusText}`);
    }

    return await response.json();
  }

  // Trigger operations
  async listTriggers(datasetSlug: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/triggers?dataset=${datasetSlug}`, {
      method: "GET",
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to list triggers: ${response.statusText}`);
    }

    return await response.json();
  }

  async getTrigger(datasetSlug: string, triggerId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/triggers/${triggerId}?dataset=${datasetSlug}`, {
      method: "GET",
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to get trigger: ${response.statusText}`);
    }

    return await response.json();
  }

  async createTrigger(datasetSlug: string, triggerData: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/triggers`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        ...triggerData,
        dataset: datasetSlug,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create trigger: ${response.statusText}`);
    }

    return await response.json();
  }

  async updateTrigger(datasetSlug: string, triggerId: string, triggerData: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/triggers/${triggerId}`, {
      method: "PUT",
      headers: this.headers,
      body: JSON.stringify({
        ...triggerData,
        dataset: datasetSlug,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update trigger: ${response.statusText}`);
    }

    return await response.json();
  }

  async deleteTrigger(datasetSlug: string, triggerId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/triggers/${triggerId}?dataset=${datasetSlug}`, {
      method: "DELETE",
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to delete trigger: ${response.statusText}`);
    }
  }

  // Marker operations
  async listMarkers(datasetSlug: string): Promise<any> {
    const endpoint = datasetSlug === 'all' 
      ? `${this.baseUrl}/markers` 
      : `${this.baseUrl}/markers?dataset=${datasetSlug}`;
      
    const response = await fetch(endpoint, {
      method: "GET",
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to list markers: ${response.statusText}`);
    }

    return await response.json();
  }

  async getMarker(datasetSlug: string, markerId: string): Promise<any> {
    const endpoint = datasetSlug === 'all' 
      ? `${this.baseUrl}/markers/${markerId}` 
      : `${this.baseUrl}/markers/${markerId}?dataset=${datasetSlug}`;
      
    const response = await fetch(endpoint, {
      method: "GET",
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to get marker: ${response.statusText}`);
    }

    return await response.json();
  }

  async createMarker(markerData: MarkerCreateArgs): Promise<any> {
    const endpoint = markerData.datasetSlug === 'all' 
      ? `${this.baseUrl}/markers` 
      : `${this.baseUrl}/markers?dataset=${markerData.datasetSlug}`;
      
    const response = await fetch(endpoint, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        message: markerData.message,
        type: markerData.type,
        start_time: markerData.start_time,
        end_time: markerData.end_time,
        url: markerData.url
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create marker: ${response.statusText}`);
    }

    return await response.json();
  }

  async updateMarker(datasetSlug: string, markerId: string, markerData: Partial<MarkerCreateArgs>): Promise<any> {
    const endpoint = datasetSlug === 'all' 
      ? `${this.baseUrl}/markers/${markerId}` 
      : `${this.baseUrl}/markers/${markerId}?dataset=${datasetSlug}`;
      
    const response = await fetch(endpoint, {
      method: "PUT",
      headers: this.headers,
      body: JSON.stringify({
        message: markerData.message,
        type: markerData.type,
        start_time: markerData.start_time,
        end_time: markerData.end_time,
        url: markerData.url
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update marker: ${response.statusText}`);
    }

    return await response.json();
  }

  async deleteMarker(datasetSlug: string, markerId: string): Promise<void> {
    const endpoint = datasetSlug === 'all' 
      ? `${this.baseUrl}/markers/${markerId}` 
      : `${this.baseUrl}/markers/${markerId}?dataset=${datasetSlug}`;
      
    const response = await fetch(endpoint, {
      method: "DELETE",
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to delete marker: ${response.statusText}`);
    }
  }
}

async function main() {
  const apiKey = process.env.HONEYCOMB_API_KEY;
  if (!apiKey) {
    console.error("Error: HONEYCOMB_API_KEY environment variable is required.");
    process.exit(1);
  }

  console.error("Starting Honeycomb MCP Server...");
  const server = new Server(
    {
      name: "Honeycomb MCP Server",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  const client = new HoneycombClient(apiKey);

  server.setRequestHandler(
    CallToolRequestSchema,
    async (request: CallToolRequest) => {
      console.error("CallToolRequest received:", request);
      try {
        if (!request.params.arguments) {
          throw new Error("No arguments provided");
        }

        switch (request.params.name) {
          // Auth
          case "honeycomb_auth": {
            // 認証情報の確認のみ
            return {
              content: [{ type: "text", text: JSON.stringify({ authenticated: true }) }],
            };
          }

          // Dataset management
          case "honeycomb_datasets_list": {
            const response = await client.listDatasets();
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }

          case "honeycomb_dataset_get": {
            const args = request.params.arguments as unknown as DatasetGetArgs;
            if (!args.datasetSlug) {
              throw new Error("datasetSlug is required");
            }
            const response = await client.getDataset(args.datasetSlug);
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }

          case "honeycomb_datasets_create": {
            const args = request.params.arguments as unknown as any;
            if (!args.name) {
              throw new Error("name is required");
            }
            const response = await client.createDataset(args.name, args.description);
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }

          case "honeycomb_datasets_update": {
            const args = request.params.arguments as unknown as any;
            if (!args.datasetSlug) {
              throw new Error("datasetSlug is required");
            }
            const response = await client.updateDataset(args.datasetSlug, args.name, args.description);
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }

          // Column management
          case "honeycomb_columns_list": {
            const args = request.params.arguments as unknown as ColumnListArgs;
            if (!args.datasetSlug) {
              throw new Error("datasetSlug is required");
            }
            const response = await client.listColumns(args.datasetSlug);
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }

          // Query management
          case "honeycomb_query_create": {
            const args = request.params.arguments as unknown as QueryCreateArgs;
            if (!args.datasetSlug || !args.query) {
              throw new Error("datasetSlug and query are required");
            }
            const response = await client.createQuerySpec(args.datasetSlug, args.query);
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }

          case "honeycomb_query_result_create": {
            const args = request.params.arguments as unknown as QueryResultCreateArgs;
            if (!args.datasetSlug || !args.queryId) {
              throw new Error("datasetSlug and queryId are required");
            }
            const response = await client.getQueryResult(args.datasetSlug, args.queryId);
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }

          case "honeycomb_query_result_get": {
            const args = request.params.arguments as unknown as QueryResultGetArgs;
            if (!args.datasetSlug || !args.queryResultId) {
              throw new Error("datasetSlug and queryResultId are required");
            }
            const response = await client.getQueryResult(args.datasetSlug, args.queryResultId);
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }

          // Event management
          case "honeycomb_event_create": {
            const args = request.params.arguments as unknown as EventCreateArgs;
            if (!args.datasetSlug || !args.event) {
              throw new Error("datasetSlug and event are required");
            }
            // イベント送信メソッドの実装が必要
            // const response = await client.createEvent(args.datasetSlug, args.event);
            return {
              content: [{ type: "text", text: JSON.stringify({ success: true }) }],
            };
          }

          // P2 - Board management
          case "honeycomb_boards_list": {
            const response = await client.listBoards();
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }

          case "honeycomb_board_get": {
            const args = request.params.arguments as unknown as BoardGetArgs;
            if (!args.boardId) {
              throw new Error("boardId is required");
            }
            const response = await client.getBoard(args.boardId);
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }

          case "honeycomb_board_create": {
            const args = request.params.arguments as unknown as BoardCreateArgs;
            if (!args.name) {
              throw new Error("name is required");
            }
            const response = await client.createBoard(args.name, args.description);
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }

          case "honeycomb_board_update": {
            const args = request.params.arguments as unknown as BoardUpdateArgs;
            if (!args.boardId) {
              throw new Error("boardId is required");
            }
            const response = await client.updateBoard(args.boardId, args.name, args.description);
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }



          // P2 - Marker management
          case "honeycomb_markers_list": {
            const args = request.params.arguments as unknown as MarkerListArgs;
            if (!args.datasetSlug) {
              throw new Error("datasetSlug is required");
            }
            const response = await client.listMarkers(args.datasetSlug);
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }

          case "honeycomb_marker_create": {
            const args = request.params.arguments as unknown as MarkerCreateArgs;
            if (!args.datasetSlug || !args.message || !args.type || !args.start_time) {
              throw new Error("datasetSlug, message, type, and start_time are required");
            }
            const response = await client.createMarker(args);
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }
          






          default:
            throw new Error(`Unknown tool: ${request.params.name}`);
        }
      } catch (error: any) {
        console.error("Error handling request:", error);
        return {
          content: [{ type: "text", text: JSON.stringify({ error: error.message }) }],
        };
      }
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        // P1 Tools
        authTool,
        datasetsListTool,
        datasetGetTool,
        datasetsCreateTool,
        columnsListTool,
        queryCreateTool,
        queryGetTool,
        queryResultCreateTool,
        queryResultGetTool,
        eventCreateTool,
        
        // P2 Tools
        boardsListTool,
        boardGetTool,
        boardCreateTool,
        boardUpdateTool,
        markersListTool,
        markerCreateTool,
      ],
    };
  });

  const transport = new StdioServerTransport();
  console.error("Connecting server to transport...");
  await server.connect(transport);

  console.error("Honeycomb MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
