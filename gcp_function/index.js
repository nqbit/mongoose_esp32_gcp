var google = require('googleapis');
var cloudiot = google.cloudiot('v1');

function handleDeviceGet(authClient, name, device_id, err, data) {
    if (err) {
        console.log('Error with get device:', device_id);
        console.log(err);
        return;
    }

    console.log('Got device:', device_id);
    console.log(data);
    console.log(data.config);

    var data2 = JSON.parse(
        Buffer.from(data.config.binaryData, 'base64').toString());
    console.log(data2);
    data2.on = !data2.on;
    console.log(data2);

    var request2 = {
        name: name,
        resource: {
            'versionToUpdate' : data.config.version,
            'binaryData' : Buffer(JSON.stringify(data2)).toString('base64')
        },
        auth: authClient
    };

    console.log(request2);

    var devices = cloudiot.projects.locations.registries.devices;
    devices.modifyCloudToDeviceConfig(request2, (err, data) = > {
        if (err) {
            console.log('Error patching device:', device_id);
            console.log(err);
        } else {
            console.log('Patched device:', device_id);
            console.log(data);
        }
    });
}

function handleAuth(err, authClient) {
    const project_id = 'iotplayground-184803';
    const cloud_region = 'us-central1';
    const registry_id = 'iot-registry';
    const device_id = 'esp32_05A6A0';

    const name = `projects / ${project_id} /locations / ${cloud_region} /` +
          `registries / ${registry_id} /devices / ${device_id}`;

    if (err) {
        console.log(err);
    }

    if (authClient.createScopedRequired &&
        authClient.createScopedRequired()) {
        authClient = authClient.createScoped(
            ['https://www.googleapis.com/auth/cloud-platforme']);
    }

    var request = {
        name: name,
        auth: authClient
    };

    // Get device version
    var devices = cloudiot.projects.locations.registries.devices;
    devices.get(request, (err, data) = >
                handleDeviceGet(authClient, name, device_id, err, data));
}

/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 *
 * @param {!Object} event The Cloud Functions event.
 * @param {!Function} callback The function to call after.
 */
exports.subscribe = function subscribe(event, callback) {
    // The Cloud Pub/Sub Message object.
    const pubsubMessage = event.data;

    // We're just going to log the message to prove that
    // it worked.
    console.log(Buffer.from(pubsubMessage.data, 'base64').toString());

    google.auth.getApplicationDefault(handleAuth);

    // Don't forget to call the callback.
    callback();
};
