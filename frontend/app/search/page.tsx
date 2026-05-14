import { Suspense } from "react";
import SearchContent from "./SearchContent";

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="h-14 w-14 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>

            <p className="mt-4 text-gray-500">
              Loading search page...
            </p>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}