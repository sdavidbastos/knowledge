<template>
  <header class="header">
    <a @click="toggleMenu" v-if="!hideToggle" class="toggle">
      <i class="fa fa-lg fa-angle-right" :class="rotate" />
    </a>
    <h3 class="title">{{title}}</h3>
    <UserDropdown v-if="!hideUserDropdown" />
  </header>
</template>

<script>
import UserDropdown from "./UserDropdown";
export default {
  name: "Header",
  components: { UserDropdown },
  props: {
    title: String,
    hideToggle: Boolean,
    hideUserDropdown: Boolean
  },
  computed: {
    rotate() {
      return this.$store.state.isMenuVisible ? "rotate" : "";
    }
  },
  methods: {
    toggleMenu() {
      this.$store.commit("toggleMenu");
    }
  }
};
</script>

<style>
.header {
  grid-area: header;
  background: linear-gradient(to right, #1e469a, #49a7c1);

  display: flex;
  justify-content: center;
  align-content: center;
}
.title {
  font-size: 1 rem;
  color: #fff;
  font-weight: 100;
  flex-grow: 1;
  text-align: center;
}
.title .a {
  color: #fff;
  text-decoration: none;
}
header.header > a.toggle {
  width: 60px;
  height: 100%;
  color: #fff;
  justify-self: flex-start;

  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;
  transition: 200ms;
}
header.header > a.toggle:hover {
  background-color: rgba(0, 0, 0, .2);
}

header.header > a.toggle i {
  transition: .5s;
}
header.header > a.toggle i.rotate {
  transform: rotate(-180deg);
}
</style>