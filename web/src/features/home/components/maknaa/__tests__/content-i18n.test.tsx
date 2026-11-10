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
import { act, cleanup, render, screen } from '@testing-library/react'
import { createInstance } from 'i18next'
import type { ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import { afterEach, expect, it, vi } from 'vitest'

import en from '@/i18n/locales/en.json'
import zh from '@/i18n/locales/zh.json'

import { MaknaaAbout } from '../sections/about'
import { MaknaaServices } from '../sections/services'

vi.mock('@/components/animate-in-view', () => ({
  AnimateInView: (props: { children: ReactNode }) => (
    <div>{props.children}</div>
  ),
}))
vi.mock('../globe-nodes', () => ({
  GlobeNodes: () => <div data-testid='globe-nodes' />,
}))

const i18n = createInstance()
await i18n.init({
  lng: 'zh',
  fallbackLng: 'en',
  nsSeparator: false,
  resources: { en, zh },
  initAsync: false,
})

async function renderSection(children: ReactNode) {
  render(<I18nextProvider i18n={i18n}>{children}</I18nextProvider>)
}

async function switchTo(language: string) {
  await act(async () => {
    await i18n.changeLanguage(language)
  })
}

afterEach(async () => {
  cleanup()
  await i18n.changeLanguage('zh')
})

it('renders the about section copy in the active language and updates on switch', async () => {
  await renderSection(<MaknaaAbout />)

  expect(screen.getByText('关于我们')).toBeInTheDocument()
  expect(screen.getByText('算力普惠，连接区域')).toBeInTheDocument()

  await switchTo('en')

  expect(screen.getByText('About Us')).toBeInTheDocument()
  expect(
    screen.getByText('Democratizing Compute, Bridging Regions')
  ).toBeInTheDocument()
  expect(screen.queryByText('关于我们')).not.toBeInTheDocument()
})

it('renders the services section copy in the active language and updates on switch', async () => {
  await renderSection(<MaknaaServices />)

  expect(screen.getByText('我们的服务')).toBeInTheDocument()
  expect(screen.getByText('GPU 算力租赁')).toBeInTheDocument()

  await switchTo('en')

  expect(screen.getByText('Our Services')).toBeInTheDocument()
  expect(screen.getByText('GPU Compute Leasing')).toBeInTheDocument()
})
