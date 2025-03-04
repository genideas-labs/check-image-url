/**
 * URL이 이미지인지 확인합니다.
 * @param url 확인할 URL
 * @returns 이미지 URL 여부
 */
export async function isImageUrl(url: string): Promise<boolean> {
  if (url.startsWith('data:')) {
    return true;
  }

  const imageRegex = /\.(gif|jpg|jpeg|png|webp|bmp|svg)(\?.*)?$/i;
  if (imageRegex.test(url)) {
    return true;
  }

  try {
    const response = await fetch(url, { method: 'HEAD' });
    if (!response.ok) {
      // HEAD 요청 실패 시 false 반환
      return false;
    }
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.startsWith('image/')) {
      return true;
    }

    // Content-Type이 image가 아니면, 파일 시그니처를 확인
    const response2 = await fetch(url, { headers: { Range: 'bytes=0-1023' } });
    const buffer = await response2.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);

    if (isJPEG(uint8Array) || isPNG(uint8Array) || isGIF(uint8Array) || isWebP(uint8Array) || isBMP(uint8Array) || isTIFF(uint8Array) || isAVIF(uint8Array) || isHEIF(uint8Array)) {
      return true;
    }

    return false;

  } catch (error) {
    return false;
  }
}

function isJPEG(arr: Uint8Array): boolean {
  if (arr[0] === 0xFF && arr[1] === 0xD8 && arr[2] === 0xFF) {
    // SOI (Start of Image) 마커 확인

    // JFIF, Exif, JFIF 확장 마커 확인 (선택적)
    if (arr[3] === 0xE0 || arr[3] === 0xE1 || (arr[3] >= 0xE2 && arr[3] <= 0xEF)) {
      return true;
    }

    // SOF0, SOF2 마커 확인 (선택적)
    if (arr[3] === 0xC0 || arr[3] === 0xC2) {
      return true;
    }

    return true;
  }
  return false;
}

function isPNG(arr: Uint8Array): boolean {
  return arr[0] === 0x89 && arr[1] === 0x50 && arr[2] === 0x4E && arr[3] === 0x47 && arr[4] === 0x0D && arr[5] === 0x0A && arr[6] === 0x1A && arr[7] === 0x0A;
}

function isGIF(arr: Uint8Array): boolean {
  return arr[0] === 0x47 && arr[1] === 0x49 && arr[2] === 0x46 && arr[3] === 0x38;
}

function isWebP(arr: Uint8Array): boolean {
  return arr[0] === 0x52 && arr[1] === 0x49 && arr[2] === 0x46 && arr[3] === 0x46 && arr[8] === 0x57 && arr[9] === 0x45 && arr[10] === 0x42 && arr[11] === 0x50;
}

function isBMP(arr: Uint8Array): boolean {
  return arr[0] === 0x42 && arr[1] === 0x4D;
}

function isTIFF(arr: Uint8Array): boolean {
  return (arr[0] === 0x49 && arr[1] === 0x49 && arr[2] === 0x2A && arr[3] === 0x00) || (arr[0] === 0x4D && arr[1] === 0x4D && arr[2] === 0x00 && arr[3] === 0x2A);
}

function isAVIF(arr: Uint8Array): boolean {
  return arr[4] === 0x66 && arr[5] === 0x74 && arr[6] === 0x79 && arr[7] === 0x70 &&
         arr[8] === 0x61 && arr[9] === 0x76 && arr[10] === 0x69 && arr[11] === 0x66;
}

function isHEIF(arr: Uint8Array): boolean {
  return (arr[4] === 0x66 && arr[5] === 0x74 && arr[6] === 0x79 && arr[7] === 0x70 &&
          (arr[8] === 0x68 && arr[9] === 0x65 && arr[10] === 0x69 && arr[11] === 0x63 ||
           arr[8] === 0x68 && arr[9] === 0x65 && arr[10] === 0x69 && arr[11] === 0x78 ||
           arr[8] === 0x68 && arr[9] === 0x65 && arr[10] === 0x76 && arr[11] === 0x63 ||
           arr[8] === 0x68 && arr[9] === 0x65 && arr[10] === 0x76 && arr[11] === 0x78));
}
