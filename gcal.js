let calendarIds = [];
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
        'Content-Type': 'application/json'
      },
      'contentType': 'json'
    };

    const now = new Date();
    const isoNow = now.toISOString();
    const maxResults = 4;

  
    // getting all calendars
    fetch(`https://www.googleapis.com/calendar/v3/users/me/calendarList`, init)
    .then(response => response.json())
    .then(calendarListData => {
      // getting ids
      calendarIds = calendarListData.items.map(calendar => calendar.id);

      const fetchPromises = [];
      let events = new Map();
      // getting most top recent events of each calendar
      for (const calendarId of calendarIds) {
        const fetchPromise = fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?maxResults=${maxResults}&timeMin=${isoNow}`, init)
        .then((response) => response.json())
        .then((data) => {
          if (data.items) {
            data.items.forEach((event) => {
              events.set(event.start.dateTime, event.summary);
            });
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
        const index = Math.min(events.size, maxResults);
        const sortedMap = new Map([...events.entries()].sort());

        sortedTimes = Array.from(sortedMap.keys()).slice(0, index);
        sortedDates = Array.from(sortedMap.values()).slice(0, index);
        console.log(sortedTimes);
        console.log(sortedDates);

        document.getElementById('gcal-signout').style.display = "inline";
        document.getElementById('gcal-signin').innerHTML = "refresh";
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
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
      }
    }
  );
})

// on load
document.addEventListener("DOMContentLoaded", function() {
  if (isSignedIn) {
    getEvents();
  }
});