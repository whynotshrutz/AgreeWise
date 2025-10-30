// Prompt storage for risk extraction based on document category
// Categories: 0 = general/default, 1 = social media, 2 = payment, 3 = e-commerce, 4 = job/career

const RISK_EXTRACTION_PROMPTS = {
  // Default / General
  0: `Extract these fields from the Terms of Service:
- collectsPersonalData
- sharesWithThirdParties
- tracksForAds
- arbitrationOrClassActionWaiver
- autoRenewalOrSubscription
- accountDeletionProcess
- dataRetentionPeriod
- jurisdictionGoverningLaw
- ageRestrictions
- notableOtherRisks

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

TERMS:
`,

  // Social Media
  1: `Extract these fields from the platform Terms:
- collectsPersonalData
- sharesWithThirdParties
- tracksForAds
- arbitrationOrClassActionWaiver
- autoRenewalOrSubscription
- under18HandlingAndParentalRights
- prohibitedConductCoverage
- accountDeletionProcess
- dataRetentionPeriod
- jurisdictionGoverningLaw
- ageRestrictions
- notableOtherRisks

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

TERMS:
`,

  // Payment / Financial Services
  2: `Extract these fields from the Terms:
- collectsPersonalData
- sharesWithThirdParties
- tracksForAds
- arbitrationOrClassActionWaiver
- autoRenewalOrSubscription
- financialDataStoredAndDuration
- kycAmlAndAccountFreezes
- unauthorizedTransactionLiability
- accountDeletionProcess
- dataRetentionPeriod
- jurisdictionGoverningLaw
- ageRestrictions
- notableOtherRisks

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

TERMS:
`,

  // E-commerce / Marketplace
  3: `Extract these fields from the Terms:
- collectsPersonalData
- sharesWithThirdParties
- tracksForAds
- arbitrationOrClassActionWaiver
- autoRenewalOrSubscription
- warrantyDefectPolicyAndJurisdiction
- buyNowPayLaterAndLateFees
- accountDeletionProcess
- dataRetentionPeriod
- jurisdictionGoverningLaw
- ageRestrictions
- notableOtherRisks

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

TERMS:
`,

  // Job / Career Platforms
  4: `Extract these fields from the Terms:
- collectsPersonalData
- sharesWithThirdParties
- tracksForAds
- arbitrationOrClassActionWaiver
- autoRenewalOrSubscription
- dataRetentionAfterJobClosure
- accountDeletionProcess
- dataRetentionPeriod
- jurisdictionGoverningLaw
- ageRestrictions
- notableOtherRisks

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

TERMS:
`
};

// RISK_EXTRACTION_PROMPTS is globally available
