import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import schema from "../packages/db/src/schemas/index";

export type User = InferSelectModel<typeof schema.user>;
export type NewUser = InferInsertModel<typeof schema.user>;

export type Session = InferSelectModel<typeof schema.session>;
export type NewSession = InferInsertModel<typeof schema.session>;

export type Identity = InferSelectModel<typeof schema.identity>;
export type NewIdentity = InferInsertModel<typeof schema.identity>;

export type Verification = InferSelectModel<typeof schema.verification>;
export type NewVerification = InferInsertModel<typeof schema.verification>;
