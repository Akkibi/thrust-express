import { useEffect, useState, type ReactNode } from "react";
import { eventEmitter } from "../utils/eventEmitter";

const LoadingScreen = (): ReactNode => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    eventEmitter.on("loading", (isLoading: boolean) => {
      setIsLoading(isLoading);
    });
  }, []);

  if (!isLoading) return <></>;

  return (
    <div className="absolute inset-0 z-50 bg-slate-950">
      <div className="absolute inset-0 z-50 flex items-center justify-center">
        <div className="w-full max-w-xs">
          <div className="relative min-w-0 p-2 bg-slate-700 w-full mb-6 shadow-lg rounded-2xl custom-light-border">
            <div className="min-w-0 w-full  flex flex-col bg-slate-900 custom-inner-shadow rounded-xl">
              <div className="rounded-t mb-0 px-6 py-6">
                <div className="text-center">
                  <h6 className="text-white text-2xl font-bold custom-text-border">
                    Loading ...
                  </h6>
                </div>
              </div>
              <div className="flex-1 w-full">
                <div className="h-full">
                  <div className="h-full w-full">
                    <div className="flex flex-wrap justify-center w-full">
                      <div className="w-full">
                        <div className="h-full w-full">
                          <div className="flex flex-wrap justify-center w-full pb-5">
                            <svg
                              className="animate-spin h-12 w-12 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
