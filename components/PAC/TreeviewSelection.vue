<template>
  <v-treeview
    v-model="selectedSections"
    hoverable
    open-on-click
    selectable
    :items="PACroots"
    item-text="titre"
    class="d-block text-truncate"
    item-key="path"
  />
</template>

<script>
import pacContent from '@/mixins/pacContent.js'

export default {
  mixins: [pacContent],
  props: {
    value: {
      type: Array,
      default () { return [] }
    }
  },
  data () {
    return {
      selectedSections: this.value.length ? this.value : this.pacData.map(s => s.path)
    }
  },
  computed: {
    PACroots () {
      const roots = this.PAC.filter(section => section.depth === 2).sort((sa, sb) => {
        return sa.ordre - sb.ordre
      })

      return roots
    }
  },
  watch: {
    selectedSections () {
      const selection = []

      this.PAC.forEach((section) => {
        if (section.children) {
          const selectedChildren = section.children.find((c) => {
            return this.selectedSections.includes(c.path)
          })

          if (selectedChildren) {
            selection.push(section.path)
          }
        }
      })

      this.$emit('input', selection.concat(this.selectedSections))
    }
  }
}
</script>
