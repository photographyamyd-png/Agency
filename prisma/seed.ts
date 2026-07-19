import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_AGREEMENT_TERMS = `SERVICE AGREEMENT TERMS

1. Scope. Work is limited to the packages and line items listed in the attached proposal unless both parties agree in writing to a change order.

2. Payment. Deposits and retainers are due as stated on the proposal. Monthly retainers are billed in advance. Late payments may pause work until the account is current.

3. Access. You agree to provide timely access to websites, domains, hosting, analytics, and other systems required to perform the services. Delays in access may delay deliverables.

4. Revisions. Included revision rounds are listed on the proposal. Additional revisions may be billed hourly.

5. Term & cancellation. Retainers renew monthly unless cancelled with 30 days written notice. One-time project work ends at final delivery and acceptance.

6. Ownership. Upon full payment, you own the deliverables created specifically for your business. We retain ownership of our tools, frameworks, and pre-existing materials.

7. Confidentiality. Both parties will keep credentials and confidential business information secure and use them only to perform this engagement.

By signing, you confirm you are authorized to bind the business named on this proposal and accept these terms.`;

/** Profile-stage fields (packages/agreement/access are separate wizard steps). */
const DEFAULT_QUESTIONNAIRE = {
  fields: [
    {
      id: "primaryContactName",
      type: "text",
      label: "Primary contact name",
      required: true,
    },
    {
      id: "primaryContactPhone",
      type: "text",
      label: "Primary contact phone",
      required: true,
      placeholder: "(555) 555-5555",
    },
    {
      id: "billingName",
      type: "text",
      label: "Billing contact name",
      placeholder: "Same as primary if blank",
    },
    {
      id: "billingEmail",
      type: "text",
      label: "Billing email",
      placeholder: "billing@yourbusiness.com",
    },
    {
      id: "technicalContactName",
      type: "text",
      label: "Technical / IT contact name (optional)",
    },
    {
      id: "technicalContactEmail",
      type: "text",
      label: "Technical contact email (optional)",
    },
    {
      id: "streetAddress",
      type: "text",
      label: "Business street address",
      required: true,
    },
    {
      id: "city",
      type: "text",
      label: "City",
      required: true,
    },
    {
      id: "stateProvince",
      type: "text",
      label: "State / province",
      required: true,
    },
    {
      id: "postalCode",
      type: "text",
      label: "Postal / ZIP code",
      required: true,
    },
    {
      id: "industry",
      type: "text",
      label: "Industry / business type",
      required: true,
      placeholder: "e.g. HVAC, dental, law firm",
    },
    {
      id: "serviceArea",
      type: "text",
      label: "Primary service area",
      placeholder: "City or region you serve",
    },
    {
      id: "existingSiteUrl",
      type: "text",
      label: "Current website URL (if any)",
      placeholder: "https://",
    },
    {
      id: "currentHost",
      type: "text",
      label: "Current web host (if known)",
      placeholder: "e.g. GoDaddy, SiteGround, WP Engine",
    },
    {
      id: "currentRegistrar",
      type: "text",
      label: "Domain registrar (if known)",
      placeholder: "e.g. GoDaddy, Namecheap, Cloudflare",
    },
    {
      id: "socialFacebook",
      type: "text",
      label: "Facebook page URL",
      placeholder: "https://facebook.com/...",
    },
    {
      id: "socialInstagram",
      type: "text",
      label: "Instagram profile URL",
    },
    {
      id: "socialLinkedIn",
      type: "text",
      label: "LinkedIn page URL",
    },
    {
      id: "socialYelp",
      type: "text",
      label: "Yelp / other review profile URL",
    },
    {
      id: "budgetRange",
      type: "text",
      label: "Budget range",
      placeholder: "e.g. $3k–$5k, $5k–$10k",
    },
    {
      id: "timelineExpectation",
      type: "text",
      label: "When do you want to launch?",
    },
    {
      id: "hasExistingGA4",
      type: "text",
      label: "Do you already have Google Analytics set up? (yes/no)",
    },
    {
      id: "primaryKeyword",
      type: "text",
      label: "Most important keyword to rank for",
      placeholder: "e.g. emergency plumber Toronto",
    },
    {
      id: "goals",
      type: "textarea",
      label: "What does success look like in 6 months?",
      required: true,
    },
    {
      id: "serviceLines",
      type: "textarea",
      label: "Primary service lines and revenue split per service",
    },
    {
      id: "targetCities",
      type: "text",
      label: "Target cities, service radius, and priority geography",
    },
    {
      id: "avgJobValue",
      type: "text",
      label: "Average job/ticket value",
    },
    {
      id: "closeRate",
      type: "text",
      label: "Estimated close rate",
    },
    {
      id: "seasonality",
      type: "textarea",
      label: "Seasonal demand peaks and slow periods",
    },
    {
      id: "serviceCapacity",
      type: "text",
      label: "Service capacity (jobs per week)",
    },
    {
      id: "leadSources",
      type: "textarea",
      label: "Current lead sources and marketing history",
    },
    {
      id: "reputation",
      type: "textarea",
      label: "Existing reviews, ratings, and reputation situation",
    },
    {
      id: "knownCompetitors",
      type: "textarea",
      label: "Known competitors you are aware of",
    },
    {
      id: "brandVoice",
      type: "textarea",
      label: "Brand voice, preferred tone, and brand guidelines",
    },
  ],
};

async function main() {
  const existingAgency = await prisma.agencyProfile.findFirst();
  if (!existingAgency) {
    await prisma.agencyProfile.create({
      data: {
        businessName: "Amy · Web for Trades",
        tagline: "Websites & Google Maps for the trades",
        heroHeadline: "Websites and local SEO for plumbers, roofers, HVAC & contractors",
        heroSubhead:
          "I'm Amy. I build solid sites and run local SEO so when someone searches \"emergency plumber near me\" or \"roofer in [your town]\" — your business shows up and the phone rings.",
        email: "hello@youragency.com",
        methodologyName: "Local SEO Blueprint",
        methodologyVersion: "3.0",
        standardAgreementTerms: DEFAULT_AGREEMENT_TERMS,
        heroImageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1920&q=85",
        heroImageAlt: "Plumber on a service call — local trade business",
        servicesImages: {
          WEBSITE: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=85",
          SEO: "https://images.unsplash.com/photo-1621905252507-b35492ba26c8?w=1200&q=85",
          REPORTING: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=85",
        },
        resultsImages: [
          "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&q=85",
          "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=85",
        ],
      },
    });
  } else if (!existingAgency.standardAgreementTerms) {
    await prisma.agencyProfile.update({
      where: { id: existingAgency.id },
      data: { standardAgreementTerms: DEFAULT_AGREEMENT_TERMS },
    });
  }

  const template = await prisma.onboardingTemplate.upsert({
    where: { slug: "default" },
    create: {
      name: "Default client onboarding",
      slug: "default",
      isDefault: true,
      welcomeEmailSubject: "Welcome to {{businessName}} — let's get started",
      welcomeEmailBody: `Hi {{contactName}},

Thanks for reaching out! Complete your onboarding (profile, packages, agreement, and access):

{{questionnaireButton}}

<p style="margin-top:16px;font-size:13px;color:#666;">Or copy this link:<br/><a href="{{questionnaireUrl}}" style="color:#6366f1;word-break:break-all;">{{questionnaireUrl}}</a></p>

It takes about 10–15 minutes. Once finished, we can begin serving your account.

Talk soon!`,
      questionnaire: DEFAULT_QUESTIONNAIRE,
    },
    update: {
      questionnaire: DEFAULT_QUESTIONNAIRE,
      welcomeEmailBody: `Hi {{contactName}},

Thanks for reaching out! Complete your onboarding (profile, packages, agreement, and access):

{{questionnaireButton}}

<p style="margin-top:16px;font-size:13px;color:#666;">Or copy this link:<br/><a href="{{questionnaireUrl}}" style="color:#6366f1;word-break:break-all;">{{questionnaireUrl}}</a></p>

It takes about 10–15 minutes. Once finished, we can begin serving your account.

Talk soon!`,
    },
  });

  const existingRules = await prisma.onboardingRule.count({
    where: { templateId: template.id },
  });

  const accessRuleDefs = [
    {
      purpose: "ACCESS_CORE",
      outputType: "ACCESS_CHECKLIST" as const,
      outputConfig: { systemType: "CMS_ADMIN", label: "Website CMS admin access" },
      order: 5,
    },
    {
      purpose: "ACCESS_HOSTING",
      outputType: "ACCESS_CHECKLIST" as const,
      outputConfig: { systemType: "HOSTING", label: "Hosting control panel access" },
      order: 6,
    },
    {
      purpose: "ACCESS_DOMAIN",
      outputType: "ACCESS_CHECKLIST" as const,
      outputConfig: {
        systemType: "DOMAIN_REGISTRAR",
        label: "Domain registrar access",
      },
      order: 7,
    },
    {
      purpose: "ACCESS_DNS",
      outputType: "ACCESS_CHECKLIST" as const,
      outputConfig: { systemType: "DNS", label: "DNS management access" },
      order: 8,
    },
    {
      purpose: "ACCESS_GBP",
      condition: {
        field: "interestedIn",
        operator: "contains",
        value: "SEO_RETAINER",
      },
      outputType: "ACCESS_CHECKLIST" as const,
      outputConfig: {
        systemType: "GBP",
        label: "Google Business Profile manager access",
      },
      order: 9,
    },
    {
      purpose: "ACCESS_SOCIAL",
      outputType: "ACCESS_CHECKLIST" as const,
      outputConfig: {
        systemType: "SOCIAL",
        label: "Social media page / business access",
      },
      order: 10,
    },
  ];

  if (existingRules === 0) {
    await prisma.onboardingRule.createMany({
      data: [
        {
          templateId: template.id,
          purpose: "DISCOVER_NEEDS",
          outputType: "TASK",
          outputConfig: { title: "Review onboarding profile and package selection" },
          order: 0,
        },
        {
          templateId: template.id,
          purpose: "SCOPE_WEBSITE",
          condition: { field: "interestedIn", operator: "contains", value: "WEBSITE" },
          outputType: "LAUNCH_CHECKLIST",
          outputConfig: { label: "Configure SSL certificate", order: 1 },
          order: 1,
        },
        {
          templateId: template.id,
          purpose: "SCOPE_SEO",
          condition: {
            field: "interestedIn",
            operator: "contains",
            value: "SEO_RETAINER",
          },
          outputType: "ACCESS_CHECKLIST",
          outputConfig: {
            systemType: "SEARCH_CONSOLE",
            label: "Google Search Console access",
          },
          order: 2,
        },
        {
          templateId: template.id,
          purpose: "SETUP_ANALYTICS",
          condition: {
            field: "interestedIn",
            operator: "contains",
            value: "WEBSITE",
          },
          outputType: "INTEGRATION_CHECKLIST",
          outputConfig: {},
          order: 3,
        },
        {
          templateId: template.id,
          purpose: "SETUP_ANALYTICS",
          condition: {
            field: "interestedIn",
            operator: "contains",
            value: "SEO_RETAINER",
          },
          outputType: "INTEGRATION_CHECKLIST",
          outputConfig: {},
          order: 4,
        },
        ...accessRuleDefs.map((r) => ({ templateId: template.id, ...r })),
      ],
    });
  } else {
    for (const rule of accessRuleDefs) {
      const exists = await prisma.onboardingRule.findFirst({
        where: { templateId: template.id, purpose: rule.purpose },
      });
      if (!exists) {
        await prisma.onboardingRule.create({
          data: { templateId: template.id, ...rule },
        });
      }
    }
  }

  const pricingCount = await prisma.pricingMatrixItem.count();
  if (pricingCount === 0) {
    await prisma.pricingMatrixItem.createMany({
      data: [
        {
          name: "Starter Retainer",
          category: "SEO Retainer",
          basePrice: 1750,
          unit: "monthly",
        },
        {
          name: "Growth Retainer",
          category: "SEO Retainer",
          basePrice: 3000,
          unit: "monthly",
        },
        {
          name: "Domination Retainer",
          category: "SEO Retainer",
          basePrice: 5000,
          unit: "monthly",
        },
        {
          name: "One-Time Website Build",
          category: "Website",
          basePrice: 7500,
          unit: "flat",
        },
        {
          name: "Website Care / Maintenance",
          category: "Maintenance",
          basePrice: 300,
          unit: "monthly",
        },
        {
          name: "Website build — standard",
          category: "Website",
          basePrice: 4500,
          unit: "flat",
        },
        {
          name: "Local SEO retainer",
          category: "SEO Retainer",
          basePrice: 1200,
          unit: "monthly",
        },
        {
          name: "Google Analytics setup",
          category: "Add-on",
          basePrice: 350,
          unit: "flat",
        },
      ],
    });
  } else {
    const care = await prisma.pricingMatrixItem.findFirst({
      where: { name: "Website Care / Maintenance" },
    });
    if (!care) {
      await prisma.pricingMatrixItem.create({
        data: {
          name: "Website Care / Maintenance",
          category: "Maintenance",
          basePrice: 300,
          unit: "monthly",
        },
      });
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
