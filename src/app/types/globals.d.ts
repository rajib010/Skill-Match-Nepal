export {};

declare global {
  type ApiResponse = {
    success: boolean;
    message: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
    errors?: Record<string, string[]>;
  };

  type User = {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role: string | null | undefined;
  };
}
