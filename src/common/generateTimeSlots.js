import { get_Date, LocalDate } from "./localDate";

export const generateTimeSlotsWithDate=(date, startTime, endTime, interval, appointments = [],uid)=> {
   
    const getTimeSlot=(time24)=> {
        const [hour, minute] = time24.split(":").map(Number);
        const totalMinutes = hour * 60 + minute;

        if (totalMinutes >= 300 && totalMinutes < 720) {
            return "Morning";      // 05:00–11:59
        }
        if (totalMinutes >= 720 && totalMinutes < 1020) {
            return "Afternoon";    // 12:00–16:59
        }
        if (totalMinutes >= 1020) {
            return "Evening";      // 17:00–21:59
        }

        return "Night";          // 22:00–04:59
    }

    const start = toMinutes(startTime);
    const end = toMinutes(endTime);

    const blocked = appointments.map((a) => ({
        start: toMinutes(a.starttime),
        end: toMinutes(a.endtime),
    }));

    const slots = [];

    for (let time = start; time < end; time += interval) {
        const slotStart = time;
        const slotEnd = time + interval;

        // skip if overlapping with appointment
        const isBlocked = blocked.some(
            (app) => slotStart < app.end && slotEnd > app.start
        );

        if (!isBlocked) {
            const startString = toHHMM(slotStart);
            const endString = toHHMM(slotEnd);

            slots.push({
                uid: uid,
                date,               // <-- date included here
                start: startString,
                end: endString,
                slot: `${convertTo12Hour(startString)} - ${convertTo12Hour(endString)}` ,
                category: getTimeSlot(startString)
            });
        }
    }

    return slots;
}

export const toMinutes = (t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
};
export const toHHMM = (mins) => {
    const h = String(Math.floor(mins / 60)).padStart(2, "0");
    const m = String(mins % 60).padStart(2, "0");
    return `${h}:${m}`;
};
export const convertTo12Hour = (time24) => {
    const [hours, minutes] = time24.split(':');
    const h = parseInt(hours, 10);

    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = ((h + 11) % 12) + 1;

    return `${hour12.toString().padStart(2, '0')}:${minutes} ${period}`;
}
