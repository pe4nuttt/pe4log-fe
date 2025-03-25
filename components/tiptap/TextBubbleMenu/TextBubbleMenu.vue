<template>
	<BubbleMenu
		:editor="props.editor"
		:tippy-options="{ popperOptions: { placement: 'top-start' } }"
		:update-delay="100"
		plugin-key="textBubbleMenu"
		:should-show="states.shouldShow"
	>
		<Toolbar class="z-10 last:pr-2">
			<ContentTypePicker :options="blockOptions" />
			<ToolbarButton
				v-tooltip="{
					content: '<p>Bold</p><p class=\'text-gray-400\'>Ctrl + B</p>',
					html: true
				}"
				:active="states.isBold"
				@click="commands.onBold"
			>
				<Icon name="lucide:bold" size="15px" class="h-[15px] w-[15px]"></Icon>
			</ToolbarButton>
			<ToolbarButton
				v-tooltip="{
					content: `<p>Italic</p><p class=\'text-gray-400\'>Ctrl + I</p>`,
					html: true
				}"
				:active="states.isItalic"
				@click="commands.onItalic"
			>
				<Icon name="lucide:italic" size="15px" class="h-[15px] w-[15px]"></Icon>
			</ToolbarButton>
			<ToolbarButton
				v-tooltip="{
					content: '<p>Underline</p><p class=\'text-gray-400\'>Ctrl + U</p>',
					html: true
				}"
				:active="states.isUnderline"
				@click="commands.onUnderline"
			>
				<Icon
					name="lucide:underline"
					size="15px"
					class="h-[15px] w-[15px]"
				></Icon>
			</ToolbarButton>
			<ToolbarButton
				v-tooltip="{
					content:
						'<p>Strike-through</p><p class=\'text-gray-400\'>Ctrl + Shift + S</p>',
					html: true
				}"
				:active="states.isStrike"
				@click="commands.onStrike"
			>
				<Icon
					name="lucide:strikethrough"
					size="15px"
					class="h-[15px] w-[15px]"
				></Icon>
			</ToolbarButton>
			<ToolbarButton
				v-tooltip="{
					content: '<p>Code</p><p class=\'text-gray-400\'>Ctrl + E</p>',
					html: true
				}"
				:active="states.isCode"
				@click="commands.onCode"
			>
				<Icon name="lucide:code" size="15px" class="h-[15px] w-[15px]"></Icon>
			</ToolbarButton>
			<ToolbarButton
				v-tooltip="{
					content:
						'<p>Code block</p><p class=\'text-gray-400\'>Ctrl + Alt + C</p>',
					html: true
				}"
				@click="commands.onCodeBlock"
			>
				<Icon
					name="lucide:code-xml"
					size="15px"
					class="h-[15px] w-[15px]"
				></Icon>
			</ToolbarButton>
			<MenuColorPicker
				:color="states.currentColor"
				:highlight-color="states.currentHighlight"
				@change-color="(color) => commands.onChangeColor(color)"
				@clear-color="commands.onClearColor"
				@change-highlight-color="(color) => commands.onChangeHighlight(color)"
				@clear-highlight-color="commands.onClearHighlight"
			/>
			<!-- <ToolbarToggleGroup
        type="multiple"
        aria-label="Text formatting"
        class="pr-[10px]"
      >
        <ToolbarToggleItem value="bold" aria-label="Bold" pressed>
          <Icon name="lucide:bold" size="15px" class="w-[15px] h-[15px]"></Icon>
        </ToolbarToggleItem>
      </ToolbarToggleGroup> -->
			<!-- <ToolbarButton class="">Test123</ToolbarButton>
      <ToolbarButton active class="">Test123</ToolbarButton>

      <ToolbarToggleGroup
        type="multiple"
        aria-label="Text formatting"
        class="pr-[10px]"
      >
        <ToolbarToggleItem value="bold" aria-label="Bold">
          <Icon name="lucide:bold" size="15px" class="w-[15px] h-[15px]"></Icon>
        </ToolbarToggleItem>
        <ToolbarToggleItem value="italic" aria-label="Italic">
          Italic
        </ToolbarToggleItem>
        <ToolbarToggleItem value="strikethrough" aria-label="Strike through">
          Strike
        </ToolbarToggleItem>
      </ToolbarToggleGroup>
      <ToolbarSeperator />
      <ToolbarToggleGroup
        type="multiple"
        aria-label="Text formatting"
        class="pr-[10px]"
      >
        <ToolbarToggleItem value="bold" aria-label="Bold">
          <Icon name="lucide:bold" size="15px" class="w-[15px] h-[15px]"></Icon>
        </ToolbarToggleItem>
        <ToolbarToggleItem value="italic" aria-label="Italic">
          Italic
        </ToolbarToggleItem>
        <ToolbarToggleItem value="strikethrough" aria-label="Strike through">
          Strike
        </ToolbarToggleItem>
      </ToolbarToggleGroup> -->
		</Toolbar>
	</BubbleMenu>
</template>

<script setup lang="ts">
import { Toolbar, ToolbarButton } from '@/components/ui/toolbar'
import ContentTypePicker from './components/ContentTypePicker.vue'
import MenuColorPicker from './components/MenuColorPicker.vue'
import { useTextBubbleMenuStates } from './composables/useTextBubbleMenuStates'

type TextBubbleMenuProps = {
	editor: Editor
}

import { BubbleMenu } from '@tiptap/vue-3'
import type { Editor } from '@tiptap/vue-3'
import { useTextBubbleMenuContentTypes } from './composables/useTextBubbleMenuContentType'
import { useTextBubbleMenuCommands } from './composables/useTextBubbleMenuCommands'

const props = defineProps<TextBubbleMenuProps>()
const blockOptions = useTextBubbleMenuContentTypes(props.editor)
const states = computed(() => useTextBubbleMenuStates(props.editor))
const commands = computed(() => useTextBubbleMenuCommands(props.editor))
</script>

<style scoped lang="scss"></style>
