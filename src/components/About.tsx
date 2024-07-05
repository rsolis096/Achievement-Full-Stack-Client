import { useContext, useState } from "react";
import { SteamUserContextType } from "../interfaces/types.tsx";
import { SteamUserContext } from "../context/SteamUserContext.tsx";
import { DemoContextType } from "../interfaces/types.tsx";
import { DemoContext } from "../context/DemoModeContext.tsx";

import axios, { AxiosResponse } from "axios";

//Styling
import { Button } from "@nextui-org/react";

interface Result {
  authenticated: boolean;
  message: string;
  success: boolean;
}

function About() {
  const { user, setUser } = useContext<SteamUserContextType>(SteamUserContext);
  const { demoModeOn } = useContext<DemoContextType>(DemoContext);
  const [deletion, setDeletion] = useState<boolean>(false);

  const handleDeleteAccount = async () => {
    //Make a post request to the server to get user achievement info
    try {
      const response: AxiosResponse<Result> = await axios.post(
        import.meta.env.VITE_SERVER_DOMAIN + "/auth/deleteAccount",
        {
          headers: { "Content-Type": "application/json" },
        },
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setDeletion(true);
        setUser({
          authenticated: false,
          id: "none",
          displayName: "none",
          photos: [],
        });
      }
    } catch (err) {
      console.log(err);
    }
    return [];
  };

  return (
    <div id="about" className="w-full text-white p-6 ">
      <h1 className="text-4xl mb-4 font-bold underline">
        About Completion Tracker
      </h1>
      <p className="text-2xl mb-4">
        Completion Tracker is a comprehensive tool designed to help you track
        and manage your achievements across all your Steam games. By integrating
        directly with the Steam API, we provide you with up-to-date information
        about your game library and achievements.
      </p>
      <h2 className="text-3xl mb-2 font-bold underline">
        Privacy and Data Use
      </h2>
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
        <li>
          You may delete all your account information via the button at the
          bottom of this page. (You must be logged in)
        </li>
        <li>
          {" "}
          If you have any questions about our use of the Steam API or your data,
          please feel free to contact us at completiontracker@proton.me.
        </li>
      </ul>
      <h2 className="text-3xl mb-2 font-bold underline ">
        Steam API Terms of Service Compliance
      </h2>
      <p className="text-xl mb-1">
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

      <p className="text-xl mb-2 font-bold underline">
        Delete your Account Information
      </p>

      <p className="w-1/2">
        You can delete all your account information from our database by
        clicking the button below. This action is immediate and will log you
        out. Logging back in will restore your data using the Steam API.
      </p>
      <br />
      {user.authenticated && !demoModeOn ? (
        <Button onPress={handleDeleteAccount}>Delete Account Info</Button>
      ) : !deletion ? (
        <p> You must be logged in to delete your account.</p>
      ) : (
        <p>Account Deleted</p>
      )}
    </div>
  );
}
export default About;
