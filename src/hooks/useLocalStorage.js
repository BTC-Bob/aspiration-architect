import { useState } from 'react';

// A custom hook that works exactly like useState, but saves to the browser
function useLocalStorage(key, initialValue) {
	// 1. Initialize State: Check Local Storage first, otherwise use default
	const [storedValue, setStoredValue] = useState(() => {
		try {
			const item = window.localStorage.getItem(key);
			// Parse stored json or if none return initialValue
			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			console.log("Error reading from local storage", error);
			return initialValue;
		}
	});

	// 2. Setter Function: Update State AND Local Storage
	const setValue = (value) => {
		try {
			// Allow value to be a function so we have same API as useState
			const valueToStore = value instanceof Function ? value(storedValue) : value;

			// Save state
			setStoredValue(valueToStore);

			// Save to local storage
			window.localStorage.setItem(key, JSON.stringify(valueToStore));
		} catch (error) {
			console.log("Error saving to local storage", error);
		}
	};

	return [storedValue, setValue];
}

export default useLocalStorage;
