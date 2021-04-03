import { useState, useCallback } from "react";
import { DataProps } from "../../../types/scheduleTypes";
import InputBox from "./InputBox";
import style from "./InputButtonStyle.module.scss";

export default function InputButton({
  addData,
  allData,
}: DataProps): JSX.Element {
  const [modalState, setModalState] = useState<boolean>(false);

  const openModal = () => {
    setModalState(true);
  };

  const closeModal = useCallback(() => {
    setModalState(false);
  }, []);

  return (
    <>
      <div onClick={openModal} className={style.input_button}>
        + &nbsp; 일정 추가 &nbsp;
      </div>
      <InputBox
        modalState={modalState}
        closeModal={closeModal}
        addData={addData}
        allData={allData}
      />
    </>
  );
}
