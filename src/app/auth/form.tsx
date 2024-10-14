"use client";

import { useState, FormEvent } from "react";
import { login, register } from "./actions";
import { cn } from "@/lib/util";

export default function AuthForm({ username }: { username?: string }) {
  const [mode, setMode] = useState<"login" | "register">("register");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setPending(true);
    const fd = new FormData(e.currentTarget);
    const { error = "" } =
      (await (mode === "login" ? login(fd) : register(fd))) ?? {};
    setPending(false);
    setError(error);
  }

  return (
    <div className="flex flex-col gap-4 items-center max-w-sm w-full h-min px-6 py-3 rounded-lg border border-gray-400 dark:border-gray-700">
      <h1 className="text-3xl font-bold">
        {mode === "login" ? "Login" : "Create Account"}
      </h1>
      {username && (
        <div className="border border-amber-500 bg-amber-500/50 text-amber-500 px-4 py-2 rounded-lg w-full mx-4">
          You&apos;re already logged in as <code>{username}</code>. Logging in
          as another user will log you out of this one.
        </div>
      )}
      {error && (
        <div className="border border-red-500 bg-red-500/50 text-red-500 px-4 py-2 rounded-lg w-full mx-4">
          {error}
        </div>
      )}
      <form className="flex flex-col gap-2 w-full" onSubmit={submit}>
        <label className="font-medium" htmlFor="username">
          Username
        </label>
        <input
          name="username"
          type="text"
          id="username"
          placeholder="Enter your username"
          className="w-full text-lg"
          required
          maxLength={64}
          minLength={4}
        />
        <label className="font-medium" htmlFor="password">
          Password
        </label>
        <input
          name="password"
          type="password"
          placeholder="Enter your password"
          id="password"
          className="w-full text-lg"
          required
          maxLength={256}
        />
        {mode === "register" && (
          <>
            <label className="font-medium" htmlFor="password">
              Confirm Password
            </label>
            <input
              name="cpassword"
              type="password"
              placeholder="Enter your password again"
              id="cpassword"
              className="w-full text-lg"
              required
              maxLength={256}
            />
          </>
        )}
        <div className="flex gap-2 flex-col-reverse sm:flex-row items-center justify-between mt-4">
          <button
            className="link"
            type="button"
            onClick={() =>
              setMode((m) => (m === "login" ? "register" : "login"))
            }
          >
            {mode === "login" ? "No Account? Create one" : "Login instead"}
          </button>
          <button className={cn("btn", pending && "pending")}>
            {mode === "login" ? "Login" : "Create Account"}
          </button>
        </div>
      </form>
    </div>
  );
}
