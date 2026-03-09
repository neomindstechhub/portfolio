import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { eventConfig } from "@/data/eventConfig";

const INTEREST_OPTIONS = [
  "Custom AI & ML Solutions",
  "HR & Recruitment Automation",
  "E-commerce & Analytics",
  "Product Development",
  "Custom Training Programs",
  "Web & Mobile Development",
  "Automation Solutions",
  "Healthcare / Mental Wellness",
  "EdTech / Learning Platforms",
  "Banking & FinTech",
  "Other",
] as const;

export default function EventRegistration() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Please enter a valid email";
    if (!phone.trim()) newErrors.phone = "Mobile number is required";
    else {
      const digitsOnly = phone.replace(/\D/g, "");
            if (digitsOnly.length < 10)
        newErrors.phone = "Please enter a valid phone number";
    }
    if (!interest) newErrors.interest = "Please select an area of interest";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = { name, email, phone, interest, message };

    try {
      setErrors({ _form: "" });
      const res = await fetch("/api/submit-to-sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json().catch(() => ({}));
      if (res.ok && result?.success) {
        setSubmitted(true);
        return;
      }
      throw new Error(result?.error ?? "Failed to submit");
    } catch {
      if (eventConfig.googleFormUrl) {
        const params = new URLSearchParams({
          "entry.xxx_name": name,
          "entry.xxx_email": email,
          "entry.xxx_phone": phone,
          "entry.xxx_interest": interest,
          "entry.xxx_message": message,
        });
        window.location.href = `${eventConfig.googleFormUrl}?${params}`;
        return;
      }
      setErrors({
        _form:
          window.location.hostname === "localhost"
            ? "Form API not available in local dev. Use 'vercel dev' to test, or deploy to Vercel."
            : "Submission failed. Please try again or contact us directly.",
      });
    }
  };

  if (submitted && !eventConfig.googleFormUrl) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 sm:p-10 text-center shadow-[0_18px_80px_rgba(0,0,0,0.5)]">
          <h2 className="text-heading-2 font-bold text-foreground mb-2">
            Registration submitted
          </h2>
          <p className="text-body text-muted-foreground mb-6">
            Thank you for registering. We&apos;ll send confirmation details to{" "}
            <span className="text-foreground font-medium">{email}</span>.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-cta text-white font-medium hover:bg-primary-cta-hover transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm sm:text-body text-muted-foreground hover:text-primary transition-colors mb-6 sm:mb-8 py-2 -ml-1 touch-manipulation"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to portfolio
      </Link>

      <article className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 sm:p-8 shadow-[0_18px_80px_rgba(0,0,0,0.5)]">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-heading-1 font-bold text-foreground mb-4">
            Register for Demo
          </h1>
          <p className="text-sm sm:text-body text-muted-foreground mb-2 break-words">
            <strong>Address:</strong> {eventConfig.address}
          </p>
          <p className="text-sm sm:text-body text-muted-foreground">
            <strong>Contact:</strong>{" "}
            <a
              href={`tel:${eventConfig.contactPhone.replace(/\D/g, "")}`}
              className="text-primary hover:underline"
            >
              {eventConfig.contactPhone}
            </a>{" "}
            ·{" "}
            <a
              href={`mailto:${eventConfig.contactEmail}`}
              className="text-primary hover:underline"
            >
              {eventConfig.contactEmail}
            </a>
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-body font-medium text-foreground mb-1.5">
              Name <span className="text-primary">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-3 sm:py-2.5 rounded-lg bg-white/5 border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[48px] touch-manipulation ${
                errors.name ? "border-red-500/70" : "border-white/10"
              }`}
              placeholder="Your name"
              aria-label="Name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p id="name-error" className="mt-1 text-caption text-red-400">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-body font-medium text-foreground mb-1.5">
              Email <span className="text-primary">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 sm:py-2.5 rounded-lg bg-white/5 border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[48px] touch-manipulation ${
                errors.email ? "border-red-500/70" : "border-white/10"
              }`}
              placeholder="you@example.com"
              aria-label="Email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-caption text-red-400">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-body font-medium text-foreground mb-1.5">
              Phone <span className="text-primary">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`w-full px-4 py-3 sm:py-2.5 rounded-lg bg-white/5 border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[48px] touch-manipulation ${
                errors.phone ? "border-red-500/70" : "border-white/10"
              }`}
              placeholder="+1 234 567 8900"
              aria-label="Phone number"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
            />
            {errors.phone && (
              <p id="phone-error" className="mt-1 text-caption text-red-400">
                {errors.phone}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="interest" className="block text-body font-medium text-foreground mb-1.5">
              Area of interest <span className="text-primary">*</span>
            </label>
            <select
              id="interest"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              className={`registration-select w-full px-4 py-3 sm:py-2.5 pr-10 rounded-lg border text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none cursor-pointer bg-no-repeat bg-[length:1rem_1rem] bg-[right_0.75rem_center] min-h-[48px] touch-manipulation ${
                errors.interest ? "border-red-500/70" : "border-white/10"
              }`}
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")` }}
              aria-label="Area of interest"
              aria-invalid={!!errors.interest}
              aria-describedby={errors.interest ? "interest-error" : undefined}
            >
              <option value="">Select your area of interest</option>
              {INTEREST_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {errors.interest && (
              <p id="interest-error" className="mt-1 text-caption text-red-400">
                {errors.interest}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="message" className="block text-body font-medium text-foreground mb-1.5">
              Message <span className="text-muted-foreground/70">(optional)</span>
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder="Tell us about your requirements or any questions..."
              aria-label="Additional message"
            />
          </div>

          {errors._form && (
            <p className="text-caption text-red-400">{errors._form}</p>
          )}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 min-h-[48px] rounded-lg bg-primary-cta text-white font-medium hover:bg-primary-cta-hover active:scale-[0.98] transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background touch-manipulation"
            >
              Register
            </button>
          </div>
        </form>
      </article>
    </div>
  );
}
