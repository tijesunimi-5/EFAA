import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Emergency First Aid Assistant",
    short_name: "EFAA",
    description: "Interactive clinical guidelines for emergency first aid.",
    start_url: "/home",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f766e", // Your teal-700 color
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
