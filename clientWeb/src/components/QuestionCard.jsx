import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Button,
  Stack,
  Box,
  LinearProgress,
  useTheme,
  alpha,
  Fade,
  Grow,
  Chip,
  Zoom,
  Avatar,
} from "@mui/material";
import {
  Timer,
  Lightbulb,
  CheckCircle,
  Cancel,
  Bolt,
  Whatshot,
  EmojiEvents,
  Stars,
} from "@mui/icons-material";

export default function QuestionCard({ question, onSubmit }) {
  const theme = useTheme();
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(question.seconds);
  const [submitted, setSubmitted] = useState(false);
  const [hoveredOption, setHoveredOption] = useState(null);

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
    if (timeLeft <= 0) {
      if (!submitted) handleSubmit(null);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  const handleSelect = (index) => {
    if (!submitted) setSelected(index);
  };

  const handleSubmit = (answerIndex) => {
    setSubmitted(true);
    onSubmit(answerIndex, timeLeft);
  };

  const getTimerColor = () => {
    if (timeLeft <= 5) return theme.palette.error.main;
    if (timeLeft <= 10) return theme.palette.warning.main;
    return andEventColors.accent;
  };

  const getTimerIcon = () => {
    if (timeLeft <= 5) return <Whatshot sx={{ fontSize: 20 }} />;
    if (timeLeft <= 10) return <Timer sx={{ fontSize: 20 }} />;
    return <Bolt sx={{ fontSize: 20 }} />;
  };

  const getTimerMessage = () => {
    if (timeLeft <= 5) return "Hurry up! Time's almost up!";
    if (timeLeft <= 10) return "Quick! Make your choice!";
    return "Take your time, but don't delay!";
  };

  return (
    <Fade in timeout={500}>
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

        <Stack spacing={3} sx={{ position: "relative", zIndex: 1 }}>
          {/* Timer and Question Info */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Chip
              icon={<Lightbulb />}
              label="Question"
              sx={{
                bgcolor: alpha(andEventColors.accent, 0.1),
                color: andEventColors.accent,
                fontWeight: 700,
                border: `1px solid ${alpha(andEventColors.accent, 0.3)}`,
              }}
              size="medium"
            />

            <Zoom in>
              <Paper
                elevation={3}
                sx={{
                  p: 1.5,
                  px: 3,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${alpha(
                    getTimerColor(),
                    0.1,
                  )} 0%, ${alpha(getTimerColor(), 0.2)} 100%)`,
                  border: `2px solid ${getTimerColor()}`,
                  animation: timeLeft <= 5 ? "shake 0.5s infinite" : "none",
                  "@keyframes shake": {
                    "0%, 100%": { transform: "translateX(0)" },
                    "25%": { transform: "translateX(-5px)" },
                    "75%": { transform: "translateX(5px)" },
                  },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: alpha(getTimerColor(), 0.2),
                      color: getTimerColor(),
                    }}
                  >
                    {getTimerIcon()}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h4"
                      fontWeight={900}
                      sx={{ color: getTimerColor(), lineHeight: 1 }}
                    >
                      {timeLeft}s
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: getTimerColor(), fontWeight: 600 }}
                    >
                      {getTimerMessage()}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Zoom>
          </Stack>

          {/* Progress Bar with custom styling */}
          <Box sx={{ width: "100%" }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ mb: 1 }}
            >
              <Typography variant="body2" color="text.secondary">
                Time Remaining
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
                height: 12,
                borderRadius: 6,
                bgcolor: alpha(getTimerColor(), 0.1),
                "& .MuiLinearProgress-bar": {
                  background: `linear-gradient(90deg, ${getTimerColor()}, ${alpha(
                    getTimerColor(),
                    0.8,
                  )})`,
                  borderRadius: 6,
                  boxShadow: `0 0 10px ${getTimerColor()}`,
                },
              }}
            />
          </Box>

          {/* Question Text with enhanced styling */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: alpha(andEventColors.accent, 0.03),
              border: `1px solid ${alpha(andEventColors.accent, 0.2)}`,
            }}
          >
            <Typography
              variant="h4"
              fontWeight={700}
              align="center"
              sx={{
                color: andEventColors.dark,
                textShadow: `0 2px 5px ${alpha(andEventColors.accent, 0.1)}`,
              }}
            >
              {question.text}
            </Typography>
          </Paper>

          {/* Answer Options */}
          <Stack spacing={2}>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={{ color: andEventColors.accent }}
            >
              Choose your answer:
            </Typography>

            {question.options.map((option, index) => {
              const isSelected = selected === index;
              const showResult = submitted && question.correct === index;
              const isWrong =
                submitted && isSelected && question.correct !== index;
              const isCorrect = submitted && question.correct === index;

              return (
                <Grow key={index} in timeout={500 + index * 100}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => handleSelect(index)}
                    disabled={submitted}
                    onMouseEnter={() => setHoveredOption(index)}
                    onMouseLeave={() => setHoveredOption(null)}
                    sx={{
                      py: 2.5,
                      px: 3,
                      justifyContent: "flex-start",
                      textTransform: "none",
                      fontSize: "1.1rem",
                      fontWeight: 500,
                      borderRadius: 3,
                      borderWidth: 2,
                      borderColor: isCorrect
                        ? theme.palette.success.main
                        : isWrong
                          ? theme.palette.error.main
                          : isSelected
                            ? andEventColors.accent
                            : hoveredOption === index
                              ? alpha(andEventColors.accent, 0.5)
                              : alpha(andEventColors.accent, 0.2),
                      bgcolor: isCorrect
                        ? alpha(theme.palette.success.main, 0.1)
                        : isWrong
                          ? alpha(theme.palette.error.main, 0.1)
                          : isSelected
                            ? alpha(andEventColors.accent, 0.1)
                            : hoveredOption === index
                              ? alpha(andEventColors.accent, 0.05)
                              : "transparent",
                      "&:hover": {
                        borderWidth: 2,
                        borderColor: andEventColors.accent,
                        bgcolor: alpha(andEventColors.accent, 0.05),
                      },
                      transition: "all 0.3s ease",
                      transform:
                        hoveredOption === index && !submitted
                          ? "scale(1.02)"
                          : "scale(1)",
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      sx={{ width: "100%" }}
                    >
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: isCorrect
                            ? theme.palette.success.main
                            : isWrong
                              ? theme.palette.error.main
                              : isSelected
                                ? andEventColors.accent
                                : alpha(andEventColors.accent, 0.1),
                          color:
                            isSelected || isCorrect || isWrong
                              ? "white"
                              : andEventColors.accent,
                          transition: "all 0.3s ease",
                        }}
                      >
                        {String.fromCharCode(65 + index)}
                      </Avatar>
                      <Typography
                        sx={{ flex: 1, fontWeight: isSelected ? 600 : 500 }}
                      >
                        {option}
                      </Typography>
                      {showResult && (
                        <Zoom in>
                          <CheckCircle
                            sx={{
                              color: theme.palette.success.main,
                              fontSize: 28,
                            }}
                          />
                        </Zoom>
                      )}
                      {isWrong && (
                        <Zoom in>
                          <Cancel
                            sx={{
                              color: theme.palette.error.main,
                              fontSize: 28,
                            }}
                          />
                        </Zoom>
                      )}
                    </Stack>
                  </Button>
                </Grow>
              );
            })}
          </Stack>

          {/* Submit Button */}
          {!submitted && (
            <Fade in>
              <Button
                variant="contained"
                size="large"
                onClick={() => handleSubmit(selected)}
                disabled={selected === null}
                startIcon={<Bolt />}
                endIcon={<EmojiEvents />}
                sx={{
                  mt: 2,
                  py: 2.5,
                  borderRadius: 3,
                  fontSize: "1.3rem",
                  fontWeight: 900,
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
                Submit Answer
              </Button>
            </Fade>
          )}

          {/* Submitted State */}
          {submitted && (
            <Fade in>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${alpha(
                    andEventColors.accent,
                    0.05,
                  )} 0%, ${alpha(andEventColors.primary, 0.05)} 100%)`,
                  border: `1px solid ${alpha(andEventColors.accent, 0.2)}`,
                  textAlign: "center",
                }}
              >
                <Stack spacing={2} alignItems="center">
                  <Avatar
                    sx={{
                      width: 60,
                      height: 60,
                      background: andEventColors.gradient,
                    }}
                  >
                    <Stars sx={{ fontSize: 30 }} />
                  </Avatar>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ color: andEventColors.accent }}
                  >
                    Answer Submitted!
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Waiting for other players to finish...
                  </Typography>
                  <LinearProgress
                    sx={{
                      width: "100%",
                      height: 6,
                      borderRadius: 3,
                      bgcolor: alpha(andEventColors.accent, 0.1),
                      "& .MuiLinearProgress-bar": {
                        background: andEventColors.gradient,
                      },
                    }}
                  />
                </Stack>
              </Paper>
            </Fade>
          )}

          {/* Question Progress */}
          <Stack direction="row" justifyContent="center" spacing={1}>
            {[...Array(question.options.length)].map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor:
                    index === selected
                      ? andEventColors.accent
                      : alpha(andEventColors.accent, 0.2),
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </Stack>
        </Stack>
      </Paper>
    </Fade>
  );
}
