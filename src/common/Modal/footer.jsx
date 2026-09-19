import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../controls/index.jsx";

export const FooterModal = ({
    step,
    setStep,
    totalSteps,
    onNext,
    onPrevious,
    onSkip,
    onComplete,
    completeLabel = "Complete",
    nextLabel = "Next",
    showSkip = false,
}) => {
    const isFirst = step === 1;
    const isLast = step === totalSteps;

    return (
        <div className="px-8 py-5 border-t border-gray-200 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-slate-900">
           
           {!isFirst ? <Button variant="secondary" icon={ChevronLeft} onClick={onPrevious} disabled={isFirst}  label="Previous" /> : <div></div>}


            <div className="flex items-center gap-3">
                {showSkip && !isLast && (
                    <Button variant="secondary" onClick={onSkip} label="Skip" />
                )}
                {isLast ?
                    <Button onClick={onComplete} iconPlacement="right" label={completeLabel} />
                    : <Button onClick={onNext} icon={ChevronRight} iconPlacement="right" label={nextLabel} />
                }
            </div>
        </div>
    );
};