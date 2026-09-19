import React, { useEffect, useState } from "react";
import {
    ArrowLeft,
    Clock3,
    Star,
    MapPin,
    Check,
    CalendarDays,
    UserRound,
    ChevronRight,
} from "lucide-react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { decryptId, encryptId, openMaps } from "../../common/general.jsx";
import FetchData from "../../hook/fetchData.js";
import { useAlert } from "../../controls/AlertProvider.jsx";
import { Button, Tags, SearchInput, Image, TabsButton } from "../../controls/index.jsx";

export default function ServiceView({ service }) {
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const {companyList} = useOutletContext();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState([]);
    const { Id } = useParams();
    const id = decryptId(Id);
    const isEdit = !!id;

    const [form, setForm] = useState({
        id: null,
        cid: null,
        name: "",
        price: "",
        timing: "15 Minutes",
        status: "Active",
        description: "",
        minutes: 15,
        category1: "All Types",
        category2: 0,
        profilepic: null,
        createdat: null,
        modifiedat: null,
    });

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
        if (!isEdit) return;

        const getById = async (id) => {
            setIsLoading(true);

            try {
                const [Response] = await Promise.all([
                    FetchData({
                        endPoint: "services",
                        id: id
                    })
                ]);
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
    // Demo service if nothing is passed
    const serviceData = service || {
        includes: [
            "Professional consultation",
            "Personalized service",
            "Expert care and attention",
            "Finishing touches",
        ],
    };

    return (
        <main className="min-h-screen bg-gray-50 pb-32">

            <div className="mx-auto flex w-full max-w-2xl flex-col">

                {/* HERO IMAGE */}
                <div className="relative h-72 w-full overflow-hidden">
                    <Image
                        rounded="rounded-none"
                        className=" object-cover transition duration-500 group-hover:scale-105"
                        height="h-full"
                        width="w-full"
                        src={form.profilepic}
                        name={form.name}
                        avatar={false} />


                    {/* Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20" />

                    {/* BACK BUTTON */}
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md transition hover:bg-black/50"

                    >
                        <ArrowLeft size={21} />
                    </button>

                    {/* FAVORITE 
                    <button
                        className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md transition hover:bg-black/50"
                    >
                        <Star size={20} />
                    </button>*/}

                    {/* IMAGE TITLE */}
                    <div className="absolute bottom-5 left-5 right-5">

                        <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-md">
                            {form.category1}
                        </span>

                        <h1 className="mt-2 text-2xl font-bold text-white">
                            {form.name}
                        </h1>

                    </div>

                </div>

                {/* CONTENT */}
                <div className="flex flex-col px-5">

                    {/* RATING / PRICE */}
                    <div className="mt-5 flex items-center justify-between">

                        <div className="flex items-center gap-2">

                            <div className="flex items-center gap-1 rounded-full bg-yellow-50 px-3 py-1.5">
                                <Star
                                    size={14}
                                    fill="currentColor"
                                    className="text-yellow-500"
                                />

                                <span className="text-xs font-bold text-yellow-700">
                                    4.9
                                </span>
                            </div>
                            {/*
                            <span className="text-xs text-gray-400">
                                ({serviceData.reviews} reviews)
                            </span>*/}

                        </div>

                        <span className="text-2xl font-black text-cyan-600">
                            ${form.price}
                        </span>

                    </div>

                    {/* BUSINESS */}
                    <button className="mt-5 flex items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-gray-100">

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

                    {/* QUICK INFO */}
                    <div className="mt-4 grid grid-cols-2 gap-3">

                        <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                                <Clock3 size={18} />
                            </div>

                            <div>
                                <p className="text-[10px] text-gray-400">
                                    Duration
                                </p>

                                <p className="mt-0.5 text-sm font-bold text-gray-900">
                                    {form.timing}
                                </p>
                            </div>

                        </div>

                        <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                                <UserRound size={18} />
                            </div>

                            <div>
                                <p className="text-[10px] text-gray-400">
                                    Specialists
                                </p>

                                <p className="mt-0.5 text-sm font-bold text-gray-900">
                                    Available
                                </p>
                            </div>

                        </div>

                    </div>

                    {/* ABOUT */}
                    <section className="mt-7">

                        <h2 className="text-lg font-bold text-gray-900">
                            About this service
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-gray-500">
                            {form.description || "Enjoy professional service tailored to your needs and preferences. Our experienced professionals take the time to understand what you’re looking for and deliver quality results with care and attention to detail."}
                        </p>

                    </section>

                    {/* INCLUDED */}
                    <section className="mt-7">

                        <h2 className="text-lg font-bold text-gray-900">
                            What's included
                        </h2>

                        <div className="mt-3 flex flex-col gap-3">

                            {(form.includes || serviceData.includes).map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3"
                                >

                                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
                                        <Check size={14} strokeWidth={3} />
                                    </div>

                                    <span className="text-sm text-gray-600">
                                        {item}
                                    </span>

                                </div>
                            ))}

                        </div>

                    </section>

                    {/* BOOKING INFO */}
                    <section className="mt-7 rounded-3xl bg-gray-900 p-5 text-white">

                        <div className="flex items-center gap-3 cursor-pointer"  onClick={() => navigate("/Create", {
                            state: {
                                value: encryptId(form.id),
                                type: "service"
                            }
                        })} >

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                                <CalendarDays size={21} />
                            </div>

                            <div>
                                <h3 className="text-sm font-bold">
                                    Ready to book?
                                </h3>

                                <p className="mt-1 text-xs text-gray-400">
                                    Choose your preferred date and specialist.
                                </p>
                            </div>

                        </div>

                    </section>

                </div>

            </div>

            {/* FIXED BOOK BUTTON */}
            <div className="fixed bottom-0 left-0 z-40 w-full border-t border-gray-200 bg-white/95 p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md">

                <div className="mx-auto flex items-center gap-3">

                    <div className="flex flex-col">

                        <span className="text-[10px] text-gray-400">
                            Starting from
                        </span>

                        <span className="text-lg font-black text-gray-900">
                            ${form.price}
                        </span>

                    </div>
                    <Button variant="primary" className="flex-1" icon={CalendarDays} label="Book Appointment"
                        onClick={() => navigate("/Create", {
                            state: {
                                value: encryptId(form.id),
                                type: "service"
                            }
                        })} />
                </div>

            </div>

        </main>
    );
}
