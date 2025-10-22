export type Breakdown = {
    skills: number;
    experience: number;
    education: number;
    location: number;
    salary: number;
    culture: number;
    reliability?: number;
};

const baseWeights = {
    skills: 0.3,
    experience: 0.25,
    education: 0.15,
    location: 0.1,
    salary: 0.1,
    culture: 0.1,
    reliability: 0.1,
} as const;

export function fitScore(b: Breakdown) {
    const keys = Object.keys(b) as (keyof Breakdown)[];
    const norm = keys.reduce(
        (s, k) => s + (baseWeights[k as keyof typeof baseWeights] ?? 0),
        0,
    );
    const score = keys.reduce(
        (s, k) =>
            s +
            (b[k] ?? 0) *
                ((baseWeights[k as keyof typeof baseWeights] ?? 0) / norm),
        0,
    );
    return Math.round(score);
}

export function calibrated(
    score: number,
    model?: { a: number; b: number } | null,
) {
    if (!model) return score / 100;
    return 1 / (1 + Math.exp(-(model.a * score + model.b)));
}

export function explain(b: Breakdown): string[] {
    const out: string[] = [];
    if (b.skills >= 80) out.push("Strong skills alignment");
    if (b.experience >= 80) out.push("Experience closely matches role level");
    if (b.salary < 50) out.push("Compensation may be below your target");
    if ((b.reliability ?? 50) >= 70) {
        out.push("Reliability record boosts ranking");
    }
    if (b.location < 50) out.push("Commute/location may be a mismatch");
    return out;
}
