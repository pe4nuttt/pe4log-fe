<template>
	<DropdownMenu>
		<DropdownMenuTrigger as-child>
			<Button variant="icon">
				<Ellipsis />
			</Button>
		</DropdownMenuTrigger>
		<DropdownMenuContent>
			<DropdownMenuGroup>
				<DropdownMenuItem
					class="flex items-center justify-between gap-2"
					@click="onClickEdit"
				>
					<span>Edit</span>
					<Pencil />
				</DropdownMenuItem>
				<DropdownMenuItem
					class="flex items-center justify-between gap-2 !text-destructive"
					@click="onClickDelete"
				>
					<span>Delete</span>
					<Trash class="text-destructive" />
				</DropdownMenuItem>
			</DropdownMenuGroup>
		</DropdownMenuContent>
	</DropdownMenu>
</template>

<script setup>
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Ellipsis, Trash, Pencil } from 'lucide-vue-next'

const props = defineProps({
	params: {
		type: Object,
		default: () => {}
	}
})

const onClickEdit = () => {
	props.params.context?.componentParent?.onClickCellEdit(props.params.data)
}

const onClickDelete = () => {
	props.params.context?.componentParent?.onClickCellDelete(props.params.data)
}

onMounted(() => {})
</script>

<style lang="scss" scoped></style>
