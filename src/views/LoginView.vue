<script setup lang="ts">
import { ref } from 'vue';
import { APP } from "../constants";

import AwsS3Service, { AwsS3Config } from "../service/aws";
import DataService from '../service/dataService';
import { Context } from '../service/appContext';

const getFromLocalStorage = function(key: string, fallback: string) : string {
  if (typeof window === 'undefined')
    return fallback;
  
  const result = window.localStorage.getItem(key)
  return result ?? fallback;
}

const bucketRegion = ref(getFromLocalStorage("bucketRegion", APP.defaultBucketRegion));
const bucketName = ref(getFromLocalStorage("bucket", ""));
const bucketPath = ref(getFromLocalStorage("fileName", ""));

const apiKey = ref(getFromLocalStorage("awsApiKey", ""));
const apiSecret = ref(getFromLocalStorage("awsApiSecret", ""));

const errorMessage = ref("");

function login() {
  Context.loggedOut = false;

  const creds = new AwsS3Config(apiKey.value, apiSecret.value, bucketRegion.value, bucketName.value);
  const s3Service = new AwsS3Service(creds);
  const database = new DataService(s3Service, bucketPath.value);
  database.load(() => {
    Context.setDb(database);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem("bucketRegion", bucketRegion.value);
      window.localStorage.setItem("bucket", bucketName.value);
      window.localStorage.setItem("fileName", bucketPath.value);
      
      if (Context.autoLogin) {
        window.localStorage.setItem("awsApiKey", apiKey.value);
        window.localStorage.setItem("awsApiSecret", apiSecret.value);
      }
    }
  }, (err: string) => { errorMessage.value = err; });
}

if (Context.autoLogin && bucketRegion.value && bucketName.value && bucketPath.value && apiKey.value && apiSecret.value) {
  console.log("In webview with all credentials valid, auto logging in");
  if (!Context.loggedOut) {
    login();
  }
}
</script>

<template>
  <p>{{ errorMessage }}</p>
  <form class="container">
    <div class="row">
      <div class="col-8">
        <label for="bucketName" class="form-label">Bucket Name:</label>
        <input type="text" v-model="bucketName" class="form-control" id="bucketName">
      </div>
      <div class="col-4">
        <label for="bucketRegion" class="form-label">In AWS Region:</label>
        <input type="text" v-model="bucketRegion" class="form-control" id="bucketRegion">
      </div>
    </div>
    <div class="row">
      <div class="col">
        <label for="bucketPath" class="form-label">File:</label>
        <input type="text" v-model="bucketPath" class="form-control" id="bucketPath">
      </div>
    </div>
    <div class="row">
      <div class="col">
        <label for="apiKey" class="form-label">Api Key:</label>
        <input type="text" v-model="apiKey" class="form-control" id="apiKey">
      </div>
    </div>
    <div class="row">
      <div class="col">
        <label for="apiSecret" class="form-label">Api Secret:</label>
        <input type="password" v-model="apiSecret" class="form-control" id="apiSecret">
      </div>
    </div>

    <button @click="login" type="button" class="btn btn-primary">Login</button>
  </form>
  <p>{{ Context.autoLogin ? "Automatic" : "" }}</p>
</template>
