import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getQuestions, deleteQuestion } from "../services/questionService";

export default function QuestionList() {
  const nav = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [err, setErr] = useState("");

  const load = async () => {
    setErr("");
    try {
      const data = await getQuestions();
      setQuestions(data);
    } catch (e) {
      setErr(e.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (id) => {
    if (!confirm("Delete this question?")) return;
    try {
      await deleteQuestion(id);
      load();
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h5" fontWeight={900}>
            Questions
          </Typography>
          <Button variant="contained" onClick={() => nav("/questions/new")}>
            Add Question
          </Button>
        </Stack>

        {err && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {err}
          </Alert>
        )}

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Question</b>
              </TableCell>
              <TableCell>
                <b>Difficulty</b>
              </TableCell>
              <TableCell>
                <b>Category</b>
              </TableCell>
              <TableCell align="right">
                <b>Seconds</b>
              </TableCell>
              <TableCell align="right">
                <b>Actions</b>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {questions.map((q) => (
              <TableRow key={q._id}>
                <TableCell>{q.text}</TableCell>
                <TableCell>{q.difficulty}</TableCell>
                <TableCell>{q.category}</TableCell>
                <TableCell align="right">{q.seconds}</TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button
                      size="small"
                      onClick={() => nav(`/questions/${q._id}/edit`)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => onDelete(q._id)}
                    >
                      Delete
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}

            {questions.length === 0 && (
              <TableRow>
                <TableCell colSpan={5}>No questions found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
