import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

export const Calendar = ({
    value,
    onChange,
    dateMode=true,
    calendarMode = "popup", // popup | permanent | hidden
    className = "",
}) => {
const calendarRef = useRef(null);

    const todayDate = new Date();


    const selectedDate = value
        ? (() => {
            const [y, m, d] = value.split("-").map(Number);
            return new Date(y, m - 1, d);
        })()
        : todayDate;



    const [showCalendar, setShowCalendar] = useState(
        calendarMode === "permanent"
    );


    const [currentMonth, setCurrentMonth] = useState(
        new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            1
        )
    );



    const monthName = currentMonth.toLocaleString(
        "default",
        {
            month: "long",
            year: "numeric",
        }
    );



    const formatDate = (date) => {

        const y = date.getFullYear();

        const m = String(
            date.getMonth() + 1
        ).padStart(2, "0");

        const d = String(
            date.getDate()
        ).padStart(2, "0");


        return `${y}-${m}-${d}`;
    };




    const changeDay = (amount) => {

        const date = new Date(selectedDate);

        date.setDate(
            date.getDate() + amount
        );

        onChange?.(
            formatDate(date)
        );

    };




    const days = useMemo(() => {

        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        const firstDay = new Date(year, month, 1);

        const lastDay = new Date(year, month + 1, 0);


        const startDay =
            (firstDay.getDay() + 6) % 7;


        const totalDays =
            lastDay.getDate();


        const prevLastDay =
            new Date(year, month, 0).getDate();


        const result = [];


        for (let i = startDay - 1; i >= 0; i--) {

            result.push({
                day: prevLastDay - i,
                current: false,
                date: new Date(
                    year,
                    month - 1,
                    prevLastDay - i
                )
            });

        }



        for (let d = 1; d <= totalDays; d++) {

            result.push({
                day: d,
                current: true,
                date: new Date(
                    year,
                    month,
                    d
                )
            });

        }




        let next = 1;

        while (result.length < 42) {

            result.push({
                day: next,
                current: false,
                date: new Date(
                    year,
                    month + 1,
                    next
                )
            });

            next++;

        }


        return result;


    }, [currentMonth]);




    const isToday = (date) =>
        date.toDateString() ===
        todayDate.toDateString();



    const isSelected = (date) =>
        formatDate(date) ===
        formatDate(selectedDate);

useEffect(() => {

    if (calendarMode !== "popup") return;

    const handleClickOutside = (event) => {

        if (
            calendarRef.current &&
            !calendarRef.current.contains(event.target)
        ) {
            setShowCalendar(false);
        }

    };


    document.addEventListener(
        "mousedown",
        handleClickOutside
    );


    return () => {
        document.removeEventListener(
            "mousedown",
            handleClickOutside
        );
    };

}, [calendarMode]);


    return (

        <div  ref={calendarRef} className={`relative ${className}`}>


            {/* DATE NAVIGATOR */}
            {dateMode &&
                <div className="
                mb-3
                flex
                items-center
                rounded-xl
                border
                bg-white
                shadow-sm
                overflow-hidden
            ">


                    <button
                        onClick={() => changeDay(-1)}
                        className="
                    h-11 w-11
                    flex items-center justify-center
                    border-r
                    hover:bg-gray-50
                    "
                    >
                        <ChevronLeft size={18} />
                    </button>



                    <button
                        onClick={() => {

                            if (calendarMode === "popup")
                                setShowCalendar(!showCalendar);

                        }}

                        className="
                    flex-1
                    h-11
                    px-4
                    flex items-center
                    justify-center
                    gap-2
                    font-medium
                    hover:bg-gray-50
                    "
                    >

                        <CalendarDays size={16} />

                        {
                            isToday(selectedDate)
                                ?
                                "Today"
                                :
                                selectedDate.toLocaleDateString(
                                    undefined,
                                    {
                                        month: "short",
                                        day: "2-digit",
                                        year: "numeric"
                                    }
                                )
                        }


                    </button>




                    <button
                        onClick={() => changeDay(1)}
                        className="
                    h-11 w-11
                    flex items-center justify-center
                    border-l
                    hover:bg-gray-50
                    "
                    >
                        <ChevronRight size={18} />
                    </button>


                </div>
            }



            {/* CALENDAR */}

            {
                (calendarMode === "permanent" || showCalendar) &&
                calendarMode !== "hidden" &&
                (
                    <div
                        className={`
                w-80
                rounded-2xl
                border
                border-gray-200
                bg-white
                p-5
                shadow-lg

                ${calendarMode === "popup"
                                ?
                                "absolute top-full left-0 mt-2 z-50"
                                :
                                ""
                            }
            `}
                    >


                        <div className="
                        mb-6
                        flex
                        items-center
                        justify-between
                    ">

                            <h2 className="
                            text-lg
                            font-semibold
                            text-gray-800
                        ">
                                {monthName}
                            </h2>


                            <div className="flex gap-2">

                                <button
                                    onClick={() =>
                                        setCurrentMonth(
                                            new Date(
                                                currentMonth.getFullYear(),
                                                currentMonth.getMonth() - 1,
                                                1
                                            )
                                        )
                                    }
                                    className="h-8 w-8 rounded-lg hover:bg-gray-100"
                                >
                                    <ChevronLeft size={18} />
                                </button>


                                <button
                                    onClick={() =>
                                        setCurrentMonth(
                                            new Date(
                                                currentMonth.getFullYear(),
                                                currentMonth.getMonth() + 1,
                                                1
                                            )
                                        )
                                    }
                                    className="h-8 w-8 rounded-lg hover:bg-gray-100"
                                >
                                    <ChevronRight size={18} />
                                </button>


                            </div>


                        </div>




                        <div className="
                        grid grid-cols-7
                        text-center
                        text-xs
                        font-semibold
                        text-gray-400
                    ">

                            {
                                weekDays.map((day, i) => (
                                    <div key={i} className="py-2">
                                        {day}
                                    </div>
                                ))
                            }

                        </div>




                        <div className="
                        grid
                        grid-cols-7
                        gap-1
                    ">


                            {
                                days.map((item, index) => {

                                    const selected =
                                        isSelected(item.date);

                                    const today =
                                        isToday(item.date);


                                    return (

                                        <button
                                            key={index}
                                            onClick={() =>
                                                onChange?.(
                                                    formatDate(item.date)
                                                )
                                            }
                                            className={`
                                        h-10 w-10 rounded-full
                                        text-sm
                                        flex items-center justify-center

                                        ${selected
                                                    ?
                                                    "bg-sky-600 text-white"
                                                    :
                                                    today
                                                        ?
                                                        "border-2 border-sky-600 text-sky-600"
                                                        :
                                                        item.current
                                                            ?
                                                            "hover:bg-sky-50"
                                                            :
                                                            "text-gray-300"
                                                }
                                        `}
                                        >
                                            {item.day}
                                        </button>

                                    )

                                })
                            }


                        </div>


                    </div>

                )}


        </div>

    );
};