// __tests__/getPokemons.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getPokemons } from "../../actions/pokemons.action";
import type { Pokemon } from "../../types/pokemon";

// ✅ Proper fetch mock
beforeEach(() => {
  global.fetch = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
});

function mockFetchResponse<T>(data: T): Response {
  return {
    ok: true,
    json: async () => data,
  } as Response;
}

describe("getPokemons server action", () => {
  it("should fetch a list of Pokémon with details", async () => {
    const fetchMock = fetch as vi.MockedFunction<typeof fetch>;

    // List fetch
    fetchMock
      .mockResolvedValueOnce(
        mockFetchResponse({
          results: [
            { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1" },
            { name: "charmander", url: "https://pokeapi.co/api/v2/pokemon/4" },
          ],
        }),
      )
      // Bulbasaur detail
      .mockResolvedValueOnce(
        mockFetchResponse({
          sprites: {
            other: {
              "official-artwork": { front_default: "bulba.png" },
            },
            front_default: "bulba_fallback.png",
          },
          types: [{ type: { name: "grass" } }],
          stats: [45, 49, 49, 65, 65, 45].map((v) => ({
            base_stat: v,
          })),
        }),
      )
      // Charmander detail
      .mockResolvedValueOnce(
        mockFetchResponse({
          sprites: {
            other: {
              "official-artwork": { front_default: "char.png" },
            },
            front_default: "char_fallback.png",
          },
          types: [{ type: { name: "fire" } }],
          stats: [39, 52, 43, 60, 50, 65].map((v) => ({
            base_stat: v,
          })),
        }),
      );

    const pokemons: Pokemon[] = await getPokemons();

    expect(pokemons).toHaveLength(2);

    expect(pokemons[0]).toMatchObject({
      name: "Bulbasaur",
      image: "bulba.png",
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

    expect(pokemons[1]).toMatchObject({
      name: "Charmander",
      image: "char.png",
      types: ["fire"],
      stats: {
        hp: 39,
        attack: 52,
        defense: 43,
        spAtk: 60,
        spDef: 50,
        speed: 65,
      },
    });
  });

  it("should skip Pokémon if detail fetch fails", async () => {
    const fetchMock = fetch as vi.MockedFunction<typeof fetch>;

    fetchMock
      // Initial list fetch
      .mockResolvedValueOnce(
        mockFetchResponse({
          results: [
            { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1" },
          ],
        }),
      )
      // Detail fetch fails
      .mockRejectedValueOnce(new Error("Detail fetch failed"));

    const pokemons: Pokemon[] = await getPokemons();

    expect(pokemons).toEqual([]);
  });

  it("should throw if initial fetch fails", async () => {
    const fetchMock = fetch as vi.MockedFunction<typeof fetch>;

    fetchMock.mockResolvedValueOnce({
      ok: false,
    } as Response);

    await expect(getPokemons()).rejects.toThrow(
      "Failed to load Pokémon data",
    );
  });
});

