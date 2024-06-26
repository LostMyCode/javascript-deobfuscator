<template>
  <div class="container text-left">
    <h1 class="my-4">JavaScript Deobfuscator</h1>

    <Alert ref="alert"></Alert>

    <div class="form-group mb-4 text-left">
      <label for="TargetFuncName">Target function name</label>
      <a href="#" class="ml-2" @click="toggleTargetFuncTip">How to get?</a>
      <input
        type="text"
        class="form-control"
        id="TargetFuncName"
        placeholder="_0x1234"
        v-model="targetName"
      />
    </div>

    <TargetFuncTip ref="TargetFuncTip"></TargetFuncTip>

    <div class="form-group mb-4 text-left">
      <label for="codeInputTextarea">Input</label>
      <textarea
        class="form-control"
        id="codeInputTextarea"
        rows="5"
        placeholder="var _0x14bb=['EMKjwoXCuTB1PsKIbSnDkMKY','RsKLwrHCpQ==','wpPCisOQI ..."
        v-model="mainCode"
        spellcheck="false"
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
      <label for="codeResultTextarea">Result</label>
      <textarea
        class="form-control"
        id="codeResultTextarea"
        rows="5"
        v-model="outputCode"
        @click="copyToClipboard"
        spellcheck="false"
      ></textarea>
    </div>

    <div class="feedback">
      <a href="https://github.com/LostMyCode/javascript-deobfuscator/issues" target="_blank">Feedback (GitHub)</a>
    </div>
  </div>
</template>

<script>
import Analyzer from "@/Analyzer.js";
import Alert from "@/components/Alert.vue";
import TargetFuncTip from "@/components/TargetFuncTip.vue";
import Worker from "worker-loader!../worker";

export default {
  components: {
    Alert,
    TargetFuncTip,
  },

  data() {
    return {
      analyzer: null,
      targetName: null,
      mainCode: null,
      outputCode: null,
      running: false,
      worker: null
    };
  },

  methods: {
    decode() {
      this.running = true;
      this.outputCode = null;
      this.$refs.alert.hide();

      // use another variable to avoid changing input
      let code = this.mainCode + "";

      const type = this.analyzer.checkType(this.targetName, code);
      if (type === null) {
        return this.$refs.alert.showAlert(
          "danger",
          "[Error]",
          "Invalid obfuscation type! Please report to us or try again."
        ),
        this.running = false;
      }
      if (type === 3) {
        code = window.js_beautify(code, {
          unescape_strings: true,
        })
      }

      this.changeProgress(100);

      this.worker.postMessage({ type, targetName: this.targetName, code });
    },
    changeProgress(rate) {
      if (!document.getElementById("running-progress-bar")) {
        return setTimeout(this.changeProgress, 10, rate);
      }
      document.getElementById("running-progress-bar").style.width = rate + "%";
    },
    copyToClipboard() {
      const copyTarget = document.getElementById("codeResultTextarea");
      copyTarget.select();
      document.execCommand("Copy");
    },
    toggleTargetFuncTip() {
      this.$refs.TargetFuncTip.toggle();
    },
  },

  mounted() {
    this.analyzer = Analyzer();
    this.worker = new Worker();

    this.worker.onmessage = (e) => {
      const { data } = e;
      let { status, result } = data;

      if (status === "success") {
        this.running = false;
        result = result.replace(/\n/g, "");
        this.changeProgress(0);
        this.$refs.alert.showAlert(
          "success",
          "[Success]",
          "Successfully decoded the code!!"
        );
        this.outputCode = window.js_beautify(result);
      } else {
        this.running = false;
        this.changeProgress(0);
        console.log(result);
        this.$refs.alert.showAlert(
          "danger",
          "[Error]",
          "Decoder error! Please check target code and name of target function."
        );
      }
    };
  }
};
</script>
