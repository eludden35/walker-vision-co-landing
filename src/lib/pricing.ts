export type KitchenKey = "small" | "average" | "large" | "luxury";
export type BathroomKey = "half" | "full" | "master" | "luxury";
export type ExteriorSize = "none" | "small" | "large";

export interface PricingTier {
  price: number;
  label: string;
  sqft: string;
  tip: string;
  minSqft: number;
  maxSqft: number; // Infinity for the top tier
}

export const KITCHEN_TIERS: { key: KitchenKey; tier: PricingTier }[] = [
  {
    key: "small",
    tier: {
      price: 2000,
      label: "Small Kitchen",
      sqft: "0–100 sq ft",
      tip: "Typically 10x10 ft, common in older homes or apartments",
      minSqft: 0,
      maxSqft: 100,
    },
  },
  {
    key: "average",
    tier: {
      price: 2500,
      label: "Average Kitchen",
      sqft: "101–200 sq ft",
      tip: "Standard suburban kitchen layout",
      minSqft: 101,
      maxSqft: 200,
    },
  },
  {
    key: "large",
    tier: {
      price: 3500,
      label: "Large Kitchen",
      sqft: "201–400 sq ft",
      tip: "Open-plan or island kitchen",
      minSqft: 201,
      maxSqft: 400,
    },
  },
  {
    key: "luxury",
    tier: {
      price: 5000,
      label: "Luxury / Oversized Kitchen",
      sqft: "401+ sq ft",
      tip: "Gourmet or chef's kitchen",
      minSqft: 401,
      maxSqft: Infinity,
    },
  },
];

export const BATHROOM_TIERS: { key: BathroomKey; tier: PricingTier }[] = [
  {
    key: "half",
    tier: {
      price: 1500,
      label: "Half Bath / Powder Room",
      sqft: "0–30 sq ft",
      tip: "Toilet + small sink, typically under a staircase or hallway",
      minSqft: 0,
      maxSqft: 30,
    },
  },
  {
    key: "full",
    tier: {
      price: 2500,
      label: "Full Bathroom",
      sqft: "31–60 sq ft",
      tip: "Tub/shower, toilet, and vanity",
      minSqft: 31,
      maxSqft: 60,
    },
  },
  {
    key: "master",
    tier: {
      price: 3000,
      label: "Primary / Master Bathroom",
      sqft: "61–150 sq ft",
      tip: "Double vanity, larger shower, maybe a tub, walk-in showers",
      minSqft: 61,
      maxSqft: 150,
    },
  },
  {
    key: "luxury",
    tier: {
      price: 3500,
      label: "Luxury / Oversized Bathroom",
      sqft: "151+ sq ft",
      tip: "Spa-like features, premium fixtures and finishes",
      minSqft: 151,
      maxSqft: Infinity,
    },
  },
];

export const PAINTING_PRICING = {
  interiorPerWall: 100,
  interiorColorChangePerWall: 125,
  exteriorSmall: { price: 700, label: "1,000–2,400 sq ft", maxSqft: 2400 },
  exteriorLarge: { price: 1200, label: "2,500–3,500 sq ft", maxSqft: Infinity },
} as const;

// --- Tier resolution functions ---

export function resolveKitchenTier(sqft: number): (typeof KITCHEN_TIERS)[number] | null {
  if (sqft <= 0) return null;
  for (const entry of KITCHEN_TIERS) {
    if (sqft >= entry.tier.minSqft && sqft <= entry.tier.maxSqft) return entry;
  }
  return KITCHEN_TIERS[KITCHEN_TIERS.length - 1];
}

export function resolveBathroomTier(sqft: number): (typeof BATHROOM_TIERS)[number] | null {
  if (sqft <= 0) return null;
  for (const entry of BATHROOM_TIERS) {
    if (sqft >= entry.tier.minSqft && sqft <= entry.tier.maxSqft) return entry;
  }
  return BATHROOM_TIERS[BATHROOM_TIERS.length - 1];
}

export function resolveExteriorPrice(sqft: number): { price: number; label: string } | null {
  if (sqft <= 0) return null;
  if (sqft <= PAINTING_PRICING.exteriorSmall.maxSqft) {
    return { price: PAINTING_PRICING.exteriorSmall.price, label: PAINTING_PRICING.exteriorSmall.label };
  }
  return { price: PAINTING_PRICING.exteriorLarge.price, label: PAINTING_PRICING.exteriorLarge.label };
}

// --- Selections data shape ---

export interface Selections {
  kitchens: number[];
  bathrooms: number[];
  painting: {
    interiorWalls: number;
    changingColors: boolean;
    exteriorSqft: number;
  };
}

// --- Calculation functions ---

export function calculateTotal(selections: Selections): number {
  let total = 0;

  for (const sqft of selections.kitchens) {
    const resolved = resolveKitchenTier(sqft);
    if (resolved) total += resolved.tier.price;
  }

  for (const sqft of selections.bathrooms) {
    const resolved = resolveBathroomTier(sqft);
    if (resolved) total += resolved.tier.price;
  }

  const wallPrice = selections.painting.changingColors
    ? PAINTING_PRICING.interiorColorChangePerWall
    : PAINTING_PRICING.interiorPerWall;
  total += wallPrice * selections.painting.interiorWalls;

  const ext = resolveExteriorPrice(selections.painting.exteriorSqft);
  if (ext) total += ext.price;

  return total;
}

export function buildLineItems(
  selections: Selections
): { label: string; amount: number }[] {
  const items: { label: string; amount: number }[] = [];

  selections.kitchens.forEach((sqft, i) => {
    const resolved = resolveKitchenTier(sqft);
    if (resolved) {
      const prefix = selections.kitchens.length > 1 ? `Kitchen #${i + 1}: ` : "";
      items.push({
        label: `${prefix}${resolved.tier.label} (${sqft} sq ft)`,
        amount: resolved.tier.price,
      });
    }
  });

  selections.bathrooms.forEach((sqft, i) => {
    const resolved = resolveBathroomTier(sqft);
    if (resolved) {
      const prefix = selections.bathrooms.length > 1 ? `Bathroom #${i + 1}: ` : "";
      items.push({
        label: `${prefix}${resolved.tier.label} (${sqft} sq ft)`,
        amount: resolved.tier.price,
      });
    }
  });

  if (selections.painting.interiorWalls > 0) {
    const wallPrice = selections.painting.changingColors
      ? PAINTING_PRICING.interiorColorChangePerWall
      : PAINTING_PRICING.interiorPerWall;
    const suffix = selections.painting.changingColors ? " (color change)" : "";
    items.push({
      label: `${selections.painting.interiorWalls} walls interior paint${suffix}`,
      amount: wallPrice * selections.painting.interiorWalls,
    });
  }

  const ext = resolveExteriorPrice(selections.painting.exteriorSqft);
  if (ext) {
    items.push({
      label: `Exterior paint (${ext.label})`,
      amount: ext.price,
    });
  }

  return items;
}
