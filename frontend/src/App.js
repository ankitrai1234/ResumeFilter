import "./App.css";
import ResumeUploader from "./components/ResumeUploader";
 import Chatbot from "./components/Chatbot";

function App() {
  return (
    <>
      <div className="App">
        <ResumeUploader />
      </div>
      { <div>
        <h2>Resume Matching Chatbot</h2>
        <Chatbot />
      </div> }
    </>
  );
}

export default App;
