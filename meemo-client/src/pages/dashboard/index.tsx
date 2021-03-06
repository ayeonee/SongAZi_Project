import style from "./styles/DashBoard.module.scss";
import Weather from "./weather";
import StickyMemo from "./stickyMemo";
import TodaySchedule from "./todaySchedule";
import RecentModify from "./recentModify";
import TodoList from "./todoList";
import { useSelector } from "react-redux";
import { RootState } from "../../_reducers";

export default function DashBoardPage(): JSX.Element {
  const userIdInfo = useSelector(
    (state: RootState) => state.userReducer.userData.userId
  );
  const modeInfo = useSelector((state: RootState) => state.modeReducer.mode);

  return (
    <div className={style.dashboard_wrapper}>
      <div className={style.dashboard}>
        <div className={style.line_one}>
          <TodaySchedule userIdInfo={userIdInfo} modeInfo={modeInfo} />
          <TodoList userIdInfo={userIdInfo} modeInfo={modeInfo} />
        </div>
        <div className={style.line_two}>
          <RecentModify userIdInfo={userIdInfo} modeInfo={modeInfo} />
          <StickyMemo userIdInfo={userIdInfo} modeInfo={modeInfo} />
          <Weather modeInfo={modeInfo} />
        </div>
      </div>
    </div>
  );
}
