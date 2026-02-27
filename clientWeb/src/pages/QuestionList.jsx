import React, { useEffect, useState, useMemo } from "react";
import {
  Container,
  Paper,
  Stack,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Alert,
  TextField,
  InputAdornment,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  IconButton,
  Tooltip,
  Pagination,
  Card,
  CardContent,
  Grid,
  useTheme,
  useMediaQuery,
  Skeleton,
  Collapse,
  Badge,
  Divider,
  Zoom,
  Fab,
  LinearProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getQuestions, deleteQuestion } from "../services/questionService";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  CheckCircle as EasyIcon,
  Warning as MediumIcon,
  Error as HardIcon,
  Category as CategoryIcon,
  Timer as TimerIcon,
  Sort as SortIcon,
  Download as DownloadIcon,
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
  gradient: "linear-gradient(45deg, #d32f2f 30%, #b71c1c 90%)",
};

export default function QuestionList() {
  const nav = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("text");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const rowsPerPage = 10;

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const data = await getQuestions();
      setQuestions(data);
    } catch (e) {
      setErr(e.message || "Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (id) => {
    try {
      await deleteQuestion(id);
      setDeleteConfirm(null);
      load();
    } catch (e) {
      setErr(e.message || "Failed to delete question");
    }
  };

  // Get unique categories
  const categories = useMemo(() => {
    const cats = questions.map((q) => q.category).filter(Boolean);
    return [...new Set(cats)];
  }, [questions]);

  // Filter and sort questions
  const filteredQuestions = useMemo(() => {
    let filtered = [...questions];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (q) =>
          q.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.category?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply difficulty filter
    if (difficultyFilter !== "all") {
      filtered = filtered.filter(
        (q) => q.difficulty?.toLowerCase() === difficultyFilter.toLowerCase(),
      );
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((q) => q.category === categoryFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (sortBy === "seconds") {
        valA = parseInt(valA) || 0;
        valB = parseInt(valB) || 0;
      } else {
        valA = (valA || "").toLowerCase();
        valB = (valB || "").toLowerCase();
      }

      if (sortOrder === "asc") {
        return valA < valB ? -1 : valA > valB ? 1 : 0;
      } else {
        return valA > valB ? -1 : valA < valB ? 1 : 0;
      }
    });

    return filtered;
  }, [
    questions,
    searchTerm,
    difficultyFilter,
    categoryFilter,
    sortBy,
    sortOrder,
  ]);

  // Calculate stats
  const stats = useMemo(
    () => ({
      total: questions.length,
      easy: questions.filter((q) => q.difficulty?.toLowerCase() === "easy")
        .length,
      medium: questions.filter((q) => q.difficulty?.toLowerCase() === "medium")
        .length,
      hard: questions.filter((q) => q.difficulty?.toLowerCase() === "hard")
        .length,
    }),
    [questions],
  );

  // Pagination
  const paginatedQuestions = filteredQuestions.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  const totalPages = Math.ceil(filteredQuestions.length / rowsPerPage);

  // Get difficulty icon and color
  const getDifficultyProps = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return {
          icon: <EasyIcon />,
          color: "success",
          bgcolor: "#e8f5e8",
          textColor: "#2e7d32",
        };
      case "medium":
        return {
          icon: <MediumIcon />,
          color: "warning",
          bgcolor: "#fff3e0",
          textColor: "#ed6c02",
        };
      case "hard":
        return {
          icon: <HardIcon />,
          color: "error",
          bgcolor: "#ffebee",
          textColor: "#d32f2f",
        };
      default:
        return {
          icon: null,
          color: "default",
          bgcolor: "#f5f5f5",
          textColor: "#666",
        };
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDifficultyFilter("all");
    setCategoryFilter("all");
    setSortBy("text");
    setSortOrder("asc");
    setPage(1);
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ["Question", "Difficulty", "Category", "Seconds"];
    const csvData = filteredQuestions.map((q) => [
      `"${q.text || ""}"`,
      q.difficulty || "",
      q.category || "",
      q.seconds || 0,
    ]);

    const csv = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `questions_export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 3, borderTop: `4px solid ${redTheme.primary}` }}>
          <Stack spacing={2}>
            <Skeleton variant="text" height={60} />
            <Skeleton variant="rectangular" height={200} />
            <Skeleton variant="rectangular" height={200} />
          </Stack>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Stats Cards with Red Theme */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Paper
            sx={{
              p: 2,
              textAlign: "center",
              bgcolor: "#ffffff",
              border: `1px solid ${redTheme.primaryLight}`,
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: `0 4px 12px ${redTheme.primaryLight}`,
              },
            }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{ color: redTheme.primaryDark }}
            >
              {stats.total}
            </Typography>
            <Typography color="textSecondary">Total Questions</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper
            sx={{
              p: 2,
              textAlign: "center",
              bgcolor: "#e8f5e8",
              border: "1px solid #4caf50",
              transition: "transform 0.2s",
              "&:hover": { transform: "translateY(-2px)" },
            }}
          >
            <Typography variant="h4" fontWeight="bold" color="success.main">
              {stats.easy}
            </Typography>
            <Typography color="textSecondary">Easy</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper
            sx={{
              p: 2,
              textAlign: "center",
              bgcolor: "#fff3e0",
              border: "1px solid #ff9800",
              transition: "transform 0.2s",
              "&:hover": { transform: "translateY(-2px)" },
            }}
          >
            <Typography variant="h4" fontWeight="bold" color="warning.main">
              {stats.medium}
            </Typography>
            <Typography color="textSecondary">Medium</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper
            sx={{
              p: 2,
              textAlign: "center",
              bgcolor: "#ffebee",
              border: `1px solid ${redTheme.primary}`,
              transition: "transform 0.2s",
              "&:hover": { transform: "translateY(-2px)" },
            }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{ color: redTheme.primaryDark }}
            >
              {stats.hard}
            </Typography>
            <Typography color="textSecondary">Hard</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper
        sx={{
          p: 3,
          borderTop: `4px solid ${redTheme.primary}`,
          boxShadow: `0 4px 12px ${redTheme.primaryLight}`,
        }}
      >
        {/* Header with Red Theme */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={2}
          mb={3}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography
              variant="h5"
              fontWeight={900}
              sx={{ color: redTheme.primaryDark }}
            >
              Questions
            </Typography>
            <Chip
              label={filteredQuestions.length}
              size="small"
              sx={{
                bgcolor: redTheme.primaryBg,
                color: redTheme.primaryDark,
                border: `1px solid ${redTheme.primaryLight}`,
              }}
            />
          </Stack>

          <Stack direction="row" spacing={1}>
            <Tooltip title="Export to CSV">
              <IconButton
                onClick={exportToCSV}
                size="small"
                sx={{
                  color: redTheme.primary,
                  "&:hover": { bgcolor: redTheme.primaryBg },
                }}
              >
                <DownloadIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Refresh">
              <IconButton
                onClick={load}
                size="small"
                sx={{
                  color: redTheme.primary,
                  "&:hover": { bgcolor: redTheme.primaryBg },
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => nav("/questions/new")}
              fullWidth={isMobile}
              sx={{
                bgcolor: redTheme.primary,
                "&:hover": {
                  bgcolor: redTheme.primaryDark,
                },
              }}
            >
              Add Question
            </Button>
          </Stack>
        </Stack>

        {err && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErr("")}>
            {err}
          </Alert>
        )}

        {/* Search and Filters with Red Theme */}
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            mb: 3,
            borderColor: redTheme.primaryLight,
          }}
        >
          <Stack spacing={2}>
            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search questions or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: redTheme.primary }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setSearchTerm("")}
                        sx={{ color: redTheme.primary }}
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Badge
                color="error"
                variant="dot"
                invisible={
                  difficultyFilter === "all" && categoryFilter === "all"
                }
              >
                <IconButton
                  onClick={() => setShowFilters(!showFilters)}
                  sx={{
                    color: redTheme.primary,
                    "&:hover": { bgcolor: redTheme.primaryBg },
                  }}
                >
                  <FilterIcon />
                </IconButton>
              </Badge>
            </Stack>

            <Collapse in={showFilters}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <FormControl size="small" fullWidth>
                  <InputLabel
                    sx={{ "&.Mui-focused": { color: redTheme.primary } }}
                  >
                    Difficulty
                  </InputLabel>
                  <Select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    label="Difficulty"
                    sx={{
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: redTheme.primary,
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: redTheme.primary,
                      },
                    }}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="easy">Easy</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="hard">Hard</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" fullWidth>
                  <InputLabel
                    sx={{ "&.Mui-focused": { color: redTheme.primary } }}
                  >
                    Category
                  </InputLabel>
                  <Select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    label="Category"
                    sx={{
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: redTheme.primary,
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: redTheme.primary,
                      },
                    }}
                  >
                    <MenuItem value="all">All</MenuItem>
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small" fullWidth>
                  <InputLabel
                    sx={{ "&.Mui-focused": { color: redTheme.primary } }}
                  >
                    Sort By
                  </InputLabel>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    label="Sort By"
                    sx={{
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: redTheme.primary,
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: redTheme.primary,
                      },
                    }}
                  >
                    <MenuItem value="text">Question</MenuItem>
                    <MenuItem value="difficulty">Difficulty</MenuItem>
                    <MenuItem value="category">Category</MenuItem>
                    <MenuItem value="seconds">Time</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  variant="outlined"
                  onClick={clearFilters}
                  startIcon={<ClearIcon />}
                  fullWidth={isMobile}
                  sx={{
                    color: redTheme.primary,
                    borderColor: redTheme.primary,
                    "&:hover": {
                      borderColor: redTheme.primaryDark,
                      bgcolor: redTheme.primaryBg,
                    },
                  }}
                >
                  Clear
                </Button>
              </Stack>
            </Collapse>
          </Stack>
        </Paper>

        {/* Results Info with Red Theme */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Typography variant="body2" color="textSecondary">
            Showing {paginatedQuestions.length} of {filteredQuestions.length}{" "}
            questions
          </Typography>
          <Button
            size="small"
            onClick={() => toggleSort(sortBy)}
            sx={{ color: redTheme.primary }}
            startIcon={
              <SortIcon
                sx={{
                  color: redTheme.primary,
                  transform: sortOrder === "desc" ? "scaleY(-1)" : "none",
                }}
              />
            }
          >
            {sortOrder === "asc" ? "Ascending" : "Descending"}
          </Button>
        </Stack>

        {/* Mobile Card View */}
        {isMobile ? (
          <Stack spacing={2}>
            {paginatedQuestions.map((q) => {
              const difficultyProps = getDifficultyProps(q.difficulty);
              return (
                <Card
                  key={q.id}
                  variant="outlined"
                  sx={{
                    borderColor: redTheme.primaryLight,
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "translateX(4px)",
                      borderColor: redTheme.primary,
                    },
                  }}
                >
                  <CardContent>
                    <Stack spacing={1.5}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {q.text}
                      </Typography>

                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        <Chip
                          size="small"
                          icon={difficultyProps.icon}
                          label={q.difficulty}
                          sx={{
                            bgcolor: difficultyProps.bgcolor,
                            color: difficultyProps.textColor,
                            "& .MuiChip-icon": {
                              color: difficultyProps.textColor,
                            },
                          }}
                        />
                        {q.category && (
                          <Chip
                            size="small"
                            icon={<CategoryIcon />}
                            label={q.category}
                            variant="outlined"
                          />
                        )}
                        <Chip
                          size="small"
                          icon={<TimerIcon />}
                          label={`${q.seconds || 0}s`}
                          variant="outlined"
                        />
                      </Stack>

                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                      >
                        <Button
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => nav(`/questions/${q.id}/edit`)}
                          sx={{ color: redTheme.primary }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={() => {
                            if (window.confirm("Delete this question?")) {
                              onDelete(q.id);
                            }
                          }}
                          sx={{ color: redTheme.primaryDark }}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        ) : (
          /* Desktop Table View */
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: redTheme.primaryBg }}>
                <TableCell
                  onClick={() => toggleSort("text")}
                  sx={{
                    cursor: "pointer",
                    color: redTheme.primaryDark,
                    fontWeight: 600,
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    Question
                    {sortBy === "text" && (
                      <SortIcon
                        fontSize="small"
                        sx={{
                          color: redTheme.primary,
                          transform:
                            sortOrder === "desc" ? "scaleY(-1)" : "none",
                        }}
                      />
                    )}
                  </Stack>
                </TableCell>
                <TableCell
                  onClick={() => toggleSort("difficulty")}
                  sx={{
                    cursor: "pointer",
                    color: redTheme.primaryDark,
                    fontWeight: 600,
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    Difficulty
                    {sortBy === "difficulty" && (
                      <SortIcon
                        fontSize="small"
                        sx={{
                          color: redTheme.primary,
                          transform:
                            sortOrder === "desc" ? "scaleY(-1)" : "none",
                        }}
                      />
                    )}
                  </Stack>
                </TableCell>
                <TableCell
                  onClick={() => toggleSort("category")}
                  sx={{
                    cursor: "pointer",
                    color: redTheme.primaryDark,
                    fontWeight: 600,
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    Category
                    {sortBy === "category" && (
                      <SortIcon
                        fontSize="small"
                        sx={{
                          color: redTheme.primary,
                          transform:
                            sortOrder === "desc" ? "scaleY(-1)" : "none",
                        }}
                      />
                    )}
                  </Stack>
                </TableCell>
                <TableCell
                  align="right"
                  onClick={() => toggleSort("seconds")}
                  sx={{
                    cursor: "pointer",
                    color: redTheme.primaryDark,
                    fontWeight: 600,
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="flex-end"
                    spacing={0.5}
                  >
                    Seconds
                    {sortBy === "seconds" && (
                      <SortIcon
                        fontSize="small"
                        sx={{
                          color: redTheme.primary,
                          transform:
                            sortOrder === "desc" ? "scaleY(-1)" : "none",
                        }}
                      />
                    )}
                  </Stack>
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: redTheme.primaryDark, fontWeight: 600 }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedQuestions.map((q) => {
                const difficultyProps = getDifficultyProps(q.difficulty);
                return (
                  <TableRow
                    key={q.id}
                    hover
                    sx={{
                      "&:hover": { bgcolor: redTheme.primaryBg },
                      transition: "background-color 0.2s",
                    }}
                  >
                    <TableCell>
                      <Typography noWrap sx={{ maxWidth: 300 }}>
                        {q.text}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        icon={difficultyProps.icon}
                        label={q.difficulty}
                        sx={{
                          bgcolor: difficultyProps.bgcolor,
                          color: difficultyProps.textColor,
                          "& .MuiChip-icon": {
                            color: difficultyProps.textColor,
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {q.category && (
                        <Chip
                          size="small"
                          label={q.category}
                          variant="outlined"
                        />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-end"
                        spacing={0.5}
                      >
                        <TimerIcon
                          fontSize="small"
                          sx={{ color: redTheme.primary }}
                        />
                        <Typography>{q.seconds || 0}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={0.5}
                        justifyContent="flex-end"
                      >
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => nav(`/questions/${q.id}/edit`)}
                            sx={{
                              color: redTheme.primary,
                              "&:hover": { bgcolor: redTheme.primaryBg },
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => {
                              if (window.confirm("Delete this question?")) {
                                onDelete(q.id);
                              }
                            }}
                            sx={{
                              color: redTheme.primaryDark,
                              "&:hover": { bgcolor: redTheme.primaryBg },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}

              {filteredQuestions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Stack spacing={2} alignItems="center">
                      <Typography color="textSecondary">
                        No questions found
                      </Typography>
                      <Button
                        variant="outlined"
                        onClick={clearFilters}
                        size="small"
                        sx={{
                          color: redTheme.primary,
                          borderColor: redTheme.primary,
                          "&:hover": {
                            borderColor: redTheme.primaryDark,
                            bgcolor: redTheme.primaryBg,
                          },
                        }}
                      >
                        Clear Filters
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}

        {/* Pagination with Red Theme */}
        {totalPages > 1 && (
          <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
              size={isMobile ? "small" : "medium"}
              showFirstButton
              showLastButton
              sx={{
                "& .MuiPaginationItem-root": {
                  color: redTheme.primary,
                  "&.Mui-selected": {
                    bgcolor: redTheme.primary,
                    color: "white",
                    "&:hover": {
                      bgcolor: redTheme.primaryDark,
                    },
                  },
                  "&:hover": {
                    bgcolor: redTheme.primaryBg,
                  },
                },
              }}
            />
          </Stack>
        )}

        {/* Floating Action Button for Mobile */}
        {isMobile && (
          <Zoom in={true}>
            <Fab
              sx={{
                position: "fixed",
                bottom: 16,
                right: 16,
                bgcolor: redTheme.primary,
                "&:hover": {
                  bgcolor: redTheme.primaryDark,
                },
              }}
              onClick={() => nav("/questions/new")}
            >
              <AddIcon sx={{ color: "white" }} />
            </Fab>
          </Zoom>
        )}
      </Paper>
    </Container>
  );
}
