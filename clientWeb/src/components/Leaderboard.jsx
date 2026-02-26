import React from "react";
import {
  Paper,
  Stack,
  Typography,
  Avatar,
  Box,
  useTheme,
  alpha,
  Fade,
  Grow,
} from "@mui/material";
import { EmojiEvents, Star, MilitaryTech } from "@mui/icons-material";

export default function Leaderboard({ players, currentPlayer }) {
  const theme = useTheme();

  if (!players || players.length === 0) {
    return (
      <Paper
        sx={{
          p: 4,
          textAlign: "center",
          bgcolor: alpha(theme.palette.grey[500], 0.05),
          borderRadius: 3,
        }}
      >
        <Typography color="text.secondary">No scores yet</Typography>
      </Paper>
    );
  }

  // Sort players by score in descending order
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  const getMedalColor = (index) => {
    switch (index) {
      case 0:
        return theme.palette.warning.main; // Gold
      case 1:
        return theme.palette.grey[400]; // Silver
      case 2:
        return theme.palette.warning.dark; // Bronze
      default:
        return theme.palette.primary.main;
    }
  };

  const getMedalIcon = (index) => {
    if (index === 0) return <EmojiEvents sx={{ fontSize: 20 }} />;
    if (index === 1) return <MilitaryTech sx={{ fontSize: 20 }} />;
    if (index === 2) return <Star sx={{ fontSize: 20 }} />;
    return null;
  };

  return (
    <Fade in timeout={500}>
      <Paper
        elevation={2}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Stack spacing={0.5} sx={{ p: 2 }}>
          {sortedPlayers.map((player, index) => {
            const isCurrentPlayer = player.name === currentPlayer;
            const medalColor = getMedalColor(index);
            const medalIcon = getMedalIcon(index);

            return (
              <Grow
                key={player.id || player.name}
                in
                timeout={500 + index * 100}
              >
                <Paper
                  elevation={isCurrentPlayer ? 3 : 0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: isCurrentPlayer
                      ? alpha(theme.palette.primary.main, 0.1)
                      : index % 2 === 0
                        ? alpha(theme.palette.background.default, 0.5)
                        : "transparent",
                    border: isCurrentPlayer
                      ? `2px solid ${theme.palette.primary.main}`
                      : "2px solid transparent",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateX(8px)",
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                    },
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    {/* Rank */}
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        bgcolor: alpha(medalColor, 0.1),
                        color: medalColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 900,
                        fontSize: "1.2rem",
                      }}
                    >
                      {medalIcon || index + 1}
                    </Box>

                    {/* Avatar and Name */}
                    <Avatar
                      sx={{
                        bgcolor: medalColor,
                        width: 44,
                        height: 44,
                        border: `3px solid ${alpha(medalColor, 0.3)}`,
                      }}
                    >
                      {player.name.charAt(0).toUpperCase()}
                    </Avatar>

                    <Box sx={{ flex: 1 }}>
                      <Typography
                        fontWeight={isCurrentPlayer ? 900 : 700}
                        sx={{
                          color: isCurrentPlayer
                            ? theme.palette.primary.main
                            : "text.primary",
                        }}
                      >
                        {player.name}
                        {isCurrentPlayer && " (You)"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Rank #{index + 1}
                      </Typography>
                    </Box>

                    {/* Score */}
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1,
                        px: 2,
                        borderRadius: 3,
                        bgcolor: alpha(medalColor, 0.1),
                        border: `1px solid ${alpha(medalColor, 0.3)}`,
                      }}
                    >
                      <Typography fontWeight={900} sx={{ color: medalColor }}>
                        {player.score} pts
                      </Typography>
                    </Paper>
                  </Stack>
                </Paper>
              </Grow>
            );
          })}
        </Stack>
      </Paper>
    </Fade>
  );
}
