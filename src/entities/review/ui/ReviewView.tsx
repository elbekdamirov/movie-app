import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMovie, type MediaType } from "@/entities/movie";
import { StatusMessage } from "@/shared/ui";
import { createUserImageUrl } from "@/shared/utils";

export const ReviewView = memo(({ id, mediaType }: { id: string; mediaType: MediaType }) => {
  const { t, i18n } = useTranslation();
  const { getMovieInfo } = useMovie();
  const { data, isPending, isError, refetch } = getMovieInfo(id, "reviews", mediaType);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  if (isPending) return <StatusMessage message={t("catalog.loading")} />;
  if (isError) return <StatusMessage message={t("catalog.loadError")} onRetry={() => void refetch()} />;
  if (!data.results.length) return <StatusMessage message={t("media.noReviews")} />;

  return (
    <section className="container grid gap-3 pt-5" aria-label={t("media.reviews")}>
      {data.results.map((review) => (
        <article className="review-card" key={review.id}>
          <div className="flex items-center gap-3">
            <img src={createUserImageUrl(review.author_details?.avatar_path)} alt="" className="size-10 rounded-full object-cover" loading="lazy" />
            <div>
              <h3 className="text-sm font-semibold">{review.author}</h3>
              <p className="muted text-xs">{new Date(review.created_at).toLocaleDateString(i18n.resolvedLanguage)}</p>
            </div>
            {review.author_details?.rating != null && <p className="ml-auto text-sm font-semibold">{review.author_details.rating} / 10</p>}
          </div>
          <p className={`mt-3 whitespace-pre-line break-words leading-relaxed ${review.content.length > 300 && !expanded[review.id] ? "line-clamp-5" : ""}`}>
            {review.content}
          </p>
          {review.content.length > 300 && (
            <button
              type="button"
              className="section-link mt-3"
              aria-expanded={!!expanded[review.id]}
              onClick={() => setExpanded((previous) => ({ ...previous, [review.id]: !previous[review.id] }))}
            >
              {t(expanded[review.id] ? "media.readLess" : "media.readMore")}
            </button>
          )}
        </article>
      ))}
    </section>
  );
});
