<template>
	<!-- <div class="h-full w-full"> -->
	<ag-grid-vue
		style="width: 100%; height: 100%"
		:theme="myTheme"
		:column-defs="getColumns"
		:loading-overlay-component="loadingOverlayComponent"
		:loading-overlay-component-params="loadingOverlayComponentParams"
		v-bind="props"
		@grid-ready="onGridReady"
		@row-clicked="onRowClicked"
		@sort-changed="onSortChanged"
	></ag-grid-vue>
	<!-- </div> -->
</template>

<script setup lang="ts">
import { AgGridVue } from 'ag-grid-vue3'
import type {
	ColDef,
	GridOptions,
	GridReadyEvent,
	RowClickedEvent,
	GridApi,
	SortChangedEvent
} from 'ag-grid-community'
import {
	themeQuartz,
	colorSchemeDark,
	colorSchemeLight
} from 'ag-grid-community'
import { useDebounceFn } from '@vueuse/core'
import { useSidebar } from '../sidebar'
import type { EOrder } from '~/types'
import CustomLoadingOverlay from './CustomLoadingOverlay.vue'

interface Props
	extends Partial<
		Omit<
			GridOptions,
			| 'columnDefs'
			| 'theme'
			| 'onGridReady'
			| 'onRowClicked'
			| 'onSortChanged'
			| 'loadingOverlayComponent'
			| 'loadingOverlayComponentParams'
		>
	> {
	columns: GridOptions['columnDefs']
	disabledSortable?: boolean
	autoSizeCell?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	defaultColDef: () => ({
		suppressMovable: true,
		resizable: false,
		sortable: true,
		showDisabledCheckboxes: true,
		suppressSizeToFit: false
	}),
	pagination: false,
	suppressCellFocus: false,
	// suppressRowTransform: false,
	rowSelection: 'multiple',
	headerHeight: 40,
	domLayout: 'autoHeight',
	suppressRowClickSelection: false,
	autoSizeCell: true

	// rowHeight: 80
})

const emit = defineEmits<{
	(event: 'gridReady', value: GridReadyEvent): void
	(event: 'rowClicked', value: any[]): void
	(
		event: 'sortChanged',
		value: {
			sortBy?: string | null
			order?: EOrder | null
		}
	): void
}>()

const colorMode = useColorMode()
// const { state: sidebarState } = useSidebar()

const gridApi = ref<GridApi | null>()

const myTheme = themeQuartz.withPart(colorSchemeDark).withParams({
	accentColor: '#FAFAFA',
	backgroundColor: '#09090B',
	borderColor: '#27272A',
	browserColorScheme: 'dark',
	chromeBackgroundColor: {
		ref: 'foregroundColor',
		mix: 0.07,
		onto: 'backgroundColor'
	},
	fontFamily: {
		googleFont: 'Inter'
	},
	foregroundColor: '#FAFAFA',
	headerFontSize: 14
})

const loadingOverlayComponent = ref(CustomLoadingOverlay)
const loadingOverlayComponentParams = ref({
	loadingMessage: 'One moment please...'
})

// Methods
const onGridReady = (event: GridReadyEvent) => {
	gridApi.value = event.api

	if (props.autoSizeCell) event.api.sizeColumnsToFit()
	emit('gridReady', event)
}

const onRowClicked = (event: RowClickedEvent) => {
	const selectedRows = event.api.getSelectedRows()

	emit('rowClicked', selectedRows)
}

const onSortChanged = (event: SortChangedEvent) => {
	let sortBy: any = null
	let order: any = null

	event.api.getColumnState().forEach((c) => {
		if (c.sort !== null) {
			sortBy = c.colId
			order = c.sort as EOrder
		}
	})

	emit('sortChanged', {
		sortBy,
		order
	})
}

const deviceResizeCheck = useDebounceFn(() => {
	if (gridApi.value?.sizeColumnsToFit && props.autoSizeCell)
		gridApi.value.sizeColumnsToFit()
}, 300)

watch(
	colorMode,
	(newColorMode) => {
		if (document?.body) document.body.dataset.agThemeMode = newColorMode.value
	},
	{
		immediate: true
	}
)

// watch(sidebarState, () => {
// 	deviceResizeCheck()
// })

// Computed
const getColumns = computed(() => {
	const disabled = props.disabledSortable
	if (disabled === null) {
		return props.columns
	} else {
		return props.columns?.map((c) => ({
			...c,
			comparator: () => {
				return 0
			}
		}))
	}
})

onMounted(() => {
	window.addEventListener('resize', deviceResizeCheck)
})

onUnmounted(() => {
	window.removeEventListener('resize', deviceResizeCheck)
})
</script>

<style scoped></style>
