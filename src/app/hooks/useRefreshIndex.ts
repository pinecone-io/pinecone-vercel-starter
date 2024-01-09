import { useState } from 'react';

const useRefreshIndex = () => {
    const [totalRecords, setTotalRecords] = useState<number>(0);

    const refreshIndex = async () => {
        const response = await fetch("/api/checkIndex", {
            method: "POST",
        });
        try {
            const stats = await response.json();
            setTotalRecords(stats.totalRecordCount);
        } catch (e) {
            console.log(e)
        }
    }

    return { totalRecords, refreshIndex };
}

export default useRefreshIndex;