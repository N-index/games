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
      <n-button circle :color="btnColor" v-if="isMobile">
        <template #icon>
          <n-icon :color="iconColor"><LogoGithub /></n-icon>
        </template>
      </n-button>

      <n-button round :color="btnColor" v-else>
        <template #icon>
          <n-icon :color="iconColor"><LogoGithub /></n-icon>
        </template>
        Github
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
  props: {
    isDarkTheme: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    btnColor() {
      return this.isDarkTheme ? "#eee" : "#111";
    },
    iconColor() {
      return this.isDarkTheme ? "#111" : "#eee";
    },
  },
  data() {
    return {
      isMobile: false,
    };
  },
  created() {
    const res = window.matchMedia("(max-width: 700px)");
    this.isMobile = res.matches;
    res.onchange = ({ matches }) => {
      this.isMobile = matches;
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
