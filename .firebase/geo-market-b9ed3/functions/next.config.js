"use strict";

// next.config.js
var nextConfig = {
  images: {
    domains: ["firebasestorage.googleapis.com"]
  },
  env: {
    API_URL: "https://geomarket-cbe439ac7bf9.herokuapp.com",
    GOOGLE_CLIENT_ID: "211246211778-7j18gi9fkh6lgv3iosk62urd03suqt8p.apps.googleusercontent.com",
    API_KEY_GOOGLE: "AIzaSyA61_a1cztE7_ygTRUdET6qN62cnYrOMvY"
  },
  pageExtensions: ["mdx", "md", "jsx", "js", "tsx", "ts"]
};
module.exports = nextConfig;
