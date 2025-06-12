import {AtomEffect} from "recoil";
import {storage} from "../mmkv/storage";

export const persistAtom =
  <T>(key?: string): AtomEffect<T> =>
  ({node, onSet, setSelf, trigger}) => {
    const storedValue = node.key && storage.getString(key || node.key);

    if (storedValue != null && trigger === "get") {
      try {
        setSelf(JSON.parse(storedValue));
      } catch (e) {
        console.error(
          `Error parsing stored value for key "${key || node.key}":`,
          e,
        );
      }
    }

    onSet((newValue, _, isReset) => {
      const persistKey = key || node.key;

      if (isReset || newValue == null) {
        storage.delete(persistKey);
      } else {
        try {
          storage.set(persistKey, JSON.stringify(newValue));
        } catch (e) {
          console.error(`Error storing value for key "${persistKey}":`, e);
        }
      }
    });
  };
