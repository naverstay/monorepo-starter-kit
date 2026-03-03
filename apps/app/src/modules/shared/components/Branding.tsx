/* APP */
import { config } from "config";

export const Branding = () => {
  return (
    <span className="hidden sm:block fixed z-50 bottom-2 right-2 text-muted-foreground text-[10px] select-none pointer-events-none">
      {config.app.name}
    </span>
  );
};
