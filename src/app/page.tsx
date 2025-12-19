"use client";

import logo from "@/app/assets/logo.png";
import Image from "next/image";
import { useEffect, useState } from "react";

const AUTH_SERVICE_URL =
  process.env.NEXT_PUBLIC_AUTH_SERVICE_URL ??
  "https://accounts.sliitmozilla.org";

type User = {
  id: string;
  name: string;
  email: string;
  private: boolean;
  roles: string[];
  createdAt: Date;
};

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    if (!token) return;
    (async () => {
      const response = await fetch(`${AUTH_SERVICE_URL}/api/users/me`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const result = await response.json();
      setUser(result.data);
    })();
  }, [token]);

  return (
    <main className="grid gap-8 h-screen p-4 content-center-safe justify-center-safe justify-items-center-safe">
      {user ? (
        <>
          <h1 className="font-bold text-7xl">Logged in!</h1>
          <div className="flex gap-5 items-start">
            <table>
              <tbody className="[&>tr>td]:p-2 [&>tr>td]:border [&>tr>td]:border-white [&>tr]:bg-gray-100 [&>tr]:even:bg-gray-50">
                <tr>
                  <td>ID</td>
                  <td>{user.id}</td>
                </tr>
                <tr>
                  <td>Name</td>
                  <td>{user.name}</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>{user.email}</td>
                </tr>
                <tr>
                  <td>Private</td>
                  <td>{user.private}</td>
                </tr>
                <tr>
                  <td>Roles</td>
                  <td>{user.roles}</td>
                </tr>
              </tbody>
            </table>
            <div>
              <h3>JSON Data</h3>
              <pre>
                <code>{JSON.stringify(user, null, 2)}</code>
              </pre>
            </div>
          </div>
        </>
      ) : (
        <>
          <h1 className="font-bold text-7xl">Auth flow demo</h1>
          <a
            className="cursor-pointer bg-white border border-[#FF4814] px-3 py-2 rounded-2xl"
            href={`${AUTH_SERVICE_URL}/api/authorize?redirect=http%3A%2F%2Flocalhost%3A3001%2Fcallback`}
          >
            <button className="flex gap-2 items-center cursor-pointer">
              <Image src={logo} alt="sliitmozilla" width={28} />
              <span className="text-xl">Login with sliitmozilla</span>
            </button>
          </a>
        </>
      )}
    </main>
  );
}
