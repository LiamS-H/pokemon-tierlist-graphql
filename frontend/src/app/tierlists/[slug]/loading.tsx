import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="max-w-6xl mx-auto p-4">
            <div className="mb-6 flex justify-between items-start">
                <div>
                    <Skeleton className="h-10 w-64 mb-2" />
                    <Skeleton className="h-6 w-32" />
                </div>
                <div>
                    <Skeleton className="h-10 w-48" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                    {[0, 1, 2].map((index) => (
                        <div
                            key={index}
                            className="rounded-lg bg-gray-200 animate-pulse"
                        >
                            <div className="flex items-center justify-between p-2">
                                <Skeleton className="h-6 w-32" />{" "}
                            </div>
                            <div className="flex min-h-24 px-2 pb-2 space-x-2">
                                {[0, 1, 2].map((i) => (
                                    <div
                                        key={i}
                                        className="rounded-md overflow-hidden"
                                    >
                                        <Skeleton className="h-24 w-24 rounded-md" />{" "}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pokemon Tray Skeleton */}
                <div className="border-2 border-dashed rounded-lg p-4 min-h-[140px] flex flex-wrap gap-2 overflow-y-auto">
                    {[0, 1, 2].map((index) => (
                        <div key={index} className="rounded-md overflow-hidden">
                            <Skeleton className="h-24 w-24 rounded-md" />{" "}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
