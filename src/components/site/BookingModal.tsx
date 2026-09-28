"use client";

import { useState, useEffect, useTransition } from "react";
import { useBookingModal } from "./BookingModalContext";
import { servicePages } from "@/lib/domain/services-content";

const TIME_SLOTS = [
  "09:00 AM",
  "10:30 AM",
  "12:00 PM",
  "02:00 PM",
  "03:30 PM",
  "05:00 PM",
];

export function BookingModal() {
  const { isOpen, selectedServiceSlug, closeBookingModal } = useBookingModal();

  const [activeSlug, setActiveSlug] = useState<string>(selectedServiceSlug);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [selectedTime, setSelectedTime] = useState<string>("10:30 AM");
  const [step, setStep] = useState<"select" | "details" | "confirmed">("select");
  const [, startTransition] = useTransition();

  const [clientInfo, setClientInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: "",
  });

  useEffect(() => {
    if (selectedServiceSlug) {
      setActiveSlug(selectedServiceSlug);
    }
  }, [selectedServiceSlug]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeBookingModal();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeBookingModal]);

  if (!isOpen) return null;

  const currentService =
    servicePages.find(
      (s) =>
        s.slug === activeSlug ||
        s.aliases?.includes(activeSlug) ||
        s.slug.includes(activeSlug)
    ) || servicePages[0];

  function handleBookingSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(() => {
      setStep("confirmed");
    });
  }

  function handleResetAndClose() {
    setStep("select");
    closeBookingModal();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        onClick={closeBookingModal}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all border border-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-900 px-6 py-4 text-white">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold text-white">
              RK
            </span>
            <div>
              <h2 id="booking-modal-title" className="text-base font-bold text-white leading-tight">
                Schedule Consultation
              </h2>
              <p className="text-[11px] text-emerald-300">Dublin, Ireland &bull; Certified Accountancy</p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeBookingModal}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 flex-1">
          {step === "confirmed" ? (
            <div className="py-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <svg className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mt-4 text-2xl font-bold text-slate-900">Booking Confirmed!</h3>
              <p className="mt-2 text-sm text-slate-600">
                Thank you, <span className="font-semibold text-slate-900">{clientInfo.firstName} {clientInfo.lastName}</span>.
                We have scheduled your session with RK &amp; Associates.
              </p>

              <div className="mx-auto mt-6 max-w-md rounded-xl border border-slate-200 bg-slate-50 p-5 text-left text-xs space-y-2.5">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Service:</span>
                  <span className="font-bold text-slate-900">{currentService.title}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Date &amp; Time:</span>
                  <span className="font-semibold text-slate-900">{selectedDate} at {selectedTime}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Duration &amp; Fee:</span>
                  <span className="font-semibold text-emerald-800">{currentService.duration} &bull; {currentService.price}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Email:</span>
                  <span className="text-slate-900">{clientInfo.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Location:</span>
                  <span className="text-slate-900">Remote / Dublin 8 Office</span>
                </div>
              </div>

              <div className="mt-6 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="rounded-lg bg-emerald-800 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition"
                >
                  Done
                </button>
              </div>
            </div>
          ) : step === "select" ? (
            <div className="space-y-6">
              {/* Service Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  1. Select Service
                </label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {servicePages.filter(s => s.price).map((srv) => {
                    const isSelected = srv.slug === activeSlug || srv.aliases?.includes(activeSlug);
                    return (
                      <div
                        key={srv.slug}
                        onClick={() => setActiveSlug(srv.slug)}
                        className={`cursor-pointer rounded-xl border p-3.5 transition flex flex-col justify-between ${
                          isSelected
                            ? "border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-900">{srv.title}</span>
                            <span className="text-sm font-extrabold text-emerald-800">{srv.price}</span>
                          </div>
                          <p className="mt-1 text-xs text-slate-500 line-clamp-2">{srv.tagline}</p>
                        </div>
                        <div className="mt-3 text-[11px] font-medium text-slate-500 flex items-center justify-between">
                          <span>⏱ {srv.duration}</span>
                          <span className={`text-xs ${isSelected ? "text-emerald-700 font-bold" : "text-slate-400"}`}>
                            {isSelected ? "● Selected" : "Select"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Date & Time Picker */}
              <div className="border-t border-slate-100 pt-5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  2. Choose Appointment Date &amp; Time
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <span className="text-xs text-slate-500 mb-1.5 block">Preferred Date:</span>
                    <input
                      type="date"
                      value={selectedDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <span className="text-xs text-slate-500 mb-1.5 block">Available Time:</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {TIME_SLOTS.map((slot) => {
                        const isSelected = slot === selectedTime;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedTime(slot)}
                            className={`rounded-lg py-1.5 text-xs font-semibold transition ${
                              isSelected
                                ? "bg-emerald-800 text-white shadow-sm"
                                : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-600">
                  Total: <span className="font-bold text-slate-900 text-base">{currentService.price}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep("details")}
                  className="rounded-lg bg-emerald-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition"
                >
                  Continue &rarr;
                </button>
              </div>
            </div>
          ) : (
            /* Step 2: Contact Details */
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Your Contact Details</h4>
                  <p className="text-xs text-slate-500">
                    Booking {currentService.title} ({currentService.price}) for {selectedDate} at {selectedTime}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep("select")}
                  className="text-xs font-semibold text-emerald-800 hover:underline"
                >
                  &larr; Change
                </button>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">First Name *</label>
                    <input
                      type="text"
                      required
                      value={clientInfo.firstName}
                      onChange={(e) => setClientInfo({ ...clientInfo, firstName: e.target.value })}
                      className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={clientInfo.lastName}
                      onChange={(e) => setClientInfo({ ...clientInfo, lastName: e.target.value })}
                      className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Email *</label>
                    <input
                      type="email"
                      required
                      value={clientInfo.email}
                      onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                      className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={clientInfo.phone}
                      onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
                      className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Notes or Business Requirements (optional)
                  </label>
                  <textarea
                    rows={2}
                    value={clientInfo.notes}
                    onChange={(e) => setClientInfo({ ...clientInfo, notes: e.target.value })}
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500"
                    placeholder="Briefly describe your company or tax questions..."
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep("select")}
                    className="w-1/3 rounded-lg border border-slate-300 bg-white py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 rounded-lg bg-emerald-800 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 shadow-sm transition"
                  >
                    Confirm Appointment ({currentService.price})
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
