import { Button, Heading } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { STORE_NAME } from "@lib/brand"

const Hero = () => {
  return (
    <div className="w-full border-b border-ui-border-base bg-ui-bg-subtle">
      <div className="content-container flex flex-col items-center text-center gap-6 py-24 small:py-32">
        <span className="txt-compact-small-plus uppercase tracking-widest text-ui-fg-muted">
          {STORE_NAME}
        </span>
        <Heading
          level="h1"
          className="text-4xl small:text-5xl leading-tight text-ui-fg-base font-normal max-w-3xl"
        >
          Print that makes your brand stand out
        </Heading>
        <Heading
          level="h2"
          className="text-lg small:text-xl leading-8 text-ui-fg-subtle font-normal max-w-2xl"
        >
          Business cards, flyers and brochures on premium stocks. Choose your
          size, paper, finish and quantity, and see the price instantly.
        </Heading>
        <div className="flex gap-4">
          <LocalizedClientLink href="/store">
            <Button variant="primary">Shop all products</Button>
          </LocalizedClientLink>
          <LocalizedClientLink href="/categories/business-cards">
            <Button variant="secondary">Business cards</Button>
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}

export default Hero
