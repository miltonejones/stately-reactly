
import './App.css';
import { useReactly } from './machines';
import { LinearProgress } from '@mui/material';
import { AppList, AppDetail, Diagnostics, AppEditor, StateDrawer, ConnectionDrawer, ScriptDrawer, AppBar } from './components';
import { AppStateContext } from "./context";
import {
  BrowserRouter,
  Routes,
  Route, 
  useNavigate
} from "react-router-dom";
// import { IconSelect } from './styled';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Application />} />
        <Route path="/apps/:event" element={<Application />} /> 
        <Route path="/apps/:event/:id" element={<Application />} /> 
        <Route path="/apps/:event/:id/:subid" element={<Application />} /> 
      </Routes>
    </BrowserRouter>
  );
}



function Application() {
  const navigate = useNavigate();
  const reactly = useReactly();
  const busy = ["configure.loading", "edit.loading", "start.loading", "edit.loaded.get_page"].some(reactly.state.matches)
  return (
    <AppStateContext.Provider value={{ ...reactly }}>
      <AppBar navigate={navigate} {...reactly}/>

      {busy && <LinearProgress />}

      <div className="App">

      <ConnectionDrawer />
      <StateDrawer />
      <ScriptDrawer />
      {reactly.state.matches('configure.loaded') && <AppDetail {...reactly} />}
      {reactly.state.matches('start.loaded') && <AppList navigate={navigate} {...reactly} />}
      {reactly.state.matches('edit.loaded') && <AppEditor navigate={navigate} {...reactly} />}
      {JSON.stringify(reactly.error)}
      {/* {JSON.stringify(reactly.state.value)} */}

      {/* <IconSelect /> */}
      </div>
      <Diagnostics {...reactly.diagnosticProps} />
    </AppStateContext.Provider>
  );
}

export default App;
