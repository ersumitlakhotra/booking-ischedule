/* eslint-disable react-hooks/exhaustive-deps */
import  { useEffect, useState } from "react";
import {
    LogOut,
    ChevronRight,
    CalendarDays,
    Clock3,
    ArrowRight,
    Percent,
    Tag,
    DollarSign,
    Sparkle,
} from "lucide-react";
import dayjs from 'dayjs';

import { useNavigate, useOutletContext } from "react-router-dom";
import { get_Date, LocalDate } from "../../common/localDate.js";
import { Button, Tags,  Image } from "../../controls/index.jsx";
import { IsLoading, NoResults } from "../../common/index.jsx";
import { useAuth } from "../../auth/authContext.js";
import { encryptId } from "../../common/general.jsx";
import RewardsCard from "./rewards.jsx";

export default function HomePage({ setStep }) {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { userCell, customerList, companyList, getAppointment, getUserAppointment, getDiscount, getService, getUser, getCustomer } = useOutletContext();
    const [isLoading, setIsLoading] = useState(false);


    const [upcomingList, setUpcomingList] = useState([]);
    const [discountList, setDiscountList] = useState([]);
    const [topServices, setTopServices] = useState([]);

    const todaydate = LocalDate();
    const dates = Array.from(
        { length: 30 },
        (_, i) => {
            const date = dayjs().subtract(29 - i, "day");

            return {
                label: date.format("MMM DD"),
                date: date.format("YYYY-MM-DD")
            };
        }
    );

     const loyalty = companyList?.loyaltyinfo?.[0] ?? {active: false}

    useEffect(() => {
        Init();
    }, [])

    const Init = async () => {
        setIsLoading(true);

        const [
            AppointmentResponse,
            UserAppointmentResponse,
            ServiceResponse,
            DiscountResponse
        ] = await Promise.all([
            getAppointment(dates[0].date, todaydate),
            getUserAppointment(),
            getService(),
            getDiscount(),
            getUser(),
            getCustomer()
        ]);

        setUpcomingList(UserAppointmentResponse.filter(o => o.trndate >= todaydate))
        setDiscountList(DiscountResponse.filter(o => o.status === 'Live'));
        InitTopServices(AppointmentResponse, ServiceResponse);
        setIsLoading(false);
    };

    const InitTopServices = async (appointmentList, servicesList) => {
        try {
            const serviceUsage = {};

            appointmentList.forEach((appointment) => {
                let services = appointment.services || [];

                // PostgreSQL json[] can sometimes arrive as JSON strings
                services = services
                    .map((service) => {
                        if (typeof service === "string") {
                            try {
                                return JSON.parse(service);
                            } catch {
                                return null;
                            }
                        }

                        return service;
                    })
                    .filter(Boolean);

                services.forEach((service) => {
                    const id = service.id;

                    if (!serviceUsage[id]) {
                        serviceUsage[id] = {
                            id: service.id,
                            bookings: 0
                        };
                    }

                    serviceUsage[id].bookings += 1;
                });
            });

            const allServices = Object.values(serviceUsage);

            const topFive = allServices.length > 0
                ? allServices
                    .sort((a, b) => b.bookings - a.bookings)
                    .slice(0, 5)
                : servicesList.slice(0, 5).map(service => ({
                    id: service.id,
                    bookings: 0
                }));

            const topServicesWithData = topFive
                .map((top) => {
                    const service = servicesList.find(
                        item => String(item.id) === String(top.id)
                    );

                    return service
                        ? {
                            ...service,
                            bookings: top.bookings
                        }
                        : null;
                })
                .filter(Boolean);

            setTopServices(topServicesWithData);
        }
        catch { setTopServices([]); }
    };

    return (
        <main className="min-h-screen bg-gray-50 pb-28">
            <div className="mx-auto flex w-full max-w-2xl flex-col px-5 pt-6">

                {/* HEADER */}
                <header className="flex items-center justify-between">

                    <div className="flex flex-col">
                        <span className="text-sm text-gray-500">
                            Hello 👋
                        </span>

                        <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
                            <IsLoading isLoading={isLoading} rows={1} input={customerList?.name || userCell} />
                        </h1>
                    </div>

                    <button
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gray-500 shadow-sm ring-1 ring-gray-100 transition hover:text-red-500"
                        title="Logout"
                        onClick={() => logout()}
                    >
                        <LogOut size={19} />
                    </button>

                </header>

                {/* SEARCH */}
                <div className="relative mt-4">
                    {loyalty.active ? (

                        <IsLoading isLoading={isLoading} rows={5} input={<RewardsCard
                            points={customerList?.points || 0}
                            tier={customerList?.badge || ""}
                        />} />

                    ) : (
                        <div className="rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-5 text-white shadow-lg">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                                    <Sparkle size={20} className="text-cyan-400" />
                                </div>

                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                                        Rewards
                                    </p>

                                    <h3 className="mt-0.5 text-sm font-bold">
                                        Loyalty Rewards
                                    </h3>
                                </div>
                            </div>

                            <p className="mt-4 text-xs leading-5 text-gray-400">
                                This business doesn't currently offer a loyalty rewards program.
                                Check back later for new ways to earn rewards.
                            </p>
                        </div>)}
                </div>

                {/* POPULAR SERVICES */}
                <section className="mt-6">

                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900">
                            Popular Services
                        </h2>
                        <Button variant="secondary" icon={ChevronRight} iconPlacement="right" label="See all" onClick={() => setStep(3)} />
                    </div>

                    {/* Horizontal Scroll */}
                    <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                        <IsLoading isLoading={isLoading} rows={5} input={
                            topServices.length === 0 ?
                                <NoResults
                                    title={"No Services Added Yet"}
                                    Icon={Sparkle}
                                    description={"There are no services available at the moment. Please check back later."}
                                /> :
                                topServices.map((service) => (
                                    <button key={service.id}
                                        className="group min-w-[175px] overflow-hidden rounded-2xl bg-white text-left  ring-1 ring-gray-100 transition hover:-translate-y-1 shadow-md"
                                        onClick={() => navigate('/Service/View/' + encryptId(service.id))}
                                    >

                                        <div className="relative h-28 overflow-hidden">
                                            <Image
                                                rounded="rounded-none"
                                                className=" object-cover transition duration-500 group-hover:scale-105"
                                                height="h-full"
                                                width="w-full"
                                                src={service.profilepic}
                                                name={service.name}
                                                avatar={false} />
                                        </div>

                                        <div className="p-3">
                                            <h3 className="truncate text-sm font-bold text-gray-900">
                                                {service.name}
                                            </h3>

                                            <div className="mt-2 flex items-center justify-between">
                                                <span className="text-xs text-gray-500">
                                                    {service.timing}
                                                </span>

                                                <span className="text-sm font-bold text-cyan-600">
                                                    ${service.price}
                                                </span>
                                            </div>
                                        </div>

                                    </button>
                                ))} />

                    </div>
                </section>

                {/* SPECIAL OFFERS */}
                <section className="mt-8">

                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900">
                            Special Offers
                        </h2>

                        {discountList.length > 0 && <Tags title={`${discountList.length} Available`} color="green" size="xs" />}
                    </div>

                    <div className="flex gap-4 overflow-x-auto scrollbar-hide  pb-2">
                        <IsLoading isLoading={isLoading} rows={5} input={
                            discountList.length === 0 ?
                                <NoResults
                                    title={"No Special Offers Right Now"}
                                    Icon={Tag}
                                    description={"There are no live or upcoming offers at the moment. Check back soon for new deals and discounts."}
                                /> :
                                discountList.map((offer) => (
                                    <div
                                        key={offer.id}
                                        className="relative min-w-[280px] overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 p-5 text-white shadow-lg shadow-cyan-500/20 cursor-pointer"

                                        onClick={() => navigate('/Coupon/' + encryptId(offer.id))}>

                                        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />

                                        <div className="absolute -bottom-12 -right-3 h-32 w-32 rounded-full bg-white/5" />

                                        <div className="relative">

                                            <div className="flex items-center gap-2">
                                                <div className="flex h-10 px-2 items-center justify-center rounded-xl bg-white/15">
                                                    {offer.discounttype === "%" ? (
                                                        <>
                                                            {offer.discount}
                                                            <Percent size={18} />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <DollarSign size={18} />
                                                            {offer.discount}
                                                        </>
                                                    )}
                                                </div>

                                                <span className="text-xs font-medium text-white/80 ">
                                                    <p>{offer.services.length === 0 ? "All Services" : "Limited Services"}</p>
                                                    <p>{`${get_Date(offer.startdate, "MMM DD, YYYY")} - ${get_Date(offer.enddate, "MMM DD, YYYY")}`}</p>
                                                </span>
                                            </div>

                                            <h3 className="mt-4 text-2xl font-black">
                                                {offer.name}
                                            </h3>

                                            <p className="mt-1 text-sm text-white/80">
                                                {offer.description}
                                            </p>

                                            <div className="mt-4 flex items-center justify-between">

                                                <span className="rounded-lg bg-white/15 px-3 py-1.5 text-xs font-semibold">
                                                    {offer.coupon}
                                                </span>

                                                <button className="flex items-center gap-1 text-xs font-bold"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate("/Create", {
                                                            state: {
                                                                value: encryptId(offer.coupon),
                                                                type: "discount"
                                                            }
                                                        })
                                                    }
                                                    }>
                                                    Use now
                                                    <ArrowRight size={14} />
                                                </button>

                                            </div>

                                        </div>
                                    </div>
                                ))} />

                    </div>
                </section>

                {/* UPCOMING APPOINTMENTS */}
                <section className="mt-8">

                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900">
                            Upcoming Appointments
                        </h2>
                        <Button variant="secondary" icon={ChevronRight} iconPlacement="right" label="See all" onClick={() => setStep(2)} />
                    </div>

                    <div className="flex flex-col gap-3">
                        {upcomingList.length === 0 ?
                            <NoResults
                                title={"No Upcoming Appointments"}
                                Icon={CalendarDays}
                                description={"You don’t have any upcoming appointments right now. Book a service to get started and keep your schedule organized."}
                                buttonText="Appointment"
                                onClick={() => navigate("/Create")}
                            /> :
                            upcomingList.map((appointment) => (
                                <div key={appointment.id}
                                    className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-md ring-1 ring-gray-100"
                                    onClick={() => navigate('/View/' + encryptId(appointment.id))}>

                                    {/* DATE */}
                                    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                                        <CalendarDays size={19} />

                                        <span className="mt-1 text-[9px] font-bold uppercase">
                                            {get_Date(appointment.trndate, 'MMM')}
                                        </span>
                                    </div>

                                    {/* DETAILS */}
                                    <div className="min-w-0 flex-1">

                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="truncate text-sm font-bold text-gray-900">
                                                {appointment.services.map((o) => o.name).join(" | ")}
                                            </h3>

                                            <Tags title={appointment.status} dot size='xs' />
                                        </div>

                                        <p className="mt-1 text-xs text-gray-500">
                                            {appointment.business || "dsdds"}
                                        </p>

                                        <div className="mt-2 flex items-center gap-3 text-[11px] text-gray-500">

                                            <span className="flex items-center gap-1">
                                                <CalendarDays size={12} />
                                                {get_Date(appointment.trndate, 'MMM DD, YYYY')}
                                            </span>

                                            <span className="flex items-center gap-1">
                                                <Clock3 size={12} />
                                                {appointment.slot}
                                            </span>

                                        </div>

                                    </div>

                                </div>
                            ))}

                    </div>
                </section>

            </div>
        </main>
    );
}
