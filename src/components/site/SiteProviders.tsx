"use client";

import React, { Suspense } from "react";
import { BookingModalProvider } from "./BookingModalContext";
import { BookingModal } from "./BookingModal";

export function SiteProviders({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <BookingModalProvider>
        {children}
        <BookingModal />
      </BookingModalProvider>
    </Suspense>
  );
}
