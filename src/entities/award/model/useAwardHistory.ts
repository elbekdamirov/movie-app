import { useQuery } from "@tanstack/react-query";
import { addEmmyHighlights, type AwardCeremony } from "./awards";

export const useOscarHistory = () => useQuery({
  queryKey: ["awards", "oscars"],
  queryFn: async () => (await import("../data/oscars.json")).default as AwardCeremony[],
  staleTime: Infinity,
});

export const useEmmyHistory = () => useQuery({
  queryKey: ["awards", "emmys"],
  queryFn: async () => addEmmyHighlights((await import("../data/emmys.json")).default as AwardCeremony[]),
  staleTime: Infinity,
});
