
import React, { useEffect, useState } from "react";
import {
    ArrowLeft,
    CalendarDays,
    Clock3,
    UserRound,
    Scissors,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Sparkles,
    Users,
} from "lucide-react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useAlert } from "../../controls/AlertProvider";
import { decryptId, updateField } from "../../common/general.jsx";
import { get_Date, LocalDate } from "../../common/localDate";
import { IsLoading } from "../../common";
import { Image } from "../../controls";
import FetchData from "../../hook/fetchData";
import { EMAIL_STATUS } from "../../common/enum";

export default function CancelAppointment() {
    const navigate = useNavigate();
    const { saveData, refresh, companyList, userList } = useOutletContext();
    const { showAlert } = useAlert();
    const [isLoading, setIsLoading] = useState(false);
    const { Id } = useParams();
    const id = decryptId(Id);
    const isEdit = !!id;


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

    const [reason, setReason] = useState("");
    const reasons = [
        "I need to change my appointment",
        "I am no longer available",
        "I booked the wrong service",
        "I found another time that works better",
        "Something came up",
        "Other",
    ];

    const handleConfirm = () => {
        if (!reason) return;

       /* onConfirm?.({
            ...appointmentData,
            cancellationReason: reason,
        });*/
    };
    const handleEmail = async (res) => {

        if (!Boolean(companyList?.emailreminder))
            return;

        const appointment_id = res.data.id || "0";
        const order_no = res.data.order_no || "0";
        const toEmail = res.data.email || "";

        const emailRes = await FetchData({
            method: "POST",
            endPoint: 'appointment-mail',
            id: null,
            body: JSON.stringify({
                id: appointment_id,
                status: EMAIL_STATUS.CANCELLED
            })
        });

        if (emailRes?.status === 200 && (emailRes?.data?.accepted || []).length > 0) {
          await saveData({
                label: "Logs",
                endPoint: "logs",
                id: null,
                body: {
                    id: null,
                    cid: null,
                    type: "Email",
                    order_no: order_no,
                    sendfrom: companyList?.emailuser || "",
                    sendto: toEmail,
                    message: `${EMAIL_STATUS.CANCELLED} E-Mail have been sent successfully.`,
                    status: "Delivered",
                    oid: appointment_id,
                    createdat: null,
                    modifiedat:null
                },
                notify: false,
            });
        }
    }
     const handleSubmit = async () => {
         if (!reason) return;
        setIsLoading(true);

        try {       

            const res = await saveData({
                label: "Appointment",
                endPoint: "appointment",
                id: id ,
                body: {
                    ...form,
                    status: "Cancelled",                
                }
            });

            await handleEmail(res);

            if (res.isSuccess) {
                navigate(-1);
            }
        } catch (error) {
             showAlert({
                    type: "error",
                    message: `Error saving appointment: ${error}`,
                    duration: 5000,
                });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 pb-32">
            <div className="mx-auto flex w-full max-w-2xl flex-col">
                {/* HEADER */}
                <div className="bg-gray-900 px-5 pb-8 pt-5">

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

                    <div className="mt-8">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/15 text-red-400">
                            <XCircle size={25} />
                        </div>

                        <h1 className="mt-4 text-2xl font-bold text-white">
                            Cancel Appointment
                        </h1>

                        <p className="mt-2 text-sm leading-5 text-gray-400">
                            We're sorry to see you cancel. Please review your
                            appointment and tell us why you're cancelling.
                        </p>
                    </div>
                </div>

                <IsLoading isLoading={isLoading} rows={20} input={
                    <div className="flex flex-col px-5">
                        {/* WARNING */}
                        <div className="-mt-4 relative flex items-start gap-3 rounded-3xl bg-amber-50 p-5 shadow-sm ring-1 ring-amber-100">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-amber-500 shadow-sm">
                                <AlertTriangle size={19} />
                            </div>

                            <div>
                                <h2 className="text-sm font-bold text-gray-900">
                                    Before you cancel
                                </h2>

                                <p className="mt-1.5 text-xs leading-5 text-gray-600">
                                    Please make sure you want to cancel this
                                    appointment. If you simply need a different
                                    time, you can reschedule instead.
                                </p>
                            </div>
                        </div>

                        {/* REASON */}
                        <section className="mt-7">
                            <h2 className="text-lg font-bold text-gray-900">
                                Why are you cancelling?
                            </h2>

                            <p className="mt-1 text-xs text-gray-500">
                                Select a reason for cancelling your appointment.
                            </p>

                            <div className="mt-4 flex flex-col gap-2">
                                {reasons.map((item) => {
                                    const selected = reason === item;

                                    return (
                                        <button
                                            key={item}
                                            type="button"
                                            onClick={() => {setReason(item);  updateField("reason", item,setForm)}}
                                            className={`flex w-full items-center gap-3 rounded-2xl p-4 text-left transition ${selected
                                                    ? "bg-red-50 ring-2 ring-red-500"
                                                    : "bg-white ring-1 ring-gray-100 hover:ring-gray-200"
                                                }`}
                                        >
                                            {/* RADIO */}
                                            <div
                                                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${selected
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                    }`}
                                            >
                                                {selected && (
                                                    <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                                                )}
                                            </div>

                                            <span
                                                className={`text-sm ${selected
                                                        ? "font-semibold text-gray-900"
                                                        : "font-medium text-gray-600"
                                                    }`}
                                            >
                                                {item}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        {/* APPOINTMENT */}
                        <section className="mt-7">
                            <h2 className="text-lg font-bold text-gray-900">
                                Appointment
                            </h2>

                            <div className="mt-3 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100">
                                {/* SERVICE */}
                                <div className="flex items-center gap-3 border-b border-gray-100 p-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                                        <Sparkles size={19} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="text-[10px] font-medium text-gray-400">
                                            Service
                                        </p>

                                        <p className="mt-0.5 truncate text-sm font-bold text-gray-900">
                                             {form.services.map((o) => o.name).join(" | ")}
                                        </p>
                                    </div>
                                </div>

                                {/* DATE */}
                                <div className="flex items-center gap-3 border-b border-gray-100 p-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                        <CalendarDays size={19} />
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-medium text-gray-400">
                                            Date
                                        </p>

                                        <p className="mt-0.5 text-sm font-bold text-gray-900">
                                             {get_Date(form.trndate,'dddd , MMM DD YYYY')}
                                        </p>
                                    </div>
                                </div>

                                {/* TIME */}
                                <div className="flex items-center gap-3 border-b border-gray-100 p-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                                        <Clock3 size={19} />
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-medium text-gray-400">
                                            Time
                                        </p>

                                        <p className="mt-0.5 text-sm font-bold text-gray-900">
                                            {form.slot}
                                        </p>
                                    </div>
                                </div>

                                {/* EMPLOYEE */}
                                <div className="flex items-center gap-3 p-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-xs font-bold text-white">
                                        <Image
                                            rounded="rounded-xl"
                                            className=" object-cover transition duration-500 group-hover:scale-105"
                                            height="h-12"
                                            width="w-12"
                                            src={employee?.profilepic || null}
                                            name={employee?.fullname || ''} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="text-[10px] font-medium text-gray-400">
                                            Specialist
                                        </p>

                                        <p className="mt-0.5 text-sm font-bold text-gray-900">
                                            {employee?.fullname || ''}
                                        </p>

                                        <p className="mt-0.5 text-xs text-gray-500">
                                            {employee?.role || ''}
                                        </p>
                                    </div>

                                    <Users
                                        size={18}
                                        className="text-gray-300"
                                    />
                                </div>
                            </div>
                        </section>

                        

                        {/* MESSAGE */}
                        <section className="mt-7 rounded-3xl bg-gray-900 p-5 text-white">
                            <div className="flex items-start gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/15 text-red-400">
                                    <AlertTriangle size={20} />
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold">
                                        Cancellation notice
                                    </h3>

                                    <p className="mt-1 text-xs leading-5 text-gray-400">
                                        Once cancelled, this appointment will no
                                        longer be reserved for you. Cancellation
                                        policies may apply.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <div className="h-5" />
                    </div>} />
            </div>

            {/* BOTTOM ACTION */}
            <div className="fixed bottom-0 left-0 z-40 w-full border-t border-gray-200 bg-white/95 p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md">
                <div className="mx-auto flex max-w-2xl gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex h-12 flex-1 items-center justify-center rounded-2xl border border-gray-200 bg-white text-sm font-bold text-gray-700 transition hover:bg-gray-50 active:scale-[0.98]"
                    >
                        Keep Appointment
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={!reason || !form.reason  || isLoading}
                        className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-red-500 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition hover:bg-red-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isLoading ? (
                            "Cancelling..."
                        ) : (
                            <>
                                Cancel Appointment
                                <XCircle size={18} />
                            </>
                        )}
                    </button>
                </div>
            </div>

        </main>
    );
}

