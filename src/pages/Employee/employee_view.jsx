/* eslint-disable react-hooks/exhaustive-deps */
import  { useEffect, useState } from "react";
import {
    ArrowLeft,
    Star,
    Clock3,
    CalendarDays,
    CheckCircle2,
    MapPin,
    UserRound,
    BriefcaseBusiness,
    ChevronRight,
} from "lucide-react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useAlert } from "../../controls/AlertProvider.jsx";
import { decryptId, encryptId, getExperience, openMaps } from "../../common/general.jsx";
import FetchData from "../../hook/fetchData.js";
import { Button, Image } from "../../controls/index.jsx";
import { LocalDate } from "../../common/localDate.js";
import { convertTo12Hour } from "../../common/generateTimeSlots.js";
import { IsLoading } from "../../common/index.jsx";

export default function EmployeeView() {
const navigate = useNavigate();
    const { showAlert } = useAlert();
    const {companyList} = useOutletContext();
    const [isLoading, setIsLoading] = useState(false);
    const { Id } = useParams();
    const id = decryptId(Id);
    const isEdit = !!id;

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
    const defaultTimingInfo = [{
        monday: ["09:00:00", "21:00:00", true, "14:00:00", "14:30:00"],
        tuesday: ["09:00:00", "21:00:00", true, "14:00:00", "14:30:00"],
        wednesday: ["09:00:00", "21:00:00", true, "14:00:00", "14:30:00"],
        thursday: ["09:00:00", "21:00:00", true, "14:00:00", "14:30:00"],
        friday: ["09:00:00", "21:00:00", true, "14:00:00", "14:30:00"],
        saturday: ["09:00:00", "21:00:00", true, "14:00:00", "14:30:00"],
        sunday: ["09:00:00", "21:00:00", true, "14:00:00", "14:30:00"],
    }];

    const [form, setForm] = useState({
            id: null,
            cid: null,
            username: "",
            password: "",
            role: "Employee",
            status: "Active",
            createdat: null,
            modifiedat: null,
            email: "",
            cell: "",
            rating: "0",
            fullname: "",
            accounttype: "",
            gender: "Male",
            address: "",
            appschedule: true,
            bio:"",
            joining:LocalDate(),
            timinginfo: defaultTimingInfo,
            permissioninfo: [],
            profilepic: null,
        });

        
    useEffect(() => {
        if (!isEdit) return;

        const getById = async (id) => {
            setIsLoading(true);

            try {
                const Response = await FetchData({
                    endPoint: 'user',
                    id: id
                });
                if (Response.status === 200) {
                    setForm({
                        ...Response.data,
                        timinginfo: Response.data.timinginfo ?? defaultTimingInfo,
                    });
                }
                else {
                    showAlert({
                        type: "error",
                        message: "Not Found",
                        duration: 5000,
                    });
                    navigate(-1);
                }
                // set state here
            } catch (error) {
                showAlert({
                    type: "error",
                    message: error,
                    duration: 5000,
                });
                navigate(-1);
            } finally {
                setIsLoading(false);
            }
        };

        getById(id);
    }, [id, isEdit]);

    const days = Object.entries(form.timinginfo?.[0] || {}).map(([day, value]) => ({
        key: day,
        day: day.charAt(0).toUpperCase() + day.slice(1),
        start: value[0],
        end: value[1],
        working: value[2],
        breakon: value[3],
        breakoff: value[4],
    }));

   

    return (
        <main className="min-h-screen bg-gray-50 pb-32">
           
<IsLoading isLoading={isLoading} rows={10} input={
            <div className="mx-auto flex w-full max-w-2xl flex-col">

                {/* PROFILE HERO */}
                <div className="relative h-80 w-full overflow-hidden">

                    <Image
                        rounded="rounded-none"
                        className=" object-cover transition duration-500 group-hover:scale-105"
                        height="h-full"
                        width="w-full"
                        src={form.profilepic}
                        name={form.fullname}/>

                    {/* Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />

                    {/* BACK */}
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md transition hover:bg-black/50"
                    >
                        <ArrowLeft size={21} />
                    </button>

                    {/* PROFILE */}
                    <div className="absolute bottom-5 left-5 right-5">

                        <div className="flex items-end justify-between gap-4">

                            <div className="min-w-0">

                                <span className="inline-flex rounded-full bg-cyan-500/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                                    {form.role}
                                </span>

                                <h1 className="mt-2 truncate text-2xl font-bold text-white">
                                    {form.fullname}
                                </h1>

                                <p className="mt-1 flex items-center gap-1.5 text-xs text-white/75">
                                    <MapPin size={13} />
                                    {companyList?.name || ''}
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

                {/* CONTENT */}
                <div className="flex flex-col px-5">

                    {/* RATING / EXPERIENCE */}
                    <div className="mt-5 grid grid-cols-2 gap-3">

                        <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-50 text-yellow-500">
                                <Star
                                    size={19}
                                    fill="currentColor"
                                />
                            </div>

                            <div>
                                <p className="text-[10px] text-gray-400">
                                    Rating
                                </p>

                                <p className="mt-0.5 text-sm font-bold text-gray-900">
                                    {form.rating}
                                   {/* <span className="ml-1 text-xs font-normal text-gray-400">
                                        ({employeeData.reviews})
                                    </span>*/}
                                </p>
                            </div>

                        </div>

                        <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                                <BriefcaseBusiness size={18} />
                            </div>

                            <div>
                                <p className="text-[10px] text-gray-400">
                                    Experience
                                </p>

                                <p className="mt-0.5 text-sm font-bold text-gray-900">
                                    {getExperience(form.joining) }
                                </p>
                            </div>

                        </div>

                    </div>

                    {/* BUSINESS */}
                    <button className="mt-4 flex items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-gray-100">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                            <MapPin size={20} />
                        </div>


                        <div className="min-w-0 flex-1" onClick={() => openMaps(address)}>

                            <p className="text-sm font-bold text-gray-900">
                                {companyList?.name || ''}
                            </p>

                            <p className="mt-1 truncate text-xs text-gray-500">
                                {address}
                            </p>

                        </div>

                        <ChevronRight
                            size={18}
                            className="text-gray-300"
                        />

                    </button>

                    {/* ABOUT */}
                    <section className="mt-7">

                        <h2 className="text-lg font-bold text-gray-900">
                            About {form.fullname.split(" ")[0]}
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-gray-500">
                            {form.bio || "Dedicated and professional team member committed to providing excellent service and creating a positive experience for every customer. With a strong focus on quality, attention to detail, and customer satisfaction, they bring a friendly and reliable approach to every appointment. Passionate about their work and always focused on delivering the best possible results."}
                        </p>

                    </section>

                    {/* SPECIALTIES 
                    <section className="mt-7">

                        <h2 className="text-lg font-bold text-gray-900">
                            Specialties
                        </h2>

                        <div className="mt-3 flex flex-wrap gap-2">

                            {employeeData.specialties.map(
                                (specialty, index) => (
                                    <span
                                        key={index}
                                        className="rounded-full bg-cyan-50 px-3 py-2 text-xs font-semibold text-cyan-700"
                                    >
                                        {specialty}
                                    </span>
                                )
                            )}

                        </div>

                    </section>
                    */}

                    {/* AVAILABILITY */}
                    <section className="mt-7">

                        <div className="flex items-center justify-between">

                            <div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    Availability
                                </h2>

                                <p className="mt-1 text-xs text-gray-500">
                                    Weekly working schedule
                                </p>
                            </div>

                            <CalendarDays
                                size={20}
                                className="text-cyan-500"
                            />

                        </div>

                        <div className="mt-4 flex flex-col gap-2">

                            {days.map((day) => {

                                const isAvailable =day.working;

                                return (
                                    <div
                                        key={day.key}
                                        className={`flex items-center justify-between rounded-2xl p-4 ${
                                            isAvailable
                                                ? "bg-white ring-1 ring-gray-100"
                                                : "bg-gray-100/70"
                                        }`}
                                    >

                                        <div className="flex items-center gap-3">

                                            <div
                                                className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                                                    isAvailable
                                                        ? "bg-green-50 text-green-600"
                                                        : "bg-gray-200 text-gray-400"
                                                }`}
                                            >
                                                {isAvailable ? (
                                                    <CheckCircle2 size={17} />
                                                ) : (
                                                    <Clock3 size={17} />
                                                )}
                                            </div>

                                            <span
                                                className={`text-sm font-semibold ${
                                                    isAvailable
                                                        ? "text-gray-900"
                                                        : "text-gray-400"
                                                }`}
                                            >
                                                {day.day}
                                            </span>

                                        </div>

                                        <span
                                            className={`text-xs font-medium ${
                                                isAvailable
                                                    ? "text-gray-500"
                                                    : "text-gray-400"
                                            }`}
                                        >
                                            {isAvailable ? `${convertTo12Hour(day.start)} - ${convertTo12Hour(day.end)}` : "Not available"}
                                        </span>

                                    </div>
                                );
                            })}

                        </div>

                    </section>

                    {/* BOOKING INFO */}
                    <section className="mt-7 rounded-3xl bg-gray-900 p-5 text-white">

                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/Create", {
                            state: {
                                value: encryptId(form.id),
                                type: "employee"
                            }
                        })}>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                                <UserRound size={21} />
                            </div>

                            <div>
                                <h3 className="text-sm font-bold">
                                    Book with {form.fullname.split(" ")[0]}
                                </h3>

                                <p className="mt-1 text-xs text-gray-400">
                                    Select a service, date and available time.
                                </p>
                            </div>

                        </div>

                    </section>

                </div>

            </div> }/>

            {/* FIXED BOOK BUTTON */}
            <div className="fixed bottom-0 left-0 z-40 w-full border-t border-gray-200 bg-white/95 p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md">

                <div className="mx-auto flex max-w-2xl items-center gap-3">


                    <Button variant="primary" className="flex-1" icon={CalendarDays} label="Book Appointment"
                        onClick={() => navigate("/Create", {
                            state: {
                                value: encryptId(form.id),
                                type: "employee"
                            }
                        })} />

                </div>

            </div>

        </main>
    );
}
