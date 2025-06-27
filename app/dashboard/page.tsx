"use client";

import { useState } from "react";

export default function Dashboard() {
  const [form, setForm] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    interests: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="flex flex-col items-center min-h-screen bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)] p-6">
      <div className="w-full max-w-lg tg-card shadow-lg p-8 mt-10">
        <h1 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
          Trip Preferences
        </h1>
        {submitted ? (
          <div className="text-green-400 text-center text-lg font-semibold">
            Thank you! Your preferences have been submitted.
          </div>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block tg-hint mb-1" htmlFor="destination">Destination</label>
              <input
                type="text"
                id="destination"
                name="destination"
                value={form.destination}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-[var(--tg-theme-secondary-bg-color)] text-[var(--tg-theme-text-color)] border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Where do you want to go?"
                required
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block tg-hint mb-1" htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-[var(--tg-theme-secondary-bg-color)] text-[var(--tg-theme-text-color)] border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block tg-hint mb-1" htmlFor="endDate">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-[var(--tg-theme-secondary-bg-color)] text-[var(--tg-theme-text-color)] border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block tg-hint mb-1" htmlFor="budget">Budget (USD)</label>
              <input
                type="number"
                id="budget"
                name="budget"
                value={form.budget}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-[var(--tg-theme-secondary-bg-color)] text-[var(--tg-theme-text-color)] border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="e.g. 1000"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block tg-hint mb-1" htmlFor="interests">Interests</label>
              <textarea
                id="interests"
                name="interests"
                value={form.interests}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-[var(--tg-theme-secondary-bg-color)] text-[var(--tg-theme-text-color)] border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="e.g. Beaches, Museums, Food, Adventure"
                rows={3}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 mt-2 rounded tg-button font-semibold transition"
            >
              Submit
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
