// 1. You should be able to upload a new cat image
import { trace, traceCurrent } from './utils'
import { TFavourite, TCat, TVote } from './types'

let SUB_ID = "user_";
let X_API_KEY = "9b22e7ce-301e-4a1d-8ec5-1272826cd2ce" 
// let X_API_KEY = "just-plain-wrong" 

const nanoid = () => {
  return Math.random().toString(36).substring(7)
}

// general purpose api request with simple options
export const apiRequest = async (
  url:string, 
  method: string, 
  body: any = "", 
  type: string = "TEXT",
  key: string = X_API_KEY
) => {  
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("x-api-key", key);

  var requestOptions = {
    method: method,
    headers: myHeaders,
    body : body ? JSON.stringify(body) : undefined
  };

  trace("apiRequest values", { url, type, method, body, requestOptions});

  let response: any = undefined;
  try {
    response = await fetch(url, requestOptions)
    if (!response.ok) {
      const message = `apiRequest: error: ${response.status}`;
      trace("apiRequest error", response);
      throw new Error(message);
    }
  }
  catch(error) {
    throw new Error("apiRequest error: " + error.message);
  }

  const HTTP_NO_CONTENT = 204
  if (response.status === HTTP_NO_CONTENT) {
    return response;
  } else {
    let value = undefined;
    switch (type) {
      case 'JSON':
        value = await response.json();
        break;
      case 'TEXT':
        value = await response.json();
        break;
      default:
        throw new Error(`apiRequest values for type ${type } not handled`);
    }
    
    trace("apiRequest fetch success, value", value);
    return value;
  }
};

export const apiDeleteCommand = async (
  title: string, 
  url: string, 
  id: string
) => {
  // delete it from the server favourite list
  trace(title, " id", id);
  let type = "TEXT";
  let path_url = `${url}/${id}`;
  let method = "DELETE";
  return await apiRequest(path_url, method, undefined, type);
}

// upload a cat image from a file blob
export const apiUploadCat = async (
  fileURL: Blob
) => {
  if (fileURL) {
    var myHeaders = new Headers();
    // myHeaders.append("Content-Type", "multipart/form-data");
    myHeaders.append("x-api-key", X_API_KEY);
  
    var formdata = new FormData();
    formdata.append("file", fileURL, "file");
    trace("upLoadCat formdata", formdata);
  
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
    };
  
    let response = await fetch("https://api.thecatapi.com/v1/images/upload", requestOptions)
    if (!response.ok) {
      const message = `upLoadCatImage.error: ${response.status}`;
      throw new Error(message);
    }
    let json = await response.json();
    traceCurrent("upLoadCatImage.fetch success", json);
    return json;
  }
};

export const apiGetMyCats = async() => {
  let url = `https://api.thecatapi.com/v1/images/?limit=100&page=0`;
  let method = "GET";
  let type="JSON";
  traceCurrent("getMyCats", url, method, undefined, type);
  return await apiRequest(url, method, undefined, type);
}

// 4. You should be able to vote a cat up or down
export const apiSubmitVote = async (
  id: string, 
  value: boolean
) => {
  // add it to server favourite list
  trace("apiSubmitVote id", id);
  let url = `https://api.thecatapi.com/v1/votes`;
  let method = "POST";
  let body = {
    "image_id": `${id}`,
    "sub_id": `${SUB_ID + nanoid()}`,
    "value": value ? 1 : 0,
  }  
  return await apiRequest(url, method, body);
} 

export const apiAddFavourite = async (id: string) => {
  // add it to server favourite list
  let url = `https://api.thecatapi.com/v1/favourites`;
  let method = "POST";
  let body = {
    "image_id": `${id}`,
    "sub_id": `${SUB_ID + nanoid()}`
  }  
  return await apiRequest(url, method, body);
} 

export const apiDeleteCat = async (id: string) => {
  let url = `https://api.thecatapi.com/v1/images`;
  return await apiDeleteCommand("apiDeleteCat", url, id);
}

export const apiDeleteVote = async (id: string) => {
  let url = `https://api.thecatapi.com/v1/votes`;
  return await apiDeleteCommand("apiDeleteVote", url, id)
}

export const apiDeleteFavourite = async (id: string) => {
  let url = `https://api.thecatapi.com/v1/favourites`;
  return await apiDeleteCommand("apiDeleteVote", url, id)
}

export const apiGetVotes = async () => {
  let url = `https://api.thecatapi.com/v1/votes`;
  let method = "GET";
  let type="JSON";
  trace("apiGetVotes", url, method, undefined, type);
  return await apiRequest(url, method, undefined, type);
}

const getFavourites = async () => {
  let url = `https://api.thecatapi.com/v1/favourites`;
  let method = "GET";
  let type="JSON";
  trace("apiGetFavouriteCats", url, method, undefined, type);
  return await apiRequest(url, method, undefined, type);
}

export const apiDeleteAllFavourites = async () => {
  let favourites = await getFavourites();
  console.log("apiGetFavouriteCats", favourites);
  favourites.map((item: TFavourite) => {
    return (async () => {
      if (item)
        await apiDeleteFavourite(item.id)
    })();
  })
}

export const apiDeleteAllCats = async () => {
  let cats = await apiGetMyCats();
  console.log("apiDeleteAllCats", cats);
  cats.map((item: TCat) => {
    return (async () => {
      await apiDeleteCat(item.id)
    })();
  })
}

export const apiDeleteAllVotes = async () => {
  let votes = await apiGetVotes();
  console.log("apiDeleteAllVotes", votes);
  votes.map((item: TVote) => {
    return (async () => {
      await apiDeleteVote(item.id)
    })();
  })
}

export const apiGetFavourites = async() => {
  return await getFavourites();
}

export const apiGetVoteById = async (id: string) => {
  let url = `https://api.thecatapi.com/v1/votes/${id}`;
  let method = "GET";
  let type="JSON";
  trace("apiGetVoteById", url, method, undefined, type);
  return await apiRequest(url, method, undefined, type);
}

export const apiGetFavouriteById = async (id: string) => {
  let url = `https://api.thecatapi.com/v1/favourites/${id}`;
  let method = "GET";
  let type="JSON";
  trace("apiGetFavouriteCatById", url, method, undefined, type);
  return await apiRequest(url, method, undefined, type);
}