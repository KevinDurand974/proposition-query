import type { QueryClient } from "@tanstack/react-query";

import * as actions from "@actions/test";
import { createMutation, createQuery } from "./utils.js";


export default (queryClient: QueryClient) => ({
	queries: {
		getConfig: () => createQuery(
			["internal-notifications-config"],
			actions.testFunction,
		),

		getNotifications: () => createQuery(
			["internal-notifications"],
			actions.testFunction,
			{ staleTime: 60 * 1000 }
		),
		getNotification: (notificationID: string) => createQuery(
			["internal-notifications"],
			() => actions.testParamFunction(notificationID),
			{ staleTime: 60 * 1000 }
		),
	},
	mutations: {
		updateNotification: () => createMutation(
			actions.testParamFunction,
		),
		readNotifications: () => createMutation(
			actions.testFunction,
			{
				onSuccess: () => {
					console.log("success");
				}
			},
		),
		upsertNotificationSubscription: () => createMutation(
			actions.testFunction,
			["internal-notifications"],
			queryClient,
		),
		upsertNotificationSubscriptions: () => createMutation(
			actions.testFunction,
			{
				onSuccess: () => {
					console.log("success");
				}
			},
			["internal-notifications"],
			queryClient,
		),

		// Examples
		oneParam: () => createMutation(
			actions.testFunction
		),
		twoParams: () => createMutation(
			actions.testFunction,
			{
				onSuccess: () => {
					console.log("success");
				}
			},
		),
		threeParams: () => createMutation(
			actions.testFunction,
			["internal-notifications"],
			queryClient,
		),
		fourParams: () => createMutation(
			actions.testParamFunction2,
			{
				onSuccess: () => {
					console.log("success");
				},
			},
			["internal-notifications"],
			queryClient,
		),
	},
});