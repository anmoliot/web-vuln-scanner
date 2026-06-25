import React, { useState, useEffect } from "react";

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~|}{[]:;?><";

export const ScrambleIn = ({ text, delay, triggered }) => {
  const [revealProgress, setRevealProgress] = useState(-1);

  useEffect(() => {
    if (!triggered) {
      setRevealProgress(-1);
      return;
    }

    const startTimeout = setTimeout(() => {
      setRevealProgress(0);
      
      const interval = setInterval(() => {
        setRevealProgress((prev) => {
          if (prev >= text.length) {
            clearInterval(interval);
            return text.length;
          }
          return prev + 0.5; // 0.5 chars per frame (25ms)
        });
      }, 25);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [triggered, delay, text]);

  if (!triggered || revealProgress === -1) {
    return <span dangerouslySetInnerHTML={{ __html: "&nbsp;" }} />;
  }

  let displayString = "";
  const progress = Math.min(revealProgress, text.length);

  for (let i = 0; i < text.length; i++) {
    if (i < progress) {
      displayString += text[i];
    } else if (i < progress + 3) {
      if (text[i] === " ") {
        displayString += " ";
      } else {
        const randChar = CHARSET[Math.floor(Math.random() * CHARSET.length)];
        displayString += randChar;
      }
    } else {
      break;
    }
  }

  return <span>{displayString}</span>;
};
