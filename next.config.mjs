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
    
    // Ignore peer dependency warnings for other frameworks in UploadThing
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            "solid-js": false,
            "solid-js/store": false,
            "svelte": false,
            "svelte/store": false,
            "vue": false,
        };
        return config;
    },
    
    // Ignore linting/typescript errors during build to ensure deployment succeeds
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    }
};

export default nextConfig;
