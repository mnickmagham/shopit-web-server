import Wishlist from "../Wishlist";

describe("Wishlist schema", () => {
  it("enforces a unique index on userId", () => {
    const path = Wishlist.schema.paths["userId"];
    expect(path).toBeDefined();
    expect(path.options.unique).toBe(true);
  });
});
