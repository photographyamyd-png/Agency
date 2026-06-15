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
  ],
};

async function main() {
  const existingAgency = await prisma.agencyProfile.findFirst();
  if (!existingAgency) {
    await prisma.agencyProfile.create({
      data: {
        businessName: "Your Web Agency",
        tagline: "Websites & local SEO that get you found on Google",
        heroHeadline: "Get more customers from Google",
        heroSubhead:
          "Custom websites and local SEO for service businesses — with weekly reports that show your rankings climbing.",
        email: "hello@youragency.com",
        autoOnboardWebsiteLeads: true,
        heroImageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80",
        heroImageAlt: "Analytics dashboard on a laptop screen",
        servicesImages: {
          WEBSITE: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80",
          SEO: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
          REPORTING: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
        },
        resultsImages: [
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
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
