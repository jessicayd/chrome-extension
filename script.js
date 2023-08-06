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