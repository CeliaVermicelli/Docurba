import { uniq, flatten, omitBy, isNil } from 'lodash'

// @vue/component
export default {
  methods: {
    async fetchSections (table, match) {
      const { data: sections } = await this.$supabase.from(table).select('*').match(match)

      return sections
    },
    getSectionsFromPACs (PACs, path) {
      const sections = []

      PACs.forEach((PAC) => {
        const section = PAC.find(s => s.path === path)
        sections.push(section || {})
      })

      return sections
    },
    // PACs should be in order. PACs[0] will override data in PACs[1]
    unifyPacs (PACs, paths) {
      paths = paths || uniq(flatten(PACs).map(s => s.path))

      return paths.map((path) => {
        const sections = this.getSectionsFromPACs(PACs, path).map((section) => {
          return omitBy(section, isNil)
        }).reverse()

        const textEdited = sections.reduce((nbEdit, section) => {
          return nbEdit + !!section.text
        }, 0)

        return Object.assign({ textEdited: textEdited > 1 }, ...sections)
      })
    },
    // Update should be a BDD update from supabase realtime event.
    spliceSection (PAC, update) {
      // This should be able to handle Create, Update and Delete from a PAC.
      if (update.eventType === 'DELETE' && update.old) {
        const deleteIndex = PAC.findIndex(s => s.id === update.old.id)
        PAC.splice(deleteIndex, 1)
      } else if (update.new) {
        const section = update.new
        const newIndex = PAC.findIndex(s => s.path === section.path)

        const cleanSection = Object.assign({
          textEdited: !!section.text
        }, omitBy(section, isNil))

        if (newIndex >= 0) {
          PAC.splice(newIndex, 1, Object.assign({}, PAC[newIndex], cleanSection))
        } else {
          PAC.push(cleanSection)
        }
      }
    }
  }
}
