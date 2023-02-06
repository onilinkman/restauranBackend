const os = require('os');

function GetIP() {
	const interface = os.networkInterfaces();
	let ips = [];

	Object.keys(interface).forEach(function (ifname) {
		interface[ifname].forEach(function (iface) {
			if ('IPv4' !== iface.family || iface.internal !== false) {
				return;
			}
			ips.push(iface.address);
		});
	});
	return ips;
}

module.exports = {
	GetIP,
};
