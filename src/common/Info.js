import React from "react";

export default function Info({ id, info, sideEffectShow, sideEffectHide }) {
  const [showInfo, setShowInfo] = React.useState(false);

  function handleShowInfo() {
    if (!showInfo && sideEffectShow) {
      sideEffectShow();
    }

    if (showInfo && sideEffectHide) {
      sideEffectHide();
    }

    setShowInfo(!showInfo);
  }

  return showInfo ? (
    <div className="modal">
      <div id="info">{info}</div>
      <button className="close" onClick={() => handleShowInfo()}>
        CLOSE
      </button>
    </div>
  ) : (
    <button id={id} onClick={() => handleShowInfo()}></button>
  );
}
