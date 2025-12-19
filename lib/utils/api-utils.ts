import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/lib/infra/api/types/api-error";
import { HttpStatusCode } from "@/lib/shared/constants/http";
import { INTERNAL_API_ENDPOINTS } from "@/lib/shared/constants/endpoints";

export function apiHandler<T>(
  handler: () => Promise<T>,
  options?: { successStatus?: number },
): () => Promise<NextResponse> {
  return async () => {
    try {
      const result = await handler();
      return NextResponse.json(result, {
        status: options?.successStatus ?? HttpStatusCode.OK,
      });
    } catch (error: unknown) {
      const apiError = error as ApiError;

      if (apiError.status === HttpStatusCode.UNAUTHORIZED) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: HttpStatusCode.UNAUTHORIZED },
        );
      }
      return NextResponse.json(
        { error: apiError.message || "Internal server error" },
        { status: apiError.status || HttpStatusCode.INTERNAL_SERVER_ERROR },
      );
    }
  };
}

export function apiHandlerWithReq<T>(
  handler: (req: NextRequest) => Promise<T>,
  options?: { successStatus?: number },
): (req: NextRequest) => Promise<NextResponse> {
  return async (req: NextRequest) => {
    try {
      const result = await handler(req);
      return NextResponse.json(result, {
        status: options?.successStatus ?? HttpStatusCode.OK,
      });
    } catch (error: unknown) {
      const apiError = error as ApiError;

      if (apiError.status === HttpStatusCode.UNAUTHORIZED) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: HttpStatusCode.UNAUTHORIZED },
        );
      }
      return NextResponse.json(
        { error: apiError.message || "Internal server error" },
        { status: apiError.status || HttpStatusCode.INTERNAL_SERVER_ERROR },
      );
    }
  };
}
const REFRESH_TOKEN_EXEMPT_URLS = [INTERNAL_API_ENDPOINTS.AUTH.LOGIN, INTERNAL_API_ENDPOINTS.AUTH.REGISTER];

export function shouldSkipTokenRefresh(url: string): boolean {
  return REFRESH_TOKEN_EXEMPT_URLS.some((exemptUrl) => url.includes(exemptUrl));
}
