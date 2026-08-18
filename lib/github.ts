import type { GitHubRepo } from "@/types/github"

const GITHUB_USERNAME = "EGhesmati"
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`

/**
 * Fetch public, non-fork repos for the configured GitHub user.
 * Uses ISR with a 1-hour revalidation to stay within unauthenticated
 * rate limits (60 req/h). Cached + deduped by Next.js during a single render.
 */
export async function getGitHubRepos(): Promise<GitHubRepo[]> {
  try {
    const res = await fetch(GITHUB_API_URL, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        // If you set GITHUB_TOKEN in env, uncomment to raise the rate limit to 5000/h:
        // Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      console.error(`GitHub API error: ${res.status} ${res.statusText}`)
      return []
    }

    const repos: GitHubRepo[] = await res.json()

    return repos
      .filter((repo) => !repo.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
  } catch (error) {
    console.error("Failed to fetch GitHub repos:", error)
    return []
  }
}
