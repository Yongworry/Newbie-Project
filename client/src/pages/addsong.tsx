import React from "react";
import axios from "axios";
import { SAPIBase } from "../tools/api";
import Header from "../components/header";
import "./css/addsong.css";

interface IAPIResponse  { _id: string, id: number, title: string, content: string }

const AddSongPage = (props: {}) => {
  const [ SNewSongArtist, setSNewSongArtist ] = React.useState<string>("");
  const [ SNewSongTitle, setSNewSongTitle ] = React.useState<string>("");
  const [ edited, setEdited ] = React.useState<boolean>(false);

  React.useEffect( () => {
    let BComponentExited = false;
    if (edited) setEdited(false);
    const asyncFun = async () => {
      if (BComponentExited) return;
    };
    asyncFun().catch((e) => window.alert(`Error while running API Call: ${e}`));
    return () => { BComponentExited = true; }
  }, [ edited ]);

  const createNewSong = () => {
    const asyncFun = async () => {
      await axios.post( SAPIBase + '/feed/addSong', { title: SNewSongArtist, content: SNewSongTitle } );
      setSNewSongArtist("");
      setSNewSongTitle("");
    }
    asyncFun().catch(e => window.alert(`AN ERROR OCCURED! ${e}`));
  }



  return (
    <div className="Feed">
      <Header/>
      <h2>AddSong</h2>
      <div className={"feed-list"}>
        <div className={"feed-item-add"}>
          Artist: <input type={"text"} value={SNewSongArtist} onChange={(e) => setSNewSongArtist(e.target.value)} required/>
          &nbsp;&nbsp;&nbsp;&nbsp;
          Title: <input type={"text"} value={SNewSongTitle} onChange={(e) => setSNewSongTitle(e.target.value)} required/>
          <div className={"post-add-button"} onClick={(e) => createNewSong()}>Add Song</div>
        </div>
      </div>
    </div>
  );
}

export default AddSongPage;