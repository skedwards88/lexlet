import sendAnalytics from "../common/sendAnalytics";

// todo change to use the common handleShare component
function handleShare(text: string): void {
  navigator
    .share({
      title: "Lexlet",
      text: `${text}\n\n`,
      url: "https://lexlet.com/",
    })
    .then(() => console.log("Successful share"))
    .catch((error) => {
      console.log("Error sharing", error);
    });

  sendAnalytics("share");
}

function handleCopy(text: string): void {
  try {
    navigator.clipboard.writeText(`${text}\n\nhttps://lexlet.com/`);
  } catch (error) {
    console.log(error);
  }
}

export default function Share({text}: {text: string}): React.JSX.Element {
  if (navigator.canShare?.()) {
    return <button onClick={() => handleShare(text)}>Share</button>;
  } else {
    return <button onClick={() => handleCopy(text)}>Copy link</button>;
  }
}
