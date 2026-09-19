
import dayjs from 'dayjs';

function LocalDate() {
    var utc = require("dayjs/plugin/utc");

    dayjs.extend(utc);

    // default local time
    dayjs().format(); //2019-03-06T17:11:55+08:00

    // UTC mode
    dayjs.utc().format(); // 2019-03-06T09:11:55Z

    // convert local time to UTC time
    dayjs().utc().format(); // 2019-03-06T09:11:55Z

    // While in UTC mode, all display methods will display in UTC time instead of local time.
    // And all getters and setters will internally use the Date#getUTC* and Date#setUTC* methods instead of the Date#get* and Date#set* methods.
    dayjs.utc().isUTC(); // true
    return dayjs.utc().local().format("YYYY-MM-DD"); //2019-03-06T17:11:55+08:00
};
function LocalTime(format=null) {
    var utc = require("dayjs/plugin/utc");

    dayjs.extend(utc);

    // default local time
    dayjs().format(); //2019-03-06T17:11:55+08:00

    // UTC mode
    dayjs.utc().format(); // 2019-03-06T09:11:55Z

    // convert local time to UTC time
    dayjs().utc().format(); // 2019-03-06T09:11:55Z

    // While in UTC mode, all display methods will display in UTC time instead of local time.
    // And all getters and setters will internally use the Date#getUTC* and Date#setUTC* methods instead of the Date#get* and Date#set* methods.
    dayjs.utc().isUTC(); // true
    return dayjs.utc().local().format(format === null ?  "HH:mm:ss":format); //2019-03-06T17:11:55+08:00
};
function LocalDateTime() {
    var utc = require("dayjs/plugin/utc");

    dayjs.extend(utc);

    // default local time
    dayjs().format(); //2019-03-06T17:11:55+08:00

    // UTC mode
    dayjs.utc().format(); // 2019-03-06T09:11:55Z

    // convert local time to UTC time
    dayjs().utc().format(); // 2019-03-06T09:11:55Z

    // While in UTC mode, all display methods will display in UTC time instead of local time.
    // And all getters and setters will internally use the Date#getUTC* and Date#setUTC* methods instead of the Date#get* and Date#set* methods.
    dayjs.utc().isUTC(); // true
    return dayjs.utc().local().format("YYYY-MM-DD, hh:mm A "); //2019-03-06T17:11:55+08:00
};
function UTC_LocalDateTime(value,format=null) {
    var utc = require("dayjs/plugin/utc");
    
    dayjs.extend(utc);

    // default local time
    dayjs().format(); //2019-03-06T17:11:55+08:00

    // UTC mode
    dayjs.utc().format(); // 2019-03-06T09:11:55Z

    // convert local time to UTC time
    dayjs().utc().format(); // 2019-03-06T09:11:55Z

    // While in UTC mode, all display methods will display in UTC time instead of local time.
    // And all getters and setters will internally use the Date#getUTC* and Date#setUTC* methods instead of the Date#get* and Date#set* methods.
    dayjs.utc().isUTC(); // true

    return dayjs(value).utc().local().format(format === null ? "YYYY-MM-DD, hh:mm A ":format); //2019-03-06T17:11:55+08:00
};

function UTC_LocalDateTime_relative(value) {
    var relativeTime = require("dayjs/plugin/relativeTime");
    var utc = require("dayjs/plugin/utc");
    dayjs.extend(relativeTime);   
    dayjs.extend(utc);
    return dayjs.utc(value).local().fromNow();
    //return dayjs(UTC_LocalDateTime(value)).fromNow(); //2019-03-06T17:11:55+08:00
};

function get_Date(value,format) {
    return dayjs.utc(value).format(format); //2019-03-06T17:11:55+08:00
};

const firstDateOfMonth = (date = new Date()) =>
    new Date(date.getFullYear(), date.getMonth(), 1);

const lastDateOfMonth = (date = new Date()) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0);

function get_firstDateOfMonth(date,format='YYYY-MM-DD') {
   return dayjs.utc(date.getFullYear(), date.getMonth(), 1).format(format);;
}

function get_lastDateOfMonth(date,format='YYYY-MM-DD') {
   return dayjs.utc(date.getFullYear(), date.getMonth() + 1, 0).format(format);;
}

function get_lastDaysDate(date,days, format = 'YYYY-MM-DD') {
    return dayjs.utc(date).subtract(days, 'day').format(format);
}

function getDay(date,short=false) {
    let weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    if(short)
     weekdays = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];
    const dayNum = dayjs(get_Date(date, 'YYYY-MM-DD')).get('day');
    return weekdays[dayNum];
}
function getMonthName (monthNumber) {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Convert string/number to integer
  const index = parseInt(monthNumber, 10) - 1;

  // Return month name if valid, else empty string
  return months[index] || "";
};

export { LocalDate, LocalTime, LocalDateTime, UTC_LocalDateTime, firstDateOfMonth, lastDateOfMonth,get_firstDateOfMonth,get_lastDateOfMonth, UTC_LocalDateTime_relative, get_Date ,getDay,getMonthName,get_lastDaysDate}