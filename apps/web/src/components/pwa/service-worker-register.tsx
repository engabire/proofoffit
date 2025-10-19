"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
    useEffect(() => {
        if (typeof window !== "undefined" && "serviceWorker" in navigator) {
            // Register service worker
            navigator.serviceWorker
                .register("/sw.js")
                .then((registration) => {
                    console.log(
                        "Service Worker registered successfully:",
                        registration,
                    );

                    // Check for updates
                    registration.addEventListener("updatefound", () => {
                        const newWorker = registration.installing;
                        if (newWorker) {
                            newWorker.addEventListener("statechange", () => {
                                if (
                                    newWorker.state === "installed" &&
                                    navigator.serviceWorker.controller
                                ) {
                                    // New version available
                                    console.log("New version available");
                                    // You could show a notification to the user here
                                }
                            });
                        }
                    });
                })
                .catch((error) => {
                    console.error("Service Worker registration failed:", error);
                });

            // Handle service worker updates
            navigator.serviceWorker.addEventListener("controllerchange", () => {
                // Service worker has been updated, reload the page
                window.location.reload();
            });

            // Handle offline/online status
            const handleOnline = () => {
                console.log("App is online");
                // You could show a notification that the app is back online
            };

            const handleOffline = () => {
                console.log("App is offline");
                // You could show a notification that the app is offline
            };

            window.addEventListener("online", handleOnline);
            window.addEventListener("offline", handleOffline);

            return () => {
                window.removeEventListener("online", handleOnline);
                window.removeEventListener("offline", handleOffline);
            };
        }
    }, []);

    return null;
}
