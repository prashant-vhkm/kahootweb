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
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { getQuestion, updateQuestion } from "../services/questionService";

export default function EditQuestion() {
  const nav = useNavigate();
  const { id } = useParams();

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    text: "",
    options: ["", "", "", ""],
    correctIndex: 0,
    seconds: 12,
    difficulty: "easy",
    category: "general",
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
          seconds: q.seconds ?? 12,
          difficulty: q.difficulty ?? "easy",
          category: q.category ?? "general",
        });
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const submit = async () => {
    setErr("");
    try {
      if (!form.text.trim()) throw new Error("Question text required");
      if (form.options.some((o) => !o.trim()))
        throw new Error("All 4 options required");

      await updateQuestion(id, {
        ...form,
        text: form.text.trim(),
        options: form.options.map((o) => o.trim()),
        category: form.category.trim(),
      });

      nav("/questions");
    } catch (e) {
      setErr(e.message);
    }
  };

  if (loading) return <Container sx={{ py: 4 }}>Loading...</Container>;

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight={900}>
            Edit Question
          </Typography>

          {err && <Alert severity="error">{err}</Alert>}

          <TextField
            label="Question"
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
          />

          {form.options.map((opt, i) => (
            <TextField
              key={i}
              label={`Option ${i + 1}`}
              value={opt}
              onChange={(e) => setOption(i, e.target.value)}
            />
          ))}

          <TextField
            select
            label="Correct Option"
            value={form.correctIndex}
            onChange={(e) =>
              setForm({ ...form, correctIndex: Number(e.target.value) })
            }
          >
            {[0, 1, 2, 3].map((i) => (
              <MenuItem key={i} value={i}>
                Option {i + 1}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            type="number"
            label="Seconds"
            value={form.seconds}
            onChange={(e) =>
              setForm({ ...form, seconds: Number(e.target.value) })
            }
            inputProps={{ min: 5, max: 60 }}
          />

          <TextField
            select
            label="Difficulty"
            value={form.difficulty}
            onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
          >
            <MenuItem value="easy">easy</MenuItem>
            <MenuItem value="medium">medium</MenuItem>
            <MenuItem value="hard">hard</MenuItem>
          </TextField>

          <TextField
            label="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />

          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={submit}>
              Update
            </Button>
            <Button variant="outlined" onClick={() => nav("/questions")}>
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}
