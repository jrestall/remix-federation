import React from "react";

export default function Widget1() {
  const [count, setCount] = React.useState<number>(0);
  return (
    <>
      <div>I'm a remote React widget from remote1!</div>
      <button
        style={{
          border: "0 solid #e2e8f0",
          marginTop: "10px",
          backgroundColor: "rgb(246, 179, 82)",
          borderRadius: ".25rem",
          fontWeight: "700",
          padding: ".5rem 1rem .5rem 1rem",
          color: "rgb(24, 24, 24)",
        }}
        onClick={() => setCount(count + 1)}
      >
        Click counter: {count}
      </button>
    </>
  );
}
