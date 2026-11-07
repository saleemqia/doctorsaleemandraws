import { useEffect } from "react";

export default function VisitorCounter() {
  useEffect(() => {
    if (location.pathname.startsWith("/clinic") || location.pathname.startsWith("/admin")) return;
    fetch("/api/visit", {
      method: "POST",
      credentials: "same-origin",
      cache: "no-store",
      keepalive: true,
    }).catch(() => {});
  }, []);
  return null;
}
