"use client";

import React from "react";
import { useBookingModal } from "./BookingModalContext";

interface BookOnlineButtonProps {
  serviceSlug?: string;
  className?: string;
  children?: React.ReactNode;
}

export function BookOnlineButton({
  serviceSlug,
  className = "rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition",
  children = "Book Online",
}: BookOnlineButtonProps) {
  const { openBookingModal } = useBookingModal();

  return (
    <button
      type="button"
      onClick={() => openBookingModal(serviceSlug)}
      className={className}
    >
      {children}
    </button>
  );
}
