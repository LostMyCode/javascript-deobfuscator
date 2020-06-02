<template>
  <div class="container text-left">
    <h1 class="my-4">JavaScript Deobfuscator</h1>
    <div class="form-group mb-4 text-left">
      <label for="TargetFuncName">Target function name</label>
      <input
        type="text"
        class="form-control"
        id="TargetFuncName"
        placeholder="_0x"
        v-model="targetName"
      />
    </div>
    <div class="form-group mb-4 text-left">
      <label for="exampleFormControlTextarea1">Input</label>
      <textarea
        class="form-control"
        id="exampleFormControlTextarea1"
        rows="5"
        v-model="mainCode"
      ></textarea>
    </div>
    <button
      v-if="!running"
      type="button"
      class="mb-4 btn btn-primary deobfus-btn"
      @click="decode"
    >
      Deobfuscate
    </button>
    <div class="mb-4 progress running-progress" v-if="running">
      <div
        id="running-progress-bar"
        class="progress-bar progress-bar-striped progress-bar-animated"
        role="progressbar"
        aria-valuenow="75"
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>
    </div>

    <div class="form-group mb-4 text-left">
      <label for="exampleFormControlTextarea1">Result</label>
      <textarea
        class="form-control"
        id="exampleFormControlTextarea1"
        rows="5"
        v-model="outputCode"
      ></textarea>
    </div>
  </div>
</template>

<script>
// import Decoder from "@/Decoder.js";

export default {
  data() {
    return {
      decoder: null,
      targetName: null,
      mainCode: null,
      outputCode: null,
      running: false,
    };
  },

  methods: {
    decode() {
      this.running = true;
      this.changeProgress(100);
      this.axios
        .post(
          "https://us-central1-deobfuscator.cloudfunctions.net/api/request",
          {
            targetName: this.targetName,
            code: this.mainCode
          }
        )
        .then((res) => {
          this.running = false;
          // console.log(res);
          res.data = res.data.replace(/\n/g, "");
          this.changeProgress(0);
          this.outputCode = window.js_beautify(res.data);
        })
        .catch((e) => {
          this.running = false;
          this.changeProgress(0);
          console.log(e);
        });
    },
    changeProgress(rate) {
      if (!document.getElementById("running-progress-bar")) {
        return setTimeout(this.changeProgress, 10, rate);
      }
      document.getElementById("running-progress-bar").style.width = rate + "%";
    },
  },

  mounted() {
    // this.decoder = Decoder();
  },
};
</script>
