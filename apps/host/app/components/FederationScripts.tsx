export function FederationScripts() {
  return (
    <>
      <script
        type="esms-options"
        dangerouslySetInnerHTML={{
          __html: `{ "shimMode": true, "mapOverrides": true }`,
        }}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.esmsInitOptions = {
            onimport: async function (url, options, parentUrl) {
              console.log('Top-level import ' + url);
            }
          }`,
        }}
      />
      <script
        async
        src="https://ga.jspm.io/npm:es-module-shims@1.5.17/dist/es-module-shims.js"
      />
      {/* <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: `await import("./app/components/bootstrap.ts"); 
          console.log("1");`,
        }}
      /> */}
    </>
  );
}
