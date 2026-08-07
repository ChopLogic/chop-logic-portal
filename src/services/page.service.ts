import { executeQuery } from "../api/client";
import { HOME_PAGE_QUERY } from "../api/queries";
import type { Config, Home } from "../api/types/generated";

export class PageService {
	async getHomePage(): Promise<{ home: Home; config: Config }> {
		const response = await executeQuery<{ home: Home; config: Config }>(
			HOME_PAGE_QUERY,
		);
		return response;
	}
}
