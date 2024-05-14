/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
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
		const kv = env.Nevata;

		const now = new Date();
		const currentDate = now.toLocaleDateString('default', { day: 'numeric' });
		const currentMonth = now.toLocaleString('default', { month: 'long' });

		let totalConnects = (await kv.get(`totalConnects`)) || 0;
		let todayConnects = (await kv.get(`todayConnects-${currentDate}`)) || 0;
		let monthConnects = (await kv.get(`monthConnects-${currentMonth}`)) || 0;

		if (url.pathname === '/totalconnect') {
			const data = {
				total: totalConnects,
				today: todayConnects,
				month: monthConnects,
			};
			console.log(data);
			return new Response(JSON.stringify(data), {
				headers: { 'Content-Type': 'application/json' },
			});
		} else if (url.pathname === '/delete') {
			const data = await clearOldData(env);
			return new Response(data, {
				headers: { 'Content-Type': 'text/plain' },
			});
		} else {
			totalConnects++;
			todayConnects++;
			monthConnects++;
			await kv.put('totalConnects', totalConnects);
			await kv.put(`todayConnects-${currentDate}`, todayConnects);
			await kv.put(`monthConnects-${currentMonth}`, monthConnects);
			const responseText = `167.71.220.174 growtopia1.com
167.71.220.174 growtopia2.com
167.71.220.174 www.growtopia1.com
167.71.220.174 www.growtopia2.com
167.71.220.174 akbarr.dev
167.71.220.174 nevata.server`;

			return new Response(responseText, {
				headers: { 'Content-Type': 'text/plain' },
			});
		}
	},
};

async function clearOldData(env) {
	const kv = env.Nevata;
	const now = new Date();
	const currentDate = now.toLocaleDateString('default', { day: 'numeric' });
	// const currentMonth = now.toLocaleString('default', { month: 'long' });
	const listKeys = await kv.list();
	const keys = [...listKeys.keys];
	let deletedKeys;
	console.log(listKeys);

	// await kv.delete(`todayConnects-${currentDate}`);
	// await kv.delete(`monthConnects-${currentMonth}`);

	for (const key of keys) {
		if (key.name.startsWith('todayConnects-') && !key.name.includes(currentDate)) {
			await kv.delete(key.name);
			deletedKeys += `${key.name}, `;
		}
	}
	return !deletedKeys ? 'No data deleted' : `Deleted keys: ${deletedKeys}`;
}
