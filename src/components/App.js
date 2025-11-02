import React from "react";
import Lexlet from "./Lexlet";
import MoreGames from "@skedwards88/shared-components/src/components/MoreGames";
import Rules from "./Rules";
import Stats from "./Stats";
import WhatsNew from "./WhatsNew";
import {gameInit} from "../logic/gameInit";
import {gameReducer} from "../logic/gameReducer";
import {
  handleAppInstalled,
  handleBeforeInstallPrompt,
} from "@skedwards88/shared-components/src/logic/handleInstall";
import InstallOverview from "@skedwards88/shared-components/src/components/InstallOverview";
import PWAInstall from "@skedwards88/shared-components/src/components/PWAInstall";
import {hasVisitedSince} from "@skedwards88/shared-components/src/logic/hasVisitedSince";
import {getSeedFromDate} from "@skedwards88/shared-components/src/logic/getSeedFromDate";
import {getInitialState} from "../logic/getInitialState";
import {statsInit} from "../logic/statsInit";
import Settings from "./Settings";
import {getUserId} from "@skedwards88/shared-components/src/logic/getUserId";
import {v4 as uuidv4} from "uuid";
import {sendAnalyticsCF} from "@skedwards88/shared-components/src/logic/sendAnalyticsCF";
import {isRunningStandalone} from "@skedwards88/shared-components/src/logic/isRunningStandalone";

export default function App() {
  // *****
  // Install handling setup
  // *****
  // Set up states that will be used by the handleAppInstalled and handleBeforeInstallPrompt listeners
  const [installPromptEvent, setInstallPromptEvent] = React.useState();
  const [showInstallButton, setShowInstallButton] = React.useState(true);

  React.useEffect(() => {
    // Need to store the function in a variable so that
    // the add and remove actions can reference the same function
    const listener = (event) =>
      handleBeforeInstallPrompt(
        event,
        setInstallPromptEvent,
        setShowInstallButton,
      );

    window.addEventListener("beforeinstallprompt", listener);

    return () => window.removeEventListener("beforeinstallprompt", listener);
  }, []);

  React.useEffect(() => {
    // Need to store the function in a variable so that
    // the add and remove actions can reference the same function
    const listener = () =>
      handleAppInstalled(setInstallPromptEvent, setShowInstallButton);

    window.addEventListener("appinstalled", listener);

    return () => window.removeEventListener("appinstalled", listener);
  }, []);
  // *****
  // End install handling setup
  // *****

  // ******
  // Set up the display state
  // ******
  // Determine when the player last visited the game
  // This is used to determine whether to show the rules or an announcement instead of the game
  const lastVisitedYYYYMMDD = JSON.parse(
    localStorage.getItem("lexletLastVisited"),
  );
  const hasVisitedEver = Boolean(lastVisitedYYYYMMDD);
  const hasVisitedSinceLastAnnouncement = hasVisitedSince(
    lastVisitedYYYYMMDD,
    "20230609",
  );

  // Record that they visited today
  const [lastVisited, setLastVisited] = React.useState(getSeedFromDate());
  React.useEffect(() => {
    window.localStorage.setItem(
      "lexletLastVisited",
      JSON.stringify(lastVisited),
    );
  }, [lastVisited]);

  function handleVisibilityChange() {
    // If the visibility of the app changes to become visible,
    // update the state to force the app to re-render.
    // This is to help the daily challenge refresh if the app has
    // been open in the background since an earlier challenge.
    if (!document.hidden) {
      setLastVisited(getSeedFromDate());
    }
  }

  React.useEffect(() => {
    // When the component is mounted, attach the visibility change event listener
    // (and remove the event listener when the component is unmounted).
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Determine what view to show the user
  const savedDisplay = JSON.parse(localStorage.getItem("lexletDisplay"));
  const [display, setDisplay] = React.useState(
    getInitialState(
      savedDisplay,
      hasVisitedEver,
      hasVisitedSinceLastAnnouncement,
    ),
  );

  React.useEffect(() => {
    window.localStorage.setItem("lexletDisplay", JSON.stringify(display));
  }, [display]);
  // ******
  // End set up the display state
  // ******

  // ******
  // Game states setup
  // ******
  const [dailyGameState, dispatchDailyGameState] = React.useReducer(
    gameReducer,
    {isDaily: true},
    gameInit,
  );

  const [gameState, dispatchGameState] = React.useReducer(
    gameReducer,
    {},
    gameInit,
  );

  React.useEffect(() => {
    window.localStorage.setItem(
      "lexletGameSavedState",
      JSON.stringify(gameState),
    );
  }, [gameState]);

  React.useEffect(() => {
    window.localStorage.setItem(
      "lexletDailySavedState",
      JSON.stringify(dailyGameState),
    );
  }, [dailyGameState]);

  // ******
  // End game states setup
  // ******

  // ******
  // Stats setup
  // ******
  const [stats, setStats] = React.useState(statsInit());

  React.useEffect(() => {
    window.localStorage.setItem("lexletStats", JSON.stringify(stats));
  }, [stats]);
  // ******
  // End stats setup
  // ******

  // ******
  // Start analytics setup
  // ******

  // Store userID and sessionID so don't have to read local storage every time
  const userId = getUserId("lexlet_uid");
  const sessionId = uuidv4();

  // Send analytics on load
  React.useEffect(() => {
    sendAnalyticsCF({
      userId,
      sessionId,
      analyticsToLog: [
        {
          eventName: "app_load",
          // os, browser, and isMobile are parsed on the server from the user agent headers
          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
          isStandalone: isRunningStandalone(),
          devicePixelRatio: window.devicePixelRatio,
        },
      ],
    });
    // Just run once on app load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Send analytics following reducer updates, if needed
  React.useEffect(() => {
    const analyticsToLog = gameState.analyticsToLog;

    if (!analyticsToLog || !analyticsToLog.length) {
      return;
    }

    sendAnalyticsCF({userId, sessionId, analyticsToLog});
  }, [gameState?.analyticsToLog, sessionId, userId]);

  // ******
  // End analytics setup
  // ******

  switch (display) {
    case "announcement":
      return <WhatsNew setDisplay={setDisplay}></WhatsNew>;

    case "rules":
      return <Rules setDisplay={setDisplay}></Rules>;

    case "stats":
      return <Stats setDisplay={setDisplay} stats={stats}></Stats>;

    case "heart":
      return (
        <MoreGames
          setDisplay={setDisplay}
          games={["crossjig", "blobble", "wordfall", "gribbles", "logicGrid"]}
          repoName={"lexlet"}
          includeExtraInfo={true}
          includeWordAttribution={true}
          googleLink={
            "https://play.google.com/store/apps/details?id=com.palettegame.twa&hl=en_US"
          }
        ></MoreGames>
      );

    case "settings":
      return (
        <Settings
          setDisplay={setDisplay}
          dispatchGameState={dispatchGameState}
          gameState={gameState}
        />
      );

    case "daily":
      // force reinitialize the daily state if the day has changed
      if (dailyGameState.seed != getSeedFromDate()) {
        dispatchDailyGameState({
          action: "newGame",
          isDaily: true,
          useSaved: false,
        });
      }
      return (
        <Lexlet
          setDisplay={setDisplay}
          gameState={dailyGameState}
          dispatchGameState={dispatchDailyGameState}
          stats={stats}
          setStats={setStats}
          isDaily={true}
          dailyIsSolved={dailyGameState.clueMatches.every((i) => i)}
        ></Lexlet>
      );

    case "installOverview":
      return (
        <InstallOverview
          setDisplay={setDisplay}
          setInstallPromptEvent={setInstallPromptEvent}
          showInstallButton={showInstallButton}
          installPromptEvent={installPromptEvent}
          googleAppLink={
            "https://play.google.com/store/apps/details?id=com.palettegame.twa&hl=en_US"
          }
        ></InstallOverview>
      );

    case "pwaInstall":
      return (
        <PWAInstall
          setDisplay={setDisplay}
          googleAppLink={
            "https://play.google.com/store/apps/details?id=com.palettegame.twa&hl=en_US"
          }
          pwaLink={"https://lexlet.com"}
        ></PWAInstall>
      );

    default:
      return (
        <Lexlet
          setDisplay={setDisplay}
          gameState={gameState}
          dispatchGameState={dispatchGameState}
          stats={stats}
          setStats={setStats}
          isDaily={false}
          dailyIsSolved={dailyGameState.clueMatches.every((i) => i)}
        ></Lexlet>
      );
  }
}
