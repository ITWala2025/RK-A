"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface BookingModalContextType {
  isOpen: boolean;
  selectedServiceSlug: string;
  openBookingModal: (serviceSlug?: string) => void;
  closeBookingModal: () => void;
}

const BookingModalContext = createContext<BookingModalContextType | undefined>(undefined);

export function BookingModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedServiceSlug, setSelectedServiceSlug] = useState<string>("accounting-and-bookkeeping");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const openBookingModal = useCallback((serviceSlug?: string) => {
    if (serviceSlug) {
      setSelectedServiceSlug(serviceSlug);
    }
    setIsOpen(true);
  }, []);

  const closeBookingModal = useCallback(() => {
    setIsOpen(false);
    // If the URL had book query or book-online path, clean it up cleanly
    if (searchParams.get("book") || searchParams.get("booking")) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("book");
      newParams.delete("booking");
      const queryString = newParams.toString();
      router.replace(`${pathname}${queryString ? `?${queryString}` : ""}`, { scroll: false });
    }
  }, [searchParams, router, pathname]);

  // Check URL query on mount or change e.g. ?book=taxation-and-advisory
  useEffect(() => {
    const bookParam = searchParams.get("book") || searchParams.get("booking");
    if (bookParam) {
      setSelectedServiceSlug(bookParam === "true" ? "accounting-and-bookkeeping" : bookParam);
      setIsOpen(true);
    }
  }, [searchParams]);

  return (
    <BookingModalContext.Provider
      value={{
        isOpen,
        selectedServiceSlug,
        openBookingModal,
        closeBookingModal,
      }}
    >
      {children}
    </BookingModalContext.Provider>
  );
}

export function useBookingModal() {
  const context = useContext(BookingModalContext);
  if (!context) {
    throw new Error("useBookingModal must be used within a BookingModalProvider");
  }
  return context;
}
