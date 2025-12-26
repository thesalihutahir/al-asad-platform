/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "utfs.io",
            },
            {
                protocol: "https",
                hostname: "img.clerk.com", 
            }
        ],
    },
    // --- ADD THIS BLOCK TO FIX THE BUILD ERROR ---
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            // Mock these modules to empty objects so webpack doesn't crash
            "solid-js": false,
            "solid-js/store": false,
            "svelte": false,
            "svelte/store": false,
            "vue": false,
        };
        return config;
    },
};

export default nextConfig;
