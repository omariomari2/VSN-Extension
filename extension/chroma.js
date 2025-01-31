// My elements 
const userLocation = document.getElementById("user_location");
const startdate = document.getElementById("start_date");
const enddate = document.getElementById("end_date");
const startbutton = document.getElementById("start");
const stopbutton = document.getElementById("stop");

startbutton.onclick = function () {
    const prefs = {
        locationId: userLocation.value,
        startDate: startdate.value,
        endDate: enddate.value
    }
    chrome.runtime.sendMessage({event: 'onStart', prefs})
}
stopbutton.onclick = function () {
    chrome.runtime.sendMessage({event: 'onStop'})
}

chrome.storage.local.get(["locationId", "startDate", "endDate", "locations"], (result) => {
    const { locationId, startDate, endDate, locations } = result;
    setLocations(locations);

    if (locations && Array.isArray(locations)) {
        setLocations(locations)
    }

    if (locationId) {
        userLocation.value = locationId
    }

    if (startDate) {
        startdate.value = startDate
    }

    if (endDate) {
        enddate.value = endDate
    }
})

const setLocations = (locations) => {
    locations.forEach(location => {
        let optionElement = document.createElement("option");
        optionElement.value = location.id;
        optionElement.innerHTML = location.name;
        userLocation.appendChild(optionElement);
    });
}