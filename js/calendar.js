const WEEKDAY_NAME = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

window.onload = function(){
    document.getElementById("calendar-month-year").innerHTML = new Date().toLocaleDateString("en-US", {month: "long", year: "numeric"});
    document.getElementById("calendar-dates").appendChild(getCalendarTable());
    addEventClickOnDays();
    clickCurrentDay();
    saveClick();
    deleteClick();
}

/**
 * Controls the two buttons according to the selectedDay data
 * @param {*} selectedDay 
 */
const controlButtons = function(selectedDay) {
    if (selectedDay.hasAttribute("data")) {
        document.getElementById("save-appointment").innerHTML = "Update";
        document.getElementById("delete-appointment").disabled = false;
    } else {
        document.getElementById("save-appointment").innerHTML = "Insert";
        document.getElementById("delete-appointment").disabled = true;
    }
};

/**
 * Adds a click event to save button, add appointment-text class to the selected day in calendar and saves the appointment subject in a data attribute
 */
const saveClick = function() {
    document.getElementById("save-appointment").addEventListener("click", function() {
        let selectedDay = document.getElementById(document.getElementById("date-id").value);

        //add class to show that there is an appointment in this day
        selectedDay.classList.add("calendar-appointment");

        //put an attribute in the day with the subject of the appointment, to retrieve later
        let appointmentText = document.createAttribute("data");
        appointmentText.value = document.getElementById("appointment-text").value;
        selectedDay.setAttributeNode(appointmentText);

        controlButtons(selectedDay);
    });
};

/**
 * Removes the calendar-appointment class and the data attribute from the selected day
 */
const deleteClick = function() {
    document.getElementById("delete-appointment").addEventListener("click", function() {
        let selectedDay = document.getElementById(document.getElementById("date-id").value);
        selectedDay.classList.remove("calendar-appointment");
        selectedDay.removeAttribute("data");
        document.getElementById("appointment-text").value = "";
        
        controlButtons(selectedDay);
    });
}

/**
 * Simulates the click event in the current day
 */
const clickCurrentDay = function() {
    let clickEvent = document.createEvent("Event");
    clickEvent.initEvent("click");
    document.getElementById("day" + new Date().getDate()).dispatchEvent(clickEvent);
};

/**
 * Adds click event to the days in the calendar, shows the selected day in the appointment container, retrieve data from saved appointment of the day
 * and sets calendar-selected class to show which day was selected
 */
const addEventClickOnDays = function() {
    let days = document.getElementsByClassName("calendar-day");    
    // for (let i in days) {
    for (let i = 0; i < days.length ; i++) {
        days[i].addEventListener("click", function() {
            let d = new Date();
            d.setDate(days[i].innerHTML);
            document.getElementById("appointment-date").innerHTML = d.toLocaleDateString("en-US", {month: "long", day: "numeric", year: "numeric"});
            document.getElementById("date-id").value = days[i].id;

            //retrieve data
            if (days[i].hasAttribute("data")) {
                document.getElementById("appointment-text").value = days[i].getAttribute("data");
            } else {
                document.getElementById("appointment-text").value = "";
            }
            document.getElementById("appointment-text").focus();

            removeSelectedClassFromOtherDay();
            this.classList.add("calendar-selected");

            controlButtons(days[i]);

        });
    }
};

/**
 * Removes the class from other days, only one day can be selected
 */
const removeSelectedClassFromOtherDay = function() {
    let removeClass = document.querySelectorAll("td.calendar-selected");
    for (let j = 0; j < removeClass.length ; j++) {
        removeClass[j].classList.remove("calendar-selected");
    }
};

/**
 * Creates the calendar of the current month
 */
const getCalendarTable = function() {
    let tableTag = document.createElement("table");

    tableTag.appendChild(getCalendarTableHead());
    tableTag.appendChild(getCalendarTableBody());

    return tableTag;
};

/**
 * Creates the head of the calendar table with the weekdays
 */
const getCalendarTableHead = function() {
    let theadTag = document.createElement("thead");
    let trTag = document.createElement("tr");

    for (let weekday in WEEKDAY_NAME) {
        let tdTag = document.createElement("td");
        tdTag.innerHTML = WEEKDAY_NAME[weekday];
        trTag.appendChild(tdTag);
    }

    theadTag.appendChild(trTag);
    return theadTag;
};

/**
 * Creates the calendar body with the days of the current month divided by the weekdays.
 * Sets calendar-inactive class to past days.
 * Sets calendar-day class to current and future days.
 */
const getCalendarTableBody = function() {
    let tbodyTag = document.createElement("tbody");
    let trTag;
    let currentDate = new Date();
    let date = new Date();
    date.setDate(1);
    const actualMonth = date.getMonth();
    const weekdayOfFirstDay = WEEKDAY_NAME.indexOf( date.toDateString().substring(0, 3) );
    let startCountingDays = false;
    let weekday = 0;

    while (actualMonth == date.getMonth() && weekday < 7) {
        if (weekday == 0) {
            //start new tr
            trTag = document.createElement("tr");
        }

        if (!startCountingDays && weekday == weekdayOfFirstDay) {
            //begin to write days
            startCountingDays = true;
        }

        if (!startCountingDays) {
            //write blank td because this weekday is not the begin of the month
            trTag.appendChild(document.createElement("td"));
            weekday++;
            continue;
        }

        //write day
        let tdTag = document.createElement("td");
        tdTag.innerHTML = date.getDate();

        if (date.getDate() >= currentDate.getDate()) {
            tdTag.className = "calendar-day";
        } else {
            //disable past days
            tdTag.className = "calendar-inactive";        
        }

        tdTag.id = "day" + date.getDate();
        trTag.append(tdTag);

        //increment date and weekday
        date.setDate( date.getDate() + 1 );
        weekday++;

        if (actualMonth != date.getMonth() && weekday != 7) {
            //write remaining spaces with blank tds
            for (;weekday < 7; weekday++) {
                trTag.appendChild(document.createElement("td"));
            }
        }

        if (weekday == 7) {
            //begin a new tr
            weekday = 0;
            tbodyTag.appendChild(trTag);
        }
    }

    return tbodyTag;
};