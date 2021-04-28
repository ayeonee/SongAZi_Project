import { useState, useEffect } from "react";
import { useRouteMatch, useHistory, useParams } from "react-router-dom";
import style from "../styles/NoteList.module.scss";
import axios from "axios";
import { Add, Delete, Notes, Create } from "@material-ui/icons";

import AddRenameModal from "../modals/AddRenameModal";
import RouteShow from "../misc/RouteShow";
import LoaderSpinner from "../misc/LoaderSpinner";
import DeleteModal from "../modals/DeleteModal";

const removeMd = require("remove-markdown");

// removing remaining md strings; maybe not needed
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
  const [notes, setNotes]: any = useState([]);
  const [selectedNote, setSelectedNote] = useState("");
  const [delBtn, setDelBtn] = useState(false);
  const [update, setUpdate] = useState(false);

  const [noteTitle, setNoteTitle] = useState("");
  const [parentId, setParentId] = useState("");

  const [popupType, setPopupType] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showDelModal, setShowDelModal] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  let { url } = useRouteMatch();
  let { folderTitle }: any = useParams();

  // passing note information into Editor component
  let history = useHistory<any>();
  let source = axios.CancelToken.source();

  // if element doesnt have noDeselect as id, deselect upon click
  useEffect(() => {
    document.onclick = (event: any) => {
      setTimeout(() => {
        if (event.target.id !== "noDeselect") {
          setDelBtn(false);
          setSelectedNote("");
        }
      }, 100);
    };
    return () => {
      clearTimeout();
      setSelectedNote("");
      setNoteTitle("");
      setNotes([]);
    };
  }, []);

  const getParentId = async () => {
    try {
      const res = await axios.get("https://meemo.kr/api/folders", {
        cancelToken: source.token,
      });
      res.data.forEach((folder: any) => {
        if (folder.title === folderTitle) {
          setParentId(folder._id);
        }
      });
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log("Caught a cancel.");
      } else {
        throw err;
      }
    }
  };

  useEffect(() => {
    let temp: any[] = [];

    const loadNotes = async () => {
      try {
        const res = await axios.get("https://meemo.kr/api/notes", {
          cancelToken: source.token,
        });
        res.data.forEach((note: any) => {
          if (note.parentId === parentId) {
            temp.push(note);
          }
        });
        setNotes(temp.map((note: any) => note));
        setIsLoading(false);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Caught a cancel.");
        } else {
          throw err;
        }
      }
    };
    getParentId()
      .then(loadNotes)
      .then(() => setUpdate(true))
      .then(() => console.log("Got the notes!"));

    return () => {
      console.log("Unmounting NoteList.");
      source.cancel();
      clearTimeout();
    };
  }, [update]);

  const getTitle = async (id: string) => {
    try {
      const res = await axios.get("https://meemo.kr/api/notes/" + id);
      setNoteTitle(res.data.title);
    } catch (err) {
      throw err;
    }
  };

  const addNote = async (t: string) => {
    try {
      let title = await t;
      const note = {
        title: `${title}`,
        body: "this is the body",
        parentId: `${parentId}`,
      };
      axios
        .post("https://meemo.kr/api/notes/create", note)
        .then(() => setUpdate(!update))
        .then(() => console.log("New note added!"))
        .then(() => setShowPopup(!showPopup))
        .then(() => setSelectedNote(""));
    } catch (err) {
      throw err;
    }
  };

  const deleteNote = (id: any) => {
    axios
      .delete("https://meemo.kr/api/notes/" + id)
      .then(() => console.log("Note deleted."))
      .then(() => setShowDelModal(!showDelModal))
      .then(() => setDelBtn(false))
      .then(() => setUpdate(!update))
      .catch(() => {
        console.log("no note selected");
      });
  };

  //title update uses put; editor body uses post + update.
  //to fix, add another prop in popup to get the body from the editor and feed in put.
  const updateNote = async (id: string, t: string) => {
    try {
      const title = await {
        title: `${t}`,
      };

      axios
        .put("https://meemo.kr/api/notes/" + id, title)
        .then(() => console.log("Note Renamed"))
        .then(() => setUpdate(!update))
        .then(() => setShowPopup(false))
        .then(() => setSelectedNote(""))
        .catch((err) => console.log(`error: ${err}`));
    } catch (err) {
      throw err;
    }
  };

  const onSelect = (note: any) => {
    selectedNote === note._id
      ? history.push({
          pathname: `${url}/${note._id}`,
          state: {
            folderId: note.parentId,
            folderTitle: folderTitle,
            id: note._id,
            title: note.title,
            body: note.body,
            updatedAt: note.updatedAt,
          },
        })
      : setSelectedNote(note._id);
    setSelectedNote(note._id);
    getTitle(note._id);
    setDelBtn(true);
    console.log(`note ${note._id} selected!`);
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const toggleDelModal = () => {
    setShowDelModal(!showDelModal);
  };

  return (
    <div className={style.noteList}>
      <RouteShow
        folderId={""}
        type="notelist"
        folderTitle={folderTitle}
        noteTitle=""
      />
      {isLoading ? (
        <LoaderSpinner />
      ) : (
        <>
          <div className={style.noteContainer}>
            <div className={style.noteDiv}>
              {notes.map((note: any) => (
                <div
                  key={note._id}
                  id={`noDeselect`}
                  className={
                    selectedNote === note._id
                      ? style.notesSelected
                      : style.notes
                  }
                  onClick={() => {
                    onSelect(note);
                  }}
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
            <button
              className={delBtn ? style.renameBtn : style.hideRenameBtn}
              id={`noDeselect`}
              onClick={() => {
                setPopupType("rename");
                setShowPopup(!showPopup);
              }}
            >
              <Create className={style.renameIcon} />
            </button>
            <button
              className={style.addBtn}
              id={`noDeselect`}
              onClick={() => {
                setPopupType("notelist");
                setShowPopup(!showPopup);
              }}
            >
              <Add className={style.addIcon} />
            </button>
            <button
              className={delBtn ? style.deleteBtn : style.hideDelBtn}
              id={`noDeselect`}
              onClick={() => {
                setShowDelModal(!showDelModal);
              }}
            >
              <Delete className={style.deleteIcon} />
            </button>
          </div>
        </>
      )}
      {showPopup ? (
        <AddRenameModal
          prevTitle={noteTitle}
          selectedId={selectedNote}
          component={popupType}
          togglePopup={togglePopup}
          getTitle={addNote}
          getRename={updateNote}
        />
      ) : null}
      {showDelModal ? (
        <DeleteModal
          type="notelist"
          childTitles={[]}
          selectedTitle={noteTitle}
          selectedId={selectedNote}
          delete={deleteNote}
          toggleDelModal={toggleDelModal}
        />
      ) : null}
    </div>
  );
}
