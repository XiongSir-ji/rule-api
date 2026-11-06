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
import { Globe, Lock, Shield, type LucideIcon } from 'lucide-react'

import { AnimateInView } from '@/components/animate-in-view'
import {
  MAKNAA_COMPLIANCE,
  MAKNAA_SECTION_IDS,
  type MaknaaComplianceIcon,
} from '@/features/home/maknaa-content'

import { SectionHeading } from '../section-heading'
import { SectionWrapper } from '../section-wrapper'

const COMPLIANCE_ICONS: Record<MaknaaComplianceIcon, LucideIcon> = {
  Shield,
  Lock,
  Globe,
}

export function MaknaaCompliance() {
  return (
    <SectionWrapper id={MAKNAA_SECTION_IDS.compliance} background='secondary'>
      <AnimateInView animation='fade-up'>
        <SectionHeading
          subtitle={MAKNAA_COMPLIANCE.subtitle}
          title={MAKNAA_COMPLIANCE.title}
          accent='emerald'
          className='mb-16'
        />
      </AnimateInView>

      <div className='mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3'>
        {MAKNAA_COMPLIANCE.items.map((item, index) => {
          const Icon = COMPLIANCE_ICONS[item.icon]
          return (
            <AnimateInView
              key={item.title}
              animation='fade-up'
              delay={index * 150}
            >
              <div className='bg-mk-bg-card border-mk-emerald/10 hover:border-mk-emerald/25 h-full rounded-xl border p-8 text-center transition-colors'>
                <div className='bg-mk-emerald/10 mx-auto mb-6 flex size-14 items-center justify-center rounded-full'>
                  <Icon className='text-mk-emerald size-7' aria-hidden='true' />
                </div>
                <h3 className='text-mk-text-primary mb-3 text-lg font-semibold'>
                  {item.title}
                </h3>
                <p className='text-mk-text-secondary text-sm leading-relaxed'>
                  {item.description}
                </p>
              </div>
            </AnimateInView>
          )
        })}
      </div>
    </SectionWrapper>
  )
}
