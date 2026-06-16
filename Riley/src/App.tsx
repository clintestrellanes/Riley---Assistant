
import "./App.css";
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
// main page
import ProjectManager from "./app/project_manager";
import BottomNav from "./app/navigation/bottom_nav";


// pages
import CalendarView from "./app/project_manager/calendar";


function App() {
  return (
    <Router>
      <div className="w-full h-full">
        <Routes>
          <Route path="/" element={<ProjectManager />} />
          <Route path="/calendar/:title" element={<CalendarView />} />
        </Routes>
        <BottomNav /> 
      </div>  

      
    </Router>
    
  );
}

export default App;
