import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonCard() {
    return (
        <div className="flex flex-col space-y-3">
            <Skeleton className="h-[200px] w-full rounded-xl bg-zinc-100" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px] bg-zinc-100" />
                <Skeleton className="h-4 w-[200px] bg-zinc-100" />
            </div>
        </div>
    )
}
