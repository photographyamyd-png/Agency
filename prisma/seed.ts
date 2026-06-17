import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_QUESTIONNAIRE = {
  fields: [
    {
      id: "interestedIn",
      type: "checkboxes",
      label: "What services do you need?",
      required: true,
      options: [
        { value: "WEBSITE", label: "New website" },
        { value: "SEO_RETAINER", label: "Local SEO retainer" },
        { value: "BOTH", label: "Website + SEO" },
      ],
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
  }

  const template = await prisma.onboardingTemplate.upsert({
    where: { slug: "default" },
    create: {
      name: "Default client onboarding",
      slug: "default",
      isDefault: true,
      welcomeEmailSubject: "Welcome to {{businessName}} — let's get started",
      welcomeEmailBody: `Hi {{contactName}},

Thanks for reaching out! To build your custom plan, please complete our short questionnaire:

{{questionnaireButton}}

<p style="margin-top:16px;font-size:13px;color:#666;">Or copy this link:<br/><a href="{{questionnaireUrl}}" style="color:#6366f1;word-break:break-all;">{{questionnaireUrl}}</a></p>

It takes about 5 minutes. Once submitted, we'll prepare your profile, project checklists, and estimate.

Talk soon!`,
      questionnaire: DEFAULT_QUESTIONNAIRE,
    },
    update: {
      welcomeEmailBody: `Hi {{contactName}},

Thanks for reaching out! To build your custom plan, please complete our short questionnaire:

{{questionnaireButton}}

<p style="margin-top:16px;font-size:13px;color:#666;">Or copy this link:<br/><a href="{{questionnaireUrl}}" style="color:#6366f1;word-break:break-all;">{{questionnaireUrl}}</a></p>

It takes about 5 minutes. Once submitted, we'll prepare your profile, project checklists, and estimate.

Talk soon!`,
    },
  });

  const existingRules = await prisma.onboardingRule.count({
    where: { templateId: template.id },
  });

  if (existingRules === 0) {
    await prisma.onboardingRule.createMany({
      data: [
        {
          templateId: template.id,
          purpose: "DISCOVER_NEEDS",
          outputType: "TASK",
          outputConfig: { title: "Review onboarding questionnaire answers" },
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
      ],
    });
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
