/**
* Endpoints and keys
*/
var token = "";
var telegramUrl = "https://api.telegram.org/bot" + token;
var webAppUrl = "";
var ssId = "";
var adminChatId = "";
var peopleSpreadsheet = "People";

/**
 * Triggers
 */
var DAYS = [ScriptApp.WeekDay.MONDAY, ScriptApp.WeekDay.TUESDAY, ScriptApp.WeekDay.WEDNESDAY, ScriptApp.WeekDay.THURSDAY, ScriptApp.WeekDay.FRIDAY];
var HOURS = [10, 15];
var CLEAN_UP_HOUR = 3;
var EXPIRATION_HOUR = 16;

/**
 * Texts
 */
var SLACK_ID_MESSAGE = "Provide you slack username, `@doe.john`";
var PROPER_ID_MESSAGE = "Welcome";
var WRONG_ID_MESSAGE = "Unknown user. Please try again";
var LOCATION_MESSAGE = "Select your current location";
var MOOD_MESSAGE = "Select your current mood";
var COMMENT_MESSAGE = "Enter your comment you want to provide";
var GOODBYE_MESSAGE = "Heartbeat updated. Thank you";
var COMMENT_BUTTON = "Comment";

/**
 * Colors, used for spreadsheets
 */
var RED = "#e06666";
var AMBER = "#f7b16b";
var GREEN = "#93c47d";
var DEEP_GREEN = "#38761d";

/**
 * ZONES
 */
var ODESA = "Odesa";
var LVIV = "Lviv";
var KYIV = "Kyiv";
var RED_ZONE = "Ukraine (Red)";
var AMBER_ZONE = "Ukraine (Amber)";
var GREEN_ZONE = "Ukraine (Green)";
var MOLDOVA = "Moldova";
var ROMANIA = "Romania";
var GEORGIA = "Georgia";
var POLAND = "Poland";
var OTHER_ZONE = "Other"

var redZones = [KYIV, RED_ZONE];
var amberZones = [ODESA, AMBER_ZONE];
var greenZones = [LVIV, GREEN_ZONE];
var deepGreenZones = [MOLDOVA, ROMANIA, GEORGIA, POLAND, OTHER_ZONE];

/**
* Keyboards
*/
var locations = [
  [ODESA, LVIV, KYIV],
  [RED_ZONE, AMBER_ZONE, GREEN_ZONE],
  [MOLDOVA, ROMANIA, GEORGIA],
  [POLAND, OTHER_ZONE]
];
var locationsKeyboard = inlineKeyboard(locations);

var moods = [
  ["Good", "Bad", COMMENT_BUTTON]
];
var moodsKeyboard = inlineKeyboard(moods);


/**
 * Entry point
 */
function doPost(e) {
  try {
    var contents = JSON.parse(e.postData.contents);
    if (contents.callback_query) {
      var callbackContent = contents.callback_query
      var chatId = callbackContent.message.chat.id;
      var username = callbackContent.from.username;
      if (locations.some(buttons => buttons.includes(callbackContent.data))) {
        var location = callbackContent.data
        var name = callbackContent.from.first_name + " " + callbackContent.from.last_name;
        appendLocation(username, chatId, name, location);
        respondWithKeyboard(chatId, MOOD_MESSAGE, moodsKeyboard);
      } else if (moods.some(buttons => buttons.includes(callbackContent.data)) && callbackContent.data != COMMENT_BUTTON) {
        appendMood(chatId, callbackContent.data);
        respond(chatId, GOODBYE_MESSAGE);
      } else if (callbackContent.data == COMMENT_BUTTON) {
        reply(chatId, COMMENT_MESSAGE);
      } else { // no
        respond(chatId, GOODBYE_MESSAGE);
      }
    } else if (contents.message.reply_to_message && contents.message.reply_to_message.text == COMMENT_MESSAGE) {
      var chatId = contents.message.reply_to_message.chat.id;
      appendComment(chatId, contents.message.text);
      respond(chatId, GOODBYE_MESSAGE);
    } else if (contents.message.reply_to_message && contents.message.reply_to_message.text == SLACK_ID_MESSAGE) {
      var chatId = contents.message.reply_to_message.chat.id;
      var slackId = contents.message.text;
      var username = contents.message.from.username;
      if (saveUsername(chatId, slackId, username)) {
        respond(chatId, PROPER_ID_MESSAGE);
        respondWithKeyboard(chatId, LOCATION_MESSAGE, locationsKeyboard);
      } else {
        respond(chatId, WRONG_ID_MESSAGE);
        reply(chatId, SLACK_ID_MESSAGE)
      }
    } else {
      var chatId = contents.message.chat.id;
      if (isUserKnown(chatId)) {
        respondWithKeyboard(chatId, LOCATION_MESSAGE, locationsKeyboard);
      } else {
        reply(chatId, SLACK_ID_MESSAGE)
      }
    }
  } catch (e) {
    respond(adminChatId, "ERROR: " + JSON.stringify(e, null, 4));
  }
}

/**
 * Text input with linked message
 */
function reply(chatId, text) {
  var data = {
    method: "post",
    payload: {
      method: "sendMessage",
      chat_id: String(chatId),
      text: text,
      parse_mode: "HTML",
      reply_markup: JSON.stringify({ force_reply: true })
    }
  };
  UrlFetchApp.fetch(telegramUrl + '/', data);
}

/**
 * Regular message
 */
function respond(chatId, text) {
  var url = telegramUrl + "/sendMessage?chat_id=" + chatId + "&text=" + encodeURIComponent(text);
  UrlFetchApp.fetch(url);
}

/**
 * Inline keyboard
 */
function respondWithKeyboard(chatId, text, keyBoard) {
  var data = {
    method: "post",
    payload: {
      method: "sendMessage",
      chat_id: String(chatId),
      text: text,
      parse_mode: "HTML",
      reply_markup: JSON.stringify(keyBoard)
    }
  };
  UrlFetchApp.fetch(telegramUrl + '/', data);
}

/**
 * Check whether user is part of `People` spreadsheet
 */
function isUserKnown(chatId) {
  return SpreadsheetApp.openById(ssId).getSheetByName(peopleSpreadsheet).createTextFinder(chatId).findAll().length != 0;
}

/**
 * Link chatId to some user from `People` spreadsheet by slackId
 */
function saveUsername(chatId, slackId, username) {
  var slackIdNormalised = slackId.replace(/[^a-zA-Z.]/g, "").toLowerCase();
  var spreadSheet = SpreadsheetApp.openById(ssId).getSheetByName(peopleSpreadsheet);
  var range = spreadSheet.createTextFinder(slackIdNormalised).findAll();
  if (range.length) {
    var rawIndex = range[0].getRowIndex();
    var rangeIndex = "A" + rawIndex + ":B" + rawIndex;
    spreadSheet.getRange(rangeIndex).setValues([[username, chatId]]);
    return true;
  } else {
    return false;
  }
}

/**
 * Get spreadsheet for the current date or create a new one
 */
function getSpreadSheet(dateString) {
  var sheetName = dateString.split(",")[0];
  if (SpreadsheetApp.openById(ssId).getSheetByName(sheetName)) {
    return SpreadsheetApp.openById(ssId).getSheetByName(sheetName);
  }
  var spreadSheet = SpreadsheetApp.openById(ssId).insertSheet(sheetName);
  spreadSheet.appendRow(["ID", "CHAT_ID", "Name", "Location", "Date", "Mood", "Comment"]);
  return spreadSheet;
}

/**
 * Update location value or create a new raw for this user for the current date
 * Also, update heartbeat values in `People` spreadsheet. 
 * `Last location` marked with corresponding color based on location zone
 * `Last heartbeat` marked as GREEN value
 */
function appendLocation(username, chatId, name, location) {
  var date = toDateString(new Date());
  var spreadSheet = getSpreadSheet(date);
  var range = spreadSheet.createTextFinder(chatId).findAll();
  if (range.length) {
    var rawIndex = range[0].getRowIndex();
    var rangeIndex = "D" + rawIndex + ":E" + rawIndex;
    spreadSheet.getRange(rangeIndex).setValues([[location, date]]);
  } else {
    spreadSheet.appendRow([username, chatId, name, location, date]);
  }

  var peopleSpreadSheet = SpreadsheetApp.openById(ssId).getSheetByName(peopleSpreadsheet);
  var peopleRange = peopleSpreadSheet.createTextFinder(chatId).findAll();
  if (peopleRange.length) {
    var rawLocationIndex = peopleRange[0].getRowIndex();
    var rangeLocationIndex = "E" + rawLocationIndex;
    peopleSpreadSheet.getRange(rangeLocationIndex).setValue(location).setBackground(toBackground(location));
    var rawHeartbeatIndex = peopleRange[0].getRowIndex();
    var rangeHeartbeatIndex = "F" + rawHeartbeatIndex;
    peopleSpreadSheet.getRange(rangeHeartbeatIndex).setValue(date).setBackground(GREEN);
  }
}

/**
 * Update or add user mood
 */
function appendMood(chatId, mood) {
  var spreadSheet = getSpreadSheet(toDateString(new Date()));
  var range = spreadSheet.createTextFinder(chatId).findAll();
  if (range.length) {
    var rawIndex = range[0].getRowIndex();
    var rangeIndex = "F" + rawIndex + ":G" + rawIndex;
    spreadSheet.getRange(rangeIndex).setValues([[mood, ""]]);
  }
}

/**
 * Update or add user comment
 */
function appendComment(chatId, comment) {
  var spreadSheet = getSpreadSheet(toDateString(new Date()));
  var range = spreadSheet.createTextFinder(chatId).findAll();
  if (range.length) {
    var rawIndex = range[0].getRowIndex();
    var rangeIndex = "F" + rawIndex + ":G" + rawIndex;
    spreadSheet.getRange(rangeIndex).setValues([["", comment]]);
  }
}

/**
 * Start bot for adminChatId
 */
function doTest() {
  var stringBody = {
    "postData": {
      "contents": "{\"message\":{\"from\":{\"username\":\"username\"},\"text\":\"text\",\"chat\":{\"id\":\"" + adminChatId + "\",\"first_name\":\"First\",\"last_name\":\"Last\"}}}"
    }
  }
  doPost(stringBody);
}

/**
 * Get list of users from `People` spreadsheet with expired heartbeat and start bot for them
 */
function askStatus() {
  var today = toDateString(new Date()).split(" ")[0];
  var peopleSpreadSheet = SpreadsheetApp.openById(ssId).getSheetByName(peopleSpreadsheet);
  peopleSpreadSheet.getDataRange().getValues().slice(1).forEach(row => {
    if (!row.includes(today)) {
      var maybeChatId = row[1];
      if (maybeChatId.toString().length > 0) {
        respondWithKeyboard(maybeChatId, LOCATION_MESSAGE, locationsKeyboard);
      }
    }
  })
}

/**
 * Triggered by timer, set background to RED for heartbeats that were not updated today
 */
function markExpiredHeartbeats() {
  var today = toDateString(new Date()).split(" ")[0];
  var peopleSpreadSheet = SpreadsheetApp.openById(ssId).getSheetByName(peopleSpreadsheet);
  var rangeIndex = "F2:F" + peopleSpreadSheet.getLastRow();
  var range = peopleSpreadSheet.getRange(rangeIndex);
  var numRows = range.getNumRows();
  for (let i = 1; i <= numRows; i++) {
    var cell = range.getCell(i, 1);
    if (!cell.getValue().toString().includes(today)) {
      cell.setBackground(RED);
    }
  }
}

/**
 * Triggered by timer, reset heartbeat background for everyone at the end of the day, except if
 * heartbeat was marked as red, or if it was updated today
 */
function cleanUpHeartbeats() {
  var today = toDateString(new Date()).split(" ")[0];
  var peopleSpreadSheet = SpreadsheetApp.openById(ssId).getSheetByName(peopleSpreadsheet);
  var rangeIndex = "F2:F" + peopleSpreadSheet.getLastRow();
  var range = peopleSpreadSheet.getRange(rangeIndex);
  var numRows = range.getNumRows();
  for (let i = 1; i <= numRows; i++) {
    var cell = range.getCell(i, 1);
    if (cell.getBackground() != RED && !cell.getValue().toString().includes(today)) {
      cell.setBackground(null);
    }
  }
}

/**
 * Helpers
 */

/**
 * Create inline keyboard, data - two dimensional array
 */
function inlineKeyboard(data) {
  return {
    "inline_keyboard": data.map(group => {
      return group.map(button => ({
        "text": button,
        'callback_data': button
      }
      ))
    })
  }
}

/**
 * Date sting in UA timezone
 */
function toDateString(date) {
  return date.toLocaleString('en-GB', { timeZone: 'EET' })
}

/**
 * Get cell background based on location value
 */
function toBackground(location) {
  if (deepGreenZones.includes(location)) {
    return DEEP_GREEN;
  }
  if (greenZones.includes(location)) {
    return GREEN;
  }
  if (amberZones.includes(location)) {
    return AMBER;
  }
  return RED;
}

/**
 * Triggers, max allowed - 20
 */
function createTimeDrivenTriggers() {
  ScriptApp.getProjectTriggers()
    .forEach(trigger => ScriptApp.deleteTrigger(trigger));
  HOURS.forEach(hour =>
    DAYS.forEach(day => ScriptApp.newTrigger('askStatus')
      .timeBased()
      .onWeekDay(day)
      .atHour(hour)
      .create()
    )
  )
  ScriptApp.newTrigger('cleanUpHeartbeats')
    .timeBased()
    .everyDays(1)
    .atHour(CLEAN_UP_HOUR)
    .create()
  ScriptApp.newTrigger('markExpiredHeartbeats')
    .timeBased()
    .everyDays(1)
    .atHour(EXPIRATION_HOUR)
    .create()
}

/**
 * Technical
 */
function getMe() {
  var url = telegramUrl + "/getMe";
  var response = UrlFetchApp.fetch(url);
  Logger.log(response.getContentText());
}

function setWebhook() {
  var url = telegramUrl + "/setWebhook?url=" + webAppUrl;
  var response = UrlFetchApp.fetch(url);
  Logger.log(response.getContentText());
}

function doGet(e) {
  // write back to the user
  return HtmlService.createHtmlOutput("Hello there");
}
