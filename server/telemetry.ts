export function redact<T extends Record<string, any>>(evt: T) {
    const clone = { ...evt } as any;
    if ("ip" in clone) clone.ip = "redacted";
    if ("query" in clone) delete clone.query; // avoid PII leakage
    return clone as T;
}

export function log(evt: Record<string, any>) {
    console.info(JSON.stringify(redact(evt)));
}

