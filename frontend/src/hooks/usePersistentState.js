import { useEffect, useState } from "react";
import { getStored, setStored } from "../utils/storage";

export function usePersistentState(key, fallback) {
  const [value, setValue] = useState(() => getStored(key, fallback));

  useEffect(() => {
    setStored(key, value);
  }, [key, value]);

  return [value, setValue];
}
