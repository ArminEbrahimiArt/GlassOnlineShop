/**
 * Collections — PHASE 1 SAMPLE DATA.
 * The brand has real collections but no photography yet (see docs/CONTENT.md),
 * so collections without product images render an art-directed placeholder.
 */
import type { L10n } from '@/i18n/utils';

export interface Collection {
  slug: string;
  name: L10n;
  season: L10n;
  story: L10n;
  /** Tint for the placeholder artwork until photography exists */
  tone: string;
  status: 'live' | 'soon';
}

const t = (en: string, fa: string): L10n => ({ en, fa });

export const collections: Collection[] = [
  {
    slug: 'riviera',
    name: t('Riviera', 'ریویرا'),
    season: t('Spring / Summer', 'بهار / تابستان'),
    story: t(
      'Sun-washed Italian coastlines, translated into clean squares and crystal acetate.',
      'سواحل آفتابی ایتالیا، ترجمه‌شده به فرم‌های مربعی تمیز و استات کریستالی.',
    ),
    tone: '#e7e1d8',
    status: 'live',
  },
  {
    slug: 'notturno',
    name: t('Notturno', 'نوتورنو'),
    season: t('Evening edition', 'نسخه‌ی شب'),
    story: t(
      'Deep blacks and high gloss for the hours after the city switches on its lights.',
      'مشکی‌های عمیق و براق برای ساعت‌هایی که شهر چراغ‌هایش را روشن می‌کند.',
    ),
    tone: '#d9d6d2',
    status: 'live',
  },
  {
    slug: 'atelier',
    name: t('Atelier Edition', 'نسخه‌ی آتلیه'),
    season: t('Numbered pieces', 'قطعات شماره‌دار'),
    story: t(
      'Our most demanding builds: hand-set jewels, gradient lenses and runs under 200.',
      'پیچیده‌ترین ساخته‌های ما: نگین‌های دست‌نشان، لنزهای گرادیان و تیراژ کمتر از ۲۰۰.',
    ),
    tone: '#eadfd6',
    status: 'live',
  },
  {
    slug: 'monolith',
    name: t('Monolith', 'مونولیت'),
    season: t('Autumn / Winter', 'پاییز / زمستان'),
    story: t(
      'Architectural optical frames carved from a single 8 mm block.',
      'فریم‌های طبی معمارانه، تراش‌خورده از یک بلوک ۸ میلی‌متری.',
    ),
    tone: '#dedbd5',
    status: 'soon',
  },
];

export const getCollection = (slug: string) => collections.find((c) => c.slug === slug);
