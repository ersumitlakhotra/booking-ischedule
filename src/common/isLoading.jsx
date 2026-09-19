import { Skeleton } from "../controls/index.jsx";
import { LoaderCircle } from "lucide-react";

export const IsLoading = ({ isLoading , input, rows=1}) => {
    return(
        isLoading ? <Skeleton  rows={rows} /> : input
    )
}


export const SaveIsLoading = ({ isLoading }) => {
    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4 rounded-2xl bg-white px-8 py-6 shadow-2xl">
                <LoaderCircle
                    className="h-12 w-12 animate-spin text-cyan-600"
                    strokeWidth={2.5}
                />
                <p className="text-sm font-medium text-gray-700">
                    Please wait...
                </p>
            </div>
        </div>
    );
};
