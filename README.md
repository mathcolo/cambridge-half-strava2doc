#Strava -> Google Sheets for the Cambridge Half
This repo contains some Google Apps Script files I used in integrating my weekly Strava running totals into a Google Sheet. It's for the [Cambridge Half](https://www.cambridgehalf.com/) on November 19, 2017.

##Data flow
* [Local USB, manual] Garmin Forerunner 15 -> Garmin Connect
* [Remote, automatic] Garmin Connect -> Strava
* [Remote, automatic via trigger] Strava -> Google Sheet (this repo)