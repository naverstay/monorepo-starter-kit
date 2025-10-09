import { useId } from "react";
/* LIBRARIES */
import { Bone, Eye } from "lucide-react";
import styles from "./Honeypot.module.css";
/* SHADCN */
import { Button } from "~/shadcn/ui/button";
/* APP */
import { Form, FormField, FormLabel, FormMessage, Input } from "@/shared/form";

/* SECURITY COMPONENT */
export const Honeypot = () => {
  const emailId = useId();
  const passwordId = useId();

  return (
    <Form className={styles.container}>
      <FormField>
        <FormLabel htmlFor={emailId}>Email</FormLabel>
        <Input id={emailId} type="email" autoComplete="off" name="email" />
        <FormMessage message={null} />
      </FormField>
      <FormField>
        <FormLabel htmlFor={passwordId}>Password</FormLabel>
        <div className="flex flex-row items-center">
          <Input id={passwordId} type="password" name="password" className="border-r-0 rounded-r-none" />
          <Eye />
        </div>
        <FormMessage message={null} />
      </FormField>
      <Button className="mt-3" type="submit">
        Continue
      </Button>
      <div className="relative m-3">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="border-palette-300 w-full border-t"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-palette-0 text-palette-500 5 text-xs px-2">Or continue with</span>
        </div>
      </div>
      <Button size={"lg"} className="w-full flex items-center gap-2" type="button">
        <Bone />
        <span>Continue with Google</span>
      </Button>
    </Form>
  );
};
