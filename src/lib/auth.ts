import { betterAuth, type BetterAuthPlugin } from "better-auth";
import { createAuthMiddleware, APIError } from "better-auth/api"; // Import middleware helper
import { MongoClient, ObjectId } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin, jwt } from "better-auth/plugins";

// 1. Environment & Client Setup
const mongoUri = process.env.MONGODB_URI;
const googleClientId = process.env.GOOGLE_CLIENTID;
const googleSecret = process.env.GOOGLE_SECRET;

if (!mongoUri) {
  throw new Error("Missing MONGODB_URI environment variable.");
}
if (!googleClientId || !googleSecret) {
  throw new Error("Missing Google OAuth environment variables.");
}

const client = new MongoClient(mongoUri);
const db = client.db("rentease_db"); // Updated database name

interface DbUser {
  _id: ObjectId | string;
  banned?: boolean;
  accountType?: "student" | "landlord";
  bio?: string;
  skills?: string[]; // Keeps schema structural compatibility for habits
}

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: googleClientId,
      clientSecret: googleSecret,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 7 * 24 * 60 * 60,
    },
  },
  user: {
    additionalFields: {
      accountType: {
        type: "string",
        required: false,
        defaultValue: "student", // Defaults to student/tenant role
      },
      bio: {
        type: "string",
        required: false,
      },
      skills: {
        type: "string[]",
        required: false, // Maps the student's lifestyle habits
      },
      banned: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          return {
            data: {
              ...user,
              accountType: user.accountType || "student",
              banned: false,
            },
          };
        },
      },
    },
  },
  plugins: [
    jwt(),
    admin(),
    {
      id: "ban-enforcer",
      hooks: {
        before: [
          {
            matcher: (context) => {
              return !!(
                context.path?.startsWith("/session") || 
                context.path?.startsWith("/get-session")
              );
            },
            handler: createAuthMiddleware(async (ctx) => {
              const sessionContext = ctx.context.session;
              
              if (sessionContext?.user?.id) {
                const user = await db
                  .collection<DbUser>("users")
                  .findOne({ _id: sessionContext.user.id });

                if (user?.banned === true) {
                  throw new APIError("UNAUTHORIZED", {
                    message: "This account has been suspended by an administrator.",
                  });
                }
              }

              
              return { context: ctx };
            }),
          },
        ],
      },
    } satisfies BetterAuthPlugin,
  ],
});