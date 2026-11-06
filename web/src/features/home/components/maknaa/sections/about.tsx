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
import {
  MAKNAA_ABOUT,
  MAKNAA_SECTION_IDS,
} from '@/features/home/maknaa-content'

import { GlobeNodes } from '../globe-nodes'
import { SectionWrapper } from '../section-wrapper'

export function MaknaaAbout() {
  return (
    <SectionWrapper id={MAKNAA_SECTION_IDS.about} background='secondary'>
      <div className='grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16'>
        <div>
          <AnimateInView>
            <p className='text-mk-cyan mb-3 text-sm font-medium tracking-wider uppercase'>
              {MAKNAA_ABOUT.subtitle}
            </p>
            <h2 className='mb-6 text-3xl font-bold md:text-4xl'>
              {MAKNAA_ABOUT.title}
            </h2>
          </AnimateInView>

          <AnimateInView delay={150}>
            <div className='text-mk-text-secondary space-y-4 leading-relaxed'>
              {MAKNAA_ABOUT.story.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </div>
          </AnimateInView>

          <AnimateInView delay={300}>
            <p className='text-mk-text-secondary mt-6 leading-relaxed'>
              {MAKNAA_ABOUT.vision}
            </p>
          </AnimateInView>
        </div>

        <AnimateInView delay={200}>
          <div className='relative'>
            <div
              aria-hidden='true'
              className='from-mk-cyan/5 to-mk-purple/5 absolute inset-0 rounded-2xl bg-gradient-to-br blur-xl'
            />
            <div className='bg-mk-bg-card relative rounded-2xl border border-white/5 p-6 backdrop-blur-sm'>
              <GlobeNodes />
            </div>
          </div>
        </AnimateInView>
      </div>

      <div className='mt-20 grid grid-cols-2 gap-6 md:grid-cols-4'>
        {MAKNAA_ABOUT.stats.map((stat, index) => (
          <AnimateInView key={stat.label} delay={index * 100}>
            <div className='mk-card-hover bg-mk-bg-card hover:border-mk-cyan/20 rounded-xl border border-white/5 p-6 text-center transition-colors'>
              <div className='from-mk-cyan to-mk-blue bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent md:text-4xl'>
                {stat.value}
                {stat.suffix}
              </div>
              <div className='text-mk-text-secondary mt-2 text-sm'>
                {stat.label}
              </div>
            </div>
          </AnimateInView>
        ))}
      </div>
    </SectionWrapper>
  )
}
