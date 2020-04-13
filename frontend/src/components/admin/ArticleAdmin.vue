<template>
  <div class="article-admin">
    <b-form>
      <input v-model="article.id" type="hidden" id="article-id" />
      <b-form-group label-for="article-name" label="Nome:">
        <b-form-input
          id="article-name"
          placeholder="Informe o Nome do Artigo..."
          required
          v-model="article.name"
          :readonly="mode==='remove'"
        />
      </b-form-group>
      <b-form-group label-for="article-description" label="Descrição:">
        <b-form-input
          id="article-description"
          placeholder="Informe a Descrição do Artigo..."
          required
          v-model="article.description"
          :readonly="mode==='remove'"
        />
      </b-form-group>
      <b-form-group v-if="mode ==='save'" label-for="article-imageUrl" label="Imagem(URL):">
        <b-form-input
          id="article-imageUrl"
          v-model="article.imageUrl"
          placeholder="Informe a URL da imagem do Artigo"
        />
      </b-form-group>
      <b-form-group v-if="mode ==='save'" label-for="article-categoryId" label="Categoria:">
        <b-form-select id="article-categoryId" :options="categories" v-model="article.categoryId" />
      </b-form-group>
      <b-form-group v-if="mode ==='save'" label-for="article-userId" label="Autor:">
        <b-form-select id="article-userId" :options="users" v-model="article.userId" />
      </b-form-group>
      <b-form-group v-if="mode==='save'" label-for="article-content" label="Conteúdo:">
        <VueEditor
          id="article-content"
          v-model="article.content"
          placeholder="Informe o Conteudo do Artigo..."
        />
      </b-form-group>
      <b-button variant="primary" v-if="mode === 'save'" @click="save">Salvar</b-button>
      <b-button variant="danger" v-if="mode === 'remove'" @click="remove">Excluir</b-button>
      <b-button class="ml-2" @click="reset">Cancelar</b-button>
    </b-form>
    <hr />
    <b-table hover striped :items="articles" :fields="fields">
      <template v-slot:cell(actions)="data">
        <b-button variant="warning" @click="loadArticle(data.item)" class="mr-2 mb-1">
          <i class="fa fa-pencil"></i>
        </b-button>
        <b-button variant="danger" @click="loadArticle(data.item, 'remove')" class="mb-1">
          <i class="fa fa-trash"></i>
        </b-button>
      </template>
    </b-table>
    <b-pagination size="md" v-model="page" :total-rows="count" :per-page="limit" />
  </div>
</template>

<script>
import { VueEditor } from "vue2-editor";
import { baseApiUrl, showError } from "@/global";
import axios from "axios";

export default {
  name: "ArticleAdmin",
  components: { VueEditor },
  data: function() {
    return {
      mode: "save",
      article: {},
      articles: [],
      categories: [],
      users: [],
      page: 1,
      limit: 0,
      count: 0,
      fields: [
        { key: "id", label: "Código", sortable: true },
        { key: "name", label: "Nome", sortable: true },
        { key: "description", label: "Descrção", sortable: true },
        { key: "actions", label: "Ações" }
      ]
    };
  },
  methods: {
    loadArticles() {
      const url = `${baseApiUrl}/articles?page=${this.page}`;
      axios.get(url).then(response => {
        this.articles = response.data.data;
        this.count = response.data.count;
        this.limit = response.data.limit;
      });
    },
    reset() {
      this.mode = "save";
      this.article = {};
      this.loadArticles();
    },
    save() {
      const method = this.article.id ? "put" : "post";
      const id = this.article.id ? `/${this.article.id}` : "";
      axios[method](`${baseApiUrl}/articles${id}`, this.article)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    remove() {
      const id = this.article.id;
      axios
        .delete(`${baseApiUrl}/articles/${id}`)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    loadArticle(article, mode = "save") {
      this.mode = mode;
      /* this.article = { ...article }; */
      axios
        .get(`${baseApiUrl}/articles/${article.id}`)
        .then(response => (this.article = response.data));
    },
    loadCategories() {
      const url = `${baseApiUrl}/categories`;
      axios.get(url).then(response => {
        this.categories = response.data.map(category => {
          return { value: category.id, text: category.path };
        });
      });
    },
    loadUser() {
      const url = `${baseApiUrl}/users`;
      axios.get(url).then(response => {
        this.users = response.data.map(user => {
          return {
            value: user.id,
            text: `${user.name} - ${user.email}`
          };
        });
      });
    }
  },
  watch:{
    page(){
      this.loadArticles()
    }
  },
  mounted() {
    this.loadUser();
    this.loadArticles();
    this.loadCategories();
  }
};
</script>

<style>
</style>