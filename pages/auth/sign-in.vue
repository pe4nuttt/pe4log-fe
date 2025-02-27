<template>
	<div class="flex h-full min-h-[691px] flex-col items-center justify-center">
		<div
			class="absolute top-[calc(50%-420px)] [@media(max-height:691px)]:top-[-72px]"
		>
			<ClientOnly>
				<AuthLogo class="scale-50" />
			</ClientOnly>
		</div>
		<h2 class="mb-2 text-3xl font-semibold leading-9">Welcome</h2>

		<!-- Description -->
		<div
			class="mx-auto mb-5 w-80 text-center text-xs font-medium text-muted-foreground"
		>
			Welcome to my little corner of the internet. Here, I share my journey,
			ideas, and the things that inspire me.
		</div>

		<Card class="mb-[-60px] w-[360px] bg-black/20">
			<SocialLogin />

			<CardContent>
				<Separator class="mb-6" label="Or" />
				<form
					class="flex w-full flex-col space-y-6 sm:justify-center"
					@submit.prevent="onSubmit"
				>
					<FormField v-slot="{ componentField }" name="email">
						<FormItem>
							<FormControl>
								<Input
									type="text"
									placeholder="Email"
									v-bind="componentField"
									class="h-9 text-xs"
								/>
							</FormControl>
							<FormMessage class="text-xs" />
						</FormItem>
					</FormField>
					<FormField v-slot="{ componentField }" name="password">
						<FormItem>
							<FormControl>
								<Input
									type="password"
									placeholder="Password"
									v-bind="componentField"
									class="h-9 text-xs"
								/>
							</FormControl>
							<FormMessage class="text-xs" />
						</FormItem>
					</FormField>
					<Button type="submit" :disabled="isLoggingIn">
						<Loader v-if="isLoggingIn" />
						<span>Log in</span>
					</Button>
				</form>
			</CardContent>
		</Card>
	</div>
</template>

<script setup lang="ts">
import AuthLogo from '~/components/auth/AuthLogo.vue'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import SocialLogin from '~/components/auth/SocialLogin.vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { LoginFormSchema } from '~/schemas'
import type { z } from 'zod'
import Loader from '~/components/global/Loader.vue'
import { EUserRole } from '~/types'

definePageMeta({
	layout: 'auth',
	middleware: ['auth']
})

const { login, isLoggingIn } = useAuth()
const userStore = useUserStore()

const formSchema = toTypedSchema(LoginFormSchema)

const {
	values: formData,
	errors,
	isSubmitting,
	handleSubmit
} = useForm<z.infer<typeof LoginFormSchema>>({
	validationSchema: formSchema,
	initialValues: {
		email: '',
		password: ''
	}
})

// Methods
const onSubmit = handleSubmit(async (values) => {
	const loginResponse = await login(values)

	const userRes = loginResponse?.data.user

	if (userRes?.role === EUserRole.ADMIN) {
		navigateTo('/admin/dashboard')
	} else if (userRes?.role === EUserRole.USER) {
		navigateTo('/')
	}
})
</script>

<style scoped></style>
