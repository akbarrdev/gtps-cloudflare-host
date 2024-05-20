/**
 * Simple GTPS Host and Connection Counter using KV store in Cloudflare Workers
 *
 * - Edit the IP address in wrangler.toml.
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
/**
 * @typedef {Object} Env
 */
export default {
	/**
	 * @param {Request} request
	 * @param {Env} env
	 * @param {ExecutionContext} ctx
	 * @returns {Promise<Response>}
	 */
	async fetch(request, env, ctx) {
		const url = new URL(request.url);

		if (request.method.toUpperCase() === 'POST') {
			const responseText = `server|${env.SERVER_IP}
port|${env.SERVER_PORT}
type|1
maint|Server is under maintenance - GTPS Host using Cloudflare Workers by Akbarrdev.

beta_server|${env.SERVER_IP}
beta_port|${env.SERVER_PORT}
beta_type|1
meta|localhost
RTENDMARKERBS1001`;
			if (url.pathname == '/growtopia/server_data.php') {
				return new Response(responseText);
			}
		}

		if (url.pathname === '/totalconnect') {
			const kv = env.KV;
			const now = new Date();
			const currentDate = now.toLocaleDateString('default', { day: 'numeric' });
			const currentMonth = now.toLocaleString('default', { month: 'long' });
			let totalConnects = (await kv.get(`totalConnects`)) || 0;
			let todayConnects = (await kv.get(`todayConnects-${currentDate}`)) || 0;
			let monthConnects = (await kv.get(`monthConnects-${currentMonth}`)) || 0;
			const data = {
				total: totalConnects,
				today: todayConnects,
				month: monthConnects,
			};
			return new Response(JSON.stringify(data), {
				headers: { 'Content-Type': 'application/json' },
			});
		} else if (url.pathname === '/download') {
			const responseText = `${env.SERVER_IP} growtopia1.com\n${env.SERVER_IP} growtopia2.com\n${env.SERVER_IP} www.growtopia1.com
${env.SERVER_IP} www.growtopia2.com\n${env.SERVER_IP} akbarr.dev\n${env.SERVER_IP} nevata.server`;

			return new Response(responseText, {
				headers: {
					'Content-Type': 'text/plain',
					'Content-Disposition': 'attachment; filename="gtps.txt"',
				},
			});
		} else if (url.pathname === '/delete') {
			const data = await clearOldData(env);
			return new Response(data, {
				headers: { 'Content-Type': 'text/plain' },
			});
		} else {
			await addNewData(env);
			const responseText = `${env.SERVER_IP} growtopia1.com\n${env.SERVER_IP} growtopia2.com\n${env.SERVER_IP} www.growtopia1.com
${env.SERVER_IP} www.growtopia2.com\n${env.SERVER_IP} akbarr.dev\n${env.SERVER_IP} nevata.server`;
			return new Response(responseText, {
				status: 418,
				statusText: 'Nevata Private Server',
				headers: {
					'Content-Type': 'text/plain',
				},
			});
		}
	},
};

async function addNewData(env) {
	const kv = env.KV;
	const now = new Date();
	const currentDate = now.toLocaleDateString('default', { day: 'numeric' });
	const currentMonth = now.toLocaleString('default', { month: 'long' });
	let totalConnects = (await kv.get('totalConnects')) || 0;
	let todayConnects = (await kv.get(`todayConnects-${currentDate}`)) || 0;
	let monthConnects = (await kv.get(`monthConnects-${currentMonth}`)) || 0;
	totalConnects++;
	todayConnects++;
	monthConnects++;
	await kv.put('totalConnects', totalConnects);
	await kv.put(`todayConnects-${currentDate}`, todayConnects);
	await kv.put(`monthConnects-${currentMonth}`, monthConnects);
}

async function clearOldData(env) {
	const kv = env.KV;
	const now = new Date();
	const currentDate = now.toLocaleDateString('default', { day: 'numeric' });
	// const currentMonth = now.toLocaleString('default', { month: 'long' });
	const listKeys = await kv.list();
	const keys = [...listKeys.keys];
	let deletedKeys = '';
	console.log(listKeys);

	for (const key of keys) {
		if (key.name.startsWith('todayConnects-') && !key.name.includes(currentDate)) {
			await kv.delete(key.name);
			deletedKeys += `${key.name}, `;
		}
	}
	return !deletedKeys ? 'No data deleted' : `Deleted keys: ${deletedKeys}`;
}
