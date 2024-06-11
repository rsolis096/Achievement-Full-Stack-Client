import { useState, useEffect } from 'react';

// Custom hook for debouncing
function useDebounce(value : string, delay :number) {

    // State to store the debounced value
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Set a timeout to update the debounced value after the specified delay
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup function to clear the timeout if the value or delay changes
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]); // Only re-run the effect if value or delay changes

    // Return the debounced value
    return debouncedValue;
}

export default useDebounce;