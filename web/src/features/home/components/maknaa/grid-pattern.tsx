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

/** Faint blueprint grid used as a section backdrop. Purely decorative. */
export function GridPattern() {
  const patternId = useId()

  return (
    <div
      aria-hidden='true'
      className='pointer-events-none absolute inset-0 overflow-hidden opacity-[0.03]'
    >
      <svg
        className='absolute inset-0 h-full w-full'
        xmlns='http://www.w3.org/2000/svg'
      >
        <defs>
          <pattern
            id={patternId}
            width='60'
            height='60'
            patternUnits='userSpaceOnUse'
          >
            <path
              d='M 60 0 L 0 0 0 60'
              fill='none'
              stroke='white'
              strokeWidth='1'
            />
          </pattern>
        </defs>
        <rect width='100%' height='100%' fill={`url(#${patternId})`} />
      </svg>
    </div>
  )
}
