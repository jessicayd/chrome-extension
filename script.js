function setTime(){
    const dayArray = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const monthArray = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

    let date = new Date();

    let hours = date.getHours();
    let ampm = "AM";
    if (hours > 12) {
        hours -= 12;
        ampm = "PM";
    }
    let second = date.getSeconds();
    let minute = date.getMinutes();
    document.getElementById("time").innerHTML = `${hours}:${minute < 10 ? '0' + minute : minute}:${second < 10 ? '0' + second : second}`;
    document.getElementById("ampm").innerHTML = ` ${ampm}`;
    document.getElementById("date").innerHTML = `${dayArray[date.getDay()]}, ${monthArray[date.getMonth()]} ${date.getDate()}`;
}

// updates ~500 millisec bc i think 1000 ms is laggy sometimes
setInterval(function() {
    setTime();
  }, 500)

// Function to create an icon
function createIcon(url) {
    let iconContainer = document.getElementById('icons');

    let iconWrapper = document.createElement('div');
    iconWrapper.className = 'icon-wrapper';

    let link = document.createElement('a');
    link.className = 'icon-link';
    link.href = url;

    let icon = document.createElement('img');
    icon.src = 'images/weather.jpeg';
    icon.className = 'icon-image';
    icon.alt = 'icon'; 

    let edit = document.createElement('button');
    edit.className = 'edit-button';
    edit.textContent = 'edit';

    // Add an event listener for the "Edit URL" button
    edit.addEventListener('click', function (event) {
        event.preventDefault();
        let newLink = prompt('Edit link: ');
        if (newLink) {
            link.href = newLink;
        }
    });

    iconWrapper.appendChild(link);
    iconWrapper.appendChild(edit);
    link.appendChild(icon);
    iconContainer.appendChild(iconWrapper);
}

// Call the createIcon function with different URLs to create multiple icons
createIcon('https://www.google.com/search?q=weather+28226');
createIcon('https://github.com/jessicayd/chrome-extension');
createIcon('https://google.com');