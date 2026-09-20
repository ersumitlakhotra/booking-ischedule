import { Home, Users, CalendarDays, Plus, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import HomePage from "./Home/home";
import Appointments from "./Appointment/appointments";
import Services from "./Services/services";
import Employees from "./Employee/employees";

export const Main = () => {
    const navigate = useNavigate();
    const {step, setStep}= useOutletContext();
    const contentRef = useRef(null);
    const steps = [
        { id: 1, label: "Home", icon: <Home />, content: <HomePage  setStep={setStep}/> },
        { id: 2, label: "Appointment", icon: <CalendarDays />, content: <Appointments/>},
        { id: 3, label: "Services", icon: <Sparkles />, content: <Services/> },
        { id: 4, label: "Employee", icon: <Users />, content: <Employees/> },
         ];

    const currentContent = steps.find(item => item.id === step)?.content;

    useEffect(() => {
        contentRef.current?.scrollTo({
            top: 0,
            behavior: "smooth", // optional
        });
    }, [step]);

    const handleTabChange = (id) => {
        setStep(id)
    }

    return (
        <div class=' w-full flex flex-col justify-between '>
            <div class='flex flex-col font-normal gap-3  bg-gray-50 w-full mb-4 p-3 md:px-8 '>
                {currentContent}
            </div>

            <footer className="fixed bottom-0 left-0 z-50 h-24 w-full bg-gray-900 shadow-[0_-8px_30px_rgba(0,0,0,0.25)] border-t border-gray-800">
                <div className="flex h-full items-center">

                    {/* LEFT 3 TABS */}
                    <div className="flex h-full w-[42%]">
                        {steps.slice(0, 2).map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`flex w-1/2 flex-col items-center justify-center transition-all duration-200 ${step === tab.id
                                        ? "text-white"
                                        : "text-gray-500 hover:text-gray-300"
                                    }`}
                            >
                                <div
                                    className={`transition-transform duration-200 ${step === tab.id ? "scale-110" : ""
                                        }`}
                                >
                                    {tab.icon}
                                </div>

                                <span
                                    className={`mt-1 text-[11px] ${step === tab.id ? "font-semibold" : ""
                                        }`}
                                >
                                    {tab.label}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* CENTER PLUS */}
                    <div className="relative flex h-full w-[16%] items-center justify-center">

                        <button
                            onClick={() => navigate("/Create")}
                            aria-label="Create"
                            className="group absolute -top-8 flex h-[68px] w-[68px] items-center justify-center rounded-full bg-cyan-500 text-white shadow-[0_8px_30px_rgba(6,182,212,0.45)] ring-[6px] ring-gray-900 transition-all duration-200 hover:scale-110 hover:bg-cyan-400 hover:shadow-[0_10px_40px_rgba(6,182,212,0.6)] active:scale-95"
                        >
                            <Plus
                                size={38}
                                strokeWidth={2.5}
                                className="transition-transform duration-200 group-hover:rotate-90"
                            />
                        </button>

                    </div>

                    {/* RIGHT 3 TABS */}
                    <div className="flex h-full w-[42%]">
                        {steps.slice(2, 4).map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`flex w-1/2 flex-col items-center justify-center transition-all duration-200 ${step === tab.id
                                        ? "text-white"
                                        : "text-gray-500 hover:text-gray-300"
                                    }`}
                            >
                                <div
                                    className={`transition-transform duration-200 ${step === tab.id ? "scale-110" : ""
                                        }`}
                                >
                                    {tab.icon}
                                </div>

                                <span
                                    className={`mt-1 text-[11px] ${step === tab.id ? "font-semibold" : ""
                                        }`}
                                >
                                    {tab.label}
                                </span>
                            </button>
                        ))}
                    </div>

                </div>
            </footer>
        </div>
    );
}
