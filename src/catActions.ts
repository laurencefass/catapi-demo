import {trace, traceCurrent} from './utils'

import {
  apiGetVoteById,
  apiSubmitVote,
  apiAddFavourite,
  apiDeleteFavourite,
  apiGetFavouriteById,
  apiGetMyCats,
  apiGetFavourites,
  apiGetVotes,
} from "./CatAPI";

import { 
  ECatActionTypes, 
  ICatAction, 
} from "./catReducer";

import {  
  TCat, 
  TVote, 
  TFavourite 
} from './types'



export function CollectionAction(collection: Array<TCat>) : ICatAction {
  return {
    type: ECatActionTypes.CATS,
    payload: collection
  };
}

export function FavouritesAction(favourites: Array<TFavourite>) : ICatAction {
  return {
    type: ECatActionTypes.FAVOURITES,
    payload: favourites
  };
}

export function SetFavouriteAction(favourite: TFavourite) : ICatAction {
  return {
    type: ECatActionTypes.SET_FAVOURITE,
    payload: favourite
  };
}

export function UnFavouriteAction(favourite_id: string) : ICatAction {
  return {
    type: ECatActionTypes.UN_FAVOURITE,
    payload: favourite_id
  };
}

export function DeleteCatAction(id: string) : ICatAction {
  return {
    type: ECatActionTypes.DELETE_CAT,
    payload: id
  };
}

export function VotesAction(votes: Array<TVote>) : ICatAction {
  return {
    type: ECatActionTypes.VOTES,
    payload: votes
  };
}

export function VoteUpAction(vote: TVote) : ICatAction {
  return {
    type: ECatActionTypes.VOTE_UP,
    payload: vote
  };
}

export function VoteDownAction(vote: TVote) : ICatAction {
  return {
    type: ECatActionTypes.VOTE_DOWN,
    payload: vote
  };
}

export const initCatsThunk = () => {
  traceCurrent("initCatsThunk");
  return dispatch => {
    traceCurrent("initCatsThunk.dispatch");
    try {
      (async () => {
        trace("CatUI.getMyCats")
        let cats = await apiGetMyCats();
        trace("CatUI.getMyCats success", cats);
        dispatch(CollectionAction(cats));
  
        let favourites = await apiGetFavourites();
        trace("CATUI.apiGetFavourites", favourites);
        dispatch(FavouritesAction(favourites));
  
        let votes = await apiGetVotes();
        trace("CATUI.apiGetFavourites", votes);
        dispatch(VotesAction(votes));  
      })();    
    }
    catch(e) {
      throw new Error("initcatsThunk" + e.Message);;
    }
  }
}

export const unFavouriteThunk = (id: string) => {
  return dispatch => {
    try {
      (async (id) => {
        let favourite = await apiDeleteFavourite(id);
        if (!favourite)
          throw new Error("setFavouriteReducer favourite object not returned from server"); 
        dispatch(UnFavouriteAction(id))
      })(id);  
    }
    catch(e) {
      alert("CATUI connection error" + e.message);
    }  
  }
}


export const addFavouriteThunk = (id:string) => {
  return dispatch => {
    try {
      (async (id) => {
        let favourite = await apiAddFavourite(id);
        if (!favourite)
          throw new Error("setFavouriteReducer favourite object not returned from server"); 
        favourite = await apiGetFavouriteById(favourite.id);
        if (!favourite)
          throw new Error("setFavouriteReducer favourite object not returned from server");
        dispatch(SetFavouriteAction(favourite));
      })(id);    
    }
    catch(e) {
      alert("CATUI connection error" + e.message);
    }
  }
}

// thunk actions
export const handleVoteThunk = (id:string, value:number) => {
  traceCurrent("handleVoteThunk");

  return dispatch => {
      traceCurrent("handleVoteThunk.dispatch");
      try {
      (async () => {
        let vote = await apiSubmitVote(id, value ? true : false);
        if (!vote)
          throw new Error("VoteControl favourite object not returned from server"); 

        vote = await apiGetVoteById(vote.id);
        if (!vote)
          throw new Error("VoteControl favourite object not returned from server");
        
        // dispatch(VotesAction([...votes.concat(vote)]));
        if (value) {
          dispatch(VoteUpAction(vote));
        } else {
          dispatch(VoteDownAction(vote));
        } 
      })();    
    }
    catch(e) {
      alert("CATUI connection error" + e.message);
    }
  }
}

