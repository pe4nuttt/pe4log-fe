<template>
	<div class="p-4">
		<div class="space-y-3">
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

const colorMode = useColorMode()

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

console.log(colorMode.preference)
</script>

<style scoped></style>
