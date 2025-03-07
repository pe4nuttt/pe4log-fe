<template>
	<div class="p-4">
		<div class="space-y-3">
			<ClientOnly>
				<div>
					<Label for="color-mode">Color Mode: {{ $colorMode.value }}</Label>
					<Select v-model="$colorMode.preference">
						<SelectTrigger id="color-mode" name="color-mode" class="w-[280px]">
							<SelectValue placeholder="Select a color mode" />
						</SelectTrigger>
						<SelectContent>
							<SelectContent>
								<SelectItem value="system">System</SelectItem>
								<SelectItem value="light">Light</SelectItem>
								<SelectItem value="dark">Dark</SelectItem>
								<SelectItem value="sepia">Sepia</SelectItem>
							</SelectContent>
						</SelectContent>
					</Select>
				</div>
			</ClientOnly>

			<div>
				<Label html-for="timezone-select" for="timezone-select">Timezone</Label>
				<Select>
					<SelectTrigger
						id="timezone-select"
						name="timezone-select"
						class="w-[280px]"
					>
						<SelectValue placeholder="Select a timezone" />
					</SelectTrigger>
					<SelectContent>
						<template v-for="group in timezones" :key="group.label">
							<SelectGroup>
								<SelectLabel>{{ group.label }}</SelectLabel>
								<SelectItem
									v-for="item in group.items"
									:key="item.value"
									:value="item.value"
								>
									{{ item.label }}
								</SelectItem>
							</SelectGroup>
						</template>
					</SelectContent>
				</Select>
			</div>
		</div>

		<div>
			<GridVx
				:loading="true"
				:row-data="rowData"
				:columns="colDefs"
				:dom-layout="'normal'"
				:style="{ height: '500px' }"
				@row-clicked="
					(data: IRow[]) => {
						console.log(data)
					}
				"
				@grid-ready="console.log('GRID READY')"
				@sort-changed="
					(event) => {
						console.log(event)
					}
				"
			/>
			<TablePagination
				v-model:page-num="pageNum"
				v-model:page-size="pageSize"
				:total-items="100"
				:selection-count="3"
			/>
		</div>

		<Button @click="openDrawer = true">Open Drawer</Button>
		<Drawer v-model:open="openDrawer">
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Are you absolutely sure?</DrawerTitle>
					<DrawerDescription>This action cannot be undone.</DrawerDescription>
				</DrawerHeader>
				<DrawerFooter>
					<Button>Submit</Button>
					<DrawerClose>
						<Button variant="outline">Cancel</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
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
import { Label } from '@/components/ui/label'
import { GridVx } from '~/components/ui/grid-vx'
import type { ColDef } from 'ag-grid-community'
import { TablePagination } from '~/components/ui/table-pagination'
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger
} from '@/components/ui/drawer'

const colorMode = useColorMode()
const pageNum = ref(1)
const pageSize = ref(10)

//Options
const timezones = [
	{
		label: 'North America',
		items: [
			{ value: 'est', label: 'Eastern Standard Time (EST)' },
			{ value: 'cst', label: 'Central Standard Time (CST)' },
			{ value: 'mst', label: 'Mountain Standard Time (MST)' },
			{ value: 'pst', label: 'Pacific Standard Time (PST)' },
			{ value: 'akst', label: 'Alaska Standard Time (AKST)' },
			{ value: 'hst', label: 'Hawaii Standard Time (HST)' }
		]
	},
	{
		label: 'Europe & Africa',
		items: [
			{ value: 'gmt', label: 'Greenwich Mean Time (GMT)' },
			{ value: 'cet', label: 'Central European Time (CET)' },
			{ value: 'eet', label: 'Eastern European Time (EET)' },
			{ value: 'west', label: 'Western European Summer Time (WEST)' },
			{ value: 'cat', label: 'Central Africa Time (CAT)' },
			{ value: 'eat', label: 'East Africa Time (EAT)' }
		]
	},
	{
		label: 'Asia',
		items: [
			{ value: 'msk', label: 'Moscow Time (MSK)' },
			{ value: 'ist', label: 'India Standard Time (IST)' },
			{ value: 'cst_china', label: 'China Standard Time (CST)' },
			{ value: 'jst', label: 'Japan Standard Time (JST)' },
			{ value: 'kst', label: 'Korea Standard Time (KST)' },
			{
				value: 'ist_indonesia',
				label: 'Indonesia Central Standard Time (WITA)'
			}
		]
	},
	{
		label: 'Australia & Pacific',
		items: [
			{ value: 'awst', label: 'Australian Western Standard Time (AWST)' },
			{ value: 'acst', label: 'Australian Central Standard Time (ACST)' },
			{ value: 'aest', label: 'Australian Eastern Standard Time (AEST)' },
			{ value: 'nzst', label: 'New Zealand Standard Time (NZST)' },
			{ value: 'fjt', label: 'Fiji Time (FJT)' }
		]
	},
	{
		label: 'South America',
		items: [
			{ value: 'art', label: 'Argentina Time (ART)' },
			{ value: 'bot', label: 'Bolivia Time (BOT)' },
			{ value: 'brt', label: 'Brasilia Time (BRT)' },
			{ value: 'clt', label: 'Chile Standard Time (CLT)' }
		]
	}
]
// Row Data Interface
interface IRow {
	make: string
	model: string
	price: number
	electric: boolean
}

const rowData = ref<IRow[]>([
	{
		make: 'Tesla',
		model: 'Model Y',
		price: 64950,
		electric: true
	},
	{ make: 'Ford', model: 'F-Series', price: 33850, electric: false },
	{ make: 'Toyota', model: 'Corolla', price: 29600, electric: false },
	{ make: 'Mercedes', model: 'EQA', price: 48890, electric: true },
	{ make: 'Fiat', model: '500', price: 15774, electric: false },
	{ make: 'Nissan', model: 'Juke', price: 20675, electric: false },
	{ make: 'Nissan', model: 'Juke', price: 20675, electric: false },
	{ make: 'Nissan', model: 'Juke', price: 20675, electric: false },
	{ make: 'Nissan', model: 'Juke', price: 20675, electric: false },
	{ make: 'Nissan', model: 'Juke', price: 20675, electric: false },
	{ make: 'Nissan', model: 'Juke', price: 20675, electric: false },
	{ make: 'Nissan', model: 'Juke', price: 20675, electric: false },
	{ make: 'Nissan', model: 'Juke', price: 20675, electric: false },
	{ make: 'Nissan', model: 'Juke', price: 20675, electric: false },
	{ make: 'Nissan', model: 'Juke', price: 20675, electric: false },
	{ make: 'Nissan', model: 'Juke', price: 20675, electric: false },
	{ make: 'Nissan', model: 'Juke', price: 20675, electric: false },
	{ make: 'Nissan', model: 'Juke', price: 20675, electric: false },
	{ make: 'Nissan', model: 'Juke', price: 20675, electric: false },
	{ make: 'Nissan', model: 'Juke', price: 20675, electric: false }
])

const openDrawer = ref(true)

const colDefs = ref<ColDef<IRow>[]>([
	{ field: 'make', width: 300, minWidth: 150 },
	{ field: 'model', minWidth: 200, width: 500 },
	{ field: 'price', minWidth: 100, width: 800 },
	{ field: 'electric', minWidth: 200, width: 400 }
])
</script>

<style scoped></style>
