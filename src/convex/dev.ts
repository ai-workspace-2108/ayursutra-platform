const comment = `This development script has been simplified.
Use: npx convex run seedData:seedTestData
This seeds therapists, dietitians, patients, sessions with valid tables.`;

import { mutation } from "./_generated/server";

export const info = mutation({
  args: {},
  handler: async () => {
    return comment;
  },
});