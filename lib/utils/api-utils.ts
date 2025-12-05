import { NextRequest, NextResponse } from 'next/server';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export type ApiRouteHandler = (req: NextRequest) => Promise<Response>;

export const apiHandlerWithReq = (handler: ApiRouteHandler) => {
  return async (req: NextRequest): Promise<Response> => {
    try {
      return await handler(req);
    } catch (error) {
      if (error instanceof ApiError) {
        return NextResponse.json(
          { success: false, message: error.message },
          { status: error.status }
        );
      }

      console.error('API handler unexpected error', error);
      return NextResponse.json(
        { success: false, message: 'Internal server error' },
        { status: 500 }
      );
    }
  };
};
