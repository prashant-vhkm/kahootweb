import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Paper,
  Stack,
  Typography,
  Button,
  Alert,
  Box,
  Fade,
  Grow,
  Zoom,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
  useTheme,
  alpha,
  LinearProgress,
  IconButton,
  Tooltip,
  Modal,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import {
  Celebration,
  AddCircle,
  Warning,
  CheckCircle,
  VideogameAsset,
  QrCode,
  Share,
  Groups,
  Timer,
  EmojiEvents,
  Whatshot,
  ArrowForward,
  ArrowBack,
  SportsEsports,
  Bolt,
  Download,
  Close,
  ContentCopy,
  Link as LinkIcon,
  QrCodeScanner,
} from "@mui/icons-material";
import QRCode from "qrcode";

export default function Host() {
  const theme = useTheme();
  const { socket, connected } = useSocket();
  const nav = useNavigate();
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [createdPin, setCreatedPin] = useState(null);

  // QR code data URLs
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [modalQrDataUrl, setModalQrDataUrl] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [modalQrLoading, setModalQrLoading] = useState(false);

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

  useEffect(() => {
    const onGameCreated = ({ pin }) => {
      setLoading(false);
      setCreatedPin(pin);
      // Show QR modal after game creation
      setQrModalOpen(true);
      // Navigate to game host after a short delay
      setTimeout(() => {
        nav(`/game/host/${pin}`);
      }, 3000);
    };

    socket.on("gameCreated", onGameCreated);

    return () => {
      socket.off("gameCreated", onGameCreated);
    };
  }, [socket, nav]);

  // Generate QR code as data URL for the sidebar
  useEffect(() => {
    const generateQRDataUrl = async () => {
      setQrLoading(true);
      try {
        const url = await QRCode.toDataURL(joinUrl, {
          width: 200,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        });
        setQrDataUrl(url);
      } catch (error) {
        console.error("QR Code generation error:", error);
      } finally {
        setQrLoading(false);
      }
    };

    generateQRDataUrl();
  }, [joinUrl]);

  // Generate modal QR code as data URL when modal opens
  useEffect(() => {
    if (qrModalOpen) {
      const generateModalQRDataUrl = async () => {
        setModalQrLoading(true);
        try {
          const url = await QRCode.toDataURL(joinUrl, {
            width: 250,
            margin: 2,
            color: {
              dark: "#000000",
              light: "#ffffff",
            },
          });
          setModalQrDataUrl(url);
        } catch (error) {
          console.error("Modal QR Code generation error:", error);
        } finally {
          setModalQrLoading(false);
        }
      };

      generateModalQRDataUrl();
    }
  }, [joinUrl, qrModalOpen]);

  const createGame = () => {
    setErr("");
    setLoading(true);

    if (!connected) {
      setErr(
        "Unable to connect to server. Please check if the backend is running.",
      );
      setLoading(false);
      return;
    }

    socket.emit("createGame", {});
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = (dataUrl, filename) => {
    if (dataUrl) {
      const downloadLink = document.createElement("a");
      downloadLink.href = dataUrl;
      downloadLink.download = filename;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const steps = [
    {
      label: "Create Your Event",
      description: "Generate a unique PIN for your live quiz event",
      icon: <AddCircle />,
    },
    {
      label: "Share with Players",
      description: "Players join instantly using the event PIN or QR code",
      icon: <Share />,
    },
    {
      label: "Start the Game",
      description:
        "Begin the quiz and watch the leaderboard update in real-time",
      icon: <Timer />,
    },
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Fade in timeout={800}>
        <Stack spacing={4}>
          {/* Header Section */}
          <Grow in timeout={500}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 4,
                background: `linear-gradient(135deg, ${alpha(
                  andEventColors.primary,
                  0.05,
                )} 0%, ${alpha(andEventColors.secondary, 0.05)} 100%)`,
                position: "relative",
                overflow: "hidden",
                border: `1px solid ${alpha(andEventColors.accent, 0.2)}`,
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: -20,
                  right: -20,
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  background: alpha(andEventColors.accent, 0.1),
                  animation: "pulse 4s infinite",
                  "@keyframes pulse": {
                    "0%, 100%": { transform: "scale(1)" },
                    "50%": { transform: "scale(1.2)" },
                  },
                }}
              />

              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={4}
                alignItems="center"
                sx={{ position: "relative", zIndex: 1 }}
              >
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    background: andEventColors.gradient,
                    boxShadow: `0 10px 30px ${alpha(andEventColors.accent, 0.3)}`,
                  }}
                >
                  <Celebration sx={{ fontSize: 60 }} />
                </Avatar>

                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h3"
                    fontWeight={900}
                    sx={{
                      background: andEventColors.gradient,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      mb: 1,
                    }}
                  >
                    Host an Event
                  </Typography>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Create an interactive quiz experience in seconds
                  </Typography>
                  <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <Chip
                      icon={<Groups />}
                      label="Unlimited Players"
                      variant="outlined"
                      sx={{ borderColor: alpha(andEventColors.accent, 0.3) }}
                    />
                    <Chip
                      icon={<Timer />}
                      label="Real-time Updates"
                      variant="outlined"
                      sx={{ borderColor: alpha(andEventColors.accent, 0.3) }}
                    />
                    <Chip
                      icon={<EmojiEvents />}
                      label="Live Leaderboard"
                      variant="outlined"
                      sx={{ borderColor: alpha(andEventColors.accent, 0.3) }}
                    />
                  </Stack>
                </Box>

                <Chip
                  icon={<Whatshot />}
                  label="🔥 LIVE"
                  sx={{
                    bgcolor: andEventColors.accent,
                    color: "white",
                    fontWeight: 700,
                    px: 2,
                  }}
                />
              </Stack>
            </Paper>
          </Grow>

          {/* Main Content */}
          <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
            {/* Left Column - Create Game */}
            <Box sx={{ flex: 1 }}>
              <Zoom in timeout={600}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    height: "100%",
                    background: `linear-gradient(135deg, ${alpha(
                      andEventColors.primary,
                      0.02,
                    )} 0%, ${alpha(andEventColors.secondary, 0.02)} 100%)`,
                    border: `1px solid ${alpha(andEventColors.accent, 0.1)}`,
                  }}
                >
                  <Stack spacing={3}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar
                        sx={{
                          bgcolor: andEventColors.primary,
                          width: 50,
                          height: 50,
                        }}
                      >
                        <SportsEsports />
                      </Avatar>
                      <Box>
                        <Typography variant="h5" fontWeight={900}>
                          Start New Event
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Generate a unique PIN for your players
                        </Typography>
                      </Box>
                    </Stack>

                    <Divider
                      sx={{ borderColor: alpha(andEventColors.accent, 0.2) }}
                    />

                    {/* Connection Status */}
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: connected
                          ? alpha(andEventColors.accent, 0.05)
                          : alpha(theme.palette.error.main, 0.05),
                        border: `1px solid ${alpha(
                          connected
                            ? andEventColors.accent
                            : theme.palette.error.main,
                          0.2,
                        )}`,
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            bgcolor: connected
                              ? "#4CAF50"
                              : theme.palette.error.main,
                            animation: connected ? "pulse 2s infinite" : "none",
                            "@keyframes pulse": {
                              "0%": { opacity: 1 },
                              "50%": { opacity: 0.5 },
                              "100%": { opacity: 1 },
                            },
                          }}
                        />
                        <Typography variant="body2" fontWeight={600}>
                          {connected
                            ? "Connected to server - Ready to host"
                            : "Disconnected - Check backend server"}
                        </Typography>
                      </Stack>
                    </Paper>

                    {/* Error Alert */}
                    {err && (
                      <Fade in>
                        <Alert
                          severity="error"
                          icon={<Warning />}
                          onClose={() => setErr("")}
                          sx={{
                            borderRadius: 2,
                            border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                          }}
                        >
                          {err}
                        </Alert>
                      </Fade>
                    )}

                    {/* Create Button */}
                    <Button
                      variant="contained"
                      size="large"
                      onClick={createGame}
                      disabled={loading || !connected}
                      onMouseEnter={() => setHovered(true)}
                      onMouseLeave={() => setHovered(false)}
                      startIcon={<Bolt />}
                      endIcon={
                        <ArrowForward
                          sx={{
                            transform: hovered ? "translateX(5px)" : "none",
                            transition: "transform 0.3s ease",
                          }}
                        />
                      }
                      sx={{
                        py: 3,
                        fontSize: "1.2rem",
                        fontWeight: 900,
                        borderRadius: 3,
                        background: andEventColors.gradient,
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: `0 15px 30px ${alpha(andEventColors.accent, 0.4)}`,
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      {loading ? "Creating Event..." : "Generate Event PIN"}
                    </Button>

                    {loading && (
                      <Box sx={{ width: "100%", mt: 2 }}>
                        <LinearProgress
                          sx={{
                            borderRadius: 2,
                            bgcolor: alpha(andEventColors.accent, 0.1),
                            "& .MuiLinearProgress-bar": {
                              background: andEventColors.gradient,
                            },
                          }}
                        />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mt: 1, display: "block", textAlign: "center" }}
                        >
                          Creating your event...
                        </Typography>
                      </Box>
                    )}

                    {/* Quick Stats */}
                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                      <Card
                        sx={{
                          flex: 1,
                          bgcolor: alpha(andEventColors.primary, 0.05),
                          borderRadius: 2,
                        }}
                      >
                        <CardContent sx={{ p: 2, textAlign: "center" }}>
                          <Typography
                            variant="h6"
                            fontWeight={900}
                            color={andEventColors.primary}
                          >
                            1K+
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Events Today
                          </Typography>
                        </CardContent>
                      </Card>
                      <Card
                        sx={{
                          flex: 1,
                          bgcolor: alpha(andEventColors.secondary, 0.05),
                          borderRadius: 2,
                        }}
                      >
                        <CardContent sx={{ p: 2, textAlign: "center" }}>
                          <Typography
                            variant="h6"
                            fontWeight={900}
                            color={andEventColors.secondary}
                          >
                            50K+
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Players
                          </Typography>
                        </CardContent>
                      </Card>
                    </Stack>
                  </Stack>
                </Paper>
              </Zoom>
            </Box>

            {/* Right Column - How it Works */}
            <Box sx={{ flex: 1 }}>
              <Zoom in timeout={800}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    height: "100%",
                    background: `linear-gradient(135deg, ${alpha(
                      andEventColors.primary,
                      0.02,
                    )} 0%, ${alpha(andEventColors.secondary, 0.02)} 100%)`,
                    border: `1px solid ${alpha(andEventColors.accent, 0.1)}`,
                  }}
                >
                  <Stack spacing={3}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar
                        sx={{
                          bgcolor: andEventColors.accent,
                          width: 50,
                          height: 50,
                        }}
                      >
                        <EmojiEvents />
                      </Avatar>
                      <Typography variant="h5" fontWeight={900}>
                        How It Works
                      </Typography>
                    </Stack>

                    <Divider
                      sx={{ borderColor: alpha(andEventColors.accent, 0.2) }}
                    />

                    <Stepper activeStep={activeStep} orientation="vertical">
                      {steps.map((step, index) => (
                        <Step key={step.label}>
                          <StepLabel
                            StepIconComponent={() => (
                              <Avatar
                                sx={{
                                  width: 32,
                                  height: 32,
                                  bgcolor:
                                    index <= activeStep
                                      ? andEventColors.accent
                                      : alpha(andEventColors.accent, 0.2),
                                  color:
                                    index <= activeStep
                                      ? "white"
                                      : andEventColors.accent,
                                }}
                              >
                                {step.icon}
                              </Avatar>
                            )}
                          >
                            <Typography fontWeight={700}>
                              {step.label}
                            </Typography>
                          </StepLabel>
                          <StepContent>
                            <Typography color="text.secondary" sx={{ mb: 2 }}>
                              {step.description}
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                              <Button
                                variant="contained"
                                onClick={handleNext}
                                size="small"
                                sx={{
                                  bgcolor: andEventColors.accent,
                                  mr: 1,
                                  "&:hover": {
                                    bgcolor: andEventColors.primary,
                                  },
                                }}
                              >
                                {index === steps.length - 1 ? "Finish" : "Next"}
                              </Button>
                              <Button
                                disabled={index === 0}
                                onClick={handleBack}
                                size="small"
                                sx={{ color: andEventColors.accent }}
                              >
                                Back
                              </Button>
                            </Box>
                          </StepContent>
                        </Step>
                      ))}
                    </Stepper>

                    {/* QR Code Display */}
                    <Card
                      sx={{
                        mt: 2,
                        bgcolor: alpha(andEventColors.accent, 0.03),
                        borderRadius: 3,
                        border: `1px solid ${alpha(andEventColors.accent, 0.2)}`,
                      }}
                    >
                      <CardContent>
                        <Stack spacing={2}>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                          >
                            <Avatar sx={{ bgcolor: andEventColors.accent }}>
                              <QrCodeScanner />
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1" fontWeight={700}>
                                Join via QR Code
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Players can scan to join instantly
                              </Typography>
                            </Box>
                          </Stack>

                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              p: 2,
                              bgcolor: "white",
                              borderRadius: 2,
                              minHeight: 150,
                              alignItems: "center",
                            }}
                          >
                            {qrLoading ? (
                              <CircularProgress
                                sx={{ color: andEventColors.accent }}
                              />
                            ) : qrDataUrl ? (
                              <img
                                src={qrDataUrl}
                                alt="QR Code"
                                style={{
                                  width: 150,
                                  height: 150,
                                  display: "block",
                                  borderRadius: 4,
                                }}
                              />
                            ) : (
                              <Typography color="text.secondary">
                                Failed to generate QR code
                              </Typography>
                            )}
                          </Box>

                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="center"
                          >
                            <Tooltip title={copied ? "Copied!" : "Copy URL"}>
                              <IconButton
                                onClick={() => copyToClipboard(joinUrl)}
                                size="small"
                                sx={{
                                  bgcolor: alpha(andEventColors.accent, 0.1),
                                  color: andEventColors.accent,
                                  "&:hover": {
                                    bgcolor: alpha(andEventColors.accent, 0.2),
                                  },
                                }}
                              >
                                {copied ? <CheckCircle /> : <LinkIcon />}
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Download QR Code">
                              <IconButton
                                onClick={() =>
                                  downloadQR(qrDataUrl, `andevent-join-qr.png`)
                                }
                                disabled={!qrDataUrl}
                                size="small"
                                sx={{
                                  bgcolor: alpha(andEventColors.accent, 0.1),
                                  color: andEventColors.accent,
                                  "&:hover": {
                                    bgcolor: alpha(andEventColors.accent, 0.2),
                                  },
                                  "&:disabled": {
                                    opacity: 0.5,
                                  },
                                }}
                              >
                                <Download />
                              </IconButton>
                            </Tooltip>
                          </Stack>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                            align="center"
                          >
                            Scan with phone camera to join
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>

                    {/* Tips Card */}
                    <Card
                      sx={{
                        bgcolor: alpha(andEventColors.accent, 0.05),
                        borderRadius: 3,
                        border: `1px solid ${alpha(andEventColors.accent, 0.2)}`,
                      }}
                    >
                      <CardContent>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar sx={{ bgcolor: andEventColors.accent }}>
                            <Bolt />
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" fontWeight={700}>
                              Pro Tip
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Display QR code on a big screen for easy access
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Stack>
                </Paper>
              </Zoom>
            </Box>
          </Stack>

          {/* Recent Events Preview */}
          <Grow in timeout={1000}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: alpha(andEventColors.primary, 0.02),
                border: `1px solid ${alpha(andEventColors.accent, 0.1)}`,
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{ mb: 2 }}
              >
                <Avatar
                  sx={{ bgcolor: andEventColors.accent, width: 32, height: 32 }}
                >
                  <Timer />
                </Avatar>
                <Typography variant="subtitle1" fontWeight={700}>
                  Recent Events
                </Typography>
              </Stack>
              <Stack direction="row" spacing={2} justifyContent="space-around">
                {[1, 2, 3].map((item) => (
                  <Chip
                    key={item}
                    label={`Event #${item} • 24 players`}
                    variant="outlined"
                    sx={{
                      borderColor: alpha(andEventColors.accent, 0.3),
                      "&:hover": {
                        bgcolor: alpha(andEventColors.accent, 0.05),
                      },
                    }}
                  />
                ))}
              </Stack>
            </Paper>
          </Grow>
        </Stack>
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
                  Event Created! 🎉
                </Typography>
                <IconButton onClick={() => setQrModalOpen(false)}>
                  <Close />
                </IconButton>
              </Stack>

              <Divider />

              {createdPin && (
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h3"
                    fontWeight={900}
                    sx={{ color: andEventColors.accent, mb: 2 }}
                  >
                    {createdPin}
                  </Typography>
                </Box>
              )}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  minHeight: 200,
                  alignItems: "center",
                }}
              >
                {modalQrLoading ? (
                  <CircularProgress sx={{ color: andEventColors.accent }} />
                ) : modalQrDataUrl ? (
                  <img
                    src={modalQrDataUrl}
                    alt="QR Code"
                    style={{
                      width: 200,
                      height: 200,
                      display: "block",
                      borderRadius: 8,
                    }}
                  />
                ) : (
                  <Typography color="text.secondary">
                    Failed to generate QR code
                  </Typography>
                )}
              </Box>

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body1" gutterBottom>
                  Share this QR code with players
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  They can scan with their phone camera to join
                </Typography>
              </Box>

              <Stack direction="row" spacing={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={() =>
                    downloadQR(
                      modalQrDataUrl,
                      `andevent-join-${createdPin || "event"}.png`,
                    )
                  }
                  disabled={!modalQrDataUrl}
                  sx={{
                    borderColor: andEventColors.accent,
                    color: andEventColors.accent,
                    "&:hover": {
                      borderColor: andEventColors.primary,
                      bgcolor: alpha(andEventColors.accent, 0.05),
                    },
                    "&:disabled": {
                      opacity: 0.5,
                    },
                  }}
                >
                  Download
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => {
                    setQrModalOpen(false);
                    nav(`/game/host/${createdPin}`);
                  }}
                  sx={{
                    background: andEventColors.gradient,
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: `0 10px 20px ${alpha(andEventColors.accent, 0.3)}`,
                    },
                  }}
                >
                  Go to Event
                </Button>
              </Stack>

              <Typography
                variant="caption"
                align="center"
                color="text.secondary"
              >
                You'll be redirected to the event dashboard in a moment
              </Typography>
            </Stack>
          </Box>
        </Fade>
      </Modal>
    </Container>
  );
}
