import type { Client } from "@models";
import { type Mock, vi } from "vitest";

export type MockClient = Client & {
	executeQuery: Mock;
};

export function createMockClient(): MockClient {
	return {
		executeQuery: vi.fn(),
	} as MockClient;
}

export function createMockClientWithResponse<T>(response: T): MockClient {
	const client = createMockClient();
	client.executeQuery.mockResolvedValue(response);
	return client;
}

export function createMockClientWithError(error: Error): MockClient {
	const client = createMockClient();
	client.executeQuery.mockRejectedValue(error);
	return client;
}
