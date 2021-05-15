import style from "../../styles/TodoList.module.scss";
import style_mode from "../../styles/modeColor.module.scss";
import { Todo } from "../../../../_types/todoTypes";
import { Pie } from "react-chartjs-2"; //chart 위한 라이브러리

interface AchievementRateProps {
  todoList: Todo[];
  modeInfo: string;
  checkedTodo: {
    checked: boolean;
  }[];
}

function AchievementRate({
  todoList,
  checkedTodo,
  modeInfo,
}: AchievementRateProps): JSX.Element {
  //그래프에 넣을 데이터
  const todoBasedPieData = {
    datasets: [
      {
        data:
          checkedTodo !== null && todoList !== null
            ? [checkedTodo.length, todoList.length - checkedTodo.length]
            : [0, 0],
        backgroundColor: ["#6cbea7", "rgba(100, 100, 100, 0.267)"],
        borderColor:
          modeInfo === "dark"
            ? ["rgb(24, 26, 27)", "rgb(24, 26, 27)"]
            : ["white", "white"],
      },
    ],
  };

  return (
    <div
      className={[
        style.graph_box,
        modeInfo === "light"
          ? style_mode.graph_box_light
          : style_mode.graph_box_dark,
      ].join(" ")}
    >
      <div className={style.graph_container}>
        <div className={style.block_circle}></div>
        <div
          className={[
            style.rate_circle,
            modeInfo === "light"
              ? style_mode.rate_circle_light
              : style_mode.rate_circle_dark,
          ].join(" ")}
        >
          <h1>
            {todoList !== null && todoList.length !== 0
              ? `${Math.round((checkedTodo.length / todoList.length) * 100)}%`
              : `0%`}
          </h1>
        </div>
        {todoList.length === 0 || todoList === null ? (
          <div className={style.none_circle}></div>
        ) : (
          <Pie type="pie" data={todoBasedPieData} className={style.pie} />
        )}
      </div>
    </div>
  );
}

export default AchievementRate;
