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
import { Brain, Cpu, Database, Zap, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { AnimateInView } from '@/components/animate-in-view'
import {
  MAKNAA_SECTION_IDS,
  MAKNAA_SERVICES,
  type MaknaaServiceIcon,
} from '@/features/home/maknaa-content'

import { SectionHeading } from '../section-heading'
import { SectionWrapper } from '../section-wrapper'

const SERVICE_ICONS: Record<MaknaaServiceIcon, LucideIcon> = {
  Cpu,
  Brain,
  Zap,
  Database,
}

export function MaknaaServices() {
  const { t } = useTranslation()

  return (
    <SectionWrapper id={MAKNAA_SECTION_IDS.services}>
      <AnimateInView animation='fade-up'>
        <SectionHeading
          subtitle={t(MAKNAA_SERVICES.subtitle)}
          title={t(MAKNAA_SERVICES.title)}
          className='mb-16'
        />
      </AnimateInView>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {MAKNAA_SERVICES.items.map((service, index) => {
          const Icon = SERVICE_ICONS[service.icon]
          return (
            <AnimateInView
              key={service.title}
              animation='fade-up'
              delay={index * 100}
            >
              <div className='mk-card-hover group bg-mk-bg-card hover:bg-mk-bg-card-hover hover:border-mk-cyan/20 relative h-full rounded-2xl border border-white/5 p-8 transition-all duration-300'>
                <div className='from-mk-cyan/5 absolute inset-0 rounded-2xl bg-gradient-to-br to-transparent opacity-0 transition-opacity group-hover:opacity-100' />

                <div className='relative'>
                  <div className='from-mk-cyan/20 to-mk-blue/20 group-hover:from-mk-cyan/30 group-hover:to-mk-blue/30 mb-6 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br transition-all'>
                    <Icon className='text-mk-cyan size-6' aria-hidden='true' />
                  </div>

                  <h3 className='text-mk-text-primary mb-3 text-xl font-semibold'>
                    {t(service.title)}
                  </h3>
                  <p className='text-mk-text-secondary mb-6 text-sm leading-relaxed'>
                    {t(service.description)}
                  </p>

                  <ul className='space-y-2'>
                    {service.features.map((feature) => (
                      <li
                        key={feature}
                        className='text-mk-text-secondary flex items-center gap-2 text-sm'
                      >
                        <span className='bg-mk-cyan/60 size-1.5 shrink-0 rounded-full' />
                        {t(feature)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AnimateInView>
          )
        })}
      </div>
    </SectionWrapper>
  )
}
