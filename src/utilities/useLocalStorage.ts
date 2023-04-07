import { useState } from 'react';

export function useLocalStorage<ValueType>(key: string, initial: ValueType) {
  // If initial value exists in local storage, we use that for the initial state instead of the provided initial state.
  let existingValue = localStorage.getItem(key);

  if (typeof existingValue === 'string') {
    initial = JSON.parse(existingValue);
  }

  let [value, setValue] = useState(initial);

  // Sets state and stores new state in local storage.
  function setAndStoreValue(newState: ValueType) {
    setValue(newState);

    localStorage.setItem(key, JSON.stringify(newState));
  }

  // Replace setValue with setAndStoreValue so that when we call set we're also storing / loading necessary info from localStorage.
  return [value, setAndStoreValue] as const;
}