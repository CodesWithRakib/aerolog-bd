import { type SchemaTypeDefinition } from "sanity";

import { updatePostType } from "./updatePostType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [updatePostType],
};
