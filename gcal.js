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
    // const lastSyncToken = localStorage.getItem('lastSyncToken');

    // if (lastSyncToken == null | lastSyncToken == "undefined") {
    //   console.log("Performing full sync.");
    //   fetchEvents(init, null);
    // } else {
    //   console.log("Performing incremental sync.");
    //   fetchEvents(init, lastSyncToken);
    // }

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

      console.log("colors:", colors)
      const now = new Date();
      const isoNow = now.toISOString();
      const maxResults = 4;

      const fetchPromises = [];
      let events = new Map();

      // getting most top recent events of each calendar
      for (let i=0; i<calendarIds.length; i++) {
        console.log("calendarID", calendarIds)
        let url;
      
        // if (lastSyncToken == null | lastSyncToken == "undefined") {
        url = `https://www.googleapis.com/calendar/v3/calendars/${calendarIds[i]}/events?maxResults=${maxResults}&timeMin=${isoNow}`
        // } else {
          // url = `https://www.googleapis.com/calendar/v3/calendars/syncToken=${lastSyncToken}`
        // }

        const fetchPromise = fetch(url, init)
        .then((response) => response.json())
        .then((data) => {
          if (data.items) {
            console.log(data.items)
            data.items.forEach((event) => {
              // end dates?
              const dateTimeParts = event.start.dateTime.split('T');
              const date = dateTimeParts[0];
              const time = dateTimeParts[1].substring(0, 5);
              const location = event.location; 
              const color = colors[i];
              
              // trim gets rid of leading and trailing white space/commas
              events.set([date, time], [event.summary.trim(),location, color]);
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
      // const nextSyncToken = calendarListData.nextSyncToken
      // localStorage.setItem('lastSyncToken', nextSyncToken);
      // console.log(nextSyncToken)


      Promise.all(fetchPromises)
      .then(() => {
        const index = Math.min(events.size, maxResults);
        const sortedMap = new Map([...events.entries()].sort());

        sortedTimes = Array.from(sortedMap.keys()).slice(0, index);
        sortedEvents = Array.from(sortedMap.values()).slice(0, index);
        console.log(sortedTimes);
        console.log(sortedEvents);

        document.getElementById('gcal-signout').style.display = "inline";
        document.getElementById('gcal-signin').innerHTML = "refresh";

        for (let i = 0; i < sortedTimes.length; i++) {
          const formattedDate = formatDate(sortedTimes[i][0])
          const formattedTime = formatTime(sortedTimes[i][1])

          document.querySelector('#event' + i).style.display = "flex";
          document.querySelector('#day-type' + i).innerHTML = formattedDate[0];
          document.querySelector('#day' + i).innerHTML = formattedDate[1]+ " " + formattedDate[2];
          document.querySelector('#time' + i).innerHTML = formattedTime[0] + " " + formattedTime[1];
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
  let ampm = "PM"
  const [hours, minutes] = inputTime.split(":");
  let hour = parseInt(hours);
  
  if (hour > 12) {
    hour -= 12
  } else if (hour < 12) {
    ampm = "AM"
  }
  return [hour + ":" + minutes, ampm]
}

// on load
document.addEventListener("DOMContentLoaded", function() {
  if (isSignedIn) {
    getEvents();
  }
});