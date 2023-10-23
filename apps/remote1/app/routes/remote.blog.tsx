import { Link } from "@remix-run/react";

export default function Component() {
  return (
    <>
      <div>REMOTE BLOG</div>
      <ul>
        <li>
          <Link to="/host">HOST</Link>
        </li>
        <li>
          <Link to="/remote">REMOTE</Link>
        </li>
      </ul>
    </>
  );
}
