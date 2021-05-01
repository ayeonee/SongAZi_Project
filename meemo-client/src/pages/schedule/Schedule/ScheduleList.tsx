import React from "react";
import { AllData } from "../../../_types/scheduleTypes";
import ScheduleItem from "./ScheduleItem";
import style from "./ScheduleStyle.module.scss";

interface ScheduleListProps {
  allData: AllData;
  removeData: Function;
}

function ScheduleList({ allData, removeData }: ScheduleListProps): JSX.Element {
  return (
    <div className={style.schedule_list}>
      {allData.map((item) =>
        item.schedule.map((scheduleItem) => (
          <ScheduleItem
            data={item}
            {...scheduleItem}
            key={scheduleItem.index}
            removeData={removeData}
          />
        ))
      )}
    </div>
  );
}

export default React.memo(ScheduleList);
