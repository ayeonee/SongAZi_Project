import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import style from "../styles/NoteList.module.scss";
import axios from "axios";
import { ClickAwayListener } from "@material-ui/core";
import { Add, Delete, Notes } from "@material-ui/icons";

const removeMd = require("remove-markdown");

const onlyLet = (str: string) => {
  const rep = str.replace(/\\n|\\/g, "");
  const rem = removeMd(rep);
  return rem;
};

const setTime = (utcTime: any) => {
  const localTime = new Date(utcTime).toLocaleString();
  return localTime;
};

export default function NoteList() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState("");
  const [isSelected, setIsSelected] = useState("");
  const [update, setUpdate] = useState(false);
  let history = useHistory();
  let wrapperRef = useRef(new Array());

  useEffect(() => {
    let source = axios.CancelToken.source();

    const loadNotes = async () => {
      try {
        const res = await axios.get("http://localhost:5000/notes", {
          cancelToken: source.token,
        });
        console.log("Got the notes!");
        setNotes(res.data.map((note: any) => note));
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Caught a cancel.");
        } else {
          throw err;
        }
      }
    };
    loadNotes();

    return () => {
      console.log("Unmounting NoteList.");
      source.cancel();
    };
  }, [update]);

  const onSelect = (notes: any) => {
    selectedNote === notes._id
      ? history.push({
          pathname: "/editor",
          state: {
            id: notes._id,
            body: notes.body,
            updatedAt: notes.updatedAt,
          },
        })
      : setSelectedNote(notes._id);
    setIsSelected(notes._id);
    console.log(`note ${notes._id} selected!`);
  };

  const addNote = () => {
    const note = {
      title: "set set title",
      body: "this is the body",
    };

    axios
      .post("http://localhost:5000/notes/create", note)
      .then(() => setUpdate(!update))
      .then(() => console.log("New note added!"))
      .then(() => setSelectedNote(""));
  };

  const deleteNote = (id: any) => {
    axios
      .delete("http://localhost:5000/notes/" + id)
      .then(() => setUpdate(!update))
      .then(() => console.log("Note deleted."))
      .then(() => setSelectedNote(""))
      .catch(() => {
        console.log("no note selected");
      });
  };

  // listen to clicks outside of the div and release select
  const tabIndex: any = "-1";

  const handleClickAway = () => {
    // fixed not being able to delete with setTimeout; but what if delete call takes time??
    setTimeout(function () {
      setSelectedNote("");
    }, 100);
  };

  return (
    <div className={style.noteList}>
      <div className={style.noteContainer}>
        <div className={style.noteDiv}>
          {notes.map((note: any) => (
            <div
              className={
                // select lets go upon delete, fix that?
                selectedNote === note._id ? style.notesSelected : style.notes
              }
              key={note._id}
              id={note._id}
              onClick={() => onSelect(note)}
              tabIndex={tabIndex}
              onBlur={handleClickAway}
            >
              <div className={style.iconDiv}>
                <Notes className={style.noteIcon} />
              </div>
              <div className={style.titleDiv}>
                <p>{note.title}</p>
              </div>
              <div className={style.timeDiv}>
                <small>최근 수정: {setTime(note.updatedAt)}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={style.toolDiv}>
        <button className={style.addBtn} onClick={addNote}>
          <Add />
        </button>
        <button
          className={style.deleteBtn}
          onClick={() => deleteNote(selectedNote)}
        >
          <Delete />
        </button>
      </div>
    </div>
  );
}
