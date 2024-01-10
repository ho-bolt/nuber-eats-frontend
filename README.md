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

apollo-tooling

- back-end에서 mutations, query responses, input type을 전부 다 typescript 정의로 자동으로 생성해준다.

apollo가 하는 일

- apollo는 내 file을 보면서 gql이 나올 때마다 typescript definition을 건네준다.
- login.tsx의 onError에서 ApolloError는 연결이 안되면 발생한다.
  - backend에서 request를 받아주지 않아 error false를 받으면 이 에러는 발생하지 않는다
- output에서 error false는 GraphQL에게는 error가 아니다.
- output에서 error false는 GraphQl에겐 onCompleted이다.
- GraphQL에서 error는 request가 유효하지 않거나 인증이 필요하거나 url이 잘못됐을 경우이다.
