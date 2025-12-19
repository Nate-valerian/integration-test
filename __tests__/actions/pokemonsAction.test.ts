import { getPokemons } from "../../actions/pokemons.action";
import type { Pokemon } from "../../types/pokemon";
import { describe, expect, it, afterEach, vi } from "vitest";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch as unknown as typeof fetch;

function createMockResponse(data: any, ok = true): Response {
  return {
    ok,
    json: async () => data,
  } as Response;
}

describe("getPokemons server action", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch a list of Pokémon with details", async () => {
    mockFetch
      // Pokémon list
      .mockResolvedValueOnce(
        createMockResponse({
          results: [
            { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
            { name: "charmander", url: "https://pokeapi.co/api/v2/pokemon/4/" },
          ],
        }),
      )
      // Bulbasaur details
      .mockResolvedValueOnce(
        createMockResponse({
          sprites: {
            other: {
              "official-artwork": {
                front_default: "https://example.com/bulbasaur.png",
              },
            },
            front_default: "fallback.png",
          },
          types: [{ type: { name: "grass" } }],
          stats: [
            { base_stat: 45 },
            { base_stat: 49 },
            { base_stat: 49 },
            { base_stat: 65 },
            { base_stat: 65 },
            { base_stat: 45 },
          ],
        }),
      )
      // Charmander details
      .mockResolvedValueOnce(
        createMockResponse({
          sprites: {
            other: {
              "official-artwork": {
                front_default: "https://example.com/charmander.png",
              },
            },
            front_default: "fallback.png",
          },
          types: [{ type: { name: "fire" } }],
          stats: [
            { base_stat: 39 },
            { base_stat: 52 },
            { base_stat: 43 },
            { base_stat: 60 },
            { base_stat: 50 },
            { base_stat: 65 },
          ],
        }),
      );

    const pokemons: Pokemon[] = await getPokemons();

    expect(pokemons).toHaveLength(2);

    expect(pokemons[0]).toMatchObject({
      name: "Bulbasaur",
      types: ["grass"],
      stats: {
        hp: 45,
        attack: 49,
        defense: 49,
        spAtk: 65,
        spDef: 65,
        speed: 45,
      },
    });

    expect(pokemons[1].name).toBe("Charmander");
  });

  it("should skip Pokémon if detail fetch fails", async () => {
    mockFetch
      // Pokémon list
      .mockResolvedValueOnce(
        createMockResponse({
          results: [
            { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
          ],
        }),
      )
      // Detail fetch fails
      .mockRejectedValueOnce(new Error("Detail fetch failed"));

    const pokemons = await getPokemons();

    expect(pokemons).toHaveLength(0);
  });

  it("should throw if initial fetch fails", async () => {
    mockFetch.mockResolvedValueOnce(createMockResponse({}, false));

    await expect(getPokemons()).rejects.toThrow(
      "Failed to load Pokémon data",
    );
  });
});

