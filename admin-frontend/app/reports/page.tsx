"use client";

import React from "react";
import { FiBook, FiUsers, FiBarChart2 } from "react-icons/fi";

export default function AdminReports() {
  // Placeholder data
  const reports = [
    { title: "Total Books", value: 245, icon: <FiBook className="text-gray-600 text-3xl" /> },
    { title: "Active Users", value: 102, icon: <FiUsers className="tex-gray-600 text-3xl" /> },
    { title: "Books Borrowed Today", value: 34, icon: <FiBarChart2 className="text-gray-600 text-3xl" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-600 text-white p-6">
        <h1 className="text-2xl font-bold">Admin Reports</h1>
        <p className="text-gray-200 mt-1">Overview of library activity and stats</p>
      </header>

      {/* Reports Cards */}
      <main className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {reports.map((report, i) => (
          <div
            key={i}
            className="bg-white shadow-lg rounded-lg p-6 flex items-center gap-4 hover:shadow-xl transition"
          >
            <div>{report.icon}</div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{report.value}</h2>
              <p className="text-gray-500">{report.title}</p>
            </div>
          </div>
        ))}
      </main>

      {/* Additional Placeholder Charts / Stats */}
      <section className="max-w-6xl mx-auto px-4 py-6 bg-white rounded-lg shadow mt-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Borrowing Trends</h2>
        <div className="w-full h-64 bg-gray-100 rounded flex items-center justify-center text-gray-400">
          Chart Placeholder
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-6 bg-white rounded-lg shadow mt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Popular Categories</h2>
        <div className="w-full h-48 bg-gray-100 rounded flex items-center justify-center text-gray-400">
          Chart Placeholder
        </div>
      </section>
    </div>
  );
}
