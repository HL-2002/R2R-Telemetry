# Context

## Introduction
The `context` Folder of the R2R-Telemetry application is responsible for managing the application's state and providing it to the components. Using zustand to allow components to access and update the shared state without passing props through multiple levels of the component tree.

library   [zustand](https://zustand-demo.pmnd.rs/)

## Files 

### SelectionContext.js

This file contains the `SelectionContext` which is responsible for managing the Axis and the selected data points. It provides the following

[SelectionContext.js](../context/SelectionContext.js)

### SessionContext.js

This file contains the `SessionContext` which is responsible for managing the session data.
including the following:


- `session` - The current session data
-  `Runs` - The list of runs of the current session
-  `Entries` - The list of entries of all selected runs

[SessionContext.js](SessionContext.js)




