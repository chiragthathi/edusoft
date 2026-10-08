/** ISO 3166-1 alpha-2 → international dial code. Names come from Intl.DisplayNames. */
export const COUNTRIES: [iso: string, dial: string][] = [
  ['IN', '+91'], ['US', '+1'], ['NP', '+977'], ['BD', '+880'], ['LK', '+94'], ['BT', '+975'], ['MV', '+960'],
  ['PK', '+92'], ['AF', '+93'], ['MM', '+95'], ['PH', '+63'], ['SG', '+65'], ['MY', '+60'], ['ID', '+62'],
  ['TH', '+66'], ['VN', '+84'], ['KH', '+855'], ['LA', '+856'], ['CN', '+86'], ['HK', '+852'], ['TW', '+886'],
  ['JP', '+81'], ['KR', '+82'], ['MN', '+976'], ['AU', '+61'], ['NZ', '+64'],
  ['AE', '+971'], ['SA', '+966'], ['QA', '+974'], ['KW', '+965'], ['OM', '+968'], ['BH', '+973'], ['IQ', '+964'],
  ['IR', '+98'], ['JO', '+962'], ['LB', '+961'], ['IL', '+972'], ['TR', '+90'], ['EG', '+20'],
  ['KE', '+254'], ['NG', '+234'], ['GH', '+233'], ['ET', '+251'], ['TZ', '+255'], ['UG', '+256'], ['RW', '+250'],
  ['ZA', '+27'], ['ZM', '+260'], ['ZW', '+263'], ['MW', '+265'], ['MZ', '+258'], ['AO', '+244'], ['CM', '+237'],
  ['CI', '+225'], ['SN', '+221'], ['SD', '+249'], ['SO', '+252'], ['DZ', '+213'], ['MA', '+212'], ['TN', '+216'], ['LY', '+218'],
  ['GB', '+44'], ['IE', '+353'], ['FR', '+33'], ['DE', '+49'], ['IT', '+39'], ['ES', '+34'], ['PT', '+351'],
  ['NL', '+31'], ['BE', '+32'], ['CH', '+41'], ['AT', '+43'], ['SE', '+46'], ['NO', '+47'], ['DK', '+45'],
  ['FI', '+358'], ['PL', '+48'], ['CZ', '+420'], ['HU', '+36'], ['RO', '+40'], ['GR', '+30'], ['RU', '+7'], ['UA', '+380'],
  ['CA', '+1'], ['MX', '+52'], ['BR', '+55'], ['AR', '+54'], ['CL', '+56'], ['CO', '+57'], ['PE', '+51'],
  ['VE', '+58'], ['EC', '+593'], ['BO', '+591'], ['PY', '+595'], ['UY', '+598'], ['CR', '+506'], ['PA', '+507'],
  ['GT', '+502'], ['DO', '+1'], ['JM', '+1'], ['TT', '+1'],
];

/** Longest-prefix match so "+9779…" picks Nepal (+977), not India (+91). */
export function countryFromNumber(value: string): string | null {
  const digits = value.replace(/[^\d+]/g, '');
  if (!digits.startsWith('+')) return null;
  let best: [string, string] | null = null;
  for (const c of COUNTRIES) if (digits.startsWith(c[1]) && (!best || c[1].length > best[1].length)) best = c;
  return best ? best[0] : null;
}
