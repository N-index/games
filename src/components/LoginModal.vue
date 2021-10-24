<template>
  <n-divider>认证</n-divider>
  <template v-if="isLogIn">
    <n-button @click="showModal = true" round>
      {{ loginInfo.email || loginInfo.displayName || "登录信息" }}
    </n-button>
  </template>
  <template v-else>
    <n-space>
      <n-button text style="font-size: 24px" @click="showModal = true">
        <n-icon>
          <AtCircleOutline />
        </n-icon>
      </n-button>
      <n-button text style="font-size: 24px" @click="loginInWithGithub">
        <n-icon>
          <LogoGithub />
        </n-icon>
      </n-button>
      <n-button text style="font-size: 24px">
        <n-icon>
          <LogoGoogle />
        </n-icon>
      </n-button>
    </n-space>
  </template>

  <n-modal v-model:show="showModal">
    <n-card
      v-if="isLogIn"
      title="个人信息"
      style="width: 95%; max-width: 350px"
      size="small"
    >
      <user-info :loginInfo="loginInfo"></user-info>
      <template #action>
        <n-space justify="end">
          <n-button type="warning" @click="logOut">退出登录</n-button>
        </n-space>
      </template>
    </n-card>
    <n-card
      v-else
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

      <template #action>
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
            验证
          </n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<script>
import isEmail from "validator/es/lib/isEmail";
import UserInfo from "./UserInfo";
import {
  emailLinkAuth,
  onAuthStateChanged,
  isSignInLink,
  sendEmail,
  signIn,
  signOut,
} from "../firebase/auth/emailLinkAuth";
import {
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
import { useMessage } from "naive-ui";
import {
  LogInOutline,
  AtCircleOutline,
  FingerPrint,
  LogoGithub,
  LogoGoogle,
} from "@vicons/ionicons5";
import { signInWithGithub } from "../firebase/auth/githubAuth";
export default {
  name: "LoginModal",
  components: {
    UserInfo,
    LogoGithub,
    LogoGoogle,
    NAutoComplete,
    LogInOutline,
    FingerPrint,
    AtCircleOutline,
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
    return {
      message,
    };
  },
  watch: {
    isLogin(val) {
      if (val) {
        localStorage.setItem("isLogin", JSON.stringify(true));
      } else {
        localStorage.setItem("isLogin", JSON.stringify(false));
      }
    },
  },
  data() {
    return {
      type: "default",
      loading: false,
      showModal: false,
      formDisable: false,
      formValue: {
        email: "",
      },
      loginInfo: {},
      isLogIn: false,
      rules: {
        email: {
          require: true,
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
    onAuthStateChanged(emailLinkAuth, (user) => {
      // console.log(emailLinkAuth.currentUser);
      if (user) {
        // 注意：表面上看到的user结构并不能直接获取，比如lastLoginAt无法直接在user上获取到，也不要直接JSON.stringify硬解。
        // 而要根据这些接口（https://firebase.google.com/docs/reference/js/v8/firebase.User）来获取，
        // 所以可以先toJSON然后取lastLoginAt
        this.isLogIn = true;
        const {
          displayName,
          photoURL,
          email,
          emailVerified,
          createdAt,
          lastLoginAt,
        } = user.toJSON();
        this.loginInfo = {
          displayName,
          photoURL,
          email,
          emailVerified,
          createdAt,
          lastLoginAt,
        };
      } else {
        this.isLogIn = false;
        this.loginInfo = {};
      }
    });
    this.signIn();
  },
  methods: {
    async loginInWithGithub() {
      try {
        const { result, credential } = await signInWithGithub();
        const token = credential.accessToken;
        const user = result.user;
        console.log(`${credential},${token},${user}`);
        this.message.success(`github登陆成功！`);

        this.message.success(`${credential},${token},${user}`);
      } catch (e) {
        this.message.error(`code: ${e.code}, message: ${e.message}`);
        throw e;
      }
    },
    logOut() {
      signOut(emailLinkAuth)
        .then(() => {
          this.message.success("账号已退出");
          this.showModal = false;
        })
        .catch((e) => {
          this.message.error(`错误代码：${e.code},错误信息：${e.message}`);
        });
    },
    async signIn() {
      if (isSignInLink()) {
        if (JSON.parse(localStorage.getItem("isLogin"))) {
          this.message.info("已登录");
          setTimeout(() => {
            location.search = "";
          }, 1000);
          return;
        }
        const msg = this.message["loading"]("正在认证...", {
          duration: 15000,
        });
        let email = localStorage.getItem("emailForSignIn");
        if (!email) {
          email = prompt("本地信息缺失，请重新输入邮箱");
        }
        try {
          // 此处的result供临时使用
          const result = await signIn(email);

          localStorage.setItem("loginInfo", JSON.stringify(result));
          [msg.type, msg.content] = [
            "success",
            result.user.email + "验证成功，现已登录",
          ];
          this.isLogIn = true;
        } catch (e) {
          [msg.type, msg.content] = [
            "error",
            `错误代码：${e.code},错误信息：${e.message}`,
          ];
        } finally {
          setTimeout(() => {
            msg.destroy();
          }, 2000);
          // location.search
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
