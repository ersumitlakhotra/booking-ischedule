import React, { useEffect, useMemo, useState } from "react";
import {
    ArrowLeft,
    CalendarDays,
    Clock3,
    MapPin,
    UserRound,
    BriefcaseBusiness,
    CheckCircle2,
    XCircle,
    ChevronRight,
    MessageCircle,
    Ban,
    UserX,
    Sparkles,
    Boxes,
    Users,
    Phone,
    Mail,
    CreditCard,
    Tag,
} from "lucide-react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useAlert } from "../../controls/AlertProvider";
import { decryptId, encryptId, getTax, openMaps, updateField } from "../../common/general.jsx";
import FetchData from "../../hook/fetchData";
import { get_Date, LocalDate } from "../../common/localDate";
import { Tags } from "../../controls/tags.jsx";
import { Image } from "../../controls/image.jsx";
import { PriceFormat } from "../../common/validate.jsx";
import { calculateCouponDiscount, validateSelectedCoupon } from "./validation.jsx"
import { Badge } from "../../controls/badge.jsx";

export default function SummaryInfo({ form, setForm, isEdit }) {
    const { } = useOutletContext();
    const [isLoading, setIsLoading] = useState(false);
    const { userList, companyList, getAppointment, getCompany, getCustomer, getDiscount, getInventory } = useOutletContext();

    const [appointmentList, setAppointmentList] = useState([]);
    const [customerList, setCustomerList] = useState([]);
    const [couponList, setCouponList] = useState([]);

    useEffect(() => {
        Init();
    }, [])

    const Init = async () => {
        setIsLoading(true);

        const [
            AppointmentResponse,
            CustomerResponse,
            CouponResponse
        ] = await Promise.all([
            getAppointment(),
            getCustomer(),
            getDiscount()
        ]);

        setAppointmentList(AppointmentResponse);
        setCustomerList(CustomerResponse);
        setCouponList(CouponResponse);
        setIsLoading(false);
    };

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

    useMemo(() => {
        const service_price = form.services.reduce((sum, service) => sum + (Number(service.price) || 0), 0);
        const product_price = form.products.reduce((sum, o) => sum + (Number(o.sellprice) || 0), 0);
        const result = (Number(service_price) || 0) + (Number(product_price) || 0)
        updateField("subtotal", PriceFormat(result.toString()), setForm);
    }, [form.services, form.products]);

    useMemo(() => {
        if (!address) return 0;

        const province = addressInfo.province;
        const taxList = getTax(province);
        const subtotal = (Number(form.subtotal) || 0) - (Number(form.discount) || 0)
        const tax = (subtotal * taxList.tax) / 100;
        if (form.istax) {
            updateField("taxpercentage", taxList.tax, setForm);
            updateField("tax", tax, setForm);
        }
        else {
            updateField("taxpercentage", 0, setForm);
            updateField("tax", 0, setForm);
        }
    }, [form.subtotal, form.discount, form.products, companyList, form.istax]);

    useEffect(() => {
        const total =
            (Number(form.subtotal) || 0) -
            (Number(form.discount) || 0) +
            (Number(form.tax) || 0);

        updateField("total", total, setForm);
    }, [
        form.subtotal,
        form.discount,
        form.tax
    ]);
    const employee = userList.find((item) => item.id.toString() === form.uid.toString())
    const coupons = useMemo(() => {
        return couponList
            .filter((coupon) => coupon.status === "Live")
            .map((coupon) => {
                const validation = validateSelectedCoupon({
                    discount: coupon,
                    customerCell: form.cell,
                    customerList,
                    appointmentList,
                });

                if (!validation.status) {
                    return null;
                }

                const calculation = calculateCouponDiscount({
                    coupon,
                    services: form.services,
                });

                if (!calculation.status) {
                    return null;
                }

                return {
                    ...coupon,
                    discountAmount: calculation.discount,
                };
            })
            .filter(Boolean);
    }, [
        couponList,
        form.cell,
        form.services,
        customerList,
        appointmentList,
    ]);

    const handleCoupon = (coupon) => {
        const selected = coupons.find(
            (item) => item.coupon === coupon
        );

        if (!selected) return;

        updateField("coupon", coupon, setForm);

        const calculation = calculateCouponDiscount({
            coupon: selected,
            services: form.services,
        });


        if (calculation.status) {
            updateField("discount", calculation.discount, setForm);
        } else {
            updateField("discount", "0", setForm);
        }
    };

    useEffect(() => {
        if (coupons.length > 0) {
        handleCoupon(form.coupon || coupons[0].coupon);
    }
    },[coupons])


    const Section = ({ title, }) => {

    }

    return (
        <main className="min-h-screen  pb-32">
            <div className="mx-auto flex w-full  flex-col">
                {/* HEADER */}

                <section className="my-4  flex flex-col items-center justify-center" >

                    <h1 className="text-xs  text-gray-500">
                        Review your booking details
                    </h1>
                </section>

                <div className="flex flex-col ">

                    {/* DISCOUNT & COUPONS */}
                    <section >
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    Discounts & Coupons
                                </h2>

                                <p className="mt-1 text-xs text-gray-500">
                                    Select one offer to apply to your appointment
                                </p>
                            </div>

                            <span className="rounded-full bg-green-50 px-3 py-1 text-[10px] font-bold text-green-600">
                                {coupons.length} Available
                            </span>
                        </div>
                

                        <div className="mt-3 flex flex-col gap-3">
                            {coupons.map((coupon) => {
                                const selected = form.coupon === coupon.coupon;

                                return (
                                    <button
                                        key={coupon.id}
                                        type="button"
                                        onClick={() =>
                                            handleCoupon(coupon.coupon)
                                        }
                                        className={`flex w-full items-center gap-3 rounded-2xl p-4 text-left transition ${selected
                                            ? "bg-cyan-50 ring-2 ring-cyan-500"
                                            : "bg-white ring-1 ring-gray-100 hover:ring-gray-200"
                                            }`}
                                    >
                                        {/* RADIO */}
                                        <div
                                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${selected
                                                ? "border-cyan-500"
                                                : "border-gray-300"
                                                }`}
                                        >
                                            {selected && (
                                                <div className="h-2.5 w-2.5 rounded-full bg-cyan-500" />
                                            )}
                                        </div>

                                        {/* COUPON ICON */}
                                        <div
                                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${selected
                                                ? "bg-cyan-500 text-white"
                                                : "bg-green-50 text-green-600"
                                                }`}
                                        >
                                            <Tag size={18} />
                                        </div>

                                        {/* DETAILS */}
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-bold text-gray-900">
                                                    {coupon.name}
                                                </p>

                                                {coupon.badge && (
                                                    <span className="rounded-full bg-green-50 px-2 py-0.5 text-[9px] font-bold text-green-600">
                                                        {coupon.badge}
                                                    </span>
                                                )}
                                            </div>

                                            <p className="mt-1 text-xs text-gray-500">
                                                {coupon.description}
                                            </p>

                                            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                                                Code: {coupon.coupon}
                                            </p>
                                        </div>

                                        {/* DISCOUNT */}
                                        <div className="shrink-0 text-right">
                                            <p className="text-sm font-bold text-green-600">
                                                {coupon.discounttype === "%"
                                                    ? `${coupon.discount}% OFF`
                                                    : `$${coupon.discount} OFF`}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {coupons.length === 0 && (
                            <div className="mt-3 rounded-2xl bg-white p-5 text-center ring-1 ring-gray-100">
                                <Tag className="mx-auto text-gray-300" size={24} />

                                <p className="mt-2 text-sm font-semibold text-gray-700">
                                    No coupons available
                                </p>

                                <p className="mt-1 text-xs text-gray-400">
                                    There are currently no discounts available for this booking.
                                </p>
                            </div>
                        )}
                    </section>


                    {/* Date Time */}
                    <section className="mt-7">
                       <h2 className="text-lg font-bold text-gray-900">
                            Date & Time
                        </h2>

                        <div className="mt-3 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100">
                            <div className="flex items-center gap-3 border-b border-gray-100 p-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                                    <CalendarDays size={18} />
                                </div>

                                <div>
                                    <p className="text-[10px] font-medium text-gray-400">
                                        Date
                                    </p>

                                    <p className="mt-0.5 text-sm font-bold text-gray-900">
                                        {get_Date(form.trndate, 'dddd , MMM DD YYYY')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 border-b border-gray-100 p-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                    <Clock3 size={17} />
                                </div>

                                <div>
                                    <p className="text-[10px] font-medium text-gray-400">
                                        Time
                                    </p>

                                    <p className="mt-0.5 text-sm font-semibold text-gray-900">
                                        {form.slot}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* SERVICE */}
                    <section className="mt-7">
                        <h2 className="text-lg font-bold text-gray-900">
                            Services
                        </h2>

                        {form.services.map(o => (

                            <div className="mt-3 flex items-center gap-3 rounded-2xl  p-4 bg-white shadow-sm ring-1 ring-gray-100 cursor-pointer"
                            >
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
                            <div className="mt-3 flex items-center gap-3 rounded-2xl  p-4 bg-white shadow-sm ring-1 ring-gray-100">
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

                        <div className="mt-3 flex items-center gap-3 rounded-2xl  p-4 bg-white shadow-sm ring-1 ring-gray-100 cursor-pointer"
                        >
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

                    {/* CUSTOMER */}
                    <section className="mt-7">
                        <h2 className="text-lg font-bold text-gray-900">
                            Customer Details
                        </h2>

                        <div className="mt-3 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100">
                            <div className="flex items-center gap-3 border-b border-gray-100 p-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                                    <UserRound size={18} />
                                </div>

                                <div>
                                    <p className="text-[10px] font-medium text-gray-400">
                                        Name
                                    </p>

                                    <p className="mt-0.5 text-sm font-bold text-gray-900">
                                        {form.name}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 border-b border-gray-100 p-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                    <Phone size={17} />
                                </div>

                                <div>
                                    <p className="text-[10px] font-medium text-gray-400">
                                        Phone
                                    </p>

                                    <p className="mt-0.5 text-sm font-semibold text-gray-900">
                                        {form.cell}
                                    </p>
                                </div>
                            </div>

                            {form.email && (
                                <div className="flex items-center gap-3 p-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                                        <Mail size={17} />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-[10px] font-medium text-gray-400">
                                            Email
                                        </p>

                                        <p className="mt-0.5 truncate text-sm font-semibold text-gray-900">
                                            {form.email}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* BUSINESS */}
                    <section className="mt-7">
                        <h2 className="text-lg font-bold text-gray-900">
                            Location
                        </h2>

                        <button className="mt-3 flex w-full items-center gap-3 rounded-2xl  p-4 text-left bg-white shadow-sm ring-1 ring-gray-100"
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
                            Payment Summary
                        </h2>

                        <div className="mt-3 space-y-2 rounded-2xl  p-4 text-left bg-white shadow-sm ring-1 ring-gray-100">

                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Subtotal</span>
                                <span>${Number(form.subtotal).toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between items-center text-sm text-gray-600 ">
                                <span>Discount
                                    {form.isdiscount &&
                                        <span className="text-xs"> {`( ${form.coupon || form.discounttype} )`}</span>
                                    }
                                </span>
                                <span className="text-red-600">-${Number(form.discount).toFixed(2)}</span>
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

                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}

