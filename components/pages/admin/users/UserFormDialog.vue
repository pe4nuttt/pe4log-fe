<template>
	<Sheet v-model:open="open">
		<SheetContent class="flex w-[400px] flex-col sm:w-[480px] sm:max-w-none">
			<SheetHeader>
				<SheetTitle>
					{{ type === EEntityFormType.ADD ? 'Add User' : 'Edit User' }}
				</SheetTitle>
				<SheetDescription>
					{{ type === EEntityFormType.ADD ? 'Add a new user' : 'Edit user' }}
					by providing necessary info. Click save when you're done.
				</SheetDescription>
			</SheetHeader>
			<form
				class="mb-4 mr-[-1rem] flex-1 space-y-5 overflow-y-auto pl-[1px] pr-4"
			>
				<div class="flex flex-wrap items-center justify-between gap-2">
					<UploadImage
						class="h-fit w-fit"
						:image-url="
							img(
								formData.profilePicture ?? '',
								{},
								{
									provider: 'cloudinary'
								}
							)
						"
						:loading="isUploadingProfilePicture"
						@change="onChangeProfilePicture"
					>
						<template #default="slotProps">
							<Avatar
								ref="avatarRef"
								class="h-24 w-24"
								@click="slotProps.onClickImage"
							>
								<AvatarImage
									:src="slotProps.imageUrl ?? ''"
									alt="user-avatar"
								/>
								<AvatarFallback>
									{{ getNameShorthand(`${user?.firstName} ${user?.lastName}`) }}
								</AvatarFallback>
							</Avatar>
						</template>
					</UploadImage>
					<div class="flex items-center gap-2">
						<Button type="button" size="sm" @click="onClickUploadAvatar">
							Upload new photo
						</Button>
						<Button
							type="button"
							size="sm"
							variant="destructive"
							@click="onClickDeleteAvatar"
						>
							Delete
						</Button>
					</div>
				</div>
				<FormField
					v-slot="{ componentField }"
					name="email"
					:validate-on-blur="!isFieldDirty"
				>
					<FormItem>
						<FormLabel class="required">Email</FormLabel>
						<FormControl>
							<Input
								:readonly="type === EEntityFormType.EDIT"
								type="text"
								placeholder="Email"
								v-bind="componentField"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
				<FormField
					v-slot="{ componentField }"
					name="username"
					:validate-on-blur="!isFieldDirty"
				>
					<FormItem>
						<FormLabel class="required">Username</FormLabel>
						<FormControl>
							<Input
								type="text"
								placeholder="Username"
								v-bind="componentField"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
				<div class="grid grid-cols-2 gap-x-2 gap-y-5">
					<FormField v-slot="{ componentField }" name="firstName">
						<FormItem>
							<FormLabel class="required">First Name</FormLabel>
							<FormControl>
								<Input
									type="text"
									placeholder="First name"
									v-bind="componentField"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					</FormField>
					<FormField v-slot="{ componentField }" name="lastName">
						<FormItem>
							<FormLabel class="required">Last Name</FormLabel>
							<FormControl>
								<Input
									type="text"
									placeholder="Last Name"
									v-bind="componentField"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					</FormField>
					<FormField v-slot="{ componentField }" name="role">
						<FormItem>
							<FormLabel class="required">Role</FormLabel>
							<FormControl>
								<Select v-bind="componentField">
									<SelectTrigger id="role" name="role">
										<SelectValue placeholder="Select role" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem
											v-for="item in USER_ROLE_OPTIONS"
											:key="item.value"
											:value="item.value"
										>
											{{ item.label }}
										</SelectItem>
									</SelectContent>
								</Select>
							</FormControl>
							<FormMessage />
						</FormItem>
					</FormField>
					<FormField v-slot="{ value }" name="status">
						<FormItem>
							<FormLabel class="required">Status</FormLabel>
							<FormControl>
								<div
									class="flex h-9 items-center justify-between space-x-2 rounded-lg border px-2"
								>
									<Label for="status" class="!font-normal">Active user</Label>
									<Switch
										id="status"
										:model-value="value === EUserStatus.ACTIVE"
										@update:model-value="
											(value) =>
												setFieldValue(
													'status',
													value ? EUserStatus.ACTIVE : EUserStatus.INACTIVE
												)
										"
									/>
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					</FormField>
				</div>
				<FormField v-slot="{ componentField }" name="password">
					<FormItem>
						<FormLabel
							:class="{
								required: type == EEntityFormType.ADD
							}"
						>
							Password
						</FormLabel>
						<FormControl>
							<Input
								type="password"
								placeholder="Password"
								v-bind="componentField"
								autocomplete="new-password"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
				<FormField v-slot="{ componentField }" name="confirmPassword">
					<FormItem>
						<FormLabel
							:class="{
								required: type == EEntityFormType.ADD
							}"
						>
							Confirm password
						</FormLabel>
						<FormControl>
							<Input
								type="password"
								placeholder="Confirm password"
								v-bind="componentField"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
			</form>
			<SheetFooter>
				<SheetClose as-child>
					<Button variant="outline">Close</Button>
				</SheetClose>
				<Button type="submit" @click="onSubmit">Save changes</Button>
			</SheetFooter>
		</SheetContent>
	</Sheet>
</template>

<script setup lang="ts">
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetFooter,
	SheetTrigger
} from '@/components/ui/sheet'
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toTypedSchema } from '@vee-validate/zod'
import { useVModel } from '@vueuse/core'
import { useForm } from 'vee-validate'
import type { z } from 'zod'
import { AddUserSchema } from '~/schemas'
import { EEntityFormType, EUserRole, EUserStatus, type IUser } from '~/types'
import { Switch } from '~/components/ui/switch'
import { UploadImage } from '~/components/ui/upload'
import { USER_ROLE_OPTIONS } from '~/utils/constants'

const props = withDefaults(
	defineProps<{
		open?: boolean
		user?: IUser | null
		type: EEntityFormType
	}>(),
	{
		type: EEntityFormType.ADD
	}
)

const emits = defineEmits<{
	'update:open': [open: boolean]
	saveSuccess: []
	refreshList: []
}>()

const { $api } = useNuxtApp()
const { toastSuccess, toastError } = useAppToast()
const img = useImage()

const open = useVModel(props, 'open', emits) as Ref<boolean>

const formSchema = toTypedSchema(AddUserSchema)

const {
	values: formData,
	errors,
	isSubmitting,
	handleSubmit,
	setFieldValue,
	setValues,
	isFieldDirty,
	resetForm
} = useForm<z.infer<typeof AddUserSchema>>({
	validationSchema: formSchema,
	initialValues: {
		email: '',
		username: '',
		firstName: '',
		lastName: '',
		password: null,
		confirmPassword: null,
		role: EUserRole.USER,
		status: EUserStatus.ACTIVE,
		profilePicture: null
	}
})
const isUploadingProfilePicture = ref(false)
const avatarRef = ref()

watch(
	[open, props.type, () => props.user],
	() => {
		if (open && props.type === EEntityFormType.EDIT && props.user) {
			setValues({
				...props.user,
				email: props.user.email,
				firstName: props.user.firstName,
				lastName: props.user.lastName,
				role: props.user.role,
				status: props.user.status,
				password: null,
				confirmPassword: null
			})
		}
	},
	{
		deep: true
	}
)

watch(open, (value) => {
	if (!value) {
		resetForm()
	}
})

const onClickUploadAvatar = () => {
	avatarRef?.value?.$el?.click()
}

const onClickDeleteAvatar = () => {
	setFieldValue('profilePicture', null)
}

const onSubmit = handleSubmit(async (values) => {
	try {
		let res
		if (props.type === EEntityFormType.ADD) {
			res = await $api.users.addUser({
				...values,
				role: values.role as EUserRole,
				status: values.status as EUserStatus
			})
		} else if (props.user) {
			res = await $api.users.editUser(props.user.id, {
				...values,
				role: values.role as EUserRole,
				status: values.status as EUserStatus
			})
		}

		if (res) {
			toastSuccess(res.message)
			emits('saveSuccess')
		}
	} catch (error) {
		toastError(error)
	}
})

const onChangeProfilePicture = async (file: File | null) => {
	if (!props.user || !file) return

	convertFileToUrl(file!, (url) => {
		setFieldValue('profilePicture', url)
	})

	try {
		isUploadingProfilePicture.value = true
		const res = await $api.users.uploadProfilePicture(props.user.id, file)
		toastSuccess(res.message)
		setFieldValue('profilePicture', res.data.imageKey)
		emits('refreshList')
	} catch (error) {
		setFieldValue('profilePicture', props.user.profilePicture)
		toastError(error)
	} finally {
		isUploadingProfilePicture.value = false
	}
}
</script>

<style scoped></style>
