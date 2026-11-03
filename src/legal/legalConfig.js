// ═══════════════════════════════════════════════════════════════════════════
//  FILL THIS IN BEFORE YOU BUILD THE APP / DEPLOY THE WEBSITE.
//  Everything the owner must decide or provide for the Terms and Privacy Policy is here.
//  Leave a value empty ('') and the document shows a "[… — to be added]" note instead.
// ═══════════════════════════════════════════════════════════════════════════
export const LEGAL = {
  // Bump `version` whenever the Terms or Privacy Policy change in a way users must accept again.
  version: '2026-11-03',
  effectiveDate: '3 November 2026',
  lastUpdated: '3 November 2026',
  website: 'https://instantworker.in',

  // ── Who you are (REQUIRED — a lawyer / your registration papers give the exact legal name) ──
  legalName: '',            // e.g. 'Mindhuntz Digital Pvt Ltd' or your own full name if you are a sole proprietor
  address: '',              // registered business address
  supportEmail: '',         // an inbox you actually read
  privacyEmail: '',         // can be the same as supportEmail
  grievanceOfficer: '',     // name and designation, e.g. 'Rahul Kumar, Founder'

  // ── Subscription rules (defaults chosen by me — change them to what you really want) ──
  refundDays: 7,            // days after a charge in which a wrong/duplicate charge can be reported
  noticeDays: 30,           // notice before a price increase applies to a renewal
  gstText: 'include',       // 'include' or 'are exclusive of' (taxes / GST)
  switchOffRule: 'we will stop further renewals and refund the unused portion of the period already paid',

  // ── How long you keep data (defaults chosen by me). These are PROMISES to users:
  //    the app does not delete data automatically yet, so you must really do this (or change the numbers). ──
  deleteDays: 30,
  messagesRetention: '12 months after the job ends',
  recordsRetention: '3 years',
  idRetention: '90 days',
  logsRetention: '90 days',
};