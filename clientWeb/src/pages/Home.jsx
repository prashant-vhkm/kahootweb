import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Stack,
  Typography,
  Button,
  Box,
  Fade,
  Zoom,
  Grow,
  useTheme,
  alpha,
  Avatar,
  Chip,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  SportsEsports,
  Group,
  Quiz,
  EmojiEvents,
  ArrowForward,
  VideogameAsset,
  PhoneIphone,
  Computer,
  Star,
  Bolt,
  Celebration,
  ConnectWithoutContact,
  Timeline,
  WorkspacePremium,
  Whatshot,
  TrendingUp,
  FlashOn,
} from "@mui/icons-material";

export default function Home() {
  const theme = useTheme();
  const nav = useNavigate();
  const [hoveredButton, setHoveredButton] = useState(null);
  const [featuredIndex, setFeaturedIndex] = useState(0);

  // AndEvent red theme colors
  const andEventColors = {
    primary: "#DC2626", // Vibrant Red
    secondary: "#B91C1C", // Dark Red
    accent: "#EF4444", // Bright Red
    light: "#FEE2E2", // Light Red for backgrounds
    dark: "#7F1D1D", // Deep Red
    gradient: "linear-gradient(135deg, #DC2626 0%, #B91C1C 50%, #991B1B 100%)",
  };

  const features = [
    {
      icon: <Whatshot sx={{ fontSize: 40 }} />,
      title: "Host Events",
      description: "Create engaging live quizzes and interactive game events",
      color: andEventColors.primary,
    },
    {
      icon: <FlashOn sx={{ fontSize: 40 }} />,
      title: "Instant Join",
      description: "Participants join with a simple event PIN code",
      color: andEventColors.accent,
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      title: "Live Analytics",
      description: "Real-time scores, engagement metrics, and leaderboards",
      color: andEventColors.secondary,
    },
  ];

  // Auto-rotate featured items
  useEffect(() => {
    const timer = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [features.length]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: `radial-gradient(circle at 10% 30%, ${alpha(
          andEventColors.primary,
          0.95,
        )} 0%, ${alpha(andEventColors.dark, 0.98)} 100%)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated Background Elements - Red themed particles */}
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {[...Array(20)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              width: Math.random() * 300 + 50,
              height: Math.random() * 300 + 50,
              borderRadius: "50%",
              background: alpha(andEventColors.primary, Math.random() * 0.03),
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              transform: `translate(${Math.random() * 200 - 100}px, ${
                Math.random() * 200 - 100
              }px)`,
              "@keyframes float": {
                "0%": { transform: "translate(0, 0) rotate(0deg)" },
                "25%": { transform: "translate(100px, 50px) rotate(90deg)" },
                "50%": { transform: "translate(50px, 100px) rotate(180deg)" },
                "75%": { transform: "translate(-50px, 50px) rotate(270deg)" },
                "100%": { transform: "translate(0, 0) rotate(360deg)" },
              },
            }}
          />
        ))}

        {/* Animated red glowing orbs */}
        {[...Array(5)].map((_, i) => (
          <Box
            key={`glow-${i}`}
            sx={{
              position: "absolute",
              width: 400,
              height: 400,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${alpha(
                andEventColors.accent,
                0.1,
              )} 0%, transparent 70%)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `pulseGlow ${Math.random() * 5 + 5}s ease-in-out infinite`,
              "@keyframes pulseGlow": {
                "0%, 100%": { opacity: 0.3, transform: "scale(1)" },
                "50%": { opacity: 0.6, transform: "scale(1.2)" },
              },
            }}
          />
        ))}
      </Box>

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Fade in timeout={1000}>
          <Stack spacing={6} alignItems="center">
            {/* Main Logo and Title - Red themed */}
            <Zoom in timeout={800}>
              <Stack spacing={2} alignItems="center">
                <Paper
                  elevation={24}
                  sx={{
                    width: 160,
                    height: 160,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: andEventColors.gradient,
                    animation: "redPulse 2s infinite",
                    "@keyframes redPulse": {
                      "0%": {
                        boxShadow: `0 0 0 0 ${alpha(andEventColors.primary, 0.7)}`,
                      },
                      "70%": {
                        boxShadow: `0 0 0 30px ${alpha(andEventColors.primary, 0)}`,
                      },
                      "100%": {
                        boxShadow: `0 0 0 0 ${alpha(andEventColors.primary, 0)}`,
                      },
                    },
                    position: "relative",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: -5,
                      left: -5,
                      right: -5,
                      bottom: -5,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${alpha(
                        andEventColors.primary,
                        0.3,
                      )}, ${alpha(andEventColors.accent, 0.3)})`,
                      filter: "blur(20px)",
                      zIndex: -1,
                    },
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      padding: "3px",
                      background: `linear-gradient(135deg, ${andEventColors.accent}, ${andEventColors.primary})`,
                      WebkitMask:
                        "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                    },
                  }}
                >
                  <Celebration sx={{ fontSize: 80, color: "white" }} />
                </Paper>

                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: "3.5rem", md: "5.5rem" },
                    background: `linear-gradient(135deg, ${theme.palette.common.white}, ${alpha(
                      andEventColors.light,
                      0.9,
                    )})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: `0 0 40px ${alpha(andEventColors.accent, 0.5)}`,
                    letterSpacing: "0.05em",
                    position: "relative",
                    "&::before": {
                      content: '"AndEvent"',
                      position: "absolute",
                      top: 2,
                      left: 2,
                      width: "100%",
                      height: "100%",
                      background: `linear-gradient(135deg, ${alpha(
                        andEventColors.primary,
                        0.3,
                      )}, ${alpha(andEventColors.accent, 0.3)})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      filter: "blur(8px)",
                      zIndex: -1,
                    },
                  }}
                >
                  AndEvent
                </Typography>

                <Chip
                  icon={<WorkspacePremium />}
                  label="Enterprise Event Platform"
                  sx={{
                    bgcolor: alpha(andEventColors.primary, 0.2),
                    color: "white",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    backdropFilter: "blur(5px)",
                    border: `1px solid ${alpha(andEventColors.accent, 0.3)}`,
                    "& .MuiChip-icon": {
                      color: andEventColors.accent,
                    },
                  }}
                />

                <Typography
                  variant="h5"
                  sx={{
                    color: alpha(theme.palette.common.white, 0.95),
                    maxWidth: 700,
                    textAlign: "center",
                    textShadow: "0 2px 15px rgba(220, 38, 38, 0.3)",
                    mt: 2,
                    fontWeight: 500,
                    lineHeight: 1.6,
                  }}
                >
                  Transform your events with interactive quizzes,
                  <Box
                    component="span"
                    sx={{
                      color: andEventColors.accent,
                      fontWeight: 700,
                      mx: 1,
                      textShadow: `0 0 10px ${alpha(andEventColors.accent, 0.5)}`,
                    }}
                  >
                    real-time engagement
                  </Box>
                  and
                  <Box
                    component="span"
                    sx={{
                      color: andEventColors.primary,
                      fontWeight: 700,
                      mx: 1,
                      textShadow: `0 0 10px ${alpha(andEventColors.primary, 0.5)}`,
                    }}
                  >
                    actionable analytics
                  </Box>
                </Typography>
              </Stack>
            </Zoom>

            {/* Features Carousel - Red themed */}
            <Box sx={{ width: "100%", maxWidth: 800 }}>
              <Grow in timeout={1000}>
                <Paper
                  elevation={12}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    background: alpha(andEventColors.dark, 0.3),
                    backdropFilter: "blur(10px)",
                    border: `1px solid ${alpha(andEventColors.accent, 0.2)}`,
                  }}
                >
                  <Fade key={featuredIndex} in timeout={500}>
                    <Stack spacing={2} alignItems="center">
                      <Avatar
                        sx={{
                          width: 80,
                          height: 80,
                          bgcolor: alpha(features[featuredIndex].color, 0.2),
                          color: features[featuredIndex].color,
                          border: `2px solid ${alpha(features[featuredIndex].color, 0.3)}`,
                        }}
                      >
                        {features[featuredIndex].icon}
                      </Avatar>
                      <Typography
                        variant="h4"
                        fontWeight={700}
                        sx={{ color: "white" }}
                      >
                        {features[featuredIndex].title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: alpha(theme.palette.common.white, 0.8) }}
                      >
                        {features[featuredIndex].description}
                      </Typography>
                    </Stack>
                  </Fade>

                  {/* Feature Dots - Red themed */}
                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="center"
                    sx={{ mt: 3 }}
                  >
                    {features.map((_, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          bgcolor:
                            index === featuredIndex
                              ? andEventColors.accent
                              : alpha(theme.palette.common.white, 0.3),
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                          boxShadow:
                            index === featuredIndex
                              ? `0 0 10px ${andEventColors.accent}`
                              : "none",
                          "&:hover": {
                            bgcolor: andEventColors.accent,
                            transform: "scale(1.2)",
                          },
                        }}
                        onClick={() => setFeaturedIndex(index)}
                      />
                    ))}
                  </Stack>
                </Paper>
              </Grow>
            </Box>

            {/* Action Buttons - Red themed */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={3}
              sx={{ mt: 4 }}
            >
              <Zoom in timeout={600} style={{ transitionDelay: "200ms" }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => nav("/host")}
                  onMouseEnter={() => setHoveredButton("host")}
                  onMouseLeave={() => setHoveredButton(null)}
                  startIcon={<Computer />}
                  endIcon={
                    <ArrowForward
                      sx={{
                        transform:
                          hoveredButton === "host" ? "translateX(5px)" : "none",
                        transition: "transform 0.3s ease",
                      }}
                    />
                  }
                  sx={{
                    px: 6,
                    py: 2,
                    fontSize: "1.3rem",
                    fontWeight: 900,
                    borderRadius: 4,
                    background: `linear-gradient(45deg, ${andEventColors.primary}, ${andEventColors.accent})`,
                    boxShadow: `0 10px 30px ${alpha(
                      andEventColors.primary,
                      0.5,
                    )}`,
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: `0 15px 40px ${alpha(
                        andEventColors.accent,
                        0.7,
                      )}`,
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  HOST EVENT
                </Button>
              </Zoom>

              <Zoom in timeout={600} style={{ transitionDelay: "400ms" }}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => nav("/join")}
                  onMouseEnter={() => setHoveredButton("join")}
                  onMouseLeave={() => setHoveredButton(null)}
                  startIcon={<PhoneIphone />}
                  endIcon={
                    <ArrowForward
                      sx={{
                        transform:
                          hoveredButton === "join" ? "translateX(5px)" : "none",
                        transition: "transform 0.3s ease",
                      }}
                    />
                  }
                  sx={{
                    px: 6,
                    py: 2,
                    fontSize: "1.3rem",
                    fontWeight: 900,
                    borderRadius: 4,
                    borderWidth: 3,
                    borderColor: andEventColors.accent,
                    color: "white",
                    "&:hover": {
                      borderWidth: 3,
                      borderColor: andEventColors.primary,
                      bgcolor: alpha(andEventColors.primary, 0.1),
                      transform: "translateY(-3px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  JOIN EVENT
                </Button>
              </Zoom>
            </Stack>

            {/* Stats Section - Red themed */}
            <Grow in timeout={1000} style={{ transitionDelay: "600ms" }}>
              <Stack
                direction="row"
                spacing={4}
                sx={{
                  mt: 6,
                  p: 3,
                  borderRadius: 4,
                  background: alpha(andEventColors.dark, 0.3),
                  backdropFilter: "blur(5px)",
                  border: `1px solid ${alpha(andEventColors.accent, 0.2)}`,
                }}
              >
                <Stack alignItems="center" spacing={1}>
                  <Typography
                    variant="h3"
                    fontWeight={900}
                    sx={{ color: "white" }}
                  >
                    5K+
                  </Typography>
                  <Chip
                    icon={<Group />}
                    label="Events Hosted"
                    sx={{
                      bgcolor: alpha(andEventColors.primary, 0.2),
                      color: "white",
                      fontWeight: 700,
                      border: `1px solid ${alpha(andEventColors.accent, 0.3)}`,
                    }}
                  />
                </Stack>

                <Stack alignItems="center" spacing={1}>
                  <Typography
                    variant="h3"
                    fontWeight={900}
                    sx={{ color: "white" }}
                  >
                    50K+
                  </Typography>
                  <Chip
                    icon={<Quiz />}
                    label="Participants"
                    sx={{
                      bgcolor: alpha(andEventColors.primary, 0.2),
                      color: "white",
                      fontWeight: 700,
                      border: `1px solid ${alpha(andEventColors.accent, 0.3)}`,
                    }}
                  />
                </Stack>

                <Stack alignItems="center" spacing={1}>
                  <Typography
                    variant="h3"
                    fontWeight={900}
                    sx={{ color: "white" }}
                  >
                    98%
                  </Typography>
                  <Chip
                    icon={<Star />}
                    label="Satisfaction"
                    sx={{
                      bgcolor: alpha(andEventColors.primary, 0.2),
                      color: "white",
                      fontWeight: 700,
                      border: `1px solid ${alpha(andEventColors.accent, 0.3)}`,
                    }}
                  />
                </Stack>
              </Stack>
            </Grow>

            {/* How It Works - Red themed cards */}
            <Grid container spacing={3} sx={{ mt: 4 }}>
              {[
                {
                  step: "01",
                  title: "Create Event",
                  description:
                    "Set up your interactive event with custom quizzes and engagement tools",
                  icon: <Bolt />,
                  color: andEventColors.primary,
                },
                {
                  step: "02",
                  title: "Share PIN",
                  description:
                    "Participants join instantly using your unique event PIN",
                  icon: <Group />,
                  color: andEventColors.accent,
                },
                {
                  step: "03",
                  title: "Engage & Analyze",
                  description:
                    "Real-time interaction with live leaderboards and analytics",
                  icon: <Timeline />,
                  color: andEventColors.secondary,
                },
              ].map((item, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Fade in timeout={800 + index * 200}>
                    <Paper
                      sx={{
                        p: 4,
                        height: "100%",
                        background: alpha(andEventColors.dark, 0.2),
                        backdropFilter: "blur(5px)",
                        borderRadius: 4,
                        border: `1px solid ${alpha(item.color, 0.2)}`,
                        transition: "all 0.3s ease",
                        position: "relative",
                        overflow: "hidden",
                        "&:hover": {
                          transform: "translateY(-8px)",
                          background: alpha(andEventColors.dark, 0.4),
                          border: `1px solid ${alpha(item.color, 0.4)}`,
                          "& .step-number": {
                            transform: "scale(1.2)",
                            color: item.color,
                            opacity: 0.3,
                          },
                        },
                      }}
                    >
                      <Stack spacing={2} alignItems="center">
                        <Typography
                          variant="h2"
                          className="step-number"
                          sx={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            fontSize: "4rem",
                            fontWeight: 900,
                            color: alpha(item.color, 0.1),
                            transition: "all 0.3s ease",
                            zIndex: 0,
                          }}
                        >
                          {item.step}
                        </Typography>
                        <Avatar
                          sx={{
                            bgcolor: alpha(item.color, 0.2),
                            color: item.color,
                            width: 70,
                            height: 70,
                            zIndex: 1,
                            border: `2px solid ${alpha(item.color, 0.3)}`,
                          }}
                        >
                          {item.icon}
                        </Avatar>
                        <Typography
                          variant="h5"
                          fontWeight={700}
                          sx={{ color: "white", zIndex: 1 }}
                        >
                          {item.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          align="center"
                          sx={{
                            color: alpha(theme.palette.common.white, 0.7),
                            zIndex: 1,
                          }}
                        >
                          {item.description}
                        </Typography>
                      </Stack>
                    </Paper>
                  </Fade>
                </Grid>
              ))}
            </Grid>

            {/* Trust Badge - Red themed */}
            <Fade in timeout={1500}>
              <Chip
                icon={<WorkspacePremium />}
                label="Trusted by 500+ event organizers worldwide"
                sx={{
                  bgcolor: alpha(andEventColors.primary, 0.2),
                  color: "white",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  py: 2,
                  px: 1,
                  border: `1px solid ${alpha(andEventColors.accent, 0.3)}`,
                  "& .MuiChip-icon": {
                    color: andEventColors.accent,
                  },
                }}
              />
            </Fade>
          </Stack>
        </Fade>
      </Container>
    </Box>
  );
}
