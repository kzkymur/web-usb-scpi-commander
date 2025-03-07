import { useState, useEffect } from 'react';

type SetValue<T> = (value: T | ((val: T) => T)) => void;

export const useLocalStorage = <T,>(
  key: string,
  initialValue: T
): [T, SetValue<T>] => {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem('appSettings');
      const settings = item ? JSON.parse(item) : {};
      const value = settings[key] ?? initialValue;
      console.log(key, initialValue)
      setStoredValue(value);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
  }, [key, initialValue]);

  const setValue: SetValue<T> = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      const settings = JSON.parse(
        window.localStorage.getItem('appSettings') || '{}'
      );
      settings[key] = valueToStore;
      window.localStorage.setItem('appSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  };

  return [storedValue, setValue];
};