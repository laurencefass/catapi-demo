import  {TVote, TFavourite, TCat} from './types'
import { trace } from './utils'

export interface ICatCollectionState {
  votes: Array<TVote>;
  favourites: Array<TFavourite>;
  cats: Array<TCat>;
}

export const initialCatState: ICatCollectionState = {
  votes: [] as Array<TVote>,
  favourites: [] as Array<TFavourite>,
  cats: [] as Array<TCat>
};

export enum ECatActionTypes {
  CATS = "CATS",
  FAVOURITES = "FAVOURITES",
  SET_FAVOURITE = "SET_FAVOURITE",
  UN_FAVOURITE = "UN_FAVOURITE",
  VOTES = "VOTES",
  VOTE_UP = "VOTE_UP",
  VOTE_DOWN = "VOTE_DOWN",
  DELETE_CAT = "DELETE_CAT",
}

export interface ICatAction {
  type: ECatActionTypes;
  payload: 
    string |
    TFavourite | 
    TVote | 
    Array<TCat> | 
    Array<TFavourite> | 
    Array<TVote>
}


export function catReducer(state: ICatCollectionState = initialCatState, action: ICatAction) : ICatCollectionState {
  switch (action.type) {
    // update entire collection of votes
    case ECatActionTypes.FAVOURITES:
      return {...state, favourites: [...action.payload as Array<TFavourite>]};

    case ECatActionTypes.UN_FAVOURITE:
      let id = action.payload as string;
      return {...state, favourites: [...state.favourites.filter(item => item ? item.id !== id : false)]};

    // add a single favourite
    case ECatActionTypes.SET_FAVOURITE:
      return {...state, favourites: [...state.favourites.concat(action.payload  as TFavourite)]}

    // update entire collection of favourites
    case ECatActionTypes.VOTES:
      return {...state, votes: [...action.payload as Array<TVote>]};

    // update entire collection of favourites
    case ECatActionTypes.VOTE_DOWN:
    case ECatActionTypes.VOTE_UP:
      return {...state, votes: state.votes.concat({...action.payload as TVote})};
        
    // update the entire collection of cats
    case ECatActionTypes.CATS:
      return {...state, cats: [...action.payload as Array<TCat>]};
   
    // delete a single cat
    case ECatActionTypes.DELETE_CAT:      
      let result = state.cats.filter(cat => cat.id !== action.payload)
      return { ...state, cats:[...result as Array<TCat>] };

    // return unchanged state for unknown action types
    default:
      trace("catReducer type not handled", action.type)
      return state;
  }
}
