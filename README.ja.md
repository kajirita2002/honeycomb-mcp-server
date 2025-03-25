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

4. `honeycomb_datasets_update`
   - 既存のデータセットを更新します
   - 入力:
     - `datasetSlug` (string, required): 更新するデータセットのスラグ
     - `name` (string, optional): データセットの新しい名前
     - `description` (string, optional): データセットの新しい説明

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

2. `honeycomb_batch_event_create`
   - データセットに複数のイベントを作成します
   - 入力:
     - `datasetSlug` (string, required): データセットのスラグ
     - `events` (array of objects, required): イベントデータの配列

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

5. `honeycomb_board_delete`
   - ボードを削除します
   - 入力:
     - `boardId` (string, required): 削除するボードの ID

#### マーカー管理

1. `honeycomb_markers_list`

   - データセットのすべてのマーカーをリスト表示します
   - 入力:
     - `datasetSlug` (string, required): データセットのスラグ

2. `honeycomb_marker_get`

   - 特定のマーカーに関する情報を取得します
   - 入力:
     - `datasetSlug` (string, required): データセットのスラグ
     - `markerId` (string, required): マーカーの ID

3. `honeycomb_marker_create`

   - 新しいマーカーを作成します
   - 入力:
     - `datasetSlug` (string, required): データセットのスラグ
     - `message` (string, required): マーカーのメッセージ
     - `type` (string, required): マーカーのタイプ
     - `start_time` (string, required): マーカーの開始時間
     - `end_time` (string, optional): マーカーの終了時間
     - `url` (string, optional): マーカーに関連付けられた URL

4. `honeycomb_marker_update`

   - 既存のマーカーを更新します
   - 入力:
     - `datasetSlug` (string, required): データセットのスラグ
     - `markerId` (string, required): 更新するマーカーの ID
     - `message` (string, optional): マーカーの新しいメッセージ
     - `type` (string, optional): マーカーの新しいタイプ
     - `start_time` (string, optional): マーカーの新しい開始時間
     - `end_time` (string, optional): マーカーの新しい終了時間
     - `url` (string, optional): マーカーに関連付けられた新しい URL

5. `honeycomb_marker_delete`
   - マーカーを削除します
   - 入力:
     - `datasetSlug` (string, required): データセットのスラグ
     - `markerId` (string, required): 削除するマーカーの ID

#### SLO 管理

1. `honeycomb_slos_list`

   - データセットのすべての SLO をリスト表示します
   - 入力:
     - `datasetSlug` (string, required): データセットのスラグ

2. `honeycomb_slo_get`

   - 特定の SLO に関する情報を取得します
   - 入力:
     - `datasetSlug` (string, required): データセットのスラグ
     - `sloId` (string, required): SLO の ID

3. `honeycomb_slo_create`

   - 新しい SLO を作成します
   - 入力:
     - `datasetSlug` (string, required): データセットのスラグ
     - `name` (string, required): SLO の名前
     - `description` (string, optional): SLO の説明
     - `sli` (object, required): aliasプロパティを持つサービスレベル指標（SLI）の設定
     - `time_period_days` (integer, required): SLOが評価される期間（日数）
     - `target_per_million` (integer, required): 100万イベント中、成功すると予想される対象イベントの数

4. `honeycomb_slo_update`
   - 既存の SLO を更新します
   - 入力:
     - `datasetSlug` (string, required): データセットのスラグ
     - `sloId` (string, required): 更新する SLO の ID
     - `name` (string, optional): SLO の新しい名前
     - `description` (string, optional): SLO の新しい説明
     - `sli` (object, optional): aliasプロパティを持つ新しいサービスレベル指標（SLI）の設定
     - `time_period_days` (integer, optional): 新しい期間（日数）
     - `target_per_million` (integer, optional): 新しい100万イベントあたりの目標値

#### トリガー管理

1. `honeycomb_triggers_list`

   - データセットのすべてのトリガーをリスト表示します
   - 入力:
     - `datasetSlug` (string, required): データセットのスラグ

2. `honeycomb_trigger_create`

   - 新しいトリガーを作成します
   - 入力:
     - `datasetSlug` (string, required): データセットのスラグ
     - `name` (string, required): トリガーの名前（最大120文字）
     - `description` (string, optional): トリガーの説明（最大1023文字）
     - `query_id` (string, queryが提供されない場合は必須): トリガーのクエリID（query_idかqueryのどちらか一方が必須）
     - `query` (object, query_idが提供されない場合は必須): インラインクエリ仕様（query_idかqueryのどちらか一方が必須）
     - `threshold` (object, required): しきい値の設定
       - `op` (string, required): 比較演算子（`>`, `>=`, `<`, `<=`）
       - `value` (number, required): 比較対象のしきい値
       - `exceeded_limit` (integer, optional): アラート送信前に条件を満たす必要がある回数（1-5、デフォルト: 1）
     - `frequency` (integer, optional): 結果をチェックする間隔（秒単位、60-86400、60の倍数であること、デフォルト: 900）
     - `alert_type` (string, optional): アラート動作（`on_change`: しきい値を超えた時のみ、`on_true`: しきい値を超えている間毎回、デフォルト: `on_change`）
     - `recipient_ids` (array of strings, optional): トリガー通知の受信者ID配列
     - `disabled` (boolean, optional): trueの場合、トリガーは評価されません（デフォルト: false）
     - `evaluation_schedule_type` (string, optional): スケジュールタイプ（`frequency`または`window`）
     - `evaluation_schedule` (object, optional): タイプが`window`の場合のスケジュール設定

3. `honeycomb_trigger_update`

   - 既存のトリガーを更新します
   - 入力:
     - `datasetSlug` (string, required): データセットのスラグ
     - `triggerId` (string, required): 更新するトリガーの ID
     - `name` (string, optional): トリガーの新しい名前（最大120文字）
     - `description` (string, optional): トリガーの新しい説明（最大1023文字）
     - `query_id` (string, optional): トリガーの新しいクエリID（query_idかqueryのどちらか一方を使用）
     - `query` (object, optional): 新しいインラインクエリ仕様（queryかquery_idのどちらか一方を使用）
     - `threshold` (object, optional): 新しいしきい値の設定
       - `op` (string, optional): 比較演算子（`>`, `>=`, `<`, `<=`）
       - `value` (number, optional): 比較対象のしきい値
       - `exceeded_limit` (integer, optional): アラート送信前に条件を満たす必要がある回数（1-5）
     - `frequency` (integer, optional): 結果をチェックする新しい間隔（秒単位、60-86400、60の倍数であること）
     - `alert_type` (string, optional): 新しいアラート動作（`on_change`または`on_true`）
     - `recipient_ids` (array of strings, optional): 新しいトリガー通知の受信者ID配列
     - `disabled` (boolean, optional): trueの場合、トリガーは評価されません
     - `evaluation_schedule_type` (string, optional): スケジュールタイプ（`frequency`または`window`）
     - `evaluation_schedule` (object, optional): タイプが`window`の場合のスケジュール設定

4. `honeycomb_trigger_delete`
   - トリガーを削除します
   - 入力:
     - `datasetSlug` (string, required): データセットのスラグ
     - `triggerId` (string, required): 削除するトリガーの ID

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
