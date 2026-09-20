/* eslint-disable react-hooks/exhaustive-deps */
import  { useEffect, useState } from "react";
import {
    ArrowLeft,
    CalendarDays,
    Clock3,
    MapPin,
    CheckCircle2,
    XCircle,
    ChevronRight,
    Ban,
    UserX,
    Sparkles,
    Boxes,
    Users,
} from "lucide-react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useAlert } from "../../controls/AlertProvider";
import { decryptId, encryptId, openMaps } from "../../common/general.jsx";
import FetchData from "../../hook/fetchData";
import { get_Date, LocalDate } from "../../common/localDate";
import { Tags } from "../../controls/tags.jsx";
import { Image } from "../../controls/image.jsx";
import { IsLoading } from "../../common/isLoading.jsx";

export default function AppointmentView() {
    const navigate = useNavigate();
    const { companyList,  getUser } = useOutletContext();
    const { showAlert } = useAlert();
    const [isLoading, setIsLoading] = useState(false);
    const { Id } = useParams();
    const id = decryptId(Id);
    const isEdit = !!id;

    const [userList, setUserList] = useState([]);

    const [form, setForm] = useState({
        id: null,
        cid: null,
        status: "Pending",
        order_no: "0",
        trndate: LocalDate(),
        slot: "",
        starttime: "",
        endtime: "",
        uid: 0,
        services: [],
        products: [],
        subtotal: 0,

        coupon: "",
        isdiscount: false,
        discounttype: "coupon",
        discount: "0",

        istax: false,
        tax: 0,
        taxpercentage: 0,

        total: 0,
        tip: 0,
        bookedvia: "Walk-In",


        custid: 0,
        name: "",
        cell: "",
        email: "",
        reason: "",
        notes: "",
        additionalnotes: "",

        payments: [],
        logs: [],
        paymentstatus: 'Unpaid',

        referral: 0,
        isnewcustomer: false,
        points: 0,
        referralpoints: 0,
        punchpoints: 0,
        badgepoints: 0,
        pointsused: 0,
        createdat: null,
        modifiedat: null,
    });

    useEffect(() => {
        Init();
    }, [])

    const Init = async () => {
        setIsLoading(true);
        const [UserResponse] = await Promise.all([getUser(false)]);
        setUserList(UserResponse);
        setIsLoading(false);
    };

    useEffect(() => {
        if (!isEdit) return;

        const getById = async (id) => {
            setIsLoading(true);

            try {
                const Response = await FetchData({
                    endPoint: 'appointment',
                    id: id
                });
                if (Response.status === 200) {
                    setForm(Response.data);
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
    
    const employee = userList.find((item) => item.id.toString() === form.uid.toString())
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
                                                        
    const APPOINTMENT_STATUS_MESSAGE = {
        Awaiting: {
            heading: "Appointment awaiting confirmation",
            message: "This appointment is waiting for confirmation. Please check back once the business has reviewed your request.",
            icon: Clock3,
            iconBg: "bg-gray-100",
            iconColor: "text-gray-600",
        },
        Pending: {
            heading: "Appointment confirmed",
            message: "Your appointment has been successfully confirmed. We look forward to seeing you.",
            icon: Clock3,
            iconBg: "bg-yellow-50",
            iconColor: "text-yellow-600",
        },
        Completed: {
            heading: "Appointment completed",
            message: "Your appointment has been successfully completed. Thank you for choosing us!",
            icon: CheckCircle2,
            iconBg: "bg-green-50",
            iconColor: "text-green-600",
        },
        Cancelled: {
            heading: "Appointment cancelled",
            message: "This appointment has been cancelled. You can book a new appointment whenever you're ready.",
            icon: XCircle,
            iconBg: "bg-red-50",
            iconColor: "text-red-600",
        },
        Rejected: {
            heading: "Appointment rejected",
            message: "Unfortunately, this appointment request was rejected by the business. Please choose another available time.",
            icon: Ban,
            iconBg: "bg-red-50",
            iconColor: "text-red-600",
        },
        NoShow: {
            heading: "Appointment marked as no show",
            message: "This appointment was marked as a no-show because the appointment was not attended.",
            icon: UserX,
            iconBg: "bg-red-50",
            iconColor: "text-red-600",
        },
    };

    const statusInfo = APPOINTMENT_STATUS_MESSAGE[form.status];

    const StatusIcon = statusInfo.icon;


    const today = new Date();
    const currentMinutes = today.getHours() * 60 + today.getMinutes();
    const [hours, minutes] = form.starttime.split(":").map(Number);
    const slotMinutes = hours * 60 + minutes;
    const canModify =
    form.status === "Pending" &&
    (
        get_Date(form.trndate,"YYYY-MM-DD") > LocalDate() ||
        (get_Date(form.trndate,"YYYY-MM-DD") === LocalDate() && slotMinutes >= currentMinutes)
    );

    const invoiceTotal = Number(form.total).toFixed(2);

    const totalReceived = form.payments.reduce(
        (sum, payment) => sum + (parseFloat(payment.amount) || 0),
        0
    );
    const tip = totalReceived > invoiceTotal
        ? totalReceived - invoiceTotal
        : 0;

    const balance = totalReceived < invoiceTotal
        ? invoiceTotal - totalReceived
        : 0;

    return (
        <main className="min-h-screen bg-gray-50 pb-32">
           <IsLoading isLoading={isLoading} rows={10} input={
            <div className="mx-auto flex w-full max-w-2xl flex-col">
                {/* HEADER */}
                <div className="relative overflow-hidden bg-gray-900 px-5 pb-8 pt-5">
                    <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-cyan-500/10 blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-blue-500/10 blur-3xl" />

                    <div className="relative flex items-center justify-between">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
                        >
                            <ArrowLeft size={21} />
                        </button>

                        <span className="text-xs font-semibold tracking-wide text-white/50">
                            #{form.order_no}
                        </span>
                    </div>

                    <div className="relative mt-8">
                        <p className="text-xs font-medium text-cyan-400">
                            Appointment Details
                        </p>

                        <h1 className="mt-2 text-2xl font-bold text-white">
                            {form.services.map((o) => o.name).join(" | ")}
                        </h1>

                        <div className="mt-4 flex items-center gap-2">
                            <Tags title={form.status} dot size='xs'/>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col px-5">
                    {/* APPOINTMENT DATE & TIME */}
                    <div className="-mt-4 relative rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                                    <CalendarDays size={20} />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[10px] font-medium text-gray-400">
                                        Date
                                    </p>
                                    <p className="mt-1 text-xs font-bold leading-5 text-gray-900">
                                        {get_Date(form.trndate,'dddd , MMM DD YYYY')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                    <Clock3 size={20} />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[10px] font-medium text-gray-400">
                                        Time
                                    </p>
                                    <p className="mt-1 text-xs font-bold leading-5 text-gray-900">
                                        {form.slot}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* MESSAGE */}
                    <section className="mt-5 rounded-3xl bg-cyan-50 p-5 ring-1 ring-cyan-100">
                        <div className="flex items-start gap-3">
                            <div
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${statusInfo.iconBg} ${statusInfo.iconColor} shadow-sm`}
                            >
                                <StatusIcon size={19} />
                            </div>

                            <div>
                                <h2 className="text-sm font-bold text-gray-900">
                                    {statusInfo.heading}
                                </h2>

                                <p className="mt-1.5 text-xs leading-5 text-gray-600">
                                    {(form.status === "Cancelled" || form.status === "Rejected" )? (form.reason || statusInfo.message) : statusInfo.message}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* SERVICE */}
                    <section className="mt-7">
                        <h2 className="text-lg font-bold text-gray-900">
                            Services
                        </h2>

                        {form.services.map(o => (

                            <div className="mt-3 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 cursor-pointer" 
                            onClick={() => navigate('/Service/View/' + encryptId(o.id))}>
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                                    <Sparkles size={20} />
                                </div>
                                

                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-bold text-gray-900">
                                        {o.name}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500">
                                        {o.minutes} Minutes
                                    </p>
                                </div>

                                <p className="text-sm font-bold text-gray-900">
                                    ${o.price}
                                </p>
                            </div>
                        ))}
                    </section>

                    {/* Products */}
                    {form.products.length > 0 && <section className="mt-7">
                        <h2 className="text-lg font-bold text-gray-900">
                            Products
                        </h2>

                        {form.products.map(o => (
                            <div className="mt-3 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                                    <Boxes size={20} />
                                </div>


                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-bold text-gray-900">
                                        {o.name}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500">
                                        {o.unit} Unit
                                    </p>
                                </div>

                                <p className="text-sm font-bold text-gray-900">
                                    ${o.sellprice}
                                </p>
                            </div>
                        ))}
                    </section>}

                    {/* EMPLOYEE */}
                    <section className="mt-7">
                        <h2 className="text-lg font-bold text-gray-900">
                            Your Specialist
                        </h2>

                        <div className="mt-3 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 cursor-pointer"
                         onClick={() =>navigate('/Employee/View/' + encryptId(employee?.id))}>
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-sm font-bold text-white">
                                <Image
                                    rounded="rounded-xl"
                                    className=" object-cover transition duration-500 group-hover:scale-105"
                                    height="h-12"
                                    width="w-12"
                                    src={employee?.profilepic || null}
                                    name={employee?.fullname || ''} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-bold text-gray-900">
                                    {employee?.fullname || ''}
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                    {employee?.role || ''}
                                </p>
                            </div>

                            <Users size={18} className="text-gray-300" />
                        </div>
                    </section>

                    {/* BUSINESS */}
                    <section className="mt-7">
                        <h2 className="text-lg font-bold text-gray-900">
                            Location
                        </h2>

                        <button className="mt-3 flex w-full items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-gray-100" 
                        onClick={() => openMaps(address)}>
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                                <MapPin size={20} />
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-bold text-gray-900">
                                    {companyList?.name || ""}
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
                    </section>

                    {/* Totals */}
                    <section className="mt-7">
                        <h2 className="text-lg font-bold text-gray-900">
                            Summary
                        </h2>

                        <div className="mt-3 space-y-2 rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-gray-100">

                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Subtotal</span>
                                <span>${Number(form.subtotal).toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between items-center text-sm text-red-600">
                                <span>Discount
                                    {form.isdiscount &&
                                        <span className="text-xs"> {`( ${form.coupon || form.discounttype} )`}</span>}
                                </span>
                                <span>-${Number(form.discount).toFixed(2)}</span>
                            </div>

                            {form.istax &&
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Tax</span>
                                    <span>
                                        ${Number(form.tax).toFixed(2)}
                                    </span>
                                </div>
                            }


                            <div className="my-2 border-t" />


                            <div className={`flex justify-between text-lg font-bold text-gray-900 ${form.total < 0 && "text-red-600"}`}>
                                <span>Total</span>
                                <span>
                                    ${Number(form.total).toFixed(2)}
                                </span>
                            </div>

                            {/* Payments */}
                            {form.payments.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm text-gray-600">
                                    <span>{item.paymenttype}</span>
                                    <span>${Number(item.amount).toFixed(2)}</span>
                                </div>
                            ))}


                            {tip > 0 && <div className="flex justify-between text-sm text-gray-600">
                                <span>Tip</span>
                                <span>${Number(tip).toFixed(2)}</span>
                            </div>}

                            <div className="my-2 border-t" />

                            <div className={`flex justify-between text-lg font-bold text-gray-900 ${balance > 0 && "text-red-600"}`}>
                                <span>Balance</span>
                                <span>
                                    {balance > 0 && "-"} ${Number(balance).toFixed(2)}
                                </span>
                            </div>

                        </div>

                    </section>


                    {/* APPOINTMENT INFO 
                    <section className="mt-7 rounded-3xl bg-gray-900 p-5 text-white">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400">
                                <StatusIcon size={21} />
                            </div>

                            <div>
                                <h3 className="text-sm font-bold">
                                    {appointmentData.status}
                                </h3>

                                <p className="mt-1 text-xs leading-5 text-gray-400">
                                    {appointmentData.status === "Pending"
                                        ? "Your appointment is waiting for confirmation."
                                        : appointmentData.status === "Awaiting"
                                            ? "The business is reviewing your appointment request."
                                            : appointmentData.status ===
                                                "Completed"
                                                ? "Thank you for visiting. We hope to see you again."
                                                : appointmentData.status ===
                                                    "Cancelled"
                                                    ? "This appointment is no longer active."
                                                    : "Appointment information and status."}
                                </p>
                            </div>
                        </div>
                    </section>*/}
                </div>
            </div>
            }/>

            {/* BOTTOM ACTIONS */}
            {canModify && (
                <div className="fixed bottom-0 left-0 z-40 w-full border-t border-gray-200 bg-white/95 p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md">
                    <div className="mx-auto flex max-w-2xl gap-3">
                        <button
                            onClick={() => navigate('/Cancel/' + encryptId(form.id))}
                            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 text-sm font-bold text-red-600 transition hover:bg-red-100 active:scale-[0.98]"
                        >
                            <XCircle size={18} />
                            Cancel Booking
                        </button>

                        <button
                            onClick={() => navigate('/Reschedule/' + encryptId(form.id))}
                            className="flex h-12 flex-[1.4] items-center justify-center gap-2 rounded-2xl bg-cyan-500 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400 active:scale-[0.98]"
                        >
                            <CalendarDays size={18} />
                            Reschedule
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}

