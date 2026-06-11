import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";

// main page
import ProjectManager from "./app/project_manager";
import BottomNav from "./app/navigation/bottom_nav";
function App() {
  return (
    <div className="w-full h-full">
      <ProjectManager />
      <BottomNav />
    </div>
  );
}

export default App;
