import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
}) {
  const { t } = useTranslation();

  if (!open) {
    return null;
  }

  return (
    <div className="mg-modal-overlay">
      <div className="mg-modal" style={{ maxWidth: "420px" }}>
        <div className="mg-modal-header">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <AlertTriangle
              size={30}
              color="#dc2626"
            />

            <div>
              <h2>{title}</h2>
              <p>{message}</p>
            </div>
          </div>
        </div>

        <div className="mg-modal-actions">
          <button
            type="button"
            className="mg-cancel-button"
            onClick={onCancel}
          >
            {cancelText || t("confirmDialog.cancel")}
          </button>

          <button
            type="button"
            className="mg-primary-button"
            style={{
              backgroundColor: "#dc2626",
            }}
            onClick={onConfirm}
          >
            {confirmText || t("confirmDialog.delete")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
