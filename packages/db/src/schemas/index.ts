import * as invitation from "./invitation";
import * as organization from "./organization";
import * as passkey from "./passkey";
import * as team from "./team";
import * as user from "./user";
import * as product from "./product";
import * as subscription from "./subscription";

export const schema = {
  ...invitation,
  ...organization,
  ...passkey,
  ...team,
  ...user,
  ...product,
  ...subscription,
} as const;

export type DbSchema = typeof schema;
export default schema;
