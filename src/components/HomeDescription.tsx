function HomeDescription() {
  return (
    <>
      <h1 className="text-4xl mb-4">Welcome to Completion Tracker</h1>
      <p className="text-2xl mb-4">
        Steam Achievement Tracker is a comprehensive tool designed to help you
        track and manage your achievements across all your Steam games. By
        integrating directly with the Steam API, we provide you with up-to-date
        information about your game library and achievements.
      </p>
      <b className="text-xl mb-2 block">Features:</b>
      <ul className="list-disc list-inside mb-4">
        <li>
          View detailed statistics and progress for each game in your library
        </li>
        <li>Toggle demo mode to explore the site without logging in</li>
        <li>PLANNED: Compare your achievements with global stats</li>
        <li>PLANNED: Explore the most popular games and their achievements</li>
      </ul>
      <p className="mb-4">
        To get started, simply sign in with your Steam account using the "Sign
        in with Steam" button above. You can also explore the site in demo mode
        to see how it works. If you have any questions or need support, feel
        free to contact us.
      </p>
    </>
  );
}

export default HomeDescription;
