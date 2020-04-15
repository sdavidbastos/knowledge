<template>
  <div class="user-dropdown">
    <div class="user-button">
      <span class="d-none d-sm-block">{{user.name}}</span>
      <div class="user-dropdown-img">
        <Gravatar :email="user.email" alt="User" />
      </div>
      <i class="fa fa-angle-down"></i>
    </div>
    <div class="user-dropdown-content">
      <router-link v-if="user.admin" to="/admin">
        <i class="fa fa-cogs" />
        <span>Administração</span>
      </router-link>
      <a href @click.prevent="logout">
        <i class="fa fa-sign-out" />
        <span>Sair</span>
      </a>
    </div>
  </div>
</template>

<script>
import { userKey } from '@/global'
import { mapState } from "vuex";
import Gravatar from "vue-gravatar";
export default {
  name: "UserDropdown",
  components: { Gravatar },
  computed: mapState(["user"]),
  methods: {
    logout(){
      localStorage.removeItem(userKey)
      this.$store.commit('setUser', null)
      this.$router.push({ name: 'auth' })
    }
  }
};
</script>

<style>
.user-dropdown {
  height: 100%;
  transition: 0.2s;
}
.user-dropdown:hover {
  background-color: rgba(0, 0, 0, 0.2);
}
.user-button {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px 20px;

  color: #fff;
  font-weight: 100;
}
.user-dropdown-img {
  margin: 0px 10px;
}
.user-dropdown-img > img {
  max-height: 37px;
  border-radius: 5px;
}
.user-dropdown-content {
  position: absolute;
  right: 0px;
  background-color: #050505;
  min-width: 170px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  padding: 10px;
  z-index: 1;
  border-radius: 5px;

  display: flex;
  flex-direction: column;
  flex-wrap: wrap;

  visibility: hidden;
  opacity: 0;
  transition: visibility 0s, opacity 0.5s linear;
}

.user-dropdown:hover .user-dropdown-content {
  visibility: visible;
  opacity: 1;
}
.user-dropdown-content a{
  text-decoration: none;
  color: #bbb;
  padding: 10px;
  border: solid 1px transparent; 
}
.user-dropdown-content a:hover{
  border: solid 1px #2D8EE3;
  text-decoration: none;
  color: #bbb;
}
.user-dropdown-content a i{
  padding-right: 20px;
}
</style>