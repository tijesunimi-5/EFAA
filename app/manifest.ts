import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Emergency First Aid Assistant",
    short_name: "EFAA",
    description: "Interactive clinical guidelines for emergency first aid.",
    start_url: "/home",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f766e",
    icons: [
      {
        src: "/logo.svg",
        sizes: "any", // SVGs are infinitely scalable
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/logo.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
