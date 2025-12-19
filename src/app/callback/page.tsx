"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const AUTH_SERVICE_URL =
  process.env.NEXT_PUBLIC_AUTH_SERVICE_URL ??
  "https://accounts.sliitmozilla.org";

export default function Callback() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const code = searchParams.get("code");

  useEffect(() => {
    (async () => {
      if (code === null) return console.error("bad request");
      try {
        const response = await fetch(
          `${AUTH_SERVICE_URL}/api/token?code=${code}`,
          {
            method: "POST",
          }
        );
        const result = await response.json();

        if (response.ok) {
          const token = result.data.token;
          localStorage.setItem("token", token);
          console.log("redirecting...");
          await router.replace("/");
        }
      } catch (err) {
        console.error(err);
      }
    })();
  });
}
