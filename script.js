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
> > icon-name
> > icon-link
> > > icon-image
> > button-wrapper
> > > edit-button 
> > > remove-button 
*/
function createIcon(url, containerName, id, name) {
    if (containerName == "icons") currIconLeft++;
    else currIconRight++;

    let iconContainer = document.getElementById(containerName);

    let iconWrapper = document.createElement('div');
    iconWrapper.className = 'icon-wrapper';

    // displays title of bookmark at the top
    let iconName = document.createElement('p');
    iconName.className = "icon-name";
    iconName.setAttribute("contenteditable", true);
    if (localStorage.getItem(`${id}_name`) == null || localStorage.getItem(`${id}_name`) == 'null') {
        localStorage.setItem(`${id}_name`, name);
    }
    iconName.innerHTML = localStorage.getItem(`${id}_name`);

    iconName.addEventListener('input', function(){
        localStorage.setItem(`${id}_name`,this.innerHTML);
     })

    // actual icon that links to url
    let link = document.createElement('a');
    link.className = 'icon-link';
    if (localStorage.getItem(`${id}_url`) == null || localStorage.getItem(`${id}_url`) == 'null') {
        link.href = url;
        localStorage.setItem(`${id}_url`, url)
    }
    link.href = localStorage.getItem(`${id}_url`);

    let icon = document.createElement('img');
    icon.src = 'images/icon.png';
    icon.className = 'icon-image';
    icon.alt = 'icon'; 

    // buttons
    let buttonWrap = document.createElement('div');
    buttonWrap.className = 'button-wrapper';

    // edit/displays url of button
    let edit = document.createElement('button');
    edit.className = 'edit-button';
    edit.textContent = 'edit';

    edit.addEventListener('click', function (event) {
        event.preventDefault();
        let newLink = prompt(`${link.href} \nEdit link: `);
        if (isValidUrl(newLink)) {
            link.href = newLink;
        }
        localStorage.setItem(`${id}_url`, newLink);
    });

    // removes button
    let remove = document.createElement('button');
    remove.className = 'remove-button';
    remove.textContent = 'x';

    remove.addEventListener('click', function (event) {
        event.preventDefault();
        localStorage.removeItem(`${id}`);
        localStorage.removeItem(`${id}_name`);
        localStorage.removeItem(`${id}_url`);
        iconWrapper.remove();
        if (containerName=='icons') {
            currIconLeft--;
            for (let i = parseInt(id.substring(1)); i < currIconLeft; i++) {
                localStorage.setItem(`l${i}`,localStorage.getItem(`l${i+1}`));
                localStorage.setItem(`l${i}_url`,localStorage.getItem(`l${i+1}_url`));
                localStorage.setItem(`l${i}_name`,localStorage.getItem(`l${i+1}_name`));
            }
            localStorage.removeItem(`l${currIconLeft}`);
            localStorage.removeItem(`l${currIconLeft}_name`);
            localStorage.removeItem(`l${currIconLeft}_url`);
        }
        else {
            currIconRight--;
            for (let i = parseInt(id.substring(1)); i < currIconRight; i++) {
                localStorage.setItem(`r${i}`,localStorage.getItem(`r${i+1}`));
                localStorage.setItem(`r${i}_url`,localStorage.getItem(`r${i+1}_url`));
                localStorage.setItem(`r${i}_name`,localStorage.getItem(`r${i+1}_name`));
            }
            localStorage.removeItem(`r${currIconRight}`);
            localStorage.removeItem(`r${currIconRight}_name`);
            localStorage.removeItem(`r${currIconRight}_url`);
        }
    });

    // add to html
    buttonWrap.appendChild(edit);
    buttonWrap.appendChild(remove);
    iconWrapper.appendChild(iconName);
    iconWrapper.appendChild(link);
    iconWrapper.appendChild(buttonWrap);
    link.appendChild(icon);
    iconContainer.insertBefore(iconWrapper, iconContainer.lastElementChild);
    localStorage.setItem(`${id}`, "true");
}

// validates a url
function isValidUrl(str) {
    try {
        const newUrl = new URL(str);
        return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
    } catch (err) {
        return false;
    }
}

// keeping track of # of bookmarks
const maxIcon = 6;
let currIconLeft = 0;
let currIconRight = 0;

// add buttons
let leftAdd = document.getElementById('leftAdd');
let rightAdd = document.getElementById('rightAdd');

leftAdd.addEventListener('click', function() {
    if (currIconLeft >= maxIcon) return;
    createIcon('https://google.com', 'icons', `l${currIconLeft}`, 'link');
});
rightAdd.addEventListener('click',function(){
    if (currIconRight >= maxIcon) return;
    createIcon('https://google.com', 'icons2', `r${currIconRight}`, 'link');
});

// add all stashed bookmarks from local storage
for (let i = 0; i < 6; i++) {
    if (localStorage.getItem(`l${i}`) == "true") {
        createIcon(localStorage.getItem(`l${i}_url`), 'icons', `l${i}`, localStorage.getItem(`l${i}_name`));
    }
    if (localStorage.getItem(`r${i}`) == "true") {
        createIcon(localStorage.getItem(`r${i}_url`), 'icons2', `r${i}`, localStorage.getItem(`r${i}_name`));
    }
}


// saves note section
let note = document.getElementById('notes');
if (localStorage.getItem(`notes`) == null || localStorage.getItem(`notes`) == 'null') {
    localStorage.setItem(`notes`, ' ');
}
note.innerHTML = localStorage.getItem(`notes`);

note.addEventListener('input', function(){
    localStorage.setItem(`notes`,this.innerHTML);
})