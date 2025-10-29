// Prompt storage for risk extraction based on document category
// Categories: 0 = general/default, 1 = social media, 2 = payment, 3 = e-commerce, 4 = job/career

const RISK_EXTRACTION_PROMPTS = {
  // Default/General Terms of Service
  0: `You are a compliance summarizer. Extract fields tersely from the Terms below.
- collectsPersonalData (true/false)
- sharesWithThirdParties (true/false)
- tracksForAds (true/false)
- arbitration / class-action waiver (true/false)
- autoRenewalOrSubscription (true/false)
- accountDeletionProcess (<= 20 words)
- dataRetentionPeriod (<= 15 words)
- jurisdictionGoverningLaw (<= 6 words)
- ageRestrictions (<= 8 words)
- notableOtherRisks (<= 5 short items)
If unknown, set booleans=false and strings="".

TERMS:
`,

  // Social Media Platforms
  1: `You are a compliance summarizer analyzing a social media platform's Terms of Service. Extract fields tersely, with special attention to content sharing, data collection, and user-generated content policies.
- collectsPersonalData (true/false) - including profile data, posts, connections, messages
- sharesWithThirdParties (true/false) - including ad partners, analytics, content sharing
- tracksForAds (true/false) - behavioral advertising, cross-platform tracking
- arbitration / class-action waiver (true/false)
- autoRenewalOrSubscription (true/false)
- under18HandlingAndParentalRights (<= 30 words) - under-18 handling, parental rights, parental consent requirements, proctoring tools usage
- prohibitedConductCoverage (<= 35 words) - prohibited conduct list coverage including harassment, hate speech, IP infringement, illegal content, spam, scraping, automation, unauthorized access
- accountDeletionProcess (<= 20 words) - how users can delete accounts and request data removal
- dataRetentionPeriod (<= 15 words) - how long content and data are retained after deletion
- jurisdictionGoverningLaw (<= 6 words)
- ageRestrictions (<= 8 words) - minimum age requirements, parental controls
- notableOtherRisks (<= 5 short items) - content moderation policies, account suspension, data portability
If unknown, set booleans=false and strings="".

TERMS:
`,

  // Payment/Financial Services
  2: `You are a compliance summarizer analyzing payment or financial service Terms of Service. Extract fields tersely, with special attention to financial liability, chargebacks, and payment processing.
- collectsPersonalData (true/false) - including payment information, transaction history, financial data
- sharesWithThirdParties (true/false) - including payment processors, banks, financial institutions
- tracksForAds (true/false)
- arbitration / class-action waiver (true/false) - particularly for dispute resolution and chargeback policies
- autoRenewalOrSubscription (true/false) - recurring payments, subscription terms
- financialDataStoredAndDuration (<= 25 words) - financial data stored (PAN, bank account numbers, UPI IDs, tokens), and storage duration
- kycAmlAndAccountFreezes (<= 30 words) - KYC/AML obligations; account freezes/holds; suspicious activity reporting requirements
- unauthorizedTransactionLiability (<= 25 words) - liability for unauthorized transactions; reporting window and time limits
- accountDeletionProcess (<= 20 words) - account closure procedures, remaining balance handling
- dataRetentionPeriod (<= 15 words) - transaction record retention, regulatory compliance
- jurisdictionGoverningLaw (<= 6 words)
- ageRestrictions (<= 8 words) - age requirements for financial accounts
- notableOtherRisks (<= 5 short items) - PCI compliance, tokenization, freezing account policies, suspicious activity monitoring, chargeback rights, liability limits, dispute resolution, fee structures, refund policies
If unknown, set booleans=false and strings="".

TERMS:
`,

  // E-commerce/Marketplace
  3: `You are a compliance summarizer analyzing an e-commerce or marketplace Terms of Service. Extract fields tersely, with special attention to seller/buyer obligations, return policies, and transaction terms.
- collectsPersonalData (true/false) - including purchase history, shipping addresses, payment details
- sharesWithThirdParties (true/false) - including sellers, shipping partners, payment processors
- tracksForAds (true/false) - retargeting, purchase-based advertising
- arbitration / class-action waiver (true/false) - dispute resolution for transactions
- autoRenewalOrSubscription (true/false) - subscription services, recurring orders, automatic renewal terms, cancellation policies
- warrantyDefectPolicyAndJurisdiction (<= 30 words) - warranty coverage, defect handling, repair/replacement policies, and specific jurisdiction for warranty disputes
- buyNowPayLaterAndLateFees (<= 25 words) - buy now pay later financing options, payment terms, late fee structures, interest rates, default consequences
- accountDeletionProcess (<= 20 words) - how to close accounts, handle pending orders
- dataRetentionPeriod (<= 15 words) - order history retention, customer data storage
- jurisdictionGoverningLaw (<= 6 words)
- ageRestrictions (<= 8 words) - minimum age for purchasing, age-restricted products
- notableOtherRisks (<= 5 short items) - return policies, seller responsibilities, liability limits, shipping terms
If unknown, set booleans=false and strings="".

TERMS:
`,

  // Job/Career Platforms
  4: `You are a compliance summarizer analyzing a job or career platform's Terms of Service. Extract fields tersely, with special attention to candidate data, employer access, and employment terms.
- collectsPersonalData (true/false) - including resumes, work history, salary information, references
- sharesWithThirdParties (true/false) - including employers, recruiters, background check services
- tracksForAds (true/false)
- arbitration / class-action waiver (true/false)
- autoRenewalOrSubscription (true/false) - subscription plans for job seekers or employers
- dataRetentionAfterJobClosure (<= 30 words) - data retention after job closure; deletion request path and process
- accountDeletionProcess (<= 20 words) - how to delete profiles, remove applications
- dataRetentionPeriod (<= 15 words) - how long application data and profiles are retained
- jurisdictionGoverningLaw (<= 6 words)
- ageRestrictions (<= 8 words) - minimum age for job applications, employment eligibility
- notableOtherRisks (<= 5 short items) - background check policies, data sharing with employers, profile visibility settings
If unknown, set booleans=false and strings="".

TERMS:
`
};

// RISK_EXTRACTION_PROMPTS is available globally for content.js to use

