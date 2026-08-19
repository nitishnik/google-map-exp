import type { Attraction, CityCatalog, Destination } from '../types'

export const DESTINATIONS: Destination[] = [
  {
    id: 'pl',
    name: 'Poland',
    lat: 52,
    lng: 19.4,
    cityId: 'krakow',
    picks: 9,
    opts: 180,
    fits: {
      family_traveler: [
        0,
        ['Strong family-compatible inventory', 'Shorter experience formats'],
        'Compact old towns you can walk in an hour, and an underground afternoon that works in any weather.',
        'Fewer English-language departures than western Europe — the 10:00 slots go first.',
      ],
      interest_deep_dive_traveler: [
        1,
        ['Twentieth-century depth', 'Historian-led formats'],
        'The history is recent enough that guides can name the buildings that were rebuilt.',
        'Heavier subject matter — we flag which tours are unsuitable for under-12s.',
      ],
      couple_traveler: [
        2,
        ['Compact old towns', 'Food-led evening walks'],
        'Kraków keeps the useful parts of a city break close enough to share without planning every transfer.',
        'The strongest inventory is history-led rather than private or premium.',
      ],
      comfort_easy_pace_traveler: [
        1,
        ['Compact walking routes', 'Indoor afternoon options'],
        'Short transfers and weather-proof highlights make it easy to build a day without rushing.',
        'Cobblestones remain common in the old town.',
      ],
      solo_social_traveler: [
        1,
        ['Small-group historian walks', 'Easy central meeting points'],
        'Compact routes and guided groups make Kraków straightforward to join and explore alone.',
        'Evening group departures are less frequent outside summer.',
      ],
      first_time_visitor: [
        2,
        ['Compact first-trip cities', 'Indoor weather backup'],
        'A first visit stays readable in a few days: one old town, one underground afternoon, short transfers.',
        'Fewer skip-the-line icons than Rome or Kyoto.',
      ],
    },
  },
  {
    id: 'it',
    name: 'Italy',
    lat: 42.8,
    lng: 12.6,
    cityId: 'rome',
    picks: 31,
    opts: 812,
    fits: {
      first_time_visitor: [
        0,
        ['Essential first-trip icons', 'Skip-the-line ticket classes'],
        'The difference between a great day and a two-hour queue is the ticket class. That is all we select on.',
        'August heat pushes every good format before 10:00.',
      ],
      interest_deep_dive_traveler: [
        0,
        ['Archaeologist-led access', 'Restricted-area entry'],
        'Underground and arena-floor access that most listings quietly omit.',
        'Longer duration — three hours minimum for the access to be worth it.',
      ],
      family_traveler: [
        1,
        ['Clear 3-hour format', 'Air-conditioned interiors'],
        'Short, early and indoors by noon — the only version of Rome that works with children.',
        'Fewer child discounts than northern Europe.',
      ],
      couple_traveler: [
        0,
        ['Private-upgrade options', 'Food-led evening formats'],
        'Iconic first visits and slower neighbourhood evenings combine naturally into a trip for two.',
        'The quietest experiences require early entry or a private upgrade.',
      ],
      comfort_easy_pace_traveler: [
        1,
        ['Timed entry', 'Private-transfer options'],
        'Reserved access removes the longest queues and keeps the essential sites inside a clear daily plan.',
        'Ancient sites still involve uneven ground and limited shade.',
      ],
      solo_social_traveler: [
        2,
        ['Frequent small-group departures', 'Central meeting points'],
        'High departure frequency makes it easy to join a well-structured group without arranging a companion.',
        'The busiest icons can feel crowded even on capped groups.',
      ],
      active_adventure_traveler: [
        2,
        ['Early walking days', 'Long outdoor circuits'],
        'Rome can be walked hard if you start before 10:00, but the inventory is still site-led rather than outdoors-led.',
        'August heat makes long outdoor days a poor default.',
      ],
    },
  },
  {
    id: 'jp',
    name: 'Japan',
    lat: 36.2,
    lng: 138.3,
    cityId: 'kyoto',
    picks: 24,
    opts: 610,
    fits: {
      first_time_visitor: [
        1,
        ['Guided-transit support', 'Essential first-trip icons'],
        'Language, etiquette and transit all work against you alone. A guide changes a first trip completely.',
        '13-hour flight and a time shift that costs the first day.',
      ],
      interest_deep_dive_traveler: [
        0,
        ['Living-ritual access', 'Expert-led formats'],
        'Working temples, not restored ruins — led by people who study the sites they walk you through.',
        'Early starts: the good slots are before the shrine gates fill.',
      ],
      couple_traveler: [
        2,
        ['Dusk shrine walks', 'Quiet garden routes'],
        'Temple gardens and dusk departures create slower shared days beyond the standard highlights loop.',
        'The most atmospheric slots start early or finish after dark.',
      ],
      comfort_easy_pace_traveler: [
        1,
        ['Guided-transit support', 'Reserved-entry planning'],
        'A guide removes the difficult transit and etiquette decisions while keeping each day deliberately paced.',
        'Some essential temple routes still include steps and long station walks.',
      ],
      solo_social_traveler: [
        1,
        ['Small-group temple walks', 'Guided-transit support'],
        'Structured groups make the etiquette and transport easier while leaving room to continue independently.',
        'Evening social formats are less common than daytime cultural tours.',
      ],
      family_traveler: [
        2,
        ['Short temple loops', 'Flat garden paths'],
        'A few Kyoto sites work in under an hour on flat ground; most of the strongest inventory is still early and quiet rather than child-paced.',
        'The best shrine slots are before breakfast.',
      ],
      active_adventure_traveler: [
        1,
        ['Hill walks', 'Sunrise grove routes'],
        'Kyoto has real movement once you leave the postcard loop — steps, river paths and an early grove walk.',
        'Active days still start before the first train crowd.',
      ],
    },
  },
  {
    id: 'pt',
    name: 'Portugal',
    lat: 39.6,
    lng: -8,
    cityId: 'lisbon',
    picks: 15,
    opts: 330,
    fits: {
      first_time_visitor: [
        2,
        ['Compact 4-day city', 'English widely spoken'],
        'Small enough to understand in four days without a guide holding your hand.',
        'Sintra only works as a morning; an afternoon start is a day in traffic.',
      ],
      family_traveler: [
        2,
        ['Trams, castles and beaches within an hour'],
        'Three completely different days inside one metro ride.',
        'Long queues at Sintra after 11:00.',
      ],
      couple_traveler: [
        1,
        ['Riverfront evenings', 'Food-led old-quarter walks'],
        'Lisbon pairs compact neighbourhood days with easy riverfront evenings and short escapes to Sintra.',
        'The steepest old-quarter routes are tiring in summer heat.',
      ],
      comfort_easy_pace_traveler: [
        2,
        ['Private-transfer options', 'Compact guided routes'],
        'Short guided routes and transfer upgrades can remove the hardest logistics from a hilly city.',
        'Historic trams and old-quarter streets are not reliably step-free.',
      ],
      solo_social_traveler: [
        0,
        ['Food-led small groups', 'English widely spoken'],
        'Frequent neighbourhood walks and shared food formats make Lisbon especially easy to join alone.',
        'Late-night social formats can overshadow the quieter cultural inventory.',
      ],
      interest_deep_dive_traveler: [
        2,
        ['Neighbourhood history walks', 'Palace-day formats'],
        'Lisbon rewards slower neighbourhood reading, but the expert-access inventory is thinner than Rome or Kyoto.',
        'Sintra only works as a morning; the history is easier to miss than to overdo.',
      ],
      active_adventure_traveler: [
        1,
        ['Steep old-quarter walks', 'Coastal day routes'],
        'Hills, riverfront miles and short coastal escapes make Lisbon naturally active without turning it into a trek catalogue.',
        'Cobbles and heat punish an unpaced afternoon.',
      ],
    },
  },
  {
    id: 'gr',
    name: 'Greece',
    lat: 38.6,
    lng: 23.8,
    cityId: 'santorini',
    picks: 18,
    opts: 430,
    fits: {
      first_time_visitor: [
        2,
        ['Sunset-timed departures'],
        'Every boat claims the best sunset. We kept the two that actually time departure to it.',
        'Two nights is our honest recommendation — five is a photograph, not a holiday.',
      ],
      couple_traveler: [
        0,
        ['Sunset-timed sailing', 'Small-group caldera routes'],
        'The strongest products are deliberately timed shared experiences rather than generic viewpoint stops.',
        'July crowds and prices reduce the sense of privacy.',
      ],
      comfort_easy_pace_traveler: [
        1,
        ['Hotel-pickup options', 'Boat-based sightseeing'],
        'Pickup-led sailing and short viewpoint visits reduce the need to negotiate the island by road.',
        'Clifftop villages still include stairs and uneven lanes.',
      ],
      solo_social_traveler: [
        2,
        ['Shared sunset sailings', 'Central pickup points'],
        'Shared boats provide a natural group format without requiring a full island itinerary.',
        'Solo supplements remain common on premium departures.',
      ],
      family_traveler: [
        2,
        ['Covered excavation option', 'Short boat hops'],
        'A few formats work with children if they stay short and shaded; the island’s strongest products are still adult-paced.',
        'Clifftop villages and boat days are a poor default with a stroller.',
      ],
      interest_deep_dive_traveler: [
        1,
        ['Archaeologist-led excavation', 'Pre-heat site entry'],
        'Akrotiri is the honest content stop: a roofed excavation with someone who worked the trench.',
        'Most of the island inventory is viewpoint-led rather than expert-led.',
      ],
      active_adventure_traveler: [
        2,
        ['Caldera walks', 'Small-boat sailing'],
        'There is movement on the water and along the caldera path, but the commercial centre of gravity is still a timed sunset.',
        'July swell and stairs make “active” days less reliable than they look.',
      ],
    },
  },
  {
    id: 'th',
    name: 'Thailand',
    lat: 14.5,
    lng: 101,
    cityId: 'bangkok',
    picks: 21,
    opts: 560,
    fits: {
      active_adventure_traveler: [
        0,
        ['Early-start formats', 'Boat-based access'],
        'Enormous supply, wildly uneven quality. Our filter does the work you would otherwise do at midnight.',
        '19 hours of flying, and everything good starts at 08:00.',
      ],
      family_traveler: [
        2,
        ['Shorter experience formats', 'Shade and transfer planning'],
        'Early starts, shade and short transfers — the three things that decide a family day in this heat.',
        'Long-haul flight with a 6-hour time shift.',
      ],
      couple_traveler: [
        2,
        ['Private boat upgrades', 'Food-led evenings'],
        'Boat routes and evening food formats offer a calmer shared alternative to Bangkok traffic.',
        'Heat and transfer time still shape every day.',
      ],
      comfort_easy_pace_traveler: [
        1,
        ['Hotel pickup', 'Private-guide availability'],
        'Pickup, private guides and boat-first routing remove the hardest traffic and planning decisions.',
        'Humidity and temple dress rules cannot be designed out.',
      ],
      solo_social_traveler: [
        1,
        ['Join-in food groups', 'Frequent shared departures'],
        'Bangkok has enough guided group inventory to be social without forcing a fixed multi-day itinerary.',
        'Meeting points can require long cross-city transfers.',
      ],
      first_time_visitor: [
        2,
        ['Essential palace morning', 'Boat-first orientation'],
        'The readable first visit is one early palace circuit and a boat morning — not a city you invent from 560 listings.',
        'Heat and traffic punish any itinerary that starts after 09:00.',
      ],
      interest_deep_dive_traveler: [
        2,
        ['Palace and temple circuits', 'Early expert-led entry'],
        'There is real ceremonial and urban history here if you start early with a guide; most of the catalogue is still logistics-led.',
        'Dress rules and heat shorten the window for any serious visit.',
      ],
    },
  },
]

const krakowAttractions: Attraction[] = [
  {
    name: 'Wawel Castle',
    category: 'Castles & royal sites',
    lat: 50.054,
    lng: 19.9354,
    from: 14,
    rating: 4.8,
    reviews: 3420,
    fits: {
      family_traveler: [
        0,
        'Flat courtyards, 90-minute formats and a dragon story that lands with children.',
      ],
      interest_deep_dive_traveler: [
        0,
        'Royal apartments and the cathedral with a guide who can date each rebuild.',
      ],
    },
    products: [
      {
        title: 'Wawel Castle & Cathedral, 90-minute family walk',
        rating: 4.9,
        reviews: 1204,
        duration: '1h 30m',
        price: 32,
        why: 'Ninety minutes, flat ground and a guide who tells the dragon legend properly before the royal tombs.',
        trade: 'Skips the Crown Treasury — the room where most family groups lose attention.',
        snip: 'Reviews shown are from travellers with children under 12. 61% of them mention the 90-minute length.',
        quote: 'Short enough that our seven-year-old was still listening at the end.',
      },
      {
        title: 'Royal apartments & Crown Treasury, historian-led',
        rating: 4.8,
        reviews: 876,
        duration: '2h 45m',
        price: 58,
        why: 'Full interior circuit with an art historian, including the treasury and the Sigismund bell.',
        trade: 'Longer duration and 140 stairs — we would not book this one with young children.',
        snip: 'Reviews shown are from travellers who booked expert-led formats. Depth of commentary is the most-cited theme.',
        quote: 'The guide answered questions I did not know I had.',
      },
    ],
  },
  {
    name: 'Kazimierz',
    category: 'Quarters & food walks',
    lat: 50.0517,
    lng: 19.9445,
    from: 22,
    rating: 4.9,
    reviews: 1980,
    fits: {
      interest_deep_dive_traveler: [0, 'The Jewish quarter with a historian, not a pub crawl with a flag.'],
      family_traveler: [2, 'Food-led version works well; the memorial-site version does not.'],
    },
    products: [
      {
        title: 'Kazimierz food walk, six tastings',
        rating: 4.9,
        reviews: 942,
        duration: '3h',
        price: 44,
        why: 'Six stops with the families who run them, ending at a zapiekanka counter that has not changed in 30 years.',
        trade: 'Three hours of standing and eating — no seated meal.',
        snip: 'Reviews shown are from travellers who ranked value highest. Portion size is the most-repeated point.',
        quote: 'We skipped dinner afterwards. That was the right call.',
      },
    ],
  },
  {
    name: 'Wieliczka Salt Mine',
    category: 'Underground & day trips',
    lat: 49.983,
    lng: 20.054,
    from: 26,
    rating: 4.7,
    reviews: 5610,
    fits: {
      family_traveler: [
        0,
        'An indoor afternoon that works in any weather, and the only chapel 100m underground.',
      ],
    },
    products: [
      {
        title: 'Wieliczka first entry, hotel pickup included',
        rating: 4.8,
        reviews: 2210,
        duration: '4h',
        price: 49,
        why: 'First slot of the day, before the corridors fill. Pickup removes the 40-minute transfer problem.',
        trade: '380 steps down and a constant 14°C — bring layers.',
        snip: 'Reviews shown are from families travelling with children. The early slot is the most-praised detail.',
        quote: 'Empty chambers for the first half hour. Worth the early start.',
      },
    ],
  },
]

const romeAttractions: Attraction[] = [
  {
    name: 'Colosseum',
    category: 'Ancient Rome',
    lat: 41.8902,
    lng: 12.4922,
    from: 44,
    rating: 4.9,
    reviews: 34900,
    fits: {
      first_time_visitor: [0, 'The one ticket class that reaches the arena floor and underground.'],
      interest_deep_dive_traveler: [0, 'Licensed archaeologists, not headset guides reading a script.'],
      family_traveler: [1, 'The 60-minute loop exists precisely for short attention spans.'],
    },
    products: [
      {
        title: 'Arena floor & underground, archaeologist-led',
        rating: 4.9,
        reviews: 5780,
        duration: '3h',
        price: 79,
        why: 'The only ticket class that reaches the hypogeum. Led by someone with a licence to work the site.',
        trade: 'Three hours with limited shade and no seating.',
        snip: 'Reviews shown are from travellers who booked expert-led formats. Access to the underground is the most-cited reason.',
        quote: 'Standing on the arena floor is not the same as looking at it.',
      },
      {
        title: 'Colosseum express entry, 60-minute loop',
        rating: 4.7,
        reviews: 3102,
        duration: '1h',
        price: 44,
        why: 'In and out before attention runs out — the format we recommend for half a day in Rome with children.',
        trade: 'No underground and no arena floor at this ticket class.',
        snip: 'Reviews shown are from families with children. The one-hour length is the most-repeated positive.',
        quote: 'Exactly as long as our kids could manage in the heat.',
      },
    ],
  },
  {
    name: 'Vatican Museums',
    category: 'Art & museums',
    lat: 41.9065,
    lng: 12.4536,
    from: 56,
    rating: 4.8,
    reviews: 28140,
    fits: {
      interest_deep_dive_traveler: [0, 'First-entry slots before public opening. Thirty quiet minutes is the whole product.'],
      first_time_visitor: [1, 'Timed entry is the only way this works in August.'],
    },
    products: [
      {
        title: 'Sistine Chapel first entry, before public opening',
        rating: 4.9,
        reviews: 2940,
        duration: '3h',
        price: 96,
        why: 'Thirty minutes in a near-empty chapel. Nothing else in Rome compares.',
        trade: '07:30 start and a 2km indoor walk before the chapel.',
        snip: 'Reviews shown are from travellers who prioritised quiet access. Early entry dominates the comments.',
        quote: 'We heard the room, not the crowd.',
      },
    ],
  },
  {
    name: 'Trastevere',
    category: 'Food quarters',
    lat: 41.8892,
    lng: 12.4694,
    from: 38,
    rating: 4.8,
    reviews: 6420,
    fits: {
      first_time_visitor: [2, 'The evening that makes people book Rome again.'],
      family_traveler: [2, 'Early sitting works; the 20:30 start does not.'],
    },
    products: [
      {
        title: 'Trastevere at dinner with a Roman food writer',
        rating: 4.8,
        reviews: 1180,
        duration: '3h 30m',
        price: 82,
        why: 'Four family-run kitchens, chosen by someone who reviews them professionally.',
        trade: 'Starts at 19:30 — late for young children.',
        snip: 'Reviews shown are from travellers who ranked food experiences highest.',
        quote: 'Not one place we would have found ourselves.',
      },
    ],
  },
]

const kyotoAttractions: Attraction[] = [
  {
    name: 'Fushimi Inari',
    category: 'Shrines',
    lat: 34.9671,
    lng: 135.7727,
    from: 29,
    rating: 4.9,
    reviews: 12480,
    fits: {
      interest_deep_dive_traveler: [0, 'A shrine historian at dusk, when the gate corridor finally empties.'],
      first_time_visitor: [0, 'The image everyone comes for — timed so you actually get it.'],
      active_adventure_traveler: [1, 'The full summit loop is 4km of steps.'],
    },
    products: [
      {
        title: 'Fushimi Inari after dark, with a shrine historian',
        rating: 4.9,
        reviews: 2149,
        duration: '3h',
        price: 33,
        why: 'Starts at 18:00. The corridor empties, and the guide researches this shrine for a living.',
        trade: 'Uneven steps in low light — not suitable with a stroller.',
        snip: 'Reviews shown are from travellers who booked expert-led formats. Emptiness of the gates is the top theme.',
        quote: 'We had whole stretches of the corridor to ourselves.',
      },
      {
        title: 'Private morning: Fushimi & Tofuku-ji, car included',
        rating: 4.8,
        reviews: 864,
        duration: '5h',
        price: 138,
        why: 'Worth it only if Kyoto is a single day — the car is what makes both sites fit.',
        trade: 'Five hours and the highest price point at this attraction.',
        snip: 'Reviews shown are from travellers on single-day city stops.',
        quote: 'Two sites properly, instead of three badly.',
      },
    ],
  },
  {
    name: 'Kinkaku-ji',
    category: 'Temples',
    lat: 35.0394,
    lng: 135.7292,
    from: 24,
    rating: 4.8,
    reviews: 9310,
    fits: {
      first_time_visitor: [1, 'First entry slot, before the pond fills with coach groups.'],
      family_traveler: [0, 'Forty minutes, flat gravel paths, one unmistakable view.'],
    },
    products: [
      {
        title: 'Golden Pavilion & Zen garden, small group',
        rating: 4.8,
        reviews: 1204,
        duration: '2h 30m',
        price: 41,
        why: 'First entry slot with a group capped at eight.',
        trade: '08:00 start, and the pavilion interior is never open.',
        snip: 'Reviews shown are from families and first-time visitors. Group size is the most-mentioned factor.',
        quote: 'Photographs without a hundred people in them.',
      },
    ],
  },
  {
    name: 'Arashiyama',
    category: 'Nature walks',
    lat: 35.017,
    lng: 135.6717,
    from: 31,
    rating: 4.7,
    reviews: 7240,
    fits: {
      active_adventure_traveler: [0, 'Bamboo grove, river walk and a hill of macaques in one morning.'],
      family_traveler: [1, 'The monkey park is the reliable win; the grove is a ten-minute walk.'],
    },
    products: [
      {
        title: 'Arashiyama at sunrise: grove, river and monkey park',
        rating: 4.8,
        reviews: 1010,
        duration: '4h',
        price: 54,
        why: 'Enters the grove at 06:30 — the only hour it is quiet.',
        trade: 'Early start and a 120m climb to the macaques.',
        snip: 'Reviews shown are from travellers who prioritised active formats.',
        quote: 'The grove was silent. By nine it was not.',
      },
    ],
  },
]

const lisbonAttractions: Attraction[] = [
  {
    name: 'Alfama',
    category: 'Old quarters',
    lat: 38.7118,
    lng: -9.13,
    from: 19,
    rating: 4.8,
    reviews: 4870,
    fits: {
      first_time_visitor: [0, 'The version of Lisbon people picture, walked properly.'],
    },
    products: [
      {
        title: 'Alfama on foot before the trams fill',
        rating: 4.8,
        reviews: 1420,
        duration: '2h 30m',
        price: 27,
        why: '08:30 start on foot, ending at a fado house before it opens to the public.',
        trade: 'Steep cobbles throughout — not step-free.',
        snip: 'Reviews shown are from travellers who ranked value highest.',
        quote: 'We walked past the queue we would have joined.',
      },
    ],
  },
  {
    name: 'Sintra',
    category: 'Palaces & day trips',
    lat: 38.7979,
    lng: -9.3907,
    from: 34,
    rating: 4.7,
    reviews: 8920,
    fits: {
      first_time_visitor: [1, 'Only works as a morning. We do not sell the afternoon version.'],
      family_traveler: [2, 'Palace grounds are a good run-around; the queues are not.'],
    },
    products: [
      {
        title: 'Sintra at opening, Pena Palace first',
        rating: 4.7,
        reviews: 1860,
        duration: '5h',
        price: 62,
        why: 'At the gate for opening, Pena before the coaches, out of town by noon.',
        trade: '07:15 pickup — the earliest departure we sell in Portugal.',
        snip: 'Reviews shown are from travellers on short city trips.',
        quote: 'Back in Lisbon for lunch, which was the point.',
      },
    ],
  },
  {
    name: 'Belém Tower',
    category: 'Monuments',
    lat: 38.6916,
    lng: -9.216,
    from: 16,
    rating: 4.6,
    reviews: 3110,
    fits: {
      family_traveler: [1, 'Short, riverside, and the pastry queue is part of it.'],
    },
    products: [
      {
        title: 'Belém by riverside tram, with the pastry stop',
        rating: 4.6,
        reviews: 640,
        duration: '2h',
        price: 23,
        why: 'Two hours, flat, ending where the custard tarts are still warm.',
        trade: 'Tower interior is a narrow spiral staircase, one-way only.',
        snip: 'Reviews shown are from families and value-led travellers.',
        quote: 'Cheap, short and the kids were happy.',
      },
    ],
  },
]

const santoriniAttractions: Attraction[] = [
  {
    name: 'Oia Caldera',
    category: 'Viewpoints & sailing',
    lat: 36.4618,
    lng: 25.3753,
    from: 64,
    rating: 4.9,
    reviews: 7860,
    fits: {
      first_time_visitor: [0, 'Sunset-timed departure, recalculated weekly.'],
    },
    products: [
      {
        title: 'Small-boat caldera sail, sunset-timed',
        rating: 4.9,
        reviews: 1860,
        duration: '5h',
        price: 128,
        why: 'Departure shifts weekly with the real sunset table. Crew of four, capacity of twelve.',
        trade: 'Five hours on a small boat — poor choice in high swell.',
        snip: 'Reviews shown are from travellers who prioritised timing and small groups.',
        quote: 'We were in position twenty minutes before the sun dropped.',
      },
    ],
  },
  {
    name: 'Akrotiri',
    category: 'Archaeology',
    lat: 36.3517,
    lng: 25.4036,
    from: 28,
    rating: 4.8,
    reviews: 2410,
    fits: {
      interest_deep_dive_traveler: [0, 'The excavation with the archaeologist who worked the trench.'],
      family_traveler: [2, 'Covered site, so it works in the midday heat.'],
    },
    products: [
      {
        title: 'Akrotiri excavation before the heat',
        rating: 4.8,
        reviews: 720,
        duration: '2h',
        price: 38,
        why: '09:00 entry, fully roofed, led by a site archaeologist.',
        trade: 'No sea views and no photo stop — this one is content, not scenery.',
        snip: 'Reviews shown are from travellers who booked expert-led formats.',
        quote: 'The only stop on the island that explained anything.',
      },
    ],
  },
]

const bangkokAttractions: Attraction[] = [
  {
    name: 'Grand Palace',
    category: 'Palaces',
    lat: 13.75,
    lng: 100.4915,
    from: 21,
    rating: 4.8,
    reviews: 15470,
    fits: {
      active_adventure_traveler: [0, '08:00 entry, before 34°C and before the dress-code queue.'],
      family_traveler: [1, 'Shade planning matters more here than anywhere else we sell.'],
    },
    products: [
      {
        title: 'Grand Palace & Wat Pho at 08:00, dress kit provided',
        rating: 4.8,
        reviews: 2260,
        duration: '4h',
        price: 38,
        why: 'Before the heat and before the dress-code queue. The kit is what stops you being turned away at the gate.',
        trade: 'Four hours on foot with limited indoor seating.',
        snip: 'Reviews shown are from travellers who prioritised early starts.',
        quote: 'We finished before the midday crush arrived.',
      },
    ],
  },
  {
    name: 'Chao Phraya',
    category: 'Boat & canals',
    lat: 13.746,
    lng: 100.493,
    from: 18,
    rating: 4.7,
    reviews: 6820,
    fits: {
      active_adventure_traveler: [0, 'Boat-first morning that skips the worst traffic.'],
      family_traveler: [0, 'Short hops and shade on deck — workable with children.'],
    },
    products: [
      {
        title: 'Canal longtail & market stop, morning only',
        rating: 4.7,
        reviews: 1540,
        duration: '3h',
        price: 29,
        why: 'Leaves at 07:30, before the heat and before the tourist boats stack up.',
        trade: 'Wooden seats and spray — bring a light jacket.',
        snip: 'Reviews shown are from families and active travellers.',
        quote: 'The only way we saw Bangkok without sitting in traffic.',
      },
    ],
  },
  {
    name: 'Chatuchak',
    category: 'Markets',
    lat: 13.7999,
    lng: 100.5503,
    from: 12,
    rating: 4.6,
    reviews: 4210,
    fits: {
      family_traveler: [2, 'Crowds spike after 11:00 — morning only.'],
    },
    products: [
      {
        title: 'Chatuchak highlights with a local food scout',
        rating: 4.6,
        reviews: 880,
        duration: '2h 30m',
        price: 24,
        why: 'Three tasting stops and the stalls worth the walk — not a full market crawl.',
        trade: 'Weekend-only; weekday versions are thinner.',
        snip: 'Reviews shown are from value-led travellers.',
        quote: 'We bought half of what we would have alone, and ate better.',
      },
    ],
  },
]

function completeAudienceFits(attraction: Attraction): Attraction {
  const category = attraction.category.toLowerCase()
  const firstTier = /palace|shrine|temple|ancient|castle|viewpoint|sailing|monument/.test(
    category,
  )
    ? 0
    : 1
  const familyTier = /castle|palace|boat|canal|monument/.test(category)
    ? 0
    : /archaeology|food/.test(category)
      ? 2
      : 1
  const coupleTier =
    /food|quarter|viewpoint|sailing|garden|river/.test(category) ? 0 : 1
  const comfortTier = /nature|market/.test(category) ? 2 : 1
  const soloTier = /food|quarter|market|boat|canal/.test(category) ? 0 : 1
  const interestTier = /archaeology|temple|shrine|ancient|castle|museum/.test(
    category,
  )
    ? 0
    : 1
  const activeTier = /nature|boat|canal|market/.test(category)
    ? 0
    : /archaeology|museum|art/.test(category)
      ? 2
      : 1

  return {
    ...attraction,
    fits: {
      first_time_visitor: [
        firstTier,
        `${attraction.name} is timed so a first visit actually delivers the image people come for.`,
      ],
      family_traveler: [
        familyTier,
        `A shorter, clearer format keeps ${attraction.name} workable with children.`,
      ],
      couple_traveler: [
        coupleTier,
        `${attraction.name} has a clear shared format with time to experience it at an unhurried pace.`,
      ],
      comfort_easy_pace_traveler: [
        comfortTier,
        `A structured ${attraction.category.toLowerCase()} visit removes avoidable planning and queue decisions.`,
      ],
      solo_social_traveler: [
        soloTier,
        `A guided small-group format makes ${attraction.name} straightforward to join independently.`,
      ],
      interest_deep_dive_traveler: [
        interestTier,
        `The expert-led version of ${attraction.name} is the one that explains the site rather than circling it.`,
      ],
      active_adventure_traveler: [
        activeTier,
        `An early or outdoor-led format turns ${attraction.name} into movement instead of a queue.`,
      ],
      ...attraction.fits,
    },
  }
}

export const CITIES: Record<string, CityCatalog> = {
  krakow: {
    id: 'krakow',
    countryId: 'pl',
    name: 'Kraków',
    lat: 50.0647,
    lng: 19.945,
    picks: 9,
    attractions: krakowAttractions.map(completeAudienceFits),
  },
  rome: {
    id: 'rome',
    countryId: 'it',
    name: 'Rome',
    lat: 41.9028,
    lng: 12.4964,
    picks: 31,
    attractions: romeAttractions.map(completeAudienceFits),
  },
  kyoto: {
    id: 'kyoto',
    countryId: 'jp',
    name: 'Kyoto',
    lat: 35.0116,
    lng: 135.7681,
    picks: 24,
    attractions: kyotoAttractions.map(completeAudienceFits),
  },
  lisbon: {
    id: 'lisbon',
    countryId: 'pt',
    name: 'Lisbon',
    lat: 38.7223,
    lng: -9.1393,
    picks: 15,
    attractions: lisbonAttractions.map(completeAudienceFits),
  },
  santorini: {
    id: 'santorini',
    countryId: 'gr',
    name: 'Santorini',
    lat: 36.3932,
    lng: 25.4615,
    picks: 18,
    attractions: santoriniAttractions.map(completeAudienceFits),
  },
  bangkok: {
    id: 'bangkok',
    countryId: 'th',
    name: 'Bangkok',
    lat: 13.7563,
    lng: 100.5018,
    picks: 21,
    attractions: bangkokAttractions.map(completeAudienceFits),
  },
}

function extraCity(
  id: string,
  countryId: string,
  name: string,
  lat: number,
  lng: number,
  picks: number,
  site: { name: string; category: string; from: number },
): CityCatalog {
  return {
    id,
    countryId,
    name,
    lat,
    lng,
    picks,
    attractions: [
      {
        name: site.name,
        category: site.category,
        lat,
        lng,
        from: site.from,
        rating: 4.6,
        reviews: 920,
        fits: {
          first_time_visitor: [1, `The format we send people on from ${name}.`],
          family_traveler: [1, `A workable day from ${name} with a clear time box.`],
          couple_traveler: [1, `A compact shared route through ${site.name}.`],
          comfort_easy_pace_traveler: [
            1,
            `A structured three-hour visit keeps the logistics around ${name} simple.`,
          ],
          solo_social_traveler: [
            1,
            `The small-group format makes ${site.name} easy to join independently.`,
          ],
          interest_deep_dive_traveler: [1, `The site that earns ${name} a pin.`],
          active_adventure_traveler: [
            site.category === 'Nature walks' ? 0 : 2,
            `A guided route adds active discovery without turning the day into a transfer exercise.`,
          ],
        },
        products: [
          {
            title: `${site.name}, small-group highlights`,
            rating: 4.6,
            reviews: 410,
            duration: '3h',
            price: site.from + 12,
            why: `A three-hour format from ${name} — the reason this city stays on the map.`,
            trade: 'Fewer English-language departures than the primary city.',
            snip: 'Reviews shown are filtered to the active preference.',
            quote: 'The right base for the days we had.',
          },
        ],
      },
    ],
  }
}

const EXTRA_CITIES: CityCatalog[] = [
  extraCity('warsaw', 'pl', 'Warsaw', 52.2297, 21.0122, 6, {
    name: 'Warsaw Old Town',
    category: 'Old quarters',
    from: 18,
  }),
  extraCity('gdansk', 'pl', 'Gdańsk', 54.352, 18.6466, 5, {
    name: 'Gdańsk waterfront',
    category: 'Old quarters',
    from: 20,
  }),
  extraCity('wroclaw', 'pl', 'Wrocław', 51.1079, 17.0385, 4, {
    name: 'Ostrów Tumski',
    category: 'Old quarters',
    from: 16,
  }),
  extraCity('zakopane', 'pl', 'Zakopane', 49.2992, 19.9496, 3, {
    name: 'Tatra foothills',
    category: 'Nature walks',
    from: 28,
  }),
  extraCity('florence', 'it', 'Florence', 43.7696, 11.2558, 14, {
    name: 'Uffizi timed entry',
    category: 'Art & museums',
    from: 42,
  }),
  extraCity('venice', 'it', 'Venice', 45.4408, 12.3155, 11, {
    name: 'San Marco before crowds',
    category: 'Old quarters',
    from: 36,
  }),
  extraCity('naples', 'it', 'Naples', 40.8518, 14.2681, 8, {
    name: 'Historic centre walk',
    category: 'Food quarters',
    from: 24,
  }),
  extraCity('milan', 'it', 'Milan', 45.4642, 9.19, 7, {
    name: 'Duomo rooftop',
    category: 'Monuments',
    from: 31,
  }),
  extraCity('tokyo', 'jp', 'Tokyo', 35.6762, 139.6503, 18, {
    name: 'Meiji Shrine morning',
    category: 'Shrines',
    from: 26,
  }),
  extraCity('osaka', 'jp', 'Osaka', 34.6937, 135.5023, 10, {
    name: 'Osaka Castle park',
    category: 'Castles & royal sites',
    from: 22,
  }),
  extraCity('kanazawa', 'jp', 'Kanazawa', 36.5613, 136.6562, 6, {
    name: 'Kenrokuen garden',
    category: 'Temples',
    from: 29,
  }),
  extraCity('nara', 'jp', 'Nara', 34.6851, 135.8048, 5, {
    name: 'Nara Park & Tōdai-ji',
    category: 'Temples',
    from: 21,
  }),
  extraCity('porto', 'pt', 'Porto', 41.1579, -8.6291, 9, {
    name: 'Ribeira & riverfront',
    category: 'Old quarters',
    from: 22,
  }),
  extraCity('lagos', 'pt', 'Lagos', 37.1028, -8.673, 4, {
    name: 'Ponta da Piedade',
    category: 'Nature walks',
    from: 27,
  }),
  extraCity('coimbra', 'pt', 'Coimbra', 40.2033, -8.4103, 3, {
    name: 'University hill',
    category: 'Old quarters',
    from: 18,
  }),
  extraCity('athens', 'gr', 'Athens', 37.9838, 23.7275, 12, {
    name: 'Acropolis first entry',
    category: 'Archaeology',
    from: 34,
  }),
  extraCity('crete', 'gr', 'Crete', 35.3387, 25.1442, 7, {
    name: 'Knossos morning',
    category: 'Archaeology',
    from: 26,
  }),
  extraCity('naxos', 'gr', 'Naxos', 37.1036, 25.3761, 4, {
    name: 'Naxos harbour walk',
    category: 'Old quarters',
    from: 19,
  }),
  extraCity('chiangmai', 'th', 'Chiang Mai', 18.7883, 98.9853, 11, {
    name: 'Old city temples',
    category: 'Temples',
    from: 16,
  }),
  extraCity('phuket', 'th', 'Phuket', 7.8804, 98.3923, 8, {
    name: 'Old Town lanes',
    category: 'Old quarters',
    from: 22,
  }),
  extraCity('ayutthaya', 'th', 'Ayutthaya', 14.3692, 100.5877, 5, {
    name: 'Ayutthaya ruins circuit',
    category: 'Archaeology',
    from: 18,
  }),
]

for (const city of EXTRA_CITIES) {
  CITIES[city.id] = city
}
