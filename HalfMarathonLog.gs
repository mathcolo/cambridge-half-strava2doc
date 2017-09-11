var SPREADSHEET_ID_TESTER = "";
var SPREADSHEET_ID = "";
var SHEET_NAME = "Preston";
var service = getService_();

function getStravaSheet() {
  var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = spreadsheet.getSheetByName(SHEET_NAME);
  return sheet;
}

function dateToString(date) {
  var dd = date.getDate();
  var mm = date.getMonth() + 1; //January is 0!
  
  var yyyy = date.getFullYear();
  if(dd < 10){
    dd='0'+dd;
  } 
  if(mm < 10){
    mm='0'+mm;
  } 
  var dateString = mm +'/'+ dd +'/'+ yyyy;
  return dateString;
}

function getMondayForDate(date) {
  
  var monday = new Date(date.getTime());
  
  if(date.getDay() == 1) {
    //It's Monday
    return monday;
  }
  else if(date.getDay() == 0) {
    //It's Sunday
    monday.setDate(date.getDate() - 6);
    return monday;
  }
  else {
    //It's something else
    monday.setDate(date.getDate() - (date.getDay() - 1));
    return monday;
  }

}

function importToday() {
  
  var today = new Date();
  Logger.log("today is: " + today);

  var mondays = {};
  mondays['08/21/2017'] = [4,2];
  mondays['08/28/2017'] = [6,2];
  mondays['09/04/2017'] = [8,2];
  mondays['09/11/2017'] = [10,2];
  mondays['09/18/2017'] = [12,2];
  mondays['09/25/2017'] = [14,2];
  mondays['10/02/2017'] = [16,2];
  mondays['10/09/2017'] = [18,2];
  mondays['10/16/2017'] = [20,2];
  mondays['10/23/2017'] = [22,2];
  mondays['10/30/2017'] = [24,2];
  mondays['11/06/2017'] = [26,2];
  mondays['11/13/2017'] = [28,2];
  
  var pos = mondays[dateToString(getMondayForDate(today))];
  Logger.log("pos: " + pos);
  
  if(today.getDay() == 1) {
    //It's Monday
    Logger.log("It's Monday");
    //Do nothing
  }
  else if(today.getDay() == 0) {
    //It's Sunday
    Logger.log("It's Sunday");
    pos[1] += 6;
  }
  else {
    //It's something else
    Logger.log("It's something else");
    pos[1] += today.getDay() - 1;
  }
  
  var sheet = getStravaSheet();
  var range = sheet.getRange(pos[0], pos[1]);
  
  var midnight = new Date();
  midnight.setHours(0,0,0,0);

  var url = 'https://www.strava.com/api/v3/athlete/activities?after=' + midnight.getTime()/1000;
  var response = UrlFetchApp.fetch(url, {
    headers: {
      Authorization: 'Bearer ' + service.getAccessToken()
    }
  });
  
  var result = JSON.parse(response.getContentText());
  
  var sum = 0.0;
  for(i = 0; i < result.length; i++) {
    sum += result[0].distance * 0.000621371; //Convert from meters to miles with astounding accuracy
  }
  
  //Let it loose in the sheet!
  range.setValue(sum.toFixed(1));
  
  //Update the last updated row
  sheet.getRange(1,3).setValue(today.toString());
}
