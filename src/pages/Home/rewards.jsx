

import {
    Trophy,
    Sparkles,
    ChevronRight,
} from "lucide-react";
import { StarBadge } from "../../common";
import { Tooltip } from "../../controls";
import { useNavigate } from "react-router-dom";

export default function RewardsCard({
    points = 0,
    tier = "",
}) {
    const navigate = useNavigate()
    return (
        <button
            type="button"
             onClick={() => navigate("/Create")}
            className="group relative w-full overflow-hidden rounded-3xl bg-gray-900 p-5 text-left shadow-lg shadow-gray-900/10 transition active:scale-[0.99]"
        >
            {/* BACKGROUND GLOW */}
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl transition group-hover:bg-cyan-500/30" />

            <div className="absolute -bottom-20 -left-10 h-36 w-36 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative">
                {/* TOP */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                       
                       {tier === "" ? <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-400">
                           <Tooltip title={"No badge"} placement="top" children={ <Trophy size={21} /> } />
                        </div>
                        :
                         <Tooltip title={`${tier} badge`} placement="top" children={<StarBadge name={tier} size="xs"/>} />
                       }

                        <div>
                            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
                                Rewards Points
                            </p>

                            <h2 className="mt-0.5 text-sm font-bold text-white">
                                 {points.toLocaleString()}
                            </h2>
                        </div>
                    </div>

                    {/* TIER BADGE */}
                    {tier !== "" && <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur-md">
                        <span className={`h-2 w-2 rounded-full 
                        ${tier === "Bronze" ? "bg-orange-400" :
                                tier === "Silver" ? "bg-gray-300" :
                                    tier === "Gold" ? "bg-yellow-400" :
                                        tier === "Platinum" ? "bg-cyan-400" : "bg-gray-400"}`} />

                        <span className="text-[10px] font-bold text-white"> {tier} </span>
                    </div>
                    }
                </div> 

                {/* BOTTOM */}
                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4"
               >
                    <div className="flex items-center gap-2">
                        <Sparkles
                            size={14}
                            className="text-cyan-400"
                        />

                        <span className="text-[10px] font-medium text-gray-400">
                            Earn points with every appointment
                        </span>
                    </div>

                    <ChevronRight
                        size={17}
                        className="text-gray-500 transition group-hover:translate-x-0.5 group-hover:text-white"
                    />
                </div>
            </div>
        </button>
    );
}

