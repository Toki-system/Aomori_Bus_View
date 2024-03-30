# GTFS_Bus_View

## 概要
GTFS_Bus_Viewは、GTFS-JPおよびGTFS-RT形式のバス情報データをブラウザ上で可視化するプログラムです。

時刻表、バス停の位置、遅延情報などを表示します。

Aomori_City_View [https://toki-system.github.io/GTFS_Bus_View/] に公開されているデモをご覧いただけます。

## インストール
1. このレポジトリをクローンしてください。
2.クローンしたフォルダ内で以下のコマンドを実行して必要なライブラリをインストールしてください。
    ```sh
    npm install express
    ```
3. クローンしたフォルダ内で以下のコマンドを実行してください。
    ```sh
    node setup.js
    ```
   これにより、GTFS-JP（ZIPファイル）とGTFS-RT（URL指定）が読み込まれ、サーバーがポート3000で起動します。
