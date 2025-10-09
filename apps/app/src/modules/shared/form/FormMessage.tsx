/* REACT */
import { type HTMLAttributes } from "react";

/* BOILERPLATE */
import { cn } from "~/lib/utils";
import { AlertCircle } from "lucide-react";

/* COMPONENT */
interface IProps extends HTMLAttributes<HTMLParagraphElement> {
  message: string | null | undefined;
}

export const FormMessage = ({ className, message = "", ...props }: IProps) => {
  return (
    <>
      {message ? (
        <div className={cn("flex flex-row items-center gap-2", className)}>
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span className="text-xs text-red-500 selection:text-red-900 selection:bg-red-500" {...props}>
            {message}
          </span>
        </div>
      ) : null}
    </>
  );
};
