import { type ReactNode } from "react";

interface DocumentElement {
  webkitRequestFullscreen: () => void;
  mozRequestFullscreen: () => void;
  requestFullscreen: () => void;
}

interface Document {
  webkitFullscreenElement: Element | null;
}

const Interactions = (): ReactNode => {
  return (
    <div
      className="absolute bottom-0 left-0 w-10 h-10 bg-slate-900 text-slate-600 rounded-tr-2xl z-20"
      onClick={() => {
        // request fullscreen
        const doc = document as globalThis.Document & Document;
        if (doc.fullscreenElement || doc.webkitFullscreenElement) {
          document.exitFullscreen();
          return;
        }
        const el = doc.documentElement as HTMLElement & DocumentElement;
        if (el.requestFullscreen) {
          el.requestFullscreen();
        } else if (el.webkitRequestFullscreen) {
          el.webkitRequestFullscreen();
        } else if (el.mozRequestFullscreen) {
          el.mozRequestFullscreen();
        }
      }}
    >
      <svg
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="scale-50"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10 15H15V10H13.2V13.2H10V15ZM6 15V13.2H2.8V10H1V15H6ZM10 2.8H12.375H13.2V6H15V1H10V2.8ZM6 1V2.8H2.8V6H1V1H6Z"
          fill="currentColor"
        ></path>
      </svg>
    </div>
  );
};

export default Interactions;
