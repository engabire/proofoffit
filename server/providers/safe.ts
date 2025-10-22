export class SafeProvider<
    T extends { searchJobs: Function; getJob: Function },
> {
    private failures = 0;
    private windowStart = Date.now();
    private tokens: number;
    constructor(
        private inner: T,
        private opts: {
            qpsCap: number;
            circuitFailures: number;
            windowMs: number;
        },
    ) {
        this.tokens = this.opts.qpsCap;
    }
    private refill() {
        const now = Date.now();
        if (now - this.windowStart >= this.opts.windowMs) {
            this.windowStart = now;
            this.tokens = this.opts.qpsCap;
            this.failures = 0;
        }
    }
    private takeToken() {
        this.refill();
        if (this.tokens <= 0) throw new Error("QPS cap reached");
        this.tokens -= 1;
    }
    private allowed() {
        this.refill();
        return this.failures < this.opts.circuitFailures;
    }
    async searchJobs(...args: any[]) {
        if (!this.allowed()) throw new Error("Circuit open");
        this.takeToken();
        try {
            // @ts-ignore
            return await this.inner.searchJobs(...args);
        } catch (e) {
            this.failures++;
            throw e;
        }
    }
    async getJob(...args: any[]) {
        // @ts-ignore
        return this.inner.getJob(...args);
    }
}
