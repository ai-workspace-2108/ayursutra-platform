/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth_emailOtp from "../auth/emailOtp.js";
import type * as auth from "../auth.js";
import type * as dev from "../dev.js";
import type * as dietPlans from "../dietPlans.js";
import type * as dietitians from "../dietitians.js";
import type * as exercises from "../exercises.js";
import type * as http from "../http.js";
import type * as patients from "../patients.js";
import type * as practitioner_auth_logic from "../practitioner_auth_logic.js";
import type * as seedData from "../seedData.js";
import type * as sessions from "../sessions.js";
import type * as therapists from "../therapists.js";
import type * as users from "../users.js";
import type * as workoutSessions from "../workoutSessions.js";
import type * as workoutTemplates from "../workoutTemplates.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "auth/emailOtp": typeof auth_emailOtp;
  auth: typeof auth;
  dev: typeof dev;
  dietPlans: typeof dietPlans;
  dietitians: typeof dietitians;
  exercises: typeof exercises;
  http: typeof http;
  patients: typeof patients;
  practitioner_auth_logic: typeof practitioner_auth_logic;
  seedData: typeof seedData;
  sessions: typeof sessions;
  therapists: typeof therapists;
  users: typeof users;
  workoutSessions: typeof workoutSessions;
  workoutTemplates: typeof workoutTemplates;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
