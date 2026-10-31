import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { api, API } from "./api";
const Context = createContext(null);
export function SessionProvider({ children }) {
  const [session, setSession] = useState(null),
    [ready, setReady] = useState(() => !localStorage.getItem("token")),
    [revision, setRevision] = useState(0),
    [live, setLive] = useState("Connecting");
  const refresh = useCallback(() => setRevision((v) => v + 1), []);
  const logout = useCallback(() => {
    ["token", "student", "teacher", "role", "teacherToken"].forEach((k) =>
      localStorage.removeItem(k),
    );
    setSession(null);
  }, []);
  useEffect(() => {
    let active = true;
    if (!localStorage.getItem("token")) return;
    api("/auth/me")
      .then((data) => {
        if (active) setSession(data);
      })
      .catch(() => logout())
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, [logout]);
  useEffect(() => {
    window.addEventListener("session-expired", logout);
    return () => window.removeEventListener("session-expired", logout);
  }, [logout]);
  useEffect(() => {
    if (!session) return;
    const controller = new AbortController();
    let timer;
    const connect = async () => {
      setLive("Connecting");
      try {
        const res = await fetch(API + "/events", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          signal: controller.signal,
        });
        if (res.status === 401) {
          logout();
          return;
        }
        if (!res.ok) throw new Error("Live connection failed");
        setLive("Live");
        refresh();
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        while (!controller.signal.aborted) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          let end;
          while ((end = buffer.indexOf("\n\n")) >= 0) {
            const block = buffer.slice(0, end);
            buffer = buffer.slice(end + 2);
            if (block.startsWith("data:")) refresh();
          }
        }
      } catch {
        if (controller.signal.aborted) return;
      }
      if (!controller.signal.aborted) {
        setLive("Reconnecting");
        timer = setTimeout(connect, 3000);
      }
    };
    connect();
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    return () => {
      controller.abort();
      clearTimeout(timer);
      window.removeEventListener("focus", onFocus);
    };
  }, [session, logout, refresh]);
  const login = async (role, body) => {
    const data = await api(
      role === "Teacher" ? "/teacher/login" : "/student/login",
      { method: "POST", body },
    );
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", role);
    setSession({ role, account: data[role.toLowerCase()] });
    refresh();
  };
  return (
    <Context.Provider
      value={{ session, ready, login, logout, revision, refresh, live }}
    >
      {children}
    </Context.Provider>
  );
}
// This module deliberately co-locates the provider and its public hooks.
// eslint-disable-next-line react-refresh/only-export-components
export const useSession = () => useContext(Context);
// eslint-disable-next-line react-refresh/only-export-components
export function useQuery(path) {
  const { revision } = useSession();
  const [state, setState] = useState({ data: null, error: "", loading: true });
  useEffect(() => {
    const controller = new AbortController();
    if (!path) return;
    api(path, { signal: controller.signal })
      .then((data) => {
        if (controller.signal.aborted) return;
        const isList = ["/student", "/placement", "/guidance", "/training"].includes(path) || path.startsWith("/notification/") || path.startsWith("/guidance/");
        if (isList && !Array.isArray(data)) throw new Error("Server returned an invalid list.");
        setState({ data, error: "", loading: false });
      })
      .catch((e) => {
        if (!controller.signal.aborted)
          setState((prev) => ({ ...prev, error: e.message, loading: false }));
      });
    return () => controller.abort();
  }, [path, revision]);
  return state;
}
