'use client';

import { LanguageProvider, type SiteSettingsOverrides } from '../i18n/LanguageContext';
import { ThemeProvider } from '../i18n/ThemeContext';

export default function ClientProviders({
  children,
  settings,
}: {
  children: React.ReactNode;
  settings?: SiteSettingsOverrides;
}) {
  return (
    <ThemeProvider>
      <LanguageProvider overrides={settings}>{children}</LanguageProvider>
    </ThemeProvider>
  );
}
