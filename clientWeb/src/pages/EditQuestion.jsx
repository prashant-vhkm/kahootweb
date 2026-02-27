import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Stack,
  Typography,
  TextField,
  MenuItem,
  Button,
  Alert,
  Box,
  Divider,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { getQuestion, updateQuestion } from "../services/questionService";
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Help as HelpIcon,
  Timer as TimerIcon,
  Category as CategoryIcon,
  Psychology as PsychologyIcon,
} from "@mui/icons-material";

// Red theme colors
const redTheme = {
  primary: "#d32f2f", // Main red
  primaryLight: "#ef5350", // Light red
  primaryDark: "#b71c1c", // Dark red
  primaryBg: "#ffebee", // Very light red background
  secondary: "#b71c1c", // Dark red for secondary elements
  hover: "#c62828", // Hover state
  active: "#b71c1c", // Active state
  text: "#b71c1c", // Text color
};

export default function EditQuestion() {
  const nav = useNavigate();
  const { id } = useParams();

  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    text: "",
    options: ["", "", "", ""],
    correctIndex: 0,
    seconds: 30,
    difficulty: "medium",
    category: "",
  });

  const setOption = (i, val) => {
    const next = [...form.options];
    next[i] = val;
    setForm({ ...form, options: next });
  };

  useEffect(() => {
    (async () => {
      setErr("");
      try {
        const q = await getQuestion(id);
        setForm({
          text: q.text || "",
          options: q.options?.length === 4 ? q.options : ["", "", "", ""],
          correctIndex: q.correctIndex ?? 0,
          seconds: q.seconds ?? 30,
          difficulty: q.difficulty ?? "medium",
          category: q.category ?? "",
        });
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const validateForm = () => {
    if (!form.text.trim()) return "Question text is required";
    if (form.options.some((o) => !o.trim())) return "All options are required";
    if (!form.category.trim()) return "Category is required";
    if (form.seconds < 5 || form.seconds > 300)
      return "Seconds must be between 5 and 300";
    return null;
  };

  const submit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setErr(validationError);
      return;
    }

    setSaving(true);
    setErr("");
    setSuccess("");

    try {
      await updateQuestion(id, {
        ...form,
        text: form.text.trim(),
        options: form.options.map((o) => o.trim()),
        category: form.category.trim(),
      });

      setSuccess("Question updated successfully!");

      setTimeout(() => {
        nav("/questions");
      }, 1500);
    } catch (e) {
      setErr(e.message || "Failed to update question");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper
          sx={{ p: 4, textAlign: "center", borderColor: redTheme.primary }}
        >
          <Typography color={redTheme.primary}>Loading question...</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderTop: `4px solid ${redTheme.primary}`,
        }}
      >
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
          <IconButton
            onClick={() => nav("/questions")}
            size="small"
            sx={{
              color: redTheme.primary,
              "&:hover": { bgcolor: redTheme.primaryBg },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h5"
            fontWeight={600}
            sx={{ color: redTheme.primaryDark }}
          >
            Edit Question
          </Typography>
        </Stack>

        {/* Alerts */}
        {err && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErr("")}>
            {err}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        {/* Form */}
        <Stack spacing={3}>
          {/* Question Text */}
          <TextField
            label="Question"
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
            multiline
            rows={2}
            fullWidth
            placeholder="Enter your question here..."
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: redTheme.primary,
                },
                "&.Mui-focused fieldset": {
                  borderColor: redTheme.primary,
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: redTheme.primary,
              },
            }}
          />

          <Divider
            sx={{
              "&::before, &::after": { borderColor: redTheme.primaryLight },
              "& .MuiDivider-wrapper": { color: redTheme.primary },
            }}
          >
            Answer Options
          </Divider>

          {/* Options */}
          <Grid container spacing={2}>
            {form.options.map((opt, i) => (
              <Grid item xs={12} sm={6} key={i}>
                <Card
                  variant="outlined"
                  sx={{
                    bgcolor:
                      i === form.correctIndex ? redTheme.primaryBg : "white",
                    borderColor:
                      i === form.correctIndex ? redTheme.primary : "divider",
                    borderWidth: i === form.correctIndex ? 2 : 1,
                  }}
                >
                  <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                    <Stack spacing={1}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color:
                              i === form.correctIndex
                                ? redTheme.primaryDark
                                : "text.secondary",
                            fontWeight: i === form.correctIndex ? 600 : 400,
                          }}
                        >
                          Option {i + 1}
                        </Typography>
                        {i === form.correctIndex && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: redTheme.primary,
                              fontWeight: 500,
                              bgcolor: redTheme.primaryBg,
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                            }}
                          >
                            ✓ Correct Answer
                          </Typography>
                        )}
                      </Stack>

                      <TextField
                        size="small"
                        value={opt}
                        onChange={(e) => setOption(i, e.target.value)}
                        placeholder={`Enter option ${i + 1}`}
                        fullWidth
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&:hover fieldset": {
                              borderColor: redTheme.primary,
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: redTheme.primary,
                            },
                          },
                        }}
                      />

                      {i !== form.correctIndex && (
                        <Button
                          size="small"
                          variant="text"
                          onClick={() => setForm({ ...form, correctIndex: i })}
                          sx={{
                            alignSelf: "flex-start",
                            color: redTheme.primary,
                            "&:hover": {
                              bgcolor: redTheme.primaryBg,
                            },
                          }}
                        >
                          Mark as Correct
                        </Button>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Divider
            sx={{
              "&::before, &::after": { borderColor: redTheme.primaryLight },
              "& .MuiDivider-wrapper": { color: redTheme.primary },
            }}
          >
            Question Settings
          </Divider>

          {/* Settings Grid */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Correct Option"
                value={form.correctIndex}
                onChange={(e) =>
                  setForm({ ...form, correctIndex: Number(e.target.value) })
                }
                fullWidth
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: redTheme.primary,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: redTheme.primary,
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: redTheme.primary,
                  },
                }}
              >
                {[0, 1, 2, 3].map((i) => (
                  <MenuItem key={i} value={i}>
                    Option {i + 1}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                type="number"
                label="Time Limit (seconds)"
                value={form.seconds}
                onChange={(e) =>
                  setForm({ ...form, seconds: Number(e.target.value) })
                }
                inputProps={{ min: 5, max: 300 }}
                fullWidth
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TimerIcon
                        sx={{ color: redTheme.primary }}
                        fontSize="small"
                      />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: redTheme.primary,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: redTheme.primary,
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: redTheme.primary,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Difficulty"
                value={form.difficulty}
                onChange={(e) =>
                  setForm({ ...form, difficulty: e.target.value })
                }
                fullWidth
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PsychologyIcon
                        sx={{ color: redTheme.primary }}
                        fontSize="small"
                      />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: redTheme.primary,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: redTheme.primary,
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: redTheme.primary,
                  },
                }}
              >
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="hard">Hard</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                fullWidth
                size="small"
                placeholder="e.g., Math, Science, History"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CategoryIcon
                        sx={{ color: redTheme.primary }}
                        fontSize="small"
                      />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: redTheme.primary,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: redTheme.primary,
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: redTheme.primary,
                  },
                }}
              />
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Stack
            direction="row"
            spacing={2}
            justifyContent="flex-end"
            sx={{ mt: 2 }}
          >
            <Button
              variant="outlined"
              onClick={() => nav("/questions")}
              disabled={saving}
              sx={{
                color: redTheme.primary,
                borderColor: redTheme.primary,
                "&:hover": {
                  borderColor: redTheme.primaryDark,
                  bgcolor: redTheme.primaryBg,
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={submit}
              disabled={saving}
              startIcon={<SaveIcon />}
              sx={{
                bgcolor: redTheme.primary,
                "&:hover": {
                  bgcolor: redTheme.primaryDark,
                },
                "&:disabled": {
                  bgcolor: redTheme.primaryLight,
                },
              }}
            >
              {saving ? "Saving..." : "Update Question"}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}
