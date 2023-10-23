import { Link, useLoaderData } from "@remix-run/react";

export function loader() {
  return { post: "My Blog Post!" };
}

export default function Component() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <div>REMOTE BLOG</div>
      <article>{data.post}</article>
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
