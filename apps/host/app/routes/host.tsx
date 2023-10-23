import { Link } from "@remix-run/react";

export default function Component() {
  return (
    <>
      <div>HOST ROUTE</div>
      <ul>
        <li>
          <Link to="/">HOME</Link>
        </li>
      </ul>
    </>
  );
}
