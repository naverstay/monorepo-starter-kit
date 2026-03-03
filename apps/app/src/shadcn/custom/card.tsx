import * as React from "react";
import {CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/shadcn/ui/card";

import {cn} from "@/lib/utils";

type CardProps<T extends React.ElementType = "div"> = {
  as?: T;
  className?: string;
} & React.ComponentPropsWithoutRef<T>;

function Card<T extends React.ElementType = "div">({
                                                     as,
                                                     className,
                                                     ...props
                                                   }: CardProps<T>) {
  const Component = as || "div";

  return (
    <Component
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
