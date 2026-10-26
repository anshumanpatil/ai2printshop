import { HttpTypes } from "@medusajs/types"
import { convertToLocale } from "@lib/util/money"
import { clx } from "@modules/common/components/ui"

type PricedVariant = HttpTypes.StoreProductVariant & {
  calculated_price?: { calculated_amount: number; currency_code: string }
}

type Props = {
  product: HttpTypes.StoreProduct
  options: Record<string, string | undefined>
  onSelect: (optionId: string, value: string) => void
  disabled?: boolean
}

/**
 * Shows the price for each Quantity value, using the cheapest variant that
 * matches the other options the buyer has already chosen.
 */
export default function QuantityPricing({
  product,
  options,
  onSelect,
  disabled,
}: Props) {
  const quantityOption = product.options?.find((o) => o.title === "Quantity")

  if (!quantityOption) {
    return null
  }

  const variants = (product.variants ?? []) as PricedVariant[]
  const otherSelections = Object.entries(options).filter(
    ([id, value]) => id !== quantityOption.id && value
  )

  const rows = (quantityOption.values ?? [])
    .map((v) => {
      const matching = variants.filter((variant) => {
        const byOption = Object.fromEntries(
          (variant.options ?? []).map((o) => [o.option_id, o.value])
        )
        return (
          byOption[quantityOption.id] === v.value &&
          otherSelections.every(([id, value]) => byOption[id] === value)
        )
      })
      const cheapest = matching
        .filter((m) => m.calculated_price)
        .sort(
          (a, b) =>
            a.calculated_price!.calculated_amount -
            b.calculated_price!.calculated_amount
        )[0]

      if (!cheapest?.calculated_price) {
        return null
      }

      const qty = Number(v.value)
      const total = cheapest.calculated_price.calculated_amount
      const currency = cheapest.calculated_price.currency_code

      return {
        value: v.value,
        total: convertToLocale({ amount: total, currency_code: currency }),
        unit: Number.isFinite(qty)
          ? convertToLocale({
              amount: total / qty,
              currency_code: currency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 3,
            })
          : null,
      }
    })
    .filter((r): r is NonNullable<typeof r> => r !== null)

  if (!rows.length) {
    return null
  }

  return (
    <div className="flex flex-col gap-y-2" data-testid="quantity-pricing">
      <span className="text-sm">Price by quantity</span>
      <table className="w-full text-small-regular border border-ui-border-base">
        <thead className="bg-ui-bg-subtle text-ui-fg-subtle">
          <tr>
            <th className="text-left p-2 font-normal">Quantity</th>
            <th className="text-right p-2 font-normal">Per unit</th>
            <th className="text-right p-2 font-normal">Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.value}
              onClick={() =>
                !disabled && onSelect(quantityOption.id, row.value)
              }
              className={clx(
                "border-t border-ui-border-base cursor-pointer hover:bg-ui-bg-subtle",
                { "bg-ui-bg-subtle-hover": options[quantityOption.id] === row.value }
              )}
            >
              <td className="p-2">{row.value}</td>
              <td className="p-2 text-right text-ui-fg-subtle">{row.unit}</td>
              <td className="p-2 text-right">{row.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
