<style lang="scss" scoped>
  main {
    width: 100%;
    height: 100%;
    .login_sec {
      width: 100%;
      height: 100%;
      background: url('../../public/img/images/login_bgc.jpg') no-repeat;
      background-size:100% 100%;
      position: relative;
      .login-card {
        width: 500px;
        height: auto;
        opacity: 0.86;
        position: absolute;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
        text-align: center;
        .submitBtn {
          width: 100%;
        }
      }
    }
  }
  
</style>

<template>
<main>
  <section class="login_sec">
    <el-card class="box-card login-card">
      <h2>思龙食品后台管理系统</h2>
      <el-form ref="form" :model="login" label-width="80px">
        <el-form-item label="账号：">
          <el-input v-model="login.username"></el-input>
        </el-form-item>
        <el-form-item label="密码：">
          <el-input type="password" autocomplete="off" v-model="login.password"></el-input>
        </el-form-item>
      </el-form>
      <el-button class="submitBtn" type="primary" @click="onSubmit">登陆</el-button>
    </el-card>
  </section>
</main>
</template>

<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator';
import { post } from '../utils/http';

@Component({
  components: {},
})
export default class Login extends Vue {
  @Provide() public login: any = {
    username: '',
    password: '',
  };
  private async onSubmit() {
    const res = await post("/sign/in", this.login);
    if (res.data.code === "200") {
      document.cookie = this.login.username;
      // localStorage.setItem("login", JSON.stringify(this.login));
      this.$router.push({ name: 'home', params: { data: JSON.stringify(this.login) }});
    } else {
      this.$message.warning(res.data.data);
    }
  }
}
</script>
