export interface IAuthentication {
  status: "authenticated" | "unauthenticated" | "loading";
  user: IUser | null;
  token: string | null;
}

export interface IUser {
  email: string;
  name: string;
  role: "customer";
  image: string | null;
  haveFreePlan: boolean;
}
