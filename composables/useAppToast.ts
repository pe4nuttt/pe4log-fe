import { useToast } from '~/components/ui/toast'
import { getErrorMessage } from '~/utils/messageFormatter'

export function useAppToast() {
	const { toast } = useToast()

	function toastSuccess(message: string) {
		toast({
			title: 'Success',
			description: message,
			variant: 'success'
		})
	}

	function toastError(error: unknown) {
		toast({
			title: 'Error',
			description: getErrorMessage(error),
			variant: 'destructive'
		})
	}

	return {
		toast,
		toastSuccess,
		toastError
	}
}
