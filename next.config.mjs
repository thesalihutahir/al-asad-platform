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
    
    // Fix for UploadThing dependency resolution
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
    
    // We removed the 'eslint' block here to fix the warning.
    // We kept 'typescript' because the logs didn't complain about it.
    typescript: {
        ignoreBuildErrors: true,
    }
};

export default nextConfig;
