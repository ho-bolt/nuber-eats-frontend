### 1. 커밋 타입

| 기능 이모지 | 기능 이름        | 기능설명                                         |
| ----------- | ---------------- | ------------------------------------------------ |
| ✨          | Feat             | 새로운 기능 추가                                 |
| 🐛          | Fix              | 버그 수정                                        |
| 📱          | Design           | css 등 사용자 UI 디자인 변경                     |
| 💥          | !Breaking change | 커다란 api 변경                                  |
| 🚑️         | !Hotfix          | 급하게 치명적인 버그 고치는 경우                 |
| 📝          | Docs             | 문서 수정                                        |
| 💄          | Style            | 코드 포멧팅, 세미 콜론 누락, 코드 변경 없는 경우 |
| ♻️          | Refactor         | 코드 리펙토링                                    |
| 🧪          | Test             | 테스트 코드, 리펙토링 테스트 코드 추가           |
| 🚧          | Chore            | 빌드 업무 수정 , 패키지 매니저 수정              |
| 💡          | Comment          | 필요한 주석 추가 및 변경                         |
| 🚚          | Rename           | 파일 혹은 폴더명 수정하거나 옮기는 작업          |
| 🔥          | Remove           | 파일 삭제                                        |

### ✏ 메모할 거

Local-only fields

- local state는 server에는 없지만 application에는 있기를 바라는 state이다.
  ex) 로그인, 로그아웃

reactive variable

- 읽고 업데이트 가능하고 저장은 apollo client에 된다.
- react variable의 값이 변경되면 그 필드를 갖는 쿼리들이 자동으로 새로고침된다.
- Fields값이 reactive variable의 값에 의존한다면 variable 값이 바뀔 때 field를 포함하고 있는
- active query들이 자동으로 새로고침된다.
