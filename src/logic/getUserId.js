import {v4 as uuidv4} from "uuid";

export function getUserId(storageName) {
  let id = localStorage.getItem(storageName);

  if (!id) {
    id = uuidv4();
    localStorage.setItem(storageName, id);
  }

  return id;
}
