import { Metadata } from "next"

import CategoryTiles from "@modules/home/components/category-tiles"
import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { getRegion } from "@lib/data/regions"
import { STORE_NAME, STORE_TAGLINE } from "@lib/brand"

export const metadata: Metadata = {
  title: `${STORE_NAME} | ${STORE_TAGLINE}`,
  description:
    "Order business cards, flyers and brochures online. Pick size, paper, finish and quantity.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  return (
    <>
      <Hero />
      <CategoryTiles />
      <FeaturedProducts region={region} />
    </>
  )
}
