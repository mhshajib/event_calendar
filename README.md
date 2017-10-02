# Event Calendar
Realtime custom event calendar with moment.js, socket-io, nodejs, express-js, mongodb and angularjs.

##### DEMO : http://34.224.106.211:3300

![Event Calendar screenshot](https://raw.githubusercontent.com/mhshajib/event_calendar/master/images/logo.png)

### Requirements
* nodejs
* npm
* mongodb

### Installation
* Clone repository using git
    ```bash
    $ git clone https://github.com/mhshajib/event_calendar.git
    ```
* Go to project directory
    ```bash
    $ cd event_calendar
    ```
* Install dependencies
    ```bash
    $ npm install
    ```
    If it's showing error try it as superuser
    ```bash
    $ sudo npm install
    ```
    It'll install all your required dependencies listed on package.json

### Testing and Run
* Before start please make sure you have mongodb istalled and running , if not run it using this command.
    ``` bash
    $ sudo service mongod start
    ```
* Let's test it before run
    ``` bash
    $ npm test
    ```
    If everything goes well it'll show you something like this.
    ![Event Calendar screenshot](https://raw.githubusercontent.com/mhshajib/event_calendar/master/images/unit_test.png)
* Run application
    ``` bash
    $ npm start
    ```
    Your realtime event calendar is ready to use.
### USAGE
* Go to your browser go to http://localhost:3300
    You'll get your calendar of current date and it'll look like this.
    ![Event Calendar screenshot](https://raw.githubusercontent.com/mhshajib/event_calendar/master/images/calendar.png)
* At top right corner there are next and previous buttons, which are used to navigate the month.
* At top right corder of each date there is a plus button, which is used to create an event on that specific date.
* Now enter the " Title " and " Description " of your event and save it.
    ![Event Calendar screenshot](https://raw.githubusercontent.com/mhshajib/event_calendar/master/images/create.png)    
* After saving ther are three buttons on every event, which are view, edit and delete.
    ![Event Calendar screenshot](https://raw.githubusercontent.com/mhshajib/event_calendar/master/images/created.png)
* Clicking on the eye icon it'll show you the event in view mode.
    ![Event Calendar screenshot](https://raw.githubusercontent.com/mhshajib/event_calendar/master/images/view.png)
* Clicking on the pencil icon it'll show you the event in edit mode, so here you can change the title and description and update it.
    ![Event Calendar screenshot](https://raw.githubusercontent.com/mhshajib/event_calendar/master/images/edit.png)
* Clicking on the trash icon it'll show you a confirm prompt and if you click yes then it'll remove the event from this day.
    ![Event Calendar screenshot](https://raw.githubusercontent.com/mhshajib/event_calendar/master/images/delete.png)
#### This Calendar is a realtime calendar so you can open it in multiple browser and if you make any operation(create, edit, delete) at any date then it'll reflect immediately on all other browsers.
### **License**
The **event_calendar** is a open-source software licensed under the MIT License.
