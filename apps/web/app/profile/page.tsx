"use client";

import React from "react";
import { ProfileDashboard } from "@/components/profile/profile-dashboard";

export default function ProfilePage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-4">My Profile</h1>
                    <p className="text-xl text-gray-600">
                        Manage your professional profile and showcase your skills
                    </p>
                </div>

                {/* Profile Dashboard */}
                <ProfileDashboard />
            </div>
        </div>
    );
}
