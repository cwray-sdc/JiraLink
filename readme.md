# JiraLink

This is a Chrome extension to make JIRA ticket numbers clickable on GitHub.com

## Installation

-   Clone this repo to your desired location.
-   Open Chrome
-   Go to chrome://extensions/ in the search bar
-   Enable "Developer mode"
-   Click "Load unpacked"
-   Navigate to where you cloned the repo

# Usage

This will work for any Pull Request with the following format

WEBAPPS-XXXX: Description  
WEBAPPS-XXXX : Description  
WEBAPPS-XXXX - Description

Note: WEBAPPS is case-insensitive. SERVER is also supported by default.

# Extending to other teams

If you'd like to extend this to other teams you can add an item to local storage:

Key: JiraLinkProjects
Value: { "projects": ["YOUR PROJECT NAME"] }

