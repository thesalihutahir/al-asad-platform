/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "firebasestorage.googleapis.com", // Added for Firebase Storage
            },
            {
                protocol: "https",
                hostname: "img.clerk.com", 
            }
        ],
    },

    typescript: {
        ignoreBuildErrors: true,
    }
};

module.exports = nextConfig;
