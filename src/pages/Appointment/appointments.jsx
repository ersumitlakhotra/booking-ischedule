import React, { useEffect, useMemo, useState } from "react";
import {
    Search,
    CalendarDays,
    Clock3,
    MapPin,
    ChevronRight,
    MoreVertical,
    Pencil,
    Download,
    Cross,
    X,
    Eye,
    Users,
} from "lucide-react";
import { ActionMenu, Button, SearchInput, Select, TabsButton, Tags } from "../../controls/index.jsx";
import { get_Date, LocalDate } from "../../common/localDate.js";
import { useNavigate, useOutletContext } from "react-router-dom";
import { IsLoading } from "../../common/isLoading.jsx";
import { NoResults } from "../../common/no_results.jsx";
import { encryptId, openMaps } from "../../common/general.jsx";

export default function Appointments() {
    const navigate = useNavigate();
    const { refresh, companyList, getUserAppointment, getUser } = useOutletContext();
    const [isLoading, setIsLoading] = useState(false);
    const [userList, setUserList] = useState([]);
    const [appointmentList, setAppointmentList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);

    const [searchInput, setSearchInput] = useState('');
    const [selected, setSelected] = useState("Pending");
    const [category1Types, setCategory1Types] = useState([]);
    const today = new Date();
    const currentMinutes = today.getHours() * 60 + today.getMinutes();

    useEffect(() => {
        Init();
    }, [])

    const Init = async () => {
        setIsLoading(true);
        const [Response, UserResponse] = await Promise.all([getUserAppointment(), getUser(false)]);
        setUserList(UserResponse);
        setAppointmentList(Response);
        setFilteredList(Response);
        updateCounts(Response);  
        handleSearch(Response);
        setIsLoading(false);
    }
    const addressInfo = companyList?.addressinfo?.[0] ?? {};
    const address = [
        addressInfo.street,
        addressInfo.city,
        addressInfo.province,
        addressInfo.postal,
        addressInfo.country,
    ]
        .filter(Boolean)
        .join(", ");


    useEffect(() => {
        handleSearch(appointmentList);
    }, [selected, searchInput]);

    const handleSearch = (List) => {
        const search = searchInput.toLowerCase();

        const searchedList = List.filter((item) => {
            return (
                (
                    (item.order_no || "").toString().toLowerCase().includes(search) ||
                    (item.name || "").toLowerCase().includes(search) || 
                      (get_Date(item.trndate,"MMM DD YYYY") || "").toLowerCase().includes(search) || 
                    (item.status || "").toLowerCase().includes(search) 
                ) &&
                (selected === "All" || item.status === selected)
            );
        });

        setFilteredList(searchedList);
    }

  const updateCounts = (list) => {
        const counts = {
            All: 0,
            Awaiting: 0,
            Pending: 0,
            Completed: 0,
            Cancelled: 0,
            Rejected: 0,
            NoShow: 0,
        };

      list.forEach((item) => {
          const category = item.status?.trim();
          counts["All"]++;
          if (counts[category] !== undefined) {
              counts[category]++;
          }
      });

        setCategory1Types([
            {
                id: "All",
                label: "All",
                value: "All",
                count:counts["All"] ,
            },
            {
                id: "Awaiting",
                label: "Awaiting",
                value: "Awaiting",
                count:  counts.Awaiting,
            },
            {
                id: "Pending",
                label: "Pending",
                value: "Pending",
                count: counts.Pending,
            },
            {
                id:  "Completed",
                label: "Completed",
                value: "Completed",
                count:  counts.Completed,
            },
            {
                id:"Cancelled",
                label: "Cancelled",
                value: "Cancelled",
                count:  counts.Cancelled,
            },
            {
                id:"Rejected",
                label: "Rejected",
                value: "Rejected",
                count:  counts.Rejected,
            },
            {
                id: "NoShow",
                label: "No Show",
                value: "NoShow",
                count:  counts.NoShow,
            },
        ]);
    };

    const appointmentButtonColors = {
        All: "bg-blue-50 text-blue-700 hover:bg-blue-200",
        Awaiting: "bg-gray-100 text-gray-700 hover:bg-gray-200",
        Pending: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
        Completed: "bg-green-100 text-green-700 hover:bg-green-200",
        Cancelled: "bg-red-100 text-red-700 hover:bg-red-200",
        Rejected: "bg-red-100 text-red-700 hover:bg-red-200",
        NoShow: "bg-red-100 text-red-700 hover:bg-red-200",
    };
    
    return (
        <main className="min-h-screen bg-gray-50 pb-28">

            <div className="mx-auto flex w-full max-w-2xl flex-col px-5 pt-6">

                {/* HEADER */}
                <header className="flex items-center justify-between">

                    <div>
                        <span className="text-sm text-gray-500">
                            Manage your
                        </span>

                        <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
                            Appointments
                        </h1>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                        <CalendarDays size={20} />
                    </div>

                </header>

                {/* SEARCH */}
                <div className="relative mt-6 space-y-3">
                    <SearchInput value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder='Filter and search. . . ' />
                    <TabsButton tabs={category1Types} defaultActive={selected} onChange={(tab) => setSelected(tab.value)} />
                       
                </div>


                {/* COUNT */}
                <div className="mt-7 flex items-center justify-between">

                    <h2 className="text-lg font-bold text-gray-900">
                        {selected === "All Status"
                            ? "All Appointments"
                            : `${selected} Appointments`}
                    </h2>

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
                        {filteredList.length}
                    </span>

                </div>

                {/* APPOINTMENTS */}
                <div className="mt-4 flex flex-col gap-4">

                    <IsLoading isLoading={isLoading} rows={20} input={
                        filteredList.length === 0 ?
                            <NoResults
                                title={"No appointments found"}
                                Icon={CalendarDays}
                                description={"Try changing your search or selecting another appointment status."}
                            /> :
                            filteredList.map((appointment) =>
                            {               
                                const [hours, minutes] = appointment.starttime.split(":").map(Number);
                                const slotMinutes = hours * 60 + minutes;
                                const canModify =
                                   appointment.status === "Pending" &&
                                   (
                                       get_Date(appointment.trndate,"YYYY-MM-DD") > LocalDate() ||
                                       (get_Date(appointment.trndate,"YYYY-MM-DD") === LocalDate() && slotMinutes >= currentMinutes)
                                   );
                                   
                                   return (
                                <div
                                    key={appointment.id}
                                    className="group rounded-3xl bg-white p-4 shadow-sm ring-1 ring-gray-100 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                                >

                                    {/* TOP */}
                                    <div className="flex items-start gap-4">

                                        {/* DATE BOX */}
                                        <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">

                                            <CalendarDays size={19} />

                                            <span className="mt-1 text-[10px] font-bold uppercase">
                                                {get_Date(appointment.trndate, "MMM DD")}
                                            </span>

                                        </div>

                                        {/* MAIN INFO */}
                                        <div className="min-w-0 flex-1">

                                            <div className="flex items-start justify-between gap-2">

                                                <div className="min-w-0">

                                                    <h3 className="truncate text-sm font-bold text-gray-900">
                                                        #{appointment.order_no}
                                                        
                                                    </h3>

                                                    <p className="mt-1 truncate text-xs text-gray-500 font-semibold">
                                                        
                                                         {appointment.services.map((o) => o.name).join(" | ")}
                                                    </p>

                                                </div>
                                                {canModify && 
                                                <ActionMenu placement="left" width="w-48" actions={[                                                                                                    
                                                    {
                                                        label: "Reschedule",
                                                        permission: "Edit",
                                                        icon: Pencil,
                                                        shortcut: "⌘R",
                                                        onClick: () => navigate('/Reschedule/' + encryptId(Number(appointment.id))),
                                                    },
                                                    {
                                                        label: "Cancel",
                                                        permission: "Edit",
                                                        icon: X,
                                                        shortcut: "⌘C",
                                                        onClick: () => navigate('/Cancel/' + encryptId(Number(appointment.id))),
                                                    }
                                                ]} />
                                            }

                                            </div>

                                            {/* STATUS */}
                                            <div className="mt-2">
                                                <div className="flex flex-row items-center gap-2">
                                                    <Tags title={appointment.status} dot size='xs' />
                                                    {appointment.paymentstatus === 'Paid' && <Tags title={"Paid"} color="green" dot size='xs' />}
                                                </div>
                                            </div>

                                        </div>

                                    </div>

                                    {/* DETAILS */}
                                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-gray-100 pt-3">

                                        <span className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <CalendarDays
                                                size={13}
                                                className="text-gray-400"
                                            />
                                            {get_Date(appointment.trndate, "MMM DD, YYYY")}
                                        </span>

                                        <span className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <Clock3
                                                size={13}
                                                className="text-gray-400"
                                            />
                                            {appointment.slot}
                                        </span>

                                    </div>

                                     {/* Employess */}
                                    <div className="mt-3 flex items-center justify-between">

                                        <span className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <Users
                                                size={13}
                                                className="text-gray-400"
                                            />
                                            {
                                                userList.find(
                                                    (item) => item.id.toString() === appointment.uid.toString()
                                                )?.fullname || ""
                                            }
                                        </span>
                                    </div>
                                

                                    {/* BOTTOM */}
                                    <div className="mt-3 flex items-center justify-between">

                                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                            <MapPin size={13} />
                                            <span className="max-w-[280px] truncate text-sky-600 cursor-pointer" onClick={() => openMaps(address)}>
                                                {address}
                                            </span>
                                        </div>

                                        <span className="text-base font-bold text-gray-900">
                                            ${appointment.total}
                                        </span>

                                    </div>
                                    <button
                                        onClick={() => navigate('/View/' + encryptId(appointment.id))}
                                        className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition ${appointmentButtonColors[appointment.status]}`}
                                    >
                                        View Detail
                                        <ChevronRight size={15} />
                                    </button>
                                </div>

                            )})} />

                </div>

            </div>

        </main>
    );
}
