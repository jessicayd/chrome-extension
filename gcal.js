let calendarIds = [];
let colors = [];
let sortedMap = new Map();

let isSignedIn = false;
if (localStorage.getItem('gcal-signed-in') == "true") isSignedIn = true;


function getEvents () {
  chrome.identity.getAuthToken({interactive: true}, function(token) {

    if (chrome.runtime.lastError) {
      return;
    }
  
    console.log("Authentication successful. Token:", token);
    isSignedIn = true;
    localStorage.setItem('gcal-signed-in',"true");
  
    var init = {
      method: 'GET',
      async: true,
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      'contentType': 'json'
    };

    fetchEvents(init)

  })}

  function fetchEvents(init) {
    // getting all calendars
    fetch(`https://www.googleapis.com/calendar/v3/users/me/calendarList`, init)
    .then(response => response.json())
    .then(calendarListData => {
      console.log("Calendar List Data:", calendarListData);
      // getting ids
      calendarIds = calendarListData.items.map(calendar => calendar.id);
      colors = calendarListData.items.map(calendar => calendar.backgroundColor);

      const now = new Date();
      const isoNow = now.toISOString();
      const twoWeeksLater = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
      const timeMax = twoWeeksLater.toISOString();
      let email = "";

      const fetchPromises = [];
      let events = new Map();

      // getting most top recent events of each calendar
      for (let i=0; i<calendarIds.length; i++) {
        if (calendarListData.items[i].primary == true) email = calendarListData.items[i].summary;
        if (calendarListData.items[i].selected != true) continue;

        console.log(email)
        let url = `https://www.googleapis.com/calendar/v3/calendars/${calendarIds[i]}/events?&singleEvents=${true}&timeMin=${isoNow}&timeMax=${timeMax}`
        
        const fetchPromise = fetch(url, init)
        .then((response) => response.json())
        .then((data) => {
          if (data.items) {
            data.items.forEach((event) => {
              let startDate;
              let endDate;
              let startTime
              let endTime;
              if (event.start.dateTime) {
                // Timed event
                const dateTimeStart = event.start.dateTime.split('T');
                const dateTimeEnd = event.end.dateTime.split('T');
                startDate = dateTimeStart[0];
                endDate = dateTimeEnd[0];
                startTime = dateTimeStart[1].substring(0, 5);
                endTime = dateTimeEnd[1].substring(0, 5);
    
            } else if (event.start.date) {
                // All-day event
                startDate = event.start.date;
                endDate = event.end.date;
                startTime = null;
                endTime = null;
            }
        
              const location = event.location; 
              const color = colors[i];
              
              // trim gets rid of leading and trailing white space/commas
              events.set([startDate, startTime, endDate, endTime], [event.summary.trim(),location, color]);
            });
            i++;
          } else {
            console.log("No upcoming events found.");
          }
        })
        .catch((error) => {
          console.error("Error fetching events:", error);
        });
        fetchPromises.push(fetchPromise);
      }


      Promise.all(fetchPromises)
      .then(() => {
        const index = Math.min(events.size, 4);
        const sortedMap = new Map([...events.entries()].sort());

        sortedTimes = Array.from(sortedMap.keys()).slice(0, index);
        sortedEvents = Array.from(sortedMap.values()).slice(0, index);

        document.getElementById('gcal-signout').style.display = "inline";
        document.getElementById('gcal-signin').innerHTML = "refresh";

        document.querySelector("#no-events").style.display = "block";
        for (let i = 0; i < sortedTimes.length; i++) {
          if (i != 0 && sortedTimes[i-1][0] == sortedTimes[i][0]) {
            console.log(i);
          }

          const formattedStartDate = formatDate(sortedTimes[i][0])
          const formattedStartTime = formatTime(sortedTimes[i][1])
          const formattedEndDate = formatDate(sortedTimes[i][2])
          const formattedEndTime = formatTime(sortedTimes[i][3])

          document.querySelector('#event' + i).href = `https://calendar.google.com/calendar/u/${email}/r/week/${sortedTimes[i][0].split('-').join('/')}`

          const totalStartDate = formattedStartDate[1] + " " + formattedStartDate[2];
          
          let totalTime
          let totalEndDate
          let allDay = false
  
          if (formattedStartTime === null) {
            totalTime = "all day";
            totalEndDate = "";
            allDay = true;
          } else {
            totalTime = formattedStartTime[0] + formattedStartTime[1] + " - " + formattedEndTime[0] + formattedEndTime[1];
            totalEndDate = formattedEndDate[1]+ " " + formattedEndDate[2];
          }
          document.querySelector("#no-events").style.display = "none";
          document.querySelector('#event' + i).style.display = "flex";
          document.querySelector('#day-type' + i).innerHTML = formattedStartDate[0];
          document.querySelector('#day' + i).innerHTML = totalStartDate;

          if (sortedTimes[i][0] == sortedTimes[i][2]) {
            document.querySelector('#time' + i).innerHTML = totalTime;
          } else {
            document.querySelector('#time' + i).innerHTML = totalTime + " " + totalEndDate;
          }
          
          if (allDay) {
            document.querySelector('#all-day' + i).style.display = "flex" ;
          }
          document.querySelector('#event-title' + i).innerHTML = sortedEvents[i][0];
          document.querySelector('#location' + i).innerHTML = sortedEvents[i][1] ? sortedEvents[i][1] : '';
          document.querySelector('#calendar-icon' + i).style.backgroundColor = sortedEvents[i][2];
        }
        
        for (let i = sortedTimes.length; i < 4; i++) {
          const eventElement = document.querySelector('#event' + i);
          eventElement.style.display = "none";
          
        }

      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });


    });
  }
// adding sign in logic to grab recent events
document.getElementById('gcal-signin').addEventListener('click', getEvents);

document.getElementById('gcal-signout').addEventListener('click', function() {
  chrome.identity.getAuthToken({ interactive: false }, 
    function (token) {
      if (!chrome.runtime.lastError) {        
        chrome.identity.clearAllCachedAuthTokens();

        chrome.identity.removeCachedAuthToken({token: token}, function(){});
        
        var xhr = new XMLHttpRequest();
        xhr.open(
        "GET", 
        "https://accounts.google.com/o/oauth2/revoke?token=" + token);
        xhr.send();
        document.querySelector("#no-events").style.display = "block";
        console.log('revoked token');
        localStorage.setItem('gcal-signed-in',"false");
        isSignedIn = false;
        document.getElementById('gcal-signout').style.display = "none";
        document.getElementById('gcal-signin').innerHTML = "sign in to google calendar";

        for (let i = 0; i < 4; i++) {
          document.querySelector('#event' + i).style.display = "none";
        }

      }
    }
  );
})


function formatDate (inputDate) {
    const daysOfWeek = ['SUN', 'MON', 'TUES', 'WED', 'THURS', 'FRI', 'SAT'];
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

    const dateObj = new Date(inputDate);
    const dayOfWeek = daysOfWeek[dateObj.getUTCDay()];
    const month = months[dateObj.getUTCMonth()];

    return [dayOfWeek, month, dateObj.getUTCDate()];
}

function formatTime (inputTime) {
  if (inputTime == null) {
    return null
  }
  let ampm = "pm"
  const [hours, minutes] = inputTime.split(":");
  let hour = parseInt(hours);
  
  if (hour > 12) {
    hour -= 12
  } else if (hour < 12) {
    ampm = "am"
  }
  if (hour == 0) hour = 12;
  return [hour + ":" + minutes, ampm]
}

// on load
document.addEventListener("DOMContentLoaded", function() {
  if (isSignedIn) {
    getEvents();
  }
});