import axios from "axios";

export const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	timeout: 10000,
	headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
	(response) => response,
	(error) => {

		if (error.response?.data?.statusCode) {
			return Promise.reject(error.response.data);
		}

		return Promise.reject({
			statusCode: 500,
			message: error.message || "Unknown error",
			data: null,
			errorCode: "INTERNAL_ERROR",
			traceId: undefined,
		});
	}
);
