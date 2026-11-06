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
import { zodResolver } from '@hookform/resolvers/zod'
import {
  AlertCircle,
  CircleCheck,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
} from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { AnimateInView } from '@/components/animate-in-view'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  INQUIRY_FORM_DEFAULTS,
  INQUIRY_FIELD_MAX_LENGTH,
  INQUIRY_SEND_ERROR,
  inquiryFormSchema,
  submitInquiry,
  type InquiryFormValues,
} from '@/features/home/lib/inquiry-form'
import {
  MAKNAA_CONTACT,
  MAKNAA_INQUIRY_ENDPOINT,
  MAKNAA_SECTION_IDS,
} from '@/features/home/maknaa-content'
import { cn } from '@/lib/utils'

import { SectionHeading } from '../section-heading'
import { SectionWrapper } from '../section-wrapper'

/* Shared form controls re-skinned for the dark landing canvas. The `.mk-force-dark`
 * tokens already re-seed `--input`/`--ring`, so these only adjust metrics and the
 * explicit white-alpha surfaces the design calls for. */
const FIELD_CLASS =
  'h-auto bg-white/5 border-white/10 px-4 py-3 text-sm text-mk-text-primary placeholder:text-mk-text-muted focus-visible:border-mk-cyan/50'

const LABEL_CLASS = 'text-mk-text-secondary text-xs font-medium'

const INFO_ITEMS = [
  { icon: MapPin, label: 'Address', value: MAKNAA_CONTACT.info.address },
  { icon: Mail, label: 'Email', value: MAKNAA_CONTACT.info.email },
  { icon: Phone, label: 'Phone', value: MAKNAA_CONTACT.info.phone },
] as const

/**
 * Visitor inquiry form.
 *
 * Submits straight to the configured third-party form backend (see
 * `MAKNAA_INQUIRY_ENDPOINT`). When a deployment blanks that endpoint the form is
 * replaced by a mailto fallback, so inquiries never silently post to an inbox
 * this deployment does not control.
 */
export function MaknaaContact() {
  const { t } = useTranslation()
  const [sent, setSent] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const inquiryEnabled = MAKNAA_INQUIRY_ENDPOINT.length > 0

  const form = useForm<InquiryFormValues>({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues: INQUIRY_FORM_DEFAULTS,
  })
  const submitting = form.formState.isSubmitting

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError('')
    try {
      await submitInquiry(MAKNAA_INQUIRY_ENDPOINT, values)
      setSent(true)
      form.reset(INQUIRY_FORM_DEFAULTS)
    } catch (error) {
      // `submitInquiry` throws either a backend detail or one of the two i18n
      // keys; `t()` passes an unknown key (the raw detail) through unchanged.
      setSubmitError(
        error instanceof Error ? error.message : INQUIRY_SEND_ERROR
      )
    }
  })

  const mailtoHref = `mailto:${MAKNAA_CONTACT.info.email}`

  let inquiryPanel: ReactNode
  if (sent) {
    inquiryPanel = (
      <div className='bg-mk-emerald/10 border-mk-emerald/20 rounded-xl border p-8 text-center'>
        <CircleCheck
          className='text-mk-emerald mx-auto mb-4 size-10'
          aria-hidden='true'
        />
        <p className='text-mk-emerald text-lg font-medium'>
          {t('Thank you for your inquiry!')}
        </p>
        <p className='text-mk-text-secondary mt-2 text-sm'>
          {t('We will get back to you within 24 hours.')}
        </p>
      </div>
    )
  } else if (!inquiryEnabled) {
    inquiryPanel = (
      <div className='text-mk-text-secondary rounded-xl border border-white/5 p-8 text-center text-sm leading-relaxed'>
        <p className='mb-4'>
          {t('Online inquiry is not available on this deployment.')}
        </p>
        <Button
          variant='outline'
          className='border-mk-cyan/30 text-mk-cyan hover:bg-mk-cyan/5 rounded-full'
          render={<a href={mailtoHref} />}
        >
          <Mail className='size-4' aria-hidden='true' />
          {MAKNAA_CONTACT.info.email}
        </Button>
      </div>
    )
  } else {
    inquiryPanel = (
      <Form {...form}>
        <form onSubmit={onSubmit} noValidate className='space-y-4'>
          {submitError && (
            <div
              role='alert'
              className='bg-mk-danger/10 border-mk-danger/20 flex items-start gap-3 rounded-lg border p-4'
            >
              <AlertCircle
                className='text-mk-danger mt-0.5 size-[18px] shrink-0'
                aria-hidden='true'
              />
              <p className='text-mk-danger text-sm'>{t(submitError)}</p>
            </div>
          )}

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={LABEL_CLASS} required>
                    {t('Full Name')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='text'
                      autoComplete='name'
                      maxLength={INQUIRY_FIELD_MAX_LENGTH.name}
                      placeholder={t('Full Name')}
                      disabled={submitting}
                      className={FIELD_CLASS}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='company'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={LABEL_CLASS}>
                    {t('Company Name')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='text'
                      autoComplete='organization'
                      maxLength={INQUIRY_FIELD_MAX_LENGTH.company}
                      placeholder={t('Company Name')}
                      disabled={submitting}
                      className={FIELD_CLASS}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={LABEL_CLASS} required>
                    {t('Email Address')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='email'
                      autoComplete='email'
                      maxLength={INQUIRY_FIELD_MAX_LENGTH.email}
                      placeholder={t('Email Address')}
                      disabled={submitting}
                      className={FIELD_CLASS}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={LABEL_CLASS}>
                    {t('Phone Number')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='tel'
                      autoComplete='tel'
                      maxLength={INQUIRY_FIELD_MAX_LENGTH.phone}
                      placeholder={t('Phone Number')}
                      disabled={submitting}
                      className={FIELD_CLASS}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='message'
            render={({ field }) => (
              <FormItem>
                <FormLabel className={LABEL_CLASS} required>
                  {t('Describe Your Requirements')}
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={5}
                    maxLength={INQUIRY_FIELD_MAX_LENGTH.message}
                    placeholder={t('Describe Your Requirements')}
                    disabled={submitting}
                    className={cn(FIELD_CLASS, 'resize-none')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type='submit'
            disabled={submitting}
            className='from-mk-cyan to-mk-blue text-mk-bg-primary hover:shadow-mk-cyan/20 h-auto w-full rounded-full bg-gradient-to-r px-8 py-3 text-sm font-semibold transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70'
          >
            {submitting ? (
              <>
                <Loader2 className='size-4 animate-spin' aria-hidden='true' />
                {t('Sending...')}
              </>
            ) : (
              <>
                <Send className='size-4' aria-hidden='true' />
                {t('Submit Inquiry')}
              </>
            )}
          </Button>
        </form>
      </Form>
    )
  }

  return (
    <SectionWrapper id={MAKNAA_SECTION_IDS.contact}>
      <AnimateInView animation='fade-up'>
        <SectionHeading
          subtitle={MAKNAA_CONTACT.subtitle}
          title={MAKNAA_CONTACT.title}
          className='mb-16'
        />
      </AnimateInView>

      <div className='grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16'>
        <AnimateInView animation='fade-up'>
          <div className='bg-mk-bg-card h-full rounded-2xl border border-white/5 p-8'>
            <h3 className='text-mk-text-primary mb-8 text-xl font-semibold'>
              {t('Contact Information')}
            </h3>
            <div className='space-y-8'>
              {INFO_ITEMS.map((item) => (
                <div key={item.label} className='flex items-start gap-4'>
                  <div className='bg-mk-cyan/10 flex size-12 shrink-0 items-center justify-center rounded-xl'>
                    <item.icon
                      className='text-mk-cyan size-[22px]'
                      aria-hidden='true'
                    />
                  </div>
                  <div>
                    <h4 className='text-mk-text-primary mb-1 text-sm font-medium'>
                      {t(item.label)}
                    </h4>
                    <p className='text-mk-text-secondary text-sm leading-relaxed'>
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className='mt-10 border-t border-white/5 pt-8'>
              <p className='text-mk-text-muted text-sm leading-relaxed'>
                {MAKNAA_CONTACT.responseNote}
              </p>
            </div>
          </div>
        </AnimateInView>

        <AnimateInView animation='fade-up' delay={150}>
          <div className='bg-mk-bg-card h-full rounded-2xl border border-white/5 p-8'>
            <h3 className='text-mk-text-primary mb-8 text-xl font-semibold'>
              {t('Send an Inquiry')}
            </h3>
            {inquiryPanel}
          </div>
        </AnimateInView>
      </div>
    </SectionWrapper>
  )
}
