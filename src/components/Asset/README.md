## 공지

- 현재 아이콘 로직을 변경하는 중 입니다.
- 아이콘의 중복을 막기 위해 `storybook`에서 아이콘 리스트들을 확인할 수 있습니다. `npm run storybook` 에서 확인해주세요!
- 이후 추가되는 아이콘들은 아래 양식을 따라주세요.

## Icon 컴포넌트 추가 시

1. 직사각형 형태의 Viewport를 가지고 있어야 합니다.
2. svg 태그 내부의 children을 `/src/components/Asset/Icon/constants.tsx`에 **ICONS_TEMP(임시)** 객체에 정의 후 사용해야 합니다.
3. 내부 children의 fill 속성은 특정 색상이 아닌경우 제거해야 합니다.
