/**
 * Demo data only - creates a print catalogue (business cards, flyers,
 * brochures) for client demos on localhost.
 *
 *   npx medusa exec ./src/scripts/seed-print-demo.ts
 *
 * Re-running is safe: products use deterministic handles and existing ones are skipped.
 */
import {
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  updateProductsWorkflow,
} from "@medusajs/medusa/core-flows"
import {
  ContainerRegistrationKeys,
  MedusaError,
  ProductStatus,
} from "@medusajs/framework/utils"
import type { ExecArgs } from "@medusajs/framework/types"

// Mockups are generated into the storefront's public/products folder
const IMAGE_BASE_URL = process.env.DEMO_IMAGE_BASE_URL ?? "http://localhost:8000/products"
const productImages = (handle: string) =>
  [1, 2, 3].map((n) => ({ url: `${IMAGE_BASE_URL}/${handle}-${n}.png` }))

type OptionDef = {
  title: string
  // value -> price multiplier
  values: Record<string, number>
}

type ProductDef = {
  handle: string
  title: string
  subtitle: string
  description: string
  category: string
  basePrice: number
  options: OptionDef[]
}

const CATEGORIES = ["Business Cards", "Flyers", "Brochures"]

const FINISH: OptionDef = {
  title: "Finish",
  values: { "Matte Lamination": 1.15, "Gloss Lamination": 1.15, "Uncoated": 1 },
}

const PRODUCTS: ProductDef[] = [
  {
    handle: "standard-business-card",
    title: "Standard Business Card",
    subtitle: "90 x 55 mm, double sided",
    description: "Classic double-sided business card on premium 350gsm stock.",
    category: "Business Cards",
    basePrice: 0.12,
    options: [
      { title: "Quantity", values: { "100": 100, "250": 220, "500": 400, "1000": 700 } },
      { title: "Paper", values: { "350gsm Silk": 1, "400gsm Matte": 1.2 } },
      FINISH,
    ],
  },
  {
    handle: "premium-soft-touch-business-card",
    title: "Premium Soft Touch Business Card",
    subtitle: "90 x 55 mm, velvet feel",
    description: "Thick 500gsm card with a soft-touch coating for a premium impression.",
    category: "Business Cards",
    basePrice: 0.22,
    options: [
      { title: "Quantity", values: { "100": 100, "250": 220, "500": 400 } },
      { title: "Paper", values: { "500gsm Soft Touch": 1 } },
      { title: "Finish", values: { "Soft Touch": 1, "Spot UV": 1.35 } },
    ],
  },
  {
    handle: "square-business-card",
    title: "Square Business Card",
    subtitle: "65 x 65 mm, double sided",
    description: "A distinctive square format that stands out in any card holder.",
    category: "Business Cards",
    basePrice: 0.16,
    options: [
      { title: "Quantity", values: { "100": 100, "250": 220, "500": 400 } },
      { title: "Paper", values: { "350gsm Silk": 1, "400gsm Matte": 1.2 } },
    ],
  },
  {
    handle: "a5-flyer",
    title: "A5 Flyer",
    subtitle: "148 x 210 mm",
    description: "Versatile A5 flyer for promotions, events and menus.",
    category: "Flyers",
    basePrice: 0.1,
    options: [
      { title: "Quantity", values: { "250": 250, "500": 450, "1000": 800, "2500": 1800 } },
      { title: "Paper", values: { "130gsm Gloss": 1, "170gsm Silk": 1.25 } },
      { title: "Sides", values: { "Single sided": 1, "Double sided": 1.3 } },
    ],
  },
  {
    handle: "a4-flyer",
    title: "A4 Flyer",
    subtitle: "210 x 297 mm",
    description: "Large-format A4 flyer for maximum visual impact.",
    category: "Flyers",
    basePrice: 0.18,
    options: [
      { title: "Quantity", values: { "250": 250, "500": 450, "1000": 800 } },
      { title: "Paper", values: { "130gsm Gloss": 1, "170gsm Silk": 1.25 } },
      { title: "Sides", values: { "Single sided": 1, "Double sided": 1.3 } },
    ],
  },
  {
    handle: "dl-flyer",
    title: "DL Flyer",
    subtitle: "99 x 210 mm",
    description: "Slim DL flyer, ideal for mailers and counter displays.",
    category: "Flyers",
    basePrice: 0.09,
    options: [
      { title: "Quantity", values: { "500": 450, "1000": 800, "2500": 1800 } },
      { title: "Paper", values: { "130gsm Gloss": 1, "170gsm Silk": 1.25 } },
    ],
  },
  {
    handle: "a4-folded-brochure",
    title: "A4 Folded Brochure",
    subtitle: "A4 folded to A5, 4 pages",
    description: "Bi-fold brochure with a clean centre fold, perfect for company profiles.",
    category: "Brochures",
    basePrice: 0.45,
    options: [
      { title: "Quantity", values: { "100": 100, "250": 220, "500": 400 } },
      { title: "Paper", values: { "150gsm Gloss": 1, "200gsm Silk": 1.3 } },
    ],
  },
  {
    handle: "tri-fold-brochure",
    title: "Tri-Fold Brochure",
    subtitle: "A4 folded to DL, 6 panels",
    description: "Six-panel tri-fold brochure for services, menus and product ranges.",
    category: "Brochures",
    basePrice: 0.5,
    options: [
      { title: "Quantity", values: { "100": 100, "250": 220, "500": 400 } },
      { title: "Paper", values: { "150gsm Gloss": 1, "200gsm Silk": 1.3 } },
      { title: "Fold", values: { "Roll fold": 1, "Z fold": 1.05 } },
    ],
  },
  {
    handle: "stapled-booklet",
    title: "Stapled Booklet",
    subtitle: "A5, 8 to 16 pages",
    description: "Saddle-stitched A5 booklet for catalogues, manuals and lookbooks.",
    category: "Brochures",
    basePrice: 1.1,
    options: [
      { title: "Quantity", values: { "50": 50, "100": 95, "250": 220 } },
      { title: "Pages", values: { "8 pages": 1, "12 pages": 1.45, "16 pages": 1.9 } },
    ],
  },
]

function cartesian(options: OptionDef[]): Record<string, string>[] {
  return options.reduce<Record<string, string>[]>(
    (acc, option) =>
      acc.flatMap((combo) =>
        Object.keys(option.values).map((value) => ({ ...combo, [option.title]: value }))
      ),
    [{}]
  )
}

function variantPrice(product: ProductDef, combo: Record<string, string>): number {
  // Quantity multiplier is the total unit count factor; other options scale it.
  let total = product.basePrice
  for (const option of product.options) {
    const factor = option.values[combo[option.title]]
    total *= factor
  }
  return Math.max(Math.round(total * 100) / 100, 1)
}

export default async function seedPrintDemo({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
  })
  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  })
  const { data: stores } = await query.graph({
    entity: "store",
    fields: ["id", "supported_currencies.currency_code"],
  })

  const salesChannel = salesChannels[0]
  const shippingProfile = shippingProfiles[0]

  if (!salesChannel || !shippingProfile) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      "No sales channel or shipping profile found. Run the initial data seed first."
    )
  }

  const currencyCodes: string[] = (stores[0]?.supported_currencies ?? [])
    .map((currency) => currency?.currency_code)
    .filter((code): code is string => Boolean(code))

  if (!currencyCodes.length) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "The store has no supported currencies.")
  }

  const { data: existingCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name"],
  })
  const missingCategories = CATEGORIES.filter(
    (name) => !existingCategories.some((category) => category.name === name)
  )

  if (missingCategories.length) {
    await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: missingCategories.map((name) => ({ name, is_active: true })),
      },
    })
    logger.info(`Created ${missingCategories.length} categories`)
  }

  const { data: categories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name"],
  })
  const { data: existingProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle", "thumbnail"],
  })
  const takenHandles = new Set(existingProducts.map((product) => product.handle))

  // Refresh imagery on products created by an earlier run (e.g. placeholders)
  for (const existing of existingProducts) {
    const images = PRODUCTS.some((p) => p.handle === existing.handle)
      ? productImages(existing.handle as string)
      : null
    if (images && existing.thumbnail !== images[0].url) {
      await updateProductsWorkflow(container).run({
        input: { selector: { id: existing.id as string }, update: { thumbnail: images[0].url, images } },
      })
      logger.info(`Updated images for ${existing.handle}`)
    }
  }

  const products = PRODUCTS.filter((product) => !takenHandles.has(product.handle)).map(
    (product) => {
      const images = productImages(product.handle)
      const category = categories.find((c) => c.name === product.category)

      return {
        title: product.title,
        handle: product.handle,
        subtitle: product.subtitle,
        description: product.description,
        status: ProductStatus.PUBLISHED,
        thumbnail: images[0].url,
        images,
        shipping_profile_id: shippingProfile.id,
        category_ids: category ? [category.id as string] : [],
        sales_channels: [{ id: salesChannel.id }],
        options: product.options.map((option) => ({
          title: option.title,
          values: Object.keys(option.values),
        })),
        variants: cartesian(product.options).map((combo) => ({
          title: Object.values(combo).join(" / "),
          sku: `${product.handle}-${Object.values(combo).join("-")}`
            .toUpperCase()
            .replace(/[^A-Z0-9]+/g, "-"),
          manage_inventory: false,
          options: combo,
          prices: currencyCodes.map((currency_code) => ({
            amount: variantPrice(product, combo),
            currency_code,
          })),
        })),
      }
    }
  )

  if (!products.length) {
    logger.info("All print demo products already exist. Nothing to do.")
    return
  }

  await createProductsWorkflow(container).run({ input: { products: products as never } })
  logger.info(`Created ${products.length} print demo products`)
}
