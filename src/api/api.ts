const BASE_URL = import.meta.env.VITE_API_BASE_URL;

class APIError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);

    this.status = status;
  }
}

const DEFAULT_PARSER_FUNC = async <T>(result: Response): Promise<T> =>
  await result.json();

const getFullUrl = (path: string): URL => new URL(path, BASE_URL);

const apiAction = async <T>(
  apiPath: URL,
  options?: RequestInit,
  parser: (result: Response) => Promise<T> = DEFAULT_PARSER_FUNC,
): Promise<T> => {
  const result = await fetch(apiPath, options);

  if (!result.ok) throw new APIError(result.status, result.statusText);

  return await parser(result);
};

export { getFullUrl, apiAction };
