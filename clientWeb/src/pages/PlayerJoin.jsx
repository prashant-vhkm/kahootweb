import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Stack,
  Typography,
  TextField,
  Button,
  Alert,
  Box,
  Fade,
  Zoom,
  Grow,
  Avatar,
  Chip,
  InputAdornment,
  useTheme,
  alpha,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import {
  Celebration,
  Pin,
  Person,
  ArrowForward,
  Whatshot,
  Group,
  Login,
  CheckCircle,
  Error,
  VideogameAsset,
  EmojiEvents,
  Bolt,
  Security,
} from "@mui/icons-material";

export default function PlayerJoin() {
  const theme = useTheme();
  const { socket, connected } = useSocket();
  const nav = useNavigate();

  const [pin, setPin] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [pinError, setPinError] = useState("");
  const [nameError, setNameError] = useState("");

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
    const onJoined = ({ pin }) => {
      setLoading(false);
      nav(`/game/player/${pin}`);
    };
    const onJoinError = ({ message }) => {
      setErr(message);
      setLoading(false);
    };

    socket.on("joined", onJoined);
    socket.on("joinError", onJoinError);

    return () => {
      socket.off("joined", onJoined);
      socket.off("joinError", onJoinError);
    };
  }, [socket, nav]);

  const validateForm = () => {
    let isValid = true;

    if (!pin.trim()) {
      setPinError("PIN is required");
      isValid = false;
    } else if (pin.trim().length < 4) {
      setPinError("PIN must be at least 4 characters");
      isValid = false;
    } else {
      setPinError("");
    }

    if (!name.trim()) {
      setNameError("Name is required");
      isValid = false;
    } else if (name.trim().length < 2) {
      setNameError("Name must be at least 2 characters");
      isValid = false;
    } else if (name.trim().length > 20) {
      setNameError("Name must be less than 20 characters");
      isValid = false;
    } else {
      setNameError("");
    }

    return isValid;
  };

  const join = () => {
    setErr("");

    if (!connected) {
      setErr(
        "Unable to connect to server. Please check if the event is active.",
      );
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    socket.emit("joinGame", {
      pin: pin.trim().toUpperCase(),
      playerName: name.trim(),
    });
  };

  const handlePinChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    setPin(value);
    if (pinError) validateForm();
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (nameError) validateForm();
  };

  const quickFill = (demoPin, demoName) => {
    setPin(demoPin);
    setName(demoName);
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Fade in timeout={800}>
        <Stack spacing={4}>
          {/* Header Card */}
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
                border: `1px solid ${alpha(andEventColors.accent, 0.2)}`,
                position: "relative",
                overflow: "hidden",
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
                spacing={3}
                alignItems="center"
                sx={{ position: "relative", zIndex: 1 }}
              >
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    background: andEventColors.gradient,
                    boxShadow: `0 10px 30px ${alpha(andEventColors.accent, 0.3)}`,
                  }}
                >
                  <Celebration sx={{ fontSize: 50 }} />
                </Avatar>

                <Box sx={{ flex: 1, textAlign: { xs: "center", md: "left" } }}>
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
                    Join Event
                  </Typography>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Enter the PIN and your name to start playing
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      mt: 2,
                      justifyContent: { xs: "center", md: "flex-start" },
                    }}
                  >
                    <Chip
                      icon={<Group />}
                      label="Live Players"
                      variant="outlined"
                      sx={{ borderColor: alpha(andEventColors.accent, 0.3) }}
                    />
                    <Chip
                      icon={<EmojiEvents />}
                      label="Real-time Scores"
                      variant="outlined"
                      sx={{ borderColor: alpha(andEventColors.accent, 0.3) }}
                    />
                  </Stack>
                </Box>

                <Chip
                  icon={<Bolt />}
                  label={connected ? "Live" : "Offline"}
                  sx={{
                    bgcolor: connected
                      ? alpha(andEventColors.accent, 0.1)
                      : alpha(theme.palette.error.main, 0.1),
                    color: connected
                      ? andEventColors.accent
                      : theme.palette.error.main,
                    fontWeight: 700,
                    px: 2,
                  }}
                />
              </Stack>
            </Paper>
          </Grow>

          {/* Main Join Form */}
          <Zoom in timeout={600}>
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
              }}
            >
              <Stack spacing={3}>
                {/* Connection Status */}
                {!connected && (
                  <Fade in>
                    <Alert
                      severity="error"
                      icon={<Error />}
                      sx={{
                        borderRadius: 2,
                        border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                      }}
                    >
                      <Typography fontWeight={600}>
                        Unable to connect to server. Please check if the event
                        is active.
                      </Typography>
                    </Alert>
                  </Fade>
                )}

                {/* Error Alert */}
                {err && (
                  <Fade in>
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
                  </Fade>
                )}

                {/* PIN Input */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    sx={{ mb: 1, color: andEventColors.accent }}
                  >
                    Event PIN
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter 4-6 digit PIN"
                    value={pin}
                    onChange={handlePinChange}
                    onFocus={() => setFocusedField("pin")}
                    onBlur={() => setFocusedField(null)}
                    error={!!pinError}
                    helperText={pinError}
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Pin
                            sx={{
                              color:
                                focusedField === "pin"
                                  ? andEventColors.accent
                                  : "inherit",
                            }}
                          />
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: 2,
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: alpha(andEventColors.accent, 0.3),
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: andEventColors.accent,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: andEventColors.accent,
                        },
                      },
                    }}
                    inputProps={{
                      maxLength: 6,
                      style: { textTransform: "uppercase" },
                    }}
                  />
                </Box>

                {/* Name Input */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    sx={{ mb: 1, color: andEventColors.accent }}
                  >
                    Your Name
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter your display name"
                    value={name}
                    onChange={handleNameChange}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    error={!!nameError}
                    helperText={nameError}
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person
                            sx={{
                              color:
                                focusedField === "name"
                                  ? andEventColors.accent
                                  : "inherit",
                            }}
                          />
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: 2,
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: alpha(andEventColors.accent, 0.3),
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: andEventColors.accent,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: andEventColors.accent,
                        },
                      },
                    }}
                    inputProps={{
                      maxLength: 20,
                    }}
                  />
                </Box>

                {/* Join Button */}
                <Button
                  variant="contained"
                  size="large"
                  onClick={join}
                  disabled={loading || !connected}
                  startIcon={loading ? <Bolt /> : <Login />}
                  endIcon={!loading && <ArrowForward />}
                  sx={{
                    py: 2,
                    fontSize: "1.2rem",
                    fontWeight: 900,
                    borderRadius: 3,
                    background: andEventColors.gradient,
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: `0 15px 30px ${alpha(andEventColors.accent, 0.4)}`,
                    },
                    "&:disabled": {
                      background: alpha(andEventColors.accent, 0.3),
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {loading ? "Joining Event..." : "Join Event"}
                </Button>

                {/* Quick Fill Options */}
                <Grow in>
                  <Card
                    sx={{
                      bgcolor: alpha(andEventColors.accent, 0.02),
                      borderRadius: 2,
                      border: `1px solid ${alpha(andEventColors.accent, 0.1)}`,
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        sx={{ mb: 2, color: andEventColors.accent }}
                      >
                        Quick Fill Demo
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        useFlexGap
                      >
                        {[
                          { pin: "ABC123", name: "Player1" },
                          { pin: "XYZ789", name: "Gamer" },
                          { pin: "DEMO42", name: "Champion" },
                        ].map((demo, index) => (
                          <Chip
                            key={index}
                            label={`${demo.pin} - ${demo.name}`}
                            onClick={() => quickFill(demo.pin, demo.name)}
                            sx={{
                              bgcolor: alpha(andEventColors.accent, 0.05),
                              border: `1px solid ${alpha(andEventColors.accent, 0.2)}`,
                              "&:hover": {
                                bgcolor: alpha(andEventColors.accent, 0.1),
                              },
                            }}
                          />
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grow>

                <Divider>
                  <Chip
                    icon={<Security />}
                    label="Secure Connection"
                    size="small"
                    sx={{
                      bgcolor: alpha(andEventColors.accent, 0.05),
                      color: andEventColors.accent,
                    }}
                  />
                </Divider>

                {/* Tips */}
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Chip
                    icon={<CheckCircle />}
                    label="PIN is case-insensitive"
                    variant="outlined"
                    size="small"
                    sx={{ borderColor: alpha(andEventColors.accent, 0.3) }}
                  />
                  <Chip
                    icon={<Whatshot />}
                    label="Be creative with your name!"
                    variant="outlined"
                    size="small"
                    sx={{ borderColor: alpha(andEventColors.accent, 0.3) }}
                  />
                </Stack>
              </Stack>
            </Paper>
          </Zoom>

          {/* Recent Events */}
          <Fade in timeout={800}>
            <Paper
              sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: alpha(andEventColors.primary, 0.02),
                border: `1px solid ${alpha(andEventColors.accent, 0.1)}`,
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                justifyContent="center"
              >
                <Group sx={{ color: andEventColors.accent }} />
                <Typography variant="body2" color="text.secondary">
                  1,234 players are currently in events
                </Typography>
                <Chip
                  icon={<Bolt />}
                  label="Live now"
                  size="small"
                  sx={{
                    bgcolor: alpha(andEventColors.accent, 0.1),
                    color: andEventColors.accent,
                  }}
                />
              </Stack>
            </Paper>
          </Fade>
        </Stack>
      </Fade>
    </Container>
  );
}
