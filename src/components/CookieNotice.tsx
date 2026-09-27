"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const KEY = "dc-cookie-notice";

// The site sets no tracking cookies. The notice says so, once, and remembers
// the dismissal in localStorage; if storage is unavailable it simply shows
// again next visit.
export function CookieNotice() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      // storage unavailable; the notice will show again next visit
    }
    setShow(false);
  }

  if (!show) return null;
  return (
    <div className="cookie-notice" role="dialog" aria-label="Cookies">
      <p>
        <b>No tracking cookies.</b> This site keeps your theme choice in your
        browser and nothing else. Signing in to the dashboard sets one session
        cookie there.{" "}
        <Link href="/privacy" className="ulink">
          Privacy policy
        </Link>
      </p>
      <button
        type="button"
        className="btn btn-primary btn-sm"
        onClick={dismiss}
      >
        Got it
      </button>
    </div>
  );
}
