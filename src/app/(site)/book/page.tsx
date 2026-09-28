"use client";

import { useState, useTransition, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { servicePages } from "@/lib/domain/services-content";

const TIME_SLOTS = [
  "09:00 AM",
  "10:30 AM",
  "12:00 PM",
  "02:00 PM",
  "03:30 PM",
  "05:00 PM",
];

function BookOnlineContent() {
  const searchParams = useSearchParams();
  const initialServiceSlug = searchParams.get("service") || "accounting-and-bookkeeping";

  const [selectedServiceSlug, setSelectedServiceSlug] = useState<string>(initialServiceSlug);
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

  const currentService =
    servicePages.find((s) => s.slug === selectedServiceSlug || s.aliases?.includes(selectedServiceSlug)) ||
    servicePages[0];

  function handleBookingSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(() => {
      setStep("confirmed");
    });
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-slate-900 text-white py-14">
        <div className="mx-auto max-w-6xl px-6">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            RK &amp; Associates &bull; Dublin, Ireland
          </span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Book a Consultation
          </h1>
          <p className="mt-3 max-w-2xl text-base text-slate-300">
            Select a service, choose a convenient date and time, and schedule your direct session with our
            certified chartered accountants. All prices in Euros (€).
          </p>
        </div>
      </section>

      {/* Main Flow */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-5xl px-6">
          {step === "confirmed" ? (
            <div className="rounded-2xl border border-emerald-200 bg-white p-10 text-center shadow-lg">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <svg className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="mt-5 text-2xl font-bold text-slate-900">Booking Confirmed!</h2>
              <p className="mt-2 text-slate-600">
                Thank you, <span className="font-semibold text-slate-900">{clientInfo.firstName} {clientInfo.lastName}</span>.
                We have scheduled your appointment with RK &amp; Associates.
              </p>

              <div className="mx-auto mt-8 max-w-md rounded-xl border border-slate-200 bg-slate-50 p-6 text-left text-sm space-y-3">
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

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  href="/"
                  className="rounded-lg bg-emerald-800 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition"
                >
                  Return to Home
                </Link>
                <button
                  type="button"
                  onClick={() => setStep("select")}
                  className="rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Book Another Session
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Left 2 Cols: Service & Date/Time selector */}
              <div className="lg:col-span-2 space-y-8">
                {step === "select" ? (
                  <>
                    {/* 1. Service Selection */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                      <h3 className="text-lg font-bold text-slate-900 mb-4">
                        1. Select Service Package
                      </h3>
                      <div className="space-y-3">
                        {servicePages.filter(s => s.price).map((srv) => {
                          const isSelected = srv.slug === selectedServiceSlug || srv.aliases?.includes(selectedServiceSlug);
                          return (
                            <div
                              key={srv.slug}
                              onClick={() => setSelectedServiceSlug(srv.slug)}
                              className={`cursor-pointer rounded-xl border p-5 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                                isSelected
                                  ? "border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600"
                                  : "border-slate-200 hover:border-slate-300 bg-white"
                              }`}
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name="service"
                                    checked={isSelected}
                                    onChange={() => setSelectedServiceSlug(srv.slug)}
                                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                                  />
                                  <span className="font-bold text-slate-900">{srv.title}</span>
                                </div>
                                <p className="mt-1 text-xs text-slate-500 pl-6">{srv.tagline}</p>
                              </div>
                              <div className="text-right pl-6 sm:pl-0">
                                <span className="text-lg font-extrabold text-emerald-800">{srv.price}</span>
                                <span className="block text-xs text-slate-500">{srv.duration}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 2. Date & Time Selection */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                      <h3 className="text-lg font-bold text-slate-900 mb-4">
                        2. Choose Date &amp; Time
                      </h3>
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                            Appointment Date
                          </label>
                          <input
                            type="date"
                            value={selectedDate}
                            min={new Date().toISOString().split("T")[0]}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm shadow-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                            Available Time Slots
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {TIME_SLOTS.map((slot) => {
                              const isSelected = slot === selectedTime;
                              return (
                                <button
                                  key={slot}
                                  type="button"
                                  onClick={() => setSelectedTime(slot)}
                                  className={`rounded-lg py-2 text-xs font-semibold transition ${
                                    isSelected
                                      ? "bg-emerald-800 text-white shadow"
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

                      <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setStep("details")}
                          className="rounded-lg bg-emerald-800 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition"
                        >
                          Continue to Details &rarr;
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Step 2: Client details */
                  <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-slate-900">Your Contact Details</h3>
                      <button
                        type="button"
                        onClick={() => setStep("select")}
                        className="text-xs font-semibold text-emerald-800 hover:underline"
                      >
                        &larr; Change Service / Date
                      </button>
                    </div>

                    <form onSubmit={handleBookingSubmit} className="space-y-5">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700">First Name *</label>
                          <input
                            type="text"
                            required
                            value={clientInfo.firstName}
                            onChange={(e) => setClientInfo({ ...clientInfo, firstName: e.target.value })}
                            className="mt-1 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700">Last Name *</label>
                          <input
                            type="text"
                            required
                            value={clientInfo.lastName}
                            onChange={(e) => setClientInfo({ ...clientInfo, lastName: e.target.value })}
                            className="mt-1 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700">Email *</label>
                          <input
                            type="email"
                            required
                            value={clientInfo.email}
                            onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                            className="mt-1 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700">Phone *</label>
                          <input
                            type="tel"
                            required
                            value={clientInfo.phone}
                            onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
                            className="mt-1 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700">
                          Special requirements / Notes (optional)
                        </label>
                        <textarea
                          rows={3}
                          value={clientInfo.notes}
                          onChange={(e) => setClientInfo({ ...clientInfo, notes: e.target.value })}
                          className="mt-1 block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
                          placeholder="Tell us about your business or specific tax topics you want to discuss..."
                        />
                      </div>

                      <div className="pt-4 flex gap-4">
                        <button
                          type="button"
                          onClick={() => setStep("select")}
                          className="w-1/3 rounded-lg border border-slate-300 bg-white py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          className="w-2/3 rounded-lg bg-emerald-800 py-3 text-sm font-semibold text-white hover:bg-emerald-700 shadow"
                        >
                          Confirm Appointment ({currentService.price})
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>

              {/* Summary Card */}
              <div className="lg:col-span-1">
                <div className="sticky top-28 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                    Booking Summary
                  </h3>
                  <div className="mt-4 space-y-3 text-sm">
                    <div>
                      <span className="text-xs text-slate-500 block">Service</span>
                      <span className="font-bold text-slate-900">{currentService.title}</span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">Date &amp; Time</span>
                      <span className="font-semibold text-emerald-800">
                        {selectedDate} &bull; {selectedTime}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">Duration</span>
                      <span className="text-slate-700">{currentService.duration}</span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block">Location</span>
                      <span className="text-slate-700">Saint Kevin&apos;s, Dublin 8 / Remote</span>
                    </div>
                    <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
                      <span className="font-bold text-slate-900">Total Price:</span>
                      <span className="text-xl font-extrabold text-emerald-800">
                        {currentService.price}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-slate-100 pt-4 text-xs text-slate-500 space-y-1">
                    <p>✓ Instant confirmation</p>
                    <p>✓ Free reschedule up to 24h prior</p>
                    <p>✓ Dedicated chartered advisor</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading booking portal...</div>}>
      <BookOnlineContent />
    </Suspense>
  );
}
