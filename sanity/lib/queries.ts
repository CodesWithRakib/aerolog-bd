export const allUpdatesQuery = `*[_type == "updatePost"] | order(publishedAt desc) {
  _id,
  title,
  content,
  publishedAt
}`;
