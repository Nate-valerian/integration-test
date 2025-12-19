export const mockBulbasaurDetails = {
  id: 1,
  name: 'bulbasaur',
  sprites: {
    other: {
      'official-artwork': {
        front_default: 'https://example.com/bulbasaur.png',
      },
    },
    front_default: 'bulbasaur_fallback.png',
  },
  types: [
    { type: { name: 'grass' } },
    { type: { name: 'poison' } },
  ],
  stats: [
    { base_stat: 45, stat: { name: 'hp' } },
    { base_stat: 49, stat: { name: 'attack' } },
    { base_stat: 49, stat: { name: 'defense' } },
    { base_stat: 65, stat: { name: 'special-attack' } },
    { base_stat: 65, stat: { name: 'special-defense' } },
    { base_stat: 45, stat: { name: 'speed' } },
  ],
};

export const mockCharmanderDetails = {
  id: 4,
  name: 'charmander',
  sprites: {
    other: {
      'official-artwork': {
        front_default: 'https://example.com/charmander.png',
      },
    },
    front_default: 'charmander_fallback.png',
  },
  types: [{ type: { name: 'fire' } }],
  stats: [
    { base_stat: 39, stat: { name: 'hp' } },
    { base_stat: 52, stat: { name: 'attack' } },
    { base_stat: 43, stat: { name: 'defense' } },
    { base_stat: 60, stat: { name: 'special-attack' } },
    { base_stat: 50, stat: { name: 'special-defense' } },
    { base_stat: 65, stat: { name: 'speed' } },
  ],
};
