# IoTLogic 도움말
유덕남 ([yoo2001818@gmail.com](mailto:yoo2001818@gmail.com))  
버전 1.0.0, 2016년 7월 25일  

# 목차

- 소개
- 웹 프론트엔드 가이드
  - 구성
  - 계정 관리
  - 홈
  - 장치
    - 만들기
    - 정보 수정하기
      - 웹 리모컨
      - I/O 패키지
  - 스크립트
    - 만들기
    - 정보 수정하기
    - 스크립트 수정하기
    - 콘솔 사용하기
- 프로그래밍 가이드
  - 구성
  - 주의 사항
  - IoTLogic 내장 함수
    - I/O 사용하기
  - I/O 패키지 레퍼런스
    - cron
    - node-notifier
    - process
    - remote
    - wiring-pi
    - 패키지 만들기
  - 장치 레퍼런스
    - 웹 리모컨
- 설치하기
  - 클라이언트 노드 설치하기
  - 메시징 서버 설치하기
- 예제
  - 원격으로 컴퓨터 종료하기
  - 버튼 눌리면 LED 토글하기
- 라이센스

# 소개
IoTLogic은 인터넷 상에 연결되어 있는 여러 장치를 장치별로 프로그램을 따로 작성하지 않고
하나의 프로그램만을 작성해서 손쉽게 제어할 수 있게 해주는 플랫폼입니다.

IoTLogic은 웹 프론트엔드, 메시징 서버와 클라이언트 노드 3가지로 구성되어 있습니다.
- 웹 프론트엔드에서는 장치와 스크립트를 관리할 수 있는 기능을 웹 브라우저에서 제공합니다.
- 메시징 서버는 웹 프론트엔드, 클라이언트 노드에서 받은 명령을 다른 노드로 보내는 등의
  릴레이 동작을 수행합니다.
- 클라이언트 노드에서는 메시징 서버와 연결해 스크립트를 실행하며 필요로 하는 I/O를 실행합니다.

# 웹 프론트엔드 가이드
IoTLogic의 웹 프론트엔드에 대해 설명합니다.

## 구성
웹 프론트엔드는 크게 다음과 같은 기능을 가지고 있습니다:

- 계정 관리
- 장치 관리
  - 웹 리모컨
  - I/O 패키지 관리 (PC 장치에서만)
- 스크립트 관리
  - 스크립트 수정
  - 콘솔
  - 에러 보기

## 계정 관리

### 로그인
![로그인 화면](./img/login.png)

사이트에 접속하면 맨 처음으로 로그인 화면이 나타납니다. 로그인하지 않으면 서비스를 이용할 수
없어 꼭 로그인을 해야 합니다. 계정이 없다면 계정 만들기 화면으로 이동할 수 있습니다.

### 계정 만들기
![계정 만들기 화면](./img/register.png)

계정 만들기 화면에서 계정을 만들 수 있습니다. 아이디, 비밀번호, 이름, 이메일 주소를 입력하면
회원가입이 끝나고 홈으로 이동하게 됩니다.

### 계정 설정
![계정 설정 화면](./img/userInfo.png)

로그인이 끝나고 우측 위의 설정 버튼을 누르면 비밀번호, 이름, 이메일 주소를 변경할 수 있습니다.

## 홈
![홈](./img/home.png)
![홈 (작은 화면)](./img/homeMobile.png)

홈 화면에서는 사용자가 등록한 장치와 스크립트가 전부 나열됩니다. 화면 크기가 작아지면
왼쪽 메뉴(햄버거 메뉴)가 사라지는데, 이런 환경에서도 편리하게 페이지를 넘길 수 있게 됩니다.

## 장치
![장치 목록](./img/deviceList.png)

장치 오른쪽에는 이런 작은 아이콘이 표시되는데, 연결 상태와 에러 여부를 표시합니다.
PC (Node.js) 유형의 장치가 아닌 경우에는 아이콘이 표시되지 않습니다.

### 만들기
![장치 추가](./img/deviceAdd.png)

추가 버튼을 누르면 장치 유형을 선택하는 창이 나타납니다. 누르면 유형에 따라 다른 페이지로
분기됩니다.

### 정보 수정하기
![장치](./img/deviceView.png)

장치를 선택하면 해당 장치에 대한 자세한 사항이 표시됩니다. 장치의 ID와 별명을 수정할
수 있고, 장치에 연결된 스크립트를 볼 수 있고, 추가적으로 장치 유형에 따라서 여러 필드가
더 나타납니다.

![장치 삭제 확인](./img/deviceDeleteConfirm.png)

삭제 버튼을 누르면 이렇게 창이 나타나서 확실하게 삭제할 건지 물어봅니다.

#### 웹 리모컨
![웹 리모컨](./img/webRemote.png)

웹 리모컨 유형의 장치 상단에는 스크립트에서 설정된 리모컨이 나타나서 장치를 웹에서 편리하게
제어할 수 있습니다. 내부적으로 REST API를 사용하므로 필요하다면 다른 프로그램에서도 이를
호출할 수도 있습니다.

#### I/O 패키지
![I/O 패키지](./img/pcPackage.png)

PC (Node.js) 유형의 장치 하단에서 장치에서 사용하는 I/O 패키지를 등록할 수 있습니다. 이
패키지는 [npm](http://npmjs.com/)에서 받아서 설치하게 됩니다.

## 스크립트
![스크립트 목록](./img/documentList.png)

스크립트 오른쪽에도 작은 아이콘이 표시되는데, 스크립트 실행 여부와 일시 정지 여부, 에러 여부를
나타냅니다.

### 만들기
![스크립트 만들기](./img/newDocument.png)

메뉴의 스크립트 오른쪽의 + 버튼을 누르면 스크립트를 만들 수 있습니다. 이름과 실행 여부,
연결할 장치들을 설정할 수 있습니다.

### 정보 수정하기
![스크립트 정보](./img/documentView.png)

스크립트를 선택하면 자세한 사항이 표시됩니다. 현재 정보가 표시되고, 스크립트를 파일로
다운로드받거나, 연결된 장치를 추가하거나 제거할 수 있습니다.

![스크립트 오류](./img/documentError.png)

스크립트 오류도 이 화면에서 볼 수 있습니다.

![스크립트 타이틀](./img/documentHeader.png)

스크립트가 선택된 상태에서는 왼쪽 위의 제목이 드롭다운 메뉴로 변하는데, 누르면 스크립트를
수정하거나 콘솔로 이동할 수 있습니다.

### 스크립트 수정하기
![스크립트 수정](./img/scriptEdit.png)

'스크립트'를 클릭해서 들어가면 스크립트를 직접 수정할 수 있는 화면이 나타납니다. 간단한
스크립트 편집기를 제공해서 쉽게 편집할 수 있습니다.

각 스크립트 파일은 임시 공간과 실제 동작하는 스크립트 두 가지가 있는데, 아래에 보여지는
내용은 임시 공간의 코드입니다. 위에 있는 저장, 초기화 버튼을 사용해서 임시 공간에 저장하거나
업로드 했던 스크립트를 원래대로 돌릴 수 있고, 업로드 버튼을 사용해 실제로 스크립트를 올릴
수 있습니다.

### 콘솔 사용하기
![콘솔](./img/scriptConsole.png)

'콘솔'을 클릭해서 들어가면 스크립트 콘솔이 나타나는데, 스크립트 상에서 출력되는 메시지를 볼
수 있고 아래의 입력 창을 통해 스크립트를 직접 실행할 수도 있습니다 (REPL).

또, 재시작 버튼을 눌러 스크립트를 다시 시작할 수도 있습니다.

# 프로그래밍 가이드
IoTLogic은 스크립트를 작성할 수 있는 언어로 Scheme (R<sup>6</sup>RS)를 지원합니다.
R6RS에 대한 자세한 사항은 [레퍼런스](http://www.r6rs.org/final/html/r6rs/r6rs.html)를
참조해 주세요.

## 구성
![구성](./img/structure.png)

- [IoTLogic-server](https://github.com/yoo2001818/IoTLogic-server) -
  웹 프론트엔드와 메시징 서버
- [IoTLogic-core](https://github.com/yoo2001818/IoTLogic-core) -
  분산 Scheme 환경 코어와 클라이언트 노드
- [r6rs](https://github.com/yoo2001818/r6rs) -
  R6RS Scheme 인터프리터
- [r6rs-async-io](https://github.com/yoo2001818/r6rs-async-io) -
  r6rs (라이브러리)를 위한 비동기 I/O 커넥터
- [r6rs-async-io-library](https://github.com/yoo2001818/r6rs-async-io-library) -
  r6rs-async-io용 비동기 I/O 라이브러리 모음
- [locksmith](https://github.com/yoo2001818/locksmith) -
  Lockstep 상태 기계 동기화 라이브러리
- [locksmith-connector-ws](https://github.com/yoo2001818/locksmith-connector-ws) -
  locksmith용 WebSocket 프로토콜

## 주의 사항

- R6RS 구현이 완전히 되지 않아 일부 명령은 동작하지 않을 수도 있습니다. 대표적으로 복소수,
  벡터, letrec, call/cc등을 사용할 수 없습니다. 자세한 사항은
  [여기](https://github.com/yoo2001818/r6rs#implementation-status)를 참조하세요.
- 장치가 새로 연결되거나 접속을 해제하면 인터프리터가 다시 시작됩니다.

## IoTLogic 내장 함수

- `(device-list)` - 현재 문서에 접속한 모든 장치들의 ID 리스트를 반환합니다.
- `(device-alias <장치 ID>)` - 해당 장치의 별명을 반환합니다.
- `(device-exists <장치 ID)` - 해당 장치의 접속 여부를 반환합니다.

### I/O 사용하기

- `(io-exec <타입> <옵션> <콜백>)` - 해당 I/O를 비동기로 한번만 실행하고
  이벤트 ID를 반환합니다.
- `(io-once <타입> <옵션> <콜백>)` - `io-exec`와 같습니다.
- `(io-on <타입> <옵션> <콜백>)` - 해당 I/O에서 지속적으로 이벤트를 수신합니다. 이벤트
  ID를 반환합니다.
- `(io-cancel <이벤트 ID>)` - 해당 I/O 실행을 취소합니다.

I/O 타입은 문자열이나 심볼, 리스트가 될 수 있습니다. 문자열이나 심볼의 경우에는
`device:test`처럼 : 문자로 장치 ID와 실행할 I/O를 구분합니다. 리스트의 경우에는
`'(device test)`처럼 첫번째 항목이 장치 ID, 두번째 항목이 실행할 I/O가 됩니다.

콜백은 필요하지 않다면 뺄 수도 있습니다. 하지만 옵션은 필요하지 않더라도 빈 리스트
등으로 꼭 채워넣어야 합니다.

```scheme
(io-exec 'laptop:notifier/send "안녕하세요!")
(io-exec 'laptop:process/exec "shutdown -s -t 0" (lambda ()
  (display "실행 완료")
  (newline)
))
(io-exec 'laptop:getDate '() (lambda (date)
  (display "현재 시간은")
  (display date)
  (newline)
))
```

## I/O 패키지 레퍼런스
I/O 패키지는 npm을 통해 배포되고, 웹 프론트엔드에서 장치 하단의 'I/O 패키지' 항목을 통해
사용할 항목을 선택할 수 있습니다.

다음은 빌트인 I/O 함수의 목록입니다.

- `functions () -> (리스트)` - 해당 장치의 모든 I/O 함수 리스트를 반환합니다.
- `timer 딜레이 -> ()` - 해당 장치에서 지정한 시간이 지난 뒤에 명령을 실행합니다.
  `io-on`을 사용하면 일정 시간마다 계속 호출됩니다.
- `getDate () -> (시간)` - 해당 장치의 현재 시간을 타임스탬프 값으로 반환합니다.

```scheme
(io-exec 'laptop:functions '() (lambda (functionList)
  (display functionList)
  (newline)
))
```

### r6rs-async-io-cron
cron을 IoTLogic 상에서 사용할 수 있게 해주는 패키지입니다.

- `cron/start 패턴 -> ()` - 해당 패턴이 일치하는 시간에 콜백을 호출합니다.

### r6rs-async-io-node-notifier
컴퓨터의 화면에 알림을 띄울 수 있게 해줍니다.

![알림 화면](./img/notificationExample.png)

- `notifier/send 옵션 -> ()` - 해당 설정에 맞춰 알림을 띄웁니다. 옵션은 문자열이나
  association 리스트가 될 수 있습니다. association 리스트를 사용한다면 인자가 그대로
  [node-notifier](https://github.com/mikaelbr/node-notifier)로 전달됩니다.

```scheme
(io-exec "laptop:notifier/send" '(
  (title "Starting notification")
  (message "This is a notification")
))
```

### r6rs-async-io-process
프로세스를 실행할 수 있게 해줍니다.

- `process/exec (명령 옵션) 또는 명령 -> ((message code signal) stdout stderr)` -
  프로세스를 실행하고 완료될 때까지 기다리다 실행이 끝나면 반환합니다. 앞의
  `(message code signal)`은 프로세스가 0이 아닌 값을 반환하면 나오는 내용으로, 0을
  반환했다면 빈 리스트가 출력됩니다.
  옵션은 [Node.js](https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback)의
  options 값을 그대로 따릅니다.
- `process/spawn ((명령 인자 ...) 옵션) -> (ID)` -
  프로세스를 실행하고 바로 ID를 반환합니다. 이 ID는 stdout에 이벤트를 걸거나 stdin으로
  출력하는데 쓰입니다. `process/spawn`은 꼭 `io/on`을 사용해야 합니다.
  옵션은 [Node.js](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options)의
  options 값을 그대로 따릅니다.
- `process/writeStdin (ID 데이터) -> ()` - 해당 프로세스의 stdin에 데이터를 넣습니다.
- `process/onStdout (ID) -> (데이터)` - 해당 프로세스의 stdout에서 나오는 데이터를
  수신합니다. 프로세스가 닫히면 데이터가 `()`으로 콜백이 한번 호출됩니다.
- `process/onStderr (ID) -> (데이터)` - 해당 프로세스의 stderr에서 나오는 데이터를
  수신합니다. 프로세스가 닫히면 데이터가 `()`으로 콜백이 한번 호출됩니다.
- `process/onClose (ID) -> (코드)` - 해당 프로세스가 종료되면 호출됩니다.
- `process/kill (ID 시그널) -> ()` - 해당 프로세스에 kill 신호를 보냅니다. 시그널은
  지정되지 않으면 `SIGTERM`이 기본값으로 지정됩니다.

```scheme
(io-on "laptop:process/spawn" '(("dbus-monitor" "--session")) (lambda (process)
  (io-on "laptop:process/onStdout" process (lambda (data)
    (display data)
  ))
  (io-on "laptop:process/onClose" process (lambda (code signal)
    (display "Closed ")
    (display code)
    (display signal)
    (newline)
  ))
))
```

### r6rs-async-io-remote
다른 프로세스 (명령 프롬프트 등등)에서 프로그램으로 이벤트를 보낼 수 있게 해줍니다.
`npm install -g r6rs-async-io-remote`로 명령줄 프로그램을 설치해야 사용할 수 있습니다.

명령 프롬프트에서 `r6rs-remote <이벤트 이름> <인자 ...>`를 통해 이벤트를 보낼 수 있습니다.

- `remote/start () -> ()` - IPC 서버를 시작합니다. `remote/listen`을 시작하기 전에
  한번 호출해야 합니다. 콜백이 호출되지 않으므로 유의해 주세요.
- `remote/listen 이벤트 -> (인자 ...)` - 해당 이벤트를 수신합니다. `r6rs-remote`를
  통해 보내진 이벤트를 수신할 수 있게 해줍니다.

```
(io-exec "laptop:remote/start" '())
(io-on "laptop:remote/listen" "test" (lambda args
  (display args)
  (newline)
))
```

### r6rs-async-io-wiring-pi
라즈베리 파이의 GPIO 단자를 제어할 수 있게 해줍니다.
[WiringPi](http://wiringpi.com/)를 통해 제어합니다.
이 패키지는 wiring-pi 패키지의 wrapper입니다; 좀 더 자세한 사항은
[API 문서](https://github.com/eugeneware/wiring-pi/blob/master/DOCUMENTATION.md#apis)를
참조해 주세요.

**이 패키지를 사용하려면 클라이언트 노드를 루트 권한으로 실행해야 합니다.**

- `wiringPi/setup (mode) -> ()` - WiringPi를 초기화합니다. 모드는 wpi, gpio, sys, phys
  중 하나입니다. 보통 `wpi`가 권장됩니다.
- `wiringPi/pinMode (pin mode) -> ()` - 해당 핀의 모드를 설정합니다. 모드는
  input, output, pwmOutput, gpioClock, softPwmOutput, softToneOutput중 하나입니다.
- `wiringPi/pullUpDnControl (pin pud) -> ()` - 라즈베리 파이에는 50k옴의 풀 업/풀 다운
  저항이 내장되어 있습니다. 이 명령은 해당 핀의 풀 업/풀 다운 저항을 설정합니다. pud는
  off, down, up중 하나입니다.
- `wiringPi/digitalRead (pin) -> (boolean)` - 해당 핀의 값을 읽습니다.
- `wiringPi/digitalWrite (pin value) -> ()` - 해당 핀의 값을 씁니다. value는 `#t`나
  `#f`중 하나입니다.
- `wiringPi/pwmWrite (pin value) -> ()` - 해당 PWM 핀의 값을 씁니다. value는
  0에서 1024 사이의 정수입니다. 라즈베리 파이에는 핀 1 (물리 핀 12)만이 PWM을 지원합니다.
- `wiringPi/analogRead (pin) -> (value)` - 해당 핀의 아날로그 값을 읽습니다. 라즈베리
  파이에서는 아날로그 핀을 지원하지 않아 사용할 수 없습니다.
- `wiringPi/analogWrite (pin value) -> ()` - 해당 핀의 아날로그 값을 씁니다. 라즈베리
  파이에서는 아날로그 핀을 지원하지 않아 사용할 수 없습니다.
- `wiringPi/pulseIn (pin state) -> (length)` - 해당 핀에서 발생하는 펄스를 읽습니다.
  state와 같은 입력이 발생해서 다시 돌아갈 때 까지의 시간이 마이크로초로 반환됩니다.
- `wiringPi/isr (pin edgeType) -> (delta)` - 해당 핀에 인터럽트를 설정합니다.
  edgeType는 falling, rising, both, setup중 하나입니다.
- `wiringPi/pwmToneWrite (pin freq) -> ()` - 해당 PWM 핀에 지정한 주파수를 씁니다.
- `wiringPi/softPwmCreate (pin value range) -> ()` - 해당 핀에 소프트웨어 PWM을
  시작합니다. value는 현재 값, range는 최대 값입니다.
- `wiringPi/softPwmWrite (pin value) -> ()` - 소프트웨어 PWM에 값을 씁니다.
- `wiringPi/softPwmStop (pin) -> ()` - 소프트웨어 PWM을 멈춥니다.
- `wiringPi/softToneCreate (pin) -> ()` - 해당 핀에 소프트웨어 톤을 시작합니다.
- `wiringPi/softToneWrite (pin value) -> ()` - 소프트웨어 톤에 값을 씁니다.
- `wiringPi/softToneStop (pin) -> ()` - 소프트웨어 톤을 멈춥니다.

### 패키지 만들기
다른 장치에 전혀 구애받지 않고 직접 패키지를 만들 수도 있습니다. 해당 패키지는 장치 하단의
I/O 패키지에 등록한 경우에만 작동됩니다.

패키지를 만드는 과정은 간단합니다. `r6rs-async-io`와 `r6rs`를 설치하고
원하는 메소드를 Library에 넣으면 됩니다. 다음 코드를 참조해 주세요.

[r6rs-async-io-cron 소스코드](https://github.com/yoo2001818/r6rs-async-io-library/blob/master/r6rs-async-io-cron/src/index.js)

각 함수에 주어지는 params는 Scheme 환경 상에서 보낸 매개변수입니다. `r6rs` 패키지의
`toObject`, `fromAssoc` 함수를 사용해 자바스크립트 객체로 바꿀 수 있습니다.

`callback(array, finished)`는 함수 실행이 완료되면 보낼 함수입니다. 호출하면 Scheme
환경의 콜백이 실행됩니다. `array`는 Scheme쪽에 보낼 매개변수 목록입니다. 그냥 자바스크립트 배열을
보내면 알아서 변환해서 보내줍니다. `finished`는 함수 실행이 완전히 끝나서 다시는 callback이
호출되지 않을 경우 `true`를 보내면 해당 콜백을 큐에서 지워 리소스를 해제합니다.

각 메소드 함수는 이벤트가 취소될 때 호출되는 함수를 리턴할 수 있습니다. 여기서 이벤트 리스너를
해제하는 등 해제 작업을 하면 됩니다. 이 취소 함수는 `io-exec`의 실행이 끝나거나, `io-cancel`로
직접 취소하거나 인터프리터가 다시 시작될 때 호출됩니다.

패키지를 완성했으면 그대로 [npm](http://npmjs.com/)에 올려 사용할 수 있습니다.
`package.json`을 수정하고 `npm publish`를 사용해 패키지를 올리면 됩니다.

패키지를 npm에 올린 뒤에는 장치 하단의 I/O 패키지에 등록하면 됩니다.

## 장치 레퍼런스
IoTLogic에서는 PC (Node.js)가 아닌 다른 종류의 장치도 지원합니다. 하지만 이 장치들은
내부적으로 Scheme을 실행하지 않아 서버에서 동작하게 되며 미리 정의된 동작만 수행할 수
있습니다.

### 웹 리모컨
![웹 리모컨](./img/webRemote.png)

웹 리모컨 장치는 웹에서 직접 누를 수 있는 버튼과 텍스트 필드를 제공해서 간편하게 장치를
원격에서도 제어할 수 있게 해줍니다.

각각의 항목에는 그룹과 이름이 존재합니다. 같은 그룹의 항목은 같은 줄에서 나타납니다.

- `button (group name text) -> ()` - 버튼을 생성합니다. 이미 생성된 경우, 내용을
  바꿉니다.
- `text (group name text) -> ()` - 텍스트 필드를 생성합니다. 이미 생성된 경우, 내용을
  바꿉니다.
- `remove (group name) -> ()` - 지정된 항목을 지웁니다.
- `listen (group name) -> ()` - 지정된 항목이 실행되면 콜백을 실행합니다.

```scheme
(io-exec 'webRemote:text '(light state "불 꺼짐"))
(io-exec 'webRemote:button '(light on "불 켜기"))

(io-on 'webRemote:listen '(light on) (lambda ()
  (io-exec 'webRemote:text '(light state "불 켜짐"))
  (io-exec 'webRemote:remove '(light on))
))
```

#### REST API
웹 리모컨은 REST API를 통해서도 접근할 수 있습니다.

- `GET /api/devices/<ID>/remote` - 현재 리모컨 상태를 JSON으로 출력합니다.
- `POST /api/devices/<ID>/remote/<group>/<name>` - 해당 항목을 실행합니다.

# 설치하기

## 클라이언트 노드 설치하기
<a name="clientInstallHelp"></a>

PC에 클라이언트 노드를 설치하려면 먼저 Node.js를 설치해야 합니다. Node.js는
[여기서](https://nodejs.org/) 설치할 수 있습니다.

Node.js 설치를 마치면 명령 프롬프트나 터미널을 열고 `npm install -g iotlogic-core`를
입력해주세요.

설치가 완료되면 설정 파일을 보관할 디렉토리로 이동해서 `IoTLogic-config`를 입력하면
설정 마법사가 나타납니다. 만약 직접 사용할 서버를 지정하고 싶다면 `IoTLogic-config <주소>`
로 설정할 수 있습니다.

![설정 마법사](./img/pcNode.png)

설정 마법사를 마친 뒤에는 설정 마법사를 실행했던 디렉토리로 이동해서 `IoTLogic`을 실행하면
노드 접속이 완료됩니다. 만약 부팅할 때마다 자동으로 시작되게 하려면 `cron`이나
`시작 프로그램` 등을 사용할 수 있습니다.

## 메시징 서버 설치하기
메시징 서버는 NPM에 올라가 있지 않아 [저장소](https://github.com/yoo2001818/IoTLogic-server)를
직접 클론해야 합니다. 클론한 뒤 `npm install`으로 의존성을 설치하고, `config` 디렉토리에
있는 설정 파일들의 뒤에서 `.example.js`를 `.js`로 바꾼 뒤 내용을 채워넣고, `gulp`를
설치하고 실행해서 프로젝트를 빌드한 뒤 `node index.js`를 입력하면 서버가 시작됩니다.

사용할 데이터베이스 종류에 맞춰 데이터베이스 모듈도 따로 설치해야 합니다.
- PostgreSQL: `pg`, `pg-hstore`
- MySQL / MariaDB: `mysql`
- SQLite3: `sqlite3`
- MSSQL: `tedious`

# 예제

## 원격으로 컴퓨터 종료하기

- webRemote - 웹 리모컨 장치
- computer - PC (Node.js), `r6rs-async-io-process`

```scheme
(io-exec 'webRemote:button '(computer off "컴퓨터 끄기"))

(io-on 'webRemote:listen '(computer off) (lambda ()
  (io-exec 'computer:process/exec "shutdown -s -t 0")
))
```

## 버튼 눌리면 LED 토글하고 알림 보내기

- rpi - 라즈베리 파이 (Node.js), `r6rs-async-io-wiring-pi`
- computer - PC (Node.js), `r6rs-async-io-node-notifier`

```scheme
(define INPUT-PIN 15)
(define LED-PIN 16)

(io-exec 'rpi:wiringPi/setup '(wpi))
(io-exec 'rpi:wiringPi/pinMode `(,INPUT-PIN input))
(io-exec 'rpi:wiringPi/pinMode `(,LED-PIN output))

; Turn off the LED for initialization
(io-exec 'rpi:wiringPi/digitalWrite (list LED-PIN #f))

(let ((pressed #f) (ledOn #f))
  (io-on 'rpi:timer 50 (lambda ()
    (io-exec 'rpi:wiringPi/digitalRead (list INPUT-PIN) (lambda (status)
      (if (not (eq? pressed status)) (begin
        (set! pressed status)
        (if status
          (begin
            (set! ledOn (not ledOn))
            (io-exec 'rpi:wiringPi/digitalWrite (list LED-PIN ledOn))
            (io-exec 'computer:notifier/send
              (if ledOn "LED turned on" "LED turned off"))
          )
        )
      ))
    ))
  ))
)

```

# 라이센스

```
The MIT License (MIT)

Copyright (c) 2016 Duknam Yoo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
