document.addEventListener("DOMContentLoaded", function() {
  document.getElementById('gcal-signin').addEventListener('click', function() {
    chrome.identity.getAuthToken({interactive: true}, function(token) {
      console.log("Authentication successful. Token:", token);

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

      const maxResults = 5;

      const eventsUrl = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${isoNow}&maxResults=${maxResults}`;
      
      fetch(eventsUrl, init)
        .then((response) => response.json())
        .then((data) => {
          if (data.items) {
            // Loop through the upcoming events and display them.
            data.items.forEach((event) => {
              console.log("Event:", event.summary, "Start:", event.start.dateTime);
              // You can display the event details in your extension's UI.
            });
          } else {
            console.log("No upcoming events found.");
          }
        })
        .catch((error) => {
          console.error("Error fetching events:", error);
        });

    });
  });

});


// Function to fetch upcoming events using the provided token.
function fetchUpcomingEvents(token) {
  const calendarId = "primary"; // You can change this to the desired calendar ID.
  const maxResults = 3; // Number of upcoming events to fetch.

  // API endpoint URL to fetch events.
  // const eventsUrl = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?maxResults=${maxResults}&orderBy=startTime`;
  const eventsUrl = "https://www.googleapis.com/calendar/v3/calendars/primary"
  
  // Fetch events using the token.
  fetch(eventsUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.items) {
        // Loop through the upcoming events and display them.
        data.items.forEach((event) => {
          console.log("Event:", event.summary, "Start:", event.start.dateTime);
          // You can display the event details in your extension's UI.
        });
      } else {
        console.log("No upcoming events found.");
      }
    })
    .catch((error) => {
      console.error("Error fetching events:", error);
    });
}
