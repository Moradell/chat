# Chat
### Проект еще в работе, но основной функционал уже готов

### В проекте использются:
* HTML5 && CSS3
* jS  
* БЭМ
* lowDB
* WebSocket

### Что реализованно в приложении на данный момент:

1. Открытое приложение встречает нас экраном логина

![chat_3](https://user-images.githubusercontent.com/29666697/115400932-29983100-a22d-11eb-9a12-2d52848bcc04.png)

2. Если на сервере есть другие пользователи, то когда произойдет авторизация нового пользователя, они получат соответствующее уведомление. При поподании на основной экран можно дабавить аватар (Путем дропа картинки в указанную область)

![chat_2](https://user-images.githubusercontent.com/29666697/115401253-8bf13180-a22d-11eb-99b5-174c204029e5.png)

3. Реализована отправка сообщений

![chat_1](https://user-images.githubusercontent.com/29666697/115401578-e4c0ca00-a22d-11eb-8190-4a3212b9009b.png)


### В процессе работы:

* исправления некоторых багов в работе базы данных
* корректное размещение сообщений (Сообщения активного пользователя с одной стороны, все остальные - с другой)
* при вводе логина, который уже есть в бд, просматривать был ли установлен аватар в предыдущие разы и если да, то автоматически его возвращать
