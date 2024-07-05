/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
      },
    ],
  },
  env: {
    API_URL: "https://geomarket-cbe439ac7bf9.herokuapp.com",
    GOOGLE_CLIENT_ID:
      "211246211778-7j18gi9fkh6lgv3iosk62urd03suqt8p.apps.googleusercontent.com",
    API_KEY_GOOGLE: "AIzaSyA61_a1cztE7_ygTRUdET6qN62cnYrOMvY",
    GOOGLE_ANALYTICS_TRACKINGID: "G-RMKWTM0RLX",
  },
  pageExtensions: ["mdx", "md", "jsx", "js", "tsx", "ts"],
  reactStrictMode: false, // Set to false to disable Strict Mode temporarily
};

module.exports = nextConfig;
