import {
  defaultStatements,
  adminAc,
  userAc,
} from "better-auth/plugins/admin/access";
import { createAccessControl } from "better-auth/plugins/access";

export const ac = createAccessControl({
  ...defaultStatements,
});

export const admin = ac.newRole({
  ...adminAc.statements,
});

export const user = ac.newRole({
  ...userAc.statements,
});
