/**
 * Editorial copy for the Atelier story — PHASE 1 SAMPLE CONTENT.
 * Numbers and process steps are illustrative until the brand supplies facts.
 */
import type { L10n } from '@/i18n/utils';

const t = (en: string, fa: string): L10n => ({ en, fa });

export const process: { n: string; title: L10n; body: L10n }[] = [
  {
    n: '01',
    title: t('The block', 'بلوک'),
    body: t(
      'Italian cotton acetate rests for months to stabilise before a single cut is made.',
      'استات پنبه‌ای ایتالیایی ماه‌ها استراحت می‌کند تا پیش از اولین برش پایدار شود.',
    ),
  },
  {
    n: '02',
    title: t('Milling', 'برش'),
    body: t(
      'Fronts and temples are milled in several slow passes to keep the material calm.',
      'جلوی فریم و دسته‌ها در چند مرحله‌ی آهسته تراش می‌خورند تا متریال آرام بماند.',
    ),
  },
  {
    n: '03',
    title: t('Shaping', 'فرم‌دهی'),
    body: t(
      'Bevels, bridge and nose pads are shaped by hand with files and gentle heat.',
      'لبه‌ها، پل و پدهای بینی با سوهان و حرارت ملایم با دست فرم می‌گیرند.',
    ),
  },
  {
    n: '04',
    title: t('Tumbling', 'غلتاندن'),
    body: t(
      'Three days in wooden barrels with chips and pumice for a deep, even finish.',
      'سه روز درون بشکه‌های چوبی با تراشه و پوکه برای سطحی عمیق و یکدست.',
    ),
  },
  {
    n: '05',
    title: t('Polishing', 'پرداخت'),
    body: t(
      'Every edge is polished by hand on cotton wheels until it shines like glass.',
      'هر لبه روی چرخ‌های پنبه‌ای با دست پرداخت می‌شود تا مثل شیشه بدرخشد.',
    ),
  },
  {
    n: '06',
    title: t('Final check', 'کنترل نهایی'),
    body: t(
      'Aligned, adjusted and signed off by a master before it is numbered and boxed.',
      'تراز، تنظیم و تأیید توسط استادکار، پیش از شماره‌گذاری و بسته‌بندی.',
    ),
  },
];

export const numbers: { value: number; suffix?: string; label: L10n }[] = [
  { value: 42, label: t('pairs of hands per frame', 'دست برای هر فریم') },
  { value: 120, label: t('steps from block to box', 'مرحله از بلوک تا جعبه') },
  { value: 72, label: t('hours of tumbling', 'ساعت غلتاندن') },
  { value: 300, label: t('pieces per run, maximum', 'عدد حداکثر در هر تیراژ') },
];
