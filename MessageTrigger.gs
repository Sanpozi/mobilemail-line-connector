//This code is cc0 license.

//Initialize
const scriptProperties = PropertiesService.getScriptProperties()
// LINE Developers Channel Access Token
const access_token = scriptProperties.getProperty('ACCESS_TOKEN')
// My Line User ID
const to = scriptProperties.getProperty('LINE_USER_ID')
//For recording last processed mail date
const spreadsheetId = scriptProperties.getProperty('SPREADSHEET_ID')
//Access Point
const url = "https://api.line.me/v2/bot/message/push"
//Tamamiyori
const email = 'nogizaka46-tamami_sakaguchi@m.nogizaka46.com'

function main(){
  const targetMail = getTargetMail()
  const messages = []
  if (targetMail){
    setResponseText(messages,targetMail)
    setResponseImages(messages, targetMail)
    const res = executePush(messages)
    if (res.getResponseCode() == 200){
      //メールを開封済みにする
      if(targetMail.isUnread()){
        targetMail.markRead()
      }
      //最後のメールの受信時間を記録
      setLastDate(targetMail.getDate())
    }else{
      //何もしない
      console.log('LineAPI Request was failed. ' + targetMail.getDate())
    }
  }
}

/*
  typeがtextのメッセージオブジェクトを作成してmessagesに追加する
  param
    Object[] messages:リクエストボディに含まれるメッセージオブジェクトの配列
    GmailMessage targetMail:処理対象のメール
  return
    なし
*/
function setResponseText(messages, targetMail){
  const message = {
    "type":"text",
    "text": "新着のたまみよりです♪\r\n" + targetMail.getPlainBody()
  }
  messages.push(message)
}

/*
  typeがimageのメッセージオブジェクトを作成してmessagesに追加する
  param
    Object[] messages:リクエストボディに含まれるメッセージオブジェクトの配列
    GmailMessage targetMail:処理対象のメール
  return
    なし 
*/
function setResponseImages(messages, targetMail){
  const html = targetMail.getBody()
  //画像URLを正規表現で抜き出し
  const regex = new RegExp('https://mail(.*?).jpg', 'g')
  const urls = html.match(regex)
  if (urls){  //画像URLが取れているか
    for (const url of urls){
      const message = {
        "type":"image",
        "originalContentUrl": url,
        "previewImageUrl": url
      }
      messages.push(message)
    }
  }else{
    //何もしない
  }
}

/*
  処理対象のメールを１件決定して返す
  return GmailMessage
*/
function getTargetMail(){
  const targetMails = []
  const lastDate = getLastDate()
  var query = 'after:' + lastDate + ' From:' + email
  //「前回実行時以降に受信したメールを含むスレッド」を取得する
  var threads =GmailApp.search(query)
  //新しい順で取得されるので古い順に反転させる
  threads = threads.reverse() 
  for (const thread of threads){
    var mails = thread.getMessages()
    for (const mail of mails){
      //保存しているlastDateはUnix時間なので1000倍してからnew Date()する
      if(mail.getDate() > new Date(lastDate*1000)){
        return mail
      }
    }
  }
}

function getLastDate(){
  var afterDatetime = SpreadsheetApp.openById(spreadsheetId).getSheetByName("lastdate").getRange(1, 1).getValue()
  return afterDatetime
}

function setLastDate(dt){
  //Unix時間に変換してから保存する
  const datetime = Date.parse(dt)/1000
  SpreadsheetApp.openById(spreadsheetId).getSheetByName("lastdate").getRange(1, 1).setValue(datetime)
}

/*
  LineAPIにリクエストを投げる
  param
    Object[] messages:リクエストボディに含まれるメッセージオブジェクトの配列
  return
    HTTPResponse
*/
function executePush(messages) {
  const headers = {
    "Content-Type" : "application/json; charset=UTF-8",
    'Authorization': 'Bearer ' + access_token,
  }
  const postData = {
    "to" : to,
    "messages" : messages
  }
  const options = {
    "method" : "post",
    "headers" : headers,
    "payload" : JSON.stringify(postData)
  }
  return UrlFetchApp.fetch(url, options);
}
