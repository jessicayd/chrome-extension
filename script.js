// updating time
function setTime(){
    const dayArray = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const monthArray = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

    let date = new Date();

    let hours = date.getHours();
    let ampm = "AM";
    if (hours >= 12) {
        hours -= 12;
        ampm = "PM";
    }
    if (hours == 0) hours = 12;
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

/* 
function to create an icon
icons
> icon-wrapper
> > icon-link
> > > icon-image
> > edit-button 
*/
function createIcon(url, containerName, button) {
    let iconContainer = document.getElementById(containerName);

    let iconWrapper = document.createElement('div');
    iconWrapper.className = 'icon-wrapper';

    let link = document.createElement('a');
    link.className = 'icon-link';
    link.href = url;

    let icon = document.createElement('img');
    icon.src = 'images/icon.png';
    icon.className = 'icon-image';
    icon.alt = 'icon'; 

    let edit = document.createElement('button');
    edit.className = 'edit-button';
    edit.textContent = button;

    // edit.addEventListener('click', function (event) {
    //     event.preventDefault();
    //     let newLink = prompt('Edit link: ');
    //     if (isValidUrl(newLink)) {
    //         link.href = newLink;
    //     }
    // });

    iconWrapper.appendChild(link);
    iconWrapper.appendChild(edit);
    link.appendChild(icon);
    iconContainer.appendChild(iconWrapper);
}

function isValidUrl(str) {
    try {
        const newUrl = new URL(str);
        return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
    } catch (err) {
        return false;
    }
}

// creating icons
createIcon('https://calendar.google.com/calendar/u/1/r/week', 'icons', 'gcal');
createIcon('https://www.google.com/search?q=weather+28226', 'icons', 'weather');
createIcon('https://www.instagram.com/?hl=en', 'icons', 'instagram');

createIcon('https://github.com/jessicayd/chrome-extension', 'icons2', 'this repo');
createIcon('https://docs.google.com/spreadsheets/d/1uPWKV088TNfjcF_GKqTv40gJiJocHrz7PU7pu-o3KWc/edit#gid=0', 'icons2', 'leetcode sheet');
createIcon('https://docs.google.com/spreadsheets/d/1EQUbkiJtCM5tnc8N7ylGiUYoL2723f6fdLcnOQgjtL0/edit#gid=0', 'icons2', 'code life tg');
createIcon('https://neetcode.io/practice', 'icons2', 'neetcode');