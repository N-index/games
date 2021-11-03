<template>
  <n-divider>认证</n-divider>
  <n-spin :show="authLoading">
    <n-button v-if="user" @click="showUserInfo = true" round>
      {{ user.email || user.displayName || "账号信息" }}
    </n-button>
    <n-space v-else justify="center">
      <n-button @click="showLoginForm = true">登录</n-button>
    </n-space>
  </n-spin>
  <n-modal v-model:show="showLoginForm">
    <n-card
      style="width: 95%; max-width: 250px"
      title="无密登录"
      :bordered="false"
      size="small"
    >
      <template #header-extra>
        <n-icon size="25">
          <LogInOutline />
        </n-icon>
      </template>

      <n-form
        ref="formRef"
        :disabled="formDisable"
        :model="formValue"
        :rules="rules"
        label-placement="left"
      >
        <n-form-item path="email">
          <n-auto-complete
            :options="options"
            v-model:value="formValue.email"
            blur-after-select
            placeholder="邮箱"
          >
          </n-auto-complete>
        </n-form-item>
      </n-form>
      <n-space justify="end">
        <n-button
          :type="type"
          attr-type="button"
          icon-placement="right"
          :loading="loading"
          @click="sendMail"
        >
          <template #icon>
            <n-icon>
              <FingerPrint />
            </n-icon>
          </template>
          发送邮件
        </n-button>
      </n-space>

      <template #action>
        <n-space justify="center">
          <n-button text style="font-size: 24px" @click="logInWithGithub">
            <n-icon>
              <LogoGithub />
            </n-icon>
          </n-button>
          <n-button text style="font-size: 24px" @click="signInWithGoogle">
            <n-icon>
              <LogoGoogle />
            </n-icon>
          </n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
  <n-modal v-model:show="showUserInfo">
    <n-card v-if="user" style="width: 95%; max-width: 350px" size="small">
      <n-tabs
        type="segment"
        justify-content="space-evenly"
        default-value="self-info"
      >
        <n-tab-pane name="self-info" tab="个人信息" display-directive="show">
          <user-info :user="user"></user-info>
        </n-tab-pane>
        <n-tab-pane name="self-score" tab="游戏记录" display-directive="show">
          <user-score :user="user"></user-score>
        </n-tab-pane>
        <n-tab-pane name="self-bind" tab="认证" display-directive="show">
          <user-binding
            :user="user"
            @unlink="updateUserAfterUnlink"
          ></user-binding>
        </n-tab-pane>
      </n-tabs>
      <template #action>
        <n-space justify="end">
          <n-space v-if="user.isAnonymous" justify="center">
            <n-button @click="showLoginForm = true">切换账号登录</n-button>
          </n-space>
          <n-button v-if="!user.isAnonymous" @click="logOut" type="warning">
            退出登录
          </n-button>
          <n-popconfirm v-else @positive-click="logOut">
            <template #trigger>
              <n-button type="warning">退出登录</n-button>
            </template>
            <span style="max-width: 200px">
              匿名用户退出后，将无法找回数据，是否退出？
            </span>
          </n-popconfirm>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<script>
import { User } from "../../firebase/models/user";
import isEmail from "validator/es/lib/isEmail";
import UserInfo from "./components/UserInfo";
import UserScore from "./components/UserScore";
import UserBinding from "./components/UserBinding";
import {
  onAuthStateChanged,
  isSignInLink,
  sendEmail,
  signInWithEmail,
  signOut,
} from "../../firebase/auth/emailLinkAuth";
import {
  NSpin,
  NPopconfirm,
  NTabs,
  NTabPane,
  NDivider,
  NAutoComplete,
  NModal,
  NCard,
  NForm,
  NFormItem,
  NButton,
  NIcon,
  NSpace,
} from "naive-ui";
import { useMessage, useNotification } from "naive-ui";
import {
  LogInOutline,
  FingerPrint,
  LogoGithub,
  LogoGoogle,
} from "@vicons/ionicons5";
import {
  signInWithGithub,
  getGithubRedirectResult,
} from "../../firebase/auth/githubAuth";
import {
  signInWithGoogle,
  getGoogleRedirectResult,
} from "../../firebase/auth/googleAuth";
import {
  deleteAnonymous,
  signInAnony,
} from "../../firebase/auth/anonymousAuth";
import { getAuth } from "firebase/auth";
import { ref } from "vue";
const auth = getAuth();
export default {
  name: "LoginModal",
  components: {
    NSpin,
    NPopconfirm,
    UserBinding,
    UserScore,
    NTabPane,
    NTabs,
    UserInfo,
    LogoGithub,
    LogoGoogle,
    NAutoComplete,
    LogInOutline,
    FingerPrint,

    NIcon,
    NCard,
    NModal,
    NButton,
    NForm,
    NFormItem,
    NSpace,
    NDivider,
  },
  setup() {
    const message = useMessage();
    const notification = useNotification();
    const authLoading = ref(false);
    return {
      message,
      notification,
      authLoading,
    };
  },
  data() {
    return {
      type: "default",
      loading: false,
      showLoginForm: false,
      showUserInfo: false,
      formDisable: false,
      formValue: {
        email: "",
      },
      user: null,
      rules: {
        email: {
          required: true,
          trigger: "blur",
          validator(rule, value) {
            if (!value) {
              // 这个错误信息会出现在input框下
              return new Error("邮箱不能为空");
            } else if (!isEmail(value)) {
              return new Error("邮箱格式不正确");
            }
            return true;
          },
        },
      },
    };
  },
  created() {
    this.authLoading = true;
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.syncUserInfo(user);
      } else {
        this.user = null;
        await this.signInWithAnonymous();
      }
      this.authLoading = false;
    });
    this.detectSignInWithLink();
    // this.detectGoogleRedirect();
    // this.detectGithubRedirect();
  },
  methods: {
    syncUserInfo(user) {
      const msg = this.message["loading"]("正在同步用户信息", {
        duration: 15000,
      });
      // console.log(` ${user.isAnonymous ? "匿名用户" : "永久用户"}`);
      // console.log(user);
      this.user = new User(user);
      this.user
        .addUserToDb()
        .then(() => {
          [msg.type, msg.content] = ["success", "用户信息同步完成"];
        })
        .catch((e) => {
          {
            [msg.type, msg.content] = [
              "error",
              `用户信息同步失败, code:${e.code}, message:${e.message}`,
            ];
          }
        })
        .finally(() => {
          setTimeout(() => {
            msg.destroy();
          }, 2000);
        });
    },
    updateUserAfterUnlink(user) {
      const msg = this.message["loading"]("正在同步账户信息", {
        duration: 15000,
      });
      this.user = new User(user);
      this.user
        .addUserToDb()
        .then(() => {
          [msg.type, msg.content] = ["success", "用户信息同步完成"];
        })
        .catch((e) => {
          {
            [msg.type, msg.content] = [
              "error",
              `用户信息同步失败, code:${e.code}, message:${e.message}`,
            ];
          }
        })
        .finally(() => {
          setTimeout(() => {
            msg.destroy();
          }, 2000);
        });
    },
    signInWithGoogle,
    async signInWithAnonymous() {
      // 如果主动退出登录，则不自动创建匿名用户
      if (JSON.parse(localStorage.getItem("isLogOutByHand"))) return;
      this.notification.create({
        content:
          "为流畅您的体验，已自动为您注册一个匿名帐号，后续您可通过链接永久账号来保存游戏记录",
      });
      // const msg = this.message["loading"]("自动创建一个随机用户并登录", {
      //   duration: 15000,
      // });
      try {
        await signInAnony();
        // [msg.type, msg.content] = ["success", "匿名用户创建完成"];
      } catch (e) {
        // [msg.type, msg.content] = [
        //   "error",
        //   `匿名用户创建失败, code:${e.code}, message:${e.message}`,
        // ];
      } finally {
        // setTimeout(() => {
        //   msg.destroy();
        // }, 2000);
      }
    },
    async detectGithubRedirect() {
      const msg = this.message["loading"]("正在认证 Github...", {
        duration: 15000,
      });
      try {
        await getGithubRedirectResult();
        [msg.type, msg.content] = ["success", "已通过 Github 登录"];
        // console.log("获取 Github重定向结果");
      } catch (e) {
        [msg.type, msg.content] = [
          "error",
          "Github 验证失败或当前 Github 账户已经被绑定",
        ];
        // console.log("github error");
        throw e;
      } finally {
        localStorage.setItem("waitingGithubDirect", JSON.stringify(false));
        setTimeout(() => {
          msg.destroy();
        }, 2000);
      }
    },
    async detectGoogleRedirect() {
      // if (!JSON.parse(localStorage.getItem("waitingGoogleDirect"))) return;

      const msg = this.message["loading"]("正在认证 Google...", {
        duration: 15000,
      });
      try {
        await getGoogleRedirectResult();
        [msg.type, msg.content] = ["success", "已通过 Google 登录"];
        // console.log("获取Google重定向结果");
      } catch (e) {
        [msg.type, msg.content] = [
          "error",
          "Google 验证失败或当前 Google 账户已经被绑定",
        ];
        // console.log("google error");
        throw e;
      } finally {
        localStorage.setItem("waitingGoogleDirect", JSON.stringify(false));
        setTimeout(() => {
          msg.destroy();
        }, 2000);
      }
    },
    async logInWithGithub() {
      try {
        await signInWithGithub();
        // const { result, credential } = await signInWithGithub();
        // const token = credential.accessToken;
        // const user = result.user;
        // console.log(`${credential},${token},${user}`);
        this.message.success(`已通过 Github 登录。`);
        // console.log(user);
        // this.message.success(`${credential},${token},${user}`);
      } catch (e) {
        this.message.error(`code: ${e.code}, message: ${e.message}`);
        throw e;
      }
    },
    async logOut() {
      localStorage.setItem("isLogOutByHand", JSON.stringify(true));
      if (this.user && this.user.isAnonymous) {
        // 删除匿名用户
        try {
          await deleteAnonymous();
          this.message.success("删除匿名用户");
          this.showUserInfo = false;
          this.showLoginForm = false;
        } catch (e) {
          this.message.info("删除匿名用户失败");
          throw e;
        }
      } else {
        // 主动退出登录
        signOut(auth)
          .then(() => {
            this.message.success("账号已退出");
            this.showUserInfo = false;
          })
          .catch((e) => {
            this.message.error(`错误代码：${e.code},错误信息：${e.message}`);
          });
      }
    },
    async detectSignInWithLink() {
      if (isSignInLink()) {
        const msg = this.message["loading"]("正在认证...", {
          duration: 15000,
        });
        let email = localStorage.getItem("emailForSignIn");
        if (!email) {
          email = prompt("本地信息缺失，请重新输入邮箱");
        }
        try {
          // 此处的 result 供临时使用
          const result = await signInWithEmail(email);
          [msg.type, msg.content] = [
            "success",
            result.user.email + "验证成功，现已登录",
          ];
        } catch (e) {
          [msg.type, msg.content] = [
            "error",
            `错误代码：${e.code},错误信息：${e.message}`,
          ];
        } finally {
          setTimeout(() => {
            msg.destroy();
            location.search = "";
          }, 2000);
        }
      }
    },
    async sendMail(e) {
      e.preventDefault();
      this.loading = true;
      this.formDisable = true;
      this.$refs["formRef"].validate(async (errors) => {
        if (!errors) {
          const msg = this.message["loading"]("正在发送邮件,请稍等...", {
            duration: 15000,
          });
          try {
            localStorage.setItem("emailForSignIn", this.formValue.email);
            await sendEmail(this.formValue.email);
            [msg.type, msg.content] = ["success", "邮件已发送，请去确认"];
          } catch (e) {
            [msg.type, msg.content] = [
              "error",
              `错误代码：${e.code}, 错误信息：${e.message}`,
            ];
          } finally {
            setTimeout(() => {
              msg.destroy();
            }, 2000);
          }
        } else {
          this.message.error("输入有误，请检查");
        }
        this.loading = false;
        this.formDisable = false;
      });
    },
  },
  computed: {
    options() {
      return [
        "@gmail.com",
        "@qq.com",
        "@163.com",
        "@outlook.com",
        "@live.com",
      ].map((suffix) => {
        const prefix = this.formValue.email.split("@")[0];
        return {
          label: prefix + suffix,
          value: prefix + suffix,
        };
      });
    },
  },
};
</script>

<style scoped></style>
