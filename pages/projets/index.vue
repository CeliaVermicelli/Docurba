<template>
  <LayoutsCustomApp private extended-app-bar>
    <template #headerExtension>
      <v-tabs show-arrows>
        <v-tab
          :to="{path: '/projets'}"
          nuxt
        >
          Projets
        </v-tab>
        <v-tab
          :to="{path: '/projets/trames'}"
          nuxt
        >
          Trame du PAC
        </v-tab>
      </v-tabs>
      <v-spacer />
      <v-btn
        href="https://docs.google.com/document/d/1DMVFON6OUSaOomhoUnvHY5uHNkiVMTJlJ_dMpu9auv8/edit"
        target="_blank"
        text
      >
        Guide d'utilisation
      </v-btn>
    </template>
    <v-container v-if="projectListLoaded">
      <v-row>
        <v-col cols="12">
          <!-- <v-toolbar flat> -->
          <v-text-field v-model="search" filled hide-details placeholder="Recherchez un projet" />
          <!-- </v-toolbar> -->
        </v-col>
      </v-row>
      <v-row class="mt-0">
        <v-col>
          <h3 class="text-h3">
            Vos projets
          </h3>
        </v-col>
        <v-col
          v-for="project in filteredProjects"
          :key="`${project.id}-owned`"
          cols="12"
        >
          <ProjectsDashboardCard :project="project" />
        </v-col>
        <v-col>
          <h3 class="text-h3">
            Projets partagés avec vous
          </h3>
        </v-col>
        <v-col
          v-for="sharing in filteredSharings"
          :key="`${sharing.project.id}-shared`"
          cols="12"
        >
          <ProjectsDashboardCard :project="sharing.project" :sharing="sharing" />
        </v-col>
      </v-row>
    </v-container>
    <VGlobalLoader v-else />
    <v-dialog width="500px">
      <template #activator="{on}">
        <v-btn
          fixed
          bottom
          right
          fab
          color="primary"
          v-on="on"
        >
          <v-icon>{{ icons.mdiPlus }}</v-icon>
        </v-btn>
      </template>
      <template #default="dialog">
        <ProjectsProjectCardForm @cancel="dialog.value = false">
          <template #titre>
            Creer un projet
          </template>
        </ProjectsProjectCardForm>
      </template>
    </v-dialog>
  </LayoutsCustomApp>
</template>

<script>
import { mdiPlus, mdiFileDocumentEdit, mdiHelp } from '@mdi/js'
import projectsList from '@/mixins/projectsList.js'

export default {
  mixins: [projectsList],
  layout: 'app',
  data () {
    return {
      icons: {
        mdiPlus,
        mdiFileDocumentEdit,
        mdiHelp
      },
      projectsSubscription: null
    }
  },
  // computed: {
  //   allProjectsIds () {
  //     const projectsIds = this.projects.map(p => p.id)
  //     const sharedProjectsIds = this.sharedProjects.map(p => p.id)

  //     return projectsIds.concat(sharedProjectsIds)
  //   }
  // },
  watch: {
    projectListLoaded () {
      if (this.projectListLoaded) {
        // const projectsIds = this.projects.map(p => p.id)

        this.projectsSubscription = this.$supabase
          .from(`projects:owner=eq.${this.$user.id}`)
          .on('UPDATE', (payload) => {
            const updatedProject = payload.new

            if (updatedProject.archived) {
              const projectIndex = this.projects.findIndex(p => p.id === updatedProject.id)
              this.projects.splice(projectIndex, 1)
            }
          })
          .subscribe()
      }
    }
  },
  beforeDestroy () {
    if (this.projectsSubscription) {
      this.$supabase.removeSubscription(this.projectsSubscription)
    }
  }
}
</script>
