import { useEffect, useState } from "react";
import Loader from "./Loader";

export default function LoaderWithRetry({ timeout = 5000, handleRetry }) {
  const [showRetry, setShowRetry] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setShowRetry(true);
        handleRetry();
    }, timeout);

    return () => clearTimeout(t);
  }, [timeout]);

  if (showRetry) {
    return (
      <div className="flex flex-col items-center gap-2 text-center p-4">
        <p className="text-gray-500 text-sm">Taking longer than expected, Please Retry…</p>
      </div>
    );
  }

  return <Loader />; 
}
