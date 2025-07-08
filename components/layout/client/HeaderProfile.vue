<template>
	<div>
		<DropdownMenu>
			<DropdownMenuTrigger class="flex items-center justify-center">
				<Avatar class="h-8 w-8">
					<AvatarImage :src="user?.profilePicture ?? ''" alt="@unovue" />
					<AvatarFallback>
						{{ getNameShorthand(`${user?.firstName} ${user?.lastName}`) }}
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				class="z-[1000] min-w-52 max-w-72"
				side="bottom"
				align="end"
			>
				<DropdownMenuLabel class="space-y-1">
					{{ `${user?.firstName} ${user?.lastName}`.trim() }}
					<p class="text-xs font-normal leading-none text-muted-foreground">
						{{ user?.email }}
					</p>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem>Profile</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem @click="handleLogOut">
					<span class="font-semibold">Log out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	</div>
</template>

<script setup lang="ts">
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const userStore = useUserStore()
const { logout } = useAuth()

const { user } = storeToRefs(userStore)

const handleLogOut = () => {
	logout()
}
</script>

<style scoped></style>
