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
import { AnimateInView } from '@/components/animate-in-view'
import { MAKNAA_GPU, MAKNAA_SECTION_IDS } from '@/features/home/maknaa-content'
import { cn } from '@/lib/utils'

import { GpuChip } from '../gpu-chip'
import { SectionHeading } from '../section-heading'
import { SectionWrapper } from '../section-wrapper'

const BADGE_CLASS = {
  Latest: 'bg-mk-cyan/20 text-mk-cyan',
  Mainstay: 'bg-mk-blue/20 text-mk-blue',
  Enterprise: 'bg-mk-purple/20 text-mk-purple',
} as const

export function MaknaaGpu() {
  return (
    <SectionWrapper id={MAKNAA_SECTION_IDS.gpu}>
      <AnimateInView animation='fade-up'>
        <SectionHeading
          subtitle={MAKNAA_GPU.subtitle}
          title={MAKNAA_GPU.title}
          description={MAKNAA_GPU.description}
          className='mb-16'
        />
      </AnimateInView>

      <div className='grid grid-cols-1 items-center gap-12 lg:grid-cols-2'>
        <AnimateInView animation='fade-up'>
          <div className='mx-auto max-w-xs'>
            <GpuChip />
          </div>
        </AnimateInView>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          {MAKNAA_GPU.cards.map((card, index) => (
            <AnimateInView
              key={card.name}
              animation='fade-up'
              delay={index * 50}
            >
              <a
                href={MAKNAA_GPU.productPageUrl}
                target='_blank'
                rel='noopener noreferrer'
                className={cn(
                  'mk-card-hover mk-card-hover-sm mk-gpu-card group',
                  'bg-mk-bg-card hover:border-mk-cyan/20 cursor-pointer rounded-xl border border-white/5 p-5 transition-all'
                )}
              >
                <div className='mb-3 flex items-start justify-between gap-2'>
                  <span className='text-mk-text-primary font-mono text-sm font-medium'>
                    {card.name}
                  </span>
                  {card.badge && (
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-[10px] font-medium',
                        BADGE_CLASS[card.badge]
                      )}
                    >
                      {card.badge}
                    </span>
                  )}
                </div>
                <div className='text-mk-text-muted mb-1 text-xs'>
                  {card.category}
                </div>
                <div className='text-mk-text-secondary font-mono text-xs'>
                  {card.memory}
                </div>
              </a>
            </AnimateInView>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
