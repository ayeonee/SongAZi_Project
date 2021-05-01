import React, { useCallback } from "react";
import { useTodoDispatch } from "../TodosContext";
import { Todo } from "../../../_types/todoTypes";
import style from "../styles/TodoList.module.scss";

interface TodoItemProps {
  todo: Todo;
}

function TodoItem({ todo }: TodoItemProps): JSX.Element {
  const dispatch = useTodoDispatch();

  const onRemoveItem = useCallback(() => {
    dispatch({
      type: "REMOVE",
      id: todo.id,
    });
  }, []);

  const onToggle = useCallback(() => {
    dispatch({ type: "TOGGLE", id: todo.id });
  }, []);

  return (
    <li className={style.list}>
      <p
        className={todo.checked ? style.todo_true : style.todo_false}
        onClick={onToggle}
      >
        {todo.schedule}
      </p>
      <p className={style.delete_todo} onClick={onRemoveItem}>
        ×
      </p>
    </li>
  );
}

export default React.memo(TodoItem);
