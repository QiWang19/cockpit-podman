import cockpit from 'cockpit';
/***
 * varlink protocol helpers
 * https://github.com/varlink/varlink.github.io/wiki
 */
const encoder = cockpit.utf8_encoder();
const decoder = cockpit.utf8_decoder(true);

export const PODMAN = { unix: "/run/podman/io.projectatomic.podman" };
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
		if (json.error)
		reject(json.error)
		else if (json.parameters) {
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
    });
}

/**
 * Do a varlink call on a new channel. This is more expensive than
 * `varlinkCallChannel()` but allows multiple parallel calls.
 */
export function varlinkCall(channelOptions, method, parameters) {
    var channel = cockpit.channel(Object.assign({payload: "stream", binary: true, superuser: "require" }, channelOptions));
    var response = varlinkCallChannel(channel, method, parameters);
    response.finally(() => channel.close());
    return response;
}

export function truncate_id(id) {
	if (!id) {
		return "";
	}
	return id.substr(0, 12);
}