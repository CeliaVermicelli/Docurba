<template>
  <v-container class="py-0">
    <v-timeline dense align-top>
      <v-timeline-item v-for="(newsItem, i) in news" :key="`news-item-${i}`">
        <v-row class="pt-1">
          <v-col cosl="12" sm="3" md="2">
            {{ newsItem.date }}
          </v-col>
          <v-col cols="12" sm="9" md="10">
            <v-card>
              <v-card-title>
                {{ newsItem.titre }}
              </v-card-title>
              <v-card-text>
                <nuxt-content :document="newsItem" />
              </v-card-text>
              <v-card-actions v-if="newsItem.link">
                <v-btn block color="primary" :href="newsItem.link.href" target="_blank">
                  {{ newsItem.link.text }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-timeline-item>
    </v-timeline>
  </v-container>
</template>

<script>
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

export default {
  async asyncData ({ $content }) {
    const news = await $content('News', {
      deep: true
    }).fetch()

    return {
      news: news.filter(q => q.visible).sort((a, b) => {
        return +dayjs(b.date, 'DD/MM/YYYY') - +dayjs(a.date, 'DD/MM/YYYY')
      })
    }
  }
}
</script>
