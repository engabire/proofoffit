"use client";

import React from "react";
import { NotificationCenter } from "@/components/notifications/notification-center";

export default function NotificationsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-4">Notifications</h1>
                    <p className="text-xl text-gray-600">
                        Stay updated with your job applications, matches, and
                        career progress
                    </p>
                </div>

                {/* Notification Center */}
                <NotificationCenter />
            </div>
        </div>
    );
}
