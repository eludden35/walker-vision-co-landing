import {
  BATHROOM_TIERS,
  KITCHEN_TIERS,
  PAINTING_PRICING,
} from "@/lib/pricing";

export type CatalogEntryKind = "kitchen" | "bathroom" | "painting";

export type QuoteCatalogEntry = {
  id: string;
  kind: CatalogEntryKind;
  label: string;
  /** Line total when quantity = 1 */
  unitPrice: number;
  defaultQuantity: number;
};

/** Fixed-tier lines derived from the same prices as the public quote tool. */
export function getQuoteCatalogEntries(): QuoteCatalogEntry[] {
  const kitchens: QuoteCatalogEntry[] = KITCHEN_TIERS.map((k) => ({
    id: `kitchen-${k.key}`,
    kind: "kitchen",
    label: k.tier.label,
    unitPrice: k.tier.price,
    defaultQuantity: 1,
  }));

  const bathrooms: QuoteCatalogEntry[] = BATHROOM_TIERS.map((b) => ({
    id: `bathroom-${b.key}`,
    kind: "bathroom",
    label: b.tier.label,
    unitPrice: b.tier.price,
    defaultQuantity: 1,
  }));

  const painting: QuoteCatalogEntry[] = [
    {
      id: "paint-wall",
      kind: "painting",
      label: `Interior wall paint (per wall, standard)`,
      unitPrice: PAINTING_PRICING.interiorPerWall,
      defaultQuantity: 1,
    },
    {
      id: "paint-wall-color",
      kind: "painting",
      label: `Interior wall paint (per wall, color change)`,
      unitPrice: PAINTING_PRICING.interiorColorChangePerWall,
      defaultQuantity: 1,
    },
    {
      id: "paint-ext-small",
      kind: "painting",
      label: `Exterior paint (${PAINTING_PRICING.exteriorSmall.label})`,
      unitPrice: PAINTING_PRICING.exteriorSmall.price,
      defaultQuantity: 1,
    },
    {
      id: "paint-ext-large",
      kind: "painting",
      label: `Exterior paint (${PAINTING_PRICING.exteriorLarge.label})`,
      unitPrice: PAINTING_PRICING.exteriorLarge.price,
      defaultQuantity: 1,
    },
  ];

  return [...kitchens, ...bathrooms, ...painting];
}
