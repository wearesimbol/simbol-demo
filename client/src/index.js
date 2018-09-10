import Simbol from 'simbol';

const config = {
	hand: 'right',
	virtualPersona: {
		signIn: true,
		multiVP: {
			socketURL: 'ws://localhost',
			socketPort: '8000',
			iceServers: [
				{urls: 'stun:global.stun.twilio.com:3478?transport=udp'},
				{urls:'stun:stun.l.google.com:19302'},
				{urls:'stun:stun1.l.google.com:19302'},
				{
					urls: 'turn:localhost:3478?transport=udp',
					username: 'alberto',
					credential: 'pzqmtestinglol'
				},
				{
					urls: 'turn:localhost:3478?transport=tcp',
					username: 'alberto',
					credential: 'pzqmtestinglol'
				}
			]
		}
	},
	scene: {
		render: true,
		animate: true,
		canvas: document.querySelector('.scene'),
		// Scene credit: https://poly.google.com/view/4PazXqve8xz
		sceneToLoad: './assets/model.glb'
	}
};

const simbol = new Simbol(config);
simbol.init()
	.then(() => {
		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
		simbol.addToScene([directionalLight]);
	});
window.simbol = simbol;
