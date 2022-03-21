import HomePage from "./pages/HomePage";
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import ChatComponent from "./components/chat/ChatComponent";
import { SocketContext, socket } from "./context/socket";

function App() {
  const renderChatComponent = () => {
    return (
      <SocketContext.Provider value={socket}>
        <ChatComponent />
      </SocketContext.Provider>
    );
  };

  return (
    <Router>
      <Switch>
        <Route
          path="/chat"
          render={(props) => {
            return renderChatComponent();
          }}
          exact={true}
        />
        <Route
          path="/"
          render={(props) => {
            return <HomePage />;
          }}
          exact={true}
        />
      </Switch>
    </Router>
  );
}

export default App;
