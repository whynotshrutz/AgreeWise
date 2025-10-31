// ============================================
// Prompt storage for risk extraction based on document category
// ============================================

window.RISK_EXTRACTION_PROMPTS = {
  // 0 — Default / General
  0: `You are a compliance extractor.
Return ONLY short factual phrases (≤10 words) for each field below.
Do not explain, justify, or paraphrase. If unknown, write "Not specified".

Fields:
- collectsPersonalData (true/false)
- sharesWithThirdParties (true/false)
- tracksForAds (true/false)
- arbitrationOrClassActionWaiver (true/false)
- autoRenewalOrSubscription (true/false)
- accountDeletionProcess (≤10 words)
- dataRetentionPeriod (≤10 words)
- jurisdictionGoverningLaw (≤5 words)
- ageRestrictions (≤5 words)
- notableOtherRisks (≤5 short items)

If ENTERPRISE_MODE:
- ipClauseConflicts
- dataResidencyMatchesUser
- storageMechanismStrength
- securityStandards
- breachNoticeWindow
- ssoSamlSupport
- subprocessorDisclosure
- ipDisputeJurisdiction
- ipDisputeMatchesUser

Return output in plain text, one line per field, no explanations.

TERMS:
`,

  // 1 — Social Media
  1: `You are a compliance extractor analyzing social media or community platform Terms.
Respond with concise factual values (≤10 words) per field.
Avoid commentary or filler. If unclear, write "Not specified".

Fields:
- collectsPersonalData (true/false)
- sharesWithThirdParties (true/false)
- tracksForAds (true/false)
- arbitrationOrClassActionWaiver (true/false)
- autoRenewalOrSubscription (true/false)
- under18HandlingAndParentalRights (≤10 words)
- prohibitedConductCoverage (≤10 words)
- accountDeletionProcess (≤10 words)
- dataRetentionPeriod (≤10 words)
- jurisdictionGoverningLaw (≤5 words)
- ageRestrictions (≤5 words)
- notableOtherRisks (≤5 short items)

If ENTERPRISE_MODE:
- ipClauseConflicts
- dataResidencyMatchesUser
- storageMechanismStrength
- securityStandards
- breachNoticeWindow
- ssoSamlSupport
- subprocessorDisclosure
- ipDisputeJurisdiction
- ipDisputeMatchesUser

Return output in plain text, one line per field, no explanations.

TERMS:
`,

  // 2 — Payment / Financial Services
  2: `You are a compliance extractor analyzing financial or payment-related Terms.
Output concise factual answers (≤10 words) for each field.
Write "Not specified" if no detail is found.

Fields:
- collectsPersonalData (true/false)
- sharesWithThirdParties (true/false)
- tracksForAds (true/false)
- arbitrationOrClassActionWaiver (true/false)
- autoRenewalOrSubscription (true/false)
- financialDataStoredAndDuration (≤10 words)
- kycAmlAndAccountFreezes (≤10 words)
- unauthorizedTransactionLiability (≤10 words)
- accountDeletionProcess (≤10 words)
- dataRetentionPeriod (≤10 words)
- jurisdictionGoverningLaw (≤5 words)
- ageRestrictions (≤5 words)
- notableOtherRisks (≤5 short items)

If ENTERPRISE_MODE:
- ipClauseConflicts
- dataResidencyMatchesUser
- storageMechanismStrength
- securityStandards
- breachNoticeWindow
- ssoSamlSupport
- subprocessorDisclosure
- ipDisputeJurisdiction
- ipDisputeMatchesUser
- pciDssCompliant
- strongCustomerAuth

Return output in plain text, one line per field, no explanations.

TERMS:
`,

  // 3 — E-commerce / Marketplace
  3: `You are a compliance extractor analyzing an e-commerce or retail platform’s Terms.
Respond with short factual outputs (≤10 words). No commentary.

Fields:
- collectsPersonalData (true/false)
- sharesWithThirdParties (true/false)
- tracksForAds (true/false)
- arbitrationOrClassActionWaiver (true/false)
- autoRenewalOrSubscription (true/false)
- warrantyDefectPolicyAndJurisdiction (≤10 words)
- buyNowPayLaterAndLateFees (≤10 words)
- accountDeletionProcess (≤10 words)
- dataRetentionPeriod (≤10 words)
- jurisdictionGoverningLaw (≤5 words)
- ageRestrictions (≤5 words)
- notableOtherRisks (≤5 short items)

If ENTERPRISE_MODE:
- ipClauseConflicts
- dataResidencyMatchesUser
- storageMechanismStrength
- securityStandards
- breachNoticeWindow
- ssoSamlSupport
- subprocessorDisclosure
- ipDisputeJurisdiction
- ipDisputeMatchesUser
- vendorDataSharingLimits
- bnplKycAmlDisclosure

Return output in plain text, one line per field, no explanations.

TERMS:
`,

  // 4 — Job / Career Platforms
  4: `You are a compliance extractor analyzing job or recruitment platform Terms.
Answer concisely (≤10 words). Use "Not specified" when unclear.

Fields:
- collectsPersonalData (true/false)
- sharesWithThirdParties (true/false)
- tracksForAds (true/false)
- arbitrationOrClassActionWaiver (true/false)
- autoRenewalOrSubscription (true/false)
- dataRetentionAfterJobClosure (≤10 words)
- accountDeletionProcess (≤10 words)
- dataRetentionPeriod (≤10 words)
- jurisdictionGoverningLaw (≤5 words)
- ageRestrictions (≤5 words)
- notableOtherRisks (≤5 short items)

If ENTERPRISE_MODE:
- ipClauseConflicts
- dataResidencyMatchesUser
- storageMechanismStrength
- securityStandards
- breachNoticeWindow
- ssoSamlSupport
- subprocessorDisclosure
- ipDisputeJurisdiction
- ipDisputeMatchesUser
- resumeAiTrainingUse
- dataExportOptions

Return output in plain text, one line per field, no explanations.

TERMS:
`
};

// Make the prompts globally accessible to content.js
if (typeof window !== 'undefined') {
  window.RISK_EXTRACTION_PROMPTS = window.RISK_EXTRACTION_PROMPTS;
}
