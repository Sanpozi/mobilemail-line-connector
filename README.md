# mobilemail-line-connector
## About 概要
Connects Mobile-Mail (prodeuced by Nogizaka46) and LINE bot via Google Apps Script  
乃木坂46のモバイルメールサービスとLINE BOTを連携させて、メンバーからのメールをLINEで表示させます。

## 前提条件
* モバイルメールをGmailで受信していること
* LINE Developersへの登録
    * https://developers.line.biz/ja/

## 利用方法
1. モバメを表示させるLINE BOTの作成
    1. LINE Developersにログイン
    2. 「プロバイダー」より「新規プロバイダー作成」
    3. 任意のプロバイダー名を入力
    4. **以下WIP（未検証）**
        * チャネルの作成
        * Messaging API (PUSH)の許可
        * 「Messaging API設定」->「チャンネルアクセストークン」よりアクセストークンを発行
        * 「チャネル基本設定」->「あなたのユーザーID」をメモ
2. Messaging APIをトリガーするGoogle App Scriptの作成
    1. モバメを受信しているGoogleアカウントでログイン
    2. [Google SpreadSheet](https://docs.google.com/spreadsheets/)にアクセス
    3. 新しいスプレッドシートを作成
        * 「空白」を選択
        * スプレッドシートの名前は任意
        * シートの名前を「lastdate」に変更
    4. スプレッドシートの編集画面で、ツールバーより「ツール」->「スクリプトエディタ」を選択
    5. [MessageTrigger.gs](MessageTriger.gs)の内容をコピー&Apps Scriptのエディタにペースト
    6. エディタ右上より「以前のエディタを使用」押下
    7. ツールバーより「ファイル」->「プロジェクトのプロパティ」選択
    8. 「スクリプトのプロパティ」タブを選択し、下記内容を登録
        * プロパティ：ACCESS_TOKEN
            * 値: 作成したLINE BOTチャネルのアクセストークン
        * プロパティ：LINE_USER_ID
            * 値: 作成したLINE BOTチャネルの「あなたのユーザーID」
        * プロパティ：SPREADSHEET_ID
            * 値: 作成したスプレッドシートのURLの該当部分
                * https://docs.google.com/spreadsheets/d/{この部分をコピー}/edit#gid=0

## License ライセンス
This project is licensed under cc0. See [LICENSE](LICENSE)  
流用・改変などご自由にお使いください。