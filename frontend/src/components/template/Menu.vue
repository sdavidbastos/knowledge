<template>
  <aside class="menu" v-show="isMenuVisible">
    <div class="menu-filter">
      <i class="fa fa-search fa-lg"></i>
      <input
        type="text"
        placeholder="Digite para filtrar..."
        v-model="treeFilter"
        class="filter-field"
      />
    </div>
    <Tree :data="treeData" :options="treeOptions" :filter="treeFilter" ref="tree" />
  </aside>
</template>

<script>
import { baseApiUrl } from "@/global";
import axios from "axios";
import Tree from "liquor-tree";
import { mapState } from "vuex";
export default {
  name: "Menu",
  components: { Tree },
  computed: mapState(["isMenuVisible"]),
  data: function() {
    return {
      treeFilter: "",
      treeData: this.getTreeData(),
      treeOptions: {
        propertyNames: { text: "name" },
        filter: { emptyText: "Categoria não encontrada" }
      }
    };
  },
  methods: {
    getTreeData() {
      const url = `${baseApiUrl}/categories/tree`;
      return axios.get(url).then(response => response.data);
    },
    /* onNodeSelect é uma forma de rota programática. */
    onNodeSelect(node) {
      this.$router.push({
        name: 'articlesByCategory',
        params: { id: node.id }
      })
    }
  },
  mounted(){
    /* Através do $refs podemos acessar os elementos do html */
    this.$refs.tree.$on('node:selected', this.onNodeSelect)
  }
};
</script>

<style>
.menu {
  grid-area: menu;
  background: linear-gradient(to right, #232526, #414345);

  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}
.menu span,
.menu span:hover {
  color: #fff;
  text-decoration: none;
}
.menu .tree-node:not(.selected) > .tree-content:hover,
.menu .tree-node.selected > .tree-content {
  background-color: #ffffff33;
}
.menu .tree-arrow.has-child.ltr {
  filter: brightness(2);
}
.menu .menu-filter {
  display: flex;
  justify-content: center;
  align-items: center;

  margin: 20px;
  padding-bottom: 8px;
  border-bottom: 1px solid #fff;
}
.menu .menu-filter i {
  color: #aaa;
  margin-right: 10px;
}
.menu input {
  color: #ccc;
  font-size: 1.1rem;
  border: 0;
  outline: 0;
  width: 100%;
  background: transparent;
}
.menu .tree-filter-empty {
  color: #ccc;
  margin-left: 20px;
}
</style>