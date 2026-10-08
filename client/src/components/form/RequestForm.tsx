import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Check } from 'lucide-react';
import { contactApi, productsApi } from '../../lib/api';
import { useAsync } from '../../lib/useAsync';
import { ease } from '../../lib/motion';
import Button from '../ui/Button';
import { Field, SelectControl } from './Field';
import PhoneField, { dialOf } from './PhoneField';

interface Values { name: string; email: string; phone: string; product: string; message: string; website: string }

/** Service / support request form (posts to /api/contact with the given type). */
export default function RequestForm({ type }: { type: 'support' | 'service' }) {
  const { t } = useTranslation();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [country, setCountry] = useState('IN');
  const { data: products } = useAsync(() => productsApi.getAll(), []);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Values>();

  const onSubmit = async (v: Values) => {
    setStatus('loading');
    const product = products?.find(p => p.slug === v.product)?.name ?? '';
    try {
      await contactApi.submit({ ...v, phone: !v.phone ? '' : v.phone.trim().startsWith('+') ? v.phone.trim() : `${dialOf(country)} ${v.phone.trim()}`, product, productInterest: product, type, subject: `${type === 'service' ? 'Service request' : 'Support request'}${product ? ` — ${product}` : ''}` });
      setStatus('success');
      reset();
    } catch { setStatus('error'); }
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === 'success' ? (
        <motion.div key="ok" role="status" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease: ease.out }} className="py-10">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-success/12 text-success"><Check size={22} /></span>
          <p className="mt-6 font-display text-2xl">{t('support_page.form_success_title')}</p>
          <p className="mt-2 text-muted">{t('support_page.form_success_body')}</p>
          <Button onClick={() => setStatus('idle')} variant="secondary" size="sm" className="mt-6">{t('support_page.form_submit_another')}</Button>
        </motion.div>
      ) : (
        <motion.form key="form" onSubmit={handleSubmit(onSubmit)} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={t('contact_page.name')} required error={errors.name && t('common.name_required')}>
              <input autoComplete="name" className="control" {...register('name', { required: true })} />
            </Field>
            <Field label={t('contact_page.email')} required error={errors.email && t('common.email_required')}>
              <input type="email" autoComplete="email" className="control" {...register('email', { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })} />
            </Field>
            <PhoneField label={t('contact_page.phone')} optionalLabel={t('common.optional')} country={country} onCountryChange={setCountry} {...register('phone')} />
            <Field label={t('support_page.form_product_label')} optionalLabel={t('common.optional')}>
              <SelectControl {...register('product')}>
                <option value="">{t('support_page.form_product_placeholder')}</option>
                {products?.map(p => <option key={p.slug} value={p.slug}>{p.name}</option>)}
              </SelectControl>
            </Field>
          </div>
          <Field label={t('support_page.form_issue_label')} required error={errors.message && t('common.message_required')}>
            <textarea rows={5} maxLength={2000} placeholder={t('support_page.form_issue_placeholder')} className="control resize-y" {...register('message', { required: true })} />
          </Field>
          <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden"><input tabIndex={-1} autoComplete="off" {...register('website')} /></div>
          {status === 'error' && <p role="alert" className="flex items-center gap-2 rounded-sm bg-danger/10 p-3 text-sm text-danger"><AlertCircle size={15} />{t('common.error')}</p>}
          <Button type="submit" arrow disabled={status === 'loading'}>{status === 'loading' ? t('common.submitting') : t('support_page.form_submit')}</Button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
