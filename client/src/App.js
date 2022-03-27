import HomePage from "./pages/HomePage";
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import ChatComponent from "./components/chat/ChatComponent";
import ChatRoomComponent from "./components/chat/ChatRoomComponent";
import { SocketContext, socket } from "./context/socket";

function App() {
  const renderChatComponent = () => {
    return (
      <SocketContext.Provider value={socket}>
        <ChatComponent />
      </SocketContext.Provider>
    );
  };

  const renderChatRoomComponent = () => {
    return (
      <SocketContext.Provider value={socket}>
        <ChatRoomComponent />
      </SocketContext.Provider>
    );
  };

  return (
    <Router>
      <Switch>
        <Route
          path="/chat-room"
          render={(props) => {
            return renderChatRoomComponent();
          }}
          exact={true}
        />
        {/* <Route
          path="/chat"
          render={(props) => {
            return renderChatComponent();
          }}
          exact={true}
        /> */}

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
