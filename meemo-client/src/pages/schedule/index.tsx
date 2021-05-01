import { useCallback, useState, useEffect } from "react";
import { AllData, Data } from "../../_types/scheduleTypes";
import axios from "axios";
import InputButton from "./Input/InputButton";
import ScheduleList from "./Schedule/ScheduleList";
import TimeTable from "./TimeTable";
import style from "./styles/Schedule.module.scss";
import { BASE_URL } from "../../_data/urlData";

export default function SchedulePage(): JSX.Element {
  const [allData, setAllData] = useState<AllData>([]);
  const [addDataCheck, setAddDataCheck] = useState<boolean>(false);
  const [deleteDataCheck, setDeleteDataCheck] = useState<boolean>(false);

  const saveSchedule = (payloadData: AllData) => {
    axios({
      method: "POST",
      baseURL: BASE_URL,
      url: "/save/schedule",
      data: {
        userId: localStorage.getItem("meemo-user-id"),
        payload: payloadData,
      },
    })
      .then((res) => res.data)
      .catch((err) => console.log(err));
  };

  const getSchedule = async (userId: string | null) => {
    await axios({
      method: "POST",
      baseURL: BASE_URL,
      url: "/get/schedule",
      data: {
        userId: userId,
      },
    })
      .then((res) => {
        setAllData(res.data.payload);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getSchedule(localStorage.getItem("meemo-user-id"));
  }, []);

  useEffect(() => {
    if (addDataCheck) {
      saveSchedule(allData);
    }

    return setAddDataCheck(false);
  }, [allData, addDataCheck]);

  useEffect(() => {
    if (deleteDataCheck) {
      saveSchedule(allData);
    }

    return setDeleteDataCheck(false);
  }, [allData, deleteDataCheck]);

  const addData = (elem: Data) => {
    setAllData((allData) =>
      allData.concat({
        ...elem,
        id: elem.name,
      })
    );

    setAddDataCheck(true);
  };

  const removeData = useCallback(
    (index: number, id: string) => {
      if (allData.length === 1 && allData[0].schedule.length === 1) {
        setAllData([]);
        saveSchedule([]);
      } else {
        setAllData(
          allData
            .map((elem) =>
              elem.id === id
                ? {
                    ...elem,
                    schedule: elem.schedule.filter(
                      (scheduleItem) => scheduleItem.index !== index
                    ),
                  }
                : elem
            )
            .filter((elem) => elem.schedule.length > 0)
        );

        setDeleteDataCheck(true);
      }
    },
    [allData]
  );

  return (
    <div className={style.schedule}>
      <div className={style.time_line_wrapper}>
        <InputButton addData={addData} allData={allData} />
        <div className={style.schedule_list_wrapper}>
          {allData.length >= 1 ? (
            <ScheduleList allData={allData} removeData={removeData} />
          ) : null}
          <TimeTable />
        </div>
      </div>
    </div>
  );
}
