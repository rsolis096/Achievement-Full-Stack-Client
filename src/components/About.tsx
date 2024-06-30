function About() {
  return (
    <div id="about" className="w-full text-white p-6 ">
      <h1 className="text-4xl mb-4">About Completion Tracker</h1>
      <p className="text-2xl mb-4">
        Completion Tracker is a comprehensive tool designed to help you track
        and manage your achievements across all your Steam games. By integrating
        directly with the Steam API, we provide you with up-to-date information
        about your game library and achievements.
      </p>
      <h2 className="text-3xl mb-2">Privacy and Data Use</h2>
      <ul className="list-disc list-inside mb-4">
        <li>
          We store your Steam ID, username, profile picture, game library and
          game achievements.
        </li>
        <li>
          This information is used to access and display your achievements and
          achievement statistics.
        </li>
        <li>We do not share this information with any third parties.</li>
      </ul>
      <h2 className="text-3xl mb-2">Steam API Terms of Service Compliance</h2>
      <p className="text-xl mb-4">
        In accordance with the Steam API Terms of Service:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>
          We retrieve Steam Data only as requested by the end user and store it
          securely.
        </li>
        <li>
          We present the Steam Data on an "as is" basis, with disclaimers as per
          the Steam API Terms of Service.
        </li>
        <li>
          We do not intercept or store the end user's Steam password on login.
        </li>
        <li>
          We do not present the Steam Data in a way that implies endorsement by
          Valve or Steam.
        </li>
        <li>
          We do not use the Steam Web API or Steam Data for unsolicited
          marketing communications.
        </li>
        <li>
          We will promptly address any breaches of the Steam API Terms of
          Service by our users.
        </li>
      </ul>
      <p className="text-xl">
        If you have any questions about our use of the Steam API or your data,
        please feel free to contact us at completiontracker@proton.me.
      </p>
      <br />
      <p>This site is not affiliated with Steam or Valve.</p>
    </div>
  );
}
export default About;
