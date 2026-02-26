import React, { useEffect, useState } from "react";
import { LinearProgress, Stack, Typography } from "@mui/material";

export default function Timer({ seconds, onDone, onTick }) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => setTimeLeft(seconds), [seconds]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onDone?.();
      return;
    }

    const t = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        onTick?.(next);
        return next;
      });
    }, 1000);

    return () => clearInterval(t);
  }, [timeLeft, onDone, onTick]);

  const pct = Math.max(0, (timeLeft / seconds) * 100);

  return (
    <Stack spacing={1}>
      <Typography fontWeight={800}>Time Left: {timeLeft}s</Typography>
      <LinearProgress variant="determinate" value={pct} />
    </Stack>
  );
}
