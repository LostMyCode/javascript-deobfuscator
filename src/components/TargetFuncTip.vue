<template>
  <div class="card mb-4" v-if="show">
    <div class="card-body">
      <h5 class="card-title">How to get the name of target function?</h5>
      <p class="card-text">
        Maybe you can find parts like this:
      </p>
      <div class="codeblock">
        <span class="target">_0x439c</span>[103]
      </div>
      <div class="codeblock">
        <span class="target">_0x439c</span>('0x4')
      </div>
      <div class="codeblock">
        <span class="target">_0x439c</span>('0x2','f]Xg')
      </div>
      <p class="card-text">
        In this case, target function name is <span class="target">_0x439c</span>
      </p>
      <a href="#" class="btn btn-warning" style="width: 6rem;" @click="toggle">Close</a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
    }
  },
  methods: {
    toggle() {
      this.show = !this.show;
    }
  }
}
</script>