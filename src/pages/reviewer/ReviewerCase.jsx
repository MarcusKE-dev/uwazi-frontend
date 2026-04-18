import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";

const ACTIONS = [
  { status: "under_review", label: "Mark Under Review",  bg: "#1d4ed8" },
  { status: "flagged",      label: "Flag as Fraud",      bg: "#c2410c" },
  { status: "escalated",    label: "Escalate to EACC",   bg: "#991b1b" },
  { status: "resolved",     label: "Mark Resolved",      bg: "#166534" },
  { status: "dismissed",    label: "Dismiss Case",       bg: "#6b7280" },
];

// Shared field row component for the case details card
const Field = ({ label, value }) => (
  <div>
    <dt style={{ fontSize: "11px", color: "#9ca3af", textTransform: "uppercase",
      letterSpacing: ".06em", marginBottom: "2px" }}>
      {label}
    </dt>
    <dd style={{ margin: 0, fontWeight: 500, color: "#1a1a1a" }}>
      {value || <span style={{ color: "#d1d5db", fontWeight: 400 }}>—</span>}
    </dd>
  </div>
);

const ReviewerCase = () => {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes]     = useState("");
  const [working, setWorking] = useState(false);
  const [flash, setFlash]     = useState(null); // { type: "ok"|"err", msg }

  useEffect(() => {
    axiosInstance.get(`/reviewer/cases/${id}`)
      .then(r  => setData(r.data.data))
      .catch(e => setFlash({ type: "err",
        msg: e.response?.data?.error?.message || e.message }))
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (status) => {
    if (!window.confirm(
      `Set this case status to "${status.replace(/_/g," ")}"?\n\nThis will be recorded in the audit trail and the citizen will be notified by email.`
    )) return;

    setWorking(true);
    setFlash(null);
    try {
      const r = await axiosInstance.patch(`/reviewer/cases/${id}/status`,
        { status, notes });
      setData(prev => ({ ...prev, status: r.data.data.case.status }));
      setNotes("");
      setFlash({ type: "ok",
        msg: `Status updated to "${status.replace(/_/g," ")}". Citizen notified.` });
    } catch (e) {
      setFlash({ type: "err",
        msg: e.response?.data?.error?.message || e.message });
    } finally {
      setWorking(false);
    }
  };

  if (loading) return (
    <div style={{ padding: "48px", textAlign: "center", color: "#9ca3af" }}>
      Loading case…
    </div>
  );

  const c = data;

  return (
    <div style={{ padding: "32px", maxWidth: "860px", fontFamily: "inherit" }}>
      {/* Back nav */}
      <button
        onClick={() => navigate("/reviewer")}
        style={{ background: "none", border: "none", color: "#6b7280",
          cursor: "pointer", fontSize: "14px", padding: 0, marginBottom: "20px",
          display: "flex", alignItems: "center", gap: "4px" }}
      >
        ← Back to Queue
      </button>

      {/* Case header */}
      {c && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between",
            alignItems: "flex-start", marginBottom: "24px", gap: "16px",
            flexWrap: "wrap" }}>
            <div>
              <span style={{ fontFamily: "monospace", color: "#059669",
                fontSize: "12px", fontWeight: 600 }}>
                {c.tracking_code}
              </span>
              <h1 style={{ fontSize: "20px", fontWeight: 600,
                margin: "4px 0 0", letterSpacing: "-.01em" }}>
                {c.title}
              </h1>
              <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#6b7280" }}>
                Submitted by {c.submitted_by || "Anonymous"} ·{" "}
                {new Date(c.created_at).toLocaleDateString("en-KE",
                  { dateStyle: "long" })}
              </p>
            </div>
            <span style={{
              background: "#fffbeb", color: "#92400e",
              border: "1px solid #fde68a",
              padding: "5px 14px", borderRadius: "14px",
              fontSize: "13px", fontWeight: 500,
              textTransform: "capitalize", whiteSpace: "nowrap"
            }}>
              {c.status?.replace(/_/g, " ")}
            </span>
          </div>

          {/* Flash message */}
          {flash && (
            <div style={{
              padding: "12px 16px", borderRadius: "8px", marginBottom: "20px",
              fontSize: "14px", lineHeight: "1.5",
              background: flash.type === "ok" ? "#f0fdf4" : "#fef2f2",
              color:      flash.type === "ok" ? "#166534"  : "#dc2626",
              border: `1px solid ${flash.type === "ok" ? "#bbf7d0" : "#fecaca"}`
            }}>
              {flash.type === "ok" ? "✓ " : "⚠ "}{flash.msg}
            </div>
          )}

          {/* Details grid */}
          <dl style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px", background: "#f9fafb",
            border: "1px solid #e5e7eb", borderRadius: "8px",
            padding: "20px", marginBottom: "24px"
          }}>
            <Field label="Ministry"
              value={c.ministry} />
            <Field label="Amount involved"
              value={c.amount_involved
                ? `KSh ${Number(c.amount_involved).toLocaleString("en-KE")}`
                : null} />
            <Field label="Reviewer"
              value={c.reviewer_name} />
            <Field label="Assigned on"
              value={c.assigned_at
                ? new Date(c.assigned_at).toLocaleDateString("en-KE")
                : null} />
          </dl>

          {/* Description */}
          {c.description && (
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: 600,
                color: "#374151", textTransform: "uppercase",
                letterSpacing: ".06em", marginBottom: "10px" }}>
                Description
              </h3>
              <p style={{ color: "#4b5563", lineHeight: "1.75", margin: 0,
                fontSize: "14px" }}>
                {c.description}
              </p>
            </div>
          )}

          {/* Evidence */}
          {c.evidence?.length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: 600,
                color: "#374151", textTransform: "uppercase",
                letterSpacing: ".06em", marginBottom: "10px" }}>
                Evidence ({c.evidence.length})
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {c.evidence.map(ev => (
                  <a key={ev.id} href={ev.file_url} target="_blank" rel="noreferrer"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: "6px",
                      background: "#eff6ff", color: "#1d4ed8",
                      border: "1px solid #bfdbfe",
                      padding: "6px 14px", borderRadius: "6px",
                      textDecoration: "none", fontSize: "13px"
                    }}>
                    📎 {ev.original_filename || "View file"}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Case history */}
          {c.updates?.length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: 600,
                color: "#374151", textTransform: "uppercase",
                letterSpacing: ".06em", marginBottom: "10px" }}>
                Case History
              </h3>
              <div style={{
                border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden"
              }}>
                {c.updates.map((u, i) => (
                  <div key={i} style={{
                    display: "flex", gap: "16px",
                    padding: "14px 16px", fontSize: "13px",
                    borderBottom: i < c.updates.length - 1
                      ? "1px solid #f3f4f6" : "none",
                    background: i % 2 === 0 ? "#fff" : "#fafafa"
                  }}>
                    <div style={{
                      width: "2px", flexShrink: 0, alignSelf: "stretch",
                      background: "#e5e7eb", borderRadius: "1px"
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, textTransform: "capitalize" }}>
                        {u.status?.replace(/_/g, " ")}
                      </div>
                      <div style={{ color: "#9ca3af", fontSize: "12px", marginTop: "2px" }}>
                        {u.updated_by_name || "System"} ·{" "}
                        {new Date(u.created_at).toLocaleString("en-KE")}
                      </div>
                      {u.notes && (
                        <div style={{ color: "#4b5563", marginTop: "4px" }}>
                          {u.notes}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status update panel */}
          <div style={{
            background: "#fff", border: "1px solid #e5e7eb",
            borderRadius: "10px", padding: "24px"
          }}>
            <h3 style={{ fontSize: "14px", fontWeight: 600,
              margin: "0 0 14px" }}>
              Update Status
            </h3>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add reviewer notes (optional — will be stored in case history)…"
              rows={3}
              style={{
                width: "100%", padding: "10px 12px",
                border: "1px solid #d1d5db", borderRadius: "6px",
                fontSize: "14px", fontFamily: "inherit",
                resize: "vertical", marginBottom: "14px",
                boxSizing: "border-box", outline: "none"
              }}
            />
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {ACTIONS.map(a => {
                const isCurrent = c.status === a.status;
                return (
                  <button
                    key={a.status}
                    onClick={() => updateStatus(a.status)}
                    disabled={working || isCurrent}
                    style={{
                      padding: "8px 18px", borderRadius: "6px",
                      border: "none", fontSize: "13px", fontWeight: 500,
                      cursor: working || isCurrent ? "not-allowed" : "pointer",
                      background: isCurrent ? "#f3f4f6" : a.bg,
                      color:      isCurrent ? "#9ca3af" : "#fff",
                      opacity:    working ? 0.7 : 1,
                      transition: "opacity .15s"
                    }}
                  >
                    {isCurrent ? `✓ ${a.label}` : a.label}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewerCase;
