# Heartbeat
Telegram bot that interrogates company employees and updates heartbeat table in Google sheets. 

## Idea
Because of war in Ukraine, we have to understand current status of all of our collegues, and if anything is happened with anyone, we cannot loose any time. Idea of this bot is to trigger company employees via simple telegram bot, so they can provide heartbeat update with current location, mood and optional comment. As a result, HR team (or anyone else within the company) will have a Google spreadsheet table with these updates. Collegues that missed these heartbeats will be highlighted and marked with proper status in spreadsheet.

## Flow
- Find telegram bot and init conversation
- Enter slack username (in our company we use slack, but any set of unique ids can be used. Idea is to match telegram usenames that can be unknown within the company with company known usernames. This is highly recommended, as company can extend `People` spreadsheet with additional data, like telephone number, so, if heartbeat is missed, anyone with an access to this spreadsheet could reach this person). This step will appear only on first run, until proper slack(?) username is provided
- Select location from one of predefined options
- Select your current mood or provide comment
- Heartbeat recorded.

## Flow results
- `People` spreadsheet will be updated. It will contain current location in `Last location` column and heartbeat dateTime in `Last heartbeat` column
- Script contains multiple time based triggers. As a result, all your collegues will receive at least 1 notification (at 10a.m.) from telegram bot, where they will have to select their location. If this notification was ignored, they will receive 2nd notification at 3p.m.. If collegue selected his location, cell with heartbeat timestamp will have green background. `Last location` cell background will be marked with corresponding color based on location zone
- If heartbeat was missed, at 4p.m. all `Last heartbeat` values will be updated with red background
- At 3a.m. all `Last heartbeat`, except marked as red, backgrounds will be reset.

## Location zones
- Red. Active war zone, or russian territory. Your collegues that are located in this zone require immediate relocation
- Yellow. Zone with high risk, explosions from time to time. Relocation is highly recommended
- Green. Zone inside Ukraine without any active war activities
- Deep green. Friendly countries for ukrainian citizens, almost any zone outside of Ukraine.

## Default configuration for triggers
- Reminders: Monday-Friday, 10a.m. and 3p.m.. Variables: `DAYS`, `HOURS`
- Heartbeat update check: Daily, 4p.m. Variables: `EXPIRATION_HOUR`
- Reset: 3a.m.. Variables: `CLEAN_UP_HOUR`.

## Default configuration for zones
- Red: Kyiv, Ukraine (Red). Variables: `redZones`.
- Amber: Odesa, Ukraine (Amber). Variables: `amberZones`.
- Green: Lviv, (Ukraine (Green)). Variables: `greenZones`.
- Deep green: Moldova, Romania, Georgia, Poland, Other. Variables: `deepGreenZones`.
Note: zones are used in `locations` variables as well - to create inline keyboard.


## Project setup
## Step 1: Create new telegram bot
- [Open telegram](https://web.telegram.org/k/)
- Find `@BotFather` bot
- Create new bot via `/newbot` command. Add provided token value to `token` varible of `Code.gs` file.

## Step 2: Prepare Google spreadsheet
- [Go to Google Sheets page](https://docs.google.com/spreadsheets/u/0/)
- Create new blank spreadsheet
- Rename default spreadsheet into `People`
- Copy first row from `People.csv` file example into 1st row of `People` spreadsheet
- Add slack usernames into `C` column (`SLACK_ID`) that will use this bot in the future. Note: slack username values should be in lower case
- Copy spreadsheet id (part of url, `https://docs.google.com/spreadsheets/d/{ID_IS_HERE}/edit`) into `ssid` variable.

## Step 3: Create and set up new Google Apps script
- [Go to App Scripts page](https://script.google.com/home)
- Click on `New project` button
- Past code into `Code.gs` pre-created file
- Deploy the code (Deploy->New deployment->Select type->Web app->Who can access(Anyone)->Deploy)
- Copy provided web app url and past it into `webAppUrl` variable
- Deploy updated code (Deploy->Manage deployments->Edit->New version->Deploy)
- Execute `getMe()`, `setWebhook()`, `createTimeDrivenTriggers()` functions to initialise integrations and create triggers
- Your bot is ready to go! Find it in telegram, share with collegues and start usage.
Note: Be aware that any Google app script has [limits and quotas](https://developers.google.com/apps-script/guides/services/quotas).
