import { config, collection, fields } from "@keystatic/core"

export default config({
  storage: {
    kind: "local",
  },
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
