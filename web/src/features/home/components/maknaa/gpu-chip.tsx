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
import { useId } from 'react'

const PIN_POSITIONS = Array.from({ length: 8 }, (_, index) => 80 + index * 20)
const CORE_POSITIONS = Array.from({ length: 6 }, (_, index) => 112 + index * 14)

/**
 * Animated GPU package illustration, ported from the source design. Purely
 * decorative, so it is hidden from assistive technology.
 */
export function GpuChip() {
  const uid = useId()
  const id = (name: string) => `${name}-${uid}`

  return (
    <svg
      viewBox='0 0 300 300'
      className='h-auto w-full'
      xmlns='http://www.w3.org/2000/svg'
      role='img'
      aria-hidden='true'
      focusable='false'
    >
      <defs>
        <linearGradient id={id('chipGrad')} x1='0%' y1='0%' x2='100%' y2='100%'>
          <stop offset='0%' stopColor='#00f0ff' />
          <stop offset='50%' stopColor='#3b82f6' />
          <stop offset='100%' stopColor='#8b5cf6' />
        </linearGradient>
        <filter id={id('chipGlow')}>
          <feGaussianBlur stdDeviation='4' result='coloredBlur' />
          <feMerge>
            <feMergeNode in='coloredBlur' />
            <feMergeNode in='SourceGraphic' />
          </feMerge>
        </filter>
      </defs>

      <rect
        x='60'
        y='60'
        width='180'
        height='180'
        rx='12'
        fill='rgba(255,255,255,0.02)'
        stroke='rgba(255,255,255,0.15)'
        strokeWidth='1.5'
      />

      {PIN_POSITIONS.map((position) => (
        <g key={position}>
          <rect
            x={position}
            y='55'
            width='12'
            height='10'
            rx='2'
            fill='rgba(255,255,255,0.08)'
          />
          <rect
            x={position}
            y='235'
            width='12'
            height='10'
            rx='2'
            fill='rgba(255,255,255,0.08)'
          />
          <rect
            x='55'
            y={position}
            width='10'
            height='12'
            rx='2'
            fill='rgba(255,255,255,0.08)'
          />
          <rect
            x='235'
            y={position}
            width='10'
            height='12'
            rx='2'
            fill='rgba(255,255,255,0.08)'
          />
        </g>
      ))}

      <rect
        x='100'
        y='100'
        width='100'
        height='100'
        rx='8'
        fill='rgba(255,255,255,0.04)'
        stroke={`url(#${id('chipGrad')})`}
        strokeWidth='1.5'
        filter={`url(#${id('chipGlow')})`}
      />

      {CORE_POSITIONS.map((y, row) =>
        CORE_POSITIONS.map((x, col) => (
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width='8'
            height='8'
            rx='2'
            fill={`url(#${id('chipGrad')})`}
            opacity='0.3'
          >
            <animate
              attributeName='opacity'
              values='0.15;0.5;0.15'
              dur='2s'
              begin={`${row * 0.15 + col * 0.1}s`}
              repeatCount='indefinite'
            />
          </rect>
        ))
      )}

      <circle cx='100' cy='100' r='3' fill='#00f0ff' opacity='0.6' />
    </svg>
  )
}
