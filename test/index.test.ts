declare global {
  interface CustomResponse {
    readonly headers: Headers;
    readonly ok: boolean;
    readonly redirected: boolean;
    readonly status: number;
    readonly statusText: string;
    readonly type: ResponseType;
    readonly url: string;
    clone(): CustomResponse;
    readonly body: ReadableStream<Uint8Array> | null;
    readonly bodyUsed: boolean;
    arrayBuffer(): Promise<ArrayBuffer>;
    blob(): Promise<Blob>;
    formData(): Promise<FormData>;
    json(): Promise<any>;
    text(): Promise<string>;
  }
  function fetch(
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<CustomResponse>;
}
import { isImageUrl } from '../src/index';

describe('isImageUrl', () => {
  it('should return true for data URLs', async () => {
    expect(await isImageUrl('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='))
      .toBe(true);
  });

  it('should return true for valid image URLs (regex)', async () => {
    expect(await isImageUrl('http://example.com/image.jpg')).toBe(true);
    expect(await isImageUrl('https://example.com/image.png?param=value')).toBe(true);
  });

  it('should return false for invalid image URLs (regex)', async () => {
    expect(await isImageUrl('http://example.com/not-an-image.txt')).toBe(false);
    expect(await isImageUrl('https://example.com/image')).toBe(false);
  });

  it('should return true for valid image URLs (HEAD request)', async () => {
    const mockHeaders = new Headers({
      'content-type': 'image/jpeg',
    });
    const mockResponse: CustomResponse = {
      ok: true,
      headers: mockHeaders,
      redirected: false,
      status: 200,
      statusText: 'OK',
      type: 'basic',
      url: '',
      clone: () => ({} as CustomResponse),
      body: null,
      bodyUsed: false,
      arrayBuffer: async () => new ArrayBuffer(0),
      blob: async () => new Blob(),
      formData: async () => new FormData(),
      json: async () => ({}),
      text: async () => '',
    };
    global.fetch = async (): Promise<Response> => mockResponse as any;
    expect(await isImageUrl('http://example.com/image')).toBe(true);
  });

  it('should return false for invalid image URLs (HEAD request)', async () => {
    const mockHeaders = new Headers({
      'content-type': 'text/html',
    });
    const mockResponse: CustomResponse = {
      ok: true,
      headers: mockHeaders,
      redirected: false,
      status: 200,
      statusText: 'OK',
      type: 'basic',
      url: '',
      clone: () => ({} as CustomResponse),
      body: null,
      bodyUsed: false,
      arrayBuffer: async () => new ArrayBuffer(0),
      blob: async () => new Blob(),
      formData: async () => new FormData(),
      json: async () => ({}),
      text: async () => '',
    };
    global.fetch = async (): Promise<Response> => mockResponse as any;
    expect(await isImageUrl('http://example.com/image')).toBe(false);
  });

  it('should return false for failed HEAD requests', async () => {
    global.fetch = async (): Promise<Response> => {
      throw new Error('Network error');
    };
    expect(await isImageUrl('http://example.com/image')).toBe(false);
  });

  it('should return true for valid image URLs (GET request, signature)', async () => {
    const mockHeaders = new Headers();
    const mockResponse: CustomResponse = {
      ok: true,
      headers: mockHeaders,
      arrayBuffer: async () => new Uint8Array([0xFF, 0xD8, 0xFF]).buffer, // JPEG signature
      redirected: false,
      status: 200,
      statusText: 'OK',
      type: 'basic',
      url: '',
      clone: () => ({} as CustomResponse),
      body: null,
      bodyUsed: false,
      formData: async () => new FormData(),
      json: async () => ({}),
      text: async () => '',
      blob: async () => new Blob(),
    };
    global.fetch = async (url: RequestInfo | URL): Promise<Response> => {
      if (url === 'http://example.com/image') {
        return mockResponse as any;
      }
      return {
        ok: false,
        statusText: 'Not Found',
        headers: mockHeaders,
        redirected: false,
        status: 404,
        type: 'basic',
        url: '',
        clone: () => ({} as CustomResponse),
        body: null,
        bodyUsed: false,
        arrayBuffer: async () => new ArrayBuffer(0),
        blob: async () => new Blob(),
        formData: async () => new FormData(),
        json: async () => ({}),
        text: async () => '',
      } as any;
    };
    expect(await isImageUrl('http://example.com/image')).toBe(true);
  });

  it('should return false for invalid image URLs (GET request, signature)', async () => {
    const mockHeaders = new Headers();
    const mockResponse: CustomResponse = {
      ok: true,
      headers: mockHeaders,
      arrayBuffer: async () => new Uint8Array([0x00, 0x00, 0x00]).buffer, // Invalid signature
      redirected: false,
      status: 200,
      statusText: 'OK',
      type: 'basic',
      url: '',
      clone: () => ({} as CustomResponse),
      body: null,
      bodyUsed: false,
      formData: async () => new FormData(),
      json: async () => ({}),
      text: async () => '',
      blob: async () => new Blob(),
    };
    global.fetch = async (url: RequestInfo | URL): Promise<Response> => {
      if (url === 'http://example.com/image') {
        return mockResponse as any;
      }
      return {
        ok: false,
        statusText: 'Not Found',
        headers: mockHeaders,
        redirected: false,
        status: 404,
        type: 'basic',
        url: '',
        clone: () => ({} as CustomResponse),
        body: null,
        bodyUsed: false,
        arrayBuffer: async () => new ArrayBuffer(0),
        blob: async () => new Blob(),
        formData: async () => new FormData(),
        json: async () => ({}),
        text: async () => '',
      } as any;
    };
    expect(await isImageUrl('http://example.com/image')).toBe(false);
  });
});
