import React, { useState, useEffect } from "react";
import style from "../styles/CalendarModal.module.scss";
import RMDEditor from "rich-markdown-editor";
import debounce from "lodash/debounce";

import {
  EventApi,
  DateSelectArg,
  EventClickArg,
  EventContentArg,
  formatDate,
  EventInput,
} from "@fullcalendar/react";

import { Checkbox, FormControlLabel } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";

type CalendarModalProps = {
  toggleModal: () => void;
  selectInfo: any;
};

// type selectInfoType = {
//   startStr: string;
//   endStr: string;
// };

export default function CalendarModal(props: CalendarModalProps): JSX.Element {
  const { toggleModal, selectInfo } = props;

  const [title, setTitle] = useState<string>("");
  const [allDay, setAllDay] = useState<boolean>(true);

  const [startDate, setStartDate] = useState<string>(selectInfo.startStr);
  const [endDate, setEndDate] = useState<string>(selectInfo.endStr);

  const [editorBody, setEditorBody] = useState<string>("");

  useEffect(() => {
    console.log(selectInfo);
  }, []);

  const submitApi = () => {
    const calApi = {
      title,
      allDay,
      editorBody,
    };
    console.log(calApi);
  };

  const handleEditorChange = debounce((value) => {
    // let source = axios.CancelToken.source();
    const noteInfo = {
      body: `${value()}`,
    };
    // try {
    //   axios
    //     .post(
    //       "https://meemo.kr/api/notes/update/" + history.location.state.id,
    //       noteInfo,
    //       {
    //         cancelToken: source.token,
    //       }
    //     )
    //     .then((res) => console.log(res.data));
    // } catch (err) {
    //   // Not sure that this is the right way to cancel the request. Might contain unknown problems.
    //   // check if can fix the original error which is err
    //   source.cancel();
    //   console.log(err, "\nOperation canceled by the user.");
    // }
  }, 1000);

  return (
    <div className={style.wrapper}>
      <div className={style.popupWrapper}>
        <div className={style.popup}>
          <div className={style.titleDiv}>
            <input
              type="text"
              name="title"
              className="titleInput"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e: any) => setTitle(e.target.value)}
              autoFocus
            />
          </div>
          <div className={style.timeSetDiv}>
            <div className={style.checkboxDiv}>
              {/* <p>종일</p>
              <input
                type="checkbox"
                name="allDay"
                checked={allDay}
                onChange={(e: any) => setAllDay(e.target.checked)}
              /> */}
              <FormControlLabel
                control={
                  <Checkbox
                    className={style.checkbox}
                    checked={allDay}
                    onChange={(e: any) => setAllDay(e.target.checked)}
                    name="allDay"
                  />
                }
                label="종일"
                labelPlacement="start"
              />
            </div>
            <div className={style.selectDiv}>
              <form className={style.container} noValidate>
                <TextField
                  className={style.fromDateSelector}
                  id="fromDate"
                  label=""
                  type="date"
                  defaultValue={startDate}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </form>
              <p>&#8212;</p>
              <form className={style.container} noValidate>
                <TextField
                  className={style.toDateSelector}
                  id="toDate"
                  label=""
                  type="date"
                  defaultValue={endDate}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </form>
            </div>
          </div>
          <div className={style.noteDiv}>
            <RMDEditor
              id="example"
              readOnly={false}
              readOnlyWriteCheckboxes
              value={editorBody}
              // defaultValue={"testing"}
              scrollTo={window.location.hash}
              handleDOMEvents={
                {
                  // focus: () => console.log("FOCUS"),
                  // blur: () => console.log("BLUR"),
                  // paste: () => console.log("PASTE"),
                  // touchstart: () => console.log("TOUCH START"),
                }
              }
              onSave={(options) => console.log("Save triggered", options)}
              onCancel={() => console.log("Cancel triggered")}
              onChange={handleEditorChange}
              onClickLink={(href, event) =>
                console.log("Clicked link: ", href, event)
              }
              onHoverLink={(event: any) => {
                console.log("Hovered link: ", event.target.href);
                return false;
              }}
              onClickHashtag={(tag, event) =>
                console.log("Clicked hashtag: ", tag, event)
              }
              onCreateLink={(title) => {
                // Delay to simulate time taken for remote API request to complete
                return new Promise((resolve, reject) => {
                  setTimeout(() => {
                    if (title !== "error") {
                      return resolve(
                        `/doc/${encodeURIComponent(title.toLowerCase())}`
                      );
                    } else {
                      reject("500 error");
                    }
                  }, 1500);
                });
              }}
              onShowToast={(message, type) =>
                window.alert(`${type}: ${message}`)
              }
              dark={false}
            />
          </div>
          <div className={style.btnDiv}>
            <button className="submitBtn" id={`noDeselect`} onClick={submitApi}>
              추가
            </button>
            <button name="cancelBtn" id={`noDeselect`} onClick={toggleModal}>
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
