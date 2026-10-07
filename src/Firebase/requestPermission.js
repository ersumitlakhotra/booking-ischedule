
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../firebase.js";
import { getStorage } from "../common/localStorage.js";

// This function will request permission and get FCM token
export const initNotification = async (registration, saveData, onNotification) => {
    try {

        if (requestPermission()) {
            const localStorage = await getStorage();
            const token = await getToken(messaging, {
                vapidKey: "BE0_FiNfC14nhWlVxNiG36JJKdXq2PquIaYVFiNQK06IDS83tP35_wpjW12cYHLyiqUGC0HCWU11hUBiLcvMxJ4",
                serviceWorkerRegistration: registration,
            });
            if (localStorage.custid.toString() !== "0") {
                const body = JSON.stringify({ uid: localStorage.custid, token: token, role: "Customer" });
                saveData({
                    label: "Notifications",
                    method: 'POST',
                    endPoint: "firebase",
                    body: body,
                    notify: false
                });
            }
            //console.log("FCM Token:", token);
        }
        // 👉 Send this token to your backend
    } catch (err) {
        // console.error("Push init failed:", err);
    }

    // Optional: Listen to messages in foreground
    onMessage(messaging, (payload) => {
        const title = payload.data.title;
        const body = payload.data.body;
        onNotification({ title: title, description: body })
        //console.log("Foreground message received:", payload);
    });
}

export async function requestPermission() {
    if (Notification.permission === "granted") return true;
    if (Notification.permission === "denied") return false;

    const permission = await Notification.requestPermission();
    return permission === "granted";
}