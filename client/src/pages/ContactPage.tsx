import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowUpRight, Check, Mail, MapPin, Phone } from 'lucide-react';
import { contactApi, officesApi, productsApi } from '../lib/api';
import { useAsync } from '../lib/useAsync';
import { cn } from '../lib/utils';
import { ease } from '../lib/motion';
import Seo from '../components/ui/Seo';
import Eyebrow from '../components/ui/Eyebrow';
import Button from '../components/ui/Button';
import PhoneField, { dialOf } from '../components/form/PhoneField';
import { Field, SelectControl } from '../components/form/Field';
import { MaskLines, Reveal } from '../components/motion/Reveal';

const TOPICS = ['quote', 'sales', 'support', 'partnerships', 'media', 'general'] as const;
type Topic = (typeof TOPICS)[number];

interface FormData { name: string; email: string; phone: string; company: string; product: string; message: string; website: string }

export default function ContactPage() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const initialTopic = (TOPICS as readonly string[]).includes(params.get('type') ?? '') ? (params.get('type') as Topic) : 'general';
  const [topic, setTopic] = useState<Topic>(initialTopic);
  const [country, setCountry] = useState('IN');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const { data: offices } = useAsync(() => officesApi.getAll(), []);
  const { data: products } = useAsync(() => productsApi.getAll(), []);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: { product: params.get('product') ?? '' },
  });
  const message = watch('message') ?? '';

  // Deep links like /contact?type=quote&product=eray-gold-100 prefill the form.
  // Re-applied once the product list has loaded — the <select> has no matching option before that.
  useEffect(() => { const p = params.get('product'); if (p && products?.some(x => x.slug === p)) setValue('product', p); }, [params, setValue, products]);

  const onSubmit = async (data: FormData) => {
    setStatus('loading');
    const productName = products?.find(p => p.slug === data.product)?.name;
    try {
      await contactApi.submit({
        name: data.name,
        email: data.email,
        phone: !data.phone ? '' : data.phone.trim().startsWith('+') ? data.phone.trim() : `${dialOf(country)} ${data.phone.trim()}`,
        company: data.company,
        department: topic,
        type: topic,
        productInterest: productName ?? '',
        subject: productName ? `${t(`contact_page.departments.${topic}`)} — ${productName}` : t(`contact_page.departments.${topic}`),
        message: data.message,
        website: data.website,
      });
      setStatus('success');
      reset({ product: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <Seo title="Contact — Sales, Quotations & Service" description="Contact Edusoft Healthcare for quotations, sales, service and partnerships. Toll free 1800-120-280-280 · info@edusofthealth.com." path="/contact" />

      <section className="bg-bg pb-section pt-[calc(var(--header-h)+3.5rem)] sm:pt-[calc(var(--header-h)+5rem)]">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          {/* Intro + direct lines */}
          <div className="lg:col-span-5">
            <Reveal><Eyebrow dot>{t('contact_page.eyebrow')}</Eyebrow></Reveal>
            <MaskLines as="h1" immediate className="mt-5 font-display text-display-lg font-medium"><span>{t('contact_page.title')}</span></MaskLines>
            <Reveal delay={0.1}><p className="lede mt-6 max-w-md">{t('contact_page.subtitle')}</p></Reveal>

            <Reveal delay={0.2} className="mt-12 space-y-px overflow-hidden rounded-lg bg-line">
              {[
                { icon: Phone, label: t('contact_page.toll_free'), value: '1800-120-280-280', href: 'tel:1800120280280' },
                { icon: Phone, label: t('contact_page.international'), value: '+91-88512-48073', href: 'tel:+918851248073' },
                { icon: Phone, label: t('contact_page.usa'), value: '+1-773-313-5065', href: 'tel:+17733135065' },
                { icon: Mail, label: t('contact_page.general_inquiries'), value: 'info@edusofthealth.com', href: 'mailto:info@edusofthealth.com' },
              ].map(({ icon: Icon, label, value, href }) => (
                <a key={href} href={href} className="group flex items-center gap-4 bg-surface px-5 py-4 transition-colors hover:bg-raised">
                  <Icon size={16} strokeWidth={1.6} aria-hidden className="text-muted" />
                  <span className="flex-1">
                    <span className="dicom block">{label}</span>
                    <span className="block font-medium tabular-nums">{value}</span>
                  </span>
                  <ArrowUpRight size={16} aria-hidden className="text-subtle transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
                </a>
              ))}
            </Reveal>

            <div className="mt-12">
              <p className="eyebrow mb-5">{t('contact_page.offices_headline')}</p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {offices?.map(o => (
                  <address key={o.id} className="not-italic">
                    <p className="flex items-center gap-2 font-medium"><MapPin size={14} aria-hidden className="text-brand" />{o.name}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{o.address}<br />{o.city}{o.postalCode ? ` ${o.postalCode}` : ''}, {o.country}</p>
                    {o.email && <a href={`mailto:${o.email}`} className="link mt-2 inline-block text-sm">{o.email}</a>}
                    {o.mapUrl && <a href={o.mapUrl} target="_blank" rel="noopener noreferrer" className="mt-1 block text-sm text-muted hover:text-fg">{t('contact_page.directions')} ↗</a>}
                  </address>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <div className="rounded-xl bg-surface p-6 shadow-hairline sm:p-10">
              <AnimatePresence mode="wait" initial={false}>
                {status === 'success' ? (
                  <motion.div key="ok" role="status" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: ease.out }}
                    className="flex min-h-[28rem] flex-col items-start justify-center">
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-success/12 text-success"><Check size={26} /></span>
                    <h2 className="mt-8 font-display text-display-sm">{t('contact_page.success_title')}</h2>
                    <p className="mt-3 max-w-md text-muted">{t('contact_page.success')}</p>
                    <Button onClick={() => setStatus('idle')} variant="secondary" className="mt-8">{t('contact_page.send_another')}</Button>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit(onSubmit)} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                    <h2 className="font-display text-display-sm">{t('contact_page.form_headline')}</h2>

                    <fieldset>
                      <legend className="field-label mb-3">{t('contact_page.step_topic')}</legend>
                      <div className="flex flex-wrap gap-2">
                        {TOPICS.map(k => (
                          <label key={k} className={cn('chip cursor-pointer has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand', topic === k && 'bg-fg text-bg shadow-none hover:text-bg')}>
                            <input type="radio" name="topic" value={k} checked={topic === k} onChange={() => setTopic(k)} className="sr-only" />
                            {t(`contact_page.departments.${k}`)}
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label={t('contact_page.name')} required error={errors.name && t('common.name_required')}>
                        <input autoComplete="name" placeholder={t('contact_page.name_placeholder')} className="control" {...register('name', { required: true, maxLength: 120 })} />
                      </Field>
                      <Field label={t('contact_page.email')} required error={errors.email && t('common.email_required')}>
                        <input type="email" autoComplete="email" inputMode="email" placeholder={t('contact_page.email_placeholder')} className="control"
                          {...register('email', { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })} />
                      </Field>

                      <PhoneField label={t('contact_page.phone')} optionalLabel={t('contact_page.optional')} country={country} onCountryChange={setCountry}
                        placeholder={t('contact_page.phone_placeholder')} {...register('phone', { maxLength: 30 })} />
                      <Field label={t('contact_page.company')} optionalLabel={t('contact_page.optional')}>
                        <input autoComplete="organization" placeholder={t('contact_page.company_placeholder')} className="control" {...register('company', { maxLength: 160 })} />
                      </Field>
                    </div>

                    <Field label={t('contact_page.product')} optionalLabel={t('contact_page.optional')}>
                      <SelectControl {...register('product')}>
                        <option value="">{t('contact_page.product_none')}</option>
                        {products?.map(p => <option key={p.slug} value={p.slug}>{p.name} — {p.categoryLabel}</option>)}
                      </SelectControl>
                    </Field>

                    <Field label={t('contact_page.message')} required error={errors.message && t('common.message_required')}
                      hint={<span className="tabular-nums">{message.length}/2000</span>}>
                      <textarea rows={6} maxLength={2000} placeholder={t('contact_page.message_placeholder')} className="control resize-y"
                        {...register('message', { required: true, validate: v => v.trim().length > 0 })} />
                    </Field>

                    {/* Honeypot — hidden from people, tempting to bots */}
                    <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                      <label>Website<input tabIndex={-1} autoComplete="off" {...register('website')} /></label>
                    </div>

                    {status === 'error' && (
                      <p role="alert" className="flex items-start gap-2 rounded-sm bg-danger/10 p-4 text-sm text-danger">
                        <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden />{t('contact_page.error')}
                      </p>
                    )}

                    <div className="flex flex-col-reverse items-start gap-5 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
                      <p className="max-w-sm text-xs text-subtle">
                        {t('contact_page.privacy_note')} <a href="/privacy" className="underline underline-offset-2 hover:text-fg">{t('contact_page.privacy_link')}</a>.
                      </p>
                      <Button type="submit" size="lg" arrow disabled={status === 'loading'}>
                        {status === 'loading' ? t('common.sending') : t('contact_page.submit')}
                      </Button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
