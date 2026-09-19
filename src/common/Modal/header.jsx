import { X } from "lucide-react";
import { Button } from "../../controls/index.jsx";

export const HeaderModal = ({
    Title='',
    Description='',
    onClick,
    className=''
}) => {
    return (
        <div className={`px-8 py-6  border-gray-200 dark:border-slate-700 flex items-center justify-between ${className}`}>
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {Title}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                    {Description}
                </p>
            </div>

            {onClick && <Button variant="default" icon={X} onClick={onClick} />}
        </div>
    );
};