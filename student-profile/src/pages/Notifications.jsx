import { useSession, useQuery } from "../state";
import { Heading, Status, Empty, Action } from "../components";
import { date } from "../api";
export default function Notifications() {
  const { session } = useSession();
  const q = useQuery(
    "/notification/" + encodeURIComponent(session.account.prn),
  );
  return (
    <>
      <Heading
        title="Notifications"
        subtitle="Placement opportunities for your eligibility."
      />
      <Status query={q} />
      {!q.loading && !q.error && !q.data?.length && (
        <Empty>You’re all caught up.</Empty>
      )}
      <div className="stack">
        {q.data?.map((n) => (
          <article
            className={"card " + (!n.isRead ? "unread" : "")}
            key={n._id}
          >
            <div className="section-title">
              <h3>{n.title}</h3>
              <span className="badge">{n.isRead ? "Read" : "New"}</span>
            </div>
            <p>{n.message}</p>
            <small className="muted">{date(n.createdAt)}</small>
            {!n.isRead && (
              <div className="button-row">
                <Action method="PUT" path={"/notification/read/" + n._id}>
                  Mark as read
                </Action>
              </div>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
