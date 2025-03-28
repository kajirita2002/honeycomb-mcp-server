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
interface DatasetGetArgs {
  datasetSlug: string;
}

interface ColumnListArgs {
  datasetSlug: string;
  key_name?: string; // オプショナル：特定のカラム名でフィルタリング
}

// クエリの計算操作の型定義
interface QueryCalculation {
  op: string;           // 計算操作（COUNT, AVGなど）
  column?: string;      // 計算対象の列名（必要な場合）
}

// クエリの並び順の型定義
interface QueryOrder {
  op?: string;          // 並び替えの操作
  column?: string;      // 並び替えの列
  order: 'ascending' | 'descending';
}

// クエリのフィルタの型定義
interface QueryFilter {
  column: string;       // フィルタ対象の列
  op: string;           // フィルタ操作（EXISTS, =, !=など）
  value?: any;          // フィルタ値
}

// Honeycomb クエリの型定義
interface HoneycombQuery {
  calculations: QueryCalculation[];
  breakdowns?: string[];            // グループ化する列
  filters?: QueryFilter[];          // フィルタ条件
  filter_combination?: 'AND' | 'OR'; // フィルタの組み合わせ方法
  time_range?: number;              // 秒単位の時間範囲
  start_time?: number;              // UNIXエポック秒からの開始時間
  end_time?: number;                // UNIXエポック秒からの終了時間
  limit?: number;                   // 返される結果の最大数
  orders?: QueryOrder[];            // 結果の並び順
  granularity?: number;             // グラフの時間解像度（秒単位）
  having?: any;                     // 結果テーブルに対するフィルタ
}

interface QueryCreateArgs {
  datasetSlug: string;
  query: HoneycombQuery;
}

interface QueryGetArgs {
  datasetSlug: string;
  queryId: string;
}

interface QueryResultCreateArgs {
  datasetSlug: string;
  queryId: string;
  disable_series?: boolean;
  disable_total_by_aggregate?: boolean;
  disable_other_by_aggregate?: boolean;
  limit?: number;
}

interface QueryResultGetArgs {
  datasetSlug: string;
  queryResultId: string;
}

interface DatasetDefinitionsListArgs {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: string;
}

interface BoardGetArgs {
  boardId: string;
}

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
      key_name: {
        type: "string",
        description: "Optional: Filter by a specific column key name",
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
        properties: {
          calculations: {
            type: "array",
            description: "Array of calculation objects that define metrics to compute",
            items: {
              type: "object",
              properties: {
                op: {
                  type: "string",
                  description: "Operation to perform: COUNT, SUM, AVG, P50, P90, P95, P99, MAX, MIN, RATE, RATE_MAX, RATE_AVG, HEATMAP, CONCURRENCY, FREQUENCY, HISTOGRAM, PERCENTILES"
                },
                column: {
                  type: "string",
                  description: "Column name to perform operation on (not required for COUNT)"
                }
              }
            }
          },
          filters: {
            type: "array",
            description: "Array of filter objects that define query constraints",
            items: {
              type: "object",
              properties: {
                column: {
                  type: "string",
                  description: "Column name to filter on"
                },
                op: {
                  type: "string",
                  description: "Operator: exists, does-not-exist, =, !=, >, <, >=, <=, starts-with, ends-with, contains, does-not-contain, in, not-in"
                },
                value: {
                  type: ["string", "number", "boolean", "array"],
                  description: "Value to compare against (required for operators other than exists/does-not-exist)"
                }
              }
            }
          },
          breakdowns: {
            type: "array",
            description: "Array of column names to group results by",
            items: {
              type: "string"
            }
          },
          orders: {
            type: "array",
            description: "Array of order objects to sort results",
            items: {
              type: "object",
              properties: {
                column: {
                  type: "string",
                  description: "Column name to sort by (not required when sorting by COUNT)"
                },
                op: {
                  type: "string",
                  description: "Operation to sort by: COUNT, SUM, AVG, P50, P90, P95, P99, MAX, MIN, RATE, RATE_MAX, RATE_AVG"
                },
                order: {
                  type: "string",
                  description: "Sort order (asc, desc, ascending, descending)"
                }
              }
            }
          },
          time_range: {
            type: "number",
            description: "Time range in seconds or ISO8601 timestamp for absolute time"
          },
          start_time: {
            type: "string",
            description: "Start time in ISO8601 format (alternative to time_range)"
          },
          end_time: {
            type: "string",
            description: "End time in ISO8601 format (alternative to time_range)"
          },
          granularity: {
            type: "number",
            description: "Time bucket size in seconds for time series queries"
          },
          limit: {
            type: "number",
            description: "Maximum number of results to return"
          },
          havings: {
            type: "array",
            description: "Array of having objects for filtering on aggregate values",
            items: {
              type: "object",
              properties: {
                column: {
                  type: "string",
                  description: "Column name for the having clause"
                },
                op: {
                  type: "string",
                  description: "Operation for the having clause: =, !=, >, <, >=, <="
                },
                value: {
                  type: ["string", "number"],
                  description: "Value to compare against"
                }
              }
            }
          }
        }
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


// Dataset Definitionsのツール定義
const datasetDefinitionsListTool: Tool = {
  name: "honeycomb_dataset_definitions_list",
  description: "List dataset definitions with pagination",
  inputSchema: {
    type: "object",
    properties: {
      page: {
        type: "number",
        description: "ページ番号（1から始まる）",
      },
      limit: {
        type: "number",
        description: "1ページあたりの結果数（デフォルト: 100, 最大: 1000）",
      },
      sort_by: {
        type: "string",
        description: "ソートするフィールド（例: 'name', 'description'）",
      },
      sort_order: {
        type: "string",
        description: "ソート順序（'asc'または'desc'）",
      },
    },
  },
};

const boardsListTool: Tool = {
  name: "honeycomb_boards_list",
  description: "List all boards",
  inputSchema: {
    type: "object",
    properties: {},
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

class HoneycombClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(apiKey: string) {
    this.baseUrl = "https://api.honeycomb.io/1";
    this.headers = {
      "X-Honeycomb-Team": apiKey,
      "Content-Type": "application/json",
    };
  }

  // Auth
  async auth(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/auth`, {
      method: "GET",
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to authenticate: ${response.statusText}`);
    }

    return await response.json();
  }

  // Dataset Definitions operations
  async listDatasetDefinitions(options?: DatasetDefinitionsListArgs): Promise<any> {
    let url = `${this.baseUrl}/dataset_definitions`;
    
    // クエリパラメータを構築
    if (options) {
      const params = new URLSearchParams();
      if (options.page) params.append('page', options.page.toString());
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.sort_by) params.append('sort_by', options.sort_by);
      if (options.sort_order) params.append('sort_order', options.sort_order);
      
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    
    const response = await fetch(url, {
      method: "GET",
      headers: this.headers,
    });
    
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Dataset Definitions list error: Status=${response.status}, Body=${errorBody}`);
      throw new Error(`データセット定義の取得に失敗しました: ${response.statusText}`);
    }
    
    return await response.json();
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

  // Column operations
  async listColumns(datasetSlug: string, keyName?: string): Promise<any> {
    let url = `${this.baseUrl}/columns/${datasetSlug}`;
    
    // key_nameパラメータが指定されている場合、URLクエリに追加
    if (keyName) {
      url += `?key_name=${encodeURIComponent(keyName)}`;
    }
    
    const response = await fetch(url, {
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
    const response = await fetch(`${this.baseUrl}/queries/${datasetSlug}`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(querySpec),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `Query creation error: Status=${response.status}, Body=${errorBody}`
      );
      throw new Error(`Failed to create query spec: ${response.statusText}`);
    }

    return await response.json();
  }

  async getQuerySpec(datasetSlug: string, queryId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/queries/${datasetSlug}/${queryId}`, {
      method: "GET",
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to get query spec: ${response.statusText}`);
    }

    return await response.json();
  }

  async createQueryResult(datasetSlug: string, queryId: string, options?: {
    disable_series?: boolean;
    disable_total_by_aggregate?: boolean;
    disable_other_by_aggregate?: boolean;
    limit?: number;
  }): Promise<any> {
    const response = await fetch(`${this.baseUrl}/1/query_results/${datasetSlug}`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        query_id: queryId,
        disable_series: options?.disable_series ?? false,
        disable_total_by_aggregate: options?.disable_total_by_aggregate ?? true,
        disable_other_by_aggregate: options?.disable_other_by_aggregate ?? true,
        limit: options?.limit ?? 10000
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Query result creation error: Status=${response.status}, Body=${errorBody}`);
      throw new Error(`Failed to create query result: ${response.statusText}`);
    }

    return await response.json();
  }

  async getQueryResult(datasetSlug: string, queryResultId: string): Promise<any> {
    const response = await fetch(
      `${this.baseUrl}/query_results/${datasetSlug}/${queryResultId}`,
      {
        method: "GET",
        headers: this.headers,
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Query result error: Status=${response.status}, Body=${errorBody}`);
      throw new Error(`クエリ結果の取得に失敗しました: ${response.statusText}`);
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
    }
  );

  const client = new HoneycombClient(apiKey);

  server.setRequestHandler(
    CallToolRequestSchema,
    async (request: CallToolRequest) => {
      console.error("CallToolRequest received:", request);
      try {
        switch (request.params.name) {
          // Auth
          case "honeycomb_auth": {
            const response = await client.auth();
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
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

          // Column management
          case "honeycomb_columns_list": {
            const args = request.params.arguments as unknown as ColumnListArgs;
            if (!args.datasetSlug) {
              throw new Error("datasetSlug is required");
            }
            const response = await client.listColumns(args.datasetSlug, args.key_name);
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
            const response = await client.createQuerySpec(
              args.datasetSlug,
              args.query
            );
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }

          case "honeycomb_query_get": {
            const args = request.params.arguments as unknown as QueryGetArgs;
            if (!args.datasetSlug || !args.queryId) {
              throw new Error("datasetSlug and queryId are required");
            }
            const response = await client.getQuerySpec(
              args.datasetSlug,
              args.queryId
            );
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }

          case "honeycomb_query_result_create": {
            const args = request.params
              .arguments as unknown as QueryResultCreateArgs;
            if (!args.datasetSlug || !args.queryId) {
              throw new Error("datasetSlug and queryId are required");
            }
            const response = await client.createQueryResult(
              args.datasetSlug,
              args.queryId,
              {
                disable_series: args.disable_series,
                disable_total_by_aggregate: args.disable_total_by_aggregate,
                disable_other_by_aggregate: args.disable_other_by_aggregate,
                limit: args.limit
              }
            );
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }

          case "honeycomb_query_result_get": {
            const args = request.params
              .arguments as unknown as QueryResultGetArgs;
            if (!args.datasetSlug || !args.queryResultId) {
              throw new Error("datasetSlugとqueryResultIdが必要です");
            }
            const response = await client.getQueryResult(
              args.datasetSlug,
              args.queryResultId
            );
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }

          // Dataset Definitions
          case "honeycomb_dataset_definitions_list": {
            const args = request.params.arguments as unknown as DatasetDefinitionsListArgs;
            const response = await client.listDatasetDefinitions(args);
            return {
              content: [{ type: "text", text: JSON.stringify(response) }],
            };
          }

          // - Board management
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

          default:
            throw new Error(`Unknown tool: ${request.params.name}`);
        }
      } catch (error: any) {
        console.error("Error handling request:", error);
        return {
          content: [
            { type: "text", text: JSON.stringify({ error: error.message }) },
          ],
        };
      }
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        authTool,
        datasetsListTool,
        datasetGetTool,
        columnsListTool,
        queryCreateTool,
        queryGetTool,
        queryResultCreateTool,
        queryResultGetTool,
        datasetDefinitionsListTool,
        boardsListTool,
        boardGetTool,
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
