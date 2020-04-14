<template>
  <div class="auth-content">
    <div class="auth-modal">
      <img src="@/assets/logo.png" alt="Logo" width="200" />
      <hr />
      <div class="auth-title">{{showSignup ? 'Cadastro' : 'Login'}}</div>
      <input type="text" v-if="showSignup" v-model="user.name" placeholder="Nome" />
      <input type="text" v-model="user.email" placeholder="Email" name="email" />
      <input type="password" name="password" v-model="user.password" placeholder="Senha" />
      <input
        type="password"
        v-if="showSignup"
        v-model="user.confirmPassword"
        placeholder="Confirme a Senha"
      />
      <button v-if="showSignup" @click="signup">Registrar</button>
      <button v-else @click="signin">Entrar</button>
      <a href @click.prevent="showSignup = !showSignup">
        <span v-if="showSignup">Já tem cadastro ? Acesse o login</span>
        <span v-else>Não tem cadastro ? Registre-se aqui</span>
      </a>
    </div>
  </div>
</template>

<script>
import { baseApiUrl, showError, userKey } from "@/global";
import axios from "axios";
export default {
  name: "Auth",
  data: function() {
    return {
      showSignup: false,
      user: {}
    };
  },
  methods: {
    signin() {
      axios
        .post(`${baseApiUrl}/signin`, this.user)
        .then(response => {
          this.$store.commit("setUser", response.data);
          localStorage.setItem(userKey, JSON.stringify(response.data));
          this.$router.push({ path: "/" });
        })
        .catch(showError);
    },
    signup() {
      axios
        .post(`${baseApiUrl}/signup`, this.user)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.user = {};
          this.showSignup = false;
        })
        .catch(showError);
    }
  }
};
</script>

<style>
.auth-content {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.auth-modal {
  background-color: #fff;
  width: 350px;
  padding: 35px;
  box-shadow: 0 1px 5px #00000026;

  display: flex;
  flex-direction: column;
  align-items: center;
}
.auth-title{
  font-size: 1.2rem;
  font-weight: 100;
  margin-top: 10px;
  margin-bottom: 15px;
}
.auth-modal input{
  border: 1px solid #bbb;
  width: 100%;
  margin-bottom: 15px;
  padding: 3px 8px;
  outline: none;
}

.auth-modal button{
  align-self: flex-end;
  background: #2460ae;
  color: #fff;
  border: none;
  padding: 5px 15px;
}
.auth-modal button:hover{
  filter: brightness(1.1);
}
.auth-modal a {
  margin-top: 35px;
}
.auth-modal hr{
  border: 0;
  width: 100%;
  height: 1px;
  background-image:linear-gradient(to right, 
    rgba(120, 120, 120, 0),
    rgba(120, 120, 120, .75),
    rgba(120, 120, 120, 0)
  ) ;
}
</style>