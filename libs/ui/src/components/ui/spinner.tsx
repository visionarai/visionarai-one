export function Spinner() {
    return (

        <div className="flex flex-col items-center gap-4 p-6">
            <div className="flex w-full flex-col items-center justify-center gap-4">
                <div className="flex h-20 w-20 animate-spin items-center justify-center rounded-full border-4 border-transparent border-t-primary text-4xl text-primary">
                    <div className="flex h-16 w-16 animate-spin items-center justify-center rounded-full border-4 border-transparent border-t-secondary text-2xl text-secondary" />
                </div>
            </div>
        </div>

    );
}
