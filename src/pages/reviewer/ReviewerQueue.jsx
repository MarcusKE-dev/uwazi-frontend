import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";

// Status colour map — matches your existing design system
const STATUS_COLORS = {
  submitted:    { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
  under_review: { bg: "#fffbeb", text: "#92400e", border: "#fde68a" },
  flagged:      { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa" },
  escalated:    { bg: "#fef2f2", text: "#991b1b", border: "#fecaca" },
  resolved:     { bg: "#f0fdf4", text: "#166534", border: "#bbf7d0" },
  dismissed:    { bg: "#f9fafb", text: "#6b7280", border: "#e5e7eb" },
};

const Badge = ({ status }) => {
  const c = STATUS_COLORS[status] || STATUS_COLORS.submitted;
  return (
    <span style={{
      background: c.bg, color: c.text,
      border: `1px solid ${c.border}`,
      padding: "3px 10px", borderRadius: "12px",
      fontSize: "12px", fontWeight: 500,
      textTransform: "capitalize", whiteSpace: "nowrap"
    }}>
      {status?.replace(/_/g, " ")}
    </span>
  );
};

const ReviewerQueue = () => {
  const [cases, setCases]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    axiosInstance.get("/reviewer/queue")
      .then(r  => setCases(r.data.data?.cases || []))
      .catch(e => setError(e.response?.data?.error?.message || e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ padding: "48px", textAlign: "center", color: "#9ca3af" }}>
      Loading your queue…
    </div>
  );

  if (error) return (
    <div style={{ padding: "32px" }}>
      <div style={{ background: "#fef2f2", border: "1px solid #fecaca",
        borderRadius: "8px", padding: "16px", color: "#dc2626", fontSize: "14px" }}>
        ⚠ {error}
      </div>
    </div>
  );

  return (
    <div style={{ padding: "32px", fontFamily: "inherit" }}>
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 600, margin: "0 0 4px",
          letterSpacing: "-.02em" }}>
          Reviewer Queue
        </h1>
        <p style={{ color: "#6b7280", margin: 0, fontSize: "14px" }}>
          {cases.length === 0
            ? "No cases assigned to you right now."
            : `${cases.length} case${cases.length !== 1 ? "s" : ""} assigned to you`}
        </p>
      </div>

      {/* Empty state */}
      {cases.length === 0 ? (
        <div style={{
          background: "#f9fafb", border: "1px dashed #d1d5db",
          borderRadius: "10px", padding: "64px 32px",
          textAlign: "center", color: "#9ca3af"
        }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>📋</div>
          <p style={{ margin: 0, fontSize: "15px" }}>Your queue is empty</p>
          <p style={{ margin: "4px 0 0", fontSize: "13px" }}>
            New cases will appear here when assigned by an admin
          </p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse",
            fontSize: "14px", minWidth: "680px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                {["Tracking Code", "Title", "Ministry", "Amount (KSh)", "Status", "Assigned", ""].map(h => (
                  <th key={h} style={{
                    padding: "10px 12px", textAlign: "left",
                    fontSize: "11px", fontWeight: 600,
                    color: "#6b7280", textTransform: "uppercase",
                    letterSpacing: ".06em", whiteSpace: "nowrap"
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cases.map(c => (
                <tr key={c.id}
                  style={{ borderBottom: "1px solid #f3f4f6", transition: "background .1s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                  onMouseLeave={e => e.currentTarget.style.background = ""}
                >
                  <td style={{ padding: "14px 12px" }}>
                    <span style={{
                      fontFamily: "monospace", color: "#059669",
                      fontWeight: 600, fontSize: "13px"
                    }}>
                      {c.tracking_code}
                    </span>
                  </td>
                  <td style={{ padding: "14px 12px", maxWidth: "220px" }}>
                    <span style={{
                      display: "-webkit-box", WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical", overflow: "hidden"
                    }}>
                      {c.title}
                    </span>
                  </td>
                  <td style={{ padding: "14px 12px", color: "#6b7280" }}>
                    {c.ministry || <span style={{ color: "#d1d5db" }}>—</span>}
                  </td>
                  <td style={{ padding: "14px 12px", color: "#6b7280" }}>
                    {c.amount_involved
                      ? `KSh ${Number(c.amount_involved).toLocaleString("en-KE")}`
                      : <span style={{ color: "#d1d5db" }}>—</span>
                    }
                  </td>
                  <td style={{ padding: "14px 12px" }}>
                    <Badge status={c.status} />
                  </td>
                  <td style={{ padding: "14px 12px", color: "#9ca3af", fontSize: "12px" }}>
                    {c.assigned_at
                      ? new Date(c.assigned_at).toLocaleDateString("en-KE")
                      : "—"}
                  </td>
                  <td style={{ padding: "14px 12px" }}>
                    <Link
                      to={`/reviewer/cases/${c.id}`}
                      style={{
                        display: "inline-block",
                        padding: "6px 16px",
                        background: "#004d3b", color: "#fff",
                        borderRadius: "6px", textDecoration: "none",
                        fontSize: "13px", fontWeight: 500,
                        whiteSpace: "nowrap"
                      }}
                    >
                      Review →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReviewerQueue;
