const API = "https://kahoot-server-w9v0.onrender.com/api/questions";

async function handle(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.message || "Request failed");
  return data;
}

export const getQuestions = async () => handle(await fetch(API));
export const getQuestion = async (id) => handle(await fetch(`${API}/${id}`));

export const createQuestion = async (payload) =>
  handle(
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );

export const updateQuestion = async (id, payload) =>
  handle(
    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );

export const deleteQuestion = async (id) =>
  handle(await fetch(`${API}/${id}`, { method: "DELETE" }));
