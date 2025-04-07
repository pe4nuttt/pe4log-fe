import { cva, type VariantProps } from 'class-variance-authority'

export const multiSelectVariants = cva(
	'm-1 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300',
	{
		variants: {
			variant: {
				default:
					'border-foreground/10 text-foreground bg-card hover:bg-card/80',
				secondary:
					'border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80',
				destructive:
					'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
				inverted: 'inverted'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	}
)

export type MultiSelectVariants = VariantProps<typeof multiSelectVariants>

export { default as MultiSelect } from './MultiSelect.vue'
