# check-image-url

URL이 이미지인지 확인하는 간단한 TypeScript 라이브러리입니다.

## 설치

```bash
npm install check-image-url
```

## 사용법

```typescript
import { isImageUrl } from 'check-image-url';

async function checkImage() {
  const url = 'https://www.example.com/image.jpg';
  const isImage = await isImageUrl(url);

  if (isImage) {
    console.log(`${url}은 이미지입니다.`);
  } else {
    console.log(`${url}은 이미지가 아닙니다.`);
  }
}

checkImage();
```

## API

### `isImageUrl(url: string): Promise<boolean>`

URL이 이미지인지 확인합니다.

**매개변수:**

*   `url`: 확인할 URL

**반환 값:**

*   이미지 URL이면 `true`, 아니면 `false`를 반환합니다.

## 라이선스

MIT
