import { useQueryClient } from "@tanstack/react-query";

import notification from "@queries/notification";

export const useTemplate = () => {
	const queryClient = useQueryClient();

	return {
		...notification(queryClient),
	};
};
