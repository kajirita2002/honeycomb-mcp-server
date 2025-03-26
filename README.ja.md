# Honeycomb MCP サーバー

<a href="https://glama.ai/mcp/servers/honeycomb-mcp-server">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@kajirita2002/honeycomb-mcp-server/badge" alt="Honeycomb MCP server" />
</a>

## 概要

このサーバーは、[Model Context Protocol (MCP)](https://github.com/anthropics/anthropic-cookbook/tree/main/model_context_protocol)を使用して、Claude AI が[Honeycomb API](https://docs.honeycomb.io/api/)と対話できるようにするためのインターフェースです。

この MCP サーバーによって、Claude AI は Honeycomb のデータセット、クエリ、イベント、ボード、マーカー、SLO、トリガーなどの取得、作成、更新操作を行えるようになります。

## リポジトリについて

このリポジトリは、Honeycomb MCP サーバーの独立した実装を提供します。Claude AI と Honeycomb を統合し、可観測性とモニタリングワークフローを効率化します。

## セットアップ

### 前提条件

- Node.js 18 以上
- Honeycomb API キー

### インストール

```bash
# グローバルにインストール
npm install -g @kajirita2002/honeycomb-mcp-server

# または、npxで直接使用
npx @kajirita2002/honeycomb-mcp-server
```

### 環境変数の設定

```bash
# 環境変数の設定
export HONEYCOMB_API_KEY="your_honeycomb_api_key"
```

### MCP 設定例

この MCP サーバーを使用する場合は、`mcp_config.json`ファイルに以下の設定を追加してください：

```json
"honeycomb": {
  "command": "npx",
  "args": ["-y", "@kajirita2002/honeycomb-mcp-server"],
  "env": {
    "HONEYCOMB_API_KEY": "your_honeycomb_api_key"
  }
}
```

### サーバーの起動

```bash
# サーバーを起動
npm start
```

## 利用可能なツール

この MCP サーバーは以下のツールを提供します：

### 認証

1. `honeycomb_auth`
   - Honeycomb API で認証を行い、APIキーを検証します
   - 入力パラメータは必要ありません（環境変数を使用）

### データセット管理

1. `honeycomb_datasets_list`
   - Honeycomb環境内の利用可能なすべてのデータセットをリスト表示します
   - 入力パラメータは必要ありません

2. `honeycomb_dataset_get`
   - 特定のデータセットに関する詳細情報を取得します
   - 入力:
     - `datasetSlug` (string, required): 取得するデータセットのスラグ

### カラム管理

1. `honeycomb_columns_list`
   - データセット内のすべてのカラムをオプションのフィルタリングでリスト表示します
   - 入力:
     - `datasetSlug` (string, required): データセットのスラグ
     - `key_name` (string, optional): 特定のカラム名でフィルタリング

### クエリ管理

1. `honeycomb_query_create`
   - データセットに対する新しいクエリを作成します
   - 入力:
     - `datasetSlug` (string, required): データセットのスラグ
     - `query` (object, required): 計算、時間範囲、フィルターを含むクエリ設定オブジェクト

2. `honeycomb_query_get`
   - 特定のクエリに関する情報を取得します
   - 入力:
     - `datasetSlug` (string, required): データセットのスラグ
     - `queryId` (string, required): 取得するクエリのID

3. `honeycomb_query_result_create`
   - クエリを実行し、結果を返します（クエリの実行）
   - 入力:
     - `datasetSlug` (string, required): データセットのスラグ
     - `queryId` (string, required): 実行するクエリのID
     - `disable_series` (boolean, optional): シリーズデータを無効にするかどうか
     - `disable_total_by_aggregate` (boolean, optional): 合計集計を無効にするかどうか
     - `disable_other_by_aggregate` (boolean, optional): その他の集計を無効にするかどうか
     - `limit` (integer, optional): 結果の数の制限

4. `honeycomb_query_result_get`
   - 以前に実行されたクエリの結果を取得します
   - 入力:
     - `datasetSlug` (string, required): データセットのスラグ
     - `queryResultId` (string, required): 取得するクエリ結果のID

### データセット定義

1. `honeycomb_dataset_definitions_list`
   - ページネーション対応のデータセット定義リストを取得します
   - 入力:
     - `page` (number, optional): ページ番号（1から開始）
     - `limit` (number, optional): 1ページあたりの結果数（デフォルト: 100, 最大: 1000）
     - `sort_by` (string, optional): ソートするフィールド（例: 'name', 'description'）
     - `sort_order` (string, optional): ソート順序（'asc'または'desc'）

### ボード管理

1. `honeycomb_boards_list`
   - 利用可能なすべてのボードをリスト表示します
   - 入力パラメータは必要ありません

2. `honeycomb_board_get`
   - 特定のボードに関する詳細情報を取得します
   - 入力:
     - `boardId` (string, required): 取得するボードのID


## 使用例

以下は、Claude AIがこのMCPサーバーを使用してデータセットを一覧表示し、クエリを実行する例です：

```
[Claude] Honeycomb環境で利用可能なデータセットを表示していただけますか？

[ユーザー] はい、Honeycombにどのようなデータセットがあるか確認したいです。

[Claude] Honeycomb環境で利用可能なすべてのデータセットを一覧表示します。

honeycomb_datasets_listツールを使用します...

利用可能なデータセットは以下の通りです：
- production-metrics（スラグ: prod-metrics）
- staging-services（スラグ: staging-svc）
- application-logs（スラグ: app-logs）

どのデータセットについてさらに詳しく調べますか？

[ユーザー] production-metricsデータセットを見てみましょう。

[Claude] スラグ「prod-metrics」を使用してhoneycomb_dataset_getでproduction-metricsデータセットの詳細を取得します...

次に、過去24時間の平均応答時間を示すクエリを作成して実行します。

honeycomb_query_createとhoneycomb_query_result_createを使用します...

平均応答時間の傾向を示す結果は次のとおりです：
[クエリ結果の視覚化の説明]

[ユーザー] はい、サンプルイベントを追加してください。

[Claude] 「アプリケーションモニタリング」データセットにサンプルイベントを追加します。

[Claude は honeycomb_event_create を使用]

成功しました！「アプリケーションモニタリング」データセットに以下のデータを持つサンプルイベントを追加しました：
{
  "service": "api-server",
  "message": "ユーザーログイン成功",
  "duration_ms": 45,
  "status_code": 200,
  "endpoint": "/api/login",
  "timestamp": "2025-03-25T14:30:00Z"
}

このイベントは、完了までに45msかかった成功したユーザーログイン操作を表しています。

これでHoneycombダッシュボードでこのイベントを表示し、データを分析するためのクエリの構築を開始できます。
```

## ライセンス

このプロジェクトは MIT ライセンスの下で提供されています - 詳細は LICENSE ファイルをご覧ください。
