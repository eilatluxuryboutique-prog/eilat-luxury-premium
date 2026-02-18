import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonCard() {
    return (
        <div className="flex flex-col space-y-3">
            <Skeleton className="h-[200px] w-full rounded-xl bg-white/10" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px] bg-white/10" />
                <Skeleton className="h-4 w-[200px] bg-white/10" />
            </div>
        </div>
    )
}
