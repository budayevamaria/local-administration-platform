export function Terms() {
  return (
    <div className="page prose card">
      <h1>Terms & Conditions</h1>
      <p>
        Represent is a civic feedback platform. Residents may view public works, rate completed
        jobs, and leave comments. Administration representatives may publish posts, photos, and
        replies. Ratings must reflect personal experience of the published work. Harassment and
        false reports are not allowed.
      </p>
    </div>
  );
}

export function Privacy() {
  return (
    <div className="page prose card">
      <h1>Privacy Policy</h1>
      <p>
        This mock frontend stores data only in the browser session. A production backend would keep
        accounts, posts, comments, and ratings in MongoDB and protect access with JWT
        authentication.
      </p>
    </div>
  );
}

export function About() {
  return (
    <div className="page prose card">
      <h1>About Represent</h1>
      <p>
        Represent helps residents evaluate the work of local administration. Akims publish results,
        residents react with scores and comments, and the system calculates average ratings for each
        post and profile. Unlike ticket portals, Represent is a public feed: work is visible, scores
        are shared, and discussion stays attached to the completed result.
      </p>
    </div>
  );
}
