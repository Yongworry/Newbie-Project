import React from "react";
import axios from "axios";
import { SAPIBase } from "../tools/api";
import Header from "../components/header";
import "./css/ranking.css";

interface IAPIResponse  { _id: string, title: string, content: string, likeCnt: number }

const RankingPage = (props: {}) => {
  const [ LAPIResponse, setLAPIResponse ] = React.useState<IAPIResponse[]>([]);
  const [ NPageCount, setNPageCount ] = React.useState<number>(1);
  const [ SSearchTitle, setSSearchTitle ] = React.useState<string>("");
  const [ edited, setEdited ] = React.useState<boolean>(false);

  React.useEffect( () => {
    let BComponentExited = false;
    if (edited) setEdited(false);
    const asyncFun = async () => {
      const {data}  = await axios.get<IAPIResponse[]>( SAPIBase + '/feed/getSong', {params: { count: NPageCount, search: SSearchTitle }});
      console.log(data);
      if (BComponentExited) return;
      setLAPIResponse(data);
    };
    asyncFun().catch((e) => window.alert(`Error while running API Call: ${e}`));
    return () => { BComponentExited = true; }
  }, [ NPageCount, edited ]);


  const searchSong = () => {
    setEdited(true);
  }


  const deleteSong = (_id: string) => {
    const asyncFun = async () => {
      // One can set X-HTTP-Method header to DELETE to specify deletion as well
      await axios.post( SAPIBase + '/feed/deleteSong', { _id: _id } );
      setEdited(true);
    }
    asyncFun().catch(e => window.alert(`AN ERROR OCCURED! ${e}`));
  }

  const likeSong = (_id: string) => {
    const asyncFun = async () => {
      await axios.post( SAPIBase + '/feed/likeSong', { _id: _id } );
      setEdited(true);
    }
    asyncFun().catch(e => window.alert(`AN ERROR OCCURED! ${e}`));
  }

  return (
    <div className="Feed">
      <Header/>
      <h2>Ranking</h2>
      <div className={"search-input"}>
        search: <input type={"text"} value={SSearchTitle} onChange={(e) => setSSearchTitle(e.target.value)} required/>
        <div className={"search-button"} onClick={(e) => searchSong()}>🔍</div>
      </div>
      <div className={"feed-list"}>
        { LAPIResponse.map( (val, i) =>
          <div key={i} className={"feed-item"}>
            <div className={"delete-item"} onClick={(e) => deleteSong(`${val._id}`)}>ⓧ</div>
            <div className={"like-item"} onClick={(e) => likeSong(`${val._id}`)}>b</div>
            <p className={"song-ranking"}>#{ (10*(NPageCount-1)) + i+1 }</p>
            <p className={"feed-body"}>{ val.content } - { val.title }</p>
            <p className={"song-like"}>Likes: { val.likeCnt }</p>
          </div>
        )}
      </div>
      <div className={"ranking-page-input"}>
        Number of pages to show: &nbsp;&nbsp;
        <input type={"number"} value={ NPageCount } id={"page-count-input"} min={1}
               onChange={ (e) => setNPageCount( parseInt(e.target.value) ) }
        />
      </div>
    </div>
  );
}

export default RankingPage;