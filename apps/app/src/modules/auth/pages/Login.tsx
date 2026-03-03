import { useId, useState } from "react";
/* LIBRARIES */
import { Link } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";

/* SHADCN */
import { Button } from "@/shadcn/ui/button";
import { Card, CardContent, CardHeader } from "@/shadcn/ui/card";

/* APP */
import { Form, FormField, FormLabel, FormMessage, Input } from "@modules/shared/form";
import { useAuthActions, useSession } from "@modules/auth";
import { Google } from "../components/Google";
import { Honeypot } from "../components/Honeypot"; /* COMPONENT */

/* COMPONENT */

const schema = z.object({
  e: z.string().min(1, "Email is required").email("Must be a valid email"),
  p: z.string().min(1, "Password is required"),
  n: z.string().optional(),
});

type ILoginSchema = z.infer<typeof schema>;

export default function LoginPage() {
  const [showEmailAndPasswordOption, setShowEmailAndPasswordOption] = useState(false);
  const [showPasswordText, setShowPasswordText] = useState(false);
  const { signInFn } = useAuthActions();
  const { isPending } = useSession();

  const emailId = useId();
  const passwordId = useId();

  //hooks
  const form = useForm<ILoginSchema>({
    resolver: zodResolver(schema),
  });

  const handleSubmit = (data: ILoginSchema) => {
    if (data.n) return;
    signInFn({ email: data.e, password: data.p });
  };

  return (
    <div className="flex flex-col rounded-2xl border-[1px] border-gray-200 p-1 shadow-sm">
      <Card className="w-full sm:w-[350px] flex flex-1 flex-col justify-between gap-3 rounded-xl p-6 bg-gray-50/5 border-[1px] border-gray-100 transition-colors duration-200 group-hover:border-gray-200">
        <CardHeader>
          <div className="flex flex-col items-center gap-2 mb-2">
            <h1 className="text-xl font-semibold leading-[1.475]">Login</h1>
          </div>
        </CardHeader>
        <CardContent>
          <Honeypot />
          <Google />
          <div className="relative m-3">
            <div className="relative flex justify-center text-sm">
              <span className="bg-palette-0 text-palette-500 5 text-xs px-2 text-gray-700">OR</span>
            </div>
          </div>
          {showEmailAndPasswordOption ? (
            <>
              <Form onSubmit={form.handleSubmit(handleSubmit)} className="__container_jjkgc_1">
                <FormField>
                  <FormLabel htmlFor={emailId}>Email</FormLabel>
                  <Input id={emailId} type="email" autoComplete="off" {...form.register("e")} />
                  <FormMessage message={form.formState.errors["e"]?.message} />
                </FormField>
                <FormField>
                  <FormLabel htmlFor={passwordId}>Password</FormLabel>
                  <div className="flex flex-row items-center relative">
                    <Input id={passwordId} type={showPasswordText ? "text" : "password"} {...form.register("p")} className="pr-10" />
                    <span
                      onClick={() => {
                        setShowPasswordText(!showPasswordText);
                      }}
                      className="absolute cursor-pointer flex items-center justify-center w-10 top-0 bottom-0 right-0"
                    >
                      {showPasswordText ? <EyeOff /> : <Eye />}
                    </span>
                  </div>
                  <FormMessage message={form.formState.errors["p"]?.message} />
                </FormField>
                <input type="text" className="hidden" {...form.register("n")} />
                <Button variant={"secondary"} className="mt-3" type="submit">
                  Continue
                </Button>
              </Form>
            </>
          ) : (
            <>
              <Button className="w-full" variant={"secondary"} onClick={() => setShowEmailAndPasswordOption(true)}>
                Continue with credentials
              </Button>
            </>
          )}
          <p className="flex items-center justify-center mt-5 text-sm text-center">
            <span className="text-gray-700">Don't have an account?</span>
            <Button variant={"link"} disabled={isPending} asChild>
              <Link to={"/auth/signup"} className="flex items-center px-1 font-semibold">
                <span className="text-sm">Sign up</span>
              </Link>
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
