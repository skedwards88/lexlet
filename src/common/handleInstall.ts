import type {BeforeInstallPromptEvent} from "../Types";
import sendAnalytics from "./sendAnalytics";

async function handleInstall(
  installPromptEvent: BeforeInstallPromptEvent,
  setInstallPromptEvent: React.Dispatch<
    React.SetStateAction<BeforeInstallPromptEvent | null>
  >,
): Promise<void> {
  console.log("handling install");
  console.log(installPromptEvent);
  installPromptEvent.prompt();
  const result = await installPromptEvent.userChoice;
  console.log(result);
  setInstallPromptEvent(null);
  sendAnalytics("install");
}

function handleBeforeInstallPrompt(
  event: BeforeInstallPromptEvent,
  setInstallPromptEvent: React.Dispatch<
    React.SetStateAction<BeforeInstallPromptEvent | null>
  >,
  setShowInstallButton: React.Dispatch<React.SetStateAction<boolean>>,
): void {
  console.log("handleBeforeInstallPrompt");
  if (event) setInstallPromptEvent(event);
  setShowInstallButton(true);
}

function handleAppInstalled(
  setInstallPromptEvent: React.Dispatch<
    React.SetStateAction<BeforeInstallPromptEvent | null>
  >,
  setShowInstallButton: React.Dispatch<React.SetStateAction<boolean>>,
): void {
  console.log("handleAppInstalled");
  setInstallPromptEvent(null);
  setShowInstallButton(false);
}

export {handleInstall, handleBeforeInstallPrompt, handleAppInstalled};
