<template>
  <n-button
    :type="btnType"
    @click="showModal = true"
    icon-placement="right"
    round
  >
    <template #icon v-if="!isLogIn">
      <n-icon> <AtCircleOutline /></n-icon>
    </template>
    {{ isLogIn ? loginInfo.email : "无密码登录" }}</n-button
  >
  <n-modal v-model:show="showModal">
    <n-card
      v-if="isLogIn"
      title="个人信息"
      style="width: 95%; max-width: 300px"
      size="small"
    >
      你好 {{ loginInfo.email }}: <br />
      邮箱验证与否： {{ loginInfo.emailVerified }}
      <br />
      上次登录时间：{{ new Date(Number(loginInfo.lastLoginAt)) }} <br />
      注册时间：{{ new Date(Number(loginInfo.createdAt)) }}<br />
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

import {
  auth,
  onAuthStateChanged,
  isSignInLink,
  sendEmail,
  signIn,
  signOut,
} from "../firebase/auth";
import {
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
import { LogInOutline, AtCircleOutline, FingerPrint } from "@vicons/ionicons5";
export default {
  name: "LoginModal",
  components: {
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
  },
  setup() {
    const message = useMessage();
    return {
      message,
    };
  },
  data() {
    return {
      type: "default",
      loading: false,
      showModal: false,
      formDisable: false,
      btnType: "info",
      formValue: {
        email: "",
      },
      loginInfo: "",
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
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // 注意：表面上看到的user结构并不能直接获取，比如lastLoginAt无法直接在user上获取到，也不要直接JSON.stringify硬解。
        // 而要根据这些接口（https://firebase.google.com/docs/reference/js/v8/firebase.User）来获取，
        // 所以可以先toJSON然后取lastLoginAt
        this.isLogIn = true;
        const { email, emailVerified, createdAt, lastLoginAt } = user.toJSON();
        this.loginInfo = {
          email: email,
          emailVerified: emailVerified,
          createdAt: createdAt,
          lastLoginAt: lastLoginAt,
        };
        this.btnType = "default";
      } else {
        this.isLogIn = false;
        this.loginInfo = {};
        this.btnType = "info";
      }
    });
    this.signIn();
  },
  methods: {
    logOut() {
      signOut(auth)
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
        this.message.info("正在检测登录...");
        let email = localStorage.getItem("emailForSignIn");
        if (!email) {
          email = prompt("本地信息缺失，请重新输入邮箱");
        }
        try {
          // 此处的result供临时使用
          const result = await signIn(email);
          localStorage.removeItem("emailForSignIn");
          localStorage.setItem("loginInfo", JSON.stringify(result));
          this.message.success(result.user.email + "验证成功，现已登录");
          this.isLogIn = true;
        } catch (e) {
          this.message.error(`错误代码：${e.code},错误信息：${e.message}`);
        }
      }
    },
    async sendMail(e) {
      e.preventDefault();
      this.loading = true;
      this.formDisable = true;
      this.$refs["formRef"].validate(async (errors) => {
        if (!errors) {
          try {
            localStorage.setItem("emailForSignIn", this.formValue.email);
            const msg = this.message["loading"]("正在发送邮件,请稍等...", {
              duration: 10000,
            });
            await sendEmail(this.formValue.email);
            msg.type = "success";
            msg.content = "邮件已发送，请去确认";
            setTimeout(() => {
              msg.destroy();
            }, 2000);
          } catch (e) {
            this.message.error(`错误代码：${e.code},错误信息：${e.message}`);
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
