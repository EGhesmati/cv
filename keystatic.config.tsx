import { config, collection, fields } from "@keystatic/core"

const isProduction = process.env.NODE_ENV === "production"

export default config({
  // Local dev edits the filesystem directly (content/posts/ in this folder).
  // Production (Vercel) reads/writes EGhesmati/cv via the GitHub API.
  storage: isProduction
    ? {
        kind: "github",
        repo: {
          owner: "EGhesmati",
          name: "cv",
        },
      }
    : { kind: "local" },
  collections: {
    posts: collection({
      label: "Blog Posts",
      slugField: "title",
      path: "content/posts/*",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({
          name: { label: "Title" },
          slug: {
            label: "Slug",
            description: "URL-friendly identifier (auto-generated from title)",
          },
        }),
        description: fields.text({
          label: "Description",
          description: "Brief summary shown in post cards and SEO meta",
          multiline: true,
        }),
        date: fields.date({
          label: "Date",
          defaultValue: { kind: "today" },
        }),
        tags: fields.array(
          fields.text({ label: "Tag" }),
          {
            label: "Tags",
            itemLabel: (props) => props.value ?? "Tag",
          }
        ),
        content: fields.mdx({
          label: "Content",
          extension: "md",
        }),
      },
    }),
  },
})
