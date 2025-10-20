"use client";

import React from "react";
import { ApplicationDashboard } from "@/components/applications/application-dashboard";

export default function ApplicationsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-4">Job Applications</h1>
                    <p className="text-xl text-gray-600">
                        Track and manage your job applications with detailed analytics
                    </p>
                </div>

                {/* Application Dashboard */}
                <ApplicationDashboard />
            </div>
        </div>
    );
}
