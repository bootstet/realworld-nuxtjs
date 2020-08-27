<template>
  <div class="page">
    <div class="home-page">

      <div class="banner">
        <div class="container">
          <h1 class="logo-font">conduit</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>

      <div class="container page">
        <div class="row">

          <div class="col-md-9">
            <div class="feed-toggle">
              <ul class="nav nav-pills outline-active">
                <li v-if="user" class="nav-item">
                  <nuxt-link
                   class="nav-link" 
                   :class="{
                     active: tab === 'your_feed'
                   }"
                   exact
                   :to="{
                     name: 'home',
                     query: {
                       tab: 'your_feed'
                     }
                   }">
                    Your Feed
                  </nuxt-link>
                </li>
                <li class="nav-item">
                  <nuxt-link
                   class="nav-link" 
                   :class="{
                     active: tab === 'global_feed'
                   }"
                   exact
                   :to="{
                     name: 'home',
                   }">
                    Global Feed
                  </nuxt-link>
                </li>
                <li v-if="tag" class="nav-item">
                  <!-- <a class="nav-link active" href="">Global Feed</a> -->
                  <nuxt-link
                   class="nav-link" 
                   :class="{
                     active: tab === 'tag'
                   }"
                   exact
                   :to="{
                     name: 'home',
                     query: {
                       tab: 'tag',
                       tag: tag
                     }
                   }">
                    # {{ tag }}
                  </nuxt-link>
                </li>
              </ul>
            </div>

            <div 
              class="article-preview"
              v-for="article in articles"
              :key="article.slug"
              >
              <div class="article-meta">
                <nuxt-link 
                  :to="{
                    name: 'profile',
                    params: {
                      username: article.author.username
                    }
                  }"
                >
                  <img :src="article.author.image" />
                </nuxt-link>
                <div class="info">
                  <nuxt-link 
                    class="author"
                    :to="{
                      name: 'profile',
                      params: {
                        username: article.author.username
                      }
                    }"
                  >
                    {{ article.author.username }}
                  </nuxt-link>
                  <span class="date">{{ article.createdAt | date('MMM DD,YYYY') }}</span>
                </div>
                <button 
                  class="btn btn-outline-primary btn-sm pull-xs-right"
                  :class="{
                    active: article.favorited
                  }"
                  @click="onFavorite(article)"
                  :disabled="article.favoriteDisables"
                  >
                  <i class="ion-heart"></i> {{ article.favoritesCount }}
                </button>
              </div>
              <nuxt-link :to="{
                name: 'article',
                params: {
                  slug: article.slug
                }
              }" class="preview-link">
                <h1>{{ article.title }}</h1>
                <p>{{ article.description }}</p>
                <span>Read more...</span>
              </nuxt-link>
            </div>

            <!-- 分页列表 -->
            <nav>
              <ul class="pagination">
                <li 
                  class="page-item" 
                  :class="{
                    active: item === page
                  }"
                  v-for="item in totalPage"
                  :key="item"
                  >
                  <!-- <a class="page-link" :href="'/?page=' + item ">{{ item }}</a> -->
                  <!-- 单页面应用，参数改变，页面不会变化，页面不会加载 -->
                  <!-- 监听 query 参数改变 -->
                  <nuxt-link
                    class="page-link"
                    :to="{
                      name: 'home',
                      query: {
                        page: item,
                        tag: $route.query.tag,
                        tab
                      }
                    }"
                  >
                    {{ item }}
                  </nuxt-link>
                </li>
              </ul>
            </nav>
            <!-- 分页列表 /-->
          </div>

          <div class="col-md-3">
            <div class="sidebar">
              <p>Popular Tags</p>
              <div class="tag-list">
                <nuxt-link
                  v-for="item in tags"
                  :key="item"
                  href="" 
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'tag',
                      tag: item,
                    }
                  }"
                  class="tag-pill tag-default">
                  {{ item }}
                  </nuxt-link>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { getArticles, getYourFeedArticles, addFavorite, deleteFavorite  } from '@/api/article'
import { getTags } from '@/api/tag'
import { mapState } from 'vuex'
export default {
  name: 'home',
  async asyncData({ query }) {
    const page = Number.parseInt(query.page || 1)
    const limit = 20
    const tab = query.tab || 'global_feed'
    const tag = query.tag
    const loadArticles = tab === 'global_feed'
      ? getArticles
      : getYourFeedArticles

    // 两者没有依赖关系，并行，提高加载速度
    // const { data } = await getArticles({
    //   limit,
    //   offset: (page - 1) * limit
    // })
    // const { data: tagData } = await getTags()
    const [ articleRes, tagRes ] = await Promise.all([
      loadArticles({
        limit,
        offset: (page - 1) * limit,
        tag
      }),
      getTags()
    ])
    const { articles, articlesCount } = articleRes.data
    const { tags } =  tagRes.data
    console.log(articles,'....', articlesCount)

    articles.forEach(article => article.favoriteDisables = false)

    return {
      articles,
      articlesCount,
      limit,
      page,
      tags,
      tab,  // 选项卡
      tag   // 数据标签
    }
  },
  watchQuery: ['page', 'tag', 'tab'],
  computed: {
    ...mapState(['user']),
    totalPage () {
      return Math.ceil(this.articlesCount / this.limit)
    }
  },
  methods: {
    async onFavorite (article) {
      article.favoriteDisables = true
      if (article.favorited) {
        // 取消点赞
        await deleteFavorite(article.slug)
        article.favorited = false
        article.favoritesCount += -1
      } else {
        // 添加点赞
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount += 1
      }
      article.favoriteDisables = false
    }
  }
};
</script>

<style scoped lang="scss">
</style>
