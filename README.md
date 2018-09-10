# Simbol Demo

Get up and running with Simbol by building on top of this demo. It provides both the client, thay uses the [Simbol](https://github.com/wearesimbol/simbol) library, and the minimal server, based on [simbol-server](https://github.com/wearesimbol/simbol-server). Both are used using [Docker](https://docker.com), making deploying your site easy and fast, with minimal configuration.

# Getting Started

## Client

There's a minimal website in [/client](https://github.com/wearesimbol/simbol-demo/master/src/client) with an `index.html` and `main.css`. The JavaScript is in `/src`, in `index.js`. There's an example Simbol usage, that loads a scene from `assets/demoscene.glb`. You can check out the code in `index.js`.

First you need to install dependencies (which includes `simbol`). Do this from the `/client` directory:

`cd client`
`npm install`

If you make JavaScript changes, run `npm run js` to compile them using [Rollup](https://rollupjs.org).

## Server

This demo provides an example of how to use [simbol-server](https://github.com/wearesimbol/simbol-server) in [/server](https://github.com/wearesimbol/simbol-demo/master/src/server). Simbol requires a server for two reasons:

* It needs an HTTP server to serve the Web Content
* It needs a WebSocket server to take care of [signaling](https://codelabs.developers.google.com/codelabs/webrtc-web/#0) for the multiuser experience provided in your site

It add two routes for `/assets` and `/build` and runs the HTTP and WebSockets server that [simbol-server](https://github.com/wearesimbol/simbol-server) provides. You can modify and add routes as you need.

To run the server, make sure you are in the `/server` directory:

`cd server`

and run it with [Cargo](https://github.com/rust-lang/cargo):

`cargo run`
	
Now your website is accessible in `http://localhost:3000` and the WebSocket server is in `http://localhost:8000`

## Deploying

Once you have finished your 3D website and configured your server's routes, you can deploy your site in a server or VPS using docker. You can also do this locally, and it takes care of compiling both the client and the server and intalling all necessary dependencies.

It will also install and configure [CoTurn](https://github.com/coturn/coturn). This is a [TURN](https://en.wikipedia.org/wiki/Traversal_Using_Relays_around_NAT) server that provides backup for the multiuser experience in Simbol.

To build the Docker container, run the following command changing the build arguments for your values:

`docker build --build-arg DOMAIN=yourdomain.com --build-arg EMAIL=youremail@yourdomain.com --build-arg COTURN_USER=test --build-arg COTURN_PASSWORD=secretpassword -t simbol-demo .`

And then run the container. It opens the port for simbol-server and for CoTurn.

`docker run -p 3000:3000 -p 8000:8000 -p 3478:3478 -p 5349:5349 -p 3479:3479 -p 5350:5350 -d --name=simbol-demo simbol-demo`

### Adding the CoTurn server to Simbol

Running your Docker container will run the CoTurn server on port `3478`. You can then tell Simbol that information so it can depend on CoTurn when creating the multiuser experience. You do this in the configuration object:

```js
{
	virtualPersona: {
		multiVP: {
			socketURL: 'wss://example.com/ws',
			socketPort: '80',
			iceServers: [
				{urls: 'stun:global.stun.twilio.com:3478?transport=udp'},
				{urls:'stun:stun.l.google.com:19302'},
				{
					urls: 'turn:example.com:3478?transport=udp',
					username: 'test',
					credential: 'secretpassword'
				},
				{
					urls: 'turn:example.com:3478?transport=tcp',
					username: 'test',
					credential: 'secretpassword'
				}
			]
		}
	}
}
```

Remember to change `example.com` for your domain and setting the username and password.

There's a modifiable example in [client/src/index.js](https://github.com/wearesimbol/simbol-demo/blob/master/client/src/index.js).

## Contributing

Check out the [Contribution guide](https://github.com/wearesimbol/simbol/blob/master/CONTRIBUTING.md)! If you have any questions, join our [community](http://spectrum.chat/simbol)

## License

This program is free software and is distributed under an [MIT License](https://github.com/wearesimbol/simbol-demo/blob/master/LICENSE).
