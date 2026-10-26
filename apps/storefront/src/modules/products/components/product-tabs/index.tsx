"use client"

import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const tabs = [
    {
      label: "Print Specifications",
      component: <ProductInfoTab product={product} />,
    },
    {
      label: "Production & Delivery",
      component: <ShippingInfoTab />,
    },
  ]

  return (
    <div className="w-full">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  return (
    <div className="text-small-regular py-8">
      <div className="flex flex-col gap-y-4">
        {product.subtitle && (
          <div>
            <span className="font-semibold">Size &amp; format</span>
            <p>{product.subtitle}</p>
          </div>
        )}
        {(product.options ?? []).map((option) => (
          <div key={option.id}>
            <span className="font-semibold">{option.title}</span>
            <p>{(option.values ?? []).map((v) => v.value).join(", ")}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const ShippingInfoTab = () => {
  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-1 gap-y-8">
        <div className="flex items-start gap-x-2">
          <FastDelivery />
          <div>
            <span className="font-semibold">Production &amp; delivery</span>
            <p className="max-w-sm">
              Printed in 2-3 working days, then delivered in 2-3 working days
              to your door.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Refresh />
          <div>
            <span className="font-semibold">Reprint guarantee</span>
            <p className="max-w-sm">
              If your order arrives damaged or misprinted, we will reprint it
              free of charge.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Back />
          <div>
            <span className="font-semibold">Custom products</span>
            <p className="max-w-sm">
              Personalised print is made to order and cannot be returned
              unless faulty.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
