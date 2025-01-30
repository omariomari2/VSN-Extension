import fetchLocations from "./api/fetchLocations.js"
const ALARM_JOB_NAME = "DROP_ALARM"

chrome.runtime.onInstalled.addListener(details => {
    fetchLocations()
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const { event, prefs } = message
    switch(event) {
        case 'onStop':
            handleOnStop()
            break;
        case 'onStart':
            handleOnStart(prefs)
            break;
        default:
            break;
    }
    sendResponse({status: "completed"});
})

const handleOnStop = () => {
    console.log("On stop in background")
    stopAlarm();
}

const handleOnStart = (prefs) => {
    console.log("prefs received:", prefs)
    chrome.storage.local.set(prefs)
    createAlarm();
}

const createAlarm = () => {
    chrome.alarms.create(ALARM_JOB_NAME, { periodInMinutes: 1.0} )
}

const stopAlarm = () => {
    chrome.alarms.clear(ALARM_JOB_NAME, wasCleared => {
        if (wasCleared) {
            console.log("Alarm stopped successfully");
        } else {
            console.log("Failed to stop the alarm");
        }
    });
}

chrome.alarms.onAlarm.addListener(alarm => {
    if (alarm.name === ALARM_JOB_NAME) {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'images/chroma.png',
            title: 'Alarm Notification',
            message: 'This is your alarm notification!'
        });
        console.log("Alarm triggered");
    }
});