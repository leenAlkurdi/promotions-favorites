import axios from "axios";

export const api = axios.create({
 baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api',
	timeout: 10000,
	headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
	(response) => response,
	(error) => {
		const resp = error.response?.data;
		if (resp?.statusCode) {
			return Promise.reject({
				statusCode: resp.statusCode,
				message: resp.message,
				data: resp.data,
				errorCode: resp.errorCode,
				traceId: resp.traceId,
			});
		}

		return Promise.reject({
			statusCode: error.response?.status ?? 500,
			message: error.message || 'Unknown error',
			data: null,
			errorCode: 'INTERNAL_ERROR',
			traceId: undefined,
		});
	}
);
