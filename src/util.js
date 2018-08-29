import cockpit from 'cockpit';
/***
 * varlink protocol helpers
 * https://github.com/varlink/varlink.github.io/wiki
 */
const encoder = cockpit.utf8_encoder();
const decoder = cockpit.utf8_decoder(true);
const _ = cockpit.gettext;
// let channelCreated = false;
// let channel = null;
export const PODMAN = { unix: "/run/podman/io.podman" };
/**
 * Do a varlink call on an existing channel. You must *never* call this
 * multiple times in parallel on the same channel! Serialize the calls or use
 * `varlinkCall()`.
 *
 * Returns a promise that resolves with the result parameters or rejects with
 * an error message.
 */
function varlinkCallChannel(channel, method, parameters) {
    return new Promise((resolve, reject) => {
	function on_close(event, options) {
		reject(options.problem || options);
	}

	function on_message(event, data) {
		channel.removeEventListener("message", on_message);
		channel.removeEventListener("close", on_close);

		// FIXME: support answer in multiple chunks until null byte
		if (data[data.length - 1] != 0) {
		reject("protocol error: expecting terminating 0");
		return;
		}

		var reply = decoder.decode(data.slice(0, -1));
		var json = JSON.parse(reply);
		if (json.error) {
			let msg = varlinkCallError(json);
			reject(msg);
		} else if (json.parameters) {
			// debugging
			// console.log("varlinkCall", method, "→", JSON.stringify(json.parameters));
			resolve(json.parameters)
		} else
			reject("protocol error: reply has neither parameters nor error: " + reply);
	}

	channel.addEventListener("close", on_close);
	channel.addEventListener("message", on_message);
	channel.send(encoder.encode(JSON.stringify({ method, parameters: (parameters || {}) })));
	channel.send([0]); // message separator
	})
}

function varlinkCallError(error) {
	let str = "";

	error.error ? str += error.error.toString() : str;
	error.parameters ? str += " " + error.parameters.reason.toString() : str;
	// console.log(str);
	return str;
}

/**
 * Do a varlink call on a new channel. This is more expensive than
 * `varlinkCallChannel()` but allows multiple parallel calls.
 */
export function varlinkCall(channelOptions, method, parameters) {
	// if (!channelCreated) {
		var channel = cockpit.channel(Object.assign({payload: "stream", binary: true, superuser: "require" }, channelOptions));
		// channelCreated = true;
	// }

	return varlinkCallChannel(channel, method, parameters).finally(() => {
		setTimeout(()=>{

			channel.close()
		}, 60000)
	});
}

export function truncate_id(id) {
	if (!id) {
		return _("");
	}
	return _(id.substr(0, 12));
}

export function format_cpu_percent(cpuPercent) {
	if (cpuPercent === undefined || isNaN(cpuPercent)) {
		return _("");
	}
	return _(cpuPercent + "%");
}

export function format_memory_and_limit(usage, limit) {
	if (usage === undefined || isNaN(usage))
		return _("");

	var mtext = "";
	var units = 1024;
	var parts;
	if (limit) {
		parts = cockpit.format_bytes(limit, units, true);
		mtext = " / " + parts.join(" ");
		units = parts[1];
	}

	if (usage) {
		parts = cockpit.format_bytes(usage, units, true);
		if (mtext)
			return _(parts[0] + mtext);
		else
			return _(parts.join(" "));
	} else {
		return _("");
	}
}

export function container_stop(container, timeout) {
	const id = container.ID;
	if (timeout == undefined) {
		timeout = 10;
	}
	varlinkCall(PODMAN, "io.podman.StopContainer", JSON.parse('{"name":"' + id + '","timeout":' + timeout + '}' ))
		.then(reply => {
			console.log(reply.container);
			return reply.container;
		})
        .catch(ex => console.error("Failed to do RemoveContainerForce call:", JSON.stringify(ex)));
}

export function getCommitStr(arr, cmd) {
	let ret = "";
	if (cmd === "ENV") {
		for (let i = 0; i < arr.length; i++) {
			let k = arr[i].envvar_key;
			let v = arr[i].envvar_value;
			let temp = "";
			if (i === arr.length - 1) {
				// temp = '"ENV=' + "'" + '"' + k + "=" + v + '"' + "'" + '"';
				temp = '"ENV=' + "'" + k + "=" + v + "'" + '"';

			} else {
				// temp = '"ENV=' + "'" + '"' + k + "=" + v + '"' + "'" + '"' + ",";

				temp = '"ENV=' + "'" + k + "=" + v + "'" + '"' + ",";
			}
			ret += temp;
		}
	} else if (cmd === "LABEL") {
		for (let i = 0; i < arr.length; i++) {
			let k = arr[i].labvar_key;
			let v = arr[i].labvar_value;
			let temp = "";
			if (i === arr.length - 1) {
				// temp = '"LABEL=' + "'" + '"' + k + "=" + v + '"' + "'" + '"';
				temp = '"LABEL=' + "'" + k + "=" + v + "'" + '"';

			} else {
				// temp = '"LABEL=' + "'" + '"' + k + "=" + v + '"' + "'" + '"' + ",";
				temp = '"LABEL=' + "'" + k + "=" + v + "'" + '"' + ",";

			}
			ret += temp;
		}
	} else if (cmd === "EXPOSE") {
		for (let i = 0; i < arr.length; i++) {
			let temp = "";
			if (i === arr.length - 1) {
				temp = '"EXPOSE=' + arr[i] + '"';
			} else {
				temp = '"EXPOSE=' + arr[i] + '"' + ",";
			}
			ret += temp;
		}
	} else if (cmd === "VOLUME") {
		for (let i = 0; i < arr.length; i++) {
			let temp = "";
			if (i === arr.length - 1) {
				temp = '"VOLUME=' + arr[i] + '"';
			} else {
				temp = '"VOLUME=' + arr[i] + '"' + ",";
			}
			ret += temp;
		}
	} else if (cmd === "ONBUILD") {
		for (let i = 0; i < arr.length; i++) {
			let temp = "";
			if (i === arr.length - 1) {
				temp = '"ONBUILD=' + arr[i] + '"';
			} else {
				temp = '"ONBUILD=' + arr[i] + '"' + ",";
			}
			ret += temp;
		}
	}
	return ret;
}
