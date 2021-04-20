import { BrowserRouter, Switch, Route } from "react-router-dom";
import AuthPage from "./pages/auth";
import SchedulePage from "./pages/schedule";
import FolderPage from "./pages/doc";
import TodoPage from "./pages/todo";
import DashBoardPage from "./pages/dashboard";
import Navigation from "./components/Navigation";
import Auth from "./hoc/auth";
import CalendarPage from "./pages/calendar";

function Root(): JSX.Element {
  // hoc rule
  // null => 아무나 출입가능
  // true => 로그인 한 유저만 출입가능
  // false => 로그인 한 유저는 출입 불가능

  return (
    <BrowserRouter>
      <Navigation />
      <Switch>
        <Route component={Auth(AuthPage, false)} path="/auth" exact />
        <Route component={Auth(DashBoardPage, true)} path="/" exact />
        <Route component={Auth(CalendarPage, true)} path="/calendar" exact />
        <Route component={Auth(SchedulePage, true)} path="/schedule" exact />
        <Route component={Auth(TodoPage, true)} path="/todo" exact />
        <Route component={Auth(FolderPage, true)} path="/folders" exact />
      </Switch>
    </BrowserRouter>
  );
}

export default Root;
