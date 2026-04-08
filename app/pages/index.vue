<template>
  <p class="flex items-center justify-center bg-gray-100 text-blue-500 text-2xl pt-4 font-bold">Drag Drop</p>
  <div class="flex gap-6 p-6 min-h-screen bg-gray-100">
    <!-- Columns -->
    <div
      v-for="(column, index) in listColumn"
      :key="column.id"
      class="flex-1 bg-gray-500 p-4 rounded-lg flex flex-col gap-4"
      @dragover.prevent
      @drop="drop(column.id)"
    >
      <h2 class="font-bold text-lg mb-2">{{ column.title }}</h2>

      <div
        v-for="item in column.items"
        :key="item.id"
        draggable="true"
        @dragstart="dragStart(item, column.id)"
        class="p-4 bg-white rounded-lg shadow cursor-move hover:shadow-lg transition"
      >
        {{ item.label }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Columns state
const listColumn = ref([
  {
    id: 'col1',
    title: 'Column 1',
    items: [
      { id: '1', label: 'Item 1' },
      { id: '2', label: 'Item 2' }
    ]
  },
  {
    id: 'col2',
    title: 'Column 2',
    items: []
  },
  {
    id: 'col3',
    title: 'Column 3',
    items: []
  },
   {
    id: 'col4',
    title: 'Column 4',
    items: []
  }
])

// Track currently dragged item and source column
let draggedItem = null
let sourceColumnId = null

const dragStart = (item, colId) => {
  draggedItem = item
  sourceColumnId = colId
}

const drop = (targetColumnId) => {
  if (!draggedItem || !sourceColumnId) return

  // Remove from source column
  const sourceCol = listColumn.value.find(c => c.id === sourceColumnId)
  sourceCol.items = sourceCol.items.filter(i => i.id !== draggedItem.id)

  // Add to target column
  const targetCol = listColumn.value.find(c => c.id === targetColumnId)
  targetCol.items.push(draggedItem)

  // Reset
  draggedItem = null
  sourceColumnId = null
}
</script>