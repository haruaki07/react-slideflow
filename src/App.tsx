import {
  Background,
  BackgroundVariant,
  NodeMouseHandler,
  ReactFlow,
  useReactFlow,
} from "@xyflow/react";
import { useAtom } from "jotai";
import React, { useCallback, useEffect } from "react";
import { currentSlideAtom } from "./atoms";
import { Slide, SlideData } from "./components/Nodes/Slide";
import { slidesToElements } from "./lib/slides";

const nodeTypes = {
  slide: Slide,
};

const slides: Record<string, SlideData> = {
  "0": {
    source:
      "## Welcome Slide\nWelcome to our interactive presentation. Let's explore!",
    right: "1",
  },
  "1": {
    source:
      "## Bullet Points\n- Made with React Flow\n- Supports Markdown\n- Easy navigation",
    left: "0",
    right: "3",
    up: "2",
  },
  "2": {
    source:
      "## Markdown Magic\nUse *italic*, **bold**, or even `inline code` to spice things up!",
    down: "1",
  },
  "3": {
    source:
      "## Final Thoughts\nThank you for viewing. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    left: "1",
  },
};

const initialSlide = "0";
const { edges, nodes } = slidesToElements(initialSlide, slides);

const App = () => {
  const { fitView } = useReactFlow();
  const [currentSlide, setCurrentSlide] = useAtom(currentSlideAtom);

  useEffect(() => {
    setCurrentSlide(initialSlide);
  }, []);

  const handleNodeClick = useCallback<NodeMouseHandler>(
    (_, node) => {
      fitView({ nodes: [node], duration: 150 }).then(() => {
        setCurrentSlide(node.id);
      });
    },
    [setCurrentSlide, fitView]
  );

  const handleKeyDown = useCallback<React.KeyboardEventHandler>(
    (e) => {
      let direction: "right" | "left" | "up" | "down";
      console.log(e);
      if (e.key === "ArrowRight") {
        direction = "right";
      } else if (e.key === "ArrowLeft") {
        direction = "left";
      } else if (e.key === "ArrowUp") {
        direction = "up";
      } else if (e.key === "ArrowDown") {
        direction = "down";
      } else {
        return;
      }

      const id = slides[currentSlide!][direction];
      if (!id) return;

      e.preventDefault();
      fitView({ nodes: [{ id }], duration: 150 }).then(() => {
        setCurrentSlide(id);
      });
    },
    [currentSlide, fitView]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ nodes: [{ id: initialSlide }] }}
      minZoom={0.1}
      onNodeClick={handleNodeClick}
      onKeyDown={handleKeyDown}
    >
      <Background variant={BackgroundVariant.Lines} bgColor="#f8f8f8" />
    </ReactFlow>
  );
};

export default App;
