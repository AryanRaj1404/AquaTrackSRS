import { AlertTriangle } from "lucide-react";

function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Delete",
  cancelText = "Cancel",
}) {
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
            {cancelText}
          </button>

          <button
            type="button"
            className="mg-primary-button"
            style={{
              backgroundColor: "#dc2626",
            }}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;