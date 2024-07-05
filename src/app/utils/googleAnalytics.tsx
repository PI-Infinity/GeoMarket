// components/GoogleAnalytics.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import { pageView } from "nextjs-google-analytics";

const GoogleAnalytics = ({ trackingId }: any) => {
  const router = useRouter();

  useEffect(() => {
    if (!trackingId) return;

    const handleRouteChange = (url: any) => {
      pageView(url, trackingId);
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [trackingId, router.events]);

  return null;
};

export default GoogleAnalytics;
