import { SearchX, Plus } from "lucide-react";
import { Button } from "../controls/index.jsx";
import { ButtonPermission } from "../auth/protectedButton.js";

export const  NoResults=({
  title = "No results found",
  permission="",
  Icon=SearchX,
  description = "We couldn't find anything matching your search.",
  buttonText = "Create",
  customText,
  onClick,
})=> {
  return (
    <div className="w-full flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white px-6 py-10 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
        <Icon className="h-7 w-7 text-gray-400" />
      </div>

      <h3 className="text-base font-semibold text-gray-900">
        {title}
      </h3>

      <p className="mt-2 mb-4 max-w-xs text-sm text-gray-500">
        {description}
      </p>
      
      {onClick &&
      <ButtonPermission permission={`${permission}.Create`} children={
        <Button variant="dotted" icon={Plus} label={customText || 'Create ' + buttonText} onClick={onClick} />} />
      }
        
    </div>
  );
}