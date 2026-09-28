import { NextResponse } from "next/server";
import { leadsRepository } from "@/lib/data/leads.repository";

// Public lead-capture endpoint (PRD §2.1.7). Real deployments must add
// reCAPTCHA verification and rate limiting here before going live.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const email = typeof input.email === "string" ? input.email.trim() : "";
  const phone = typeof input.phone === "string" ? input.phone.trim() : "";
  const consentMarketing = input.consentMarketing === true;

  if (!name || !email || !phone) {
    return NextResponse.json(
      { error: "Name, email, and phone are required." },
      { status: 400 }
    );
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }
  if (!consentMarketing) {
    return NextResponse.json(
      { error: "Marketing consent is required to submit this form." },
      { status: 400 }
    );
  }

  const serviceInterest = Array.isArray(input.serviceInterest)
    ? input.serviceInterest.filter((s): s is string => typeof s === "string")
    : [];

  const lead = await leadsRepository.create({
    name,
    companyName: typeof input.companyName === "string" ? input.companyName : undefined,
    email,
    phone,
    serviceInterest,
    message: typeof input.message === "string" ? input.message : undefined,
    consentMarketing,
  });

  return NextResponse.json({ lead }, { status: 201 });
}
