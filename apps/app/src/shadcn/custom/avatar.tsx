import {Avatar as BaseAvatar, AvatarImage, AvatarFallback} from "@/shadcn/ui/avatar";
import {cn} from "@/lib/utils";

export function Avatar({sizeClassName = "size-8", className = "", ...props}) {
  return (
    <BaseAvatar
      {...props}
      className={cn(sizeClassName, className)}
    />
  );
}

export {AvatarImage, AvatarFallback};
