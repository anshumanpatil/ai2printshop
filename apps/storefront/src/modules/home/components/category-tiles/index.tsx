import { listCategories } from "@lib/data/categories"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Text } from "@modules/common/components/ui"

const DESCRIPTIONS: Record<string, string> = {
  "business-cards": "Standard, square and soft-touch cards",
  flyers: "A4, A5 and DL flyers for every campaign",
  brochures: "Folded brochures and stapled booklets",
}

export default async function CategoryTiles() {
  const categories = (await listCategories()) ?? []
  const top = categories.filter((c) => !c.parent_category)

  if (!top.length) {
    return null
  }

  return (
    <div className="content-container pt-16">
      <Text className="txt-xlarge mb-8">Shop by category</Text>
      <ul className="grid grid-cols-1 small:grid-cols-3 gap-6">
        {top.map((category) => (
          <li key={category.id}>
            <LocalizedClientLink
              href={`/categories/${category.handle}`}
              className="flex flex-col gap-2 border border-ui-border-base rounded-rounded p-8 h-full hover:shadow-elevation-card-hover transition-shadow"
            >
              <span className="txt-large-plus text-ui-fg-base">
                {category.name}
              </span>
              <span className="txt-small text-ui-fg-subtle">
                {DESCRIPTIONS[category.handle] ?? category.description}
              </span>
              <span className="txt-small-plus text-ui-fg-interactive mt-4">
                Browse &rarr;
              </span>
            </LocalizedClientLink>
          </li>
        ))}
      </ul>
    </div>
  )
}
