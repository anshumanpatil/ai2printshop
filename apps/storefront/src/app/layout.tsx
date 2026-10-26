import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { STORE_NAME, STORE_TAGLINE } from "@lib/brand"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: `${STORE_NAME} | ${STORE_TAGLINE}`,
  description: STORE_TAGLINE,
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
