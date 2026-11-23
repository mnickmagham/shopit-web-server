import { rateLimit } from "../rateLimit";

describe("rateLimit", () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(1_000_000_000_000);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("allows requests up to max within the window", () => {
    const results = Array.from({ length: 5 }, () =>
      rateLimit("k", { max: 5, windowMs: 60_000 })
    );
    expect(results.every((r) => r.allowed)).toBe(true);
    expect(results[4].remaining).toBe(0);
  });

  it("rejects requests beyond max", () => {
    Array.from({ length: 5 }, () => rateLimit("k", { max: 5, windowMs: 60_000 }));
    const over = rateLimit("k", { max: 5, windowMs: 60_000 });
    expect(over.allowed).toBe(false);
    expect(over.remaining).toBe(0);
  });

  it("resets after the window elapses", () => {
    Array.from({ length: 5 }, () => rateLimit("k", { max: 5, windowMs: 60_000 }));
    jest.advanceTimersByTime(60_001);
    const fresh = rateLimit("k", { max: 5, windowMs: 60_000 });
    expect(fresh.allowed).toBe(true);
    expect(fresh.remaining).toBe(4);
  });

  it("tracks keys independently", () => {
    rateLimit("a", { max: 1, windowMs: 60_000 });
    const b = rateLimit("b", { max: 1, windowMs: 60_000 });
    expect(b.allowed).toBe(true);
  });
});
