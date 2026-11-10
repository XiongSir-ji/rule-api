/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { MaknaaFooter } from './maknaa-footer'
import { MaknaaHeader } from './maknaa-header'
import { MaknaaAbout } from './sections/about'
import { MaknaaArchitecture } from './sections/architecture'
import { MaknaaCompliance } from './sections/compliance'
import { MaknaaContact } from './sections/contact'
import { MaknaaGpu } from './sections/gpu'
import { MaknaaHero } from './sections/hero'
import { MaknaaServices } from './sections/services'

/**
 * The MAKNAA marketing landing page that replaces the built-in MAKNAA home.
 *
 * `.mk-home` scopes the anchor scroll offset to this page only; `.mk-force-dark`
 * re-seeds the shadcn tokens for the subtree so the shared controls (language
 * switcher, profile dropdown, buttons, form inputs) render correctly on the
 * fixed dark canvas regardless of the active console theme. The landing page
 * has no light variant by design.
 */
export function MaknaaLanding() {
  return (
    <div className='mk-home mk-force-dark bg-mk-bg-primary text-mk-text-primary min-h-screen'>
      <MaknaaHeader />
      <main>
        <MaknaaHero />
        <MaknaaAbout />
        <MaknaaServices />
        <MaknaaArchitecture />
        <MaknaaGpu />
        <MaknaaCompliance />
        <MaknaaContact />
      </main>
      <MaknaaFooter />
    </div>
  )
}
