import { metadataMap } from "@/data/data";

export default async function generatePageMetadata(slug: string) {
    const metadata = metadataMap[slug];

    if (!metadata) {
        return {
            publisher: "Vortexio Solutions",
            twitter: {
                creator: "Vortexio Solutions",
            },
        };
    }

    return {
        title: metadata.title,
        description: metadata.description,
        keywords: metadata.keywords,
        publisher: "Vortexio Solutions",
        metadataBase: new URL("https://www.vortexiosolutions.com"),
        robots: {
            index: true,
            follow: true,
        },
        alternates: {
            canonical: metadata.url,
            types: {
                "application/rss+xml": metadata.feed,
            },
        },

        openGraph: {
            title: metadata.metaTitle,
            description: metadata.description,
            url: metadata.url,
            type: "website",
            images: [
                {
                    url: "/vortexio.png",
                    width: 1677,
                    height: 1118,
                    alt: metadata.metaTitle,
                    type: "image/webp",
                },
            ],
            authors: [metadata.author || "Vortexio Solutions"],
        },

        twitter: {
            card: "summary_large_image",
            title: metadata.metaTitle,
            description: metadata.description,
            creator: metadata.author || "Vortexio Solutions",
            images: ["/vortexio.png"],
        },
        verification: {
            google: "olCTCvPUZd-kU5I2TADEV8909TNjsB9z63cCBcuQQXA",
        },
    };
}