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
import { z } from 'zod'

import { MAKNAA_SITE } from '../maknaa-content'

/**
 * Message thrown when the browser could not reach the form backend at all.
 * Also used as the i18n key, so it must stay in `static-keys.ts`.
 */
export const INQUIRY_NETWORK_ERROR =
  'Network error. Please check your connection and try again.'

/**
 * Message thrown when the backend answered with a non-2xx status but no usable
 * detail. Also used as the i18n key.
 */
export const INQUIRY_SEND_ERROR = 'Failed to send. Please try again later.'

export const inquiryFormSchema = z.object({
  name: z.string().trim().min(1, 'Please enter your name'),
  company: z.string().trim(),
  email: z
    .string()
    .trim()
    .min(1, 'Please enter a valid email address')
    .email('Please enter a valid email address'),
  phone: z.string().trim(),
  message: z.string().trim().min(1, 'Please describe your requirements'),
})

export type InquiryFormValues = z.infer<typeof inquiryFormSchema>

export const INQUIRY_FORM_DEFAULTS: InquiryFormValues = {
  name: '',
  company: '',
  email: '',
  phone: '',
  message: '',
}

/** Field length caps enforced in the browser via `maxLength`. */
export const INQUIRY_FIELD_MAX_LENGTH = {
  name: 100,
  company: 120,
  email: 254,
  phone: 40,
  message: 2000,
} as const

/**
 * Posts the inquiry to the configured form backend.
 *
 * Uses `fetch` rather than the project `api` client on purpose: that client is
 * bound to this gateway's origin and sends cookies, which a third-party form
 * endpoint must not receive.
 *
 * @throws Error whose message is either a backend-provided detail or one of the
 * two i18n keys above, so the caller can render it through `t()`.
 */
export async function submitInquiry(
  endpoint: string,
  values: InquiryFormValues
): Promise<void> {
  let response: Response
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        ...values,
        _subject: `[${MAKNAA_SITE.shortName} Website Inquiry] ${
          values.company || values.name
        }`,
      }),
    })
  } catch {
    throw new Error(INQUIRY_NETWORK_ERROR)
  }

  if (response.ok) return

  let detail = ''
  try {
    const data: unknown = await response.json()
    const description = (data as { error?: { description?: unknown }[] } | null)
      ?.error?.[0]?.description
    if (typeof description === 'string') detail = description.trim()
  } catch {
    // A non-JSON error body carries no detail worth surfacing.
  }

  throw new Error(detail || INQUIRY_SEND_ERROR)
}
