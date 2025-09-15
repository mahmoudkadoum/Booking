<script setup lang="ts">
  const drawer = shallowRef(false)
  const route = useRoute()

  const items = [
    { text: 'Home', to: '#' },
    { text: 'Hotels', to: '/' },
  ]

  function isActive (to: string) {
    return route.path === to
  }
</script>

<template>
  <v-app-bar class="nav-bar bg-blue-darken-4 text-white" color="white">
    <template #prepend>
      <v-app-bar-nav-icon
        v-if="$vuetify.display.smAndDown"
        @click="drawer = !drawer"
      />
    </template>
    <div class="d-flex align-center w-100 nav-bar-content">
      <v-img
        class="me-sm-8"
        :max-width="$vuetify.display.mdAndUp ? 40 : 20"
        src="/Logo.svg"
        style="filter: brightness(0) invert(1);"
        transition="scroll-x-transition"
      />

      <template v-if="$vuetify.display.mdAndUp">
        <v-btn
          v-for="(item, i) in items"
          :key="i"
          :active="isActive(item.to)"
          class="me-2 text-none"
          slim
          :variant="isActive(item.to) ? 'text' : 'plain'"
          v-bind="item"
        />
      </template>

      <v-spacer />

      <v-btn
        class="me-2 text-none"
        slim
      >
        Login
      </v-btn>

      <v-btn slim>
        <p>
          Menu
          <span><v-icon color="white" icon="mdi-dots-vertical" /></span>
        </p>

        <v-menu activator="parent" origin="top">
          <v-list>
            <v-list-item link title="List your Apartment" />

            <v-list-item link title="List your Hotel" />
          </v-list>
        </v-menu>
      </v-btn>
    </div>
  </v-app-bar>

  <v-navigation-drawer
    v-if="$vuetify.display.smAndDown"
    v-model="drawer"
    location="top"
    temporary
    width="355"
  >
    <v-list class="py-0" slim>
      <v-list-item link prepend-icon="mdi-home-outline" title="Home" />

      <v-list-item link prepend-icon="mdi-office-building-marker-outline" title="Hotels" />
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>
.nav-bar-content {
  padding-inline: 128px;
}

@media (max-width: 960px) {
  .nav-bar-content {
    padding-inline: 8px;
  }
}

</style>
