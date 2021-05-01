import { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import AuthPage from "./pages/auth";
import SchedulePage from "./pages/schedule";
import FolderPage from "./pages/doc";
import NoteList from "./pages/doc/lists/NoteList";
import Editor from "./pages/doc/editor/Editor";
import TodoPage from "./pages/todo";
import DashBoardPage from "./pages/dashboard";
import Navigation from "./components/Navigation";
import Auth from "./hoc/auth";
import CalendarPage from "./pages/calendar";
import UnkownPage from "./pages/unknown";

// hoc rule
// null => 아무나 출입가능
// true => 로그인 한 유저만 출입가능
// false => 로그인 한 유저는 출입 불가능

function Root(): JSX.Element {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const userInfo = localStorage.getItem("meemo-user-id");

    if (userInfo) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, []);
  return (
    <BrowserRouter>
      {!visible ? null : <Navigation />}
      {/*배포용*/}

      {/* <Navigation /> */}
      {/*테스트용*/}

      <Switch>
        {/*배포용*/}
        <Route component={Auth(AuthPage, false)} path="/auth" exact />
        <Route component={Auth(DashBoardPage, true)} path="/" exact />
        <Route component={Auth(TodoPage, true)} path="/todo" exact />
        <Route component={Auth(SchedulePage, true)} path="/schedule" exact />
        <Route component={Auth(FolderPage, true)} path="/folders" exact />
        <Route component={Auth(CalendarPage, true)} path="/calendar" exact />
        <Route
          component={Auth(NoteList, true)}
          path="/folders/:folderTitle"
          exact
        />
        <Route
          component={Auth(Editor, true)}
          path="/folders/:folderTitle/:noteId"
          exact
        />
        <Route component={Auth(UnkownPage, null)} path="*" />

        {/*테스트용*/}
        {/* <Route component={Auth(AuthPage, null)} path="/auth" exact />
        <Route component={Auth(DashBoardPage, null)} path="/" exact />
        <Route component={Auth(CalendarPage, null)} path="/calendar" exact />
        <Route component={Auth(SchedulePage, null)} path="/schedule" exact />
        <Route component={Auth(TodoPage, null)} path="/todo" exact />
        <Route component={Auth(FolderPage, null)} path="/folders" exact />
        <Route
          component={Auth(NoteList, null)}
          path="/folders/:folderTitle"
          exact
        />
        <Route
          component={Auth(Editor, null)}
          path="/folders/:folderTitle/:noteId"
          exact
        />
        <Route component={Auth(UnkownPage, null)} path="*" /> */}
      </Switch>
    </BrowserRouter>
  );
}

export default Root;
