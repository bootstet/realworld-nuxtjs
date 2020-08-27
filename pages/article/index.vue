<template>
  <div class="article-page">

  <div class="banner">
    <div class="container">
      <article-meta :article="article"/>
      

    </div>
  </div>

  <div class="container page">

    <div class="row article-content">
      <div class="col-md-12" v-html="article.body">
        <!-- {{ article.body }} -->
        <!-- <p>
        Web development technologies have evolved at an incredible clip over the past few years.
        </p>
        <h2 id="introducing-ionic">Introducing RealWorld.</h2>
        <p>It's a great solution for learning how other frameworks work.</p> -->
      </div>
    </div>

    <hr />

    <div class="article-actions">
      <article-meta :article="article"/>
    </div>

    <div class="row">

      <div class="col-xs-12 col-md-8 offset-md-2">

        <article-comment/>
        
      </div>

    </div>

  </div>

</div>
</template>

<script type="text/ecmascript-6">
import { getArticle } from '@/api/article'
import MarkdownIt from 'markdown-it'
import ArticleMeta from './components/article-metail'
import ArticleComment from './components/article-comment'
export default {
  name: 'ArticleIndex',
  async asyncData({ params }) {
    const { data } = await getArticle(params.slug)
    const { article } = data
    const md = new MarkdownIt()
    article.body = md.render(article.body)
    return {
      article
    }
  },
  data() {
    return {};
  },
  components: {
    ArticleMeta,
    ArticleComment
  },
  head() {
    return {
      title: `${this.article.title} - RealWorld`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.article.description
        }
      ]
    }
  }
};
</script>

<style scoped lang="scss">
</style>
