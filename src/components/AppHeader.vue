<template>
  <header>
    <n-text class="ui-logo">
      <img
        :src="require('../assets/header__logo.jpg')"
        alt="header__logo"
        width="35"
        style="border-radius: 50%; overflow: hidden"
      />
      <span>小游戏</span>
    </n-text>
    <n-a
      href="https://github.com/N-index/games"
      target="_blank"
      id="github"
      style="text-decoration: none"
    >
      <n-button :round="round" :circle="circle" color="#000">
        <template #icon>
          <n-icon><LogoGithub /></n-icon>
        </template>
        <span id="github-text">Github</span>
      </n-button>
    </n-a>
  </header>
</template>

<script>
import { NText, NButton, NIcon, NA } from "naive-ui";
import { LogoGithub } from "@vicons/ionicons5";
export default {
  components: {
    NText,
    NButton,
    NIcon,
    NA,
    LogoGithub,
  },
  data() {
    return {
      round: true,
      circle: false,
    };
  },
  created() {
    const res = window.matchMedia("(max-width: 700px)");
    [this.round, this.circle] = [!res.matches, res.matches];
    res.onchange = ({ matches }) => {
      [this.round, this.circle] = [!matches, matches];
    };
  },
};
</script>

<style scoped>
header {
  height: var(--header-height);
  display: flex;
  justify-content: center;
  align-items: center;
}
.ui-logo {
  display: flex;
  align-items: center;
  font-size: 25px;
  gap: 8px;
  transition: all 3s;
}
.ui-logo img {
  animation: in 1s linear infinite paused;
}
.ui-logo:hover img {
  animation-play-state: running;
}
#github {
  position: fixed;
  right: 1.2vw;
}
@media screen and (max-width: 700px) {
  #github-text {
    display: none;
  }
  #github-text .n-button__icon {
    margin: 0 !important;
  }
}
@keyframes in {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
@media screen and (max-width: 600px) {
  header {
    flex-direction: row;
    justify-content: center;
  }
}
</style>
