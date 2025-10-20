import { NextRequest, NextResponse } from "next/server";
import { withAuditLogging } from "@/lib/audit";
import { SkillAssessor } from "@/lib/assessment/skill-assessor";

export const POST = withAuditLogging(async (req: NextRequest) => {
    try {
        // Temporarily disable authentication for testing
        // const supabase = createClient();
        // const { data: { user } } = await supabase.auth.getUser();

        // if (!user) {
        //     return NextResponse.json(
        //         { error: "Unauthorized" },
        //         { status: 401 }
        //     );
        // }

        const body = await req.json();
        const { action, skill, difficulty, userId = "test-user-123" } = body;

        const assessor = new SkillAssessor();

        switch (action) {
            case 'start':
                const session = assessor.startAssessment(userId, skill, difficulty);
                return NextResponse.json({
                    success: true,
                    data: {
                        session,
                        currentQuestion: session.questions[session.currentQuestionIndex],
                        progress: {
                            current: session.currentQuestionIndex + 1,
                            total: session.questions.length,
                        },
                    },
                });

            case 'submit-answer':
                const { sessionId, questionId, answer } = body;
                // In a real app, you'd retrieve the session from storage
                const mockSession = {
                    id: sessionId,
                    userId,
                    skill,
                    startTime: new Date(Date.now() - 300000), // 5 minutes ago
                    currentQuestionIndex: 0,
                    questions: assessor['getQuestionsForSkill'](skill, difficulty),
                    answers: new Map([[questionId, answer]]),
                    timeSpent: 300,
                    status: 'completed' as const,
                    endTime: new Date(),
                };
                
                const updatedSession = assessor.submitAnswer(mockSession, questionId, answer);
                return NextResponse.json({
                    success: true,
                    data: {
                        session: updatedSession,
                        nextQuestion: updatedSession.questions[updatedSession.currentQuestionIndex],
                        progress: {
                            current: updatedSession.currentQuestionIndex + 1,
                            total: updatedSession.questions.length,
                        },
                    },
                });

            case 'complete':
                const { sessionId: completeSessionId } = body;
                // Mock completed session
                const completedSession = {
                    id: completeSessionId,
                    userId,
                    skill,
                    startTime: new Date(Date.now() - 600000), // 10 minutes ago
                    endTime: new Date(),
                    currentQuestionIndex: 5,
                    questions: assessor['getQuestionsForSkill'](skill, difficulty),
                    answers: new Map([
                        ['js-1', 'let and const are block-scoped, var is function-scoped'],
                        ['js-2', 'object'],
                    ]),
                    timeSpent: 600,
                    status: 'completed' as const,
                };
                
                const result = assessor.completeAssessment(completedSession);
                return NextResponse.json({
                    success: true,
                    data: {
                        result,
                        recommendations: assessor.getRecommendedSkills([skill], []),
                    },
                });

            case 'assess-portfolio':
                const { evidence } = body;
                const portfolioAssessment = assessor.assessSkillFromPortfolio(skill, evidence);
                return NextResponse.json({
                    success: true,
                    data: {
                        assessment: portfolioAssessment,
                    },
                });

            default:
                return NextResponse.json(
                    { error: "Invalid action" },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error("Error in skill assessment:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
});

export const GET = withAuditLogging(async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);
        const skill = searchParams.get("skill");
        const type = searchParams.get("type") || "recommendations";

        const assessor = new SkillAssessor();

        if (type === "recommendations") {
            const currentSkills = skill ? [skill] : [];
            const recommendations = assessor.getRecommendedSkills(currentSkills, []);
            
            return NextResponse.json({
                success: true,
                data: {
                    recommendations,
                },
            });
        }

        if (type === "questions" && skill) {
            const questions = assessor['getQuestionsForSkill'](skill);
            
            return NextResponse.json({
                success: true,
                data: {
                    skill,
                    questions: questions.map(q => ({
                        id: q.id,
                        question: q.question,
                        type: q.type,
                        options: q.options,
                        difficulty: q.difficulty,
                        category: q.category,
                    })),
                },
            });
        }

        return NextResponse.json(
            { error: "Invalid request" },
            { status: 400 }
        );
    } catch (error) {
        console.error("Error fetching assessment data:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
});
