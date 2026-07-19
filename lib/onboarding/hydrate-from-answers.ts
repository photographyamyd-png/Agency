import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { BUSINESS_INTEL_FIELDS } from "@/lib/blueprint/phase-1-intake";
import { seedCitationsForClient } from "@/lib/blueprint/instantiate";

type Answers = Record<string, unknown>;

function asString(value: unknown): string | null {
  if (value == null) return null;
  if (Array.isArray(value)) {
    const joined = value.map(String).map((s) => s.trim()).filter(Boolean).join(", ");
    return joined || null;
  }
  const s = String(value).trim();
  return s || null;
}

function splitList(value: unknown): string[] {
  const raw = asString(value);
  if (!raw) return [];
  return raw
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Maps onboarding profile answers into Client + BrandProfile:
 * contacts, NAP, socials, host/registrar, business intel, keywords, competitors.
 */
export async function hydrateClientFromOnboardingAnswers(
  clientId: string,
  answers: Answers
) {
  const intel: Record<string, string> = {};
  for (const field of BUSINESS_INTEL_FIELDS) {
    const v = asString(answers[field.id]);
    if (v) intel[field.id] = v;
  }

  const industry = asString(answers.industry);
  const serviceArea = asString(answers.serviceArea);
  const targetCities = asString(answers.targetCities);
  const budgetRange = asString(answers.budgetRange);
  const timelineExpectation = asString(answers.timelineExpectation);
  const primaryKeyword = asString(answers.primaryKeyword);
  const brandVoice = asString(answers.brandVoice);
  const goals = asString(answers.goals);

  const primaryContactName = asString(answers.primaryContactName);
  const primaryContactPhone = asString(answers.primaryContactPhone);
  const billingName = asString(answers.billingName) ?? primaryContactName;
  const billingEmail = asString(answers.billingEmail);
  const technicalContactName = asString(answers.technicalContactName);
  const technicalContactEmail = asString(answers.technicalContactEmail);

  const existingSiteUrl = asString(answers.existingSiteUrl);
  const currentHost = asString(answers.currentHost);
  const currentRegistrar = asString(answers.currentRegistrar);
  const domainFromUrl = existingSiteUrl
    ?.replace(/^https?:\/\//, "")
    .split("/")[0]
    ?.trim();

  const street = asString(answers.streetAddress);
  const city = asString(answers.city);
  const state = asString(answers.stateProvince);
  const postal = asString(answers.postalCode);

  const addresses =
    street || city
      ? [
          {
            label: "Primary",
            street: street ?? "",
            city: city ?? "",
            state: state ?? "",
            zip: postal ?? "",
            isPublic: true,
          },
        ]
      : undefined;

  const socialLinks: Record<string, string> = {};
  const fb = asString(answers.socialFacebook);
  const ig = asString(answers.socialInstagram);
  const li = asString(answers.socialLinkedIn);
  const yelp = asString(answers.socialYelp);
  if (fb) socialLinks.facebook = fb;
  if (ig) socialLinks.instagram = ig;
  if (li) socialLinks.linkedin = li;
  if (yelp) socialLinks.yelp = yelp;

  const serviceAreas = [
    ...new Set([...splitList(serviceArea), ...splitList(targetCities)]),
  ];

  await prisma.client.update({
    where: { id: clientId },
    data: {
      ...(primaryContactName ? { primaryContactName } : {}),
      ...(primaryContactPhone ? { primaryContactPhone } : {}),
      ...(billingName ? { billingName } : {}),
      ...(billingEmail ? { billingEmail } : {}),
      ...(technicalContactName ? { technicalContactName } : {}),
      ...(technicalContactEmail ? { technicalContactEmail } : {}),
    },
  });

  await prisma.brandProfile.upsert({
    where: { clientId },
    create: {
      clientId,
      industry: industry ?? undefined,
      serviceAreas,
      budgetRange: budgetRange ?? undefined,
      timelineExpectation: timelineExpectation ?? undefined,
      primaryKeyword: primaryKeyword ?? undefined,
      toneVoice: brandVoice ?? undefined,
      targetAudience: goals ?? undefined,
      phonePrimary: primaryContactPhone ?? undefined,
      existingSiteUrl: existingSiteUrl ?? undefined,
      currentHost: currentHost ?? undefined,
      currentRegistrar: currentRegistrar ?? undefined,
      domain: domainFromUrl ?? undefined,
      addresses: addresses as Prisma.InputJsonValue | undefined,
      socialLinks:
        Object.keys(socialLinks).length > 0
          ? (socialLinks as Prisma.InputJsonValue)
          : undefined,
      businessIntelJson: intel as Prisma.InputJsonValue,
      gbpCategoriesSecondary: [],
      exampleSites: [],
    },
    update: {
      ...(industry ? { industry } : {}),
      ...(serviceAreas.length ? { serviceAreas } : {}),
      ...(budgetRange ? { budgetRange } : {}),
      ...(timelineExpectation ? { timelineExpectation } : {}),
      ...(primaryKeyword ? { primaryKeyword } : {}),
      ...(brandVoice ? { toneVoice: brandVoice } : {}),
      ...(goals ? { targetAudience: goals } : {}),
      ...(primaryContactPhone ? { phonePrimary: primaryContactPhone } : {}),
      ...(existingSiteUrl ? { existingSiteUrl } : {}),
      ...(currentHost ? { currentHost } : {}),
      ...(currentRegistrar ? { currentRegistrar } : {}),
      ...(domainFromUrl ? { domain: domainFromUrl } : {}),
      ...(addresses ? { addresses: addresses as Prisma.InputJsonValue } : {}),
      ...(Object.keys(socialLinks).length
        ? { socialLinks: socialLinks as Prisma.InputJsonValue }
        : {}),
      businessIntelJson: intel as Prisma.InputJsonValue,
    },
  });

  if (primaryKeyword) {
    const existing = await prisma.keyword.findFirst({
      where: { clientId, term: { equals: primaryKeyword, mode: "insensitive" } },
    });
    if (!existing) {
      await prisma.keyword.create({
        data: { clientId, term: primaryKeyword },
      });
    }
  }

  const competitorNames = splitList(answers.knownCompetitors);
  if (competitorNames.length > 0) {
    const existingCount = await prisma.competitor.count({ where: { clientId } });
    if (existingCount === 0) {
      await prisma.competitor.createMany({
        data: competitorNames.slice(0, 10).map((name) => ({
          clientId,
          name,
          url: `https://www.google.com/search?q=${encodeURIComponent(name)}`,
        })),
      });
    }
  }

  await seedCitationsForClient(clientId);
}
