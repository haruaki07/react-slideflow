import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { useSetAtom } from "jotai";
import React, { useCallback } from "react";
import { Remark } from "react-remark";
import { currentSlideAtom } from "../../atoms";

export type SlideData = {
  source: string;
  left?: string;
  up?: string;
  down?: string;
  right?: string;
};
export type SlideNode = Node<SlideData, "slide">;

export const SLIDE_WIDTH = 1920;
export const SLIDE_HEIGHT = 1080;
export const SLIDE_PADDING = 80;

const style = {
  width: `${SLIDE_WIDTH}px`,
  height: `${SLIDE_HEIGHT}px`,
} satisfies React.CSSProperties;
const directions = [
  { key: "left", label: "←" },
  { key: "up", label: "↑" },
  { key: "down", label: "↓" },
  { key: "right", label: "→" },
];
export const Slide: React.FC<NodeProps<SlideNode>> = ({ data }) => {
  const setCurrentSlide = useSetAtom(currentSlideAtom);
  const { fitView } = useReactFlow();
  const moveToNextSlide = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      fitView({ nodes: [{ id }], duration: 150 }).then(() => {
        setCurrentSlide(id);
      });
    },
    [fitView]
  );

  return (
    <article
      className="bg-white shadow rounded-lg p-12 flex flex-col justify-between"
      style={style}
    >
      <div className="prose prose-2xl">
        <Remark>{data.source}</Remark>
      </div>

      <div className="nopan -mr-2">
        {directions.map(({ key, label }) => {
          const target = data[key as keyof typeof data] as string | undefined;
          return (
            <button
              key={key}
              className={`mr-2 border rounded-lg w-16 h-16 inline-flex items-center justify-center text-3xl mt-4 cursor-pointer ${
                target
                  ? "border-gray-600 text-black hover:bg-gray-100"
                  : "border-gray-300 text-gray-400 cursor-not-allowed"
              }`}
              onClick={(e) => target && moveToNextSlide(e, target)}
              disabled={!target}
            >
              {label}
            </button>
          );
        })}
      </div>
    </article>
  );
};
