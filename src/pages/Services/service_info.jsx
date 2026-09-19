import React, { useEffect, useMemo, useState } from "react";
import {
    Clock3,
    Sparkles,
} from "lucide-react";

import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { get_Date, LocalDate } from "../../common/localDate.js";
import { Button, Tags, SearchInput, Image, TabsButton } from "../../controls/index.jsx";
import { IsLoading, NoResults } from "../../common/index.jsx";
import { encryptId, updateField } from "../../common/general.jsx";

export default function ServicesInfo({
    form,
    setForm
}) {

    const navigate = useNavigate();
    const { saveData, refresh, getService } = useOutletContext();
    const [searchInput, setSearchInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [servicesList, setServicesList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);

    const [selectedCT1, setSelectedCT1] = useState(1);
    const [category1Types, setCategory1Types] = useState([
        { id: 1, label: "All", value: "All", count: 0 },
        { id: 2, label: "Men", value: "Men", count: 0 },
        { id: 3, label: "Women", value: "Women", count: 0 },
        { id: 4, label: "Kids", value: "Kids", count: 0 },
    ]);

    useEffect(() => {
        Init();
    }, [])

    const Init = async () => {
        setIsLoading(true);
        const ServiceResponse = await getService();
        setServicesList(ServiceResponse);
        updateCounts(ServiceResponse);
        handleSearch(ServiceResponse);
        setIsLoading(false);
    };

    useEffect(() => {
        handleSearch(servicesList);
    }, [servicesList, searchInput, selectedCT1, category1Types,form?.services]);

    const handleSearch = (List) => {
        const search = searchInput.trim().toLowerCase();

        let filtered = List;

        // Search by service name
        if (search) {
            filtered = filtered.filter((item) =>
                (item.name || "").toLowerCase().includes(search)
            );
        }

        // Category filter
        if (selectedCT1 !== 1) {
            const selectedCategory = category1Types.find(
                (item) => item.id === selectedCT1
            );

            if (selectedCategory) {
                filtered = filtered.filter(
                    (item) =>
                        item.category1?.trim() === selectedCategory.value
                );
            }
        }

        // Add selected column and sort
        if (form) {
            const services = Array.isArray(form.services)
                ? form.services
                : [];

            filtered = filtered
                .map((item) => ({
                    ...item,
                    isSelected: services.some(
                        (service) =>
                            String(service.id) === String(item.id)
                    ),
                }))
                .sort((a, b) => {
                    // Selected services first
                    if (a.isSelected !== b.isSelected) {
                        return a.isSelected ? -1 : 1;
                    }

                    // Then sort by name
                    return (a.name || "").localeCompare(
                        b.name || "",
                        undefined,
                        { sensitivity: "base" }
                    );
                });
        } else {
            // No form → just sort by name
            filtered.sort((a, b) =>
                (a.name || "").localeCompare(
                    b.name || "",
                    undefined,
                    { sensitivity: "base" }
                )
            );
        }

        setFilteredList(filtered);
    };

    const updateCounts = (list) => {
        const counts = {
            "All Types": 0,
            Men: 0,
            Women: 0,
            Kids: 0,
        };

        list.forEach((item) => {
            const category = item.category1?.trim();

            if (!category || category === "All Types") {
                counts["All Types"]++;
            } else if (counts[category] !== undefined) {
                counts[category]++;
            }
        });

        setCategory1Types([
            {
                id: 1,
                label: "All",
                value: "All",
                count:
                    counts["All Types"] +
                    counts.Men +
                    counts.Women +
                    counts.Kids,
            },
            {
                id: 2,
                label: "Men",
                value: "Men",
                count: counts.Men,
            },
            {
                id: 3,
                label: "Women",
                value: "Women",
                count: counts.Women,
            },
            {
                id: 4,
                label: "Kids",
                value: "Kids",
                count: counts.Kids,
            },
        ]);
    };

    const toggleService = (service) => {
        const services = Array.isArray(form?.services)
            ? form.services
            : [];

        const serviceData = {
            id: service.id,
            label: `${service.name} ($${service.price})`,
            name: service.name,
            value: service.id,
            price: service.price,
            minutes: service.minutes,
        };

        const exists = services.some(
            (item) => String(item.id) === String(service.id)
        );

        const updatedServices = exists
            ? services.filter(
                (item) => String(item.id) !== String(service.id)
            )
            : [...services, serviceData];

        updateField("services", updatedServices, setForm);       
    };


    return (
        <>
            {/* SEARCH */}
            <div className="relative mt-6 space-y-4">
                <SearchInput value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder='Filter and search. . . ' />
                <TabsButton tabs={category1Types} defaultActive={selectedCT1} onChange={(tab) => setSelectedCT1(tab.id)} />

            </div>



            {/* SERVICE COUNT */}
            <div className="mt-7 flex items-center justify-between">

                <h2 className="text-lg font-bold text-gray-900">
                    All Services
                </h2>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
                    {filteredList.length}
                </span>

            </div>


            {/* SERVICES LIST */}
            <div className="mt-4 flex flex-col gap-3">

                <IsLoading isLoading={isLoading} rows={20} input={
                    filteredList.length === 0 ?
                        <NoResults
                            title={"No Services Found"}
                            Icon={Sparkles}
                            description={"Try searching for another service or category."}
                        /> :
                        filteredList.map((service) => {
                            const isSelected = form ? service.isSelected : false;
                            return (
                                <button key={service.id}
                                    className={`group flex w-full items-center gap-4 rounded-2xl p-4 text-left shadow-sm   transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md
                                     ${isSelected ? "ring-cyan-600 ring-2 bg-cyan-50" : "ring-gray-100 ring-1 bg-white"}`}
                                    onClick={() =>
                                        form ? toggleService(service) :
                                            navigate('/Service/View/' + encryptId(service.id))}
                                >

                                    {/* ICON */}
                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600 transition group-hover:bg-cyan-500 group-hover:text-white">
                                        <Image
                                            rounded="rounded-none"
                                            className=" object-cover transition duration-500 group-hover:scale-105"
                                            height="h-full"
                                            width="w-full"
                                            src={service.profilepic}
                                            name={service.name}
                                            avatar={false} />
                                    </div>

                                    {/* DETAILS */}
                                    <div className="min-w-0 flex-1">

                                        <div className="flex items-start justify-between gap-3">

                                            <div className="min-w-0">

                                                <h3 className="truncate text-sm font-bold text-gray-900">
                                                    {service.name}
                                                </h3>

                                                <p className="mt-1 truncate text-xs text-gray-500">
                                                    {service.description}
                                                </p>

                                            </div>

                                        </div>

                                        <div className="mt-3 flex items-center gap-3">

                                            <span className="flex items-center gap-1.5 text-[11px] text-gray-500">
                                                <Clock3
                                                    size={13}
                                                    className="text-gray-400"
                                                />
                                                {service.timing}
                                            </span>

                                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-semibold text-gray-500">
                                                {service.category1 || "All Types"}
                                            </span>

                                        </div>

                                    </div>

                                    <span className="text-sm font-bold text-cyan-600">
                                        ${service.price}
                                    </span>
                                </button>
                            )
                        })
                } />

            </div>
        </>
    );
}
