import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import type { paths } from "../../api/src/api-schema";

export const fetchClient = createFetchClient<paths>({
	baseUrl: "http://localhost:3000/api/v1",
});

export const $api = createClient(fetchClient);

export type VehicleStatusLastResponse =
	paths["/vehicle-status/last"]["get"]["responses"]["200"]["content"]["text/json"];
