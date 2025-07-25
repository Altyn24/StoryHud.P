import { instanse } from "../page/instans/instans";

export const getImage = (filename) => {
  return instanse.getUri() + "/image/" + filename;
};
