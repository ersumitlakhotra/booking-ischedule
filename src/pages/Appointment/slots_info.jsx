import { useEffect, useMemo, useRef, useState } from "react";
import { generateTimeSlotsWithDate } from "../../common/generateTimeSlots.js"
import { IsLoading, updateField } from "../../common";
import { Button } from "../../controls/button.jsx";
import { get_Date, LocalDate } from "../../common/localDate";
import { useOutletContext } from "react-router-dom";
import { getTimingInfo } from "../../common/general.jsx";

export default function SlotsInfo({
    form,
    setForm,
    isEdit, 
    id,
    initialEditRef
}) {
     const requestId = useRef(0);
    const today = new Date();
    const currentMinutes = today.getHours() * 60 + today.getMinutes();
    const { companyList, getAppointment,getAttendance ,getUser} = useOutletContext();
    const [isLoading, setIsLoading] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [morningSlot, setMorningSlot] = useState([]);
    const [afternoonSlot, setAfternoonSlot] = useState([]);
    const [eveningSlot, setEveningSlot] = useState([]);
    const options = [
        { key: 1, label: 'Morning', slotList: morningSlot },
        { key: 2, label: 'Afternoon', slotList: afternoonSlot },
        { key: 3, label: 'Evening', slotList: eveningSlot },
    ];
    const [workingHours, setWorkingHours] = useState({
            open: null,
            startTime: "09:00",
            endTime: "21:00",
        });

    const totalMinutes = useMemo(() => {
        return form.services.reduce(
            (sum, service) => sum + (Number(service.minutes) || 0),
            0
        );
    }, [form.services]);

     useEffect(() => {
        if (!form.trndate || !form.uid) return;

        fetchSchedule();
    }, []);

    const fetchSchedule = async () => {
        const currentRequest = ++requestId.current;

        setIsLoading(true);

        try {
            // Business hours
            const business = getTimingInfo(companyList.timinginfo, form.trndate);         

            // Fetch attendance + appointments together
            const [response,attendanceResponse,userResponse] = await Promise.all([
                getAppointment(form.trndate, form.trndate),
                getAttendance(form.trndate, form.trndate),
                getUser()
            ]);

            // Ignore if another request started
            if (currentRequest !== requestId.current) return;

            const attendance = attendanceResponse.find(
                (o) => o.uid === form.uid
            );

            let open = business?.open ?? null;
            let startTime = business?.starttime ?? "09:00";
            let endTime = business?.endtime ?? "21:00";

            if (attendance) {
                open = attendance.isworking;
                startTime = attendance.starttime > business?.starttime ? attendance.starttime : business?.starttime;
                endTime = attendance.endtime < business?.endtime ? attendance.endtime : business?.endtime;
            } else {
                const user = userResponse.find((o) => o.id === form.uid);

                if (user) {
                    const employee = getTimingInfo(user.timinginfo, form.trndate);

                    if (employee) {
                        open = employee.open;
                        startTime = employee.starttime > business?.starttime ? employee.starttime : business?.starttime;
                        endTime = employee.endtime < business?.endtime ? employee.endtime : business?.endtime;
                    }
                }
            }

            setWorkingHours({
                open,
                startTime,
                endTime,
            });

            const appointmentResponse = response.filter(
                (o) =>
                    Number(o.uid) === Number(form.uid) &&
                    (o.status === "Pending" || o.status === "Completed") &&
                    get_Date(o.trndate, 'YYYY-MM-DD') === get_Date(form.trndate, 'YYYY-MM-DD') &&
                    (!isEdit || o.id !== id)
            );
            setAppointments(appointmentResponse ?? []);
        } catch (err) {
            // console.error(err);
        } finally {
            if (currentRequest === requestId.current) {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        if (!form.trndate) return;


        const slotsList = generateTimeSlotsWithDate(
            form.trndate,
            workingHours.startTime,
            workingHours.endTime,
            totalMinutes || 30,
            appointments,
            form.uid
        );
        const slots = slotsList.filter((slot) => {
            // Future dates: include all slots
            if (get_Date(form.trndate,'YYYY-MM-DD') !== LocalDate()) {
                return true;
            }

            // Today: exclude slots that have already started
            const [hours, minutes] = slot.start.split(":").map(Number);
            const slotMinutes = hours * 60 + minutes;

            return slotMinutes >= currentMinutes;
        })
           
        setMorningSlot(slots.filter((o) => o.category === "Morning"));
        setAfternoonSlot(slots.filter((o) => o.category === "Afternoon"));
        setEveningSlot(slots.filter((o) => o.category === "Evening"));

        const isSameEditSlot =
            isEdit &&
            initialEditRef.current &&
            initialEditRef.current.trndate === form.trndate &&
            initialEditRef.current.uid === form.uid;

        // Clear only when user changes date/user/service
        if (!isSameEditSlot) {
            updateField("slot", "", setForm);
        }
    }, [
        appointments,
        workingHours,
        totalMinutes,
        form.trndate,
        form.uid,
    ]);

    return (    
            <div class='mt-3 w-full flex flex-row gap-2 text-xs'>
                <IsLoading isLoading={isLoading} rows={10} input={
                    options.map(opt =>
                        <div key={opt.key} class='flex flex-col gap-2'>
                            <p class='flex-row flex justify-center items-center '>{opt.label}</p>
                            {opt.slotList.length === 0 ? <p class='text-xs text-gray-500'>Empty</p> :
                                opt.slotList.map(item => (
                                    <Button variant={form.slot === item.slot ? 'default' : 'secondary'} key={item.slot} className={form.slot === item.slot && 'border-cyan-500 text-cyan-500 border'}
                                        label={item.slot}
                                        // disabled={item.disabled}
                                        onClick={() => {
                                            updateField("slot", item.slot, setForm);
                                            updateField("starttime", item.start, setForm);
                                            updateField("endtime", item.end, setForm);
                                        }} />
                                ))}
                        </div>
                    )
                } />
            </div>
    )
}