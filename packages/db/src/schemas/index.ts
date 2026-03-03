import { invitation } from "./invitation";
import { organization } from "./organization";
import { passkey } from "./passkey";
import { team } from "./team";
import { user } from "./user";
import { product } from "./product";
import { subscription } from "./subscription";

export const schema = {
  invitation,
  organization,
  passkey,
  team,
  user,
  product,
  subscription,
} as const;

export type DbSchema = typeof schema;
export default schema;
