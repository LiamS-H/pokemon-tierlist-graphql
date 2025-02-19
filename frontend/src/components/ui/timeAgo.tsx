"use client";
import { useState, useEffect, useRef, useCallback, ReactNode } from "react";

export function TimeAgo({ timestamp }: { timestamp: string }): ReactNode {
    const [secondInterval, setSecondInterval] = useState(1);

    const calculateTimeAgo = useCallback(
        (timestamp: string | null | undefined): string => {
            if (!timestamp) return "Never";

            const now = Date.now();
            const then = new Date(timestamp).getTime();
            const diffSeconds = Math.floor((now - then) / 1000);

            if (diffSeconds < 0) return "just now";

            const secondsInMinute = 60;
            const secondsInHour = 3600;
            const secondsInDay = 86400;
            const secondsInWeek = 604800;
            const secondsInMonth = 2629800;
            const secondsInYear = 31557600;

            if (diffSeconds >= secondsInYear) {
                setSecondInterval(
                    secondsInYear - (diffSeconds % secondsInYear)
                );
                const years = Math.floor(diffSeconds / secondsInYear);
                return `${years} year${years === 1 ? "" : "s"} ago`;
            }
            if (diffSeconds >= secondsInMonth) {
                setSecondInterval(
                    secondsInMonth - (diffSeconds % secondsInMonth)
                );
                const months = Math.floor(diffSeconds / secondsInMonth);
                return `${months} month${months === 1 ? "" : "s"} ago`;
            }
            if (diffSeconds >= secondsInWeek) {
                setSecondInterval(
                    secondsInWeek - (diffSeconds % secondsInWeek)
                );
                const weeks = Math.floor(diffSeconds / secondsInWeek);
                return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
            }
            if (diffSeconds >= secondsInDay) {
                setSecondInterval(secondsInDay - (diffSeconds % secondsInDay));
                const days = Math.floor(diffSeconds / secondsInDay);
                return `${days} day${days === 1 ? "" : "s"} ago`;
            }
            if (diffSeconds >= secondsInHour) {
                setSecondInterval(
                    secondsInHour - (diffSeconds % secondsInHour)
                );
                const hours = Math.floor(diffSeconds / secondsInHour);
                return `${hours} hour${hours === 1 ? "" : "s"} ago`;
            }
            if (diffSeconds >= secondsInMinute) {
                setSecondInterval(
                    secondsInMinute - (diffSeconds % secondsInMinute)
                );
                const minutes = Math.floor(diffSeconds / secondsInMinute);
                return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
            }
            if (diffSeconds === 0) {
                return "just now";
            }
            setSecondInterval(1);
            return `${diffSeconds} second${diffSeconds === 1 ? "" : "s"} ago`;
        },
        []
    );
    const intervalRef = useRef<NodeJS.Timeout>(undefined);
    const [timeAgo, setTimeAgo] = useState<string | null>(null);

    useEffect(() => {
        setTimeAgo(calculateTimeAgo(timestamp));
    }, [calculateTimeAgo, timestamp]);

    useEffect(() => {
        const interval = intervalRef.current;
        clearInterval(interval);

        intervalRef.current = setInterval(() => {
            setTimeAgo(calculateTimeAgo(timestamp));
        }, secondInterval * 1000);
        // update();

        return () => clearTimeout(interval);
    }, [timestamp, secondInterval, calculateTimeAgo]);

    return timeAgo;
}
