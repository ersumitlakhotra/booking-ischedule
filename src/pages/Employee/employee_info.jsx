import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Search,
    Users,
    Clock3,
    ChevronRight,
    CheckCircle2,
    XCircle,
    User,
} from "lucide-react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { get_Date, LocalDate } from "../../common/localDate.js";
import { Button, Tags, SearchInput, Image, TabsButton } from "../../controls/index.jsx";
import { IsLoading, NoResults } from "../../common/index.jsx";
import { encryptId, getNextDays, getTimingInfo, updateField } from "../../common/general.jsx";
import { convertTo12Hour, toHHMM } from "../../common/generateTimeSlots.js";

export default function EmployeesInfo({
    form,
    setForm,
    selectedDayOpen,
    setSelectedDayOpen
}) {
    const navigate = useNavigate();
    const { refresh,companyList, getUser, getAttendance } = useOutletContext();
    const [isLoading, setIsLoading] = useState(false);
    const [attendanceList, setAttendanceList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [days, setDays] = useState([]);
    
    const [availableCount, setAvailableCount] = useState(0);
    const [searchInput, setSearchInput] = useState('');

    const today =LocalDate();
    const [selectedDay, setSelectedDay] = useState(form ? get_Date(form.trndate,"YYYY-MM-DD") : today);


    const timingInfo = companyList?.timinginfo;

    const timing = Array.isArray(timingInfo)
        ? timingInfo[0]
        : timingInfo || {};

    const business = Object.entries(timing).map(([day, value]) => ({
        key: day,
        day: day.charAt(0).toUpperCase() + day.slice(1),
        start: value?.[0] || "",
        end: value?.[1] || "",
        working: Boolean(value?.[2]),
    }));

    useEffect(() => {
        Init();
    }, []) 
    
    useEffect(() => {
        Init();
    }, [form?.trndate])

    const Init = async () => {
        setIsLoading(true);     
        const daysData = getNextDays(today,Number(companyList?.bookingdays || 0));
        setDays(daysData);
        const lastIndex = daysData.length - 1;
        const lastDay = daysData[lastIndex].date;
        const [Response, UserResponse] = await Promise.all([getAttendance(today,lastDay), getUser()]);
        setUserList(UserResponse);
        setFilteredList(UserResponse);
        setAttendanceList(Response);
        setIsLoading(false);
    }

    useEffect(() => {
        const availabilityList = userList.map(employee => {
           
            const weekday = days.find(
                o => o.date.toString() === selectedDay.toString()
            );
            const open = business.some(o => o.key === weekday?.weekday_long && o.working);
            const timing = employee.timinginfo?.[0]?.[weekday?.weekday_long];

            const isAttendance = attendanceList.find(
                o =>
                    o.trndate?.split("T")[0] === selectedDay.toString() &&
                    o.uid === employee.id
            );

            const isAvailable = isAttendance
                ? isAttendance.isworking
                : Boolean(timing?.[2]);

            const workingTime = isAttendance
                ? `${convertTo12Hour(isAttendance.starttime)} - ${convertTo12Hour(isAttendance.endtime)}`
                : timing
                    ? `${convertTo12Hour(timing[0])} - ${convertTo12Hour(timing[1])}`
                    : "";

            return {
                ...employee,
                open,
                isAvailable,
                workingTime,
            };
        }).sort((a, b) => {
            const aAvailable = a.isAvailable ? 1 : 0;
            const bAvailable = b.isAvailable ? 1 : 0;
            return bAvailable - aAvailable;
        });

        setAvailableCount(availabilityList.filter(o => Boolean(o.isAvailable)).length);

        const searchedList = availabilityList.filter(item =>
            (item.fullname || "")
                .toLowerCase()
                .includes(searchInput.toLowerCase())
        );
        setFilteredList(searchedList);
    }, [searchInput, userList, selectedDay, attendanceList, days]);

    return (
        <>
                {/* SEARCH */}
                <div className="relative mt-6">
                    <SearchInput value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder='Filter and search. . . ' />
                </div>

                {/* DAYS */}
                <section className="mt-6">

                    <div className="mb-3 flex items-center justify-between">

                        <h2 className="text-sm font-bold text-gray-900">
                            Availability
                        </h2>

                        <span className="text-xs font-medium text-gray-400">
                            {selectedDayOpen ? availableCount: 0} available
                        </span>

                    </div>

                    <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 scrollbar-hide">

                        {days.map((day) => {
                            const open = business.some(o => o.key === day.weekday_long && o.working);
                            const active = selectedDay === day.date;
                            return (
                                <button
                                    key={day.date}
                                    onClick={() => {
                                        form && updateField("trndate", day.date, setForm);
                                            setSelectedDay(day.date);setSelectedDayOpen(open);
                                    }}
                                    className={`flex min-w-[76px] shrink-0 flex-col items-center rounded-2xl px-3 py-3 transition-all duration-200 ${active
                                        ? `${open ? "bg-cyan-500" : "bg-red-400"} text-white shadow-md shadow-cyan-500/20`
                                        : `bg-white text-gray-500 border-t ring-1 ring-gray-200 hover:bg-gray-100`
                                        }`}
                                >

                                    <span
                                        className={`text-[11px] font-semibold ${active
                                            ? "text-white/80"
                                            : "text-gray-400"
                                            }`}
                                    >
                                        {day.date === today ? "Today" : day.weekday_short}
                                    </span>

                                    <span className="mt-1 text-xs font-bold">
                                        {day.day}
                                    </span>

                                    <span className={`mt-0.5 text-[9px] ${active
                                            ? "text-white/70"
                                            : "text-gray-400"
                                        }`}
                                    >
                                        {open ? "Open" : "Closed"}
                                    </span>

                                </button>
                            );
                        })}

                    </div>

                </section>

                {/* EMPLOYEE COUNT */}
                <div className="mt-6 flex items-center justify-between">

                    <div>
                        <h2 className="text-lg font-bold text-gray-900">
                            {get_Date(selectedDay,"MMM DD, YYYY")}
                        </h2>

                        <p className="mt-0.5 text-xs text-gray-500">
                            Employees available for appointments
                        </p>
                    </div>

                   {selectedDayOpen && <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
                        {userList.length}
                    </span>}

                </div>

                {/* EMPLOYEE LIST */}
                <div className="mt-4 flex flex-col gap-3">
                    <IsLoading isLoading={isLoading} rows={20} input={
                        selectedDayOpen ?
                        filteredList.length === 0 ?
                            <NoResults
                                title={"No Employee Found"}
                                Icon={Users}
                                description={"Try searching for another employee."}
                            /> :
                            filteredList.map((employee) => {
                                const isAvailable = employee.isAvailable;
                                const isSelected =  form ? (form.uid.toString() || "0") === employee.id.toString() : false;                          

                                return (
                                    <button
                                        key={employee.id}
                                        disabled={!isAvailable}
                                        className={`group flex w-full items-center gap-4 rounded-2xl  p-4 text-left shadow-sm  transition-all duration-200 ${isAvailable
                                            ? ` hover:-translate-y-0.5 hover:shadow-md ${isSelected ? "ring-cyan-600 ring-2 bg-cyan-50" : "ring-gray-100 ring-1 bg-white"} `
                                            : "cursor-not-allowed opacity-60 ring-gray-100"
                                            }`}
                                        onClick={() =>
                                            form ?  updateField("uid", employee.id, setForm) : navigate('/Employee/View/' + encryptId(employee.id))}
                                    >

                                        {/* AVATAR  */}
                                        <div className="relative shrink-0">
                                            <Image
                                                rounded="rounded-xl"
                                                className=" object-cover transition duration-500 group-hover:scale-105"
                                                height="h-14"
                                                width="w-14"
                                                src={employee.profilepic}
                                                name={employee.fullname} />

                                            {/* ONLINE / AVAILABLE DOT  */}
                                            <span className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${isAvailable
                                                ? "bg-green-500"
                                                : "bg-gray-400"
                                                }`}
                                            />

                                        </div>

                                        {/* DETAILS  */}
                                        <div className="min-w-0 flex-1">

                                            <div className="flex items-start justify-between gap-3">

                                                <div className="min-w-0">

                                                    <h3 className="truncate text-sm font-bold text-gray-900">
                                                        {employee.fullname}
                                                    </h3>

                                                    <p className="mt-1 truncate text-xs text-gray-500">
                                                        {employee.role}
                                                    </p>

                                                </div>

                                                <span className="shrink-0 text-xs font-bold text-yellow-500">
                                                    ★ {employee.rating}
                                                </span>

                                            </div>

                                            <div className="mt-3 flex items-center gap-2">

                                                {isAvailable ? (
                                                    <>
                                                        <CheckCircle2
                                                            size={14}
                                                            className="text-green-500"
                                                        />

                                                        <span className="text-[11px] font-semibold text-green-600">
                                                            Available
                                                        </span>

                                                        <span className="text-gray-300">
                                                            •
                                                        </span>

                                                        <Clock3
                                                            size={13}
                                                            className="text-gray-400"
                                                        />

                                                        <span className="text-[11px] text-gray-500">
                                                            {employee.workingTime}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle
                                                            size={14}
                                                            className="text-gray-400"
                                                        />

                                                        <span className="text-[11px] font-semibold text-gray-400">
                                                            Not available
                                                        </span>
                                                    </>
                                                )}

                                            </div>

                                        </div>

                                        {/* ARROW  */}
                                        {isAvailable && (
                                            <ChevronRight
                                                size={19}
                                                className="shrink-0 text-gray-300 transition group-hover:translate-x-1 group-hover:text-cyan-500"
                                            />
                                        )}

                                    </button>
                                );
                            })
                            :  <NoResults
                                title={"We're Currently Closed"}
                                Icon={XCircle}
                                description={"We're currently closed. Please check our business hours and choose another available time."}
                            /> 

                    } />

                </div>
        </>
    );
}
