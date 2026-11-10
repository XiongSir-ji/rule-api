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
import { Link } from '@tanstack/react-router'
import { ArrowLeft, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { LanguageSwitcher } from '@/components/language-switcher'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Button } from '@/components/ui/button'
import { scrollToSection } from '@/features/home/lib/scroll-to-section'
import {
  MAKNAA_LOGO,
  MAKNAA_NAV,
  MAKNAA_SITE,
} from '@/features/home/maknaa-content'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth-store'

const SCROLL_THRESHOLD_PX = 50

/**
 * Fixed landing header.
 *
 * Deliberately not the shared `PublicHeader`: that component renders the
 * console navigation (pricing, rankings, docs, notices) and is used by the
 * about / pricing / legal / rankings pages, so restyling it for this design
 * would change those pages too. Language and account controls are still the
 * shared ones, because the gateway has to stay reachable from the landing page.
 */
export function MaknaaHeader() {
  const { t } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const isAuthenticated = useAuthStore((s) => !!s.auth.user)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD_PX)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const handleNavClick = (href: string) => {
    setMobileOpen(false)
    scrollToSection(href)
  }

  return (
    <header className='pointer-events-none fixed inset-x-0 top-0 z-50 transition-all duration-300'>
      <div
        className={cn(
          'pointer-events-auto transition-all duration-300',
          scrolled &&
            'border-b border-white/5 bg-[rgba(10,10,15,0.85)] shadow-[0_4px_30px_rgba(0,0,0,0.3)] backdrop-blur-[20px]'
        )}
      >
        <div className='mx-auto max-w-7xl px-6 md:px-8'>
          <div className='flex h-16 items-center justify-between md:h-20'>
            <Link
              to='/'
              className='group flex items-center gap-2'
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <img
                src={MAKNAA_LOGO.src}
                srcSet={MAKNAA_LOGO.srcSet}
                sizes={MAKNAA_LOGO.sizes}
                alt={MAKNAA_SITE.shortName}
                className='size-8 rounded-lg object-contain'
              />
              <span className='text-mk-text-primary group-hover:text-mk-cyan hidden text-lg font-semibold transition-colors sm:block'>
                {MAKNAA_SITE.shortName}
              </span>
            </Link>

            <nav className='hidden items-center gap-8 md:flex'>
              {MAKNAA_NAV.map((item) => (
                <button
                  key={item.href}
                  type='button'
                  onClick={() => handleNavClick(item.href)}
                  className='text-mk-text-secondary hover:text-mk-cyan cursor-pointer text-sm transition-colors'
                >
                  {t(item.label)}
                </button>
              ))}

              <div className='text-mk-text-secondary flex items-center gap-1'>
                {isAuthenticated && (
                  <Button
                    size='sm'
                    variant='ghost'
                    className='text-mk-text-secondary hover:text-mk-cyan h-9 px-3 text-sm hover:bg-white/5'
                    render={<Link to='/dashboard' />}
                    aria-label={t('Back to Console')}
                    title={t('Back to Console')}
                  >
                    <ArrowLeft className='size-4' />
                    <span className='hidden xl:inline'>
                      {t('Back to Console')}
                    </span>
                  </Button>
                )}
                <LanguageSwitcher />
                {isAuthenticated ? (
                  <ProfileDropdown />
                ) : (
                  <Button
                    size='sm'
                    variant='ghost'
                    className='text-mk-text-secondary hover:text-mk-cyan h-9 px-3 text-sm hover:bg-white/5'
                    render={<Link to='/sign-in' />}
                  >
                    {t('Sign in')}
                  </Button>
                )}
              </div>

              <button
                type='button'
                onClick={() => handleNavClick('#maknaa-contact')}
                className='from-mk-cyan to-mk-blue text-mk-bg-primary hover:shadow-mk-cyan/20 cursor-pointer rounded-full bg-gradient-to-r px-5 py-2 text-sm font-semibold transition-all hover:shadow-lg'
              >
                {t('Get Started')}
              </button>
            </nav>

            <div className='flex items-center gap-1 md:hidden'>
              <LanguageSwitcher />
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='text-mk-text-primary size-9 hover:bg-white/5'
                onClick={() => setMobileOpen((open) => !open)}
                aria-label={t('Toggle navigation menu')}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? (
                  <X className='size-5' />
                ) : (
                  <Menu className='size-5' />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className='bg-mk-bg-secondary/95 pointer-events-auto border-t border-white/5 backdrop-blur-xl md:hidden'>
          <nav className='flex flex-col gap-4 p-6'>
            {MAKNAA_NAV.map((item) => (
              <button
                key={item.href}
                type='button'
                onClick={() => handleNavClick(item.href)}
                className='text-mk-text-secondary hover:text-mk-cyan cursor-pointer py-2 text-left text-base transition-colors'
              >
                {t(item.label)}
              </button>
            ))}
            {isAuthenticated ? (
              <Button
                variant='ghost'
                className='text-mk-text-secondary hover:text-mk-cyan justify-start gap-2 px-0 text-base hover:bg-white/5'
                render={<Link to='/dashboard' />}
                onClick={() => setMobileOpen(false)}
              >
                <ArrowLeft className='size-4' />
                {t('Back to Console')}
              </Button>
            ) : (
              <Button
                variant='ghost'
                className='text-mk-text-secondary hover:text-mk-cyan justify-start px-0 text-base hover:bg-white/5'
                render={<Link to='/sign-in' />}
                onClick={() => setMobileOpen(false)}
              >
                {t('Sign in')}
              </Button>
            )}
            <button
              type='button'
              onClick={() => handleNavClick('#maknaa-contact')}
              className='from-mk-cyan to-mk-blue text-mk-bg-primary mt-2 cursor-pointer rounded-full bg-gradient-to-r px-5 py-3 text-center text-sm font-semibold'
            >
              {t('Get Started')}
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}
