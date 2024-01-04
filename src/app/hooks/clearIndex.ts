import { useState, useEffect } from 'react';

export const useClearIndex = (setEntries: React.Dispatch<React.SetStateAction<IUrlEntry[]>>, setCards: React.Dispatch<React.SetStateAction<ICard[]>>) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const [trigger, setTrigger] = useState(0);

    useEffect(() => {
        const clearIndex = async () => {
            setIsLoading(true);
            try {
                const response = await fetch("/api/clearIndex", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setEntries(data.entries);
                setCards(data.cards);
            } catch (error) {
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };
        clearIndex();
    }, [trigger]);

    return { isLoading, error, trigger, setTrigger };
};


