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
