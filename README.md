<p align="center">
<img src="docs/assets/remix-federation.png?raw=true" height="150">
</p>
<h1 align="center">
Remix Federation
</h1>
<p align="center">
Federated <a href="https://remix.run/docs">Remix</a> app development, using module federation concepts on native import maps, providing runtime integration of independent Remix sites.
</p>
<p align="center">
Built on Native Federation from <a href="https://github.com/angular-architects/module-federation-plugin/tree/main/libs/native-federation-core">@softarc/native-federation</a> that provides a build tool agnostic and native browser approach to module federation.
</p>
<p align="center">
  <a href="#status"><img src="https://img.shields.io/badge/stability-experimental-orange.svg"></a>
</p>

### Setup

```shell
> pnpm i
> pnpm run dev
```

Please see the [status](#status) section.

### Features

- ✅ Runtime loading and sharing of routes between Remix sites
- ✅ Runtime sharing of code and components between Remix sites
- ✅ Mental Model of Module Federation
- ✅ Future Proof: Independent of build tools like webpack
- ✅ Embraces Import Maps and EcmaScript modules

### Architecture
<p>
<img src="docs/assets/server-tree.jpg?raw=true" height="320">
</p>

The demo application follows a similar architecture to that outlined by the Cloudflare team at https://blog.cloudflare.com/better-micro-frontends/ and the source for the above diagram.

Each independently hosted [micro-frontend](https://martinfowler.com/articles/micro-frontends.html) can be responsible for parts of the route tree. Requests go to the root host application and are proxied through to the other remotes/hosts to fulfill the request and compose the UI.

To achieve this in Remix the root Host defines a [splat route](https://remix.run/docs/en/main/file-conventions/routes#splat-routes) that matches the base path for one of its remotes e.g. `/blog/*`. The splat route will then proxy action/loader requests through to the remote application and dynamically load all the remote app's routes via Remix's route manifest file e.g. `/blog/posts/1`, `/blog/post/`.  

### Status

**(Experimental)** This is currently just an experiment and proof of concept.

### Future Work

- Fix required pnpm patch of remix-run/react components and get vite plugin working instead.
- HMR of remotes.
- Solve lack of SSR for remote routes. 

## License

[MIT](https://github.com/sveltejs/kit/blob/master/LICENSE)
