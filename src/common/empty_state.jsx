import { Database, Plus } from "lucide-react";
import { Button } from "../controls/index.jsx";
import { ButtonPermission } from "../auth/protectedButton.js";

export const EmptyState = ({
  title = "No records yet",
  permission='',
  description = "It looks like you haven't created any records yet. Start by adding your first one.",
  buttonText = "Create Record",
  customText,
  onClick,
}) => {
  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white py-20 px-8 shadow-sm">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
          <Database className="h-10 w-10 text-blue-600" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900">
          {title}
        </h2>

        <p className="mt-3 text-gray-500 leading-relaxed">
          {description}
        </p>
        
        {onClick && <ButtonPermission permission={`${permission}.Create`} children={
          <Button
            className="mt-8"
            variant="primary"
            icon={Plus}
            label={customText || 'Create ' + buttonText}
            onClick={onClick}
          />} />
        }

      </div>
    </div>
  );
}