# Honeycomb MCP サーバー

<a href="https://glama.ai/mcp/servers/@kajirita2002/honeycomb-mcp-server">
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

#### 認証

1. `honeycomb_auth`
   - Honeycomb API で認証を行います
   - 入力:
     - `apiKey` (string, optional): Honeycomb API キー（提供されない場合、環境変数を使用）

#### データセット管理

1. `honeycomb_datasets_list`

   - 利用可能なすべてのデータセットをリスト表示します
   - 入力パラメータは必要ありません

2. `honeycomb_dataset_get`

   - 特定のデータセットに関する情報を取得します
   - 入力:
     - `datasetSlug` (string, required): データセットのスラグ

3. `honeycomb_datasets_create`

   - 新しいデータセットを作成します
   - 入力:
     - `name` (string, required): データセットの名前
     - `description` (string, optional): データセットの説明



#### カラム管理

1. `honeycomb_columns_list`
   - データセット内のすべてのカラムをリスト表示します
   - 入力:
     - `datasetSlug` (string, required): データセットのスラグ

#### クエリ管理

1. `honeycomb_query_create`

   - データセットに対する新しいクエリを作成します
   - 入力:
     - `datasetSlug` (string, required): データセットのスラグ
     - `query` (object, required): クエリ設定

2. `honeycomb_query_result_create`
   - クエリを実行し、結果を返します
   - 入力:
     - `datasetSlug` (string, required): データセットのスラグ
     - `query` (object, required): クエリ設定

#### イベント管理

1. `honeycomb_event_create`

   - データセットに新しいイベントを作成します
   - 入力:
     - `datasetSlug` (string, required): データセットのスラグ
     - `data` (object, required): イベントデータ



#### ボード管理

1. `honeycomb_boards_list`

   - すべてのボードをリスト表示します
   - 入力パラメータは必要ありません

2. `honeycomb_board_get`

   - 特定のボードに関する情報を取得します
   - 入力:
     - `boardId` (string, required): ボードの ID

3. `honeycomb_board_create`

   - 新しいボードを作成します
   - 入力:
     - `name` (string, required): ボードの名前
     - `description` (string, optional): ボードの説明
     - `query_ids` (array of strings, optional): ボードに含めるクエリのID配列

4. `honeycomb_board_update`

   - 既存のボードを更新します
   - 入力:
     - `boardId` (string, required): 更新するボードの ID
     - `name` (string, optional): ボードの新しい名前
     - `description` (string, optional): ボードの新しい説明
     - `query_ids` (array of strings, optional): ボードに含める新しいクエリのID配列



#### マーカー管理

1. `honeycomb_markers_list`

   - データセットのすべてのマーカーをリスト表示します
   - 入力:
     - `datasetSlug` (string, required): データセットのスラグ

2. `honeycomb_marker_create`

   - 新しいマーカーを作成します
   - 入力:
     - `datasetSlug` (string, required): データセットのスラグ
     - `message` (string, required): マーカーのメッセージ
     - `type` (string, required): マーカーのタイプ
     - `start_time` (string, required): マーカーの開始時間
     - `end_time` (string, optional): マーカーの終了時間
     - `url` (string, optional): マーカーに関連付けられた URL





## 使用例

以下は、Claude AI がこの MCP サーバーを使用して新しい Honeycomb データセットを作成し、イベントを追加する例です：

```
[Claude] Honeycombに「アプリケーションモニタリング」という名前の新しいデータセットを作成し、説明として「本番アプリケーションのモニタリング」を設定してください。

[ユーザー] Honeycombに新しいデータセットを作成するのを手伝います。

[Claude] Honeycombに新しいデータセットを作成します。

「アプリケーションモニタリング」という名前で、説明「本番アプリケーションのモニタリング」のデータセットを作成しています...

[Claude は honeycomb_datasets_create を使用]

データセットが正常に作成されました！これでイベントを追加できます。

テスト用に、このデータセットにサンプルイベントを作成しますか？

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
