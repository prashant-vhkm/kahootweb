import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Stack,
  Typography,
  Alert,
  Box,
  Chip,
  Avatar,
  Fade,
  Zoom,
  Slide,
  Grow,
  useTheme,
  alpha,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import QuestionCard from "../components/QuestionCard";
import Leaderboard from "../components/Leaderboard";
import {
  EmojiEvents,
  Group,
  Quiz,
  Timer,
  CheckCircle,
  Cancel,
  HourglassEmpty,
  Celebration,
  Pin,
  Star,
  Whatshot,
  ContentCopy,
  CheckCircle as CheckCircleIcon,
  TrendingUp,
  Bolt,
  WorkspacePremium,
} from "@mui/icons-material";

export default function GamePlayer() {
  const theme = useTheme();
  const { pin } = useParams();
  const { socket } = useSocket();

  const [room, setRoom] = useState({ state: "lobby", players: [] });
  const [question, setQuestion] = useState(null);
  const [board, setBoard] = useState(null);
  const [result, setResult] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [copied, setCopied] = useState(false);

  // AndEvent red theme colors
  const andEventColors = {
    primary: "#DC2626",
    secondary: "#B91C1C",
    accent: "#EF4444",
    light: "#FEE2E2",
    dark: "#7F1D1D",
    gradient: "linear-gradient(135deg, #DC2626 0%, #B91C1C 50%, #991B1B 100%)",
  };

  useEffect(() => {
    // Get player name from localStorage or generate random
    const stored = localStorage.getItem("playerName");
    if (stored) {
      setPlayerName(stored);
    } else {
      const random = `Player${Math.floor(Math.random() * 1000)}`;
      localStorage.setItem("playerName", random);
      setPlayerName(random);
    }
  }, []);

  useEffect(() => {
    const onRoomUpdate = (payload) => {
      if (payload.pin === pin) setRoom(payload);
    };
    const onNewQuestion = (q) => {
      setQuestion(q);
      setBoard(null);
      setResult(null);
    };
    const onLeaderboard = (data) => {
      setBoard(data.players);
      setQuestion(null);
    };
    const onAnswerResult = (res) => setResult(res);

    socket.on("roomUpdate", onRoomUpdate);
    socket.on("newQuestion", onNewQuestion);
    socket.on("leaderboard", onLeaderboard);
    socket.on("answerResult", onAnswerResult);

    return () => {
      socket.off("roomUpdate", onRoomUpdate);
      socket.off("newQuestion", onNewQuestion);
      socket.off("leaderboard", onLeaderboard);
      socket.off("answerResult", onAnswerResult);
    };
  }, [socket, pin]);

  const submit = (answerIndex, timeLeft) => {
    socket.emit("submitAnswer", { pin, answerIndex, clientTimeLeft: timeLeft });
  };

  const copyPin = () => {
    navigator.clipboard.writeText(pin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPlayerScore = () => {
    if (!board) return null;
    const player = board.find((p) => p.name === playerName);
    return player?.score || 0;
  };

  const playerScore = getPlayerScore();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Fade in timeout={800}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 4,
            background: `linear-gradient(135deg, ${alpha(
              andEventColors.primary,
              0.02,
            )} 0%, ${alpha(andEventColors.secondary, 0.02)} 100%)`,
            position: "relative",
            overflow: "hidden",
            border: `1px solid ${alpha(andEventColors.accent, 0.1)}`,
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: andEventColors.gradient,
            },
          }}
        >
          {/* Animated background elements */}
          <Box
            sx={{
              position: "absolute",
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: alpha(andEventColors.accent, 0.03),
              animation: "pulse 6s infinite",
              "@keyframes pulse": {
                "0%, 100%": { transform: "scale(1)" },
                "50%": { transform: "scale(1.2)" },
              },
              zIndex: 0,
            }}
          />

          <Stack spacing={4} sx={{ position: "relative", zIndex: 1 }}>
            {/* Header Section */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  sx={{
                    background: andEventColors.gradient,
                    width: 60,
                    height: 60,
                    boxShadow: `0 5px 15px ${alpha(andEventColors.accent, 0.3)}`,
                  }}
                >
                  <Celebration sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={900}>
                    Event Player
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Tooltip title={copied ? "Copied!" : "Copy PIN"}>
                      <Chip
                        icon={<Pin sx={{ fontSize: 16 }} />}
                        label={`PIN: ${pin}`}
                        onClick={copyPin}
                        sx={{
                          bgcolor: alpha(andEventColors.accent, 0.1),
                          color: andEventColors.accent,
                          fontWeight: 700,
                          border: `1px solid ${alpha(andEventColors.accent, 0.3)}`,
                          cursor: "pointer",
                          "&:hover": {
                            bgcolor: alpha(andEventColors.accent, 0.2),
                          },
                        }}
                        size="small"
                      />
                    </Tooltip>
                    <Chip
                      icon={<Group sx={{ fontSize: 16 }} />}
                      label={`${room.players?.length || 0} Players`}
                      sx={{
                        bgcolor: alpha(andEventColors.secondary, 0.1),
                        color: andEventColors.secondary,
                        fontWeight: 700,
                        border: `1px solid ${alpha(andEventColors.secondary, 0.3)}`,
                      }}
                      size="small"
                    />
                  </Stack>
                </Box>
              </Stack>

              {/* Player Profile Card */}
              <Zoom in>
                <Paper
                  elevation={2}
                  sx={{
                    p: 1.5,
                    px: 3,
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${alpha(
                      andEventColors.primary,
                      0.1,
                    )} 0%, ${alpha(andEventColors.accent, 0.1)} 100%)`,
                    border: `1px solid ${alpha(andEventColors.accent, 0.2)}`,
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar
                      sx={{
                        background: andEventColors.gradient,
                        width: 44,
                        height: 44,
                      }}
                    >
                      {playerName.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Playing as
                      </Typography>
                      <Typography
                        fontWeight={700}
                        sx={{ color: andEventColors.accent }}
                      >
                        {playerName}
                      </Typography>
                    </Box>
                    {playerScore !== null && (
                      <Chip
                        icon={<Whatshot sx={{ fontSize: 16 }} />}
                        label={playerScore}
                        sx={{
                          bgcolor: alpha(andEventColors.accent, 0.2),
                          color: andEventColors.accent,
                          fontWeight: 700,
                          border: `1px solid ${alpha(andEventColors.accent, 0.3)}`,
                        }}
                        size="small"
                      />
                    )}
                  </Stack>
                </Paper>
              </Zoom>
            </Stack>

            <Divider sx={{ borderBottomWidth: 2 }}>
              <Chip
                label={
                  room.state === "lobby"
                    ? "Lobby"
                    : room.state === "question"
                      ? "Question Time!"
                      : "Results"
                }
                sx={{
                  bgcolor:
                    room.state === "lobby"
                      ? alpha(andEventColors.secondary, 0.1)
                      : room.state === "question"
                        ? alpha(andEventColors.accent, 0.1)
                        : alpha(theme.palette.success.main, 0.1),
                  color:
                    room.state === "lobby"
                      ? andEventColors.secondary
                      : room.state === "question"
                        ? andEventColors.accent
                        : theme.palette.success.main,
                  fontWeight: 700,
                  px: 2,
                  border: `1px solid ${
                    room.state === "lobby"
                      ? alpha(andEventColors.secondary, 0.3)
                      : room.state === "question"
                        ? alpha(andEventColors.accent, 0.3)
                        : alpha(theme.palette.success.main, 0.3)
                  }`,
                }}
                icon={
                  room.state === "lobby" ? (
                    <HourglassEmpty />
                  ) : room.state === "question" ? (
                    <Quiz />
                  ) : (
                    <EmojiEvents />
                  )
                }
              />
            </Divider>

            {/* Lobby State */}
            {room.state === "lobby" && (
              <Fade in timeout={500}>
                <Card
                  elevation={0}
                  sx={{
                    bgcolor: alpha(andEventColors.secondary, 0.03),
                    borderRadius: 3,
                    textAlign: "center",
                    py: 4,
                    border: `1px solid ${alpha(andEventColors.accent, 0.1)}`,
                  }}
                >
                  <CardContent>
                    <Zoom in>
                      <Avatar
                        sx={{
                          width: 100,
                          height: 100,
                          background: andEventColors.gradient,
                          mx: "auto",
                          mb: 2,
                          animation: "pulse 2s infinite",
                          "@keyframes pulse": {
                            "0%": { transform: "scale(1)" },
                            "50%": { transform: "scale(1.1)" },
                            "100%": { transform: "scale(1)" },
                          },
                        }}
                      >
                        <HourglassEmpty sx={{ fontSize: 50 }} />
                      </Avatar>
                    </Zoom>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                      Waiting for Host
                    </Typography>
                    <Typography
                      color="text.secondary"
                      sx={{ mb: 3, fontSize: "1.1rem" }}
                    >
                      The event hasn't started yet. The host will begin shortly.
                    </Typography>

                    {/* Event PIN Display */}
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        mb: 3,
                        bgcolor: alpha(andEventColors.dark, 0.02),
                        borderRadius: 2,
                        border: `2px dashed ${alpha(andEventColors.accent, 0.3)}`,
                        display: "inline-block",
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography
                          variant="h3"
                          fontWeight={900}
                          sx={{
                            color: andEventColors.accent,
                            letterSpacing: 4,
                          }}
                        >
                          {pin}
                        </Typography>
                        <IconButton
                          onClick={copyPin}
                          size="small"
                          sx={{ color: andEventColors.accent }}
                        >
                          {copied ? <CheckCircleIcon /> : <ContentCopy />}
                        </IconButton>
                      </Stack>
                    </Paper>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 1,
                        flexWrap: "wrap",
                        mt: 2,
                      }}
                    >
                      {room.players?.map((player, index) => (
                        <Grow
                          key={player.id || index}
                          in
                          timeout={500 + index * 100}
                        >
                          <Chip
                            avatar={
                              <Avatar sx={{ bgcolor: andEventColors.accent }}>
                                {player.name.charAt(0).toUpperCase()}
                              </Avatar>
                            }
                            label={player.name}
                            sx={{
                              fontWeight: 600,
                              bgcolor: alpha(andEventColors.accent, 0.05),
                              border: `1px solid ${alpha(andEventColors.accent, 0.2)}`,
                              color:
                                player.name === playerName
                                  ? andEventColors.accent
                                  : "inherit",
                            }}
                          />
                        </Grow>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            )}

            {/* Question State */}
            {question && (
              <Fade in timeout={500}>
                <Stack spacing={3}>
                  {/* Result Alert */}
                  <Zoom in={result !== null}>
                    <Box>
                      {result?.isCorrect === true && (
                        <Alert
                          icon={<CheckCircle fontSize="inherit" />}
                          severity="success"
                          sx={{
                            borderRadius: 2,
                            animation: "slideIn 0.3s ease",
                            border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                            "@keyframes slideIn": {
                              from: {
                                transform: "translateY(-20px)",
                                opacity: 0,
                              },
                              to: { transform: "translateY(0)", opacity: 1 },
                            },
                          }}
                        >
                          <Typography variant="body1" fontWeight={600}>
                            <Bolt sx={{ verticalAlign: "middle", mr: 1 }} />
                            Correct! Great job! 🎉
                          </Typography>
                        </Alert>
                      )}
                      {result?.isCorrect === false && (
                        <Alert
                          icon={<Cancel fontSize="inherit" />}
                          severity="error"
                          sx={{
                            borderRadius: 2,
                            animation: "slideIn 0.3s ease",
                            border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
                          }}
                        >
                          <Typography variant="body1" fontWeight={600}>
                            Wrong answer. Better luck next time! 💪
                          </Typography>
                        </Alert>
                      )}
                    </Box>
                  </Zoom>

                  {/* Question Card */}
                  <Slide direction="up" in mountOnEnter unmountOnExit>
                    <Box>
                      <QuestionCard question={question} onSubmit={submit} />
                    </Box>
                  </Slide>

                  {/* Players in room */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: alpha(andEventColors.accent, 0.02),
                      borderRadius: 2,
                      border: `1px solid ${alpha(andEventColors.accent, 0.1)}`,
                    }}
                  >
                    <Stack spacing={1}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Group
                          sx={{ color: andEventColors.accent, fontSize: 20 }}
                        />
                        <Typography
                          variant="subtitle2"
                          fontWeight={600}
                          sx={{ color: andEventColors.accent }}
                        >
                          Players in event ({room.players?.length})
                        </Typography>
                      </Stack>
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {room.players?.map((player, index) => (
                          <Chip
                            key={player.id || index}
                            avatar={
                              <Avatar
                                sx={{
                                  bgcolor:
                                    player.name === playerName
                                      ? andEventColors.accent
                                      : alpha(andEventColors.accent, 0.3),
                                }}
                              >
                                {player.name.charAt(0).toUpperCase()}
                              </Avatar>
                            }
                            label={player.name}
                            size="small"
                            sx={{
                              fontWeight: 600,
                              bgcolor:
                                player.name === playerName
                                  ? alpha(andEventColors.accent, 0.1)
                                  : "transparent",
                              border: `1px solid ${alpha(andEventColors.accent, 0.2)}`,
                              color:
                                player.name === playerName
                                  ? andEventColors.accent
                                  : "inherit",
                            }}
                          />
                        ))}
                      </Box>
                    </Stack>
                  </Paper>

                  {/* Live indicator */}
                  <Fade in>
                    <Chip
                      icon={<TrendingUp />}
                      label="Live"
                      sx={{
                        alignSelf: "flex-start",
                        bgcolor: alpha(andEventColors.accent, 0.1),
                        color: andEventColors.accent,
                        fontWeight: 700,
                        animation: "pulse 2s infinite",
                      }}
                    />
                  </Fade>
                </Stack>
              </Fade>
            )}

            {/* Leaderboard State */}
            {board && (
              <Fade in timeout={500}>
                <Stack spacing={3}>
                  {/* Congratulations for winner */}
                  {board.length > 0 && board[0]?.name === playerName && (
                    <Zoom in>
                      <Card
                        sx={{
                          borderRadius: 3,
                          background: `linear-gradient(135deg, ${alpha(
                            andEventColors.accent,
                            0.1,
                          )} 0%, ${alpha(andEventColors.primary, 0.1)} 100%)`,
                          border: `1px solid ${alpha(andEventColors.accent, 0.2)}`,
                        }}
                      >
                        <CardContent sx={{ textAlign: "center", py: 3 }}>
                          <Zoom in>
                            <Avatar
                              sx={{
                                width: 70,
                                height: 70,
                                background: andEventColors.gradient,
                                mx: "auto",
                                mb: 1,
                              }}
                            >
                              <WorkspacePremium sx={{ fontSize: 40 }} />
                            </Avatar>
                          </Zoom>
                          <Typography
                            variant="h4"
                            fontWeight={700}
                            gutterBottom
                            sx={{ color: andEventColors.accent }}
                          >
                            You're in the Lead! 🏆
                          </Typography>
                          <Typography color="text.secondary" variant="h6">
                            Keep up the great work!
                          </Typography>
                        </CardContent>
                      </Card>
                    </Zoom>
                  )}

                  {/* Leaderboard */}
                  <Leaderboard players={board} currentPlayer={playerName} />

                  {/* Waiting indicator */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      bgcolor: alpha(andEventColors.accent, 0.03),
                      borderRadius: 3,
                      textAlign: "center",
                      border: `1px solid ${alpha(andEventColors.accent, 0.1)}`,
                    }}
                  >
                    <Stack spacing={2} alignItems="center">
                      <CircularProgress
                        size={40}
                        sx={{
                          color: andEventColors.accent,
                          "& .MuiCircularProgress-circle": {
                            stroke: andEventColors.accent,
                          },
                        }}
                      />
                      <Typography variant="h6" color="text.secondary">
                        Waiting for the next question...
                      </Typography>
                      <Chip
                        icon={<Timer />}
                        label="Stay tuned"
                        sx={{
                          bgcolor: alpha(andEventColors.accent, 0.1),
                          color: andEventColors.accent,
                        }}
                      />
                    </Stack>
                  </Paper>
                </Stack>
              </Fade>
            )}

            {/* Connection Status */}
            <Grow in>
              <Paper
                sx={{
                  p: 1,
                  px: 2,
                  borderRadius: 2,
                  bgcolor: alpha(andEventColors.accent, 0.05),
                  border: `1px solid ${alpha(andEventColors.accent, 0.1)}`,
                  display: "inline-flex",
                  alignItems: "center",
                  alignSelf: "center",
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: "#4CAF50",
                    mr: 1,
                    animation: "pulse 2s infinite",
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  Connected to event
                </Typography>
              </Paper>
            </Grow>
          </Stack>
        </Paper>
      </Fade>
    </Container>
  );
}
