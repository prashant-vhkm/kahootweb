import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppNavbar from "./components/AppNavbar";

// Game Pages
import Home from "./pages/Home";
import Host from "./pages/Host";
import PlayerJoin from "./pages/PlayerJoin";
import GameHost from "./pages/GameHost";
import GamePlayer from "./pages/GamePlayer";

// Question Admin Pages
import QuestionList from "./pages/QuestionList";
import AddQuestion from "./pages/AddQuestion";
import EditQuestion from "./pages/EditQuestion";

export default function App() {
  return (
    <>
      <AppNavbar />

      <Routes>
        {/* Game */}
        <Route path="/" element={<Home />} />
        <Route path="/host" element={<Host />} />
        <Route path="/join" element={<PlayerJoin />} />
        <Route path="/game/host/:pin" element={<GameHost />} />
        <Route path="/game/player/:pin" element={<GamePlayer />} />

        {/* Question Admin */}
        <Route path="/questions" element={<QuestionList />} />
        <Route path="/questions/new" element={<AddQuestion />} />
        <Route path="/questions/:id/edit" element={<EditQuestion />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
