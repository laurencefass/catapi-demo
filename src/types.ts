export type TVote = {
  id: string,
  image_id: string,
  sub_id: null,
  created_at: string, 
  value: number,
  country_code: string
}

export type TFavourite = {
  id: string,
  user_id: string,
  image_id: string,
  sub_id: null,
  created_at: string,
  image: any
}

export type TCat = {
  breeds: Array<string>;
  id: string;
  url: string;
  width: number;
  height: number;
  sub_id: String;
  created_at: string;
  original_filename: string;
  breed_ids: Array<string>;
};
