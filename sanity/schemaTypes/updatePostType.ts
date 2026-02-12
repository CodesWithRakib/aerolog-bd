import { DocumentTextIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const updatePostType = defineType({
  name: "updatePost",
  title: "Live Update",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title (Optional)",
      type: "string",
      description: "Short, optional title for the update",
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "text",
      description: "Brief update (3-5 lines max)",
      validation: (Rule) => Rule.required().max(300),
      rows: 3,
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      description: "When this update was published",
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
  ],
  orderings: [
    {
      title: "Latest First",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "content",
      date: "publishedAt",
    },
    prepare(selection) {
      const { title, subtitle, date } = selection;
      const dateObj = date ? new Date(date) : new Date();
      return {
        title: title || "Untitled Update",
        subtitle: subtitle ? subtitle.substring(0, 60) + "..." : "No content",
        media: DocumentTextIcon,
      };
    },
  },
});
