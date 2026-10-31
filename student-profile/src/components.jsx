import { useState } from "react";
import { api, downloadFile } from "./api";
import { useSession } from "./state";
export function Heading({ title, subtitle, children }) {
  return (
    <header className="page-heading">
      <div>
        <p className="eyebrow">PLACEMENT PORTAL</p>
        <h1>{title}</h1>
        {subtitle && <p className="muted">{subtitle}</p>}
      </div>
      {children}
    </header>
  );
}
export function Status({ query }) {
  return query.loading ? (
    <p role="status" className="card">
      Loading…
    </p>
  ) : query.error ? (
    <p role="alert" className="notice error">
      {query.error}
    </p>
  ) : null;
}
export function Empty({ children }) {
  return <div className="card empty">{children}</div>;
}
export function Metric({ label, value }) {
  return (
    <div className="card metric">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
export function FileButton({ path, name, label = "Download PDF" }) {
  const [error, setError] = useState("");
  return (
    <>
      <button
        className="secondary"
        type="button"
        onClick={() =>
          downloadFile(path, name).catch((e) => setError(e.message))
        }
      >
        {label}
      </button>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
    </>
  );
}
export function Form({
  fields,
  initial = {},
  submit,
  label = "Save",
  onSuccess,
}) {
  const [values, setValues] = useState(initial),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [success, setSuccess] = useState("");
  return (
    <form
      className="card form"
      onSubmit={async (e) => {
        e.preventDefault();
        if (busy) return;
        setBusy(true);
        setError("");
        setSuccess("");
        try {
          const result = await submit(values);
          setSuccess(
            result?.warning || result?.message || "Saved successfully.",
          );
          onSuccess?.(result);
          if (!Object.keys(initial).length) {
            setValues({});
            e.target.reset();
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setBusy(false);
        }
      }}
    >
      <div className="form-grid">
        {fields.map((f) => (
          <label key={f.name} className={f.type === "textarea" ? "wide" : ""}>
            {f.label}
            {f.type === "select" ? (
              <select
                aria-label={f.label}
                disabled={busy}
                required={f.required !== false}
                value={values[f.name] ?? ""}
                onChange={(e) =>
                  setValues({ ...values, [f.name]: e.target.value })
                }
              >
                <option value="">Select…</option>
                {f.options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : f.type === "textarea" ? (
              <textarea
                aria-label={f.label}
                disabled={busy}
                rows={4}
                required={f.required !== false}
                value={values[f.name] ?? ""}
                onChange={(e) =>
                  setValues({ ...values, [f.name]: e.target.value })
                }
              />
            ) : (
              <input
                aria-label={f.label}
                disabled={busy}
                type={f.type || "text"}
                required={f.required !== false}
                min={f.min}
                max={f.max}
                step={f.step}
                maxLength={f.type === "password" ? 72 : undefined}
                accept={f.accept}
                {...(f.type === "file" ? {} : { value: values[f.name] ?? "" })}
                onChange={(e) =>
                  setValues({
                    ...values,
                    [f.name]:
                      f.type === "file" ? e.target.files[0] : e.target.value,
                  })
                }
              />
            )}
            {f.hint && <small className="muted">{f.hint}</small>}
          </label>
        ))}
      </div>
      {error && (
        <p role="alert" className="notice error">
          {error}
        </p>
      )}
      {success && (
        <p role="status" className="notice success">
          {success}
        </p>
      )}
      <button disabled={busy}>{busy ? "Saving…" : label}</button>
    </form>
  );
}
export function Action({ path, method = "DELETE", children, confirmMessage }) {
  const { refresh } = useSession();
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  return (
    <>
      <button
        className="secondary"
        disabled={busy}
        onClick={async () => {
          if (confirmMessage && !window.confirm(confirmMessage)) return;
          setBusy(true);
          setError("");
          try {
            await api(path, { method });
            refresh();
          } catch (e) {
            setError(e.message);
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? "Please wait…" : children}
      </button>
      {error && (
        <span role="alert" className="error">
          {error}
        </span>
      )}
    </>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
export const field = (name, label, type = "text", extra = {}) => ({
  name,
  label,
  type,
  ...extra,
});
