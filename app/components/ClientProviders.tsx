'use client';

import { LanguageProvider, type SiteSettingsOverrides } from '../i18n/LanguageContext';

export default function ClientProviders({
  children,
  settings,
}: {
  children: React.ReactNode;
  settings?: SiteSettingsOverrides;
}) {
  return <LanguageProvider overrides={settings}>{children}</LanguageProvider>;
}
