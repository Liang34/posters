<template>
  <div class="login-page">
    <div class="form">
      <a-form layout="vertical" :model="form" :rules="rules" ref="loginForm">
        <h2>欢迎来来到海报大师</h2>
        <p class="subTitle">使用邮箱号码和验证码登录到海报大师</p>
        <a-form-item label="邮箱号码" required name="email">
          <a-input placeholder="邮箱号码" v-model:value="form.email">
            <template v-slot:prefix>
              <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item label="验证码" required name="verifyCode">
          <a-input placeholder="四位验证码" v-model:value="form.verifyCode">
            <template v-slot:prefix>
              <LockOutlined style="color: rgba(0, 0, 0, 0.25)" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" size="large" @click="login"> 登录 </a-button>
          <a-button
            size="large"
            :style="{ marginLeft: '20px' }"
            :disabled="codeButtonDisable"
            @click="getCode"
          >
            {{ counter === 60 ? "获取验证码" : `${counter}秒后重发` }}
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<script lang="ts">
// @ts-nocheck
import { defineComponent, reactive, ref, Ref, computed, watch } from "vue";
import { getVeriCode } from "../service/user";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import { message, Form } from "ant-design-vue";
import { Rule } from "ant-design-vue/es/form/interface";
import { GlobalDataProps } from "../store/index";

export default defineComponent({
  components: {
    UserOutlined,
    LockOutlined,
  },
  setup() {
    const form = reactive({
      email: "",
      verifyCode: "",
    });
    const cellnumberValidator = (rule: Rule, value: string) => {
      return new Promise((resolve, reject) => {
        const passed =
          /^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(
            value.trim()
          );
        setTimeout(() => {
          if (passed) {
            resolve("");
          } else {
            reject("邮箱格式不正确");
          }
        }, 500);
      });
    };
    let timer = 0;
    const rules = reactive({
      email: [
        { required: true, message: "邮箱不能为空", trigger: "blur" },
        { asyncValidator: cellnumberValidator, trigger: "blur" },
      ],
      verifyCode: [
        { required: true, message: "验证码不能为空", trigger: "blur" },
      ],
    });
    const counter = ref(60);
    const startCounter = () => {
      counter.value--;
      timer = window.setInterval(() => {
        counter.value--;
      }, 1000);
    };
    const getCode = async () => {
      const res = await getVeriCode(form.email);
      if (res.errno === 0) {
        message.success("验证码已发送，请注意查收", 5);
        startCounter();
      }
    };
    const codeButtonDisable = computed(() => {
      return (
        !/^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(
          form.email.trim()
        ) || counter.value < 60
      );
    });
    const useForm = Form.useForm;
    const { validate } = useForm(form, rules);
    const store = useStore<GlobalDataProps>();
    const router = useRouter();
    const login = () => {
      validate().then(() => {
        const payload = {
          emailAddress: form.email,
          veriCode: form.verifyCode,
        };
        store.dispatch("loginAndFetch", payload).then(() => {
          message.success("登录成功 2秒后跳转首页");
          setTimeout(() => {
            router.push("/");
          }, 2000);
        });
      });
    };
    watch(counter, (newValue) => {
      if (newValue === 0) {
        clearInterval(timer);
        counter.value = 60;
      }
    });
    return {
      login,
      form,
      rules,
      getCode,
      counter,
      codeButtonDisable,
    };
  },
});
</script>
<style scoped lang="less">
.login-page {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: black;
}
.form {
  background-color: #fff;
  padding: 30px 60px;
  width: 600px;
  border-radius: 20px;
  
}
</style>
