<template>
	<div
		:class="[
			'flex items-center justify-between gap-x-4 p-2',
			{
				'!justify-end': !isShowSelectionCount
			}
		]"
	>
		<div
			v-if="isShowSelectionCount"
			class="hidden text-sm text-muted-foreground sm:block"
		>
			{{ selectionCount }} of {{ totalItems }} row(s) selected.
		</div>
		<div class="flex items-center justify-between gap-x-2">
			<div class="flex items-center justify-between gap-x-2 sm:gap-x-6">
				<p class="hidden text-sm font-medium sm:block">Rows per page</p>
				<Select
					:default-value="`${pageSize}`"
					:value="`${pageSize}`"
					@update:model-value="
						(value) => {
							handleChangePageSize(Number(value))
						}
					"
				>
					<SelectTrigger class="h-8 w-[70px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem
							v-for="item in pageSizeOptions"
							:key="item"
							:value="`${item}`"
						>
							{{ item }}
						</SelectItem>
					</SelectContent>
				</Select>

				<div class="text-sm font-medium">
					Page {{ pageNum }} of {{ totalPage }}
				</div>
				<div class="flex items-center space-x-2">
					<Button
						variant="outline"
						size="icon"
						class="hidden h-8 w-8 sm:flex"
						:disabled="pageNum < 2"
						@click="handleChangePageNum(1)"
					>
						<ChevronsLeft />
					</Button>
					<Button
						variant="outline"
						size="icon"
						class="h-8 w-8"
						:disabled="pageNum < 2"
						@click="handleChangePageNum(pageNum - 1)"
					>
						<ChevronLeft />
					</Button>
					<Button
						variant="outline"
						size="icon"
						class="h-8 w-8"
						:disabled="pageNum >= totalPage"
						@click="handleChangePageNum(pageNum + 1)"
					>
						<ChevronRight />
					</Button>
					<Button
						variant="outline"
						size="icon"
						class="hidden h-8 w-8 sm:flex"
						:disabled="pageNum >= totalPage"
						@click="handleChangePageNum(totalPage)"
					>
						<ChevronsRight />
					</Button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { Button } from '../button'
import {
	ChevronsLeft,
	ChevronsRight,
	ChevronLeft,
	ChevronRight
} from 'lucide-vue-next'
import { useVModel } from '@vueuse/core'

interface Props {
	pageSize: number
	pageNum: number
	totalItems: number
	pageSizeOptions?: number[]
	selectionCount?: number
}

const props = withDefaults(defineProps<Props>(), {
	pageSize: 10,
	pageNum: 0,
	totalItem: 0,
	pageSizeOptions: () => [10, 20, 30, 50]
})

const emits = defineEmits<{
	'update:pageSize': [pageSize: number]
	'update:pageNum': [pageNum: number]
}>()

const { $_ } = useNuxtApp()

const isShowSelectionCount = computed(() => !$_.isNil(props.selectionCount))

const totalPage = computed(() => Math.ceil(props.totalItems / props.pageSize))

const handleChangePageSize = (value: number) => {
	emits('update:pageSize', value)
}

const handleChangePageNum = (value: number) => {
	emits('update:pageNum', value)
}
</script>

<style scoped></style>
