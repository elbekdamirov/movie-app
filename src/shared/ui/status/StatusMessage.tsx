import { useTranslation } from "react-i18next";

export const StatusMessage = ({ message, onRetry }: { message: string; onRetry?: () => void }) => {
  const { t } = useTranslation();

  return (
    <div className="status-message muted" role="status">
      <p>{message}</p>
      {onRetry && <button className="action action-secondary" onClick={onRetry}>{t("catalog.retry")}</button>}
    </div>
  );
};
