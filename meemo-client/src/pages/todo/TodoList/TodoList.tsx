import React from "react";
import TodoItem from "./TodoItem";
import { useTodoState } from "../TodosContext";
import style from "./TodoList.module.scss";

const TodoList: React.FC = () => {
  const todos = useTodoState();
  return (
    <ul className={style.list_wrapper}>
      {todos.map((elem) => (
        <TodoItem todo={elem} key={elem.id} />
      ))}
    </ul>
  );
};

export default React.memo(TodoList);
