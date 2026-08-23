import { makeRouteHandler } from "@keystatic/next/route-handler"
import keystaticConfig from "@/keystatic.config"

// GitHub storage requires OAuth credentials. If they're missing (e.g. during
// `next build` without env vars), fall back to local storage so the route
// handler construction never throws.
const hasGithubAuth = Boolean(
  process.env.KEYSTATIC_GITHUB_CLIENT_ID &&
    process.env.KEYSTATIC_GITHUB_CLIENT_SECRET &&
    process.env.KEYSTATIC_SECRET
)

const config = hasGithubAuth
  ? keystaticConfig
  : { ...keystaticConfig, storage: { kind: "local" as const } }

export const { GET, POST } = makeRouteHandler({
  config,
  clientId: process.env.KEYSTATIC_GITHUB_CLIENT_ID,
  clientSecret: process.env.KEYSTATIC_GITHUB_CLIENT_SECRET,
  secret: process.env.KEYSTATIC_SECRET ?? "build-time-placeholder",
})
