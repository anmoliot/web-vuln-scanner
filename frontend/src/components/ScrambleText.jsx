import React, { useState, useEffect } from "react";

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~|}{[]:;?><";

export const ScrambleText = ({ text, isHovered, className }) => {
  const [revealCursor, setRevealCursor] = useState(0);

  useEffect(() => {
    if (!isHovered) {
      setRevealCursor(0);
      return;
    }

    const interval = setInterval(() => {
      setRevealCursor((prev) => {
        if (prev >= text.length) {
          clearInterval(interval);
          return text.length;
        }
        return prev + 0.25; // 4 frames per char (0.25 chars per frame)
      });
    }, 25);

    return () => clearInterval(interval);
  }, [isHovered, text]);

  let displayString = "";
  if (!isHovered) {
    displayString = text;
  } else {
    for (let i = 0; i < text.length; i++) {
      if (i < revealCursor) {
        displayString += text[i];
      } else {
        if (text[i] === " ") {
          displayString += " ";
        } else {
          displayString += CHARSET[Math.floor(Math.random() * CHARSET.length)];
        }
      }
    }
  }

  return <span className={className}>{displayString}</span>;
};
