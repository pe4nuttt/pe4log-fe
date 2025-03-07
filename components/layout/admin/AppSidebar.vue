<template>
	<Sidebar collapsible="icon" variant="floating">
		<SidebarContent>
			<SidebarGroup v-for="group in sidebarGroups" :key="group.title">
				<SidebarGroupLabel>{{ group.title }}</SidebarGroupLabel>
				<SidebarGroupContent>
					<SidebarMenu>
						<SidebarMenuItem v-for="item in group.items" :key="item.title">
							<SidebarMenuButton asChild>
								<a :href="item.url">
									<component :is="item.icon" />
									<span>{{ item.title }}</span>
								</a>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>
		</SidebarContent>
	</Sidebar>
</template>

<script setup lang="ts">
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem
} from '@/components/ui/sidebar'
import { Calendar, Home, Inbox, Search, Settings } from 'lucide-vue-next'

const sidebarGroups = [
	{
		title: 'General',
		items: [
			{
				title: 'Dashboard',
				url: '/admin/dashboard',
				icon: Home
			},
			{
				title: 'Posts',
				url: '/admin/posts',
				icon: Inbox
			},
			{
				title: 'Categories',
				url: '/admin/categories',
				icon: Calendar
			},
			{
				title: 'Tags',
				url: '/admin/tags',
				icon: Calendar
			},
			{
				title: 'Users',
				url: '/admin/users',
				icon: Search
			}
		]
	},
	{
		title: 'Others',
		items: [
			{
				title: 'Settings',
				url: '#',
				icon: Settings
			}
		]
	}
]
</script>

<style scoped></style>
