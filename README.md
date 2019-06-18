# Timeinator

> NativeScript-Vue Time tracking application

## TODO list
 - [X] Display timers on task component
 - [X] Already Running Timer initialization
 - [X] Register User from app
 - [X] Redo the task component beautify
 - [X] Add a task owner (creator)
 - [X] Show an alert on task component if other people are working on this task at the same time
 - [ ] Refactor code according to this : https://medium.com/@zitko/structuring-a-vue-project-authentication-87032e5bfe16 to implement 401 interceptor to auto refresh token
 - [ ] Refactor to rename companies to group
 - [ ] Password recovery
 - [ ] Add a theme option to choose a theme and persist preference in appSettings
 - [ ] About page/alert displays informations on api and developpers
 - [ ] Refactor CSS to scope only the component specific CSS and do not repeat yourself
 - [ ] Clean and refactor code (delete debug outputs, optimize, don't do unnecessary things)
 - [ ] Loader and disable buttons on api call processing on all components
 - [ ] Add task store|update
 - [ ] Inspire with : https://pendulums.io/img/features/projects.png to remake the groups view and the task view with masonry style one color = one company

### Gitlab integration (as an additional issues (tasks) provider additionaly to timeinator data)
 - [ ] Gitlab API implementation
 - [ ] Companies becomes groups (gitlab groups)
 - [ ] Gitlab account login (OAuth / Laravel Passport)
 - [ ] Populate timeinator database with gitlab issues and groups (findOrCreate())
 - [ ] Show assignee on a task (issue)

