// Terms & Conditions and Privacy Policy text. Generated from the reviewed documents.
// Do NOT write your own business details here — fill them in legalConfig.js.
import { LEGAL } from './legalConfig';

const FALLBACK = {
  legalName: '[legal name — to be added]', address: '[business address — to be added]',
  supportEmail: '[support email — to be added]', privacyEmail: '[privacy email — to be added]',
  grievanceOfficer: '[grievance officer name — to be added]',
};

// Replaces {tokens} with the values from legalConfig.js.
export const fill = (s) => String(s).replace(/\{(\w+)\}/g, (m, k) => {
  const v = LEGAL[k];
  return (v === undefined || v === null || v === '') ? (FALLBACK[k] || m) : String(v);
});

// Splits a string on **bold** markers: [{ s: 'text', b: true|false }, ...]
export const segments = (s) => fill(s).split('**').map((p, i) => ({ s: p, b: i % 2 === 1 })).filter(x => x.s);

export const TERMS = {
 "title": "Terms & Conditions",
 "sections": [
  {
   "n": 1,
   "title": "Introduction",
   "blocks": [
    {
     "t": "p",
     "x": "These Terms & Conditions (“Terms”) govern access to and use of the Instant Worker website, mobile application, and associated services (“Platform”)."
    },
    {
     "t": "p",
     "x": "Instant Worker is operated by **{legalName}**, having its business address at **{address}** (“Instant Worker”, “we”, “us”, or “our”)."
    },
    {
     "t": "p",
     "x": "The Platform enables workers to discover work opportunities and allows employers, builders, contractors, businesses, and other job posters to find workers."
    },
    {
     "t": "p",
     "x": "By accessing or using the Platform, you agree to these Terms and our Privacy Policy. If you do not agree, you must stop using the Platform."
    }
   ]
  },
  {
   "n": 2,
   "title": "Definitions",
   "blocks": [
    {
     "t": "ul",
     "items": [
      "**Platform:** The Instant Worker website, mobile application, and related digital services.",
      "**User:** Any person accessing or using the Platform.",
      "**Worker:** A person using the Platform to find or apply for work.",
      "**Employer:** A person, business, builder, contractor, or organisation seeking workers.",
      "**Job Listing:** A work opportunity published on the Platform.",
      "**User Content:** Information, photographs, descriptions, job listings, messages, reviews, or other material submitted by users.",
      "**Start Code:** A 4-digit code shown to a Worker in the app that the Employer enters before work begins (Section 9).",
      "**Payment Code:** A code shown to a Worker in the app that the Employer enters to confirm that the Worker has been paid (Section 9).",
      "**Team Leader:** A Worker who applies for a Job Listing on behalf of a group of workers (Section 8).",
      "**Subscription:** The optional paid plan described in Section 12.",
      "**Premium Worker:** A Worker who currently has an active Subscription, or access to one granted by us."
     ]
    }
   ]
  },
  {
   "n": 3,
   "title": "Nature of the Platform",
   "blocks": [
    {
     "t": "p",
     "x": "Instant Worker provides a digital platform to facilitate connections between workers and employers."
    },
    {
     "t": "p",
     "x": "Depending on available features, users may create profiles, publish jobs, discover work opportunities, submit applications, and communicate with other users."
    },
    {
     "t": "p",
     "x": "Unless expressly agreed otherwise, Instant Worker does not itself hire workers to perform jobs listed by users and is not a party to work agreements entered into directly between users."
    },
    {
     "t": "p",
     "x": "The actual legal relationship between Instant Worker, workers, and employers depends on the circumstances and applicable law, not merely on the description in these Terms."
    }
   ]
  },
  {
   "n": 4,
   "title": "Eligibility and Registration",
   "blocks": [
    {
     "t": "p",
     "x": "You must be at least 18 years of age and otherwise legally eligible to enter into a binding agreement and to perform or offer the relevant work."
    },
    {
     "t": "p",
     "x": "Users agree to:"
    },
    {
     "t": "ul",
     "items": [
      "Provide accurate and current information.",
      "Register using their own mobile number and verify it with the one-time password (OTP) sent to it.",
      "Use their own accounts and not impersonate others or operate more than one account for the same person without our permission.",
      "Keep their contact details updated.",
      "Protect account credentials and report unauthorised access.",
      "Provide truthful information about their skills, experience, business, and job opportunities."
     ]
    },
    {
     "t": "p",
     "x": "Instant Worker may request reasonable verification where appropriate (for example, an ID document). Any verification performed will be described accurately."
    }
   ]
  },
  {
   "n": 5,
   "title": "Worker Responsibilities",
   "blocks": [
    {
     "t": "p",
     "x": "Workers agree to:"
    },
    {
     "t": "ul",
     "items": [
      "Provide truthful information about their skills, experience, availability, and qualifications.",
      "Review job details before applying or accepting work.",
      "Discuss wages, working hours, duties, work location, and payment arrangements directly with employers.",
      "Complete any training videos that the Platform requires before using its features (Section 10).",
      "Share their Start Code and Payment Code only with the Employer they are actually working for, and only when the corresponding event has truly happened (work is starting; payment has been received).",
      "Follow applicable safety requirements and lawful workplace instructions.",
      "Treat employers, customers, and other users respectfully.",
      "Avoid fraudulent applications, forged documents, harassment, threats, and unlawful conduct.",
      "Report suspicious job listings, exploitation, unsafe conditions, and suspected fraud."
     ]
    },
    {
     "t": "p",
     "x": "Nothing in these Terms waives workers' statutory rights."
    }
   ]
  },
  {
   "n": 6,
   "title": "Employer Responsibilities",
   "blocks": [
    {
     "t": "p",
     "x": "Employers, builders, contractors, and job posters agree to:"
    },
    {
     "t": "ul",
     "items": [
      "Provide genuine and accurate job listings.",
      "Disclose relevant duties, wages, work location, hours, number of workers needed, and material conditions.",
      "Agree on payment terms directly with workers before work begins.",
      "Pay agreed wages in accordance with applicable law, and enter the Payment Code promptly once payment has been made.",
      "Complete any training videos that the Platform requires before using its features (Section 10).",
      "Comply with applicable labour, wage, workplace-safety, social-security, and employment requirements.",
      "Provide a reasonably safe working environment and appropriate protective equipment where required.",
      "Avoid discrimination, harassment, forced labour, trafficking, and fraudulent recruitment.",
      "Avoid unlawful recruitment charges or deposits.",
      "Use workers' personal information only for lawful and disclosed purposes."
     ]
    },
    {
     "t": "p",
     "x": "Employers remain responsible for obligations that applicable law places upon them."
    }
   ]
  },
  {
   "n": 7,
   "title": "Job Listings and Verification",
   "blocks": [
    {
     "t": "p",
     "x": "Employers are responsible for the accuracy and legality of their listings."
    },
    {
     "t": "p",
     "x": "Instant Worker may remove, restrict, or reject listings that reasonably appear fraudulent, misleading, unlawful, unsafe, or inconsistent with these Terms."
    },
    {
     "t": "p",
     "x": "Any verification or moderation process is not a guarantee that every user, job, workplace, or statement is genuine or risk-free."
    },
    {
     "t": "p",
     "x": "Users should independently confirm job details and the identity of the person offering work before entering into an arrangement."
    }
   ]
  },
  {
   "n": 8,
   "title": "Job Lifecycle, Applications, and Teams",
   "blocks": [
    {
     "t": "p",
     "x": "**Listing period.** A Job Listing is shown to workers for 4 days after it is posted. After that it is hidden and no longer accepts applications. Work that has already been accepted is not affected."
    },
    {
     "t": "p",
     "x": "**Applications and acceptance.** Workers apply to a Job Listing; the Employer may accept or reject each applicant. A listing may need more than one worker. Some listings may use automatic acceptance where the Employer has chosen it."
    },
    {
     "t": "p",
     "x": "**Automatic rejection.** When the number of workers the Employer needs has been accepted, the remaining pending applications are automatically marked as not selected, and those workers are notified."
    },
    {
     "t": "p",
     "x": "**Teams.** A Team Leader may apply on behalf of a team and state the team size. If accepted, the team fills that many places on the job. The Team Leader is responsible for the accuracy of the team size, for confirming that each team member is eligible and willing to do the work, and for the arrangements between the Team Leader and the team members, including how wages are shared. Instant Worker is not a party to those arrangements."
    },
    {
     "t": "p",
     "x": "**Starting and completing work.** Work is marked as started and completed through the app by the Employer, subject to Section 9."
    }
   ]
  },
  {
   "n": 9,
   "title": "Start Code, Payment Code, and Posting Limits",
   "blocks": [
    {
     "t": "p",
     "x": "**Purpose.** The Start Code helps confirm that the Worker and Employer have met before work begins. The Payment Code helps confirm that the Worker has received the agreed payment after work is completed. They are record-keeping and trust features only."
    },
    {
     "t": "p",
     "x": "**Not payment processing.** Entering a Payment Code is not a payment, does not move money, and is not a guarantee, receipt, or legal proof of the amount paid. Wages are paid directly between the Worker and Employer (Section 13)."
    },
    {
     "t": "p",
     "x": "**Codes.** Codes are personal to the Worker and must not be shared with anyone other than the Employer concerned. After 5 wrong attempts the entry is locked for 15 minutes."
    },
    {
     "t": "p",
     "x": "**Unconfirmed payments.** If an Employer has completed work for which the Payment Code has not been entered, the Employer may still post new jobs, but only up to **4** new Job Listings while any Payment Code remains unentered. After that, new posting is paused until the code is entered or the matter is resolved. Our support team may review a disputed or stuck payment, record its outcome, and lift this pause where appropriate."
    },
    {
     "t": "p",
     "x": "**Our discretion.** We may change these limits to prevent misuse, and will update these Terms when we do."
    }
   ]
  },
  {
   "n": 10,
   "title": "Required Training",
   "blocks": [
    {
     "t": "p",
     "x": "We may require Workers and Employers to watch short training videos uploaded by us (for example, on safety, conduct, or how to use the Platform) before they can use the main features of the app. Completing a video is recorded against your account. Training is informational and does not replace professional safety training or legal advice."
    }
   ]
  },
  {
   "n": 11,
   "title": "Zero-Commission Policy",
   "blocks": [
    {
     "t": "p",
     "x": "Instant Worker operates as a **zero-commission platform** for wages."
    },
    {
     "t": "ul",
     "items": [
      "Instant Worker does not charge platform commission on wages.",
      "Instant Worker does not charge booking fees or cancellation fees.",
      "Instant Worker does not collect or retain wages.",
      "Instant Worker does not transfer or distribute wages between workers and employers.",
      "Posting jobs and applying for work are free."
     ]
    },
    {
     "t": "p",
     "x": "The only paid feature at present is the **optional Worker Subscription** described in Section 12. Employers are not charged a Subscription fee at this time."
    },
    {
     "t": "p",
     "x": "If other fees or paid features are introduced in the future, the applicable charges and conditions will be disclosed before they apply, and any required consent will be obtained."
    }
   ]
  },
  {
   "n": 12,
   "title": "Optional Worker Subscription",
   "blocks": [
    {
     "t": "p",
     "x": "**12.1 What it is.** The Subscription is an optional paid plan for Workers. Its benefits, as of the date of these Terms, are:"
    },
    {
     "t": "ul",
     "items": [
      "Earlier access to new Job Listings (regular and urgent) than Workers without a Subscription.",
      "Earlier job notifications; urgent-job alerts are sent first to Premium Workers.",
      "Premium Workers may be shown ahead of other Workers in worker search results and in an Employer's list of applicants, and may be marked with a “Premium” label."
     ]
    },
    {
     "t": "p",
     "x": "Workers without a Subscription can still view and apply for jobs, but may see new jobs after a delay that we set (this delay is set by us and may change). The Subscription does not guarantee that you will receive any job, interview, selection, or any level of income, and does not change any Employer's right to choose any applicant."
    },
    {
     "t": "p",
     "x": "**12.2 Switch on/off.** We control whether the Subscription system is active. While it is switched off, all Workers receive jobs at the same time and no Subscription charges are made. If we switch it off, {switchOffRule}."
    },
    {
     "t": "p",
     "x": "**12.3 Plans and price.** Available plans, their billing periods (1, 3, 6 or 12 months), and prices are shown in the app and website before you subscribe. Prices are in Indian Rupees and {gstText} applicable taxes, including GST where applicable. The price that applies to you is the price shown at the time you subscribe."
    },
    {
     "t": "p",
     "x": "**12.4 Payment.** Subscription payments are processed by our payment partner, Razorpay, and are subject to Razorpay's terms and your bank's or payment provider's rules. We do not receive or store your card, UPI, or bank account details; we keep only the plan, status, dates, and Razorpay reference identifiers needed to manage your Subscription."
    },
    {
     "t": "p",
     "x": "**12.5 Automatic renewal.** A Subscription renews automatically at the end of each billing period and the plan price is charged to the payment method you authorised, until you cancel. You will receive pre-debit notifications as required by the rules of your bank or payment provider. By subscribing you authorise these recurring charges."
    },
    {
     "t": "p",
     "x": "**12.6 Cancelling.** You can cancel at any time from the Subscription screen in the app or website. Cancelling stops future renewals. Your benefits continue until the end of the billing period you have already paid for, after which your account returns to the standard (non-Premium) experience."
    },
    {
     "t": "p",
     "x": "**12.7 Failed payments.** If a renewal payment fails, your Subscription may lapse and your account will return to the standard experience."
    },
    {
     "t": "p",
     "x": "**12.8 Refunds.** Subscription fees are charged for access during the billing period and are not refundable for the part of the period already used, except where a charge was made in error, was duplicated, or where applicable law requires a refund. Please contact us within {refundDays} days of the charge at {supportEmail}."
    },
    {
     "t": "p",
     "x": "**12.9 Changes.** We may change plan prices or benefits. Changes will not affect the period you have already paid for. We will give you at least {noticeDays} days' notice before a price increase applies to your renewal, and you may cancel before it takes effect."
    },
    {
     "t": "p",
     "x": "**12.10 Complimentary access.** We may grant or withdraw free Subscription access at our discretion (for example, for promotions or to resolve a complaint). Complimentary access is not a purchase and carries no refund."
    },
    {
     "t": "p",
     "x": "**12.11 Misuse.** Sharing an account, buying a Subscription for someone else without their knowledge, using false payment details, or manipulating the Platform to benefit from Premium features may lead to suspension under Section 23, subject to applicable law."
    },
    {
     "t": "p",
     "x": "**12.12 Consumer rights.** Nothing in this Section limits any right you have under applicable consumer-protection law."
    }
   ]
  },
  {
   "n": 13,
   "title": "Direct Payments Between Workers and Employers",
   "blocks": [
    {
     "t": "p",
     "x": "All payments for work are arranged and made directly between the relevant worker and employer, outside the Platform."
    },
    {
     "t": "p",
     "x": "Workers and employers are responsible for agreeing on wages, payment dates, payment methods, advances, deductions where lawful, and any other financial arrangements."
    },
    {
     "t": "p",
     "x": "Instant Worker does not guarantee that an employer will pay a worker or that a worker will complete agreed work."
    },
    {
     "t": "p",
     "x": "Instant Worker does not maintain an escrow service, wage-distribution system, or payment-processing service for wages under its current business model. The “Wallet” and “History” sections of the Platform are only a record of earnings and payments that users have confirmed through the app (including by Payment Code); they do not hold money and are not a bank account or a payment instrument."
    },
    {
     "t": "p",
     "x": "Disputes about unpaid wages or other direct payments should be raised with the relevant party and, where necessary, the appropriate legal authority. Our support team may help review a dispute, but cannot compel payment."
    },
    {
     "t": "p",
     "x": "Nothing in this section excludes any payment-related obligation that applicable law may impose on Instant Worker."
    }
   ]
  },
  {
   "n": 14,
   "title": "Cancellations and Changes to Work",
   "blocks": [
    {
     "t": "p",
     "x": "Instant Worker does not charge users a platform cancellation fee."
    },
    {
     "t": "p",
     "x": "Workers and employers should communicate promptly about changes in availability, cancellations, work duration, or agreed conditions."
    },
    {
     "t": "p",
     "x": "Any separate cancellation arrangement between a worker and employer must be agreed directly and must comply with applicable law."
    }
   ]
  },
  {
   "n": 15,
   "title": "Workplace Accidents, Injury, Illness, and Insurance",
   "blocks": [
    {
     "t": "p",
     "x": "Instant Worker currently does not provide accident insurance, health insurance, medical coverage, or a dedicated accident-compensation benefit through the Platform. A Subscription does not include any insurance or compensation."
    },
    {
     "t": "p",
     "x": "Users must not assume that workers are insured by Instant Worker merely because they use the Platform."
    },
    {
     "t": "p",
     "x": "To the extent permitted by law, Instant Worker is not responsible for medical expenses, injury, illness, disability, death, or loss of earnings arising from work arrangements directly entered into between users, except where responsibility legally rests with Instant Worker."
    },
    {
     "t": "p",
     "x": "Employers and workers should discuss workplace risks, safety precautions, protective equipment, emergency procedures, and applicable insurance before work begins."
    },
    {
     "t": "p",
     "x": "Employers remain responsible for workplace safety and for compensation, insurance, medical assistance, and other obligations imposed upon them by applicable law."
    },
    {
     "t": "p",
     "x": "Instant Worker does not exclude liability for its own acts or omissions where such liability cannot legally be excluded."
    },
    {
     "t": "p",
     "x": "Users should contact emergency services immediately in an emergency."
    }
   ]
  },
  {
   "n": 16,
   "title": "User Conduct and Prohibited Activities",
   "blocks": [
    {
     "t": "p",
     "x": "Users must not:"
    },
    {
     "t": "ul",
     "items": [
      "Publish fake jobs or misleading job information.",
      "Impersonate other people or submit forged documents.",
      "Engage in unlawful discrimination, harassment, threats, trafficking, or forced labour.",
      "Request unlawful fees or deposits from workers.",
      "Enter a Start Code or Payment Code falsely, or share codes with the purpose of defeating the Platform's checks.",
      "Misuse, sell, or unlawfully disclose another user's personal information.",
      "Upload malware or attempt unauthorised access.",
      "Interfere with the security or operation of the Platform.",
      "Scrape user information unlawfully.",
      "Infringe intellectual property rights.",
      "Post fake, paid-for, or retaliatory reviews or ratings.",
      "Use the Platform for unlawful activities."
     ]
    }
   ]
  },
  {
   "n": 17,
   "title": "Ratings and Reviews",
   "blocks": [
    {
     "t": "p",
     "x": "After work, workers and employers may rate each other and leave a comment. Ratings must reflect your honest experience. You may edit a rating you gave within 5 hours of posting it; after that it cannot be changed. We may remove ratings or comments that are abusive, unlawful, fake, or that breach these Terms. Ratings are visible to other users and contribute to a user's displayed average."
    }
   ]
  },
  {
   "n": 18,
   "title": "Messages, Calls, and Location Sharing",
   "blocks": [
    {
     "t": "p",
     "x": "**Messages and calls.** Chat (text, voice messages, photos, and video) and calling features are provided so that workers and employers can discuss accepted work. Contact details are shared between the two parties only to the extent the feature allows, and chat and call access for a job closes when that job is finished. Do not use messages for harassment, fraud, or unlawful content."
    },
    {
     "t": "p",
     "x": "**Location.** Workers' stored location is used to show nearby jobs and to let employers find nearby workers; employers' job locations are shown to workers. While work is in progress, a Worker may share live location with the Employer for that job through the Track feature. Location features work only with your device permission, which you can withdraw in your phone settings (some features will then not work)."
    },
    {
     "t": "p",
     "x": "**Notifications.** The Platform sends push notifications about jobs, applications, messages, and your account. You can turn them off in your phone settings."
    },
    {
     "t": "p",
     "x": "**Language and voice.** The app can display text in English, Hindi, and Telugu and can read text aloud. Translations and spoken text are automated and may contain errors; they are not a substitute for confirming important details directly."
    }
   ]
  },
  {
   "n": 19,
   "title": "User Content and Intellectual Property",
   "blocks": [
    {
     "t": "p",
     "x": "Users retain rights they lawfully hold in the content they submit."
    },
    {
     "t": "p",
     "x": "By submitting content, users grant Instant Worker a non-exclusive, royalty-free licence to host, store, reproduce, display, and process that content as reasonably necessary to operate, secure, and improve the Platform, subject to applicable law and the Privacy Policy."
    },
    {
     "t": "p",
     "x": "Users confirm that they have the necessary rights and permissions to submit their content."
    },
    {
     "t": "p",
     "x": "Instant Worker's name, branding, software, design, training videos, and other protected materials belong to their respective owners. Users must not commercially exploit such materials without appropriate permission."
    }
   ]
  },
  {
   "n": 20,
   "title": "Privacy and Personal Information",
   "blocks": [
    {
     "t": "p",
     "x": "Personal information is handled in accordance with the Instant Worker Privacy Policy and applicable law."
    },
    {
     "t": "p",
     "x": "Users must not misuse or unlawfully disclose information obtained through the Platform."
    },
    {
     "t": "p",
     "x": "The Privacy Policy explains what information may be collected, why it is processed, how it may be shared, and how users may submit privacy requests."
    }
   ]
  },
  {
   "n": 21,
   "title": "Third-Party Services",
   "blocks": [
    {
     "t": "p",
     "x": "The Platform relies on third-party hosting, database, media storage, messaging (OTP and push notification), payment, mapping, translation, voice, and analytics or technical services. These include, at the date of these Terms, Render, MongoDB Atlas, Cloudinary, MSG91, Expo / Google Firebase Cloud Messaging, Razorpay, Google Maps, and Google (text-to-speech)."
    },
    {
     "t": "p",
     "x": "Third-party services may be subject to their own terms and privacy policies."
    },
    {
     "t": "p",
     "x": "Instant Worker remains responsible for obligations imposed on it by applicable law."
    }
   ]
  },
  {
   "n": 22,
   "title": "Complaints, Fraud, and Disputes",
   "blocks": [
    {
     "t": "p",
     "x": "Users may report fake jobs, suspicious accounts, harassment, privacy concerns, or other misuse through the in-app report/block feature or the contact details provided below."
    },
    {
     "t": "p",
     "x": "Instant Worker may review reports, request relevant information, restrict accounts, or remove listings where appropriate."
    },
    {
     "t": "p",
     "x": "Instant Worker does not guarantee that it can resolve every dispute between workers and employers. Users retain access to remedies available under applicable law."
    }
   ]
  },
  {
   "n": 23,
   "title": "Account Suspension and Termination",
   "blocks": [
    {
     "t": "p",
     "x": "Instant Worker may restrict, suspend, or terminate accounts for fraud, unlawful activity, material violations of these Terms, security concerns, or other legitimate reasons, subject to applicable law."
    },
    {
     "t": "p",
     "x": "Where appropriate and legally required, users will be informed of the reason and available complaint or review process."
    },
    {
     "t": "p",
     "x": "Users may stop using the Platform and request account closure through the available account or support process. Closing an account does not by itself cancel a paid Subscription — cancel it first (Section 12.6)."
    }
   ]
  },
  {
   "n": 24,
   "title": "Platform Availability",
   "blocks": [
    {
     "t": "p",
     "x": "Instant Worker will take reasonable steps to maintain the Platform. Temporary interruptions may occur due to maintenance, network failures, security incidents, or technical issues."
    },
    {
     "t": "p",
     "x": "To the extent permitted by law, Instant Worker does not guarantee uninterrupted or error-free availability."
    }
   ]
  },
  {
   "n": 25,
   "title": "Disclaimers and Limitation of Liability",
   "blocks": [
    {
     "t": "p",
     "x": "Information provided by users may be incomplete or inaccurate. Instant Worker does not guarantee that every user, job listing, employer, or worker has been independently verified."
    },
    {
     "t": "p",
     "x": "To the extent permitted by applicable law, Instant Worker is not responsible for independent acts or omissions of users, direct payment disputes, or work arrangements between users, except to the extent responsibility legally rests with Instant Worker."
    },
    {
     "t": "p",
     "x": "Nothing in these Terms excludes or limits liability where prohibited by law, including any applicable non-waivable duties or rights."
    }
   ]
  },
  {
   "n": 26,
   "title": "Indemnity",
   "blocks": [
    {
     "t": "p",
     "x": "To the extent permitted by law, users may be responsible for reasonable losses or claims arising from their unlawful conduct, material misrepresentation, infringement of third-party rights, or material breach of these Terms."
    },
    {
     "t": "p",
     "x": "This section does not transfer legal obligations to a party that is not responsible for them or exclude liability that cannot legally be excluded."
    }
   ]
  },
  {
   "n": 27,
   "title": "Changes to These Terms",
   "blocks": [
    {
     "t": "p",
     "x": "Instant Worker may update these Terms to reflect changes in the Platform, business model, or legal requirements."
    },
    {
     "t": "p",
     "x": "Updated Terms will be published with a revised date. Material changes (including changes to Subscription prices or benefits) will be communicated and additional consent obtained where required by law."
    }
   ]
  },
  {
   "n": 28,
   "title": "Governing Law and Dispute Resolution",
   "blocks": [
    {
     "t": "p",
     "x": "These Terms are governed by the laws of India, subject to applicable mandatory legal protections."
    },
    {
     "t": "p",
     "x": "Disputes may be addressed through the procedures and remedies available under applicable law. Any additional jurisdiction or arbitration clause must be reviewed for enforceability before inclusion."
    }
   ]
  },
  {
   "n": 29,
   "title": "Severability",
   "blocks": [
    {
     "t": "p",
     "x": "If any provision is found invalid or unenforceable, the remaining provisions will continue to apply to the extent permitted by law."
    }
   ]
  },
  {
   "n": 30,
   "title": "Contact and Grievance Redressal",
   "blocks": [
    {
     "t": "lines",
     "items": [
      "**Platform:** Instant Worker",
      "**Website:** https://instantworker.in",
      "**Legal Operator:** {legalName}",
      "**Support Email:** {supportEmail}",
      "**Grievance Officer:** {grievanceOfficer}",
      "**Business Address:** {address}"
     ]
    },
    {
     "t": "p",
     "x": "Complaints will be handled within applicable legal timelines. Subscription and payment complaints will be acknowledged within 48 hours and addressed within one month. These details must be accurate and monitored."
    }
   ]
  },
  {
   "n": 31,
   "title": "Entire Agreement",
   "blocks": [
    {
     "t": "p",
     "x": "These Terms and the applicable policies referenced in them govern the use of the Platform, subject to any separate written agreement and applicable law."
    }
   ]
  }
 ]
};

export const PRIVACY = {
 "title": "Privacy Policy",
 "sections": [
  {
   "n": 1,
   "title": "Introduction",
   "blocks": [
    {
     "t": "p",
     "x": "Instant Worker (“we”, “us”, or “our”) operates https://instantworker.in, the Instant Worker mobile application, and related services that connect workers with employers and job posters."
    },
    {
     "t": "p",
     "x": "This Privacy Policy explains how we collect, use, disclose, store, and protect personal information when users visit the Platform, register accounts, create profiles, publish jobs, apply for work, chat, subscribe, or contact us."
    },
    {
     "t": "lines",
     "items": [
      "**Operating entity:** {legalName}",
      "**Contact email:** {privacyEmail}"
     ]
    }
   ]
  },
  {
   "n": 2,
   "title": "Scope",
   "blocks": [
    {
     "t": "p",
     "x": "This Policy applies to workers, employers, builders, contractors, businesses, visitors, and other users of Instant Worker, on the website and in the mobile app."
    },
    {
     "t": "p",
     "x": "It should be read alongside our Terms & Conditions."
    }
   ]
  },
  {
   "n": 3,
   "title": "Information We Collect",
   "blocks": [
    {
     "t": "p",
     "x": "The information collected depends on the features you use."
    },
    {
     "t": "p",
     "x": "**A. Account information**"
    },
    {
     "t": "ul",
     "items": [
      "Name and mobile number (verified by a one-time password).",
      "Email address, if provided.",
      "Account identifier, encrypted password or authentication token, and login sessions.",
      "User type, such as worker or employer.",
      "Age, and preferred language."
     ]
    },
    {
     "t": "p",
     "x": "**B. Worker profile information**"
    },
    {
     "t": "ul",
     "items": [
      "Skills, work experience, daily wage expectation, qualifications, languages spoken, and availability (online/offline).",
      "City, area, and preferred work location.",
      "Profile photograph, portfolio photographs, or other voluntarily submitted material.",
      "Job applications, team size (if applying as a Team Leader), work history, and ratings."
     ]
    },
    {
     "t": "p",
     "x": "**C. Employer information**"
    },
    {
     "t": "ul",
     "items": [
      "Employer or business name and contact details.",
      "Job descriptions, work locations, wage information, number of workers needed, and working conditions.",
      "Applications received, decisions on applicants, and recruitment-related communications."
     ]
    },
    {
     "t": "p",
     "x": "**D. Location information**"
    },
    {
     "t": "ul",
     "items": [
      "Locations that users provide, such as preferred work areas and job locations.",
      "Device location, only if you allow it. For Workers who go “Online”, we store the device's location to show nearby jobs and to let employers find nearby workers. While work is in progress, a Worker may share live location with the Employer for that job. You can withdraw location permission in your phone settings, but nearby-job features will then not work."
     ]
    },
    {
     "t": "p",
     "x": "**E. Verification information**"
    },
    {
     "t": "ul",
     "items": [
      "If you choose to verify your identity, we process the ID type, ID number, and a photograph of the ID document you submit, and the result of the review. We collect only what is needed for the check."
     ]
    },
    {
     "t": "p",
     "x": "**F. Messages and media**"
    },
    {
     "t": "ul",
     "items": [
      "Messages you send through the app, including text, voice messages, photos, and videos, and delivery/read status. These are stored so both parties can see the conversation."
     ]
    },
    {
     "t": "p",
     "x": "**G. Work records, codes, and ratings**"
    },
    {
     "t": "ul",
     "items": [
      "Records of work started and completed, Start Codes and Payment Codes (and attempts to enter them), earnings and payment confirmations shown in “Wallet” and “History”, ratings and comments you give or receive, and training videos you have completed."
     ]
    },
    {
     "t": "p",
     "x": "**H. Subscription and payment information**"
    },
    {
     "t": "ul",
     "items": [
      "For Workers who subscribe: the plan, status, billing period dates, and Razorpay reference identifiers (such as subscription and payment IDs).",
      "Payments are processed by Razorpay. We do not receive or store your card number, UPI PIN, or bank account details.",
      "Instant Worker does not collect, hold, or transfer wages between workers and employers. If this changes, we will update this Policy before introducing such functionality."
     ]
    },
    {
     "t": "p",
     "x": "**I. Notifications and device information**"
    },
    {
     "t": "ul",
     "items": [
      "A push-notification token for your device and your language setting, so we can send notifications in your language.",
      "Technical information: IP address, device and app version, operating system, access logs, security events, crash information, and, on the website, cookies and usage information."
     ]
    },
    {
     "t": "p",
     "x": "**J. Support, reports, and blocks**"
    },
    {
     "t": "ul",
     "items": [
      "Messages, complaints, reports of other users, blocks, feedback, and records necessary to respond and investigate misuse."
     ]
    }
   ]
  },
  {
   "n": 4,
   "title": "Purposes of Processing",
   "blocks": [
    {
     "t": "p",
     "x": "We may use personal information to:"
    },
    {
     "t": "ul",
     "items": [
      "Create and manage accounts and verify your mobile number.",
      "Display worker profiles and job listings.",
      "Facilitate job discovery, applications, and acceptance.",
      "Show nearby jobs and workers, and send job notifications by distance and skill.",
      "Enable communication and, where you choose, live-location sharing between workers and employers for accepted work.",
      "Record work started/completed, confirm payments by code, and apply posting limits where codes are pending.",
      "Operate the optional Subscription: processing and managing plans, giving Premium Workers earlier access, and listing Premium Workers ahead of others.",
      "Show ratings and reviews.",
      "Provide required training videos and record completion.",
      "Perform verification where offered.",
      "Prevent fraud, impersonation, abuse, and unauthorised access.",
      "Respond to support requests and complaints.",
      "Maintain security and troubleshoot technical issues.",
      "Improve Platform performance and functionality.",
      "Comply with applicable legal requirements.",
      "Send service notifications and, where permitted, promotional communications."
     ]
    },
    {
     "t": "p",
     "x": "Personal information will be processed for disclosed and lawful purposes, with consent or another legally recognised basis as applicable."
    }
   ]
  },
  {
   "n": 5,
   "title": "How We Share Information",
   "blocks": [
    {
     "t": "p",
     "x": "Information may be shared where necessary and lawful with:"
    },
    {
     "t": "p",
     "x": "**Workers and employers:** Relevant profile information (such as name, photo, skills, experience, wage expectation, rating, and approximate distance), job details, applications, and messages are shared to facilitate recruitment and work arrangements. A phone number is shared only between a worker and employer whose job has been accepted and remains open for contact. Your exact GPS location is not shown to other users except live-location sharing you start for an accepted job. Whether you are a Premium Worker may be visible to employers."
    },
    {
     "t": "p",
     "x": "**Technology providers (processors):** The following types of provider process information on our behalf to deliver their services: hosting, database, media storage, OTP and messaging, push notifications, payments, maps, and translation or text-to-speech. At the date of this Policy these include Render (hosting), MongoDB Atlas (database), Cloudinary (photos, videos, voice messages, ID document images), MSG91 (OTP), Expo and Google Firebase Cloud Messaging (push notifications), Razorpay (Subscription payments), Google Maps (maps), and Google (text-to-speech)."
    },
    {
     "t": "p",
     "x": "**Analytics providers:** If analytics tools are used, relevant technical or usage information may be processed according to the applicable configuration and legal requirements."
    },
    {
     "t": "p",
     "x": "**Professional advisers and authorities:** Information may be disclosed to legal advisers, regulators, law-enforcement agencies, or other authorities when legally required or permitted."
    },
    {
     "t": "p",
     "x": "**Business transfers:** Information may be transferred in a merger, acquisition, restructuring, or sale, subject to applicable legal requirements."
    },
    {
     "t": "p",
     "x": "We do not sell personal information. We do not authorise third parties to use personal information obtained through Instant Worker for unrelated purposes without an appropriate legal basis."
    }
   ]
  },
  {
   "n": 6,
   "title": "Transfers Outside India",
   "blocks": [
    {
     "t": "p",
     "x": "Some of our service providers may store or process information on servers outside India. We use providers that apply appropriate security safeguards, and we will comply with any restrictions on such transfers that apply under Indian law."
    }
   ]
  },
  {
   "n": 7,
   "title": "Public Profiles and User Responsibilities",
   "blocks": [
    {
     "t": "p",
     "x": "Certain profile details or job listings may be visible to other users or the public, depending on Platform functionality. Ratings and comments are visible to other users."
    },
    {
     "t": "p",
     "x": "Users should avoid placing sensitive personal information in publicly accessible fields, in job descriptions, or in comments."
    },
    {
     "t": "p",
     "x": "Users must not copy, sell, misuse, or unlawfully disclose other users' information."
    },
    {
     "t": "p",
     "x": "Instant Worker may restrict or remove information that violates applicable law or our policies."
    }
   ]
  },
  {
   "n": 8,
   "title": "Data Retention and Deletion",
   "blocks": [
    {
     "t": "p",
     "x": "We retain personal information only for as long as reasonably necessary for the purposes disclosed, applicable legal obligations, security, and dispute resolution."
    },
    {
     "t": "p",
     "x": "Retention periods:"
    },
    {
     "t": "ul",
     "items": [
      "Account and profile data: until you delete your account, plus {deleteDays} days for processing the request.",
      "Messages and media: {messagesRetention}, or until the account is deleted.",
      "Work records, ratings, and payment-confirmation records: {recordsRetention} after the work, for dispute resolution.",
      "ID verification documents: {idRetention} after verification, then deleted.",
      "Subscription and payment references: as long as required by tax and accounting law.",
      "Security logs: {logsRetention}."
     ]
    },
    {
     "t": "p",
     "x": "When information is no longer required, we will delete it or take appropriate steps to anonymise it, subject to legal retention obligations."
    },
    {
     "t": "p",
     "x": "You may request account deletion in the app (Profile / Account) or using the contact details below. Information may need to be retained where legally required or necessary for a lawful claim or security investigation. Deleting your account does not by itself cancel a paid Subscription — cancel it first."
    }
   ]
  },
  {
   "n": 9,
   "title": "Data Security",
   "blocks": [
    {
     "t": "p",
     "x": "We use reasonable technical and organisational measures appropriate to protect personal information against unauthorised access, disclosure, alteration, loss, or misuse."
    },
    {
     "t": "p",
     "x": "Depending on our technical setup, measures include access controls, authentication, encrypted connections, secure hosting, backups, rate limiting, and monitoring."
    },
    {
     "t": "p",
     "x": "No internet-based system can be guaranteed completely secure. Where a personal data breach occurs, we will take appropriate response measures and provide notifications required by applicable law."
    }
   ]
  },
  {
   "n": 10,
   "title": "Privacy Rights and Requests",
   "blocks": [
    {
     "t": "p",
     "x": "Subject to applicable law and its commencement provisions, including the Digital Personal Data Protection Act, 2023, you may be entitled to:"
    },
    {
     "t": "ul",
     "items": [
      "Access information about your personal data and how it is processed.",
      "Correction, completion, or updating of inaccurate or incomplete information.",
      "Erasure of personal data where applicable.",
      "Withdrawal of consent where processing relies on consent.",
      "Grievance redressal, and the right to nominate another person to exercise your rights in the event of your death or incapacity.",
      "Make a complaint to the Data Protection Board of India after first using our grievance process, where the law allows."
     ]
    },
    {
     "t": "p",
     "x": "Requests may be submitted using the contact details below. We may verify the requester's identity before acting."
    },
    {
     "t": "p",
     "x": "Withdrawal of consent does not affect processing lawfully undertaken before withdrawal. It may affect features that depend on the relevant information (for example, nearby jobs depend on location)."
    }
   ]
  },
  {
   "n": 11,
   "title": "Cookies and Similar Technologies",
   "blocks": [
    {
     "t": "p",
     "x": "Our website may use essential cookies or similar technologies for account sessions, security, and functionality. The mobile app stores your login session and settings on your device for the same purposes."
    },
    {
     "t": "p",
     "x": "If analytics, advertising, or other non-essential tracking technologies are introduced, we will provide appropriate disclosures and choices as required by applicable law."
    },
    {
     "t": "p",
     "x": "Users may manage cookies through browser settings, although disabling certain cookies may affect functionality."
    }
   ]
  },
  {
   "n": 12,
   "title": "Communications and Marketing",
   "blocks": [
    {
     "t": "p",
     "x": "We may send service-related communications concerning accounts, job listings, applications, work, payments confirmations, Subscription status, security, and support — by push notification, in-app notification, SMS, or email."
    },
    {
     "t": "p",
     "x": "Promotional communications will be handled in accordance with applicable law and relevant user preferences. Where required, we will obtain consent or provide an opt-out mechanism. You can turn off push notifications in your phone settings."
    }
   ]
  },
  {
   "n": 13,
   "title": "Children's Privacy",
   "blocks": [
    {
     "t": "p",
     "x": "Instant Worker is for users aged 18 and above. We do not knowingly collect personal data of children."
    },
    {
     "t": "p",
     "x": "If we learn that a person under 18 has registered, we will take appropriate steps as legally required, which may include closing the account and deleting the data."
    }
   ]
  },
  {
   "n": 14,
   "title": "Third-Party Websites and Services",
   "blocks": [
    {
     "t": "p",
     "x": "Our Platform may link to third-party websites or services, including Razorpay's payment page. Those providers operate under their own privacy policies and terms."
    },
    {
     "t": "p",
     "x": "Users should review those policies before sharing information with third parties."
    }
   ]
  },
  {
   "n": 15,
   "title": "Changes to This Policy",
   "blocks": [
    {
     "t": "p",
     "x": "We may update this Policy to reflect changes in our data practices, Platform features, or legal obligations."
    },
    {
     "t": "p",
     "x": "The revised Policy will be published with an updated date. Material changes will be communicated and consent obtained where required by law."
    }
   ]
  },
  {
   "n": 16,
   "title": "Contact and Privacy Grievances",
   "blocks": [
    {
     "t": "p",
     "x": "For privacy questions, personal-data requests, or complaints, contact:"
    },
    {
     "t": "lines",
     "items": [
      "**Platform:** Instant Worker",
      "**Website:** https://instantworker.in",
      "**Operating Entity:** {legalName}",
      "**Privacy Email:** {privacyEmail}",
      "**Grievance Officer:** {grievanceOfficer}",
      "**Business Address:** {address}"
     ]
    },
    {
     "t": "p",
     "x": "We will handle requests and complaints within the timelines and procedures applicable under Indian law."
    }
   ]
  },
  {
   "n": 17,
   "title": "Applicable Law",
   "blocks": [
    {
     "t": "p",
     "x": "This Policy is intended to operate consistently with applicable Indian data-protection and other relevant laws, including the Digital Personal Data Protection Act, 2023, and the rules and provisions in force from time to time."
    },
    {
     "t": "p",
     "x": "Where a provision of applicable law imposes a mandatory obligation, that obligation prevails over any inconsistent statement in this Policy."
    }
   ]
  }
 ]
};

export const DOCS = { terms: TERMS, privacy: PRIVACY };