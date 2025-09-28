import { memo } from "react";

import Icon1 from "@/shared/assets/icon1.svg";
import Icon2 from "@/shared/assets/icon2.svg";
import Icon3 from "@/shared/assets/icon3.svg";

const icons = [Icon1, Icon2, Icon3];

export const MovieLoading = memo(() => {
  return (
    <>
      <style>{`
        @keyframes heartbeat {
          0% {
            transform: scale(1);
          }
          14% {
            transform: scale(1.15);
          }
          28% {
            transform: scale(1);
          }
          42% {
            transform: scale(1.15);
          }
          70% {
            transform: scale(1);
          }
        }
      `}</style>

      <div className="flex h-screen w-full items-center justify-center dark:bg-black">
        <div className="flex items-center">
          {icons.map((icon, i) => (
            <div key={i} className="w-16 h-16 flex items-center ml-[-30px]">
              <img
                src={icon}
                alt={`icon-${i}`}
                className="w-12 h-12"
                style={{
                  animation: `heartbeat 1.4s ease-in-out ${i * 0.35}s infinite`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
});
