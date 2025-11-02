import imageUrlBuilder from "@sanity/image-url";
import { createClient } from "@sanity/client";
import { SanityImageSource } from "@sanity/asset-utils";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET, // Usually 'production'
  token: process.env.NEXT_PUBLIC_SANITY_WRITE_TOKEN, // Editor or higher
  apiVersion: "2025-10-24",
  useCdn: false, // Set to true for production
});

// Get a pre-configured url-builder from your sanity client
const builder = imageUrlBuilder(client);

// Then we like to make a simple function like this that gives the
// builder an image and returns the builder for you to specify additional
// parameters:
export const urlFor = (source: SanityImageSource) => {
  return builder.image(source).auto("format");
};
