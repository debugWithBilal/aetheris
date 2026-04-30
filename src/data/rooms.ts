export interface Room {
  id: string
  title: string
  client: string
  img: string
  tagline: string
  description: string[]
  features: string[]
  price: string
  priceNote: string
  sqm: string
  occupancy: string
  bed: string
}

export const rooms: Room[] = [
  {
    id: '01',
    title: 'Aether Suite',
    client: 'Cliff House',
    img: '/images/room-01.jpg',
    tagline: 'A sanctuary where the horizon becomes your private canvas.',
    description: [
      'Perched at the edge of the world, the Aether Suite is designed around a singular, breathtaking gesture: a seven-metre wall of glass that vanishes entirely at the touch of a button. The boundary between inside and outside dissolves. The sea becomes your living room.',
      'Every surface has been considered — hand-plastered walls in warm ivory, reclaimed oak floors, drapery woven from organic linen. The bathroom features a monolithic travertine soaking tub positioned to capture the northern light, while a curated selection of artisanal botanicals awaits.',
    ],
    features: [
      'Retractable floor-to-ceiling glass facade',
      'Private cliff-edge terrace, 18m²',
      'Monolithic travertine soaking tub',
      'King bed with hand-woven linen',
      'Artisanal apothecary & rare tea collection',
      'Twice-daily housekeeping with evening turndown',
    ],
    price: '$890',
    priceNote: 'per night, inclusive',
    sqm: '62m²',
    occupancy: '2 guests',
    bed: 'King bed',
  },
  {
    id: '02',
    title: 'Olive Villa',
    client: 'Garden Estate',
    img: '/images/room-02.jpg',
    tagline: 'A two-bedroom sanctuary among ancient olive trees.',
    description: [
      'Hidden behind a centuries-old stone wall mere steps from the shore, the Olive Villa offers the most private address at Aetheris. A winding path leads through a fragrant garden of olive, fig, and lavender to a covered terrace, heated plunge pool, and sunken fire lounge.',
      'Inside, two king bedrooms flank an expansive open-plan living space anchored by a sculptural fireplace. The kitchen is fully appointed for private dining, and a dedicated residence keeper prepares sunrise breakfast on the terrace each morning.',
    ],
    features: [
      'Two king bedrooms, two en-suite bathrooms',
      'Heated 12m plunge pool with garden views',
      'Covered terrace with al fresco dining for 8',
      'Dedicated residence keeper (6am – midnight)',
      'Sculptural fireplace & private wine selection',
      'Direct beach path, 60 seconds on foot',
    ],
    price: '$2,800',
    priceNote: 'per night, minimum two nights',
    sqm: '195m²',
    occupancy: '4 guests',
    bed: '2 king beds',
  },
  {
    id: '03',
    title: 'Sky Loft',
    client: 'Horizon Wing',
    img: '/images/room-03.jpg',
    tagline: 'A cathedral of light at the summit of the cliff.',
    description: [
      'Occupying the entire upper level of the Horizon Wing, the Sky Loft is built on one principle: unobstructed communion with the sky. The ceiling soars to six metres; the southern wall is nothing but glass, from polished floor to exposed beam.',
      'A floating mezzanine library, curated with rare volumes on art and travel, overlooks the main salon. The bedroom suite sits on the lower level, opening to a secret garden courtyard where morning coffee becomes a ritual.',
    ],
    features: [
      'Double-height living space, 6m ceilings',
      'Floating mezzanine library with rare volumes',
      'Uninterrupted 200° ocean panorama',
      'Garden-level bedroom with courtyard access',
      'Rainfall shower & Japanese soaking tub',
      'Bespoke sound system & vinyl collection',
    ],
    price: '$1,150',
    priceNote: 'per night, breakfast included',
    sqm: '78m²',
    occupancy: '2 guests',
    bed: 'King bed',
  },
  {
    id: '04',
    title: 'Sand Studio',
    client: 'Dune Pavilion',
    img: '/images/room-04.jpg',
    tagline: 'An intimate studio where sand meets sleep.',
    description: [
      'The Dune Pavilion is a collection of seven low-profile studios set parallel to the shoreline. Each is a masterclass in restraint — a perfectly made bed, a writing desk for morning thoughts, a soft chair positioned to catch the best light.',
      'A broad sliding door opens directly onto a private timber deck with uninterrupted sand access. No corridors, no elevators, no footsteps overhead. Just you, the deck, and a short wooden stairway that leads directly to the water\'s edge.',
    ],
    features: [
      'Direct sand access, no barriers to the beach',
      'Private timber deck with sun lounger',
      'Open-plan studio, 42m² of calm',
      'Queen bed with organic natural linen',
      'Enclosed outdoor shower garden',
      'Morning coffee ritual on the deck',
    ],
    price: '$620',
    priceNote: 'per night, double occupancy',
    sqm: '42m²',
    occupancy: '2 guests',
    bed: 'Queen bed',
  },
  {
    id: '05',
    title: 'Stone Sanctuary',
    client: 'Cove Residence',
    img: '/images/room-05.jpg',
    tagline: 'A suite carved into the cliff, with the sky as your ceiling.',
    description: [
      'The Stone Sanctuary occupies the northernmost edge of the property, where the land descends forty metres to the sea. The suite is partially hewn from the living rock — one wall is native basalt, cool and ancient to the touch.',
      'The private terrace holds a hand-hammered copper soaking tub positioned to capture the sunset. As evening falls, the staff arrange hurricane lanterns along the stone ledge. Private dining can be served here, under a canopy of stars.',
    ],
    features: [
      'Hand-hammered copper tub on private terrace',
      'Exposed basalt feature wall, millions of years old',
      'West-facing terrace for sunset ceremonies',
      'King bed with flowing canopy drapery',
      'Private cliffside dining by lantern light',
      'Evening ritual with essential oil turndown',
    ],
    price: '$1,450',
    priceNote: 'per night, seasonal',
    sqm: '92m²',
    occupancy: '2 guests',
    bed: 'King bed',
  },
  {
    id: '06',
    title: 'Aegean Estate',
    client: 'Headland Reserve',
    img: '/images/room-06.jpg',
    tagline: 'A three-bedroom estate with an infinity pool that touches the horizon.',
    description: [
      'The Aegean Estate is the crown jewel of Aetheris, commanding the entire western headland. Three bedroom suites wrap around a central courtyard planted with ancient olive trees and cascading bougainvillea in shades of coral and magenta.',
      'The signature is a 25-metre infinity pool that runs the length of the cliff edge, its vanishing edge dissolving into the open sea. A private chef is available throughout your stay; a half-day arrival spa ritual is included, featuring treatments drawn from the sea itself.',
    ],
    features: [
      '25m infinity pool along the cliff edge',
      'Three king suites, three full bathrooms',
      'Private chef & dedicated estate manager',
      'Half-day arrival sea spa ritual included',
      'Courtyard with ancient olive trees',
      'Private airport transfer in estate vehicle',
    ],
    price: '$3,800',
    priceNote: 'per night, minimum three nights',
    sqm: '350m²',
    occupancy: '6 guests',
    bed: '3 king beds',
  },
]
