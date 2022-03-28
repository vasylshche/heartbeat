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
// message
var PROPER_ID_MESSAGE = "Welcome";
var WRONG_ID_MESSAGE = "Unknown user. Please try again";
var GOODBYE_MESSAGE = "Heartbeat updated. Thank you";

// messages, used as quote for replies
var SLACK_ID_MESSAGE = "Provide you slack username, `@doe.john`";
var PROVIDE_YOUR_LOCATION_MESSAGE = "Provide your current location";
var LOCATION_UPDATED_MESSAGE = "Updated. Select your current mood";
var COUNTRY_SELECT_MESSAGE = "Select your country";
var REGION_SELECT_MESSAGE = "Select your region";
var CITY_SELECT_MESSAGE = "Select your city";
var COMMENT_MESSAGE = "Enter your comment you want to provide";
var MOOD_MESSAGE = "Select your current mood";

// buttons
var USE_LAST_BUTTON = "Use last location";
var UPDATE_BUTTON = "Update my location";
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
// countries

var countries = {
  "UKRAINE": {
    "name": "Ukraine",
    "id": "UKRAINE_COUNTRY",
    "zone": RED,
    "regions": {
      "WEST": {
        "name": "West",
        "id": "WEST_REGION",
        "zone": GREEN,
        "cities": {
          "LVIV": {
            "name": "Lviv Region",
            "id": "LVIV_CITY",
            "zone": GREEN
          },
          "IVANO_FRANKIVSK": {
            "name": "Ivano-Frankivsk Region",
            "id": "IVANO_FRANKIVSK_CITY",
            "zone": GREEN
          },
          "KHMELNYTSKYI": {
            "name": "Khmelnytskyi",
            "id": "KHMELNYTSKYI_CITY",
            "zone": GREEN
          },
          "LUTSK": {
            "name": "Lutsk",
            "id": "LUTSK_CITY",
            "zone": GREEN
          },
          "TERNOPIL": {
            "name": "Ternopil",
            "id": "TERNOPIL_CITY",
            "zone": GREEN
          },
          "CHERNIVTSI": {
            "name": "Chernivtsi",
            "id": "CHERNIVTSI_CITY",
            "zone": GREEN
          },
          "OTHER_WEST": {
            "name": "Other",
            "id": "OTHER_WEST_CITY",
            "zone": GREEN
          }
        }
      },
      "SOUTH": {
        "name": "South",
        "id": "SOUTH_REGION",
        "zone": AMBER,
        "cities": {
          "ODESA": {
            "name": "Odesa",
            "id": "ODESA_CITY",
            "zone": AMBER
          },
          "KHERSON": {
            "name": "Kherson",
            "id": "KHERSON_CITY",
            "zone": RED
          },
          "MYKOLAIV": {
            "name": "Mykolaiv",
            "id": "MYKOLAIV_CITY",
            "zone": RED
          },
          "MARIUPOL": {
            "name": "Mariupol",
            "id": "MARIUPOL_CITY",
            "zone": RED
          },
          "OTHER_SOUTH": {
            "name": "Other",
            "id": "OTHER_SOUTH_CITY",
            "zone": AMBER
          }
        }
      },
      "CENTER": {
        "name": "Center",
        "id": "CENTER_REGION",
        "zone": AMBER,
        "cities": {
          "KYIV": {
            "name": "Kyiv",
            "id": "KYIV_CITY",
            "zone": RED
          },
          "KIROVOGRAD": {
            "name": "Kirovograd",
            "id": "KIROVOGRAD_CITY",
            "zone": AMBER
          },
          "KRYVYY_RIH": {
            "name": "Kryvyi Rih",
            "id": "KRYVYY_RIH_CITY",
            "zone": AMBER
          },
          "VINNYTSIA": {
            "name": "Vinnytsia",
            "id": "VINNYTSIA_CITY",
            "zone": AMBER
          },
          "OTHER_CENTER": {
            "name": "Other",
            "id": "OTHER_CENTER_CITY",
            "zone": AMBER
          }
        }
      },
      "EAST": {
        "name": "East",
        "id": "EAST_REGION",
        "zone": RED,
        "cities": {
          "DNIPRO": {
            "name": "Dnipro",
            "id": "DNIPRO_CITY",
            "zone": AMBER
          },
          "KHARKIV": {
            "name": "Kharkiv",
            "id": "KHARKIV_CITY",
            "zone": RED
          },
          "ZAPORIZHZHIA": {
            "name": "Zaporizhzhia",
            "id": "ZAPORIZHZHIA_CITY",
            "zone": AMBER
          },
          "OTHER_EAST": {
            "name": "Other",
            "id": "OTHER_EAST_CITY",
            "zone": AMBER
          }
        }
      }
    }
  },
  "POLAND": {
    "name": "Poland",
    "id": "POLAND_COUNTRY",
    "zone": DEEP_GREEN,
    "cities": {
      "WARSAW": {
        "name": "Warsaw",
        "id": "WARSAW_CITY",
        "zone": DEEP_GREEN
      },
      "WROCLAW": {
        "name": "Wroclaw",
        "id": "WROCLAW_CITY",
        "zone": DEEP_GREEN
      },
      "LODZ": {
        "name": "Lodz",
        "id": "LODZ_CITY",
        "zone": DEEP_GREEN
      },
      "KATOWICE": {
        "name": "Katowice",
        "id": "KATOWICE_CITY",
        "zone": DEEP_GREEN
      },
      "OTHER_POLAND": {
        "name": "Other",
        "id": "OTHER_POLAND_CITY",
        "zone": DEEP_GREEN
      }
    }
  },
  "GEORGIA": {
    "name": "Georgia",
    "id": "GEORGIA_COUNTRY",
    "zone": DEEP_GREEN
  },
  "BULGARIA": {
    "name": "Bulgaria",
    "id": "BULGARIA_COUNTRY",
    "zone": DEEP_GREEN
  },
  "TURKEY": {
    "name": "Turkey",
    "id": "TURKEY_COUNTRY",
    "zone": DEEP_GREEN
  },
  "BELARUS": {
    "name": "Belarus",
    "id": "BELARUS_COUNTRY",
    "zone": AMBER
  },
  "GERMANY": {
    "name": "Germany",
    "id": "GERMANY_COUNTRY",
    "zone": DEEP_GREEN
  },
  "MOLDOVA": {
    "name": "Moldova",
    "id": "MOLDOVA_COUNTRY",
    "zone": DEEP_GREEN
  },
  "SPAIN": {
    "name": "Spain",
    "id": "SPAIN_COUNTRY",
    "zone": DEEP_GREEN
  },
  "USA": {
    "name": "USA",
    "id": "USA_COUNTRY",
    "zone": DEEP_GREEN
  },
  "UK": {
    "name": "UK",
    "id": "UK_COUNTRY",
    "zone": DEEP_GREEN
  },
  "CZECH": {
    "name": "Czech Republic",
    "id": "CZECH_COUNTRY",
    "zone": DEEP_GREEN
  },
  "OTHER_COUNTRY": {
    "name": "Other",
    "id": "OTHER_COUNTRY",
    "zone": DEEP_GREEN
  }
}

/**
* Keyboards
*/
var addOrUpdateKeyboardTemplate = [
  [{ id: USE_LAST_BUTTON, name: USE_LAST_BUTTON }, { id: UPDATE_BUTTON, name: UPDATE_BUTTON }],
]

var countriesKeyboardTemplate = [
  [countries.UKRAINE, countries.POLAND, countries.GEORGIA],
  [countries.BULGARIA, countries.TURKEY, countries.BELARUS],
  [countries.GERMANY, countries.MOLDOVA, countries.SPAIN],
  [countries.USA, countries.UK, countries.CZECH],
  [countries.OTHER_COUNTRY]
];

var regionsKeyboardTemplate = [
  [countries.UKRAINE.regions.WEST, countries.UKRAINE.regions.EAST],
  [countries.UKRAINE.regions.CENTER, countries.UKRAINE.regions.SOUTH]
];

var westCitiesKeyboardTemplate = [
  [countries.UKRAINE.regions.WEST.cities.LVIV, countries.UKRAINE.regions.WEST.cities.IVANO_FRANKIVSK],
  [countries.UKRAINE.regions.WEST.cities.KHMELNYTSKYI, countries.UKRAINE.regions.WEST.cities.LUTSK, countries.UKRAINE.regions.WEST.cities.TERNOPIL],
  [countries.UKRAINE.regions.WEST.cities.CHERNIVTSI, countries.UKRAINE.regions.WEST.cities.OTHER_WEST],
];

var southCitiesKeyboardTemplate = [
  [countries.UKRAINE.regions.SOUTH.cities.ODESA, countries.UKRAINE.regions.SOUTH.cities.KHERSON, countries.UKRAINE.regions.SOUTH.cities.MYKOLAIV],
  [countries.UKRAINE.regions.SOUTH.cities.MARIUPOL, countries.UKRAINE.regions.SOUTH.cities.OTHER_SOUTH]
];

var centerCitiesKeyboardTemplate = [
  [countries.UKRAINE.regions.CENTER.cities.KYIV, countries.UKRAINE.regions.CENTER.cities.KIROVOGRAD, countries.UKRAINE.regions.CENTER.cities.KRYVYY_RIH],
  [countries.UKRAINE.regions.CENTER.cities.VINNYTSIA, countries.UKRAINE.regions.CENTER.cities.OTHER_CENTER]
];

var eastCitiesKeyboardTemplate = [
  [countries.UKRAINE.regions.EAST.cities.DNIPRO, countries.UKRAINE.regions.EAST.cities.KHARKIV],
  [countries.UKRAINE.regions.EAST.cities.ZAPORIZHZHIA, countries.UKRAINE.regions.EAST.cities.OTHER_EAST]
];

var polishCitiesKeyboardTemplate = [
  [countries.POLAND.cities.WARSAW, countries.POLAND.cities.WROCLAW, countries.POLAND.cities.LODZ],
  [countries.POLAND.cities.KATOWICE, countries.POLAND.cities.OTHER_POLAND]
];

var moods = [
  [
    { id: "good_mood", name: ":)" },
    { id: "neutral_mood", name: ":|" },
    { id: "bad_mood", name: ":(" },
    { id: COMMENT_BUTTON, name: COMMENT_BUTTON }
  ]
];

var addOrUpdateKeyboard = inlineKeyboard(addOrUpdateKeyboardTemplate);
var countriesKeyboard = inlineKeyboard(countriesKeyboardTemplate);
var regionsKeyboard = inlineKeyboard(regionsKeyboardTemplate);
var westCitiesKeyboard = inlineKeyboard(westCitiesKeyboardTemplate);
var southCitiesKeyboard = inlineKeyboard(southCitiesKeyboardTemplate);
var centerCitiesKeyboard = inlineKeyboard(centerCitiesKeyboardTemplate);
var eastCitiesKeyboard = inlineKeyboard(eastCitiesKeyboardTemplate);
var polishCitiesKeyboard = inlineKeyboard(polishCitiesKeyboardTemplate);
var moodsKeyboard = inlineKeyboard(moods);

/**
 * Entry point
 */
function doPost(e) {
  try {
    var contents = JSON.parse(e.postData.contents);
    if (contents.callback_query) { // user pressed some button via inline keyboard
      var callbackContent = contents.callback_query
      var chatId = callbackContent.message.chat.id;
      var username = callbackContent.from.username;
      if (callbackContent.data.includes("_COUNTRY")) { // user choose country 
        var countryId = callbackContent.data;
        var countryObject = Object.values(countries).find(country => country.id == countryId)
        if (countryObject.regions) { // it does contain regions
          switch (countryId) {
            case countries.UKRAINE.id: // only for UA regions are defined for now
              respondWithKeyboard(chatId, REGION_SELECT_MESSAGE, regionsKeyboard);
              break;
          }
        } else if (countryObject.cities) {// it does contain cities
          switch (countryId) {
            case countries.POLAND.id: // only for PL cities are defined for now
              respondWithKeyboard(chatId, CITY_SELECT_MESSAGE, polishCitiesKeyboard);
              break;
          }
        } else { // it doesn't contain anything predefined
          var name = callbackContent.from.first_name + " " + callbackContent.from.last_name;
          appendLocation(username, chatId, name, countryObject.name, countryObject.zone);
          respondWithKeyboard(chatId, MOOD_MESSAGE, moodsKeyboard);
        }
      } else if (callbackContent.data.includes("_REGION")) { // user choose region
        var regionId = callbackContent.data;
        switch (regionId) {
          case countries.UKRAINE.regions.CENTER.id:
            respondWithKeyboard(chatId, CITY_SELECT_MESSAGE, centerCitiesKeyboard);
            break;
          case countries.UKRAINE.regions.EAST.id:
            respondWithKeyboard(chatId, CITY_SELECT_MESSAGE, eastCitiesKeyboard);
            break;
          case countries.UKRAINE.regions.WEST.id:
            respondWithKeyboard(chatId, CITY_SELECT_MESSAGE, westCitiesKeyboard);
            break;
          case countries.UKRAINE.regions.SOUTH.id:
            respondWithKeyboard(chatId, CITY_SELECT_MESSAGE, southCitiesKeyboard);
            break;
        }
      } else if (callbackContent.data.includes("_CITY")) {// user choose city
        var name = callbackContent.from.first_name + " " + callbackContent.from.last_name;
        var cityObject = cityObjectById(callbackContent.data);
        appendLocation(username, chatId, name, cityObject.name, cityObject.zone);
        respondWithKeyboard(chatId, MOOD_MESSAGE, moodsKeyboard);
      } else if (callbackContent.data.includes("_mood")) { // user provided his mood
        var mood = moods
          .map(buttons => buttons.find(button => button.id == callbackContent.data).name)
          .find(maybeMood => maybeMood); // todo: update
        appendMood(chatId, mood);
        respond(chatId, GOODBYE_MESSAGE);
      } else if (callbackContent.data == COMMENT_BUTTON) { // user decided to provide comment
        reply(chatId, COMMENT_MESSAGE);
      } else if (callbackContent.data == USE_LAST_BUTTON) { // user decided to use his previous location
        updateLocation(chatId);
        respondWithKeyboard(chatId, MOOD_MESSAGE, moodsKeyboard);
      } else if (callbackContent.data == UPDATE_BUTTON) { // user decided to add new location
        respondWithKeyboard(chatId, COUNTRY_SELECT_MESSAGE, countriesKeyboard);
      } else { // user provided everything
        respond(chatId, GOODBYE_MESSAGE);
      }
    } else if (contents.message.reply_to_message) { // replies
      if (contents.message.reply_to_message.text == COMMENT_MESSAGE) { // user provided comment instead of mood selection
        var chatId = contents.message.reply_to_message.chat.id;
        appendComment(chatId, contents.message.text);
        respond(chatId, GOODBYE_MESSAGE);
      } else if (contents.message.reply_to_message.text == SLACK_ID_MESSAGE) { // user provided his slack id
        var chatId = contents.message.reply_to_message.chat.id;
        var slackId = contents.message.text;
        var username = contents.message.from.username;
        if (saveUsername(chatId, slackId, username)) { // slack id was found and associated with chatId
          respond(chatId, PROPER_ID_MESSAGE);
          respondWithKeyboard(chatId, COUNTRY_SELECT_MESSAGE, countriesKeyboard);
        } else { // slack id was not found, so retry
          respond(chatId, WRONG_ID_MESSAGE);
          reply(chatId, SLACK_ID_MESSAGE)
        }
      }
    } else { // any not expected text inputs or /start
      var chatId = contents.message.chat.id;
      if (isUserKnown(chatId)) { // if user known, proceed
        if (isLastLocationKnown(chatId)) { // if user once provided his location, he is able to update heartbeat time without reentering all of the info
          respondWithKeyboard(chatId, PROVIDE_YOUR_LOCATION_MESSAGE, addOrUpdateKeyboard);
        } else { // only on 1st usage, as user doesnt have heartbeat history yet
          respondWithKeyboard(chatId, COUNTRY_SELECT_MESSAGE, countriesKeyboard);
        }
      } else { // if user unknown, ask for slackId
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
 * Check whether `People` spreadsheet contains last location of this user
 */
function isLastLocationKnown(chatId) {
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
function appendLocation(username, chatId, name, location, background) {
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
    peopleSpreadSheet.getRange(rangeLocationIndex).setValue(location).setBackground(background);
    var rawHeartbeatIndex = peopleRange[0].getRowIndex();
    var rangeHeartbeatIndex = "F" + rawHeartbeatIndex;
    peopleSpreadSheet.getRange(rangeHeartbeatIndex).setValue(date).setBackground(GREEN);
  }
}

/**
 * Location was not changed since last heartbeat, just update heartbeat dateTime
 */
function updateLocation(chatId) {
  var peopleSpreadSheet = SpreadsheetApp.openById(ssId).getSheetByName(peopleSpreadsheet);
  var peopleRange = peopleSpreadSheet.createTextFinder(chatId).findAll();
  if (peopleRange.length) {
    var date = toDateString(new Date());
    var indexPeople = peopleRange[0].getRowIndex();
    var username = peopleSpreadSheet.getRange("A" + indexPeople).getValue();
    var name = peopleSpreadSheet.getRange("D" + indexPeople).getValue();
    var lastLocation = peopleSpreadSheet.getRange("E" + indexPeople).getValue();
    peopleSpreadSheet.getRange("F" + indexPeople).setValue(date).setBackground(GREEN);
    var spreadSheet = getSpreadSheet(date);
    var range = spreadSheet.createTextFinder(chatId).findAll();
    if (range.length) {
      var indexDate = range[0].getRowIndex();
      spreadSheet.getRange("D" + indexDate + ":E" + indexDate).setValues([[lastLocation, date]]);
    } else {
      spreadSheet.appendRow([username, chatId, name, lastLocation, date]);
    }
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
        respondWithKeyboard(maybeChatId, PROVIDE_YOUR_LOCATION_MESSAGE, addOrUpdateKeyboard);
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
 * Create inline keyboard, data - two dimensional array of object with `id` and `name` fields
 */
function inlineKeyboard(data) {
  return {
    "inline_keyboard": data.map(group => {
      return group.map(button => ({
        "text": button.name,
        'callback_data': button.id
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
 * Get city by city id
 */
function cityObjectById(id) {
  return Object.values(countries).map(country => {
    if (country.regions) {
      return Object.values(country.regions).map(region => {
        return Object.values(region.cities)
      });
    }
    if (country.cities) {
      return Object.values(country.cities);
    }
  }).flat(3)
    .find(maybeCity => maybeCity && maybeCity.id == id)
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
