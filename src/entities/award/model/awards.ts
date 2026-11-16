import type { MediaType } from "@/entities/movie";

interface AwardRecipient {
  name: string;
  id?: number;
}

interface AwardTitle extends AwardRecipient {
  type: MediaType;
}

export interface AwardWinner {
  category: string;
  labelKey?: string;
  title?: AwardTitle;
  people?: AwardRecipient[];
  source?: string;
}

export type AwardCeremonyType = "oscars" | "emmys";

export interface AwardCeremony {
  id: AwardCeremonyType;
  year: number;
  source: string;
  winners: AwardWinner[];
}

const thePitt = { id: 250307, type: "tv", name: "The Pitt" } as const;
const widowsBay = { id: 270476, type: "tv", name: "Widow’s Bay" } as const;

const emmyHighlights: AwardCeremony = {
  id: "emmys",
  year: 2026,
  source: "https://www.televisionacademy.com/78th-emmy-winners",
  winners: [
    { category: "Outstanding Drama Series", labelKey: "dramaSeries", title: thePitt },
    { category: "Outstanding Comedy Series", labelKey: "comedySeries", title: widowsBay },
    { category: "Outstanding Limited Or Anthology Series", labelKey: "limitedSeries", title: { id: 206828, type: "tv", name: "DTF St. Louis" } },
    { category: "Outstanding Lead Actor In A Drama Series", labelKey: "dramaActor", title: thePitt, people: [{ id: 13526, name: "Noah Wyle" }] },
    { category: "Outstanding Lead Actress In A Drama Series", labelKey: "dramaActress", title: { id: 225171, type: "tv", name: "Pluribus" }, people: [{ id: 62765, name: "Rhea Seehorn" }] },
    { category: "Outstanding Lead Actor In A Comedy Series", labelKey: "comedyActor", title: widowsBay, people: [{ id: 29528, name: "Matthew Rhys" }] },
    { category: "Outstanding Lead Actress In A Comedy Series", labelKey: "comedyActress", title: { id: 124101, type: "tv", name: "Hacks" }, people: [{ id: 5376, name: "Jean Smart" }] },
  ],
};

const categoryLabels: Record<string, string> = {
  "best picture": "bestPicture",
  "best animated feature film": "animatedFeature",
  "animated feature film": "animatedFeature",
  "international feature film": "internationalFeature",
  "best international feature film": "internationalFeature",
  directing: "directing",
  "best directing": "directing",
  "actor in a leading role": "leadActor",
  "best actor in a leading role": "leadActor",
  "actress in a leading role": "leadActress",
  "best actress in a leading role": "leadActress",
  "actor in a supporting role": "supportingActor",
  "best actor in a supporting role": "supportingActor",
  "actress in a supporting role": "supportingActress",
  "best actress in a supporting role": "supportingActress",
};

export const getAwardCategoryKey = (winner: AwardWinner) =>
  winner.labelKey ?? categoryLabels[winner.category.toLowerCase()] ?? winner.category;

const getAwardSearchPath = (name: string, type: MediaType | "person") =>
  `/search?${new URLSearchParams({ q: name, type })}`;

export const getAwardTitlePath = ({ id, type, name }: AwardTitle) =>
  id ? `/${type}/${id}` : getAwardSearchPath(name, type);

export const getAwardPersonPath = ({ id, name }: AwardRecipient) =>
  id ? `/crew/${id}` : getAwardSearchPath(name, "person");

export const addEmmyHighlights = (history: AwardCeremony[]) => {
  const latest = history.find((ceremony) => ceremony.year === emmyHighlights.year);
  if (!latest) return [emmyHighlights, ...history];

  const archiveCategories = new Set(emmyHighlights.winners.map((winner) => winner.category.toLowerCase()));
  return history.map((ceremony) => ceremony !== latest ? ceremony : {
    ...emmyHighlights,
    winners: [
      ...emmyHighlights.winners,
      ...latest.winners.filter((winner) => !archiveCategories.has(winner.category.toLowerCase())),
    ],
  });
};

export const getPersonAwards = (id: number, oscarHistory: AwardCeremony[] = []) =>
  [emmyHighlights, ...oscarHistory].flatMap(({ id: ceremony, year, winners }) =>
    winners.filter(({ people }) => people?.some((person) => person.id === id))
      .map((winner) => ({ ...winner, ceremony, year })),
  ).sort((a, b) => b.year - a.year);
