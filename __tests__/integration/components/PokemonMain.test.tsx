import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PokemonMain from "../../../components/Pokemon/PokemonMain";
import type { Pokemon } from "../../../types/pokemon";
import { describe, it, expect } from "vitest";

const mockPokemons: Pokemon[] = [
  {
    id: 1,
    name: "Bulbasaur",
    image: "https://example.com/bulbasaur.png",
    types: ["grass", "poison"],
    stats: {
      hp: 45,
      attack: 49,
      defense: 49,
      spAtk: 65,
      spDef: 65,
      speed: 45,
    },
  },
  {
    id: 2,
    name: "Ivysaur",
    image: "https://example.com/ivysaur.png",
    types: ["grass", "poison"],
    stats: {
      hp: 60,
      attack: 62,
      defense: 63,
      spAtk: 80,
      spDef: 80,
      speed: 60,
    },
  },
  {
    id: 4,
    name: "Charmander",
    image: "https://example.com/charmander.png",
    types: ["fire"],
    stats: {
      hp: 39,
      attack: 52,
      defense: 43,
      spAtk: 60,
      spDef: 50,
      speed: 65,
    },
  },
];

describe("PokemonMain Component", () => {
  it("should render Pokemon grid with all Pokemon", () => {
    render(<PokemonMain initialPokemons={mockPokemons} />);

    expect(screen.getByText("Bulbasaur")).toBeInTheDocument();
    expect(screen.getByText("Ivysaur")).toBeInTheDocument();
    expect(screen.getByText("Charmander")).toBeInTheDocument();
  });

  it("should display Battle Arena section with placeholder cards", () => {
    render(<PokemonMain initialPokemons={mockPokemons} />);

    expect(screen.getByText("Battle Arena")).toBeInTheDocument();
    expect(screen.getByText("Select First Pokémon")).toBeInTheDocument();
    expect(screen.getByText("Select Second Pokémon")).toBeInTheDocument();
  });

  it("should select first Pokemon when clicking a card", async () => {
    const user = userEvent.setup();
    render(<PokemonMain initialPokemons={mockPokemons} />);

    const bulbasaurCard = screen.getAllByText("Bulbasaur")[0].closest("div")!;
    await user.click(bulbasaurCard);

    await waitFor(() => {
      expect(
        screen.queryByText("Select First Pokémon")
      ).not.toBeInTheDocument();
    });
  });

  it("should select second Pokemon when clicking another card", async () => {
    const user = userEvent.setup();
    render(<PokemonMain initialPokemons={mockPokemons} />);

    const bulbasaurCard = screen.getAllByText("Bulbasaur")[0].closest("div")!;
    const ivysaurCard = screen.getAllByText("Ivysaur")[0].closest("div")!;

    await user.click(bulbasaurCard);
    await user.click(ivysaurCard);

    await waitFor(() => {
      expect(
        screen.queryByText("Select Second Pokémon")
      ).not.toBeInTheDocument();
    });
  });

  it("should deselect Pokemon when clicking the same card again", async () => {
    const user = userEvent.setup();
    render(<PokemonMain initialPokemons={mockPokemons} />);

    const bulbasaurCard = screen.getAllByText("Bulbasaur")[0].closest("div")!;
    await user.click(bulbasaurCard);

    await user.click(bulbasaurCard);

    await waitFor(() => {
      expect(screen.getByText("Select First Pokémon")).toBeInTheDocument();
    });
  });

  it("should replace second Pokemon when both slots are full and new card is clicked", async () => {
    const user = userEvent.setup();
    render(<PokemonMain initialPokemons={mockPokemons} />);

    const bulbasaurCard = screen.getAllByText("Bulbasaur")[0].closest("div")!;
    const ivysaurCard = screen.getAllByText("Ivysaur")[0].closest("div")!;
    const charmanderCard = screen.getAllByText("Charmander")[0].closest("div")!;

    await user.click(bulbasaurCard);
    await user.click(ivysaurCard);
    await user.click(charmanderCard);

    await waitFor(() => {
      expect(screen.getAllByText("Bulbasaur").length).toBeGreaterThan(1);
      expect(screen.getAllByText("Charmander").length).toBeGreaterThan(1);
      expect(screen.queryAllByText("Ivysaur").length).toBe(1);
    });
  });

  it("should clear slot when clicking the X button", async () => {
    const user = userEvent.setup();
    render(<PokemonMain initialPokemons={mockPokemons} />);

    const bulbasaurCard = screen.getAllByText("Bulbasaur")[0].closest("div")!;
    await user.click(bulbasaurCard);

    const clearButton = await screen.findByTitle("Deselect");
    await user.click(clearButton);

    await waitFor(() => {
      expect(screen.getByText("Select First Pokémon")).toBeInTheDocument();
    });
  });

  it("should show View Battle Analysis button only when both slots are filled", async () => {
    const user = userEvent.setup();
    render(<PokemonMain initialPokemons={mockPokemons} />);

    const viewButton = screen.getByRole("button", {
      name: /View Battle Analysis/i,
    });

    expect(viewButton).toBeDisabled();

    const bulbasaurCard = screen.getAllByText("Bulbasaur")[0].closest("div")!;
    const ivysaurCard = screen.getAllByText("Ivysaur")[0].closest("div")!;

    await user.click(bulbasaurCard);
    expect(viewButton).toBeDisabled();

    await user.click(ivysaurCard);
    expect(viewButton).not.toBeDisabled();
  });

  it("should filter Pokémon by type and maintain selection", async () => {
    const user = userEvent.setup();
    render(<PokemonMain initialPokemons={mockPokemons} />);

    // Select Bulbasaur
    const bulbasaurCard = screen.getAllByText("Bulbasaur")[0].closest("div")!;
    await user.click(bulbasaurCard);

    // Filter buttons (must be real <button>)
    const grassButton = await screen.findByRole("button", { name: /grass/i });
    const fireButton = await screen.findByRole("button", { name: /fire/i });

    // Grass filter
    await user.click(grassButton);
    const grid = screen.getByTestId("pokemon-grid");

    expect(screen.getAllByText("Bulbasaur").length).toBeGreaterThan(1);
    expect(grid.textContent).not.toContain("Charmander");

    // Fire filter
    await user.click(fireButton);

    expect(screen.getByText("Charmander")).toBeInTheDocument();
    expect(screen.getAllByText("Bulbasaur").length).toBeGreaterThan(1);
    expect(grid.textContent).not.toContain("Ivysaur");
  });
});

