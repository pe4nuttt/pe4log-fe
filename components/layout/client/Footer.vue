<template>
	<footer>
		<div class="grid gap-4 gap-y-8 lg:grid-cols-2">
			<div class="space-y-2">
				<a href="/" class="inline-block text-2xl font-bold">Pe4nuttt.blog</a>
				<p class="!mb-3 text-muted-foreground">
					Built with coffee, code, and curiosity.
				</p>

				<div class="flex gap-2">
					<Button
						size="sm"
						class="social-link github h-10 w-10 rounded-full !bg-muted px-[10px] hover:shadow-lg"
					>
						<Icon
							name="ion:logo-github"
							class="text-muted-foreground"
							size="24px"
						/>
					</Button>
					<Button
						size="sm"
						class="social-link linkedin h-10 w-10 rounded-full !bg-muted px-[10px] hover:shadow-lg"
					>
						<Icon
							name="ion:logo-linkedin"
							class="text-muted-foreground"
							size="24px"
						/>
					</Button>
					<Button
						size="sm"
						class="social-link facebook h-10 w-10 rounded-full !bg-muted px-[10px] hover:shadow-lg"
					>
						<Icon
							name="ion:logo-facebook"
							class="text-muted-foreground"
							size="24px"
						/>
					</Button>
				</div>
			</div>
			<div class="grid grid-cols-[auto,auto] gap-3">
				<div class="footer-menu">
					<h3 class="mb-3 text-xl font-bold">Navigation</h3>
					<ul class="flex flex-col gap-3 text-muted-foreground">
						<li><a href="/" class="hover:text-foreground">Home</a></li>
						<li><a href="/blog" class="hover:text-foreground">Blog</a></li>
						<li><a href="/about" class="hover:text-foreground">About</a></li>
					</ul>
				</div>

				<div class="footer-menu">
					<h3 class="mb-3 text-xl font-bold">Category</h3>
					<ul class="flex flex-col gap-3 text-muted-foreground">
						<li>
							<a href="/" class="hover:text-foreground">Web development</a>
						</li>
						<li><a href="/blog" class="hover:text-foreground">VueJS</a></li>
						<li><a href="/blog" class="hover:text-foreground">ReactJS</a></li>
						<li><a href="/about" class="hover:text-foreground">NodeJS</a></li>
					</ul>
				</div>
			</div>
		</div>

		<Separator class="my-4" />

		<div class="footer-bottom">
			<div class="copyright text-sm text-muted-foreground">
				© 2025 Pe4nuttt.blog. All rights reserved.
			</div>
		</div>
	</footer>
</template>

<script setup lang="ts">
import Separator from '~/components/ui/separator/Separator.vue'
</script>

<style scoped lang="scss">
.social-link {
	transition: all ease-in 0.1s;
}

.social-link:hover {
	transform: translateY(-3px);
}

.social-link.github:hover span {
	background: #333;
}

.dark {
	.social-link.github:hover span {
		background: #eee;
	}
}

.social-link.linkedin:hover span {
	background: #0077b5;
}

.social-link.facebook:hover span {
	background: #1877f2;
}

.footer-menu {
	a {
		position: relative;
		transition: color 0.3s ease;
	}

	a::after {
		content: '';
		position: absolute;
		width: 0;
		height: 2px;
		bottom: -2px;
		left: 0;
		background: hsl(var(--primary));
		transition: width 0.3s ease;
	}

	a:hover::after {
		width: 100%;
	}
}
</style>
