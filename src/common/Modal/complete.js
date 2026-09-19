import { Check } from "lucide-react";

export const Complete = ({
    Title='',
    Description=''
}) => {
    return (
        <div className="flex flex-col items-center justify-center text-center min-h-[400px]">           
            <div className="w-24 h-24 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center text-4xl mb-6">
               <Check size={36}/>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
               {Title}
            </h2>

            <p className="text-slate-500 mt-3 max-w-md">
                {Description}
            </p>
        </div>
    );
};