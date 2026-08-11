import React from "react";
import Lexlet from "./Lexlet";
import MoreGames from "@skedwards88/shared-components/src/components/MoreGames";
import Rules from "./Rules";
import Stats from "./Stats";
import WhatsNew from "./WhatsNew";
import {gameInit} from "../logic/gameInit";
import {gameReducer} from "../logic/gameReducer";
import InstallOverview from "@skedwards88/shared-components/src/components/InstallOverview";
import PWAInstall from "@skedwards88/shared-components/src/components/PWAInstall";
import {hasVisitedSince} from "@skedwards88/shared-components/src/logic/hasVisitedSince";
import {getSeedFromDate} from "@skedwards88/shared-components/src/logic/getSeedFromDate";
import {getInitialState} from "../logic/getInitialState";
import {statsInit} from "../logic/statsInit";
import Settings from "./Settings";
import {sendAnalyticsCF} from "@skedwards88/shared-components/src/logic/sendAnalyticsCF";
import {useMetadataContext} from "@skedwards88/shared-components/src/components/MetadataContextProvider";
import {inferEventsToLog} from "../logic/inferEventsToLog";
import {useInstallPrompt} from "@skedwards88/shared-components/src/logic/handleInstall";
import {
  getFromStorage,
  saveToStorage,
} from "@skedwards88/shared-components/src/logic/safeStorage";

export type DisplayState =
  | "announcement"
  | "rules"
  | "stats"
  | "heart"
  | "settings"
  | "daily"
  | "installOverview"
  | "pwaInstall"
  | "game";

export default function App(): React.JSX.Element {
  const {userId, sessionId} = useMetadataContext();

  // This must live at the top level component, not in InstallOverview where it is used, since the InstallOverview is not rendered initially and therefore misses its chance to attach the listeners
  const {installPromptEvent, showInstallButton, handleInstall} =
    useInstallPrompt({userId, sessionId});

  // ******
  // Set up the display state
  // ******
  // Determine when the player last visited the game
  // This is used to determine whether to show the rules or an announcement instead of the game
  const lastVisitedYYYYMMDD = getFromStorage<string>("lexletLastVisited");
  const hasVisitedEver = Boolean(lastVisitedYYYYMMDD);
  const hasVisitedSinceLastAnnouncement = hasVisitedSince(
    lastVisitedYYYYMMDD,
    "20230609",
  );

  // Record that they visited today
  const [lastVisited, setLastVisited] = React.useState(getSeedFromDate());
  React.useEffect(() => {
    saveToStorage("lexletLastVisited", lastVisited);
  }, [lastVisited]);

  function handleVisibilityChange(): void {
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

    return (): void => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Determine what view to show the user
  const savedDisplay = getFromStorage<DisplayState>("lexletDisplay");
  const [display, setDisplay] = React.useState(
    getInitialState(
      savedDisplay,
      hasVisitedEver,
      hasVisitedSinceLastAnnouncement,
    ),
  );

  React.useEffect(() => {
    saveToStorage("lexletDisplay", display);
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
    saveToStorage("lexletGameSavedState", gameState);
  }, [gameState]);

  React.useEffect(() => {
    saveToStorage("lexletDailySavedState", dailyGameState);
  }, [dailyGameState]);

  // ******
  // End game states setup
  // ******

  // ******
  // Stats setup
  // ******
  const [stats, setStats] = React.useState(statsInit());

  React.useEffect(() => {
    saveToStorage("lexletStats", stats);
  }, [stats]);
  // ******
  // End stats setup
  // ******

  // Store the previous state so that we can infer which analytics events to send
  const previousGameStateRef = React.useRef(gameState);
  const previousDailyGameStateRef = React.useRef(dailyGameState);

  const isFirstRenderRef = React.useRef(true);
  const isFirstDailyRenderRef = React.useRef(true);

  // Send analytics following reducer updates, if needed
  React.useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      if (!gameState.isResumedFromSave) {
        sendAnalyticsCF({
          userId,
          sessionId,
          analyticsToLog: [
            {
              eventName: "new_game",
              eventInfo: {
                isDaily: gameState.isDaily,
                difficultyLevel: gameState.difficultyLevel,
              },
            },
          ],
        });
        return;
      }
    }

    const previousState = previousGameStateRef.current;

    const analyticsToLog = inferEventsToLog(previousState, gameState);

    if (analyticsToLog.length) {
      sendAnalyticsCF({userId, sessionId, analyticsToLog});
    }

    previousGameStateRef.current = gameState;
  }, [gameState, sessionId, userId]);

  React.useEffect(() => {
    if (isFirstDailyRenderRef.current) {
      isFirstDailyRenderRef.current = false;
      if (!dailyGameState.isResumedFromSave) {
        sendAnalyticsCF({
          userId,
          sessionId,
          analyticsToLog: [
            {
              eventName: "new_game",
              eventInfo: {
                isDaily: dailyGameState.isDaily,
                difficultyLevel: dailyGameState.difficultyLevel,
              },
            },
          ],
        });
        return;
      }
    }
    const previousState = previousDailyGameStateRef.current;

    const analyticsToLog = inferEventsToLog(previousState, dailyGameState);

    if (analyticsToLog.length) {
      sendAnalyticsCF({userId, sessionId, analyticsToLog});
    }

    previousDailyGameStateRef.current = dailyGameState;
  }, [dailyGameState, sessionId, userId]);

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
          googleAppLink={
            "https://play.google.com/store/apps/details?id=com.palettegame.twa&hl=en_US"
          }
          userId={userId}
          sessionId={sessionId}
          installPromptEvent={installPromptEvent}
          showInstallButton={showInstallButton}
          handleInstall={handleInstall}
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
          userId={userId}
          sessionId={sessionId}
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
