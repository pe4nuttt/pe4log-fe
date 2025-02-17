<template>
	<CloudIcon :images="imageUrls" />
</template>

<script setup lang="ts">
import CloudIcon from '../layout/CloudIcon.vue'

const slugs = [
	'typescript',
	'javascript',
	'dart',
	'java',
	'react',
	'flutter',
	'android',
	'html5',
	'css3',
	'nodedotjs',
	'express',
	'nextdotjs',
	'prisma',
	'amazonaws',
	'postgresql',
	'firebase',
	'nginx',
	'vercel',
	'testinglibrary',
	'jest',
	'cypress',
	'docker',
	'git',
	'jira',
	'github',
	'gitlab',
	'visualstudiocode',
	'androidstudio',
	'sonarqube',
	'figma'
]

const imageUrls = slugs.map(
	(slug) => `https://cdn.simpleicons.org/${slug}/${slug}`
)
</script>

<style scoped></style>
