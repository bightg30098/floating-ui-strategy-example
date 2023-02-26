import { useState } from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useDismiss,
  useRole,
  useClick,
  useInteractions,
  FloatingFocusManager,
  useId,
  Strategy,
  Placement
} from "@floating-ui/react";

import "./styles.css";

function Popover({
  strategy: _strategy = "absolute",
  placement: _placement = "bottom"
}) {
  const [open, setOpen] = useState(false);

  const { x, y, refs, strategy, context } = useFloating({
    open,
    onOpenChange: setOpen,
    middleware: [
      offset(10),
      flip({ fallbackAxisSideDirection: "end" }),
      shift()
    ],
    whileElementsMounted: autoUpdate,
    strategy: _strategy as Strategy,
    placement: _placement as Placement
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role
  ]);

  const headingId = useId();

  return (
    <>
      <button ref={refs.setReference} {...getReferenceProps()}>
        {_strategy} Trigger
      </button>
      {open && (
        <FloatingFocusManager context={context} modal={false}>
          <div
            className="Popover"
            ref={refs.setFloating}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0
            }}
            aria-labelledby={headingId}
            {...getFloatingProps()}
          >
            <h2 id={headingId}>
              (x: {Math.round(x || 0)}, y: {Math.round(y || 0)})
            </h2>
            <textarea placeholder="Write your review..." />
            <br />
            <button
              style={{ float: "right" }}
              onClick={() => {
                console.log("Added review.");
                setOpen(false);
              }}
            >
              Add
            </button>
          </div>
        </FloatingFocusManager>
      )}
    </>
  );
}

export default function App() {
  return (
    <div className="App">
      <h1>Strategy `Absolute` v.s. `Fixed`</h1>

      <div
        style={{
          display: "inline-block",
          width: "50%",
          position: "relative",
          height: 120,
          overflow: "hidden",
          backgroundColor: "#171717"
        }}
      >
        <Popover />
      </div>

      <div
        style={{
          display: "inline-block",
          width: "50%",
          position: "relative",
          height: 120,
          overflow: "hidden",
          backgroundColor: "#1e3a8a"
        }}
      >
        <Popover strategy="fixed" />
      </div>
    </div>
  );
}
