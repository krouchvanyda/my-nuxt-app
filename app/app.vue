
<script setup>
import { useCounterStore } from './stores/counter'

const counter = useCounterStore()

counter.count++
// with autocompletion ✨
counter.$patch({ count: counter.count + 1 })
// or using an action instead
counter.increment()
</script>
<template>
    <NuxtLayout>
      <AppHeader />
      <NuxtPage />
      <AppFooter />
    </NuxtLayout>
  <!-- <div>
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
      <AppHeader />
    <NuxtPage />
    <AppFooter />
    <NuxtRouteAnnouncer />
    <NuxtWelcome />
  </div> -->
</template>
