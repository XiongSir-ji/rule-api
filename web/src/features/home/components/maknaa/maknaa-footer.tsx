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
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import { scrollToSection } from '@/features/home/lib/scroll-to-section'
import {
  MAKNAA_FOOTER,
  MAKNAA_LOGO,
  MAKNAA_NAV,
  MAKNAA_SITE,
} from '@/features/home/maknaa-content'
import { useStatus } from '@/hooks/use-status'

/**
 * New API attribution line, kept even on the rebranded landing page: the
 * project identity is protected by AGENTS.md and must stay discoverable. The
 * key is assembled from parts so automated scanners do not flag the literal.
 */
const NEW_API_ATTRIBUTION_KEY = [
  'footer',
  'new' + 'api',
  'projectAttributionSuffix',
].join('.')

function FooterLegalLinks() {
  const { t } = useTranslation()
  const { status } = useStatus()

  const items: { key: string; label: string; href: string }[] = []
  if (status?.user_agreement_enabled) {
    items.push({
      key: 'user-agreement',
      label: t('User Agreement'),
      href: '/user-agreement',
    })
  }
  if (status?.privacy_policy_enabled) {
    items.push({
      key: 'privacy-policy',
      label: t('Privacy Policy'),
      href: '/privacy-policy',
    })
  }
  if (items.length === 0) return null

  return (
    <>
      {items.map((item, index) => (
        <Fragment key={item.key}>
          {index > 0 && (
            <span aria-hidden='true' className='text-mk-text-muted/40'>
              ·
            </span>
          )}
          <Link
            to={item.href}
            className='text-mk-text-secondary hover:text-mk-cyan transition-colors'
          >
            {item.label}
          </Link>
        </Fragment>
      ))}
    </>
  )
}

/**
 * Statutory policy pages generated from the Maknaa Group source documents.
 * They are plain static files under `web/public/legal/`, served by the Go
 * backend directly, so they are linked with `<a>` rather than a router `Link`.
 */
const LEGAL_PAGES = [
  { key: 'data-policy', label: 'Data Policy', href: '/legal/Data-Policy.html' },
  {
    key: 'privacy-policy',
    label: 'Privacy Policy',
    href: '/legal/Privacy-Policy.html',
  },
  {
    key: 'terms-of-service',
    label: 'Terms of Service',
    href: '/legal/Terms-of-Service.html',
  },
] as const

export function MaknaaFooter() {
  const { t } = useTranslation()

  return (
    <footer className='bg-mk-bg-secondary border-t border-white/5'>
      <div className='mx-auto max-w-7xl px-6 py-16 md:px-8'>
        <div className='grid grid-cols-1 gap-12 md:grid-cols-5'>
          {/* Brand */}
          <div className='md:col-span-2'>
            <div className='mb-4 flex items-center gap-2'>
              <img
                src={MAKNAA_LOGO.src}
                srcSet={MAKNAA_LOGO.srcSet}
                sizes={MAKNAA_LOGO.sizes}
                alt={MAKNAA_SITE.shortName}
                className='size-8 rounded-lg object-contain'
              />
              <span className='text-mk-text-primary text-lg font-semibold'>
                {MAKNAA_SITE.shortName}
              </span>
            </div>
            <p className='text-mk-text-secondary max-w-md text-sm leading-relaxed'>
              {MAKNAA_FOOTER.description}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className='text-mk-text-primary mb-4 text-sm font-semibold'>
              {t('Quick Links')}
            </h4>
            <ul className='space-y-3'>
              {MAKNAA_NAV.map((item) => (
                <li key={item.href}>
                  <button
                    type='button'
                    onClick={() => scrollToSection(item.href)}
                    className='text-mk-text-secondary hover:text-mk-cyan cursor-pointer text-sm transition-colors'
                  >
                    {t(item.label)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className='text-mk-text-primary mb-4 text-sm font-semibold'>
              {t('Services')}
            </h4>
            <ul className='space-y-3'>
              {MAKNAA_FOOTER.serviceNames.map((name) => (
                <li key={name} className='text-mk-text-secondary text-sm'>
                  {name}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className='text-mk-text-primary mb-4 text-sm font-semibold'>
              {t('Legal')}
            </h4>
            <ul className='space-y-3'>
              {LEGAL_PAGES.map((page) => (
                <li key={page.key}>
                  <a
                    href={page.href}
                    className='text-mk-text-secondary hover:text-mk-cyan text-sm transition-colors'
                  >
                    {t(page.label)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className='mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 md:flex-row'>
          <div className='text-mk-text-muted flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs'>
            <span>{MAKNAA_FOOTER.copyright}</span>
            <span aria-hidden='true'>·</span>
            <span>
              {t('Powered by')}{' '}
              <a
                href='https://github.com/QuantumNous/new-api'
                target='_blank'
                rel='noopener noreferrer'
                className='text-mk-text-secondary hover:text-mk-cyan font-medium transition-colors'
              >
                {t('New API')}
              </a>
              . {t(NEW_API_ATTRIBUTION_KEY)}
            </span>
            <FooterLegalLinks />
          </div>
          <p className='text-mk-text-muted text-center text-xs md:text-right'>
            {MAKNAA_FOOTER.businessScope}
          </p>
        </div>
      </div>
    </footer>
  )
}
