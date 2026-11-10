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
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createInstance } from 'i18next'
import { I18nextProvider } from 'react-i18next'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'

import { useAuthStore } from '@/stores/auth-store'

import { MaknaaHeader } from '../maknaa-header'

vi.mock('@/components/language-switcher', () => ({
  LanguageSwitcher: () => <span data-testid='language-switcher' />,
}))
vi.mock('@/components/profile-dropdown', () => ({
  ProfileDropdown: () => <span data-testid='profile-dropdown' />,
}))

const i18n = createInstance()
await i18n.init({
  lng: 'en',
  resources: { en: { translation: {} } },
  initAsync: false,
})

const rootRoute = createRootRoute()
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: MaknaaHeader,
})
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => null,
})

function resetAuth(
  user: { id: number; username: string; role: number } | null
) {
  useAuthStore.setState((state) => ({
    auth: { ...state.auth, user, accessToken: null },
  }))
}

async function renderHeader() {
  const router = createRouter({
    routeTree: rootRoute.addChildren([homeRoute, dashboardRoute]),
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })
  await router.load()
  render(
    <I18nextProvider i18n={i18n}>
      <RouterProvider router={router} />
    </I18nextProvider>
  )
}

beforeEach(() => {
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  resetAuth(null)
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  resetAuth(null)
})

it('hides the console return entry from guests', async () => {
  await renderHeader()

  expect(
    screen.queryByRole('button', { name: 'Back to Console' })
  ).not.toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Sign in' })).toHaveAttribute(
    'href',
    '/sign-in'
  )
})

it('links the console return entries to the dashboard for signed-in visitors', async () => {
  resetAuth({ id: 1, username: 'tester', role: 1 })
  await renderHeader()

  const desktopReturn = screen.getByRole('button', {
    name: 'Back to Console',
  })
  expect(desktopReturn).toHaveAttribute('href', '/dashboard')

  await userEvent.click(
    screen.getByRole('button', { name: 'Toggle navigation menu' })
  )
  const returnLinks = screen.getAllByRole('button', {
    name: 'Back to Console',
  })
  expect(returnLinks).toHaveLength(2)
  for (const link of returnLinks) {
    expect(link).toHaveAttribute('href', '/dashboard')
  }
})
