import { auth } from "@/lib/auth"; // path to your auth file
import { toNextJsHandler } from "better-auth/next-js";

// toNextJsHandler returns an object containing properly typed Next.js GET and POST handlers
export const { POST, GET } = toNextJsHandler(auth);