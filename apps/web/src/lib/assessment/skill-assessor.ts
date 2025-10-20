import { SkillAssessment } from "@/lib/profile/profile-manager";

export interface AssessmentQuestion {
    id: string;
    skill: string;
    question: string;
    type: 'multiple-choice' | 'rating' | 'text' | 'scenario';
    options?: string[];
    correctAnswer?: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    category: 'technical' | 'soft' | 'domain-specific';
    timeLimit?: number; // in seconds
}

export interface AssessmentResult {
    skill: string;
    score: number; // 0-100
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    confidence: number; // 0-100
    timeSpent: number; // in seconds
    questionsAnswered: number;
    totalQuestions: number;
    correctAnswers: number;
    detailedResults: {
        questionId: string;
        userAnswer: string;
        correctAnswer: string;
        isCorrect: boolean;
        timeSpent: number;
    }[];
    recommendations: string[];
    nextSteps: string[];
}

export interface AssessmentSession {
    id: string;
    userId: string;
    skill: string;
    startTime: Date;
    endTime?: Date;
    currentQuestionIndex: number;
    questions: AssessmentQuestion[];
    answers: Map<string, string>;
    timeSpent: number;
    status: 'in-progress' | 'completed' | 'abandoned';
}

export class SkillAssessor {
    private questionsDatabase: Map<string, AssessmentQuestion[]>;

    constructor() {
        this.questionsDatabase = new Map();
        this.initializeQuestionsDatabase();
    }

    /**
     * Start a new assessment session
     */
    startAssessment(userId: string, skill: string, difficulty?: string): AssessmentSession {
        const questions = this.getQuestionsForSkill(skill, difficulty);
        
        return {
            id: `assessment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            userId,
            skill,
            startTime: new Date(),
            currentQuestionIndex: 0,
            questions,
            answers: new Map(),
            timeSpent: 0,
            status: 'in-progress',
        };
    }

    /**
     * Submit an answer for a question
     */
    submitAnswer(session: AssessmentSession, questionId: string, answer: string): AssessmentSession {
        session.answers.set(questionId, answer);
        session.currentQuestionIndex++;
        
        if (session.currentQuestionIndex >= session.questions.length) {
            session.status = 'completed';
            session.endTime = new Date();
        }

        return session;
    }

    /**
     * Complete assessment and calculate results
     */
    completeAssessment(session: AssessmentSession): AssessmentResult {
        if (session.status !== 'completed') {
            throw new Error('Assessment session is not completed');
        }

        const totalQuestions = session.questions.length;
        let correctAnswers = 0;
        const detailedResults = [];

        for (const question of session.questions) {
            const userAnswer = session.answers.get(question.id) || '';
            const isCorrect = this.evaluateAnswer(question, userAnswer);
            
            if (isCorrect) {
                correctAnswers++;
            }

            detailedResults.push({
                questionId: question.id,
                userAnswer,
                correctAnswer: question.correctAnswer || '',
                isCorrect,
                timeSpent: 0, // Would need to track per question
            });
        }

        const score = Math.round((correctAnswers / totalQuestions) * 100);
        const level = this.determineSkillLevel(score, session.skill);
        const confidence = this.calculateConfidence(score, totalQuestions, correctAnswers);
        const timeSpent = session.endTime ? 
            Math.round((session.endTime.getTime() - session.startTime.getTime()) / 1000) : 0;

        return {
            skill: session.skill,
            score,
            level,
            confidence,
            timeSpent,
            questionsAnswered: totalQuestions,
            totalQuestions,
            correctAnswers,
            detailedResults,
            recommendations: this.generateRecommendations(score, level, session.skill),
            nextSteps: this.generateNextSteps(score, level, session.skill),
        };
    }

    /**
     * Get skill assessment based on portfolio and experience
     */
    assessSkillFromPortfolio(skill: string, evidence: {
        projects: any[];
        experience: any[];
        certifications: any[];
        githubActivity?: any;
    }): SkillAssessment {
        let confidence = 0;
        let level: 'beginner' | 'intermediate' | 'advanced' | 'expert' = 'beginner';
        const evidenceList: string[] = [];

        // Analyze projects
        evidence.projects.forEach(project => {
            if (project.technologies?.includes(skill)) {
                confidence += 20;
                evidenceList.push(`Project: ${project.name}`);
                
                // Determine level based on project complexity
                if (project.complexity === 'high' || project.technologies.length > 5) {
                    level = 'advanced';
                } else if (project.complexity === 'medium' || project.technologies.length > 3) {
                    level = 'intermediate';
                }
            }
        });

        // Analyze experience
        evidence.experience.forEach(exp => {
            if (exp.skills?.includes(skill)) {
                const duration = this.calculateExperienceDuration(exp.startDate, exp.endDate);
                confidence += duration * 10;
                evidenceList.push(`${exp.title} at ${exp.company} (${duration} years)`);
                
                // Adjust level based on experience duration
                if (duration >= 3) {
                    level = 'advanced';
                } else if (duration >= 1) {
                    level = 'intermediate';
                }
            }
        });

        // Analyze certifications
        evidence.certifications.forEach(cert => {
            if (cert.skills?.includes(skill)) {
                confidence += 15;
                evidenceList.push(`Certification: ${cert.name}`);
                
                if (cert.level === 'expert' || cert.level === 'advanced') {
                    level = 'advanced';
                }
            }
        });

        // Analyze GitHub activity (if available)
        if (evidence.githubActivity) {
            const skillRepos = evidence.githubActivity.repositories?.filter((repo: any) => 
                repo.languages?.includes(skill) || repo.topics?.includes(skill)
            ) || [];
            
            if (skillRepos.length > 0) {
                confidence += Math.min(20, skillRepos.length * 5);
                evidenceList.push(`${skillRepos.length} GitHub repositories using ${skill}`);
            }
        }

        // Cap confidence at 100
        confidence = Math.min(100, confidence);

        return {
            skill,
            level,
            confidence,
            evidence: evidenceList,
            verified: evidenceList.length > 0,
            lastAssessed: new Date(),
        };
    }

    /**
     * Get recommended skills to learn based on current profile
     */
    getRecommendedSkills(currentSkills: string[], careerGoals: string[]): {
        skill: string;
        priority: 'high' | 'medium' | 'low';
        reason: string;
        learningPath: string[];
        estimatedTime: string;
    }[] {
        const skillRecommendations = [
            {
                skill: 'TypeScript',
                priority: 'high' as const,
                reason: 'High demand in modern web development',
                learningPath: ['JavaScript basics', 'TypeScript fundamentals', 'Advanced TypeScript patterns'],
                estimatedTime: '2-3 months',
                prerequisites: ['JavaScript'],
            },
            {
                skill: 'AWS',
                priority: 'high' as const,
                reason: 'Most popular cloud platform',
                learningPath: ['Cloud fundamentals', 'AWS basics', 'Specific AWS services'],
                estimatedTime: '3-4 months',
                prerequisites: ['Basic programming'],
            },
            {
                skill: 'Docker',
                priority: 'medium' as const,
                reason: 'Essential for modern deployment',
                learningPath: ['Containerization basics', 'Docker fundamentals', 'Docker Compose'],
                estimatedTime: '1-2 months',
                prerequisites: ['Basic command line'],
            },
            {
                skill: 'Machine Learning',
                priority: 'medium' as const,
                reason: 'Growing field with high demand',
                learningPath: ['Python', 'Statistics', 'ML algorithms', 'Deep learning'],
                estimatedTime: '6-12 months',
                prerequisites: ['Python', 'Mathematics'],
            },
        ];

        return skillRecommendations
            .filter(rec => !currentSkills.includes(rec.skill))
            .map(rec => ({
                skill: rec.skill,
                priority: rec.priority,
                reason: rec.reason,
                learningPath: rec.learningPath,
                estimatedTime: rec.estimatedTime,
            }));
    }

    // Private helper methods
    private initializeQuestionsDatabase(): void {
        // JavaScript/TypeScript questions
        this.questionsDatabase.set('JavaScript', [
            {
                id: 'js-1',
                skill: 'JavaScript',
                question: 'What is the difference between let, const, and var?',
                type: 'multiple-choice',
                options: [
                    'let and const are block-scoped, var is function-scoped',
                    'All three are function-scoped',
                    'let is function-scoped, const and var are block-scoped',
                    'There is no difference'
                ],
                correctAnswer: 'let and const are block-scoped, var is function-scoped',
                difficulty: 'intermediate',
                category: 'technical',
            },
            {
                id: 'js-2',
                skill: 'JavaScript',
                question: 'What will this code output: console.log(typeof null)?',
                type: 'multiple-choice',
                options: ['null', 'undefined', 'object', 'string'],
                correctAnswer: 'object',
                difficulty: 'intermediate',
                category: 'technical',
            },
        ]);

        // React questions
        this.questionsDatabase.set('React', [
            {
                id: 'react-1',
                skill: 'React',
                question: 'What is the purpose of the useEffect hook?',
                type: 'multiple-choice',
                options: [
                    'To manage component state',
                    'To perform side effects in functional components',
                    'To create custom hooks',
                    'To handle form submissions'
                ],
                correctAnswer: 'To perform side effects in functional components',
                difficulty: 'intermediate',
                category: 'technical',
            },
        ]);

        // Python questions
        this.questionsDatabase.set('Python', [
            {
                id: 'python-1',
                skill: 'Python',
                question: 'What is the difference between a list and a tuple?',
                type: 'multiple-choice',
                options: [
                    'Lists are mutable, tuples are immutable',
                    'Tuples are mutable, lists are immutable',
                    'There is no difference',
                    'Lists can only contain numbers'
                ],
                correctAnswer: 'Lists are mutable, tuples are immutable',
                difficulty: 'beginner',
                category: 'technical',
            },
        ]);
    }

    private getQuestionsForSkill(skill: string, difficulty?: string): AssessmentQuestion[] {
        const allQuestions = this.questionsDatabase.get(skill) || [];
        
        if (difficulty) {
            return allQuestions.filter(q => q.difficulty === difficulty);
        }
        
        // Return a mix of difficulties
        const beginner = allQuestions.filter(q => q.difficulty === 'beginner').slice(0, 2);
        const intermediate = allQuestions.filter(q => q.difficulty === 'intermediate').slice(0, 3);
        const advanced = allQuestions.filter(q => q.difficulty === 'advanced').slice(0, 2);
        
        return [...beginner, ...intermediate, ...advanced];
    }

    private evaluateAnswer(question: AssessmentQuestion, userAnswer: string): boolean {
        if (!question.correctAnswer) {
            return false;
        }
        
        return userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
    }

    private determineSkillLevel(score: number, skill: string): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
        if (score >= 90) return 'expert';
        if (score >= 75) return 'advanced';
        if (score >= 50) return 'intermediate';
        return 'beginner';
    }

    private calculateConfidence(score: number, totalQuestions: number, correctAnswers: number): number {
        // Base confidence on score and number of questions
        const baseConfidence = score;
        const questionBonus = Math.min(20, totalQuestions * 2);
        const accuracyBonus = correctAnswers > 0 ? 10 : 0;
        
        return Math.min(100, baseConfidence + questionBonus + accuracyBonus);
    }

    private generateRecommendations(score: number, level: string, skill: string): string[] {
        const recommendations: string[] = [];
        
        if (score < 50) {
            recommendations.push(`Focus on learning ${skill} fundamentals`);
            recommendations.push('Practice with beginner-level projects');
            recommendations.push('Consider taking an online course');
        } else if (score < 75) {
            recommendations.push(`Build intermediate-level projects with ${skill}`);
            recommendations.push('Read advanced documentation and tutorials');
            recommendations.push('Join communities and forums for this technology');
        } else if (score < 90) {
            recommendations.push(`Work on complex projects using ${skill}`);
            recommendations.push('Contribute to open-source projects');
            recommendations.push('Consider teaching others to solidify knowledge');
        } else {
            recommendations.push(`You have expert-level knowledge of ${skill}`);
            recommendations.push('Consider mentoring others');
            recommendations.push('Explore advanced and cutting-edge features');
        }
        
        return recommendations;
    }

    private generateNextSteps(score: number, level: string, skill: string): string[] {
        const nextSteps: string[] = [];
        
        if (level === 'beginner') {
            nextSteps.push('Complete beginner tutorials and exercises');
            nextSteps.push('Build a simple project using this skill');
            nextSteps.push('Join beginner-friendly communities');
        } else if (level === 'intermediate') {
            nextSteps.push('Work on more complex projects');
            nextSteps.push('Learn related technologies and frameworks');
            nextSteps.push('Start contributing to open-source projects');
        } else if (level === 'advanced') {
            nextSteps.push('Mentor others learning this skill');
            nextSteps.push('Explore advanced patterns and best practices');
            nextSteps.push('Consider specialization in specific areas');
        } else {
            nextSteps.push('Share knowledge through writing or speaking');
            nextSteps.push('Lead technical initiatives');
            nextSteps.push('Explore emerging trends in this field');
        }
        
        return nextSteps;
    }

    private calculateExperienceDuration(startDate: string | Date, endDate?: string | Date): number {
        const start = new Date(startDate);
        const end = endDate ? new Date(endDate) : new Date();
        const diffTime = Math.abs(end.getTime() - start.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365.25));
    }
}
