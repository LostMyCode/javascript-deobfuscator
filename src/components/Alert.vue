<template>
  <div v-if="show" class="alert" v-bind:class="[type]" role="alert">
    <b>{{ title }}</b> {{ message }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "",
      message: "",
      type: "alert-success",
      show: false,
    };
  },

  methods: {
    showAlert(type, title, message) {
      this.type = "alert-" + type;
      this.title = title;
      this.message = message;
      this.show = true;
    },
    hide() {
      this.show = false;
    },
  }
};
</script>
