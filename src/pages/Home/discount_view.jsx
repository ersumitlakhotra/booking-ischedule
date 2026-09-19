/* eslint-disable react-hooks/exhaustive-deps */
import {
    ArrowLeft,
    Tag,
    CalendarDays,
    Clock3,
    Copy,
    ChevronRight,
    Info,
    Sparkles,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAlert } from "../../controls/AlertProvider.jsx";
import { useEffect, useState } from "react";
import { decryptId, encryptId } from "../../common/general.jsx";
import { get_Date, LocalDate } from "../../common/localDate.js";
import { IsLoading } from "../../common/index.jsx";
import FetchData from "../../hook/fetchData.js";

export default function CouponView() {
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const [isLoading, setIsLoading] = useState(false);
    const { Id } = useParams();
    const id = decryptId(Id);
    const isEdit = !!id;
    const date = LocalDate();

    const [form, setForm] = useState({
        id: null,
        cid: null,
        name: "",
        description: "",
        startdate: date,
        enddate: date,
        discount: "",
        discounttype: "$",
        coupon: Math.random().toString(36).substring(2, 10).toUpperCase(),
        newcustomer: false,
        onetime: false,
        upto: 0,
        services: [],
        createdat: null,
        modifiedat: null,
    });

    useEffect(() => {
        if (!isEdit) return;

        const getById = async (id) => {
            setIsLoading(true);

            try {
                const Response = await FetchData({
                    endPoint: 'discount',
                    id: id
                });
                if (Response.status === 200) {
                    setForm({
                        ...Response.data,
                        startdate: get_Date(Response.data.startdate, 'YYYY-MM-DD'),
                        enddate: get_Date(Response.data.enddate, 'YYYY-MM-DD')
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

    const discountText =
        form.discounttype === "%"
            ? `${form.discount}%`
            : `$${form.discount}`;

    const discountLabel = "OFF";
    const discountDescription = form.description || `Enjoy ${discountText} off your appointment and discover a better way to experience our services.`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(form.coupon);
        } catch {
            // Clipboard may not be available
        }
    };

    return (
        <IsLoading isLoading={isLoading} rows={20} input={
            <main className="min-h-screen bg-gray-50 pb-32">


                <div className="mx-auto flex w-full max-w-2xl flex-col">
                    {/* HEADER */}
                    <div className="relative overflow-hidden bg-gray-900 px-5 pb-10 pt-5">
                        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
                        <div className="absolute -bottom-24 -left-20 h-60 w-60 rounded-full bg-blue-500/10 blur-3xl" />

                        <div className="relative flex items-center justify-between">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
                            >
                                <ArrowLeft size={21} />
                            </button>

                        </div>

                        <div className="relative mt-8 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-400">
                                <Tag size={27} />
                            </div>

                            <p className="mt-4 text-xs font-medium text-cyan-400">
                                Special Offer
                            </p>

                            <h1 className="mt-2 text-2xl font-bold text-white">
                                {form.name}
                            </h1>
                        </div>
                    </div>

                    <div className="flex flex-col px-5">
                        {/* COUPON CARD */}
                        <div className="-mt-5 relative overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-100">
                            {/* TOP DISCOUNT */}
                            <div className="border-b border-dashed border-gray-200 px-5 py-7 text-center">
                                <p className="text-xs font-medium text-gray-400">
                                    Your discount
                                </p>

                                <div className="mt-1 flex items-baseline justify-center gap-2">
                                    <span className="text-5xl font-black tracking-tight text-cyan-600">
                                        {discountText}
                                    </span>

                                    <span className="text-sm font-bold text-gray-500">
                                        {discountLabel}
                                    </span>
                                </div>

                                <p className="mx-auto mt-3 max-w-sm text-xs leading-5 text-gray-500">
                                    {discountDescription}
                                </p>
                            </div>

                            {/* COUPON CODE */}
                            <div className="bg-gray-50 p-5">
                                <p className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                    Coupon Code
                                </p>

                                <div className="mt-3 flex items-center gap-2 rounded-2xl border border-dashed border-cyan-300 bg-white p-2 pl-4">
                                    <span className="flex-1 text-sm font-black tracking-[0.18em] text-gray-900">
                                        {form.coupon}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={handleCopy}
                                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 transition hover:bg-cyan-100"
                                    >
                                        <Copy size={17} />
                                    </button>
                                </div>
                            </div>

                            {/* NOTCHES */}
                            <div className="absolute -left-3 top-[55%] h-6 w-6 rounded-full bg-gray-50" />
                            <div className="absolute -right-3 top-[55%] h-6 w-6 rounded-full bg-gray-50" />
                        </div>

                        {/* VALIDITY */}
                        <section className="mt-7">
                            <h2 className="text-lg font-bold text-gray-900">
                                Coupon Details
                            </h2>

                            <div className="mt-3 grid grid-cols-2 gap-3">
                                <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                                        <CalendarDays size={18} />
                                    </div>

                                    <p className="mt-3 text-[10px] text-gray-400">
                                        Valid Until
                                    </p>

                                    <p className="mt-1 text-sm font-bold text-gray-900">
                                        {get_Date(form.startdate, "MMMM DD, YYYY")}
                                    </p>
                                </div>
                                <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                                        <Sparkles size={18} />
                                    </div>

                                    <p className="mt-3 text-[10px] text-gray-400">
                                        Applies To
                                    </p>

                                    <p className="mt-1 text-sm font-bold text-gray-900">
                                        {form.services.length === 0 ? "All Services" : "Limited Services"}
                                    </p>
                                </div>
                                {/*
                            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                                    <CheckCircle2 size={18} />
                                </div>

                                <p className="mt-3 text-[10px] text-gray-400">
                                    Usage
                                </p>

                                <p className="mt-1 text-sm font-bold text-gray-900">
                                    {couponData.usage}
                                </p>
                            </div>

                            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                    <Gift size={18} />
                                </div>

                                <p className="mt-3 text-[10px] text-gray-400">
                                    Minimum Spend
                                </p>

                                <p className="mt-1 text-sm font-bold text-gray-900">
                                    ${Number(
                                        couponData.minimumAmount || 0
                                    ).toFixed(2)}
                                </p>
                            </div>
                            */}

                            </div>
                        </section>

                        {/* APPLICABLE SERVICES */}
                        {form.services?.length > 0 && (
                            <section className="mt-7">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">
                                            Applicable Services
                                        </h2>

                                        <p className="mt-1 text-xs text-gray-500">
                                            Services eligible for this offer
                                        </p>
                                    </div>

                                </div>

                                <div className="mt-3 flex flex-col gap-2">
                                    {form.services.map(o => (

                                        <div className="flex items-center gap-3 rounded-2xl  p-4 bg-white shadow-sm ring-1 ring-gray-100 cursor-pointer"
                                            onClick={() => navigate('/Service/View/' + encryptId(o.id))}>
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                                                <Sparkles size={16} />
                                            </div>


                                            <div className="min-w-0 flex-1">
                                                <span className="flex-1 text-sm font-semibold text-gray-800">
                                                    {o.name}
                                                </span>
                                                <p className="mt-1 text-xs text-gray-500">
                                                    ${o.price}
                                                </p>
                                            </div>

                                            <ChevronRight
                                                size={17}
                                                className="text-gray-300"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* VALIDITY MESSAGE */}
                        <section className="mt-7 rounded-3xl bg-cyan-50 p-5 ring-1 ring-cyan-100">
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-cyan-600 shadow-sm">
                                    <Clock3 size={19} />
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold text-gray-900">
                                        Limited time offer
                                    </h3>

                                    <p className="mt-1.5 text-xs leading-5 text-gray-600">
                                        This coupon is available until{" "}
                                        <span className="font-semibold text-gray-900">
                                            {get_Date(form.startdate, "MMMM DD, YYYY")}
                                        </span>
                                        . Make sure to use it before it expires.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* TERMS */}
                        {(form.newcustomer || form.onetime || Number(form.upto) > 0) && (
                            <section className="mt-7">
                                <div className="flex items-center gap-2">
                                    <Info
                                        size={19}
                                        className="text-gray-400"
                                    />

                                    <h2 className="text-lg font-bold text-gray-900">
                                        Eligibility
                                    </h2>
                                </div>

                                <div className="mt-3 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
                                    <div className="flex flex-col gap-3">
                                        {form.newcustomer && <div className="flex items-start gap-3" >
                                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />

                                            <p className="text-xs leading-5 text-gray-500">
                                                For New Customers Only. 🔥
                                            </p>
                                        </div>
                                        }

                                        {form.onetime && <div className="flex items-start gap-3" >
                                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />

                                            <p className="text-xs leading-5 text-gray-500">
                                                One-Time Use Per Customer.  ⭐
                                            </p>
                                        </div>
                                        }

                                        {Number(form.upto) > 0 && <div className="flex items-start gap-3" >
                                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" />

                                            <p className="text-xs leading-5 text-gray-500">
                                                Offer Valid for the First {form.upto} Customers Only. 🎉
                                            </p>
                                        </div>
                                        }

                                    </div>
                                </div>
                            </section>
                        )}

                        <div className="h-5" />
                    </div>
                </div>

                {/* USE COUPON */}
                <div className="fixed bottom-0 left-0 z-40 w-full border-t border-gray-200 bg-white/95 p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md">
                    <div className="mx-auto max-w-2xl">
                        <button
                            onClick={() => navigate("/Create", {
                                state: {
                                    value: encryptId(form.coupon),
                                    type: "discount"
                                }
                            })}
                            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400 active:scale-[0.98]"
                        >
                            Use This Coupon
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

            </main>} />
    );
}

