<template>
  <n-tabs justify-content="space-evenly" type="line" default-value="basic-auth">
    <n-tab-pane tab="基础认证" name="basic-auth">
      <n-space justify="center" align="center">
        <n-button
          :loading="emailStatus.isLoading"
          @click="showEmailForm = true"
          :disabled="showEmailForm"
        >
          <template #icon>
            <n-icon> <Mail /> </n-icon>
          </template>
          Link with Email
        </n-button>
        <div v-show="showEmailForm">
          <n-divider v-show="false"></n-divider>
          <n-form
            ref="formRef"
            :disabled="emailFormDisable"
            :model="formValue"
            :rules="rules"
            label-placement="left"
            style="margin-top: 20px"
          >
            <n-form-item path="email">
              <n-auto-complete
                :options="options"
                v-model:value="formValue.email"
                blur-after-select
                placeholder="邮箱"
                @keydown.enter.prevent
              >
              </n-auto-complete>
            </n-form-item>
            <n-form-item first path="password">
              <n-input
                v-model:value="formValue.password"
                type="password"
                show-password-on="mousedown"
                placeholder="密码"
                :minlength="5"
                :maxlength="8"
                @input="handlePasswordInput"
                @keydown.enter.prevent
              />
            </n-form-item>
            <n-form-item first path="password_rpt" ref="password_rpt">
              <n-input
                v-model:value="formValue.password_rpt"
                :disabled="!formValue.password"
                type="password"
                @keydown.enter.prevent
                show-password-on="mousedown"
                placeholder="重复密码"
                :maxlength="8"
              />
            </n-form-item>

            <n-space justify="space-between" align="center">
              <n-button
                type="info"
                text
                @click="showEmailForm = false"
                icon-placement="right"
              >
                <template #icon>
                  <n-icon> <CaretUp /> </n-icon>
                </template>
                收起
              </n-button>
              <n-button type="success" @click="handleValidateButtonClick"
                >关联邮箱</n-button
              >
            </n-space>
          </n-form>
        </div>
      </n-space>
    </n-tab-pane>
    <n-tab-pane tab="第三方认证" name="third-party-auth">
      <n-space
        vertical
        justify="center"
        align="stretch"
        style="padding-left: 20px"
      >
        <n-space align="center" justify="center">
          <n-button
            color="#d21819"
            :loading="googleStatus.isLoading"
            @click="linkGoogleWithRedirect"
            v-if="!googleProviderData"
          >
            <template #icon>
              <n-icon> <LogoGoogle /> </n-icon>
            </template>
            Link with Google
          </n-button>
          <template v-else>
            <n-avatar :src="googleProviderData.photoURL"> </n-avatar>
            {{ googleProviderData.email || googleProviderData.displayName }}
            <n-button
              @click="unlink(googleProviderData.providerId)"
              type="info"
              text
            >
              <template #icon>
                <n-icon>
                  <Unlink></Unlink>
                </n-icon>
              </template>
              解绑 Google
            </n-button>
          </template>
        </n-space>
        <n-space align="center" justify="center">
          <n-button
            color="#373737"
            :loading="githubStatus.isLoading"
            @click="linkGithubWithRedirect()"
            v-if="!githubProviderData"
          >
            <template #icon>
              <n-icon>
                <LogoGithub />
              </n-icon>
            </template>
            Link with Github
          </n-button>
          <template v-else>
            <n-avatar :src="githubProviderData.photoURL"> </n-avatar>
            {{ githubProviderData.displayName || githubProviderData.email }}
            <n-button
              @click="unlink(githubProviderData.providerId)"
              type="info"
              text
            >
              <template #icon>
                <n-icon>
                  <Unlink></Unlink>
                </n-icon>
              </template>
              解绑 Github
            </n-button>
          </template>
        </n-space>
      </n-space>
    </n-tab-pane>
  </n-tabs>
</template>

<script>
import {
  NDivider,
  NForm,
  NFormItem,
  NAutoComplete,
  NInput,
  NSpace,
  NButton,
  NIcon,
  NTabs,
  NTabPane,
  NAvatar,
  useMessage,
} from "naive-ui";
import {
  LogoGithub,
  LogoGoogle,
  Mail,
  Unlink,
  CaretUp,
} from "@vicons/ionicons5";
import {
  linkWithEmailPassword,
  linkGoogleWithRedirect,
  linkGithubWithRedirect,
  unlinkAccount,
} from "../../../firebase/link";
import isEmail from "validator/es/lib/isEmail";

export default {
  name: "UserBinding",
  methods: {
    async unlink(providerId) {
      const msg = this.message["loading"]("正在解绑 " + providerId, {
        duration: 15000,
      });
      try {
        const result = await unlinkAccount(providerId);
        console.log(result);
        this.$emit("unlink", result);
        [msg.type, msg.content] = ["success", providerId + " 解绑成功"];
      } catch (e) {
        [msg.type, msg.content] = ["error", providerId + " 解绑失败"];
      } finally {
        setTimeout(() => {
          msg.destroy();
        }, 2000);
      }
    },
    linkGoogleWithRedirect,
    linkGithubWithRedirect,
    validatePasswordSame(rule, value) {
      return value === this.formValue.password;
    },
    handlePasswordInput() {
      if (this.formValue.password_rpt) {
        this.$refs.password_rpt.validate({ trigger: "password-input" });
      }
    },
    handleValidateButtonClick(e) {
      e.preventDefault();
      this.$refs.formRef.validate(async (errors) => {
        if (errors) {
          this.emailFormDisable = true;
          this.message.error("验证失败");
          this.emailFormDisable = false;
        } else {
          this.emailFormDisable = true;
          const msg = this.message["loading"]("正在链接邮箱...", {
            duration: 15000,
          });
          try {
            const result = await linkWithEmailPassword(
              this.formValue.email,
              this.formValue.password
            );
            console.log(result);
            [msg.type, msg.content] = ["success", "邮箱绑定成功"];
          } catch (e) {
            [msg.type, msg.content] = ["error", "邮箱绑定失败"];
            throw e;
          } finally {
            setTimeout(() => {
              msg.destroy();
            }, 2000);
            this.emailFormDisable = false;
          }
        }
      });
    },
  },
  computed: {
    googleProviderData() {
      return this.user.providerData.find(
        (item) => item.providerId === "google.com"
      );
    },
    githubProviderData() {
      return this.user.providerData.find(
        (item) => item.providerId === "github.com"
      );
    },
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
  props: ["user"],
  data() {
    return {
      showEmailForm: false,
      message: useMessage(),
      formValue: {
        email: "",
        password: "",
        password_rpt: "",
      },
      emailFormDisable: false,
      rules: {
        email: [
          {
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
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          {
            validator(rule, value) {
              if (value.length <= 4 || value.length >= 9) {
                // 这个错误信息会出现在input框下
                return new Error("密码长度为5~8位");
              }
              return true;
            },
            trigger: ["blur", "input"],
          },
        ],
        password_rpt: [
          {
            required: true,
            message: "请再次输入密码",
            trigger: ["blur", "input"],
          },
          {
            validator: this.validatePasswordSame,
            message: "两次密码输入不一致",
            trigger: ["blur", "password-input"],
          },
        ],
      },
      emailStatus: {
        isPasswordSet: false,
        isLoading: false,
      },
      googleStatus: {
        isLoading: false,
      },
      githubStatus: {
        isLoading: false,
      },
    };
  },
  components: {
    CaretUp,
    NDivider,
    NForm,
    NFormItem,
    NAutoComplete,
    NInput,
    Unlink,
    NAvatar,
    NSpace,
    NButton,
    NIcon,
    LogoGithub,
    LogoGoogle,
    Mail,
    NTabs,
    NTabPane,
  },
};
</script>

<style scoped></style>
