import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  Container,
  Paper,
  Stack,
  Typography,
  Button,
  Alert,
  Divider,
  Box,
  Chip,
  Avatar,
  Badge,
  LinearProgress,
  Card,
  CardContent,
  Fade,
  Grow,
  Zoom,
  Slide,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  Modal,
  Backdrop,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import Leaderboard from "../components/Leaderboard";
import {
  EmojiEvents,
  Group,
  PlayArrow,
  SkipNext,
  Timer,
  Quiz,
  Lock,
  People,
  Person,
  Celebration,
  Whatshot,
  ContentCopy,
  CheckCircle,
  VideogameAsset,
  BarChart,
  Stars,
  TrendingUp,
  FlashOn,
  QrCodeScanner,
  Download,
  Close,
  Link as LinkIcon,
} from "@mui/icons-material";
import QRCode from "qrcode";

export default function GameHost() {
  const theme = useTheme();
  const { pin } = useParams();
  const { socket } = useSocket();

  const [room, setRoom] = useState({ state: "lobby", players: [] });
  const [question, setQuestion] = useState(null);
  const [board, setBoard] = useState(null);
  const [err, setErr] = useState("");
  const [timeLeft, setTimeLeft] = useState(null);
  const [copied, setCopied] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrCopied, setQrCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState(null);

  // Refs for QR code canvases
  const qrCanvasRef = useRef(null);

  // AndEvent red theme colors
  const andEventColors = {
    primary: "#DC2626",
    secondary: "#B91C1C",
    accent: "#EF4444",
    light: "#FEE2E2",
    dark: "#7F1D1D",
    gradient: "linear-gradient(135deg, #DC2626 0%, #B91C1C 50%, #991B1B 100%)",
  };

  const baseUrl = "http://localhost:5173";
  const joinUrl = `${baseUrl}/join`;

  const playerCount = useMemo(() => room.players?.length || 0, [room.players]);

  useEffect(() => {
    const onRoomUpdate = (payload) => {
      if (payload.pin === pin) setRoom(payload);
    };
    const onNewQuestion = (q) => {
      setQuestion(q);
      setTimeLeft(q.seconds);
      setBoard(null);
    };
    const onLeaderboard = (data) => {
      setBoard(data.players);
      setQuestion(null);
      setTimeLeft(null);
    };
    const onHostError = ({ message }) => setErr(message);

    socket.on("roomUpdate", onRoomUpdate);
    socket.on("newQuestion", onNewQuestion);
    socket.on("leaderboard", onLeaderboard);
    socket.on("hostError", onHostError);

    return () => {
      socket.off("roomUpdate", onRoomUpdate);
      socket.off("newQuestion", onNewQuestion);
      socket.off("leaderboard", onLeaderboard);
      socket.off("hostError", onHostError);
    };
  }, [socket, pin]);

  // Generate QR code when modal opens
  useEffect(() => {
    if (qrModalOpen) {
      generateQRCode();
    }
  }, [qrModalOpen, joinUrl]);

  const generateQRCode = async () => {
    try {
      // Generate QR code as data URL
      const url = await QRCode.toDataURL(joinUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });
      setQrDataUrl(url);

      // Also generate on canvas if needed for download
      if (qrCanvasRef.current) {
        await QRCode.toCanvas(qrCanvasRef.current, joinUrl, {
          width: 300,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        });
      }
    } catch (error) {
      console.error("QR Code generation error:", error);
    }
  };

  // Timer countdown effect
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const start = () => {
    setErr("");
    socket.emit("startGame", { pin });
  };

  const next = () => {
    setErr("");
    socket.emit("nextQuestion", { pin });
  };

  const copyPin = () => {
    navigator.clipboard.writeText(pin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyJoinUrl = () => {
    navigator.clipboard.writeText(joinUrl);
    setQrCopied(true);
    setTimeout(() => setQrCopied(false), 2000);
  };

  const openQRModal = () => {
    setQrModalOpen(true);
  };

  const downloadQR = () => {
    if (qrCanvasRef.current) {
      const canvas = qrCanvasRef.current;
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");

      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `andevent-join-${pin}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } else if (qrDataUrl) {
      // Fallback: download from data URL
      const downloadLink = document.createElement("a");
      downloadLink.href = qrDataUrl;
      downloadLink.download = `andevent-join-${pin}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const getTimerColor = () => {
    if (!timeLeft) return andEventColors.primary;
    if (timeLeft <= 5) return theme.palette.error.main;
    if (timeLeft <= 10) return theme.palette.warning.main;
    return andEventColors.accent;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
            border: `1px solid ${alpha(andEventColors.accent, 0.1)}`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Animated background elements */}
          <Box
            sx={{
              position: "absolute",
              top: -50,
              right: -50,
              width: 300,
              height: 300,
              borderRadius: "50%",
              background: alpha(andEventColors.accent, 0.03),
              animation: "pulse 8s infinite",
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
                    width: 64,
                    height: 64,
                    boxShadow: `0 5px 15px ${alpha(andEventColors.accent, 0.3)}`,
                  }}
                >
                  <Celebration sx={{ fontSize: 36 }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={900}>
                    Event Host
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Chip
                      icon={<Lock sx={{ fontSize: 16 }} />}
                      label={`PIN: ${pin}`}
                      sx={{
                        bgcolor: alpha(andEventColors.accent, 0.1),
                        color: andEventColors.accent,
                        fontWeight: 700,
                        border: `1px solid ${alpha(andEventColors.accent, 0.3)}`,
                      }}
                      size="small"
                    />
                    <Chip
                      icon={<People sx={{ fontSize: 16 }} />}
                      label={`${playerCount} Player${
                        playerCount !== 1 ? "s" : ""
                      }`}
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

              <Stack direction="row" spacing={2}>
                {/* QR Code Button */}
                <Tooltip title="Show QR Code">
                  <IconButton
                    onClick={openQRModal}
                    sx={{
                      bgcolor: alpha(andEventColors.accent, 0.1),
                      color: andEventColors.accent,
                      "&:hover": {
                        bgcolor: alpha(andEventColors.accent, 0.2),
                      },
                    }}
                  >
                    <QrCodeScanner />
                  </IconButton>
                </Tooltip>

                {/* Copy PIN Button */}
                <Tooltip title={copied ? "Copied!" : "Copy PIN"}>
                  <IconButton
                    onClick={copyPin}
                    sx={{
                      bgcolor: alpha(andEventColors.accent, 0.1),
                      color: andEventColors.accent,
                      "&:hover": {
                        bgcolor: alpha(andEventColors.accent, 0.2),
                      },
                    }}
                  >
                    {copied ? <CheckCircle /> : <ContentCopy />}
                  </IconButton>
                </Tooltip>

                {room.state === "question" && timeLeft !== null && (
                  <Zoom in>
                    <Paper
                      elevation={3}
                      sx={{
                        p: 2,
                        bgcolor: alpha(getTimerColor(), 0.1),
                        border: `2px solid ${getTimerColor()}`,
                        borderRadius: 3,
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Timer
                          sx={{
                            color: getTimerColor(),
                            fontSize: 40,
                          }}
                        />
                        <Box>
                          <Typography
                            variant="h3"
                            fontWeight={900}
                            sx={{ color: getTimerColor() }}
                          >
                            {timeLeft}s
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Time Remaining
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Zoom>
                )}
              </Stack>
            </Stack>

            {err && (
              <Slide direction="down" in>
                <Alert
                  severity="error"
                  onClose={() => setErr("")}
                  sx={{
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                  }}
                >
                  {err}
                </Alert>
              </Slide>
            )}

            <Divider sx={{ borderBottomWidth: 2 }}>
              <Chip
                label={
                  room.state === "lobby"
                    ? "Lobby"
                    : room.state === "question"
                      ? "Question Active"
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
              />
            </Divider>

            {/* Lobby State */}
            {room.state === "lobby" && (
              <Fade in timeout={500}>
                <Stack spacing={4}>
                  <Card
                    elevation={0}
                    sx={{
                      bgcolor: alpha(andEventColors.accent, 0.03),
                      borderRadius: 3,
                      border: `1px solid ${alpha(andEventColors.accent, 0.1)}`,
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Stack alignItems="center" spacing={2}>
                        <Avatar
                          sx={{
                            width: 80,
                            height: 80,
                            background: andEventColors.gradient,
                          }}
                        >
                          <Group sx={{ fontSize: 40 }} />
                        </Avatar>
                        <Typography variant="h4" fontWeight={700}>
                          Waiting for Players
                        </Typography>
                        <Typography color="text.secondary" align="center">
                          Share the PIN with your players to let them join the
                          event
                        </Typography>

                        <Paper
                          elevation={0}
                          sx={{
                            p: 3,
                            bgcolor: alpha(andEventColors.dark, 0.05),
                            borderRadius: 3,
                            border: `2px dashed ${alpha(andEventColors.accent, 0.3)}`,
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              borderColor: andEventColors.accent,
                              transform: "scale(1.02)",
                            },
                          }}
                          onClick={copyPin}
                        >
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                          >
                            <Typography
                              variant="h2"
                              fontWeight={900}
                              sx={{
                                color: andEventColors.accent,
                                letterSpacing: 8,
                              }}
                            >
                              {pin}
                            </Typography>
                            <ContentCopy
                              sx={{ color: andEventColors.accent }}
                            />
                          </Stack>
                        </Paper>

                        <Stack direction="row" spacing={1}>
                          <Chip
                            icon={<Whatshot />}
                            label="Click PIN to copy"
                            sx={{
                              bgcolor: alpha(andEventColors.accent, 0.1),
                              color: andEventColors.accent,
                            }}
                          />
                          <Chip
                            icon={<QrCodeScanner />}
                            label="Show QR"
                            onClick={openQRModal}
                            sx={{
                              bgcolor: alpha(andEventColors.accent, 0.1),
                              color: andEventColors.accent,
                              cursor: "pointer",
                              "&:hover": {
                                bgcolor: alpha(andEventColors.accent, 0.2),
                              },
                            }}
                          />
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>

                  <Box>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 2 }}
                    >
                      <Typography variant="h6" fontWeight={700}>
                        Players Joined
                      </Typography>
                      <Badge
                        badgeContent={playerCount}
                        sx={{
                          "& .MuiBadge-badge": {
                            bgcolor: andEventColors.accent,
                            color: "white",
                            fontSize: 16,
                            fontWeight: 700,
                          },
                        }}
                      >
                        <Person sx={{ color: andEventColors.accent }} />
                      </Badge>
                    </Stack>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(160px, 1fr))",
                        gap: 2,
                        maxHeight: 350,
                        overflowY: "auto",
                        p: 1,
                      }}
                    >
                      {room.players.length === 0 ? (
                        <Paper
                          sx={{
                            gridColumn: "1/-1",
                            p: 4,
                            textAlign: "center",
                            bgcolor: alpha(andEventColors.accent, 0.02),
                            borderRadius: 3,
                            border: `1px solid ${alpha(andEventColors.accent, 0.1)}`,
                          }}
                        >
                          <Typography color="text.secondary">
                            No players have joined yet...
                          </Typography>
                        </Paper>
                      ) : (
                        room.players.map((player, index) => (
                          <Grow
                            key={player.id || index}
                            in
                            timeout={500 + index * 100}
                          >
                            <Paper
                              elevation={2}
                              sx={{
                                p: 2,
                                textAlign: "center",
                                borderRadius: 3,
                                background: `linear-gradient(135deg, ${alpha(
                                  andEventColors.primary,
                                  0.05,
                                )} 0%, ${alpha(andEventColors.accent, 0.05)} 100%)`,
                                border: `1px solid ${alpha(
                                  andEventColors.accent,
                                  0.2,
                                )}`,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  transform: "translateY(-4px)",
                                  boxShadow: `0 10px 20px ${alpha(andEventColors.accent, 0.2)}`,
                                  borderColor: andEventColors.accent,
                                },
                              }}
                            >
                              <Avatar
                                sx={{
                                  mx: "auto",
                                  mb: 1,
                                  bgcolor: andEventColors.accent,
                                }}
                              >
                                {player.name.charAt(0).toUpperCase()}
                              </Avatar>
                              <Typography fontWeight={700} noWrap>
                                {player.name}
                              </Typography>
                              <Chip
                                label={`Player ${index + 1}`}
                                size="small"
                                sx={{
                                  mt: 1,
                                  bgcolor: alpha(andEventColors.accent, 0.1),
                                  color: andEventColors.accent,
                                  fontSize: "0.7rem",
                                }}
                              />
                            </Paper>
                          </Grow>
                        ))
                      )}
                    </Box>
                  </Box>

                  <Button
                    variant="contained"
                    size="large"
                    onClick={start}
                    disabled={playerCount === 0}
                    startIcon={<PlayArrow />}
                    endIcon={<FlashOn />}
                    sx={{
                      fontWeight: 900,
                      fontSize: 18,
                      py: 2,
                      borderRadius: 3,
                      background: andEventColors.gradient,
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: `0 15px 30px ${alpha(andEventColors.accent, 0.4)}`,
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Start Event
                  </Button>
                </Stack>
              </Fade>
            )}

            {/* Question State */}
            {question && (
              <Fade in timeout={500}>
                <Stack spacing={3}>
                  <Card
                    elevation={3}
                    sx={{
                      borderRadius: 4,
                      border: `2px solid ${alpha(andEventColors.accent, 0.3)}`,
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Stack spacing={3}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Chip
                            icon={<Quiz />}
                            label="Current Question"
                            sx={{
                              bgcolor: alpha(andEventColors.accent, 0.1),
                              color: andEventColors.accent,
                              fontWeight: 700,
                            }}
                          />
                          <Chip
                            icon={<Timer />}
                            label={`${timeLeft}s remaining`}
                            sx={{
                              bgcolor: alpha(getTimerColor(), 0.1),
                              color: getTimerColor(),
                              fontWeight: 700,
                            }}
                          />
                        </Stack>

                        <Typography variant="h3" fontWeight={700}>
                          {question.text}
                        </Typography>

                        <Box sx={{ width: "100%" }}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            sx={{ mb: 1 }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              Time Progress
                            </Typography>
                            <Typography
                              variant="body2"
                              fontWeight={700}
                              sx={{ color: getTimerColor() }}
                            >
                              {Math.round((timeLeft / question.seconds) * 100)}%
                            </Typography>
                          </Stack>
                          <LinearProgress
                            variant="determinate"
                            value={(timeLeft / question.seconds) * 100}
                            sx={{
                              height: 10,
                              borderRadius: 5,
                              bgcolor: alpha(getTimerColor(), 0.1),
                              "& .MuiLinearProgress-bar": {
                                bgcolor: getTimerColor(),
                                borderRadius: 5,
                              },
                            }}
                          />
                        </Box>

                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 2,
                            mt: 2,
                          }}
                        >
                          {question.options?.map((option, index) => (
                            <Paper
                              key={index}
                              sx={{
                                p: 2,
                                textAlign: "center",
                                bgcolor: alpha(andEventColors.accent, 0.05),
                                border: `1px solid ${alpha(andEventColors.accent, 0.2)}`,
                                borderRadius: 2,
                              }}
                            >
                              <Typography variant="body1" fontWeight={500}>
                                <Box
                                  component="span"
                                  sx={{
                                    color: andEventColors.accent,
                                    fontWeight: 700,
                                    mr: 1,
                                  }}
                                >
                                  {String.fromCharCode(65 + index)}:
                                </Box>
                                {option}
                              </Typography>
                            </Paper>
                          ))}
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>

                  <Leaderboard players={room.players} />
                </Stack>
              </Fade>
            )}

            {/* Leaderboard State */}
            {board && (
              <Fade in timeout={500}>
                <Stack spacing={3}>
                  <Card
                    elevation={3}
                    sx={{
                      borderRadius: 4,
                      background: `linear-gradient(135deg, ${alpha(
                        andEventColors.accent,
                        0.1,
                      )} 0%, ${alpha(andEventColors.primary, 0.1)} 100%)`,
                    }}
                  >
                    <CardContent sx={{ p: 4, textAlign: "center" }}>
                      <Zoom in>
                        <Avatar
                          sx={{
                            width: 80,
                            height: 80,
                            background: andEventColors.gradient,
                            mx: "auto",
                            mb: 2,
                          }}
                        >
                          <EmojiEvents sx={{ fontSize: 40 }} />
                        </Avatar>
                      </Zoom>
                      <Typography variant="h4" fontWeight={700} gutterBottom>
                        Round Complete!
                      </Typography>
                      <Typography color="text.secondary" variant="h6">
                        Here's how everyone performed
                      </Typography>
                    </CardContent>
                  </Card>

                  <Leaderboard players={board} />

                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={next}
                      startIcon={<SkipNext />}
                      fullWidth
                      sx={{
                        fontWeight: 900,
                        fontSize: 18,
                        py: 2,
                        borderRadius: 3,
                        background: andEventColors.gradient,
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: `0 15px 30px ${alpha(andEventColors.accent, 0.4)}`,
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      Next Question
                    </Button>

                    <Button
                      variant="outlined"
                      size="large"
                      onClick={next}
                      sx={{
                        fontWeight: 900,
                        fontSize: 18,
                        py: 2,
                        borderRadius: 3,
                        borderColor: andEventColors.accent,
                        color: andEventColors.accent,
                        "&:hover": {
                          borderColor: andEventColors.primary,
                          bgcolor: alpha(andEventColors.accent, 0.05),
                        },
                      }}
                    >
                      End Event
                    </Button>
                  </Stack>
                </Stack>
              </Fade>
            )}

            {/* Live Stats Bar */}
            {room.state !== "lobby" && (
              <Grow in>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: alpha(andEventColors.dark, 0.02),
                    border: `1px solid ${alpha(andEventColors.accent, 0.1)}`,
                  }}
                >
                  <Stack direction="row" spacing={4} justifyContent="center">
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <People sx={{ color: andEventColors.accent }} />
                      <Typography variant="body2" fontWeight={600}>
                        {playerCount} Active Players
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <BarChart sx={{ color: andEventColors.accent }} />
                      <Typography variant="body2" fontWeight={600}>
                        {board ? "Results Ready" : "In Progress"}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <TrendingUp sx={{ color: andEventColors.accent }} />
                      <Typography variant="body2" fontWeight={600}>
                        Live
                      </Typography>
                    </Stack>
                  </Stack>
                </Paper>
              </Grow>
            )}
          </Stack>
        </Paper>
      </Fade>

      {/* QR Code Modal */}
      <Modal
        open={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          sx: {
            backgroundColor: alpha(andEventColors.dark, 0.9),
            backdropFilter: "blur(5px)",
          },
        }}
      >
        <Fade in={qrModalOpen}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", sm: 400 },
              bgcolor: "background.paper",
              borderRadius: 4,
              boxShadow: 24,
              p: 4,
              outline: "none",
            }}
          >
            <Stack spacing={3}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h5" fontWeight={900}>
                  Join Event
                </Typography>
                <IconButton onClick={() => setQrModalOpen(false)}>
                  <Close />
                </IconButton>
              </Stack>

              <Divider />

              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h3"
                  fontWeight={900}
                  sx={{ color: andEventColors.accent, mb: 1 }}
                >
                  PIN: {pin}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="QR Code"
                    style={{
                      width: 250,
                      height: 250,
                      borderRadius: 8,
                      display: "block",
                    }}
                  />
                ) : (
                  <canvas
                    ref={qrCanvasRef}
                    style={{
                      width: 250,
                      height: 250,
                      display: "block",
                      borderRadius: 8,
                    }}
                  />
                )}
              </Box>

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body1" gutterBottom>
                  Scan with phone camera to join
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Or visit: {joinUrl}
                </Typography>
              </Box>

              <Stack direction="row" spacing={2}>
                <Tooltip title={qrCopied ? "Copied!" : "Copy URL"}>
                  <IconButton
                    onClick={copyJoinUrl}
                    sx={{
                      bgcolor: alpha(andEventColors.accent, 0.1),
                      color: andEventColors.accent,
                      "&:hover": {
                        bgcolor: alpha(andEventColors.accent, 0.2),
                      },
                    }}
                  >
                    {qrCopied ? <CheckCircle /> : <LinkIcon />}
                  </IconButton>
                </Tooltip>

                <Tooltip title="Download QR Code">
                  <IconButton
                    onClick={downloadQR}
                    sx={{
                      bgcolor: alpha(andEventColors.accent, 0.1),
                      color: andEventColors.accent,
                      "&:hover": {
                        bgcolor: alpha(andEventColors.accent, 0.2),
                      },
                    }}
                  >
                    <Download />
                  </IconButton>
                </Tooltip>

                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => setQrModalOpen(false)}
                  sx={{
                    background: andEventColors.gradient,
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: `0 10px 20px ${alpha(andEventColors.accent, 0.3)}`,
                    },
                  }}
                >
                  Close
                </Button>
              </Stack>

              <Typography
                variant="caption"
                align="center"
                color="text.secondary"
              >
                Players can join by scanning the QR code or entering the PIN
              </Typography>
            </Stack>
          </Box>
        </Fade>
      </Modal>
    </Container>
  );
}
