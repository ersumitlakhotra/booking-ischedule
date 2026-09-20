/* eslint-disable react-hooks/exhaustive-deps */
import {Sparkles} from "lucide-react";
import ServicesInfo from "./service_info.jsx";

export default function Services() {
    return (
        <main className="min-h-screen bg-gray-50 pb-28">

            <div className="mx-auto flex w-full max-w-2xl flex-col px-5 pt-6">

                {/* HEADER */}
                <header className="flex items-center justify-between">

                    <div>
                        <span className="text-sm text-gray-500">
                            Find what you need
                        </span>

                        <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
                            Services
                        </h1>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                        <Sparkles size={20} />
                    </div>

                </header>
                <ServicesInfo/>
            </div>

        </main>
    );
}
