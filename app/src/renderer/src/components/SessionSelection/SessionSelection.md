# Session Selection Component
Since this is a component with multiple functionalities, it has been decided to divide it into different parts to minimize the complexity of each one.

## Session Selection
Being this the main Component, it is responsible for displaying the Dialog and the button that activates it. In addition, it is also responsible for managing the
state of the Dialog and the information rendered in it.

having as main state the current page (Interface rendered in the Dialog) whose default value is 0 (Menu interface)

## MenuPage
Being this the first page of the Dialog, it is responsible for showing the available options and changing from one page (interface) to another
according to the selected option.

## NewSession
Being this the second page of the Dialog, it is responsible for displaying the form to create a new session and manage the information
entered in it, making the necessary validations and uploads to the db.

## LoadSession
Being this the third page of the Dialog and the fourth since having similar functionalities the component was reused

- 3 page: It is responsible for displaying the sessions saved in the db and loading the selected session.
- 4 page: It is responsible for displaying the sessions saved in the db and deleting the selected session.
the component achieves this through the props it receives, as these change the functionality of the component