# GCP ESP32 Mongoose OS Example

An example demonstrating the use of Mongoose OS (MOS) running on an ESP32, talking to the Google Cloud Platform (GCP).

## Overview

This example will delve into establishing a secure connection with MOS to GCP via MQTT. After this connection is established, a GCP Cloud Function is used to create a basic loopbackk interface to toggle on LED on the ESP32 dev board.

## Open this repo in Google Cloud Shell

[![Open in Cloud Shell](http://gstatic.com/cloudssh/images/open-btn.png)](https://console.cloud.google.com/cloudshell/open?git_repo=https://github.com/nqbit/mongoose_esp32_gcp&page=editor&open_in_editor=README.md)

## Requirements

- ESP32 Development Board (SparkFun's ESP32 Thing was used in this example)
- Google Cloud Platform Account

## Setup

### Create a Google Cloud Platform Project

```
gcloud projects create YOUR_PROJECT_NAME
gcloud config set project YOUR_PROJECT_NAME
```

### Create a Service Account

```
gcloud projects add-iam-policy-binding YOUR_PROJECT_NAME --member=serviceAccount:cloud-iot@system.gserviceaccount.com --role=roles/pubsub.publisher
```

### Create pubsub topics

```
gcloud beta pubsub topics create telemetry
gcloud beta pubsub topics create state
```

### Create IoT Registry

```
gcloud beta iot registries create iot-registry --region YOUR_REGION --event-pubsub-topic=telemetry --state-pubsub-topic=state
```

### Setup Mongoose OS on ESP32

(Here)[mongoose_os/README.md]

### Setup the GCP Cloud Function

(Here)[gcp_function/README.md]
