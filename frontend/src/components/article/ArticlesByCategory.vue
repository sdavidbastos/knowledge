<template>
  <div class="articles-by-category">
    <PageTitle icon="fa fa-folder-o" :main="category.name" sub="Categoria" />
    <ul>
      <li v-for="article in articles" :key="article.id">
        <ArticleItem :article="article" />
      </li>
    </ul>
    <div v-if="loadMore" class="load-more">
      <button class="btn btn-lg btn-outline-secondary" @click="getArticles">Carregar mais Artigos</button>
    </div>
  </div>
</template>

<script>
import { baseApiUrl } from "@/global";
import axios from "axios";
import PageTitle from "../template/PageTitle";
import ArticleItem from "./ArticleItem";
export default {
  name: "ArticlesByCategory",
  components: { PageTitle, ArticleItem },
  data: function() {
    return {
      category: {},
      articles: [],
      page: 1,
      loadMore: true
    };
  },
  methods: {
    getCategory() {
      const url = `${baseApiUrl}/categories/${this.category.id}`;
      axios(url).then(response => (this.category = response.data));
    },
    getArticles() {
      const url = `${baseApiUrl}/categories/${this.category.id}/articles?page=${this.page}`;
      axios(url).then(response => {
        this.articles = this.articles.concat(response.data);
        this.page++;
        if (response.data.length === 0) this.loadMore = false;
      });
    }
  },
  watch: {
    $route(to) {
      this.category.id = to.params.id;
      this.articles = [];
      this.page = 1;
      this.loadMore = true;

      this.getCategory();
      this.getArticles();
    }
  },
  mounted() {
    this.category.id = this.$route.params.id;
    this.getCategory();
    this.getArticles();
  }
};
</script>

<style>
.articles-by-category ul {
  list-style: none;
  padding: 0;
}

.articles-by-category .load-more {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 25px;
}
</style>