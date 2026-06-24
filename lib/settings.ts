import { fallbackSettings } from '@/lib/fallback-data';
import type { LandingSettings } from '@/lib/types';

export function normalizeSettings(settings: Partial<LandingSettings>): LandingSettings {
  return { ...fallbackSettings, ...settings };
}
