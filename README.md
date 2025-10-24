# ポートフォリオ


## アプリ概要
Next.jsとSupabaseを用いた、社内サポート部門向けのタスク管理＆共有のアプリケーションです。


## サイトイメージ（メインページ）
![タスク一覧画面](https://github.com/hide-haru/SupportHub/blob/main/docs/%E3%82%A2%E3%83%97%E3%83%AA%E3%81%AE%E3%83%A1%E3%82%A4%E3%83%B3%E3%83%9A%E3%83%BC%E3%82%B8%E7%94%BB%E5%83%8F.JPG?raw=true)


## サイトURL
https://support-8pgxgv8g3-hide-harus-projects.vercel.app/

ログインページに遷移します。
ログインフォーム右上の「新規登録はこちら」から、名前/ユーザID/メールアドレス/パスワードを入力してログインお願いします。
新規登録後、受信メールで認証頂きますと、メインページへ遷移します。


## 使用技術
- フロントエンド：Next.js 15.5.4
- バックエンド：Next.js 15.5.4
- データベース：Supabase
- デプロイ：Vercel
- バージョン管理：Git、GitHub
- テスト・デバッグ：DevTools（Google Chrome）
- 外部API：SendGrid 


## 設計ドキュメント
[要件定義・基本設計・詳細設計の一覧_Googleスプレッドシート](https://docs.google.com/spreadsheets/d/1KaeGwDiYoHskK4_-CJ9eZnEe8aMB_9Oqwj_veDkKkYM/edit?usp=drive_link)

詳細設計時のワイヤーフレーム、ER図、ワークフロー図の画像はdocsディレクトリに格納しています。（[こちらからアクセス](./docs)）


## 機能一覧
- ユーザー登録、ログイン、パスワードリセット
- タスク一覧、タスク新規作成、タスク参照、タスク更新、コメント
- 退会、マイページ、パスワード変更

## 備考
- 活用した生成AIとその用途
  - ChatGPT：要件定義、設計、各種リサーチ
  - claude：各種リサーチ（主にレイアウト周り）

- リファクタリングの規則
  - ログイン、パスワード忘れた際のメール連携は、lib/authフォルダにAPIを格納
  - プルダウンで選択する、マスタ類はlib/dbフォルダに格納
  - その他lib直下に、格納
