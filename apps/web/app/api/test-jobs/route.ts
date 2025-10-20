import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    try {
        return NextResponse.json({
            success: true,
            message: "Jobs API is working",
            data: {
                timestamp: new Date().toISOString(),
                endpoint: "/api/test-jobs"
            }
        });
    } catch (error) {
        console.error("Error in test-jobs endpoint:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
};
