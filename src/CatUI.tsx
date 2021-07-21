import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { ICatCollectionState } from "./catReducer";
import { trace } from './utils'
import  {TVote, TFavourite, TCat} from './types';
import { BrowserRouter as Router, useHistory, Switch, Route, Link } from "react-router-dom";


import { 
  apiUploadCat, 
  apiDeleteCat, 
  apiDeleteAllFavourites,
  apiDeleteAllVotes,
  apiDeleteAllCats,
} from "./CatAPI";

import { 
  VotesAction,
  FavouritesAction,
  CollectionAction, 
  DeleteCatAction,
  handleVoteThunk,
  addFavouriteThunk,
  unFavouriteThunk,
  initCatsThunk,
} from "./catActions";

const DEBUG = true;

export interface ICatProps {
  id: string;
}

const VoteControl = (props: ICatProps) => {
  const [upVotes, setUpVotes] = useState(0);
  const [downVotes, setDownVotes] = useState(0);
  const [score, setScore] = useState(0);
  const votes = useSelector((state: ICatCollectionState) => state.votes);
  const dispatch = useDispatch();

  const handleVote = (value: number) => {
    dispatch(handleVoteThunk(props.id, value));
  }

  useEffect(()=>{
    trace("VoteControl.votes", votes);
    let up, down = 0;
    if (!votes.length) {
      up = down = 0;
    } else {
      up = votes.filter(vote => vote.image_id === props.id && vote.value === 1).length;
      down = votes.filter(vote => vote.image_id === props.id && vote.value === 0).length;
    }
    setScore(up-down);
    setUpVotes(up);
    setDownVotes(down);
  }, [votes, props.id]);

  return (<>
    <div className="votescore">{score}</div>
    <div className="vote-control">
      <span className="widget-container">
        <div onClick={() => handleVote(1)} className="widget">👍🏽</div>
        <div className="score">{upVotes}</div>
      </span>
      <span className="widget-container">
        <div onClick={() => handleVote(0)} className="widget">👎🏼</div>
        <div className="score">{downVotes}</div>
      </span>
    </div>
  </>);
};

const FavouriteControl = (props: ICatProps ) => {
  // const cats = useSelector((state: ICatCollectionState) => state.cats);
  const favourites = useSelector((state: ICatCollectionState) => state.favourites);
  const dispatch = useDispatch();
  const [favourite, setFavourite] = useState<undefined | TFavourite>();

  useEffect(()=>{
    trace("FavouriteControl.useEffect[favourite]", favourite);
  }, [favourite]);

  useEffect(()=>{
    trace("FavouriteControl.useEffect[favourites]", favourites);
    if (favourites.length) {
      let found: TFavourite = favourites.find((item: TFavourite) => item ? item.image_id === props.id : false);
      trace("FavouriteControl props.id, found", props.id, found);
      setFavourite(found);
    }
  }, [favourites, props.id]);

  const unFavourite = (id: string) => {
    dispatch(unFavouriteThunk(id))
    setFavourite(undefined);
  } 

  const addFavourite = (id: string) => {
    dispatch(addFavouriteThunk(id));
  }
  
  const handleClick = () => {
    trace("handleClick favourite", favourite);
    // add a favourite with an image id and delete with favourite id
    if (favourite)
      unFavourite(favourite.id);
    else
      addFavourite(props.id);
  };

  return (
    <span onClick={handleClick} className="widget">
    {favourite ? <div>❤️</div> : <div style={{opacity:0.5}}>🤍</div>}
    {/* {favourite && createPortal(
      <div>❤️</div>, document.getElementById(`favourite-portal-${props.id}`)
    )} */}
    </span>
  );
};

const Loader = (props: any) => {
  return (
    <div className="loader-wrapper">
      <div className="loader"/>
      {props.children}
    </div>
  )
}


const CatSelector = ({setMessage}) => {
  let [blobURL, setBlobURL] = useState<string | undefined>();
  const cats = useSelector((state: ICatCollectionState) => state.cats);
  const dispatch = useDispatch();
  let history = useHistory();

  const onSelectFile = async (event: any) => {
    setMessage("");
    const fileBlob = event.target.files[0];
    let blobURL = URL.createObjectURL(fileBlob);
    setBlobURL(blobURL);
    trace("CATUI.OnSelectFile", blobURL);
    try {
      setMessage("");
      const cat = await apiUploadCat(fileBlob);
      trace("CatSelector", cat);
      dispatch(CollectionAction([...cats, cat]))
      setBlobURL(undefined);
      setMessage("Upload success!");
      history.push("/");
    } catch (e) {
      setMessage("Upload failed. Cats only please.");
      setBlobURL(undefined);
      history.push("/");
    }
  };

  return (<>
    <div className="cat-selector">
      {!blobURL && <>
        <input disabled={blobURL ? true : false} type="file" onChange={onSelectFile} />     
      </>}
      {blobURL && <>
      <h2>Cat upload in progress...</h2>
      <Loader>
        <img alt="cat" className="thumbnail" src={`${blobURL}`}/>
      </Loader>
      </>}
      <Link className="link-button" to="/">Cancel</Link>
    </div>
  </>)
}

const DeleteControl = (props: ICatProps) => {
  const dispatch = useDispatch();

  const onDelete = () => {
    (async () => {
      trace("deleting cat...", props.id);
      let result = await apiDeleteCat(props.id);
      trace("cat deleted", result);
      dispatch(DeleteCatAction(props.id));
    })();
  };

  return (
    <span onClick={onDelete} className="widget delete">
      ❌
    </span>
  );
};


export const CatUI = () => {
  // let [catImages, setCatImages] = useState(undefined);
  const cats = useSelector((state: ICatCollectionState) => state.cats);
  const dispatch = useDispatch();
  let [message, setMessage] = useState("");
  let [connected, setConnected] = useState(false);

  useEffect(() => {
    trace("CatUI cats", cats);
  }, [cats]);

  useEffect(() => {
    try {
      setMessage("Fetching data. Please wait a moment.")
      dispatch(initCatsThunk());
      setMessage("Status: Connected");
      setConnected(true);
    } catch (error) {
      setMessage("Something went wrong. Check connection and api password");
    }
  }, []);

  const onReset = async () => {
    try {
      await apiDeleteAllCats();
      trace("CatUI.onReset apiDeleteAllCats success");
      dispatch(CollectionAction([]));

      await apiDeleteAllFavourites();
      trace("CatUI.onReset apiDeleteFavourites success");
      dispatch(FavouritesAction([]));

      await apiDeleteAllVotes();
      trace("CatUI.onReset apiDeleteVotes success");
      dispatch(VotesAction([]));
    } catch (error) {
      setMessage("Something went wrong. Check connection and/or api password");
    }
  }

  return (
    <Router>
      <div onClick={onReset} className="reset"/>
      <div className="header">
        <h1>It's Caturday Night Thunking</h1>
        <h2>CatAPI + React + Redux + Thunk</h2>
        <p>❤️ and 👍🏽 your Favourite <span onClick={onReset}>😻</span> pics</p>
      </div>
      {message && <p>{message}</p>}
      {!connected && <div className="loader"/>}
      {connected && <>
        <Switch>
          <Route path="/upload">
            <CatSelector setMessage={setMessage}/>
          </Route>
          <Route path = "/">
            <Link className="link-button" to="/upload">Upload a cat</Link>
            <ImageGallery/>
            {/* <CollectionTable/> */}
          </Route>
        </Switch>
      </>}
    </Router>
  );
};

const CollectionTable = () => {
  const cats = useSelector((state: ICatCollectionState) => state.cats);
  const favourites = useSelector((state: ICatCollectionState) => state.favourites);
  const votes = useSelector((state: ICatCollectionState) => state.votes);

  return (<>
    {DEBUG && <div className="debug">
      <CollectionData 
        label= "cats"
        collection={cats}
        idLabel="id"
      />
      <CollectionData 
        label= "favourites"
        collection={favourites}
        idLabel="image_id"
      />
      <CollectionData 
        label= "votes"
        collection={votes}
        idLabel="image_id"
      />
    </div>}
  </>)
}

type TCollectionDataProps = {
  label: string;
  collection: Array<any>
  idLabel: string; 
}

const CollectionData = ({collection, label, idLabel}: TCollectionDataProps) => {
  return (
      <div className="collection-data">
        <h2>{label} ({collection.length}) </h2>
        {collection.length === 0 && <p>no {label}</p>}
        {collection.length > 0 && collection.map((item, idx) => 
          <p key={`fav-${idx}`}>{idLabel === "image_id" ? item.image_id : item.id}</p>
        )}
      </div>
  );
}

const ImageGallery = (props) => {
  const cats = useSelector((state: ICatCollectionState) => state.cats);

  return (<>
    <div className="image-gallery">
      {cats.length > 0 && cats.map(({ url, id }, index) => (
        <div key={`cat-${id}`} className="card">
          <div id={`favourite-portal-${id}`}/>
          <img src={url} key={index} alt="cat"/>
          <div className="control-container">
             {/* <DeleteControl id={id} /> */}
            <FavouriteControl id={id} />
            <VoteControl id={id} />
          </div>
        </div>
      ))}
    </div>
    {cats.length === 0 && <>
      <h3>😿 Gallery is empty</h3> 
      <img 
        style={{
          filter: "brightness(0.2)",
          width: "60%",
          margin: "auto"
        }}
      src="/cat-in-tree.jpg"/>
    </>}
  </>);
}
