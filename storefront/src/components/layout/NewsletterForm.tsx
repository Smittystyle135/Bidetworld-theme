"use client";

import { useActionState } from "react";
import { subscribeAction, type SubscribeState } from "@/lib/newsletter/actions";
import { ArrowRightIcon } from "@/components/Icons";

const initial: SubscribeState = { status: "idle" };

export function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const [state, action, pending] = useActionState(subscribeAction, initial);

  if (state.status === "success") {
    return (
      <p className={`rounded-2xl px-5 py-4 text-sm font-medium ${dark ? "bg-white/10 text-white" : "bg-success-bg text-success"}`}>
        {state.message}
      </p>
    );
  }

  return (
    <form action={action} className="space-y-2">
      <div className="relative">
        <label htmlFor={`newsletter-email-${dark ? "dark" : "light"}`} className="sr-only">
          Email address
        </label>
        <input
          id={`newsletter-email-${dark ? "dark" : "light"}`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Enter your email"
          className={`input pr-14 ${dark ? "border-transparent" : ""}`}
        />
        <button
          type="submit"
          disabled={pending}
          aria-label="Subscribe"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-ink p-2.5 text-white transition hover:bg-neutral-700 disabled:opacity-50"
        >
          <ArrowRightIcon size={18} />
        </button>
      </div>
      {state.status === "error" && <p className={`text-sm ${dark ? "text-red-300" : "text-error"}`}>{state.message}</p>}
    </form>
  );
}
